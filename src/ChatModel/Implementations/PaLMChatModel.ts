import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import {
  ChatMessageRole,
  ChatModel,
  ChatModelRequest,
  ChatModelResponse,
} from "../ChatModel";
import { NO_RESPONSE_ERROR_MESSAGE } from "../../commands/constants";

export class PaLMChatModel implements ChatModel {
  private client: DiscussServiceClient;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.client = new DiscussServiceClient({
      authClient: new GoogleAuth().fromAPIKey(apiKey),
    });
    this.model = model;
  }

  async chat(request: ChatModelRequest): Promise<ChatModelResponse> {
    const tempMessages = request.messages.map((message) => {
      // TODO: Clean this up and make it not janky. Need to format the message array better for GPT and PaLM
      return {
        author: message.role as string,
        content: message.content,
      };
    });
    const msg = {
      author: "user",
      content: `${tempMessages[0].content}. ${tempMessages[1].content}`,
    };
    const messages = [msg];
    const prompt = {
      messages: messages,
    };
    return await this.client
      .generateMessage({
        model: `models/${this.model}`,
        temperature: 0.5,
        prompt,
      })
      .then((response) => {
        if (response[0].candidates) {
          return {
            success: true,
            message: {
              role: ChatMessageRole.System,
              content: response[0].candidates[0].content as string,
            },
          };
        } else {
          return {
            success: false,
            errorMessage: NO_RESPONSE_ERROR_MESSAGE,
          };
        }
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: `Unknown Error: ${error.message}`,
        };
      });
  }

  // async chat(request: ChatModelRequest): Promise<ChatModelResponse> {
  //   const messages = request.messages.map((message) => {
  //     return {
  //       author: message.role as string,
  //       content: message.content,
  //     };
  //   });
  //   messages[0].author = "user"; // TODO: DELETE ME
  //   const prompt = {
  //     messages: messages,
  //   };
  //   const params = {
  //     temperature: 0.5, // TODO: Make configurable
  //     max_tokens: 1024, // TODO: Make configurable
  //   };
  //   const endpoint = `models/${this.model}`;
  //   const apiRequest = {
  //     endpoint,
  //     prompt,
  //     params,
  //   };
  //   try {
  //     const [response] = await this.client.predict(apiRequest);
  //     const predictions = response.predictions;
  //     if (!predictions) {
  //       return {
  //         success: false,
  //         errorMessage: NO_RESPONSE_ERROR_MESSAGE,
  //       };
  //     }
  //     console.log("\tPredictions :");
  //     for (const prediction of predictions) {
  //       console.log(`\t\tPrediction : ${JSON.stringify(prediction)}`);
  //     }

  //     console.log(response);
  //   } catch (error) {
  //     return {
  //       success: false,
  //       errorMessage: `Unknown Error`,
  //     };
  //   }

  //   return await this.client
  //     .predict(apiRequest)
  //     .then((response) => {
  //       if (response[0].predictions) {
  //         return {
  //           success: true,
  //           completion: response[0].predictions[0] as string,
  //         };
  //       } else {
  //         return {
  //           success: false,
  //           errorMessage: NO_RESPONSE_ERROR_MESSAGE,
  //         };
  //       }
  //     })
  //     .catch((error) => {
  //       return {
  //         success: false,
  //         errorMessage: `Unknown Error: ${error.message}`,
  //       };
  //     });
  // }
}
