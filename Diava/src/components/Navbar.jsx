import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { debounce } from "@mui/material/utils";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Navbar() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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

  console.log(results);

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h4">DIAVA</Typography>

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

          <IconButton color="inherit">
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );