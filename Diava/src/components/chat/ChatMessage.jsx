import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Paper } from "@mui/material";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

//test
const MessageContainer = styled(Box)(({ isUser }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: isUser ? "flex-end" : "flex-start",
  gap: "12px",
  width: "100%",
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: "12px 16px",
  borderRadius: "16px",
  backgroundColor: isUser ? "#b59e7e" : "#cec1a8",
  color: isUser ? "white" : "#5d4b3d",
}));

const MessageText = styled("span")({
  whiteSpace: "normal",
  display: "inline-block",
  overflow: "visible",
  maxWidth: "100%",
});

const MessageTime = styled(Typography)({
  fontSize: "0.75rem",
  color: "#5d4b3d",
  marginTop: "4px",
});

const ChatMessage = ({ message }) => {
  const { currentUser } = useAuth();
  const { data } = useChat();
  const content = message.message;
  const timestamp = message.date 
    ? new Date(message.date.seconds * 1000).toLocaleDateString()
    : "Unknown Time";
  const isUser = message.senderUid === currentUser.uid;
  const isShortMessage = content && content.length < 30;
  let initial = null;

  if (data && data.user && data.user.username) {
    initial = isUser
      ? ""
      : data.user.username[0].toUpperCase();
  } 
  else {
    initial = message.senderUsername
      ? message.senderUsername[0].toUpperCase()
      : "?";
  }

  return (
    <MessageContainer isUser={isUser}>
      {!isUser && <UserAvatar initial={initial} />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          maxWidth: "75%",
        }}
      >
        <MessageBubble isUser={isUser}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: isShortMessage ? "nowrap" : "normal",
              overflow: "visible",
            }}
          >
            {content}
          </Typography>
        </MessageBubble>
        <MessageTime>{timestamp}</MessageTime>
      </Box>
    </MessageContainer>
  );
};

export default ChatMessage;
