import { ChatList } from "./ChatList";
import { useAppContext } from "../../utilities/AppContext";
import NavBar from "../NavBar";

export const ChatListView = () => {
  const { chatList } = useAppContext();

  return (
    <div>
      <NavBar />
      <div className="page-header">
        <h2>Chat History</h2>
      </div>
      <ChatList chatList={chatList}></ChatList>
    </div>
  );
};
