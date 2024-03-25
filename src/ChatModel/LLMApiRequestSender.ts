import * as vscode from "vscode";

import { Chat, ModelProvider, Persona } from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLM_MESSAGE_FORMATTING_INSTRUCTION } from "../commands/constants";
import { SecretsProvider } from "../helpers/SecretsProvider";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";
import { ChatModel, ChatModelRequest, ChatModelResponse } from "./ChatModel";
import { GPTChatModel } from "./Implementations/GPTChatModel";
import { PaLMChatModel } from "./Implementations/PaLMChatModel";

export class LLMApiRequestSender {
  private readonly personaDataManager: PersonaDataManager;
  private readonly chatEditor: ChatEditor;
  private readonly secretsProvider: SecretsProvider;
  private readonly extensionToWebviewMessageSender: ExtensionToWebviewMessageSender;

  constructor(
    personaManager: PersonaDataManager,
    chatEditor: ChatEditor,
    secretsProvider: SecretsProvider,
    extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  ) {
    this.personaDataManager = personaManager;
    this.chatEditor = chatEditor;
    this.secretsProvider = secretsProvider;
    this.extensionToWebviewMessageSender = extensionToWebviewMessageSender;
  }

  /**
   * Send chat request to the chat's persona's model provider and return the response.
   * @param chat Chat to send an API request for.
   */
  public async sendChatRequest(chat: Chat): Promise<ChatModelResponse> {
    this.extensionToWebviewMessageSender.updateIsMessageLoading(true);

    const persona = await this.getChatPersona(chat);

    const apiKey = await this.secretsProvider.getApiKey(persona.modelProvider);
    if (apiKey) {
      const chatModel: ChatModel | null = await this.getChatModel(
        persona.modelProvider,
        persona.modelId,
        apiKey,
      );

      if (chatModel) {
        return await chatModel.chat({
          chat: chat,
          persona: persona,
          responseFormattingInstruction: LLM_MESSAGE_FORMATTING_INSTRUCTION,
        } as ChatModelRequest);
      }
    } else {
      showErrorWithAction(persona.modelProvider);
    }
    return {
      success: false,
      errorMessage: `Error configuring ${persona.modelProvider} model (used in persona "${persona.name}").`,
    };
  }

  /**
   * Get persona for chat. If persona is not found, use default persona and save it as the chat's persona.
   */
  private async getChatPersona(chat: Chat): Promise<Persona> {
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
    return persona;
  }

  /**
   * Get chat model based on model provider.
   * @returns ChatModel or null if given model provider has no designated ChatModel implementation
   */
  private async getChatModel(
    modelProvider: ModelProvider,
    modelId: string,
    apiKey: string,
  ): Promise<ChatModel | null> {
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

async function showErrorWithAction(modelProvider: ModelProvider) {
  const errorMessage = `No ${modelProvider} API key found. Change persona's provider or provide an API key.`;
  const action = "Set API Key";
  const result = await vscode.window.showErrorMessage(errorMessage, action);
  if (result === action) {
    await vscode.commands.executeCommand(
      "vscode-byolad.manageApiKeys",
      modelProvider,
    );
  }
}
