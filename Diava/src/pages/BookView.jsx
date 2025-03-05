import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import Button from "@mui/material/Button";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Rating from "@mui/material/Rating";
import ReactHtmlParser from "react-html-parser";

export default function BookDetail() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
        .then((response) => setBook(response.data || []))
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [id]);

  return (
    <div className="font-merriweather mr-25 ml-25 mt-15 ">
      {book ? (
        <div className="grid grid-cols-4 gap-x-8">
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            className="w-75 drop-shadow-custom"
          />
          <Box className="col-span-2">
            <Typography variant="title" component="div" fontWeight="bold">
              {book.volumeInfo.title}
            </Typography>

            <Typography variant="subtitle" color="text.secondary">
              by {book.volumeInfo.authors?.join(", ")}
            </Typography>

            <Typography variant="body" className="flex flex-row gap-x-8">
              <Typography className="flex gap-x-2">
                <AutoStoriesIcon fontSize="small" />
                {book.volumeInfo.pageCount} pages
              </Typography>

              <Typography className="flex gap-x-2">
                <AccessTimeIcon fontSize="small" /> ~
                {Math.floor(book.volumeInfo.pageCount / 0.5 / 60)} hrs
              </Typography>
            </Typography>

            <div className="flex mt-2 mb-4 gap-x-4">
              <Rating
                value={book.volumeInfo.averageRating}
                precision={0.5}
                size="large"
                readOnly
              />
              <p className="inline-block align-middle text-lg">
                {book.volumeInfo.averageRating}
              </p>
            </div>

            <Box className="border p-3 border-grey">
              <Typography variant="h5">Description</Typography>
              <p
                dangerouslySetInnerHTML={{
                  __html: book.volumeInfo.description,
                }}
              />
            </Box>
          </Box>

          <div className="flex flex-col gap-y-5 h-fit">
            <Button variant="soft">Add to List</Button>
            <Button variant="dark">Add Review</Button>
          </div>
        </div>
      ) : (
        <p>
          <CircularProgress color="secondary" />
          Loading...
        </p>
      )}
    </div>
  );
}
