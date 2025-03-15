import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CoffeeIcon from "@mui/icons-material/Coffee";
import StarsIcon from "@mui/icons-material/Stars";

export default function Review() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
        .then((response) => setBook(response.data || []))
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [id]);
  return (
    <div className="flex mt-10 mb-10 ml-100 mr-100 justify-center font-merriweather">
      {book ? (
        <Box
          component={"div"}
          variant="outlined"
          className="bg-vanilla border border-brown solid p-8 space-y-12 w-full rounded-sm"
        >
          <div className="flex gap-x-4">
            <img src={book.volumeInfo.imageLinks.thumbnail} />
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl">{book.volumeInfo.title}</h2>
                <p className="text-grey">
                  by {book.volumeInfo.authors.join(",")}
                </p>
              </div>
              <div className="flex flex-col mt-2 mb-4 gap-x-4">
                <span>
                  <StarsIcon /> Rating
                </span>
                <Rating defaultValue={0.0} precision={0.5} size="large" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-5 w-full">
              <span className="w-full">
                <p>
                  <CalendarMonthIcon /> Start Date
                </p>
                <TextField fullWidth size="small" type="date" />
              </span>

              <span className="w-full">
                <p>
                  <CalendarMonthIcon /> End Date
                </p>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="date"
                />
              </span>
            </div>
            <Button variant="dark">Add Read Date</Button>
          </div>

          <div className="flex flex-col">
            <span>
              <LocalOfferIcon /> Tags
            </span>
            <div className="flex gap-x-4">
              <TextField fullWidth size="small" variant="outlined" />
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <CoffeeIcon /> Notes and Thoughts
            </div>
            <TextField size="large" variant="outlined" minRows={8} multiline />
            <div className="flex gap-x-2 mt-2">
              <Rating
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                max={1}
                variant="heart"
                size="small"
              />{" "}
              <p className="text-sm">Add to Favorites</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="dark" onClick={() => navigate(`/book/${book.id}`)}>
              Save Review
            </Button>
          </div>
        </Box>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
