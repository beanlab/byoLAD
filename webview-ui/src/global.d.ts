import { WebviewInitialState } from "../../shared/types";

declare global {
  interface Window {
    initialState: WebviewInitialState;
  }
}
