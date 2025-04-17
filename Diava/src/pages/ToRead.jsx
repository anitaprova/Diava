import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { auth } from "../firebase/firebase"; // adjust if path differs
import { supabase } from "../client";

export default function ToRead() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchCurrentlyReading = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
          //Use inner join maybe?
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
          .eq("lists.name", "Want to Read");
  
        if (error) throw error;
  
        setBooks(data || []);
      } catch (error) {
        console.error("Error fetching Want to Read books:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCurrentlyReading();
  }, []);
  return (
    <div className="font-merriweather ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">To Read Pile</Typography>
      <Box className="bg-mocha rounded-lg grid grid-cols-2 shadow-custom">
        {loading ? (
          <p>Loading...</p>
        ) : books.length > 0 ? (
          books.map((book) => {
            const {
              google_book_id,
              title,
              authors,
              page_count,
              average_rating,
              categories = [],
              thumbnail,
            } = book;

            const genres = [
              ...new Set(
                categories.flatMap((cat) =>
                  cat.split("/").map((g) => g.trim())
                )
              ),
            ];

            return (
              <div
                key={google_book_id}
                className="bg-vanilla rounded-md p-6 w-fit flex mt-5 ml-5 mb-5 gap-x-5"
              >
                <img
                  src={thumbnail}
                  onClick={() => navigate(`/book/${google_book_id}`)}
                  className="w-fit cursor-pointer"
                  alt={title}
                />
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="subtitle2">
                      By: {authors}
                    </Typography>
                  </div>

                  <Typography variant="body2" className="flex flex-row gap-x-8">
                    <Typography className="flex gap-x-2">
                      <AutoStoriesIcon fontSize="small" />
                      {page_count} pages
                    </Typography>

                    <Typography className="flex gap-x-2">
                      <AccessTimeIcon fontSize="small" /> ~
                      {Math.floor(page_count / 0.6 / 60)} hrs
                    </Typography>
                  </Typography>

                  <div className="flex mt-2 mb-4 gap-x-4">
                    <Rating
                      value={average_rating}
                      precision={0.5}
                      size="large"
                      readOnly
                    />
                    <p className="inline-block align-middle text-lg">
                      {average_rating}
                    </p>
                  </div>

                  <ul className="flex flex-wrap text-sm gap-3">
                    {genres.map((genre, index) => (
                      <li
                        key={index}
                        className="bg-sand p-1 text-center rounded-sm w-fit"
                      >
                        <LocalOfferIcon color="secondary" /> {genre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <p>Nothing added yet!</p>
        )}
      </Box>
    </div>
  );
}