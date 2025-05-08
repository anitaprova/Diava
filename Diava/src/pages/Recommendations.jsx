import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { supabase } from "../client";
import { auth } from "../firebase/firebase";
import { useRef } from "react";

export default function Recommendations() {
  const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [favBooks, setFavBooks] = useState();
  const [favRecommendations, setFavRecommendations] = useState();
  const[recommendations, setRecommendations] = useState();

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
          .limit(2);

        const booksRead = data?.[0]?.list_books?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setBooks(booksRead);
        console.log(booksRead);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    };
    getRecent();
  }, []);

  const hasFetchedFav = useRef(false);
  useEffect(() => {
    if (hasFetchedFav.current) return;
    hasFetchedFav.current = true;

    const getRecentFav = async () => {
      try {
        const userId = auth.currentUser.uid;
        const { data, error } = await supabase
          .from("lists")
          .select("*, list_books(*)")
          .eq("user_id", userId)
          .eq("name", "Favorites")
          .limit(2);

        const booksRead = data?.[0]?.list_books?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setFavBooks(booksRead);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    };
    getRecentFav();
  }, []);

  const hasFetchedFavRecs = useRef(false);
  useEffect(() => {
    if (!favBooks || favBooks.length === 0 || hasFetchedFavRecs.current) return;
    hasFetchedFavRecs.current = true;

    const fetchAllFavRecs = async () => {
      try {
        const allRecs = [];
        for (const book of favBooks) {
          const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ inputs: book.description ? book.description : book.title}),
            }
          );

          const embedding = await response.json();

          const { data, error } = await supabase.rpc("match_books_by_vector", {
            query_embedding: embedding,
          });

          if (error) throw error;
          console.log("data: ", data);
          Object.entries(data).forEach(([key, value]) => {
            allRecs.push(value);
          });
        }

        console.log("All recommended books for favorites list:", allRecs);
        setFavRecommendations(allRecs);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchAllFavRecs();
  }, [favBooks]);

 const hasFetchedRecs = useRef(false);
 useEffect(() => {
   if (!books || books.length === 0 || hasFetchedRecs.current) return;
   hasFetchedRecs.current = true;

   const fetchAllRecs = async () => {
     try {
       const allRecs = [];
       for (const book of books) {
         const response = await fetch(
           "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
           {
             headers: {
               Authorization: `Bearer ${API_KEY}`,
               "Content-Type": "application/json",
             },
             method: "POST",
             body: JSON.stringify({
               inputs: book.description ? book.description : book.title,
             }),
           }
         );

         const embedding = await response.json();

         const { data, error } = await supabase.rpc("match_books_by_vector", {
           query_embedding: embedding,
         });

         if (error) throw error;
         Object.entries(data).forEach(([key, value]) => {
           allRecs.push(value);
         });
       }

       setRecommendations(allRecs); 
     } catch (err) {
       console.error("Error fetching recommendations:", err);
     }
   };

   fetchAllRecs();
 }, [books]);

  return (
    <div className="font-merriweather text-darkbrown ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">Recommendations</Typography>
      <Box className="bg-mocha rounded-lg flex flex-col gap-4 shadow-custom pl-5 pr-5 pb-10">
        <Typography variant="h5" className="pt-5">
          Based on Your Recent Read
        </Typography>
        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          {recommendations ? (
            recommendations.map((book) => (
              <div className="bg-vanilla rounded-md p-6 w-full flex gap-x-5 ">
                <img src={book?.thumbnail} className="w-fit" />
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6">{book?.title}</Typography>
                    <Typography variant="subtitle2">
                      By {book?.authors.split(";").join(", ")}
                    </Typography>
                  </div>

                  <div className="flex flex-row gap-x-8">
                    <Typography className="flex gap-x-2">
                      <AutoStoriesIcon fontSize="small" />
                      {book?.num_pages} pages
                    </Typography>

                    <Typography className="flex gap-x-2">
                      <AccessTimeIcon fontSize="small" /> ~
                      {Math.floor(book?.num_pages / 45)} hrs
                    </Typography>
                  </div>

                  <ul className="flex flex-wrap text-sm gap-3 mt-5">
                    <li className="bg-sand p-1 text-center rounded-sm w-fit pr-5">
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

        <Typography variant="h5" className="pt-5">
          Based on Your Favorites List
        </Typography>
        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          {favRecommendations ? (
            favRecommendations.map((book) => (
              <div className="bg-vanilla rounded-md p-6 w-full flex gap-x-5 ">
                <img src={book?.thumbnail} className="w-fit" />
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6">{book?.title}</Typography>
                    <Typography variant="subtitle2">
                      By {book?.authors.split(";").join(", ")}
                    </Typography>
                  </div>

                  <div className="flex flex-row gap-x-8">
                    <Typography className="flex gap-x-2">
                      <AutoStoriesIcon fontSize="small" />
                      {book?.num_pages} pages
                    </Typography>

                    <Typography className="flex gap-x-2">
                      <AccessTimeIcon fontSize="small" /> ~
                      {Math.floor(book?.num_pages / 45)} hrs
                    </Typography>
                  </div>

                  <ul className="flex flex-wrap text-sm gap-3 mt-5">
                    <li className="bg-sand p-1 text-center rounded-sm w-fit pr-5">
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
