import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar";

const ConversationContainer = styled(Box)(({ theme, isSelected }) => ({
  display: "flex",
  padding: "12px 16px",
  cursor: "pointer",
  backgroundColor: isSelected ? "#cec1a8" : "transparent",
  "&:hover": {
    backgroundColor: isSelected ? "#cec1a8" : "#b8b3a7",
  },
}));

const MessageInfo = styled(Box)({
  marginLeft: 12,
  flex: 1,
  overflow: "hidden",
});

const LastMessage = styled(Typography)({
  color: "#5d4b3d",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const TimeStamp = styled(Typography)({
  color: "#5d4b3d",
  fontSize: "0.75rem",
  marginTop: 4,
});

const ChatConversation = ({ chat, isSelected, onClick }) => {
  return (
    <ConversationContainer isSelected={isSelected} onClick={onClick}>
      <UserAvatar initial={(chat.userInfo.username[0]).toUpperCase()} />
      <MessageInfo>
        <Typography variant="subtitle2" fontWeight={500}>
          {chat.userInfo.username}
        </Typography>
        <LastMessage>{chat.lastMessage ? chat.lastMessage.message : "Start a converstation!"}</LastMessage>
        <TimeStamp>{chat.date? new Date(chat.date.seconds * 1000).toLocaleString(): ""}</TimeStamp>
      </MessageInfo>
    </ConversationContainer>
  );
};

export default ChatConversation;
