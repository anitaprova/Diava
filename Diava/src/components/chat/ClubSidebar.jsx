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
} from "@mui/material";
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

const StyledAvatar = styled(UserAvatar)({
  width: 48,
  height: 48,
});

const ClubSidebar = ({ clubs, selectedClub, setSelectedClub }) => {
  return (
    <SidebarContainer>
      {clubs.map((club) => (
        <Tooltip key={club.id} title={club.name} placement="right">
          <ClubAvatarWrapper
            isSelected={selectedClub?.id === club.id}
            onClick={() => setSelectedClub(club)}
          >
            <StyledAvatar initial={club.initial} />
          </ClubAvatarWrapper>
        </Tooltip>
      ))}
    </SidebarContainer>
  );
};

export default ClubSidebar;
