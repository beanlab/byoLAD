import * as vscode from "vscode";
import { Chat } from "../../shared/types";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatModelResponse, ChatModelRequest } from "./ChatModel";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLM_MESSAGE_FORMATTING_INSTRUCTION } from "../commands/constants";

export class LLMApiRequestSender {
  private readonly settingsProvider: SettingsProvider;
  private readonly personaDataManager: PersonaDataManager;
  private readonly chatEditor: ChatEditor;

  constructor(
    settingsProvider: SettingsProvider,
    personaManager: PersonaDataManager,
    chatEditor: ChatEditor,
  ) {
    this.settingsProvider = settingsProvider;
    this.personaDataManager = personaManager;
    this.chatEditor = chatEditor;
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
    return await this.settingsProvider.getChatModel().chat(request);
  }
}
