export enum MessageType {
  User,
  AI,
}

export interface Message {
  type: MessageType;
  message: string;
}

export interface ImagePaths {
  byoLadCircleImageUri: string;
  byoladIconUri: string;
}

export enum VsCodeTheme {
  Light = "light",
  Dark = "dark",
  HighContrastLight = "hc-light",
  HighContrastDark = "hc-dark",
}
