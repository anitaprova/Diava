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
      name: "Daryl",
      lastMessage: "Hey, how are you?",
      time: "20 min",
      initial: "D",
    },
    {
      id: "2",
      name: "Arielle",
      lastMessage: "Have you read that new book?",
      time: "1 hr",
      initial: "A",
    },
    {
      id: "3",
      name: "Anita",
      lastMessage: "Meeting tomorrow at 5pm",
      time: "3 hrs",
      initial: "A",
    },
    {
      id: "4",
      name: "Nathan",
      lastMessage: "I finished the chapter you recommended",
      time: "1 day",
      initial: "N",
    },
    {
      id: "5",
      name: "Jayson",
      lastMessage: "What did everyone think of the ending?",
      time: "2 days",
      initial: "J",
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
