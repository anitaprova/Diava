import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Rating from "@mui/material/Rating";


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

  // console.log(book)

  return (
    <div className="mr-50 ml-50 mt-25 ">
      {book ? (
        <div className="">
          <img src={book.volumeInfo.imageLinks.thumbnail} />
          <div>
            <Typography variant="h5" component="div">
              {book.volumeInfo.title}
            </Typography>
            <Typography>
              <AutoStoriesIcon /> {book.volumeInfo.pageCount} <AccessTimeIcon />
              ~{Math.floor(book.volumeInfo.pageCount / 0.5 / 60)}
            </Typography>
            <Typography variant="body">
              by {book.volumeInfo.authors?.join(", ")}
            </Typography>
            <Rating name="no-value" value={null} />
          </div>
          <div>
            <Button></Button>
            <Button>Add Review</Button>
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
