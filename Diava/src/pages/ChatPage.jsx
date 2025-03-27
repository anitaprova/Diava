import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ClubSidebar from "../components/chat/ClubSidebar";
import "../styles/Chat.css";

const ChatContainer = styled("div")({
  display: "flex",
  height: "calc(100vh - 64px)", // Adjust based on your navbar height
  backgroundColor: "#f1eada",
});

const ChatPage = () => {
  const [viewMode, setViewMode] = useState("messages"); // "messages" or "clubs"
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

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

  // Mock data for clubs
  const [clubs, setClubs] = useState([
    {
      id: "1",
      name: "Banned Books",
      initial: "B",
      channels: [
        { id: "1-1", name: "General" },
        { id: "1-2", name: "Recs" },
        { id: "1-3", name: "BOTM" },
      ],
      features: [
        { id: "f1-1", name: "Book Voting", icon: "chart" },
        { id: "f1-2", name: "Challenges", icon: "trophy" },
      ],
    },
    {
      id: "2",
      name: "Fantasy Readers",
      initial: "F",
      channels: [
        { id: "2-1", name: "General" },
        { id: "2-2", name: "New Releases" },
        { id: "2-3", name: "Book of the Month" },
      ],
      features: [
        { id: "f2-1", name: "Book Voting", icon: "chart" },
        { id: "f2-2", name: "Challenges", icon: "trophy" },
      ],
    },
    {
      id: "3",
      name: "Mystery Club",
      initial: "M",
      channels: [
        { id: "3-1", name: "General" },
        { id: "3-2", name: "Thriller" },
        { id: "3-3", name: "True Crime" },
      ],
      features: [
        { id: "f3-1", name: "Book Voting", icon: "chart" },
        { id: "f3-2", name: "Challenges", icon: "trophy" },
      ],
    },
    {
      id: "4",
      name: "Science Fiction",
      initial: "S",
      channels: [
        { id: "4-1", name: "General" },
        { id: "4-2", name: "Space Opera" },
        { id: "4-3", name: "Cyberpunk" },
      ],
      features: [
        { id: "f4-1", name: "Book Voting", icon: "chart" },
        { id: "f4-2", name: "Challenges", icon: "trophy" },
      ],
    },
  ]);

  const handleTabChange = (newMode) => {
    setViewMode(newMode);
  };

  return (
    <ChatContainer>
      {viewMode === "clubs" && (
        <ClubSidebar
          clubs={clubs}
          selectedClub={selectedClub}
          setSelectedClub={setSelectedClub}
        />
      )}

      <ChatSidebar
        conversations={conversations}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        viewMode={viewMode}
        onTabChange={handleTabChange}
        selectedClub={selectedClub}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />

      <ChatWindow
        selectedChat={viewMode === "messages" ? selectedChat : selectedChannel}
        isClubChannel={viewMode === "clubs"}
        clubName={selectedClub?.name}
      />
    </ChatContainer>
  );
};

export default ChatPage;
