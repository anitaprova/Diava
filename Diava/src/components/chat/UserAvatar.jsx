import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar } from "@mui/material";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: "#5d4b3d",
  color: "white",
  width: 40,
  height: 40,
  fontWeight: 500,
}));

const UserAvatar = ({ initial = "", src = null }) => {
  return <StyledAvatar src={src}>{initial}</StyledAvatar>;
};

export default UserAvatar;
