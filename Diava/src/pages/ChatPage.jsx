import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ClubSidebar from "../components/chat/ClubSidebar";
import "../styles/Chat.css";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import BookVoting from "../components/chat/BookVoting";
import ClubChallenges from "../components/chat/ClubChallenges";
import { useClub } from "../context/ClubContext";

const ChatContainer = styled("div")({
  display: "flex",
  height: "calc(100vh - 64px)", // Adjust based on your navbar height
  backgroundColor: "#f1eada",
});

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { setCurrentClub } = useClub();
  const [viewMode, setViewMode] = useState("messages"); // "messages" or "clubs"
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // Set to true to see admin view by default
  const [chats, setChats] = useState([]);
  const [clubs, setClubs] = useState([]);
  const chatSidebarRef = useRef(null);

  useEffect(() => {
    setChats(null);
    setClubs(null);
    let unsubscribe;

    if (viewMode === "messages") {
      unsubscribe = onSnapshot(
        doc(db, "UserChats", currentUser.uid),
        (docSnap) => {
          setChats(docSnap.data());
        }
      );
    } else if (viewMode === "clubs") {
      unsubscribe = onSnapshot(
        doc(db, "UserClubs", currentUser.uid),
        (docSnap) => {
          setClubs(docSnap.data());
        }
      );
    }

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid, viewMode]);

  const handleTabChange = (newMode) => {
    setViewMode(newMode);
  };

  const handleSelectClub = async (club) => {
    try {
      const clubRef = doc(db, "Clubs", club.clubInfo.clubuid);
      const clubDoc = await getDoc(clubRef);

      if (clubDoc.exists()) {
        const clubData = clubDoc.data();

        setCurrentClub(clubData);
        setSelectedClub(clubData);

        // Check if the current user is an admin of this club
        const userClubInfo = clubData.members[currentUser.uid];
        const isUserAdmin = userClubInfo.role === "Admin";

        setIsAdmin(isUserAdmin);
      } else {
        console.log("Error finding club.");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateClub = (newClub) => {
    // Implemented in ChatSidebar.jsx as 'handleCreateClub'
  };

  const handleShowCreateClubDialog = () => {
    if (chatSidebarRef.current) {
      chatSidebarRef.current.setCreateClubOpen(true);
    }
  };

  const renderMainContent = () => {
    if (viewMode === "clubs" && selectedChannel) {
      // Check if it's a feature type channel
      if (selectedChannel.type === "feature") {
        if (selectedChannel.featureType === "bookVoting") {
          return <BookVoting clubName={selectedClub?.name} />;
        } else if (selectedChannel.featureType === "challenges") {
          return <ClubChallenges clubName={selectedClub?.name} />;
        }
      }

      // Regular channel
      return (
        <ChatWindow
          selectedChat={selectedChannel}
          isClubChannel={true}
          clubName={selectedClub?.name}
        />
      );
    } else {
      // Direct messages
      return <ChatWindow selectedChat={selectedChat} isClubChannel={false} />;
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

      {renderMainContent()}
    </ChatContainer>
  );
};

export default ChatPage;
