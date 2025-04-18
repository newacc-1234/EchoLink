import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const {
    selectedGroup,
    groupMessages,
    getGroupMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupChatStore();

  //debug log
  console.log("GroupStore selectedGroup in ChatContainer:", useGroupChatStore.getState().selectedGroup);

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  //load messages based on selectedUser or selectedGroup
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    } else if (selectedGroup) {
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages();
      return () => unsubscribeFromGroupMessages();
    }
  }, [
    selectedUser,
    selectedGroup,
    getMessages,
    getGroupMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  ]);

  //auto-scroll
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, groupMessages]);

  const renderFormattedText = (text) => {
    return text
      .split("\n")
      .map((line, i) => <p key={i} className="whitespace-pre-wrap mb-1">{line}</p>);
  };

  const currentMessages = selectedGroup ? groupMessages : messages;

  const isCurrentUser = (senderId) => senderId === authUser._id;

  console.log("selectedGroup:", selectedGroup);

  const getSenderInfo = (message) => {
    if (selectedGroup) {
      const sender = selectedGroup.members.find((m) => m._id === message.senderId);
      return {
        name: sender?.fullName || "Unknown",
        avatar: sender?.profilePic || "/avatar.png",
      };
    } else {
      return {
        name: selectedUser?.fullName,
        avatar: selectedUser?.profilePic || "/avatar.png",
      };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto p-4">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {currentMessages.map((message) => {
          const isMine = isCurrentUser(message.senderId);
          const { name, avatar } = getSenderInfo(message);

          return (
            <div
              key={message._id}
              className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-12 rounded-full border">
                  <img
                    src={isMine ? authUser.profilePic || "/avatar.png" : avatar}
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                {!isMine && selectedGroup && (
                  <span className="text-sm font-bold mr-2">{name}</span>
                )}
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`chat-bubble flex flex-col font-semibold ${
                  isMine
                    ? "bg-primary/100 text-primary-content/100"
                    : "bg-base-200 text-primary/100"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && renderFormattedText(message.text)}
              </div>
            </div>
          );
        })}
        <div />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
