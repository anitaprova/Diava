import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ClubSidebar from "../components/chat/ClubSidebar";
import "../styles/Chat.css";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

const ChatContainer = styled("div")({
  display: "flex",
  height: "calc(100vh - 64px)", // Adjust based on your navbar height
  backgroundColor: "#f1eada",
});

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState("messages"); // "messages" or "clubs"
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [conversations, setConversations] = useState([]);

  // useEffect(() => {
  //   const getChats = () => {
  //     const unsubscribe = onSnapshot(doc(db, "UserChats", currentUser.uid), (doc) => {
  //       setConversations(doc.data());
  //     });

  //     return () => {
  //       unsubscribe();
  //     };
  //   };
    
  //   currentUser.uid && getChats();
  // }, [currentUser.uid]);

  // Mock data for clubs
  const [clubs, setClubs] = useState([
    
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
