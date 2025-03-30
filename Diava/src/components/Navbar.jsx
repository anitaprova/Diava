import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, IconButton, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Logout from "@mui/icons-material/Logout";
import { debounce } from "@mui/material/utils";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Navbar() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
      console.log("Signed out successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const searchBook = (event) => {
    if (event.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const searchDelayed = debounce((query) => {
    if (query.trim()) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
    } else {
      setResults([]);
    }
  }, 1000);

  useEffect(() => {
    searchDelayed(query);
  }, [query]);

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h4" onClick={() => navigate(`/home`)}  sx={{cursor: "pointer"}}>
          DIAVA
        </Typography>

        <div className="bg-sand flex items-center flex-grow mx-30 rounded-2xl px-3">
          <SearchIcon className="mr-2" />
          <Stack className="outline-none w-full text-lg text-grey">
            <Autocomplete
              sx={{
                width: "full",
                borderRadius: "50px",
                "& .MuiInputBase-root": {
                  padding: "0px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
              }}
              freeSolo
              getOptionLabel={(result) => `${result.volumeInfo?.title}`}
              options={results}
              onInputChange={(event, newValue) => setQuery(newValue)}
              onKeyDown={searchBook}
              onChange={(event, selectedBook) => {
                if (selectedBook) {
                  navigate(`/book/${selectedBook.id}`);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              )}
              renderOption={(props, result) => (
                <Box
                  component="li"
                  onChange={() => navigate(`/book/${result.id}`)}
                  {...props}
                >
                  <img
                    className="w-10 mr-5"
                    src={result.volumeInfo?.imageLinks.smallThumbnail}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium bold">
                      {result.volumeInfo?.title}
                    </span>
                    <span className="text-sm text-grey">
                      by {result.volumeInfo?.authors?.join(", ")}
                    </span>
                  </div>
                </Box>
              )}
            />
          </Stack>
        </div>

        <div className="flex gap-x-6">
          <IconButton color="inherit">
            <ChatBubbleIcon fontSize="large" />
          </IconButton>

          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              color="inherit"
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => navigate(`/profile`)}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
