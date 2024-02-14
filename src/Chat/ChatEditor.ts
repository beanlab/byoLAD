import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ChatDataManager } from "./ChatDataManager";

export class ChatEditor {
  private readonly chatDataManager: ChatDataManager;
  private readonly chatWebviewProvider: ChatWebviewProvider;

  constructor(
    chatDataManager: ChatDataManager,
    chatWebviewProvider: ChatWebviewProvider,
  ) {
    this.chatDataManager = chatDataManager;
    this.chatWebviewProvider = chatWebviewProvider;
  }
}
