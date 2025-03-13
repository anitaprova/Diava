import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UserAvatar from "./UserAvatar";
import ChatMessage from "./ChatMessage";

const WindowContainer = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const ChatHeader = styled(Box)({
  padding: "16px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
});

const MessagesContainer = styled(Box)({
  flex: 1,
  padding: "16px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const InputContainer = styled(Box)({
  padding: "16px",
  borderTop: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
});

const MessageInput = styled(InputBase)({
  flex: 1,
  padding: "8px 16px",
  backgroundColor: "#cec1a8",
  borderRadius: "24px",
  marginRight: "8px",
});

// Mock conversation data - in a real app, this would come from Firebase
const mockConversations = {
  1: [
    {
      id: "1-1",
      sender: "Jayson",
      initial: "J",
      content: "Lorem ipsum dolor sit amet...",
      timestamp: "10:30 AM",
    },
    {
      id: "1-2",
      sender: "You",
      initial: "Y",
      content:
        "Not yet, I'm still finishing the one you recommended last week.",
      timestamp: "10:32 AM",
      isUser: true,
    },
    {
      id: "1-3",
      sender: "Jayson",
      initial: "J",
      content: "Oh, how are you liking it so far?",
      timestamp: "10:33 AM",
    },
    {
      id: "1-4",
      sender: "You",
      initial: "Y",
      content: "It's amazing! The character development is really well done.",
      timestamp: "10:35 AM",
      isUser: true,
    },
  ],
  2: [
    {
      id: "2-1",
      sender: "Sarah",
      initial: "S",
      content: "Have you read that new book??",
      timestamp: "Yesterday",
    },
    {
      id: "2-2",
      sender: "You",
      initial: "Y",
      content: "No, is it good?",
      timestamp: "Yesterday",
      isUser: true,
    },
    {
      id: "2-3",
      sender: "Sarah",
      initial: "S",
      content: "It's fantastic! I think you'd really enjoy it.",
      timestamp: "Yesterday",
    },
  ],
  3: [
    {
      id: "3-1",
      sender: "Book Club Alpha",
      initial: "B",
      content: "Meeting tomorrow at 5pm!",
      timestamp: "3 hrs ago",
    },
    {
      id: "3-2",
      sender: "Michael",
      initial: "M",
      content: "I'll be there. Should we finish chapter 12?",
      timestamp: "2 hrs ago",
    },
    {
      id: "3-3",
      sender: "You",
      initial: "Y",
      content: "I'll try to finish it tonight.",
      timestamp: "1 hr ago",
      isUser: true,
    },
  ],
  4: [
    {
      id: "4-1",
      sender: "Michael",
      initial: "M",
      content: "I finished the chapter you recommended",
      timestamp: "1 day ago",
    },
    {
      id: "4-2",
      sender: "You",
      initial: "Y",
      content: "What did you think?",
      timestamp: "1 day ago",
      isUser: true,
    },
    {
      id: "4-3",
      sender: "Michael",
      initial: "M",
      content: "It was mind-blowing! That plot twist at the end...",
      timestamp: "1 day ago",
    },
  ],
  5: [
    {
      id: "5-1",
      sender: "Fantasy Readers",
      initial: "F",
      content: "What did everyone think of the ending?",
      timestamp: "2 days ago",
    },
    {
      id: "5-2",
      sender: "Alex",
      initial: "A",
      content: "I didn't see it coming at all!",
      timestamp: "2 days ago",
    },
    {
      id: "5-3",
      sender: "You",
      initial: "Y",
      content: "I had a feeling the protagonist would make that choice.",
      timestamp: "2 days ago",
      isUser: true,
    },
  ],
};

const ChatWindow = ({ selectedChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Update messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      // Get messages for the selected conversation
      const conversationMessages = mockConversations[selectedChat.id] || [];
      setMessages(conversationMessages);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "You",
        initial: "Y",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: true,
      };

      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <WindowContainer sx={{ justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6" color="textSecondary">
          Select a conversation to start chatting
        </Typography>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer>
      <ChatHeader>
        <UserAvatar initial={selectedChat.initial} />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          {selectedChat.name}
        </Typography>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          placeholder="Type into chat"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </WindowContainer>
  );
};

export default ChatWindow;
