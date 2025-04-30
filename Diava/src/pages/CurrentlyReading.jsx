import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { auth } from "../firebase/firebase"; // Assuming you're using Firebase for auth
import { supabase } from "../client"; // Assuming you're using Supabase for data storage

export default function CurrentlyReading() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentlyReading = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Fetch books from the "Currently Reading" list
        const { data, error } = await supabase
          .from("list_books")
          .select(`
            *,
            lists!inner (
              id,
              name,
              user_id
            )
          `)
          .eq("lists.user_id", userId)
          .eq("lists.name", "Currently Reading");

        if (error) throw error;
        const currentProgress = [];
        for (const book of data || []) {
          const { data: progressData, error: progressError } = await supabase
            .from("progress")
            .select("progress")
            .eq("user_id", userId)
            .eq("google_books_id", book.google_books_id)
            .order("progress", { ascending: false })
  
          if (progressError) {
            console.error(`Error fetching progress for ${book.google_books_id}:`, progressError.message);
          }
          currentProgress.push({
            ...book,
            progress: progressData?.[0]?.progress || 0, 
          });
        }
        setBooks(currentProgress);
      } catch (error) {
        console.error("Error fetching Currently Reading books:", error.message);
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
              key={book.google_books_id}
              className="bg-vanilla rounded-md p-6 w-fit flex m-5 gap-x-5"
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                onClick={() => navigate(`/book/${book.google_books_id}`)}
                className="w-fit cursor-pointer"
              />
              <div className="space-y-4">
                <div>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="subtitle2">By: {book.author}</Typography>
                </div>

                <div className="space-y-5">
                  <Typography>Reading Progress:</Typography>
                  <div className="flex align-center w-[300px]">
                    <Box sx={{ width: "100%", mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={book.progress || 0} // Default to 0 if progress is undefined
                        sx={{ height: "100%" }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2">{book.progress || 0}%</Typography>
                    </Box>
                  </div>

                  <Button
                    variant="dark"
                    onClick={() => navigate(`/update/${book.google_books_id}`)}
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
