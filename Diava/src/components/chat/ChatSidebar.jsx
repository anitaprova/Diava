import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Tabs, Tab, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatConversation from "./ChatConversation";

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

const ConversationsContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "8px 0",
});

const ChatSidebar = ({ conversations, selectedChat, setSelectedChat }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

      <ConversationsContainer>
        {conversations.map((conversation) => (
          <ChatConversation
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedChat?.id === conversation.id}
            onClick={() => setSelectedChat(conversation)}
          />
        ))}
      </ConversationsContainer>
    </SidebarContainer>
  );
};

export default ChatSidebar;
