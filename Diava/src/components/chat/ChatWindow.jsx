import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UserAvatar from "./UserAvatar";
import ChatMessage from "./ChatMessage";
import { FaHashtag } from "react-icons/fa";

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
      sender: "Daryl",
      initial: "D",
      content: "Hey how are you?",
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
      sender: "Daryl",
      initial: "D",
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
      sender: "Arielle",
      initial: "A",
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
      sender: "Arielle",
      initial: "A",
      content: "It's fantastic! I think you'd really enjoy it.",
      timestamp: "Yesterday",
    },
  ],
  3: [
    {
      id: "3-1",
      sender: "Anita",
      initial: "A",
      content: "Meeting tomorrow at 5pm!",
      timestamp: "3 hrs ago",
    },
    {
      id: "3-2",
      sender: "Anita",
      initial: "A",
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
      sender: "Nathan",
      initial: "N",
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
      sender: "Nathan",
      initial: "N",
      content: "It was mind-blowing! That plot twist at the end...",
      timestamp: "1 day ago",
    },
  ],
  5: [
    {
      id: "5-1",
      sender: "Jayson",
      initial: "J",
      content: "What did everyone think of the ending?",
      timestamp: "2 days ago",
    },
    {
      id: "5-2",
      sender: "Jayson",
      initial: "J",
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

// Mock channel data
const mockChannelMessages = {
  "1-1": [
    {
      id: "c1-1",
      sender: "Daryl",
      initial: "D",
      content: "Welcome to the General channel!",
      timestamp: "2 days ago",
    },
    {
      id: "c1-2",
      sender: "Arielle",
      initial: "A",
      content: "Has anyone read '1984' recently?",
      timestamp: "1 day ago",
    },
    {
      id: "c1-3",
      sender: "You",
      initial: "Y",
      content: "I read it last month. It's still so relevant.",
      timestamp: "1 day ago",
      isUser: true,
    },
  ],
  "1-2": [
    {
      id: "c2-1",
      sender: "Nathan",
      initial: "N",
      content: "I recommend 'Fahrenheit 451' if you haven't read it yet.",
      timestamp: "3 days ago",
    },
    {
      id: "c2-2",
      sender: "You",
      initial: "Y",
      content: "Great recommendation! I'd also suggest 'Brave New World'.",
      timestamp: "2 days ago",
      isUser: true,
    },
  ],
  "1-3": [
    {
      id: "c3-1",
      sender: "Anita",
      initial: "A",
      content: "This month we're reading 'To Kill a Mockingbird'",
      timestamp: "1 week ago",
    },
    {
      id: "c3-2",
      sender: "Jayson",
      initial: "J",
      content: "I'm halfway through. The character development is amazing.",
      timestamp: "5 days ago",
    },
  ],
};

const ChatWindow = ({ selectedChat, isClubChannel = false, clubName = "" }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Update messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      // Get messages for the selected conversation or channel
      const chatMessages = isClubChannel
        ? mockChannelMessages[selectedChat.id] || []
        : mockConversations[selectedChat.id] || [];
      setMessages(chatMessages);
    }
  }, [selectedChat, isClubChannel]);

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
          {isClubChannel
            ? "Select a channel to start chatting"
            : "Select a conversation to start chatting"}
        </Typography>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer>
      <ChatHeader>
        {isClubChannel ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaHashtag size={20} style={{ marginRight: "8px" }} />
            <Typography variant="h6">
              {selectedChat.name}
              {clubName && (
                <Typography
                  variant="caption"
                  sx={{ ml: 1, color: "text.secondary" }}
                >
                  {clubName}
                </Typography>
              )}
            </Typography>
          </Box>
        ) : (
          <>
            <UserAvatar initial={selectedChat.initial} />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {selectedChat.name}
            </Typography>
          </>
        )}
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
