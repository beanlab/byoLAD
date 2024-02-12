import { ExtensionContext } from "vscode";
import * as constants from "../commands/constants";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { setHasActiveChatWhenClauseState } from "../helpers";
import { Chat, ChatMessage } from "../../shared/types";

/**
 * Manages the chat history and the active chat in the VS Code workspace state.
 */
export class ChatManager {
  private readonly context: ExtensionContext;
  private readonly settingsProvider: SettingsProvider;

  constructor(context: ExtensionContext, settingsProvider: SettingsProvider) {
    this.context = context;
    this.settingsProvider = settingsProvider;
  }

  get chats(): Chat[] {
    return this.context.workspaceState.get<Chat[]>(constants.CHATS_KEY) || [];
  }

  set chats(value: Chat[]) {
    const ids = value.map((chat) => chat.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate ids");
    }
    this.context.workspaceState.update(constants.CHATS_KEY, value);
  }

  get chatIds(): number[] {
    return (
      this.context.workspaceState.get<number[]>(constants.CHAT_IDS_KEY) || []
    );
  }

  set chatIds(value: number[]) {
    if (new Set(value).size !== value.length) {
      throw new Error("Duplicate ids");
    }
    this.context.workspaceState.update(constants.CHAT_IDS_KEY, value);
  }

  get activeChatId(): number | null {
    return (
      this.context.workspaceState.get<number>(constants.ACTIVE_CHAT_ID_KEY) ||
      null
    );
  }

  set activeChatId(value: number | null) {
    if (!value) {
      setHasActiveChatWhenClauseState(false);
    } else if (!this.chatIds.includes(value)) {
      setHasActiveChatWhenClauseState(false);
      throw new Error("Chat ID does not exist");
    } else {
      setHasActiveChatWhenClauseState(true);
    }

    this.context.workspaceState.update(constants.ACTIVE_CHAT_ID_KEY, value);
  }

  get nextId(): number {
    return this.context.workspaceState.get<number>(constants.NEXT_ID_KEY) || 1;
  }

  set nextId(value: number) {
    this.context.workspaceState.update(constants.NEXT_ID_KEY, value);
  }

  getChat(id: number): Chat | undefined {
    return this.chats.find((chat) => chat.id === id);
  }

  getActiveChat(): Chat | null {
    if (!this.activeChatId) {
      return null;
    }
    return this.getChat(this.activeChatId) || null;
  }

  /**
   *
   * @returns An array of chat previews, each containing the chat id and name.
   */
  getChatPreviews(): {
    id: number;
    name: string;
  }[] {
    return this.chats.map((chat) => {
      return {
        id: chat.id,
        name: chat.name,
      };
    });
  }

  /**
   * Adds a chat to the chat history and sets it as the active chat.
   * Throws an error if a chat with the same id already exists.
   *
   * @param name Chat name
   * @param messages Chat messages
   * @returns The created chat
   */
  startChat(name: string, messages?: ChatMessage[]): Chat {
    const chat = this.createChat(name, messages);
    // this.chats = [...this.chats, chat];
    this.chats.push(chat);
    try {
      if (!this.chatIds.includes(chat.id)) {
        this.chatIds = [...this.chatIds, chat.id];
      }
    } catch (error) {
      // Rollback the first operation
      this.chats = this.chats.filter((c) => c.id !== chat.id);
      throw error;
    }
    this.activeChatId = chat.id;
    return chat;
  }

  /**
   * Returns a new Chat object with the given name and messages.
   * Increments the next ID to be used in a chat.
   * Note: Does not add the chat to the chat history.
   *
   * @param name Chat name
   * @param messages Chat messages
   * @returns A new Chat object
   */
  private createChat(name: string, messages?: ChatMessage[]): Chat {
    const newId = this.nextId;
    this.nextId = newId + 1;
    const chat: Chat = {
      id: newId,
      name,
      messages: messages ?? [],
      contextInstruction:
        this.settingsProvider.getBasePromptInstruction() +
        constants.LLM_MESSAGE_FORMATTING_INSTRUCTION,
      title: "Empty Chat",
    };
    return chat;
  }

  /**
   * Updates the chat with the given id.
   * Throws an error if no chat with the given id exists.
   *
   * @param updatedChat
   */
  updateChat(updatedChat: Chat): void {
    if (!this.chats.some((convo) => convo.id === updatedChat.id)) {
      throw new Error("No chat with id exists");
    }
    this.chats = this.chats.map((convo) => {
      if (convo.id === updatedChat.id) {
        return updatedChat;
      }
      return convo;
    });
  }

  /**
   * Deletes the chat with the given id from the chat history if it exists.
   *
   * @param id
   */
  deleteChat(id: number) {
    const oldChats = this.chats;
    this.chats = this.chats.filter((chat) => chat.id !== id);
    try {
      if (this.chatIds.includes(id)) {
        this.chatIds = this.chatIds.filter((i) => i !== id);
      }
    } catch (error) {
      // Rollback the first operation
      this.chats = oldChats;
      throw error;
    }
  }

  /**
   * Deletes all chats from the chat history.
   */
  clearAllChats() {
    this.chats = [];
    this.chatIds = [];
    this.activeChatId = null;
  }
}
