import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import "../styles/Chat.css";

const ChatContainer = styled("div")({
  display: "flex",
  height: "calc(100vh - 64px)", // Adjust based on your navbar height
  backgroundColor: "#f1eada",
});

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Mock data for conversations - this would come from Firebase in the real app
  const [conversations, setConversations] = useState([
    {
      id: "1",
      name: "Jayson",
      lastMessage: "Lorem ipsum dolor sit amet...",
      time: "20 min",
      initial: "J",
    },
    {
      id: "2",
      name: "Sarah",
      lastMessage: "Have you read that new book?",
      time: "1 hr",
      initial: "S",
    },
    {
      id: "3",
      name: "Book Club Alpha",
      lastMessage: "Meeting tomorrow at 5pm",
      time: "3 hrs",
      initial: "B",
    },
    {
      id: "4",
      name: "Michael",
      lastMessage: "I finished the chapter you recommended",
      time: "1 day",
      initial: "M",
    },
    {
      id: "5",
      name: "Fantasy Readers",
      lastMessage: "What did everyone think of the ending?",
      time: "2 days",
      initial: "F",
    },
  ]);

  return (
    <ChatContainer>
      <ChatSidebar
        conversations={conversations}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <ChatWindow selectedChat={selectedChat} />
    </ChatContainer>
  );
};

export default ChatPage;
