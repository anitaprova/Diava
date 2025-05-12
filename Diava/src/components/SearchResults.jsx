import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { debounce } from "@mui/material/utils";
import axios from "axios";

export default function SearchResults() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q"));
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState(searchParams.get("type"));
  const navigate = useNavigate();

  const handleSearch = debounce(() => {
    if (searchType == "title" && query) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
    } else if (searchType == "author" && query) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
    } else if (searchType == "genre" && query) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
    } else if (searchType == "isbn" && query) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
    } else if (searchType == "publisher" && query) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=inpublisher:${query}&key=${API_KEY}`
        )
        .then((response) => setResults(response.data.items || []))
        .catch((error) => console.error("Error fetching books:", error));
      }
  }, 500);

  
  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, []);

  return (
    <div className="grid grid-cols-5 font-merriweather gap-x-10">
      <div className="col-span-1 bg-sand p-5 h-full">
        <FormControl>
          <FormLabel>
            <p className="font-merriweather text-black text-lg">Search by</p>
          </FormLabel>
          <div className="flex">
            <TextField
              variant="outlined"
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button onClick={handleSearch} variant="dark">
              Search
            </Button>
          </div>

          <RadioGroup
            defaultValue="title"
            onChange={(event, newValue) => setSearchType(newValue)}
          >
            <FormControlLabel value="title" control={<Radio />} label="Title" />
            <FormControlLabel
              value="author"
              control={<Radio />}
              label="Author"
            />
            <FormControlLabel value="genre" control={<Radio />} label="Genre" />
            <FormControlLabel value="isbn" control={<Radio />} label="ISBN" />
            <FormControlLabel
              value="publisher"
              control={<Radio />}
              label="Publisher"
            />
            <FormControlLabel
              value="book club"
              control={<Radio />}
              label="Book Club"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="col-span-4 mt-5">
        <Typography className="text-darkbrown">
          {results.length} results for "{query}"
        </Typography>
        <ul className="flex flex-wrap gap-10">
          {results.length > 0 ? (
            results.map((book) => (
              <li key={book.id}>
                <Card
                  className="h-[400px] w-50 cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                  style={{ backgroundColor: "transparent" }}
                >
                  <CardMedia
                    component="img"
                    image={book.volumeInfo?.imageLinks?.thumbnail}
                    sx={{
                      height: 250,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography component="div" noWrap>
                      {book.volumeInfo.title}
                    </Typography>
                    <Typography variant="body" noWrap>
                      by {book?.volumeInfo?.authors?.map((author) => author).join(", ")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {book.volumeInfo.description?.substring(0, 50)}
                      {book.volumeInfo.description?.length > 50 ? "..." : ""}
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
