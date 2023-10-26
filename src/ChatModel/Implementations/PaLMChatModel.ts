import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import {
  ChatMessage,
  ChatMessageFinishReason,
  ChatRole,
  ChatModel,
  ChatModelRequest,
  ChatModelResponse,
  MessageBlock,
  CodeBlock,
  TextBlock,
} from "../ChatModel";
import { NO_RESPONSE_ERROR_MESSAGE } from "../../commands/constants";
import {
  messageBlocksToString,
  stringToMessageBlocks,
} from "../../Conversation/messageBlockHelpers";
import { Conversation } from "../ChatModel";

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
        temperature: 0.5,
        prompt: this.convertToPaLMPrompt(request.conversation),
      })
      .then((response) => {
        const candidates = response[0] as PalMMessage[];
        const filters = response[1] as PaLMContentFilter[];
        if (candidates && candidates.length > 0) {
          return {
            success: true,
            message: {
              role: ChatRole.Assistant,
              content: stringToMessageBlocks(candidates[0].content),
            },
          };
        } else {
          if (filters && filters.length > 0) {
            return {
              success: false,
              errorMessage: this.getFilterErrorMessage(filters),
              finish_reason: ChatMessageFinishReason.ContentFilter,
            };
          } else {
            return {
              success: false,
              errorMessage: NO_RESPONSE_ERROR_MESSAGE,
            };
          }
        }
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: error.message,
        };
      });
  }

  convertToPaLMPrompt(conversation: Conversation): PaLMPrompt {
    if (conversation.contextInstruction) {
      return {
        context: conversation.contextInstruction,
        examples: this.getFormattedExamples(),
        messages: this.convertToPaLMMessages(conversation.messages),
      };
    } else {
      return {
        examples: this.getFormattedExamples(),
        messages: this.convertToPaLMMessages(conversation.messages),
      };
    }
  }

  /**
   * Returns one string with all the filter reasons and messages.
   * @param filters
   * @returns One error message string.
   */
  getFilterErrorMessage(filters: PaLMContentFilter[]): string {
    let filterErrorMessage = "Failed Request (content filtered): "; // TODO: Const/func/enum/something?
    let filterMessage = "";
    for (const filter of filters) {
      filterMessage = filter.message ? filter.message : "no details";
      filterErrorMessage += `${filter.reason}: ${filterMessage}\n`;
      if (filter.reason == PaLMContentBlockedReason.OTHER && !filter.message) {
        filterErrorMessage += "- try shorter input"; // TODO: Const/func/enum/something? TODO: What is the problem with large input??
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
    // Add a message from the assistant to the beginning of the conversation
    const assistantMessage: ChatMessage = {
      role: ChatRole.Assistant,
      content: [
        {
          type: "text",
          content: "Hi, I'm your coding assistant. How can I help you today?",
        } as TextBlock,
      ],
    };
    chatMessages.splice(0, 0, assistantMessage);

    // Convert system messages to user messages so that PaLM can handle it (only supports two authors)
    const messagesWithAcceptedAuthorship: ChatMessage[] = [];
    for (const message of chatMessages) {
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
  BLOCKED_REASON_UNSPECIFIED = "Blocked reason unspecified",
  SAFETY = "Safety",
  OTHER = "Other",
}
