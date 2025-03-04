import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

export default function Navbar() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchBook = (event) => {
    if (event.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h3">DIAVA</Typography>

        <div className="bg-sand flex items-center flex-grow mx-30 rounded-2xl px-3">
          <SearchIcon className="mr-2" />
          <InputBase
            placeholder="Search..."
            className="outline-none w-full text-lg text-grey"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={searchBook}
          />
        </div>

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
