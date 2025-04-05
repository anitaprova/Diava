import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ClubSidebar from "../components/chat/ClubSidebar";
import "../styles/Chat.css";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const ChatContainer = styled("div")({
  display: "flex",
  height: "calc(100vh - 64px)", // Adjust based on your navbar height
  backgroundColor: "#f1eada",
});

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { dispatch } = useChat();
  const [viewMode, setViewMode] = useState("messages"); // "messages" or "clubs"
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // Set to true to see admin view by default
  const [chats, setChats] = useState([]);
  const [conversations, setConversations] = useState([]);
  const chatSidebarRef = useRef(null);

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

  // TODO: Get club chats
  useEffect(() => {
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, "UserChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsubscribe();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // Mock data for clubs
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    // Check if there are clubs in localStorage
    const storedClubs = localStorage.getItem("clubs");
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    } else {
      // If not, store the initial clubs
      localStorage.setItem("clubs", JSON.stringify(clubs));
    }
  }, []);

  const handleTabChange = (newMode) => {
    setViewMode(newMode);
  };

  const handleSelectClub = (club) => {
    setSelectedClub(club);

    // Check if the current user is an admin of this club
    const currentUserId = "m1"; // This would come from your auth context
    const isUserAdmin = club.members.some(
      (member) => member.id === currentUserId && member.role === "admin"
    );

    setIsAdmin(isUserAdmin);
  };

  const handleCreateClub = (newClub) => {
    // Add the new club to the clubs array
    setClubs([...clubs, newClub]);

    // Select the newly created club
    setSelectedClub(newClub);

    // Set the user as admin of this club
    setIsAdmin(true);

    // Switch to clubs view if not already there
    if (viewMode !== "clubs") {
      setViewMode("clubs");
    }

    // Note for backend: Need API endpoint to create a new club
  };

  const handleShowCreateClubDialog = () => {
    if (chatSidebarRef.current) {
      chatSidebarRef.current.setCreateClubOpen(true);
    }
  };

  return (
    <ChatContainer>
      {viewMode === "clubs" && (
        <ClubSidebar
          clubs={clubs}
          selectedClub={selectedClub}
          setSelectedClub={handleSelectClub}
          onCreateClub={handleShowCreateClubDialog}
        />
      )}

      <ChatSidebar
        ref={chatSidebarRef}
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        viewMode={viewMode}
        onTabChange={handleTabChange}
        selectedClub={selectedClub}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        isAdmin={isAdmin}
        onCreateClub={handleCreateClub}
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
