import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import ChatConversation from "./ChatConversation";
import { FaHashtag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  collection,
  orderBy,
  startAt,
  endAt,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { MdBarChart } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { useClub } from "../../context/ClubContext";
import { v4 as uuidv4 } from "uuid";

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
  padding: "8px 11px",
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
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  textAlign: "center",
  height: "100%",
  color: "#5d4b3d",
}));

const EmptyStateIcon = styled(ChatIcon)(({ theme }) => ({
  fontSize: "64px",
  color: "#cec1a8",
  marginBottom: "16px",
}));

const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  marginBottom: "8px",
}));

const EmptyStateDescription = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: "#5d4b3d",
  maxWidth: "240px",
}));

const ChatSidebar = forwardRef(
  (
    {
      chats,
      selectedChat,
      setSelectedChat,
      viewMode,
      onTabChange,
      selectedClub,
      selectedChannel,
      setSelectedChannel,
      isAdmin = false,
      onCreateClub,
    },
    ref
  ) => {
    const navigate = useNavigate();
    // Set tab value based on viewMode
    const [tabValue, setTabValue] = useState(viewMode === "clubs" ? 0 : 1);
    const [clubMenuAnchor, setClubMenuAnchor] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [inputText, setInputText] = useState("");
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [clubSearchResults, setClubSearchResults] = useState([]);
    const [user, setUser] = useState(null);
    const { currentUser } = useAuth();
    const { dispatch } = useChat();
    const { currentClub, setCurrentChannel } = useClub();
    const searchResultsRef = useRef(null);

    // Create Club Dialog state
    const [createClubOpen, setCreateClubOpen] = useState(false);
    const [newClubName, setNewClubName] = useState("");
    const [newClubDescription, setNewClubDescription] = useState("");

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      setCreateClubOpen: (open) => {
        setCreateClubOpen(open);
      },
    }));

    // Check if user clicks outside of search event
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          searchResultsRef.current &&
          !searchResultsRef.current.contains(event.target)
        ) {
          setUserSearchResults([]);
          setClubSearchResults([]);
          setInputText("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Update tab value when viewMode changes
    useEffect(() => {
      setTabValue(viewMode === "clubs" ? 0 : 1);
    }, [viewMode]);

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
      onTabChange(newValue === 0 ? "clubs" : "messages");
    };

    const handleClubMenuOpen = (event) => {
      setClubMenuAnchor(event.currentTarget);
    };

    const handleClubMenuClose = () => {
      setClubMenuAnchor(null);
    };

    const handleEditSettings = () => {
      handleClubMenuClose();
      navigate(`/club-settings/${selectedClub.id}`);
    };

    const handleLeaveClub = async () => {
      handleClubMenuClose();

      try {
        const userClubRef = doc(db, "UserClubs", currentUser.uid);
        const clubRef = doc(db, "Clubs", selectedClub.uid);

        await updateDoc(userClubRef, {
          [selectedClub.uid]: deleteField(),
        });

        await updateDoc(clubRef, {
          [`members.${currentUser.uid}`]: deleteField(),
        });

        console.log("Successfully left Club.");
        onTabChange("messages");
      } catch (error) {
        console.log(error);
      }
    };

    const handleAddButtonClick = () => {
      setShowInput(!showInput);
      if (!showInput) {
        setInputText("");
        setUserSearchResults([]);
        setClubSearchResults([]);
      }
    };

    const handleAddClick = () => {
      setShowInput(true);
    };

    const handleInputChange = (e) => {
      setInputText(e.target.value);
    };

    const handleSelectChannel = async (c) => {
      setSelectedChannel(c);
      setCurrentChannel(c);

      dispatch({ type: "CHANGE_CHANNEL_CHAT", payload: c });
    };

    const handleSelectedChat = (c) => {
      setSelectedChat(c);
      dispatch({ type: "CHANGE_USER_CHAT", payload: c.userInfo });
    };

    const handleInputSubmit = async (e) => {
      if (e.key === "Enter") {
        console.log("User entered:", inputText);

        if (viewMode === "clubs") handleClubSearch();
        else handleUserSearch();

        setShowInput(false);
        setInputText("");
      }
    };

    const handleCreateClub = async () => {
      if (!newClubName.trim()) return;

      try {
        console.log("Creating club with name:", newClubName);

        if (!currentUser || !currentUser.uid) {
          console.error("Current user not found or missing UID");
          return;
        }

        const clubUid = uuidv4();
        console.log("Generated club UID:", clubUid);

        // Get current user's username
        const userRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.error("User document not found in Firestore");
          return;
        }

        const currentUserInfo = userDoc.data();
        console.log("Retrieved user info:", currentUserInfo);

        // Check if username exists, provide a fallback if it doesn't
        const username =
          currentUserInfo.username ||
          currentUser.email ||
          "User_" + currentUser.uid.substring(0, 8);

        const clubRef = doc(db, "Clubs", clubUid);

        // Create a club
        await setDoc(clubRef, {
          uid: clubUid,
          clubname: newClubName,
          description: newClubDescription,
          createdBy: currentUser.uid,
          createdAt: serverTimestamp(),
          initial: newClubName[0].toUpperCase(),
          logo: {},
          channels: {},
          members: {
            [currentUser.uid]: {
              username: username,
              role: "Admin",
              joined: serverTimestamp(),
            },
          },
          challenges: {},
        });

        console.log("Club document created in Firestore");

        // Add creator to club
        const userClubRef = doc(db, "UserClubs", currentUser.uid);
        const userClubDoc = await getDoc(userClubRef);

        if (userClubDoc.exists()) {
          // Update the existing document
          await updateDoc(userClubRef, {
            [clubUid + ".clubInfo"]: {
              clubuid: clubUid,
              clubname: newClubName,
              joined: serverTimestamp(),
            },
          });
        } else {
          // Create a new document if it doesn't exist
          await setDoc(userClubRef, {
            [clubUid + ".clubInfo"]: {
              clubuid: clubUid,
              clubname: newClubName,
              joined: serverTimestamp(),
            },
          });
        }
        console.log("User added to club in UserClubs");

        // Call the parent component's handler
        if (onCreateClub) {
          onCreateClub();
        }

        // Reset form and close dialog
        setNewClubName("");
        setNewClubDescription("");
        setCreateClubOpen(false);

        console.log("Club creation completed successfully");
      } catch (error) {
        console.error("Error creating club:", error);
        alert("Error creating club: " + error.message);
      }
    };

    const handleClubSearch = async () => {
      if (inputText == "") return;

      try {
        // Search by clubname or partial match
        const qClubname = query(
          collection(db, "Clubs"),
          orderBy("clubname"),
          startAt(inputText),
          endAt(inputText + "\uf8ff")
        );

        // Search by username or partial match
        const qUsername = query(
          collection(db, "Clubs"),
          orderBy("createdByUsername"),
          startAt(inputText),
          endAt(inputText + "\uf8ff")
        );

        // Get the query snapshots and combine them
        const [qClubnameSnap, qUsernameSnap] = await Promise.all([
          getDocs(qClubname),
          getDocs(qUsername),
        ]);

        const allDocs = [...qClubnameSnap.docs, ...qUsernameSnap.docs];

        if (allDocs.length === 0) {
          alert("Cannot find club(s).");
          return;
        }

        const clubs = allDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setClubSearchResults(clubs);

        console.log("Successfully found club(s).");
      } catch (error) {
        console.log(error);
      }
    };

    const joinClub = async (club) => {
      // Check if user is in club
      const userClubsRef = doc(db, "UserClubs", currentUser.uid);
      const userClubsDoc = await getDoc(userClubsRef);

      if (userClubsDoc.exists()) {
        const userClubsData = userClubsDoc.data();
        const isInClub = club.uid in userClubsData;

        if (isInClub) {
          alert("You're already in the club.");
          console.log("User is already in the club!");
          return;
        }

        // Add user to club

        // Get current user's username and club's name
        const userRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const currentUserInfo = userDoc.data();
        const clubRef = doc(db, "Clubs", club.uid);

        await updateDoc(clubRef, {
          [`members.${currentUser.uid}`]: {
            username: currentUserInfo.username,
            role: "Member",
            joined: serverTimestamp(),
          },
        });
        await updateDoc(doc(db, "UserClubs", currentUser.uid), {
          [club.uid + ".clubInfo"]: {
            clubuid: club.uid,
            clubname: club.clubname,
            joined: serverTimestamp(),
          },
        });

        console.log("Successfully added user to club.");
      } else {
        alert("Error finding user's UserClubs reference");
        console.log("Error adding user to club.");
        return;
      }
    };

    const handleUserSearch = async () => {
      if (inputText == "") return;

      try {
        const inputLower = inputText.toLowerCase();

        // Search by username or partial match
        const qUsername = query(
          collection(db, "Users"),
          orderBy("username"),
          startAt(inputText),
          endAt(inputText + "\uf8ff")
        );

        // Search by fullname or partial match
        const qFullname = query(
          collection(db, "Users"),
          orderBy("fullname"),
          startAt(inputLower),
          endAt(inputLower + "\uf8ff")
        );

        // Get the query snapshots and combine them
        const [qUsernameSnap, qFullnameSnap] = await Promise.all([
          getDocs(qUsername),
          getDocs(qFullname),
        ]);

        const allDocs = [...qUsernameSnap.docs, ...qFullnameSnap.docs];

        if (allDocs.length === 0) {
          alert("User does not exist");
          return;
        }

        const users = allDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setUserSearchResults(users);

        console.log("Successfully found user(s).");
      } catch (error) {
        console.log(error);
      }
    };

    const createPrivateChat = async (targetUser) => {
      if (!currentUser || !targetUser) {
        console.log("A user was null");
        return;
      }

      // Check if target user has a username, provide a fallback if it doesn't
      const targetUsername =
        targetUser.username ||
        targetUser.email ||
        "User_" + targetUser.uid.substring(0, 8);

      const combinedUID =
        currentUser.uid > targetUser.uid
          ? currentUser.uid + targetUser.uid
          : targetUser.uid + currentUser.uid;

      try {
        const res = await getDoc(doc(db, "Chats", combinedUID));

        if (!res.exists()) {
          await setDoc(doc(db, "Chats", combinedUID), { messages: [] });

          await updateDoc(doc(db, "UserChats", currentUser.uid), {
            [combinedUID + ".userInfo"]: {
              uid: targetUser.uid,
              username: targetUsername,
            },
            [combinedUID + ".date"]: serverTimestamp(),
          });

          // Get current user's username
          const userRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          const currentUserInfo = userDoc.data();

          // Check if username exists, provide a fallback if it doesn't
          const username =
            currentUserInfo.username ||
            currentUser.email ||
            "User_" + currentUser.uid.substring(0, 8);

          await updateDoc(doc(db, "UserChats", targetUser.uid), {
            [combinedUID + ".userInfo"]: {
              uid: currentUser.uid,
              username: username,
            },
            [combinedUID + ".date"]: serverTimestamp(),
          });

          console.log("Created private chat.");
        }
      } catch (error) {
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
              {selectedClub.clubname}
            </Typography>
            <IconButton size="small" onClick={handleClubMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={clubMenuAnchor}
              open={Boolean(clubMenuAnchor)}
              onClose={handleClubMenuClose}
            >
              {isAdmin ? (
                <MenuItem onClick={handleEditSettings}>Edit Settings</MenuItem>
              ) : (
                <MenuItem onClick={handleLeaveClub}>Leave Club</MenuItem>
              )}
            </Menu>
          </ClubHeader>

          {/* Text Channels */}
          <SectionHeader>Channels</SectionHeader>
          <List disablePadding>
            {currentClub?.channels &&
            Object.values(currentClub.channels).length > 0
              ? Object.entries(currentClub.channels)
                  .sort((a, b) => a[1].createdAt - b[1].createdAt)
                  .map((channel) => (
                    <ChannelItem
                      key={channel[0]}
                      isSelected={selectedChannel?.id === channel[0]}
                      onClick={() => handleSelectChannel(channel[1])}
                    >
                      <ChannelText
                        primary={
                          <>
                            <FaHashtag size={14} />
                            {channel[1].name}
                          </>
                        }
                      />
                    </ChannelItem>
                  ))
              : null}
          </List>

          {/* Features Section */}
          <Box sx={{ marginTop: "auto" }}>
            <Divider />
            <SectionHeader>Features</SectionHeader>
            <List disablePadding>
              <ChannelItem
                onClick={() => {
                  setSelectedChannel({
                    id: "book-voting",
                    name: "Book Voting",
                    type: "feature",
                    featureType: "bookVoting",
                  });
                }}
                isSelected={selectedChannel?.id === "book-voting"}
              >
                <ChannelText
                  primary={
                    <>
                      <MdBarChart size={16} />
                      Book Voting
                    </>
                  }
                />
              </ChannelItem>
              <ChannelItem
                onClick={() => {
                  setSelectedChannel({
                    id: "challenges",
                    name: "Challenges",
                    type: "feature",
                    featureType: "challenges",
                  });
                }}
                isSelected={selectedChannel?.id === "challenges"}
              >
                <ChannelText
                  primary={
                    <>
                      <GiTrophyCup size={16} />
                      Challenges
                    </>
                  }
                />
              </ChannelItem>
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
          <IconButton
            sx={{ marginLeft: "auto" }}
            color="inherit"
            onClick={handleAddButtonClick}
          >
            <SearchIcon />
          </IconButton>
        </TabsContainer>

        {showInput && (
          <Box
            sx={{
              padding: "8px 16px",
              backgroundColor: "#aaa396",
              transition: "all 0.3s ease",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={
                viewMode === "clubs"
                  ? "Search for clubs..."
                  : "Search for users..."
              }
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputSubmit}
              sx={{
                backgroundColor: "white",
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "#5d4b3d",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5d4b3d",
                  },
                },
              }}
              autoFocus
            />
          </Box>
        )}

        <ContentContainer>
          {viewMode === "messages" ? (
            // Show conversations for Messages tab
            chats ? (
              Object.entries(chats)
                ?.sort((a, b) => b[1].date - a[1].date)
                .map((chat) => (
                  <ChatConversation
                    key={chat[0]}
                    chat={chat[1]}
                    isSelected={selectedChat?.uid === chat[0]}
                    onClick={() => handleSelectedChat(chat[1])}
                  />
                ))
            ) : (
              <EmptyStateContainer>
                <EmptyStateIcon />
                <EmptyStateTitle>No Conversations Yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Use the search icon above to find and start chatting with
                  other users.
                </EmptyStateDescription>
              </EmptyStateContainer>
            )
          ) : (
            // Show channels for the selected club
            renderChannels()
          )}

          {/* Search results overlayed on club channels */}
          {clubSearchResults.length > 0 && (
            <Box
              ref={searchResultsRef}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 10,
              }}
            >
              {clubSearchResults.map((club) => (
                <Box
                  key={club.id}
                  sx={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => {
                    joinClub(club);
                    setClubSearchResults([]);
                    setInputText("");
                    setShowInput(false);
                  }}
                >
                  <Typography variant="body1">
                    {club.clubname} (
                    {club.createdByUsername
                      ? club.createdByUsername
                      : club.createdBy}
                    )
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Search results overlayed on user chats */}
          {userSearchResults.length > 0 && (
            <Box
              ref={searchResultsRef}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 10,
              }}
            >
              {userSearchResults.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => {
                    createPrivateChat(user);
                    setUserSearchResults([]);
                    setInputText("");
                    setShowInput(false);
                  }}
                >
                  <Typography variant="body1">
                    {user.firstName} {user.lastName} ({user.username})
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </ContentContainer>

        {/* Create Club Dialog */}
        <Dialog open={createClubOpen} onClose={() => setCreateClubOpen(false)}>
          <DialogTitle>Create New Club</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new book club to discuss your favorite books with others.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Club Name"
              fullWidth
              variant="outlined"
              value={newClubName}
              onChange={(e) => {
                // Limit club name to 36 characters
                if (e.target.value.length <= 36) {
                  setNewClubName(e.target.value);
                }
              }}
              inputProps={{ maxLength: 36 }}
              helperText={`${newClubName.length}/36 characters`}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Club Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newClubDescription}
              onChange={(e) => setNewClubDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setCreateClubOpen(false)}
              sx={{ color: "#5d4b3d" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                try {
                  handleCreateClub();
                } catch (error) {
                  console.error("Error in create club button handler:", error);
                  alert("Error creating club. Please try again.");
                }
              }}
              variant="contained"
              sx={{
                bgcolor: "#5d4b3d",
                color: "white",
                "&:hover": { bgcolor: "#433422" },
              }}
              disabled={!newClubName.trim()}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </SidebarContainer>
    );
  }
);

export default ChatSidebar;
