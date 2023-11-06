export enum MessageType {
  User,
  AI,
}

export interface Message {
  type: MessageType;
  message: string;
}
