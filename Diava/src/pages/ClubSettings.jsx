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
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaHashtag } from "react-icons/fa";
import { useClub } from "../context/ClubContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import {
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function ClubSettings() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { currentClub, setCurrentClub } = useClub();
  const { currentUser } = useAuth();

  // Form states
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [newChannelName, setNewChannelName] = useState("");

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);

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
        description: clubDescription,
      });

      // Update the data for all members
      const clubDoc = await getDoc(clubRef);

      if (clubDoc.exists()) {
        const membersList = clubDoc.data().members;

        for (const member in membersList) {
          const userClubRef = doc(db, "UserClubs", member);

          await updateDoc(userClubRef, {
            [`${currentClub.uid}.clubInfo.clubname`]: clubName,
          });
        }

        alert("Club settings saved successfully!");
      } else {
        console.log("There was an error.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateClub = async () => {
    const clubRef = doc(db, "Clubs", currentClub.uid);
    const clubDoc = await getDoc(clubRef);

    if (clubDoc.exists()) {
      setCurrentClub(clubDoc.data());
    } else {
      console.log("Error getting club data");
      return;
    }
  };

  const handleAddChannel = async () => {
    if (!newChannelName.trim()) return;

    try {
      const clubRef = doc(db, "Clubs", currentClub.uid);
      const channelId = uuidv4();

      // Add channel to club
      await updateDoc(clubRef, {
        [`channels.${channelId}`]: {
          name: newChannelName,
          id: channelId,
          createdAt: serverTimestamp(),
        },
      });
      // Add channel to club chats
      await setDoc(doc(db, "ClubChats", channelId), { messages: [] });

      // Update club context
      updateClub();

      alert("Channel added successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChannel = async (channelId, removeInClub) => {
    try {
      const clubRef = doc(db, "Clubs", currentClub.uid);

      // Remove from clubs channel
      if (removeInClub) {
        await updateDoc(clubRef, {
          [`channels.${channelId}`]: deleteField(),
        });
      }

      // Remove from club chats
      await deleteDoc(doc(db, "ClubChats", channelId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      await deleteChannel(channelId, true);

      // Update club context
      updateClub();

      alert("Successfully deleted channel.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClub = async () => {
    try {
      const clubRef = doc(db, "Clubs", currentClub.uid);
      const clubDoc = await getDoc(clubRef);

      if (clubDoc.exists()) {
        const clubData = clubDoc.data();
        const membersList = clubData.members;
        const channelList = clubData.channels;

        // Delete all club channels in ClubChats
        for (const channel in channelList) {
          deleteChannel(channel, false);
        }

        // Delete club in UserClubs
        for (const member in membersList) {
          const userClubRef = doc(db, "UserClubs", member);

          await updateDoc(userClubRef, {
            [`${currentClub.uid}`]: deleteField(),
          });
        }

        // Delete club
        await deleteDoc(clubRef);

        alert("Club deleted successfully!");
        navigate("/chats");
      } else {
        console.log("There was an error deleting the club.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRoleChangeClick = (member) => {
    setSelectedMember(member);
    setRoleChangeDialogOpen(true);
  };

  const handleRemoveMemberClick = (member) => {
    setSelectedMember(member);
    setRemoveMemberDialogOpen(true);
  };

  const handleRoleChange = async (newRole) => {
    if (!selectedMember) return;

    try {
      const clubRef = doc(db, "Clubs", currentClub.uid);

      // Update member's role
      await updateDoc(clubRef, {
        [`members.${selectedMember[0]}.role`]: newRole,
      });

      // Update the club context
      updateClub();
      setRoleChangeDialogOpen(false);
      setSelectedMember(null);

      alert("Member role updated successfully!");
    } catch (error) {
      console.error("Error updating member role:", error);
      alert("Failed to update member role");
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      const clubRef = doc(db, "Clubs", currentClub.uid);
      const userClubRef = doc(db, "UserClubs", selectedMember[0]);

      // Remove member from club
      await updateDoc(clubRef, {
        [`members.${selectedMember[0]}`]: deleteField(),
      });

      // Remove club from user's clubs
      await updateDoc(userClubRef, {
        [currentClub.uid]: deleteField(),
      });

      // Update the club context
      updateClub();
      setRemoveMemberDialogOpen(false);
      setSelectedMember(null);

      alert("Member removed successfully!");
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
    }
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
              {currentClub?.channels &&
              Object.values(currentClub.channels).length > 0
                ? Object.entries(currentClub.channels)
                    .sort((a, b) => a[1].createdAt - b[1].createdAt)
                    .map((channel) => (
                      <ListItem
                        key={channel[0]}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteChannel(channel[0])}
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
                              {channel[1].name}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                : null}
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
              {currentClub?.members &&
              Object.values(currentClub.members).length > 0
                ? Object.entries(currentClub.members)
                    .sort((a, b) => a[1].joined - b[1].joined)
                    .map((member) => (
                      <ListItem
                        key={member[0]}
                        secondaryAction={
                          currentClub.members[currentUser?.uid]?.role ===
                            "Owner" &&
                          member[0] !== currentUser?.uid && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                size="small"
                                onClick={() => handleRoleChangeClick(member)}
                                sx={{ color: "#5d4b3d" }}
                              >
                                Change Role
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemoveMemberClick(member)}
                              >
                                Remove
                              </Button>
                            </Box>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#5d4b3d" }}>
                            {member[1].username?.[0]?.toUpperCase() || "?"}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member[1].username}
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {member[1].role
                                  ? member[1].role.charAt(0).toUpperCase() +
                                    member[1].role.slice(1)
                                  : ""}
                              </Typography>
                              {member[1].role === "Owner" && (
                                <Chip
                                  size="small"
                                  label="Owner"
                                  sx={{
                                    bgcolor: "#5d4b3d",
                                    color: "white",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                : null}
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

      {/* Role Change Dialog */}
      <Dialog
        open={roleChangeDialogOpen}
        onClose={() => setRoleChangeDialogOpen(false)}
      >
        <DialogTitle>Change Member Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a new role for {selectedMember?.[1]?.username}
          </DialogContentText>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => handleRoleChange("Admin")}
              disabled={selectedMember?.[1]?.role === "Admin"}
              sx={{ color: "#5d4b3d", borderColor: "#5d4b3d" }}
            >
              Make Admin
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleRoleChange("Member")}
              disabled={selectedMember?.[1]?.role === "Member"}
              sx={{ color: "#5d4b3d", borderColor: "#5d4b3d" }}
            >
              Make Member
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRoleChangeDialogOpen(false)}
            sx={{ color: "#5d4b3d" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog
        open={removeMemberDialogOpen}
        onClose={() => setRemoveMemberDialogOpen(false)}
      >
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {selectedMember?.[1]?.username} from
            the club? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRemoveMemberDialogOpen(false)}
            sx={{ color: "#5d4b3d" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveMember}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
