import * as vscode from "vscode";
import { Chat, ModelProvider } from "../../shared/types";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { ChatModelResponse, ChatModelRequest, ChatModel } from "./ChatModel";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLM_MESSAGE_FORMATTING_INSTRUCTION } from "../commands/constants";
import { GPTChatModel } from "./Implementations/GPTChatModel";
import { PaLMChatModel } from "./Implementations/PaLMChatModel";
import { SecretsProvider } from "../helpers/SecretsProvider";
import { getAndStoreUserApiKey } from "../helpers/getAndStoreUserApiKey";

export class LLMApiRequestSender {
  private readonly personaDataManager: PersonaDataManager;
  private readonly chatEditor: ChatEditor;
  private readonly secretsProvider: SecretsProvider;

  constructor(
    personaManager: PersonaDataManager,
    chatEditor: ChatEditor,
    secretsProvider: SecretsProvider,
  ) {
    this.personaDataManager = personaManager;
    this.chatEditor = chatEditor;
    this.secretsProvider = secretsProvider;
  }

  public async sendChatRequest(chat: Chat): Promise<ChatModelResponse> {
    let persona = this.personaDataManager.getPersonaById(chat.personaId);
    if (!persona) {
      // Get default persona
      persona = this.personaDataManager.getDefaultPersona();
      chat.personaId = persona.id;
      // Save default persona as the chat's persona
      await this.chatEditor.overwriteChatData(chat);
      vscode.window.showWarningMessage(
        "Persona for chat not found. Using default persona.",
      );
    }

    const request: ChatModelRequest = {
      chat,
      persona,
      responseFormattingInstruction: LLM_MESSAGE_FORMATTING_INSTRUCTION,
    };

    const chatModel: ChatModel | null = await this.getChatModel(
      persona.modelProvider,
      persona.modelId,
    );

    if (!chatModel) {
      return {
        success: false,
        errorMessage: `No API key set for ${persona.modelProvider} (used in persona ${persona.name}).`,
      };
    } else {
      return await chatModel.chat(request);
    }
  }

  private async getChatModel(
    modelProvider: ModelProvider,
    modelId: string,
  ): Promise<ChatModel | null> {
    let apiKey: string | undefined =
      await this.secretsProvider.getApiKey(modelProvider);

    if (!apiKey) {
      apiKey = await getAndStoreUserApiKey(modelProvider, this.secretsProvider);
    }
    if (!apiKey) {
      return null;
    }

    switch (modelProvider) {
      case ModelProvider.OpenAI:
        return new GPTChatModel(modelId, apiKey);
      case ModelProvider.Google:
        return new PaLMChatModel(modelId, apiKey);
      default: {
        const _exhaustiveCheck: never = modelProvider;
        throw new Error(`Unhandled ModelProvider: ${_exhaustiveCheck}`);
      }
    }
  }
}
