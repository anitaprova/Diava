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
import AddIcon from "@mui/icons-material/Add";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { useClub } from "../../context/ClubContext";
import { v4 as uuidv4 } from "uuid";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
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

// Mock data for challenges
const mockChallenges = [
  {
    id: "1",
    title: "Share your favorite quote from Chapter 3",
    description:
      "Find a quote that resonated with you and share it with the club.",
    dueDate: "May 15, 2023",
    completed: true,
    completedBy: [
      { id: "u1", name: "Jane", initial: "J" },
      { id: "u2", name: "Mike", initial: "M" },
      { id: "u3", name: "Sarah", initial: "S" },
      { id: "u4", name: "Alex", initial: "A" },
      { id: "u5", name: "Emma", initial: "E" },
      { id: "u6", name: "David", initial: "D" },
      { id: "u7", name: "Lisa", initial: "L" },
    ],
  },
  {
    id: "2",
    title: "Discuss the main idea of Chapter 4",
    description:
      "What do you think was the author's main point in this chapter?",
    dueDate: "May 18, 2023",
    completed: false,
    completedBy: [
      { id: "u1", name: "Jane", initial: "J" },
      { id: "u3", name: "Sarah", initial: "S" },
    ],
  },
  {
    id: "3",
    title: "Ask a thought-provoking question",
    description:
      "Come up with a question about the book that could spark discussion.",
    dueDate: "May 20, 2023",
    completed: false,
    completedBy: [],
  },
  {
    id: "4",
    title: "React to at least 3 messages from different users",
    description:
      "Engage with other club members by responding to their thoughts.",
    dueDate: "May 22, 2023",
    completed: false,
    completedBy: [{ id: "u2", name: "Mike", initial: "M" }],
  },
  {
    id: "5",
    title: "Invite a friend to the club",
    description:
      "Help our community grow by inviting someone who might enjoy this book.",
    dueDate: "May 25, 2023",
    completed: false,
    completedBy: [
      { id: "u1", name: "Jane", initial: "J" },
      { id: "u4", name: "Alex", initial: "A" },
      { id: "u5", name: "Emma", initial: "E" },
    ],
  },
  {
    id: "6",
    title: "Read 100 pages in 7 days",
    description: "Challenge yourself to read at least 100 pages this week.",
    dueDate: "May 28, 2023",
    completed: false,
    completedBy: [
      { id: "u3", name: "Sarah", initial: "S" },
      { id: "u6", name: "David", initial: "D" },
    ],
  },
  {
    id: "7",
    title: "Finish Chapter 5 by Sunday",
    description: "Make sure you're caught up with the reading schedule.",
    dueDate: "May 30, 2023",
    completed: false,
    completedBy: [
      { id: "u1", name: "Jane", initial: "J" },
      { id: "u2", name: "Mike", initial: "M" },
      { id: "u7", name: "Lisa", initial: "L" },
    ],
  },
];

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

  // To work on
  const handleToggleChallenge = (challengeId) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          const isCompleted = challenge.completedBy.some(
            (user) => user.id === currentUserId
          );

          if (isCompleted) {
            // Remove user from completedBy
            return {
              ...challenge,
              completedBy: challenge.completedBy.filter(
                (user) => user.id !== currentUserId
              ),
              completed: challenge.id === "1" ? false : challenge.completed, // Only for demo purposes
            };
          } else {
            // Add user to completedBy
            const currentUser = {
              id: currentUserId,
              name: "Sarah",
              initial: "S",
            };
            return {
              ...challenge,
              completedBy: [...challenge.completedBy, currentUser],
              completed: challenge.id === "1" ? true : challenge.completed, // Only for demo purposes
            };
          }
        }
        return challenge;
      })
    );
  };

  const handleAddChallenge = () => {
    setAddChallengeOpen(true);
    setNewChallenge(defaultChallenge);
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
          {/* Admin button for adding challenges */}
          {isUserAdmin && (
            <Tooltip title="Add new challenge">
              <IconButton size="small" sx={{ color: "#5d4b3d" }} onClick={handleAddChallenge}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {challenges.map((challenge) => {
          const isUserCompleted = challenge.completedBy.some(
            (user) => user.id === currentUserId
          );

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
                <ChallengeDueDate>Due: {challenge.dueDate}</ChallengeDueDate>

                <CompletedBy>
                  {challenge.completedBy.length > 0 && (
                    <>
                      <CompletedText>Completed by:</CompletedText>
                      <StyledAvatarGroup max={5}>
                        {challenge.completedBy.map((user) => (
                          <Tooltip key={user.id} title={user.name}>
                            <Avatar>{user.initial}</Avatar>
                          </Tooltip>
                        ))}
                      </StyledAvatarGroup>
                      {challenge.completedBy.length > 5 && (
                        <Chip
                          size="small"
                          label={`+${challenge.completedBy.length - 5} more`}
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
