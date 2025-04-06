import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaHashtag } from "react-icons/fa";
import { useClub } from "../context/ClubContext";
import { db } from "../firebase/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";

export default function ClubSettings() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { currentClub } = useClub();

  // Form states
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [newChannelName, setNewChannelName] = useState("");

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false);

  useEffect(() => {
    setClub(currentClub);
    setClubName(currentClub.clubname);
    setClubDescription(currentClub.description);
    setLoading(false);
  }, [currentClub.uid]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = async () => {
    if (clubName.length === 0) {
      alert("Invalid club name.");
      return;
    }
    if (clubName.length > 36) {
      alert("Club name is too long.");
      return;
    }

    try {
      // Get the club doccument
      const clubRef = doc(db, "Clubs", currentClub.uid);

      await updateDoc(clubRef, {
        clubname: clubName,
        description: clubDescription
      });

      // Update the data for all members
      const clubDoc = await getDoc(clubRef);

      if (clubDoc.exists()) {
        const membersList = clubDoc.data().members;

        for (const member in membersList) {
          const userClubRef = doc(db, "UserClubs", member);

          await updateDoc(userClubRef, {
            [`${currentClub.uid}.clubInfo.clubname`]: clubName
          });
        }

        alert("Club settings saved successfully!");
      }
      else {
        console.log("There was an error.");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleAddChannel = () => {
    if (!newChannelName.trim()) return;

    // In a real app, you would send this to your backend
    const newChannel = {
      id: `${club.id}-${club.channels.length + 1}`,
      name: newChannelName.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    const updatedClub = {
      ...club,
      channels: [...club.channels, newChannel],
    };

    setClub(updatedClub);

    // Store the updated club in localStorage so ChatPage can access it
    const storedClubs = JSON.parse(localStorage.getItem("clubs") || "[]");
    const updatedClubs = storedClubs.map((c) =>
      c.id === updatedClub.id ? updatedClub : c
    );
    localStorage.setItem("clubs", JSON.stringify(updatedClubs));

    setNewChannelName("");
    setAddChannelDialogOpen(false);

    // Show feedback to the user
    alert("Channel added successfully!");
  };

  const handleDeleteChannel = (channelId) => {
    // In a real app, you would send this to your backend
    setClub({
      ...club,
      channels: club.channels.filter((channel) => channel.id !== channelId),
    });
    // Note for backend: Need API endpoint to delete a channel
  };

  const handleDeleteClub = () => {
    // In a real app, you would send this to your backend
    alert("Club deleted successfully!");
    navigate("/chats");
    // Note for backend: Need API endpoint to delete a club
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Club Settings
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="General" />
          <Tab label="Channels" />
          <Tab label="Members" />
          <Tab label="Danger Zone" />
        </Tabs>

        {/* General Settings Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <TextField
              label="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <TextField
              label="Club Description"
              value={clubDescription}
              onChange={(e) => setClubDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              onClick={handleSaveSettings}
              sx={{
                bgcolor: "#5d4b3d",
                color: "white",
                "&:hover": {
                  bgcolor: "#433422",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        )}

        {/* Channels Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Channels</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddChannelDialogOpen(true)}
                sx={{
                  bgcolor: "#5d4b3d",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#433422",
                  },
                }}
              >
                Add Channel
              </Button>
            </Box>
            <List>
              {club.channels.map((channel) => (
                <ListItem
                  key={channel.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteChannel(channel.id)}
                      sx={{ color: "#5d4b3d" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaHashtag size={14} style={{ marginRight: 8 }} />
                        {channel.name}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Members Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <List>
            {currentClub?.members && Object.values(currentClub.members).length > 0 ? (
              Object.entries(currentClub.members)
                .sort((a, b) => a[1].joined - b[1].joined)
                .map((member) => (
                  <ListItem key={member[0]}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#5d4b3d" }}>
                        {member[1].username?.[0]?.toUpperCase() || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member[1].username}
                      secondary={
                        member[1].role
                          ? member[1].role.charAt(0).toUpperCase() + member[1].role.slice(1)
                          : ""
                      }
                    />
                  </ListItem>
                ))
              ) : null}
            </List>
          </Box>
        )}

        {/* Danger Zone Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "error.main" }}>
              Danger Zone
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderColor: "error.main",
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Delete this club
                </Typography>
                <Typography variant="body2">
                  Once you delete a club, there is no going back. Please be
                  certain.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Club
              </Button>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Add Channel Dialog */}
      <Dialog
        open={addChannelDialogOpen}
        onClose={() => setAddChannelDialogOpen(false)}
      >
        <DialogTitle>Add New Channel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for the new channel. Channel names should be lowercase
            and use hyphens instead of spaces.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            variant="outlined"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddChannelDialogOpen(false)}
            sx={{
              color: "#5d4b3d",
              "&:hover": {
                color: "#433422",
                backgroundColor: "#f1eada", // Light sand color for better contrast
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddChannel}
            variant="contained"
            sx={{
              bgcolor: "#5d4b3d",
              color: "white",
              "&:hover": {
                bgcolor: "#433422",
                color: "white",
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Club Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete the club,
            all its channels, and remove all members.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#5d4b3d",
              "&:hover": {
                color: "#433422",
                backgroundColor: "#f1eada", // Light sand color for better contrast
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteClub}
            variant="contained"
            sx={{
              bgcolor: "#f44336",
              color: "white",
              "&:hover": {
                bgcolor: "#d32f2f",
                color: "white",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
