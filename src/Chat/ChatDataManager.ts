import { ExtensionContext } from "vscode";

import { Chat, ChatMessage } from "../../shared/types";
import { setHasActiveChatWhenClauseState } from "../helpers";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { PersonaDataManager } from "../Persona/PersonaDataManager";

/**
 * Manages the chat history and the active chat in the VS Code workspace state.
 */
export class ChatDataManager {
  private readonly CHATS_KEY = "chats";
  private readonly CHAT_IDS_KEY = "chatIds";
  private readonly ACTIVE_CHAT_ID_KEY = "activeChatId";
  private readonly NEXT_ID_KEY = "nextId";
  private readonly context: ExtensionContext;
  private readonly settingsProvider: SettingsProvider;
  private readonly personaDataManager: PersonaDataManager;

  constructor(
    context: ExtensionContext,
    settingsProvider: SettingsProvider,
    personaDataManager: PersonaDataManager,
  ) {
    this.context = context;
    this.settingsProvider = settingsProvider;
    this.personaDataManager = personaDataManager;
  }

  /**
   * Cleans up all stored data, removing keys from the workspace state.
   */
  clearData() {
    this.context.workspaceState.update(this.ACTIVE_CHAT_ID_KEY, undefined);
    this.context.workspaceState.update(this.CHATS_KEY, undefined);
    this.context.workspaceState.update(this.CHAT_IDS_KEY, undefined);
    this.context.workspaceState.update(this.NEXT_ID_KEY, undefined);
  }

  get chats(): Chat[] {
    return this.context.workspaceState.get<Chat[]>(this.CHATS_KEY) || [];
  }

  set chats(value: Chat[]) {
    const ids = value.map((chat) => chat.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate ids");
    }
    this.context.workspaceState.update(this.CHATS_KEY, value);
  }

  get chatIds(): number[] {
    return this.context.workspaceState.get<number[]>(this.CHAT_IDS_KEY) || [];
  }

  set chatIds(value: number[]) {
    if (new Set(value).size !== value.length) {
      throw new Error("Duplicate Chat IDs");
    }
    this.context.workspaceState.update(this.CHAT_IDS_KEY, value);
  }

  get activeChatId(): number | null {
    return (
      this.context.workspaceState.get<number>(this.ACTIVE_CHAT_ID_KEY) || null
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

    this.context.workspaceState.update(this.ACTIVE_CHAT_ID_KEY, value);
  }

  get nextId(): number {
    return this.context.workspaceState.get<number>(this.NEXT_ID_KEY) || 1;
  }

  set nextId(value: number) {
    this.context.workspaceState.update(this.NEXT_ID_KEY, value);
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
   * Adds a chat to the chat history and sets it as the active chat.
   * Throws an error if a chat with the same id already exists.
   *
   * @param messages Chat messages
   * @returns The created chat
   */
  startChat(messages?: ChatMessage[]): Chat {
    const chat = this.createChat(messages);
    // Assigning the array directly to `this.chats` handles cases where the stored chats are
    // undefined, instead of using `this.chats.push(chat)`
    this.chats = [...this.chats, chat];
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
  private createChat(messages?: ChatMessage[]): Chat {
    const newId = this.nextId;
    this.nextId = newId + 1;
    const chat: Chat = {
      id: newId,
      messages: messages ?? [],
      personaId: this.personaDataManager.defaultPersonaId,
      title: "Empty Chat",
      tags: [],
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
    this.chats = this.chats.map((chat) => {
      if (chat.id === updatedChat.id) {
        return updatedChat;
      }
      return chat;
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
}
