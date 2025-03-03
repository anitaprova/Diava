import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

export default function Book() {
  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h3">DIAVA</Typography>

        <form className="flex-grow mx-30">
          <div className="bg-sand flex items-center rounded-2xl px-3">
            <SearchIcon className="mr-2" />
            <InputBase
              placeholder="Search..."
              className="outline-none w-full text-lg text-grey"
            />
          </div>
        </form>

        <div className="flex gap-x-6">
          <IconButton color="inherit">
            <ChatBubbleIcon fontSize="large" />
          </IconButton>

          <IconButton color="inherit">
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
