import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UserAvatar from "./UserAvatar";
import ChatMessage from "./ChatMessage";
import { FaHashtag } from "react-icons/fa";
import { useChat } from "../../context/ChatContext";
import { arrayUnion, doc, onSnapshot, updateDoc, Timestamp, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid"

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

const ChatWindow = ({ selectedChat, isClubChannel = false, clubName = "" }) => {
  const { currentUser } = useAuth();
  const { data } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Update messages when selected chat changes
  useEffect(() => {
    setMessages([]);
    let unsubscribe;

    if (isClubChannel) {
      unsubscribe = onSnapshot(doc(db, "ClubChats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
    }
    else {
      unsubscribe = onSnapshot(doc(db, "Chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
    }
    

    return () => {
      unsubscribe();
    };
  }, [data.chatId]);

  const handleSendMessage = async () => {
    try {
      const userRef = doc(db, "Users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      const msgObj = {
        uid: uuidv4(),
        message,
        senderUid: currentUser.uid,
        senderUsername: userDoc.data().username,
        date: Timestamp.now(),
      };

      const msgRef = isClubChannel
        ? doc(db, "ClubChats", data.chatId)
        : doc(db, "Chats", data.chatId)

      await updateDoc(msgRef, {
        messages: arrayUnion(msgObj)
      });

      if (!isClubChannel) {
        updateSideBar();
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const updateSideBar = async () => {
    try {
      await updateDoc(doc(db, "UserChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          message
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "UserChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          message
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
      setMessage("");
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
            <UserAvatar initial={ data.user? (data.user.username[0]).toUpperCase() : ""} />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {data.user? data.user.username : ""}
            </Typography>
          </>
        )}
      </ChatHeader>

      <MessagesContainer>
        {messages.map((msg) => (
          <ChatMessage key={msg.uid} message={msg} />
        ))}
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          placeholder="Type into chat"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
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
