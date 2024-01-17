export enum LLMProvider {
  OpenAI = "OpenAI",
  Google = "Google",
}

export enum MessageSeverity {
  Error = "error",
  Warning = "warning",
  Info = "information",
}

export enum Personas {
  Friendly = "friendly",
  Duck = "duck",
  Custom = "custom"
}

export enum TextProviderScheme {
  AiCodeReview = "ai-code-review",
}

export enum ApplyChangesPosition {
  Current = "Current",
  Beside = "Beside",
  Below = "Below",
  UseMergeConflictSetting = "Use Merge Conflict Setting",
}
