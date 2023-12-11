import { ImagePaths } from "./types";

declare global {
  interface Window {
    initialState: {
      imagePaths: ImagePaths;
    };
  }
}
