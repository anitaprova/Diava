import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function SearchResults() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);

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
    <div>
      <h2>Search Results for "{query}"</h2>
      <ul>
        {results.length > 0 ? (
          results.map((book) => <li key={book.id}>{book.volumeInfo.title}</li>)
        ) : (
          <p>No results found.</p>
        )}
      </ul>
    </div>
  );
}
