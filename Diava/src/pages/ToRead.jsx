import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Rating from "@mui/material/Rating";
import { auth } from "../firebase/firebase";
import { supabase } from "../client";

export default function ToRead() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToReadBooks = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const { data, error } = await supabase
          .from("list_books")
          .select(
            `
            *,
            lists!inner (
              id,
              name,
              user_id
            )
          `
          )
          .eq("lists.user_id", userId)
          .eq("lists.name", "Want to Read");

        if (error) throw error;

        const mappedBooks = await Promise.all(
          (data || []).map(async (book) => {
            let pageCount = null;
            let averageRating = null;

            try {
              const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${book.google_books_id}`
              );
              const result = await response.json();
              pageCount = result.volumeInfo?.pageCount || null;
            } catch (err) {
              console.error("Failed to fetch from Google Books API:", err);
            }

            try {
              const { data: reviews, error: reviewError } = await supabase
                .from("reviews")
                .select("rating")
                .eq("book_id", book.google_books_id);

              if (reviewError) throw reviewError;

              if (reviews.length > 0) {
                const total = reviews.reduce((sum, r) => sum + r.rating, 0);
                averageRating = total / reviews.length;
              }
            } catch (err) {
              console.error("Failed to fetch reviews:", err.message);
            }

            return {
              ...book,
              pageCount,
              averageRating,
            };
          })
        );
        setBooks(mappedBooks);
      } catch (error) {
        console.error("Error fetching Want to Read books:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToReadBooks();
  }, []);

  return (
    <div className="font-merriweather ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">Want to Read</Typography>
      <Box className="bg-mocha shadow-custom w-full grid grid-cols-2 rounded-lg gap-10 p-10">
        {loading ? (
          <p>Loading...</p>
        ) : books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.google_books_id}
              className="bg-vanilla rounded-md p-6 w-full flex gap-x-5"
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                onClick={() => navigate(`/book/${book.google_books_id}`)}
                className="w-[120px] h-auto object-cover cursor-pointer"
              />
              <div className="space-y-4">
                <div>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="subtitle2">By: {book.author}</Typography>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <AutoStoriesIcon fontSize="small" />
                    <Typography variant="body2">
                      {book.pageCount ? `${book.pageCount} pages` : "Page count unknown"}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                      ~{Math.floor((book?.pageCount || 0) / 45)} hrs
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Rating
                    name="average-rating"
                    value={book.averageRating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2">
                    {book.averageRating ? `${book.averageRating.toFixed(1)} / 5` : "Not availble"}
                  </Typography>
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
