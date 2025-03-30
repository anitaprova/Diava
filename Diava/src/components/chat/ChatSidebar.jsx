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
  conversations,
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

  // Update tab value when viewMode changes
  useEffect(() => {
    setTabValue(viewMode === "clubs" ? 0 : 1);
  }, [viewMode]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    onTabChange(newValue === 0 ? "clubs" : "messages");
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
        <IconButton sx={{ marginLeft: "auto" }} color="inherit">
          <AddIcon />
        </IconButton>
      </TabsContainer>

      <ContentContainer>
        {viewMode === "messages"
          ? // Show conversations for Messages tab
            conversations.map((conversation) => (
              <ChatConversation
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedChat?.id === conversation.id}
                onClick={() => setSelectedChat(conversation)}
              />
            ))
          : // Show channels for the selected club
            renderChannels()}
      </ContentContainer>
    </SidebarContainer>
  );
};

export default ChatSidebar;
