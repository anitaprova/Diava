import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

const ColorOption = styled(Box)(({ theme, color, selected }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: color,
  cursor: "pointer",
  border: selected ? `3px solid ${theme.palette.primary.main}` : "none",
  margin: theme.spacing(0.5),
}));

const clubColors = [
  "#5d4b3d", // Brown
  "#7c6e58", // Lighter brown
  "#a39178", // Tan
  "#cec1a8", // Light tan
  "#3a6b35", // Green
  "#5e8c61", // Sage
  "#8fb996", // Light green
  "#4a6fa5", // Blue
  "#6b88b0", // Light blue
  "#8da9c4", // Pale blue
  "#a44a3f", // Red
  "#c86558", // Light red
  "#e28f83", // Pale red
];

const categories = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Horror",
  "Biography",
  "History",
  "Poetry",
  "Young Adult",
  "Children's",
  "Classics",
  "Contemporary",
];

export default function CreateClubPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(clubColors[0]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [channels, setChannels] = useState([
    { name: "general", description: "General discussion" },
  ]);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");

  const steps = ["Basic Info", "Categories", "Privacy", "Channels", "Review"];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddCategory = () => {
    if (newCategory && !selectedCategories.includes(newCategory)) {
      setSelectedCategories([...selectedCategories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      setChannels([
        ...channels,
        {
          name: newChannelName.toLowerCase().replace(/\s+/g, "-"),
          description: newChannelDescription || "",
        },
      ]);
      setNewChannelName("");
      setNewChannelDescription("");
    }
  };

  const handleRemoveChannel = (index) => {
    const newChannels = [...channels];
    newChannels.splice(index, 1);
    setChannels(newChannels);
  };

  const handleCreateClub = () => {
    // Create the club object
    const newClub = {
      id: `club-${Date.now()}`,
      name: clubName,
      description: clubDescription,
      color: selectedColor,
      categories: selectedCategories,
      privacy: privacy,
      initial: clubName.charAt(0).toUpperCase(),
      channels: channels.map((channel, index) => ({
        id: `channel-${Date.now()}-${index}`,
        name: channel.name,
        description: channel.description,
      })),
      members: [
        { id: "m1", name: "Current User", role: "admin", initial: "C" },
      ],
      features: [
        { id: `f-${Date.now()}-1`, name: "Book Voting", icon: "chart" },
        { id: `f-${Date.now()}-2`, name: "Challenges", icon: "trophy" },
      ],
    };

    // In a real app, you would send this to your backend
    console.log("Creating club:", newClub);

    // Navigate to the chat page
    navigate("/chat");

    // Note for backend: Need API endpoint to create a new club
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Club Details
            </Typography>
            <TextField
              label="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
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
            />
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Club Color
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {clubColors.map((color) => (
                <ColorOption
                  key={color}
                  color={color}
                  selected={color === selectedColor}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </Box>
          </Box>
        );

      case 1: // Categories
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Club Categories
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Select categories that best describe your club's focus.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TextField
                label="Add Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddCategory}
                disabled={!newCategory}
                sx={{ bgcolor: "#5d4b3d", "&:hover": { bgcolor: "#433422" } }}
              >
                Add
              </Button>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Suggested Categories
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", mb: 3 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => {
                    if (!selectedCategories.includes(category)) {
                      setSelectedCategories([...selectedCategories, category]);
                    }
                  }}
                  sx={{
                    m: 0.5,
                    bgcolor: selectedCategories.includes(category)
                      ? "#cec1a8"
                      : "default",
                  }}
                />
              ))}
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Selected Categories
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {selectedCategories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={() => handleRemoveCategory(category)}
                  sx={{ m: 0.5, bgcolor: "#5d4b3d", color: "white" }}
                />
              ))}
            </Box>
          </Box>
        );

      case 2: // Privacy
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Club Privacy
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Privacy Setting</InputLabel>
              <Select
                value={privacy}
                label="Privacy Setting"
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <MenuItem value="public">Public - Anyone can join</MenuItem>
                <MenuItem value="private">Private - Invitation only</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" fontWeight="bold">
                {privacy === "public" ? "Public Club" : "Private Club"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {privacy === "public"
                  ? "Your club will be visible to everyone. Anyone can join without approval."
                  : "Your club will only be visible to members. New members can only join with an invitation."}
              </Typography>
            </Box>
          </Box>
        );

      case 3: // Channels
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Club Channels
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Channels are where your club members will communicate. Every club
              starts with a #general channel.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Add Channel
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    label="Channel Name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    fullWidth
                    size="small"
                    helperText="Use lowercase letters and hyphens"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Description (optional)"
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    onClick={handleAddChannel}
                    disabled={!newChannelName.trim()}
                    sx={{
                      height: "40px",
                      bgcolor: "#5d4b3d",
                      "&:hover": { bgcolor: "#433422" },
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Channels
            </Typography>
            <Paper variant="outlined" sx={{ p: 0 }}>
              {channels.map((channel, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      index < channels.length - 1 ? "1px solid #ddd" : "none",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">#{channel.name}</Typography>
                    {channel.description && (
                      <Typography variant="body2" color="textSecondary">
                        {channel.description}
                      </Typography>
                    )}
                  </Box>
                  {index > 0 && ( // Don't allow deleting the general channel
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveChannel(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
        );

      case 4: // Review
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Club Details
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: selectedColor, mr: 2 }}>
                  {clubName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5">{clubName}</Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {clubDescription}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Categories
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Privacy
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {privacy === "public"
                  ? "Public - Anyone can join"
                  : "Private - Invitation only"}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Channels ({channels.length})
              </Typography>
              <Box>
                {channels.map((channel, index) => (
                  <Typography key={index} variant="body2">
                    #{channel.name}
                    {channel.description && ` - ${channel.description}`}
                  </Typography>
                ))}
              </Box>
            </Paper>

            <Typography variant="body2" color="textSecondary">
              You'll be the admin of this club and can change these settings
              later.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton onClick={() => navigate("/chat")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create a New Club
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ p: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && !clubName.trim()}
              sx={{ bgcolor: "#5d4b3d", "&:hover": { bgcolor: "#433422" } }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleCreateClub}
              sx={{ bgcolor: "#5d4b3d", "&:hover": { bgcolor: "#433422" } }}
            >
              Create Club
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
