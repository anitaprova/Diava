import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Paper } from "@mui/material";
import UserAvatar from "./UserAvatar";

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
  const { content, timestamp, initial, isUser } = message;

  const isShortMessage = content && content.length < 30;

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
