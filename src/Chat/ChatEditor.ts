import { Chat, ChatMessage, ChatRole, MessageBlock } from "../../shared/types";
import { stringToMessageBlocks } from "../../shared/utils/messageBlockHelpers";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";
import { ChatDataManager } from "./ChatDataManager";

/**
 * Handles editing chat content, performing corresponding updates to the ChatDataManager and ChatWebviewProvider.
 */
export class ChatEditor {
  private readonly chatDataManager: ChatDataManager;
  private readonly extensionToWebviewMessageSender: ExtensionToWebviewMessageSender;

  public constructor(
    chatDataManager: ChatDataManager,
    extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  ) {
    this.chatDataManager = chatDataManager;
    this.extensionToWebviewMessageSender = extensionToWebviewMessageSender;
  }

  /**
   * Appends MessageBlocks to the given chat with the given role.
   * Adds to the last message if it has the same role or creates a new message.
   * Performs the necessary updates to the chat in the ChatDataManager.
   * If updateWebview is true, the webview will be updated after appending the message blocks.
   * @param chat Chat to update.
   * @param role ChatRole of the given content.
   * @param messageBlocks MessageBlocks to append to the chat.
   * @param updateWebview Whether to update the webview after appending the message blocks.
   */
  public async appendMessageBlocks(
    chat: Chat,
    role: ChatRole,
    messageBlocks: MessageBlock[],
    updateWebview: boolean = true,
  ) {
    const lastMessage: ChatMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage && lastMessage.role === role) {
      lastMessage.content = lastMessage.content.concat(messageBlocks);
    } else {
      chat.messages.push({ role: role, content: messageBlocks } as ChatMessage);
    }
    this.chatDataManager.updateChat(chat);

    if (updateWebview) {
      await this.extensionToWebviewMessageSender.refresh();
    }
  }

  /**
   * Appends MessageBlocks (parsed from the given Markdown) to the given chat with the given role.
   * Adds to the last message if it has the same role or creates a new message.
   * Performs the necessary updates to the chat in the ChatDataManager.
   * If updateWebview is true, the webview will be updated after appending the message blocks.
   * @param chat Chat to update.
   * @param role ChatRole of the given content.
   * @param markdown Markdown content be parsed and appended to the chat.
   * @param updateWebview Whether to update the webview after appending the message blocks.
   */
  public async appendMarkdown(
    chat: Chat,
    role: ChatRole,
    markdown: string,
    updateWebview: boolean = true,
  ) {
    const messageBlocks = stringToMessageBlocks(markdown);
    await this.appendMessageBlocks(chat, role, messageBlocks, updateWebview);
  }

  /**
   * Saves the entire given chat to the ChatDataManager, overwriting the chat with the same ID.
   * If updateWebview is true, the webview will be updated after appending the message blocks.
   * @param updatedChat Chat whose content will be set to the chat with the given ID.
   * @param updateWebview Whether to update the webview after setting the chat content.
   */
  public async overwriteChatContent(chat: Chat, updateWebview: boolean = true) {
    this.chatDataManager.updateChat(chat);
    if (updateWebview) {
      await this.extensionToWebviewMessageSender.refresh();
      await this.extensionToWebviewMessageSender.updateIsMessageLoading(false);
    }
  }
}
