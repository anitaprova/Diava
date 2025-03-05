import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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
    <div className="flex font-merriweather mr-10 gap-x-20">
      <div className="bg-sand p-5 pr-20">
        <FormControl>
          <FormLabel>
            <p className="font-merriweather text-black text-lg">Search by</p>
          </FormLabel>
          <RadioGroup defaultValue="title">
            <FormControlLabel value="title" control={<Radio />} label="Title" />
            <FormControlLabel
              value="author"
              control={<Radio />}
              label="Author"
            />
            <FormControlLabel
              value="book club"
              control={<Radio />}
              label="Book Club"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="mt-5">
        <h2 className="text-darkbrown">
          {results.length} for "{query}"
        </h2>
        <ul className="flex flex-wrap gap-15">
          {results.length > 0 ? (
            results.map((book) => (
              <li key={book.id}>
                <Card
                  className="h-[400px] w-50"
                  onClick={() => navigate(`/book/${book.id}`)}
                  style={{ backgroundColor: "transparent" }}
                >
                  <CardMedia
                    component="img"
                    image={book.volumeInfo.imageLinks.thumbnail}
                    sx={{
                      height: 250,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography component="div">
                      {book.volumeInfo.title}
                    </Typography>
                    <Typography variant="body">
                      by {book.volumeInfo.authors.map((author) => author)}
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
    </div>
  );
}
