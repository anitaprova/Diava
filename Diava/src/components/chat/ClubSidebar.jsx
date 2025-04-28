import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserAvatar from "./UserAvatar";

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 70,
  backgroundColor: "rgba(167, 161, 149, 0.75)", // A7A195 with 75% opacity
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 0",
  overflowY: "auto",
}));

const ClubAvatarWrapper = styled(Box)(({ isSelected }) => ({
  margin: "8px 0",
  padding: "4px",
  borderRadius: "50%",
  backgroundColor: isSelected ? "#cec1a8" : "transparent",
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: isSelected ? "#cec1a8" : "rgba(184, 179, 167, 0.8)",
  },
}));

const AddButtonContainer = styled(Box)({
  marginTop: "auto",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "center",
  width: "100%",
});

const AddButtonWrapper = styled(Box)({
  backgroundColor: "#5d4b3d",
  borderRadius: "50%",
  padding: "2px",
  "&:hover": {
    backgroundColor: "#433422",
  },
});

const StyledAvatar = styled(UserAvatar)({
  width: 48,
  height: 48,
});

const ClubSidebar = ({
  clubs,
  selectedClub,
  setSelectedClub,
  onCreateClub,
}) => {
  const handleCreateClub = async () => {
    // Call the parent component's handler to show the create club dialog
    if (onCreateClub) {
      onCreateClub();
    }
  };

  return (
    <SidebarContainer>
      {clubs ? (
        Object.entries(clubs)
        .sort((a, b) => a[1].clubInfo.joined - b[1].clubInfo.joined)
          .map((club) => (
            <Tooltip key={club[0]} title={club[1].clubInfo.clubname} placement="right">
              <ClubAvatarWrapper
                isSelected={selectedClub?.id === club[0]}
                onClick={() => setSelectedClub(club[1])}
              >
                <StyledAvatar initial={club[1].clubInfo.clubname[0].toUpperCase()} />
              </ClubAvatarWrapper>
            </Tooltip>
          ))
      ) : null}

      {/* Add Club Button at the bottom */}
      <AddButtonContainer>
        <Tooltip title="Create New Club" placement="right">
          <AddButtonWrapper>
            <IconButton
              onClick={handleCreateClub}
              sx={{ color: "white", padding: "8px" }}
            >
              <AddIcon />
            </IconButton>
          </AddButtonWrapper>
        </Tooltip>
      </AddButtonContainer>
    </SidebarContainer>
  );
};

export default ClubSidebar;
