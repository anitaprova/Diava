import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CustomList from "../components/CustomList";
import { auth } from "../firebase/firebase";
import { supabase } from "../client";
import { useRef } from "react";

export default function Home() {
  const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  const navigate = useNavigate();
  const [toRead, setToRead] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [read, setRead] = useState();
  const [recommendation, setRecommendation] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProgress, setCurrentProgress] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          .limit(1);

        const booksRead = data?.[0]?.list_books?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setRead(booksRead);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    };
    getRecent();
  }, []);

  const hasFetchedRecs = useRef(false);
  useEffect(() => {
    if (!read || read.length === 0 || hasFetchedRecs.current) return;
    hasFetchedRecs.current = true;

    const fetchAllRecs = async () => {
      try {
        const response = await fetch(
          "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: read[0].description }),
          }
        );

        const embedding = await response.json();

        const { data, error } = await supabase.rpc("match_books_by_vector", {
          query_embedding: embedding,
        });

        setRecommendation(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchAllRecs();
  }, [read]);

  const createList = async (listData) => {
    const { data, error } = await supabase
      .from("lists")
      .insert(listData)
      .select("*");
    if (error) console.error("Error fetching data:", error);
    else setUserLists((prev) => [...prev, data[0]]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const { data: crBooks, error: crError } = await supabase
          .from("list_books")
          .select(
            `
          *,
          lists!inner (
            id,
            name
          )
        `
          )
          .eq("lists.user_id", userId)
          .eq("lists.name", "Currently Reading");

        if (crError) throw crError;
        setCurrentlyReading(crBooks || []);

        const { data: trBooks, error: trError } = await supabase
          .from("list_books")
          .select(
            `
         *,
        lists!inner (
        id,
        name
                  )
      `
          )
          .eq("lists.user_id", userId)
          .eq("lists.name", "Want to Read");

        if (trError) throw trError;
        setToRead(trBooks || []);

        const { data: allLists, error: listError } = await supabase
          .from("lists")
          .select("*")
          .eq("user_id", userId);

        if (listError) throw listError;
        const customLists = (allLists || []).filter(
          (l) => l.name !== "Currently Reading" && l.name !== "Want to Read"
        );
        setUserLists(customLists);
      } catch (error) {
        console.error("Error fetching list data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId || currentlyReading.length === 0) return;

        const bookIds = currentlyReading.map((book) => book.google_books_id);

        const { data, error } = await supabase
          .from("progress")
          .select("google_books_id, progress")
          .eq("user_id", userId)
          .in("google_books_id", bookIds);

        if (error) throw error;

        const progressMap = data.reduce(
          (acc, { google_books_id, progress }) => {
            acc[google_books_id] = Math.max(
              acc[google_books_id] || 0,
              progress
            );
            return acc;
          },
          {}
        );

        const progressArr = Object.entries(progressMap).map(
          ([google_books_id, progress]) => ({ google_books_id, progress })
        );
        setCurrentProgress(progressArr);
      } catch (error) {
        console.error("Error fetching progress data:", error.message);
      }
    };

    fetchProgressData();
  }, [currentlyReading]);

  return (
    <div className="ml-50 mr-50 mt-10 mb-25 font-merriweather text-darkbrown">
      <div className="grid grid-flow-col grid-rows-4 gap-x-20 gap-y-5">
        {/* Currently Reading */}
        <div className="row-span-4">
          <Typography
            variant="h4"
            className="w-full"
            onClick={() => navigate(`/currentlyreading`)}
          >
            Currently Reading
          </Typography>
          <Box className="bg-sand grid grid-row-5 rounded-lg h-full shadow-custom pr-5">
            {currentlyReading.length > 0 ? (
              currentlyReading.slice(0, 2).map((book, index) => {
                const progressData = currentProgress.find(
                  (progress) =>
                    progress.google_books_id === book.google_books_id
                );
                const progress = progressData ? progressData.progress : 0;

                return (
                  <div
                    className="flex pl-5 pt-5 gap-x-5 content-start"
                    key={index}
                  >
                    <img
                      src={book.thumbnail}
                      onClick={() => navigate(`/book/${book.google_books_id}`)}
                      className="w-fit cursor-pointer"
                    />
                    <div className="space-y-5">
                      <div>
                        <Typography variant="h6">{book.title}</Typography>
                        <Typography variant="subtitle2">
                          By: {book.author}
                        </Typography>
                      </div>
                      <div className="space-y-5">
                        <Typography>Reading Progress:</Typography>
                        <div className="flex align-center w-[300px]">
                          <Box sx={{ width: "80%", mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progress || 0}
                              sx={{ height: 20 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2">
                              {progress || 0}%
                            </Typography>
                          </Box>
                        </div>
                        <Button
                          variant="dark"
                          onClick={() =>
                            navigate(`/update/${book.google_books_id}`)
                          }
                        >
                          Update Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-5">Nothing added yet!</p>
            )}
            <div
              className="row-span-1 w-full h-full flex justify-center items-end"
            >
              <Button
                variant="dark"
                className="w-fit self-center"
                onClick={() => navigate(`/currentlyreading`)}
              >
                See More
              </Button>
            </div>
          </Box>
        </div>

        {/* To Read */}
        <div className="col-span-1 row-span-2 h-full ">
          <Typography variant="h4" onClick={() => navigate(`/toread`)}>
            To Read Pile
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {toRead.length > 0 ? (
              toRead
                .slice(0, 3)
                .map((book, index) => (
                  <img
                    key={index}
                    src={book.thumbnail}
                    onClick={() => navigate(`/book/${book.google_books_id}`)}
                    className="p-4 cursor-pointer"
                  />
                ))
            ) : (
              <p className="p-4">Nothing added yet!</p>
            )}
            <ArrowCircleRightIcon
              size="large"
              sx={{
                display: "flex",
                alignSelf: "center",
                width: 30,
                height: 30,
              }}
              onClick={() => navigate(`/toread`)}
            />
          </Box>
        </div>

        {/* Recommendations */}
        <div className="col-span-1 row-span-2 mt-15 h-full">
          <Typography variant="h4" onClick={() => navigate(`/recommendations`)}>
            Recommendations
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {Array.isArray(recommendation) && recommendation.length > 0 ? (
              recommendation
                .slice(0, 3)
                .map((book, index) => (
                  <img
                    key={index}
                    src={book.thumbnail}
                    className="p-4 cursor-pointer"
                  />
                ))
            ) : (
              <p className="p-4">Nothing added yet!</p>
            )}
            <ArrowCircleRightIcon
              size="large"
              sx={{
                alignSelf: "center",
                textAlign: "right",
                width: 30,
                height: 30,
              }}
              onClick={() => navigate(`/recommendations`)}
            />
          </Box>
        </div>
      </div>

      {/* User Lists */}
      <div className="mt-30">
        <Typography variant="h4" className="flex justify-between">
          Your Lists{" "}
          <Add className="bg-vanilla rounded-sm mr-4" onClick={handleOpen} />
        </Typography>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          slotProps={{
            paper: {
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                createList({
                  user_id: auth.currentUser.uid,
                  name: formJson.name,
                });
                handleClose();
              },
            },
          }}
        >
          <DialogTitle>Add a New List</DialogTitle>
          <DialogContent className="space-y-5">
            <div className="gap-x-5">
              <Typography>Name</Typography>
              <TextField size="small" variant="outlined" name="name" />
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="coffee">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          {userLists.length > 0 ? (
            userLists.map((list) => (
              <CustomList
                key={list.id}
                id={list.id}
                name={list.name}
                list_id={list.id}
              />
            ))
          ) : (
            <p>Nothing added yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}
