import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";  // Import useParams to access URL parameters
import { Typography, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Rating from "@mui/material/Rating";
import { auth } from "../firebase/firebase";
import { supabase } from "../client";

export default function CustomList() {
  const navigate = useNavigate();
  const { id: list_id } = useParams();  
  const [books, setBooks] = useState([]);
  const [listname, setListName] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!list_id) {
      console.error("Error: list_id is undefined.");
      return;
    }

    const fetchCustomBooks = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId || !list_id) return;

        console.log("Fetching books for list_id:", list_id);  

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
          .eq("lists.id", list_id);  
        
          if (error) {
            console.error("Error fetching list data: ", error);
          } else {
            if (data && data.length > 0) {
              setListName(data[0].lists?.name || "Untitled List");
            } else {
              const { data: listInfo, error: listError } = await supabase
                .from("lists")
                .select("name")
                .eq("id", list_id)
                .eq("user_id", userId)
                .single();
                if (listError) {
                  console.error("Error fetching list name:", listError);
                  setListName("Unnamed List");
                } else {
                  setListName(listInfo?.name || "Unnamed List");
                }
            }
          }
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
        console.error("Error fetching books for list:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomBooks();
  }, [list_id]);  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateList = async () => {
    const { data, error } = await supabase
      .from("lists")
      .update({ name: currName })
      .eq("id", list_id)
      .select("*");

    if (error) {
      console.error("Error updating list:", error);
    } else {
      setListName(data[0].name);
      handleClose();
    }
  };

  const deleteList = async () => {
    const { error } = await supabase.from("lists").delete().eq("id", list_id);
    if (error) {
      console.error("Error deleting list:", error);
    } else {
      navigate("/home"); // redirect after deletion
    }
  };

  return (
    <div className="font-merriweather ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">{listname}</Typography>  
      <Box className="bg-mocha shadow-custom w-[1200px] grid grid-cols-2 rounded-lg">
        {loading ? (
          <p>Loading...</p>
        ) : books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.google_books_id}
              className="bg-vanilla rounded-md p-6 w-[550px] flex m-5 gap-x-5"
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
                      ~{Math.floor((book?.pageCount || 0) / 0.6 / 60)} hrs
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
                    {book.averageRating ? `${book.averageRating.toFixed(1)} ` : "No rating available"}
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

