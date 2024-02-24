import * as vscode from "vscode";
import { Chat } from "../../shared/types";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatModelResponse, ChatModelRequest } from "./ChatModel";
import { ChatEditor } from "../Chat/ChatEditor";

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
    let persona = this.personaDataManager.getPersona(chat.personaId);
    if (!persona) {
      // Get default persona
      persona = this.personaDataManager.getDefaultPersona();

      // Save default persona as the chat's persona
      await this.chatEditor.changePersona(chat, persona.id);
      vscode.window.showWarningMessage(
        "Persona for chat not found. Using default persona.",
      );
    }

    const request: ChatModelRequest = {
      chat,
      persona,
    };
    return await this.settingsProvider.getChatModel().chat(request);
  }
}
