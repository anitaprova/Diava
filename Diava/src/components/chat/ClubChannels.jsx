import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { FaHashtag } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";

const ChannelsContainer = styled(Box)(({ theme }) => ({
  width: 230,
  backgroundColor: "#aaa396", // Gray color
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #ddd",
  overflowY: "auto",
}));

const ClubHeader = styled(Box)(({ theme }) => ({
  padding: "16px",
  borderBottom: "1px solid #ddd",
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

const ClubChannels = ({
  selectedClub,
  selectedChannel,
  setSelectedChannel,
}) => {
  if (!selectedClub) {
    return (
      <ChannelsContainer>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            Select a club to view channels
          </Typography>
        </Box>
      </ChannelsContainer>
    );
  }

  return (
    <ChannelsContainer>
      <ClubHeader>
        <Typography variant="h6" fontWeight={600}>
          {selectedClub.name}
        </Typography>
      </ClubHeader>

      {/* Text Channels */}
      <SectionHeader>Channels</SectionHeader>
      <List disablePadding>
        {selectedClub.channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            isSelected={selectedChannel?.id === channel.id}
            onClick={() => setSelectedChannel(channel)}
          >
            <ChannelText
              primary={
                <>
                  <FaHashtag size={14} />
                  {channel.name}
                </>
              }
            />
          </ChannelItem>
        ))}
      </List>

      {/* Features Section */}
      <Box sx={{ marginTop: "auto" }}>
        <Divider />
        <SectionHeader>Features</SectionHeader>
        <List disablePadding>
          <ChannelItem>
            <ChannelText
              primary={
                <>
                  <MdBarChart size={16} />
                  Book Voting
                </>
              }
            />
          </ChannelItem>
          <ChannelItem>
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
    </ChannelsContainer>
  );
};

export default ClubChannels;
