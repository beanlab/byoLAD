import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import {
  Chat,
  ChatRole,
  ChatMessageFinishReason,
  ChatMessage,
  MessageBlock,
  CodeBlock,
  TextBlock,
} from "../../../shared/types";
import { ChatModel, ChatModelRequest, ChatModelResponse } from "../ChatModel";
import { NO_RESPONSE_ERROR_MESSAGE } from "../../commands/constants";
import { messageBlocksToString } from "../../../shared/utils/messageBlockHelpers";
import { getExampleMessages } from "../../Chat/getExampleMessages";

interface PaLMPrompt {
  context?: string;
  examples?: PaLMExample[];
  messages: PalMMessage[];
}

interface PalMMessage {
  author?: ChatRole;
  content: string;
}

interface PaLMContentFilter {
  reason: PaLMContentBlockedReason;
  message?: string;
}

interface PaLMExample {
  input: PalMMessage;
  output: PalMMessage;
}

enum PaLMContentBlockedReason {
  BLOCKED_REASON_UNSPECIFIED = "BLOCKED_REASON_UNSPECIFIED",
  SAFETY = "SAFETY",
  OTHER = "OTHER",
}

export class PaLMChatModel implements ChatModel {
  private client: DiscussServiceClient;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.client = new DiscussServiceClient({
      authClient: new GoogleAuth().fromAPIKey(apiKey),
    });
    this.model = `models/${model}`;
  }

  async chat(request: ChatModelRequest): Promise<ChatModelResponse> {
    return await this.client
      .generateMessage({
        model: this.model,
        prompt: this.convertToPaLMPrompt(request.chat),
      })
      .then((response) => {
        const candidates: PalMMessage[] | null = response[0]
          .candidates as PalMMessage[];
        const filters: PaLMContentFilter[] | null = response[0]
          .filters as PaLMContentFilter[];
        if (candidates && candidates.length > 0) {
          return {
            success: true,
            markdown: candidates[0].content,
            chat: request.chat,
          } as ChatModelResponse;
        } else {
          if (filters && filters.length > 0) {
            return {
              success: false,
              errorMessage: this.getFilterErrorMessage(filters),
              finish_reason: ChatMessageFinishReason.ContentFilter,
              chat: request.chat,
            } as ChatModelResponse;
          } else {
            return {
              success: false,
              errorMessage: NO_RESPONSE_ERROR_MESSAGE,
              chat: request.chat,
            } as ChatModelResponse;
          }
        }
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: error.message,
          chat: request.chat,
        } as ChatModelResponse;
      });
  }

  convertToPaLMPrompt(chat: Chat): PaLMPrompt {
    if (chat.contextInstruction) {
      return {
        context: chat.contextInstruction,
        examples: this.getFormattedExamples(),
        messages: this.convertToPaLMMessages(chat.messages),
      };
    } else {
      return {
        examples: this.getFormattedExamples(),
        messages: this.convertToPaLMMessages(chat.messages),
      };
    }
  }

  /**
   * Returns one string with all the filter reasons and messages.
   * @param filters
   * @returns One error message string.
   */
  getFilterErrorMessage(filters: PaLMContentFilter[]): string {
    let filterErrorMessage = "Failed Request (content filtered): ";
    let filterMessage = "";
    for (const filter of filters) {
      filterMessage = filter.message ? filter.message : "no details";
      filterErrorMessage += `${filter.reason}: ${filterMessage}\n`;
      if (filter.reason == PaLMContentBlockedReason.OTHER && !filter.message) {
        filterErrorMessage += "- try shorter input";
      }
    }
    return filterErrorMessage;
  }

  /**
   * Converts an array of ChatMessages to an array of PaLMMessages.
   * Messages with role System are converted to User (PaLM only supports two roles).
   * Messages are combined if they have the same author.
   *
   * @param chatMessages Array of ChatMessages to be converted
   * @returns Array of PaLM messages
   */
  convertToPaLMMessages(chatMessages: ChatMessage[]): PalMMessage[] {
    // Add messages to the beginning of the chat history to provide examples/set the stage
    const introMessages: ChatMessage[] = getExampleMessages();

    const messages: ChatMessage[] = [...introMessages, ...chatMessages];

    // Convert system messages to user messages so that PaLM can handle it (only supports two authors)
    const messagesWithAcceptedAuthorship: ChatMessage[] = [];
    for (const message of messages) {
      if (message.role === ChatRole.System) {
        messagesWithAcceptedAuthorship.push({
          ...message,
          role: ChatRole.User,
        });
      } else {
        messagesWithAcceptedAuthorship.push(message);
      }
    }

    // Combine adjacent messages with the same author so that PaLM can handle it (only supports alternating authors)
    const mergedMessages: ChatMessage[] = [];
    for (const message of messagesWithAcceptedAuthorship) {
      if (
        mergedMessages.length > 0 &&
        mergedMessages[mergedMessages.length - 1].role === message.role
      ) {
        mergedMessages[mergedMessages.length - 1].content = [
          ...mergedMessages[mergedMessages.length - 1].content,
          ...message.content,
        ];
      } else {
        mergedMessages.push(message);
      }
    }

    return mergedMessages.map(
      (message) =>
        ({
          author: message.role,
          content: messageBlocksToString(message.content),
        }) as PalMMessage,
    );
  }

  getFormattedExamples(): PaLMExample[] {
    const inputContent: MessageBlock[] = [
      {
        type: "text",
        content: "Fix this code",
      } as TextBlock,
      {
        type: "code",
        language: "python",
        content: "def add(a, b): return a - b",
      } as CodeBlock,
    ];
    const outputContent: MessageBlock[] = [
      {
        type: "text",
        content: "The code was subtracting instead of adding.",
      } as TextBlock,
      {
        type: "code",
        language: "python",
        content: "def add(a, b): return a + b",
      } as CodeBlock,
    ];
    return [
      {
        input: {
          author: ChatRole.User,
          content: messageBlocksToString(inputContent),
        },
        output: {
          author: ChatRole.Assistant,
          content: messageBlocksToString(outputContent),
        },
      } as PaLMExample,
    ];
  }
}
