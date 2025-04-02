import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatConversation from "./ChatConversation";
import { FaHashtag } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 300,
  backgroundColor: "#aaa396", // Gray color from your theme
  height: "100%",
  borderRight: "1px solid #ddd",
  display: "flex",
  flexDirection: "column",
}));

const TabsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  borderBottom: "1px solid #ddd",
});

const ContentContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "8px 0",
});

const ClubHeader = styled(Box)(({ theme }) => ({
  padding: "16px",
  borderBottom: "1px solid #ddd",
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  padding: "8px 16px",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#5d4b3d",
  textTransform: "uppercase",
}));

const ChannelItem = styled(ListItem)(({ theme, isSelected }) => ({
  padding: "8px 16px",
  cursor: "pointer",
  backgroundColor: isSelected ? "#cec1a8" : "transparent",
  "&:hover": {
    backgroundColor: isSelected ? "#cec1a8" : "#b8b3a7",
  },
}));

const ChannelText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontSize: "0.95rem",
    color: "#5d4b3d",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
}));

const ChatSidebar = ({
  chats,
  selectedChat,
  setSelectedChat,
  viewMode,
  onTabChange,
  selectedClub,
  selectedChannel,
  setSelectedChannel,
}) => {
  // Set tab value based on viewMode
  const [tabValue, setTabValue] = useState(viewMode === "clubs" ? 0 : 1);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const { currentUser } = useAuth();
  const { dispatch } = useChat();

  // Update tab value when viewMode changes
  useEffect(() => {
    setTabValue(viewMode === "clubs" ? 0 : 1);
  }, [viewMode]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    onTabChange(newValue === 0 ? "clubs" : "messages");
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSelectedChat = (c) => {
    setSelectedChat(c);
    dispatch({type:"CHANGE_USER", payload: c.userInfo});
  }

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      console.log("User entered:", inputText);

      if (viewMode === "clubs") handleClubSearch();
      else handleUserSearch();

      setShowInput(false);
      setInputText("");
      setUser(null);
      setClub(null);
    }
  };

  // TODO: Implement CLub Search
  const handleClubSearch = async () => {
    console.log("Club search is not implemented yet.")
  };

  const handleUserSearch = async () => {
    if (inputText == "") return;
    
    const q = query(
      collection(db, "Users"),
      where("uid", "==", inputText) // In the future "uid" should be replaced with "username"
    );

    try {
      const querySnapshot = await getDocs(q);

      // Check if user exists
      if (querySnapshot.empty) {
        alert("User does not exist");
        return;
      }

      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        createPrivateChat();
      });

      console.log("Successfully found user.");
    }
    catch (error) {
      console.log(error);
    }
  };

  const createPrivateChat = async () => {
    if (!currentUser || !user) {
      console.log("A user was null");
      return;
    }

    const combinedUID = currentUser.uid > user.uid 
      ? currentUser.uid + user.uid 
      : user.uid + currentUser.uid;

    console.log(combinedUID);

    try {
      const res = await getDoc(doc(db, "Chats", combinedUID));

      if (!res.exists()) {
        await updateDoc(doc(db, "UserChats", currentUser.uid), {
          [combinedUID+".userInfo"]: {
            uid:user.uid,
            username:user.username
          },
          [combinedUID+".date"]: serverTimestamp()
        });

        // Get current user's username
        const userRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const currentUserInfo = userDoc.data();

        await updateDoc(doc(db, "UserChats", user.uid), {
          [combinedUID + ".userInfo"]: {
            uid:currentUser.uid,
            username:currentUserInfo.username
          },
          [combinedUID + ".date"]: serverTimestamp()
        });

        await setDoc(doc(db, "Chats", combinedUID), { messages: [] });

        console.log("Created private chat.");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const renderChannels = () => {
    if (!selectedClub) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            Select a club to view channels
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <ClubHeader>
          <Typography variant="h6" fontWeight={600}>
            {selectedClub.name}
          </Typography>
        </ClubHeader>

        {/* Text Channels */}
        <SectionHeader>Channels</SectionHeader>
        <List disablePadding>
          {selectedClub.channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              isSelected={selectedChannel?.id === channel.id}
              onClick={() => setSelectedChannel(channel)}
            >
              <ChannelText
                primary={
                  <>
                    <FaHashtag size={14} />
                    {channel.name}
                  </>
                }
              />
            </ChannelItem>
          ))}
        </List>

        {/* Features Section */}
        <Box sx={{ marginTop: "auto" }}>
          <Divider />
          <SectionHeader>Features</SectionHeader>
          <List disablePadding>
            {selectedClub.features?.map((feature) => (
              <ChannelItem key={feature.id}>
                <ChannelText
                  primary={
                    <>
                      {feature.icon === "chart" ? (
                        <MdBarChart size={16} />
                      ) : (
                        <GiTrophyCup size={16} />
                      )}
                      {feature.name}
                    </>
                  }
                />
              </ChannelItem>
            ))}
          </List>
        </Box>
      </>
    );
  };

  return (
    <SidebarContainer>
      <TabsContainer>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab label="Clubs" />
          <Tab label="Messages" />
        </Tabs>
        <IconButton sx={{ marginLeft: "auto" }} color="inherit" onClick={handleAddClick}>
          <AddIcon />
        </IconButton>
      </TabsContainer>

      {showInput && (
        <Box sx={{ padding: "8px", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder={viewMode === "clubs" ? "Enter Club" : "Enter User"}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputSubmit}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Box>
      )}

      <ContentContainer>
        {viewMode === "messages" ? (
          // Show conversations for Messages tab
          chats? (
            Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
              <ChatConversation
                key={chat[0]}
                chat={chat[1]}
                isSelected={selectedChat?.id === chat[0]}
                onClick={() => handleSelectedChat(chat[1])}
              />
            ))
          ) : (
            <Typography variant="body2">No conversations available</Typography> // Default view if chats are empty
          )
        ) : (
          // Show channels for the selected club
          renderChannels()
        )}
      </ContentContainer>
    </SidebarContainer>
  );
};

export default ChatSidebar;
