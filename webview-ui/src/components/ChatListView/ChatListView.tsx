import { Chat, Persona } from "../../../../shared/types";
import { ChatList } from "./ChatList";
import { NavBar } from "../NavBar";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";
import { PersonaDropdown } from "../PersonaDropdown";

interface ChatListProps {
  chatList: Chat[];
  changeActiveChat: (chat: Chat | null) => void;
  personasList: Persona[];
  defaultPersonaId: number;
  changeDefaultPersonaId: (id: number) => void;
}

export const ChatListView = ({
  chatList,
  changeActiveChat,
  personasList,
  defaultPersonaId,
  changeDefaultPersonaId,
}: ChatListProps) => {
  const { createNewChat } = useExtensionMessageContext();

  const handleOnChatClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  if (chatList.length === 0) {
    createNewChat();
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar showBackButton={false} changeActiveChat={changeActiveChat} />
      <div className="page-header">
        <h2>Chat History</h2>
        <PersonaDropdown
          label="Default Persona"
          personas={personasList}
          selectedPersonaId={defaultPersonaId}
          changeSelectedPersonaId={changeDefaultPersonaId}
        />
      </div>
      <ChatList
        chatList={chatList}
        handleChatClick={handleOnChatClick}
      ></ChatList>
    </div>
  );
};
