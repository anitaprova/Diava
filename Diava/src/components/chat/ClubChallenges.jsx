import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  Divider,
  Chip,
  Avatar,
  AvatarGroup,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { FaHashtag } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { useClub } from "../../context/ClubContext";
import { v4 as uuidv4 } from "uuid";
import { updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { db } from "../../firebase/firebase";

const WindowContainer = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "#f1eada",
});

const Header = styled(Box)({
  padding: "16px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#aaa396",
});

const ContentContainer = styled(Box)({
  flex: 1,
  padding: "16px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const ChallengeItem = styled(Paper)(({ completed }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: completed ? "#f0f7ed" : "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderLeft: completed ? "4px solid #7cb342" : "none",
}));

const ChallengeHeader = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "12px",
});

const ChallengeTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "1.1rem",
  color: "#5d4b3d",
  flex: 1,
});

const ChallengeDescription = styled(Typography)({
  fontSize: "0.9rem",
  color: "#5d4b3d",
  marginBottom: "16px",
});

const ChallengeFooter = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
});

const ChallengeDueDate = styled(Typography)({
  fontSize: "0.85rem",
  color: "#5d4b3d",
});

const CompletedBy = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const CompletedText = styled(Typography)({
  fontSize: "0.85rem",
  color: "#5d4b3d",
});

const StyledAvatarGroup = styled(AvatarGroup)({
  "& .MuiAvatar-root": {
    width: 30,
    height: 30,
    fontSize: "0.8rem",
    backgroundColor: "#b59e7e",
    color: "white",
  },
});

const ClubChallenges = ({ clubName, isAdmin }) => {
  const { currentUser } = useAuth();
  const { currentClub } = useClub();
  const [challenges, setChallenges] = useState([]);
  const [addChallengeOpen, setAddChallengeOpen] = useState(false);
  const currentUserId = currentUser.uid;
  const defaultChallenge = {
    title: "",
    description: "",
    dueDate: null
  };
  const [newChallenge, setNewChallenge] = useState(defaultChallenge);

  // Check if the user is an admin or owner based on the club data
  const checkIsAdmin = () => {
    if (!currentClub || !currentUser) return false;

    const userRole = currentClub.members?.[currentUser.uid]?.role;
    return userRole === "Admin" || userRole === "Owner";
  };

  const handleToggleChallenge = async (challengeId) => {
    const userId = currentUser.uid;
    const clubRef = doc(db, "Clubs", currentClub.uid);
    const clubSnap = await getDoc(clubRef);

    if (!clubSnap.exists()) return;

    const data = clubSnap.data();
    const challenges = data.challenges || {};
    const challenge = challenges[challengeId];

    if (!challenge) return;

    const completedBy = challenge.completedBy || {};

    if (completedBy[userId]) {
      delete completedBy[userId];
    } else {
      completedBy[userId] = {
        uid: userId,
        name: currentUser.displayName || "Unknown",
        initial: currentUser.displayName?.[0] || "?",
      };
    }

    await updateDoc(clubRef, {
      [`challenges.${challengeId}.completedBy`]: completedBy
    });

    handleGetChallenges();
  };

  const handleGetChallenges = async () => {
    try {
      const clubRef = doc(db, "Clubs", currentClub.uid);
      const clubSnap = await getDoc(clubRef);

      if (!clubSnap.exists()) {
        console.log("No such club exists.");
        return;
      }

      const clubData = clubSnap.data();
      const challenges = clubData.challenges || {};

      // May be used with sorting filter to get certain variations
      const sortedChallenges = Object.values(challenges).sort((a, b) => {
        return a.dueDate - b.dueDate;
      })

      setChallenges(sortedChallenges);
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleAddChallenge = () => {
    setAddChallengeOpen(true);
    setNewChallenge(defaultChallenge);
    handleGetChallenges();
  };

  const handleCloseAddChallenge = () => {
    setAddChallengeOpen(false);
    setNewChallenge(defaultChallenge);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge({ ...newChallenge, [name]: value });
  };

  const handleSubmitNewChallenge = async () => {
    const currentTime = new Date();

    if (!newChallenge.dueDate || new Date(newChallenge.dueDate) < currentTime) {
      alert("Cannot pick a due date in the past.");
      return;
    }

    const challengeId = uuidv4();

    // Create new challenge object
    const challengeToAdd = {
      id: challengeId,
      title: newChallenge.title,
      description: newChallenge.description,
      createdAt: serverTimestamp(),
      dueDate: newChallenge.dueDate,
      completedBy: {},
    };

    try {
      // Add challenge to Club Challenges
      const clubRef = doc(db, "Clubs", currentClub.uid);

      await updateDoc(clubRef, {
        [`challenges.${challengeId}`]: challengeToAdd
      });

      // Reset form and close dialog
      setNewChallenge(defaultChallenge);
      setAddChallengeOpen(false);

      console.log("Added challenge");
    }
    catch (error) {
      console.log(error);
    }
  };

  // Determine if current user has admin privileges
  const isUserAdmin = isAdmin || checkIsAdmin();

  return (
    <WindowContainer>
      <Header>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FaHashtag size={20} style={{ marginRight: "8px" }} />
          <Typography variant="h6">
            Club Challenges
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
      </Header>

      <ContentContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Weekly Reading Challenges</Typography>

          <Box sx={{
            display: "flex",
            gap: 1
          }}>
            {/* Refresh button to grab latest challenges */}
            <Tooltip title="Refresh challenges">
              <IconButton size="small" sx={{ color: "#5d4b3d" }} onClick={handleGetChallenges}>
                <RefreshIcon/ >
              </IconButton>
            </Tooltip>

            {/* Admin button for adding challenges */}
            {isUserAdmin && (
              <Tooltip title="Add new challenge">
                <IconButton size="small" sx={{ color: "#5d4b3d" }} onClick={handleAddChallenge}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {challenges.map((challenge) => {
          const isUserCompleted = challenge.completedBy.hasOwnProperty(currentUser.uid);

          return (
            <ChallengeItem key={challenge.id} completed={isUserCompleted}>
              <ChallengeHeader>
                <ChallengeTitle>{challenge.title}</ChallengeTitle>
                <Checkbox
                  checked={isUserCompleted}
                  onChange={() => handleToggleChallenge(challenge.id)}
                  icon={<CheckCircleIcon sx={{ color: "#ccc" }} />}
                  checkedIcon={<CheckCircleIcon sx={{ color: "#7cb342" }} />}
                />
              </ChallengeHeader>

              <ChallengeDescription>
                {challenge.description}
              </ChallengeDescription>

              <Divider sx={{ my: 1 }} />

              <ChallengeFooter>
                <ChallengeDueDate>Due: {challenge.dueDate.toDate().toLocaleString()}</ChallengeDueDate>

                <CompletedBy>
                  {Object.keys(challenge.completedBy || {}).length > 0 && (
                    <>
                      <CompletedText>Completed by:</CompletedText>
                      <StyledAvatarGroup max={5}>
                        {Object.entries(challenge.completedBy).map(([uid, user]) => (
                          <Tooltip key={uid} title={user.name}>
                            <Avatar>{user.initial}</Avatar>
                          </Tooltip>
                        ))}
                      </StyledAvatarGroup>
                      {Object.keys(challenge.completedBy).length > 5 && (
                        <Chip
                          size="small"
                          label={`+${Object.keys(challenge.completedBy).length - 5} more`}
                          sx={{ backgroundColor: "#cec1a8", color: "#5d4b3d" }}
                        />
                      )}
                    </>
                  )}
                </CompletedBy>
              </ChallengeFooter>
            </ChallengeItem>
          );
        })}
      </ContentContainer>

      {/* Add Challenge Dialog */}
      <Dialog open={addChallengeOpen} onClose={handleCloseAddChallenge}>
        <DialogTitle>Create New Challenge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new reading challenge for club members to complete.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Challenge Title"
            fullWidth
            variant="outlined"
            value={newChallenge.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Challenge Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newChallenge.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Due Date"
              value={newChallenge.dueDate}
              onChange={(newValue) => {
                setNewChallenge((prev) => ({
                  ...prev,
                  dueDate: newValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  name="dueDate"
                  fullWidth
                  variant="outlined"
                  placeholder="Enter due date and time"
                  sx={{ mb: 2 }}
                />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddChallenge} sx={{ color: "#5d4b3d" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitNewChallenge}
            variant="contained"
            sx={{
              bgcolor: "#5d4b3d",
              color: "white",
              "&:hover": { bgcolor: "#433422" },
            }}
            disabled={!newChallenge.title || !newChallenge.dueDate}
          >
            Create Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </WindowContainer>
  );
};

export default ClubChallenges;
