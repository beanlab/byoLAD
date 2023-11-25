import { ImagePaths } from "./types";
import { Conversation } from "./utilities/ChatModel";

declare global {
  interface Window {
    initialState: {
      imagePaths: ImagePaths;
      conversations: Conversation[];
      activeConversationId: number | null;
    };
  }
}
