import { ChatMessage, ChatMessageRole } from "../ChatModel/ChatModel";

/**
 * Returns a ChatMessage array with the given instruction and code
 * using the appropriate roles.
 *
 * @param modelInstruction Instruction to send to the model
 * @param code Code to send to the model
 * @returns ChatMessage array with the given instruction and code
 */
export function getInstructionAndCodeChatMessages(
  modelInstruction: string,
  code: string
): ChatMessage[] {
  return [
    { role: ChatMessageRole.System, content: modelInstruction },
    { role: ChatMessageRole.User, content: code },
  ];
}
