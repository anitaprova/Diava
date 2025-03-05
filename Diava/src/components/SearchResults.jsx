import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";

export default function SearchResults() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [query]);

  return (
    <div className="mr-15 ml-15">
      <h2>Search Results for "{query}"</h2>
      <ul className="grid grid-cols-3 gap-5">
        {results.length > 0 ? (
          results.map((book) => (
            <li key={book.id}>
              <Card onClick={() => navigate(`/book/${book.id}`)}>
                <CardMedia
                  component="img"
                  image={book.volumeInfo.imageLinks.thumbnail}
                  height="140"
                  className="h-[100%]"
                />
                <Typography variant="h5" component="div">
                  {book.volumeInfo.title}
                </Typography>
                <CardContent>
                  <Typography variant="body">
                    {book.volumeInfo.authors.map((author) => author)}
                  </Typography>
                </CardContent>
              </Card>
            </li>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </ul>
    </div>
  );
}
