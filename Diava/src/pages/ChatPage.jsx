import React, { useState, useEffect } from "react";
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
  const [isAdmin, setIsAdmin] = useState(true); // Set to true to see admin view by default

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
      members: [
        { id: "m1", name: "Current User", role: "admin", initial: "C" },
        { id: "m2", name: "Arielle Smith", role: "moderator", initial: "A" },
        { id: "m3", name: "Nathan Lee", role: "member", initial: "N" },
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
      members: [
        { id: "m1", name: "Current User", role: "member", initial: "C" },
        { id: "m4", name: "Jayson Brown", role: "admin", initial: "J" },
        { id: "m5", name: "Anita Garcia", role: "member", initial: "A" },
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
      members: [
        { id: "m1", name: "Current User", role: "moderator", initial: "C" },
        { id: "m6", name: "Emma Wilson", role: "admin", initial: "E" },
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
      members: [
        { id: "m1", name: "Current User", role: "member", initial: "C" },
        { id: "m7", name: "David Chen", role: "admin", initial: "D" },
      ],
    },
  ]);

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

  return (
    <ChatContainer>
      {viewMode === "clubs" && (
        <ClubSidebar
          clubs={clubs}
          selectedClub={selectedClub}
          setSelectedClub={handleSelectClub}
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
