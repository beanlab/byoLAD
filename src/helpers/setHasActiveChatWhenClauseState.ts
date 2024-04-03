import * as vscode from "vscode";
import * as constants from "../commands/constants";

export function setHasActiveChatWhenClauseState(hasActiveChat: boolean) {
  vscode.commands.executeCommand(
    "setContext",
    constants.HAS_ACTIVE_CHAT_WHEN_CLAUSE_KEY,
    hasActiveChat,
  );
}
