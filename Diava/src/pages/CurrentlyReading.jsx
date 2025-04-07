import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { auth } from "../firebase/firebase";

export default function CurrentlyReading() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentlyReading = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5001/list_books/${userId}/Currently Reading`
        );
        setBooks(response.data || []);
      } catch (error) {
        console.error("Error fetching Currently Reading books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyReading();
  }, []);

  return (
    <div className="font-merriweather ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">Currently Reading</Typography>
      <Box className="bg-mocha shadow-custom w-fit grid grid-cols-2 rounded-lg">
        {loading ? (
          <p>Loading...</p>
        ) : books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.google_book_id}
              className="bg-vanilla rounded-md p-6 w-fit flex m-5 gap-x-5"
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                onClick={() => navigate(`/book/${book.google_book_id}`)}
                className="w-fit cursor-pointer"
              />
              <div className="space-y-4">
                <div>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="subtitle2">By {book.authors}</Typography>
                </div>

                <div className="space-y-5">
                  <Typography>Reading Progress:</Typography>
                  <div className="flex align-center">
                    <Box sx={{ width: "100%", mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={book.progress || 60} // replace with actual value if available
                        sx={{ height: "100%" }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2">
                        {book.progress || 60}%
                      </Typography>
                    </Box>
                  </div>

                  <Button
                    variant="dark"
                    onClick={() => navigate(`/update/${book.google_book_id}`)}
                  >
                    Update Progress
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nothing added yet!</p>
        )}
      </Box>
    </div>
  );
}