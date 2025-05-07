import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Rating from "@mui/material/Rating";
import { supabase } from "../client";
import { auth } from "../firebase/firebase";
import { useRef } from "react";

export default function Recommendations() {
  const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const[recommendations, setRecommendations] = useState();
  const genres = [
    ...new Set(
      books?.[0]?.volumeInfo?.categories?.flatMap((category) =>
        category.split("/")
      )
    ),
  ];

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const getRecent = async () => {
      try {
        const userId = auth.currentUser.uid;
        const { data, error } = await supabase
          .from("lists")
          .select("*, list_books(*)")
          .eq("user_id", userId)
          .eq("name", "Read")
          .limit(3);

        const booksRead = data?.[0]?.list_books?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setBooks(booksRead);
        console.log(data);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    };
    getRecent();
  }, []);

 const hasFetchedRecs = useRef(false);
 useEffect(() => {
   if (!books || books.length === 0 || hasFetchedRecs.current) return;

   hasFetchedRecs.current = true;
   const fetchRecs = async () => {
     try {
       const response = await fetch(
         "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
         {
           headers: {
             Authorization: `Bearer ${API_KEY}`,
             "Content-Type": "application/json",
           },
           method: "POST",
           body: JSON.stringify({ inputs: books[0].description }),
         }
       );
       const embedding = await response.json();

       const { data, error } = await supabase.rpc("match_books_by_vector", {
         query_embedding: embedding,
       });

       if (error) throw error;
       console.log("Recommended books:", data);
       setRecommendations(data);
     } catch (err) {
       console.error("Error fetching recommendations:", err);
     }
   };

   fetchRecs();
 }, [books]);

  return (
    <div className="font-merriweather text-darkbrown ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">Recommendations</Typography>
      <Box className="bg-mocha rounded-lg flex flex-col gap-4 shadow-custom pl-5 pr-5 pb-10">
        <Typography variant="h5" className="pt-5">
          Based on Your Past History
        </Typography>
        <div className="grid grid-cols-2 gap-x-5">
          {recommendations ? (
            recommendations.map((book) => (
              <div className="bg-vanilla rounded-md p-6 w-full flex mt-5 gap-x-5 ">
                <img src={book?.thumbnail} className="w-fit" />
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6">{book?.title}</Typography>
                    <Typography variant="subtitle2">
                      By {book?.authors}
                    </Typography>
                  </div>

                  <Typography variant="body2" className="flex flex-row gap-x-8">
                    <Typography className="flex gap-x-2">
                      <AutoStoriesIcon fontSize="small" />
                      {book?.num_pages} pages
                    </Typography>

                    <Typography className="flex gap-x-2">
                      <AccessTimeIcon fontSize="small" /> ~
                      {Math.floor(book?.num_pages / 45)} hrs
                    </Typography>
                  </Typography>

                  <ul className="flex flex-wrap text-sm gap-3 mt-5">
                    <li className="bg-sand p-1 text-center rounded-sm w-fit">
                      <LocalOfferIcon color="secondary" /> {book?.categories}
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>Nothing added yet!</p>
          )}
        </div>
      </Box>
    </div>
  );
}
