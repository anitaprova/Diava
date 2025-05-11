import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Button, TextField } from "@mui/material";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { auth } from "../firebase/firebase";
import { supabase } from "../client";
export default function ToRead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [open, setOpen] = useState(false);
  const [progressCompleted, setProgressCompleted] = useState(false);
  const [askToReview, setaskToReview] = useState(false);
  const userId = auth.currentUser.uid

  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await res.json();
        const totalpages = data.volumeInfo?.pageCount || 0;
        setTotalPages(totalpages); 
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  useEffect(() => {
    if (userId) {
      const fetchLogs = async () => {
        try {
          const { data, error } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", userId)
            .eq("google_books_id", id)
            .order("created_at", { ascending: false }); 

          if (error) {
            throw error;
          }

          setLogs(data);
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      };

      fetchLogs();
    }
  }, [userId, id]);
  
const addToReadList = async () => {
  try {
    const userId = auth.currentUser.uid;
    if (!userId || !book?.id) return;

    // Get the "Read" list ID
    const { data: readList, error: readListError } = await supabase
      .from("lists")
      .select("id")
      .eq("user_id", userId)
      .eq("name", "Read")
      .single();

    if (readListError || !readList) {
      console.error("Could not find 'Read' list:", readListError?.message);
      return;
    }

    const readListId = readList.id;

    // Get genres from book data (ensure book.volumeInfo.genres exists)
    const genres = book?.volumeInfo?.categories || []; // If no genres are available, fallback to an empty array

    // Insert into "Read" list
    const bookData = {
      list_id: readListId,
      google_books_id: book?.id,
      title: book?.volumeInfo?.title,
      thumbnail: book?.volumeInfo?.imageLinks?.thumbnail,
      user_id: userId,
      author: book?.volumeInfo?.authors?.join(", "),
      pages: book?.volumeInfo?.pageCount,
      genres: genres.map((genre) => genre.trim()), 
    };

    const { data: existing, error: existingError } = await supabase
      .from("list_books")
      .select("id")
      .eq("user_id", userId)
      .eq("list_id", readListId)
      .eq("google_books_id", book?.id)
      .single();

    if (!existing) {
      const { error: insertError } = await supabase
        .from("list_books")
        .insert([bookData]);

      if (insertError) throw insertError;
    }
    const { data: currentlyList, error: currListError } = await supabase
      .from("lists")
      .select("id")
      .eq("user_id", userId)
      .eq("name", "Currently Reading")
      .single();

    if (currListError || !currentlyList) {
      console.warn("Could not find 'Currently Reading' list:", currListError?.message);
    } else {
      await supabase
        .from("list_books")
        .delete()
        .eq("user_id", userId)
        .eq("list_id", currentlyList.id)
        .eq("google_books_id", book?.id);
    }

    console.log("Moved book to 'Read' list successfully.");
  } catch (error) {
    console.error("Error moving book to 'Read' list:", error.message || error);
  }
};

  const handleOpen = () => {
    setSelectedLog(null);
    setOpen(true);
  };

  const handleEditOpen = (log) => {
    setSelectedLog(log);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedLog(null);
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //convert form input to json format
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const page = parseInt(formJson.page)
    const date = formJson.date;
    const comment = formJson.notes;
    const rating = formJson.rating;

    const progressVal = totalPages ? Math.round((page / totalPages) * 100) : 0
    const newLog = {
      page,
      date,
      comment, rating,
      progress: progressVal,
    };
  
    try {
      const userId = auth.currentUser.uid
      if (!userId) return;
      if(selectedLog) 
      {
        const {data, error} = await supabase
        .from('progress')
        .update({
          created_at: date,
          comment: comment,
          rating: rating,
          page: page,
          google_books_id:id,
          total_pages:totalPages,
          progress: progressVal,
        })
        .eq("id", selectedLog.id)
        .eq("user_id", userId);

        if (error) throw error;
        setLogs((prevState) =>
          prevState.map((log) =>
            log.id === selectedLog.id
              ? { ...log, page, created_at: date, comment, rating, progress: progressVal }
              : log
          )
        );
      } else {
        const { data, error } = await supabase.from('progress').insert([
          {
            user_id: userId,
            created_at: date,
            comment: comment,
            rating: rating,
            page: page,
            google_books_id:id,
            total_pages:totalPages,
            progress: progressVal,
          },
        ]);
        console.log(progressVal);
        if (error) throw error;
        console.log("New log inserted into database:" , data);
        setLogs((prevState) => [newLog, ...prevState]);
      }

      if (progressVal === 100) {
        await addToReadList();
        setaskToReview(true);
        setProgressCompleted(true);
      }
      handleClose();
    } catch (error) {
      console.error("Error inserting current user's progress: ", error);
    }
  };
  
 
  return (
    <div className="font-merriweather ml-50 mr-50 mt-10 mb-10">
      {book && book.volumeInfo ? (
        <div className="grid grid-cols-5 gap-x-8 w-full">
          <div className="col-span-1 flex flex-col gap-y-5">
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                className="w-75 rounded-lg"
                alt={book.volumeInfo.title}
              />
            )}
          </div>
  
          <Box className="bg-vanilla rounded-lg col-span-4 flex flex-col gap-y-10 shadow-small">
            <Box className="text-center mt-5">
              <Typography variant="h4">{book.volumeInfo.title}</Typography>
              <Typography variant="subtitle1">
                by {book.volumeInfo.authors?.join(", ")}
              </Typography>
              <Typography variant="subtitle2" className="mt-2">
                Total Pages: {totalPages}
              </Typography>
            </Box>
  
            <Box className="flex gap-x-5 justify-around text-xl text-center">
              <Typography variant="h6">
                Start Date
                <Typography>03/05/2025</Typography>
              </Typography>
              <Typography variant="h6">
                Target End Date
                <Typography>03/21/2025</Typography>
              </Typography>
            </Box>
  
            <Box className="text-center">
              <Typography variant="h5">Average Stats</Typography>
              <Box className="flex gap-x-10 justify-center text-xl mt-5">
                <Typography>
                  13
                  <Typography>Pages Per Day</Typography>
                </Typography>
                <Typography>
                  55 minutes
                  <Typography>Spend Per Day</Typography>
                </Typography>
              </Box>
            </Box>
  
            <Box className="flex w-full justify-center mb-5">
              <Button
                variant="dark"
                className="self-center w-fit"
                sx={{ marginRight: "1%" }}
                onClick={handleOpen}
              >
                Add Log
              </Button>
            </Box>
  
            <Dialog
              open={open}
              onClose={handleClose}
              fullWidth
              slotProps={{
                paper: {
                  component: "form",
                  onSubmit: handleSubmit,
                },
              }}
            >
              <DialogTitle>{selectedLog ? "Edit Log" : "Add a New Log"}</DialogTitle>
              <DialogContent className="space-y-5">
                <div>
                  <Typography>On Page</Typography>
                  <TextField
                    size="small"
                    variant="outlined"
                    type="number"
                    name="page"
                    defaultValue={selectedLog?.page || ""}
                    fullWidth
                  />
                </div>
  
                <div>
                  <Typography>Session Rating</Typography>
                  <Rating
                    defaultValue={selectedLog?.rating || 0}
                    precision={0.5}
                    name="rating"
                    size="large"
                  />
                </div>
  
                <div className="flex gap-5 w-full">
                  <span className="w-full">
                    <Typography>
                      <CalendarMonthIcon /> Date
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="date"
                      type="date"
                      defaultValue={
                        selectedLog?.date
                          ? new Date(selectedLog.date).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </span>
                </div>
  
                <div>
                  <Typography>Notes</Typography>
                  <TextField
                    size="large"
                    variant="outlined"
                    name="notes"
                    minRows={8}
                    multiline
                    fullWidth
                    defaultValue={selectedLog?.comment || ""}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button type="submit" variant="coffee">
                  Save Log
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      ) : (
        <Typography className="text-center mt-10">Loading book details...</Typography>
      )}
  
      <Box className="flex flex-col gap-y-10 mt-10">
        {logs.map((entry, index) => (
          <Box
            key={index}
            className="bg-vanilla flex flex-row justify-between items-start p-6 rounded-lg shadow-small"
          >
            <Box className="flex flex-col">
              <Typography variant="h5">
                Page: {entry.page}{" "}
                <Rating
                  value={entry.rating}
                  precision={0.5}
                  size="small"
                  readOnly
                />
              </Typography>
              <Typography>{entry.comment}</Typography>
            </Box>
  
            <Box className="flex flex-col items-end">
              <Typography className="text-right text-grey">
              {entry.created_at}
              </Typography>
              <Box className="flex items-center space-x-2">
                <Button
                  size="small"
                  variant="coffee"
                  onClick={() => handleEditOpen(entry)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Dialog open={askToReview} onClose={() => setaskToReview(false)}>
        <DialogTitle>Finished Reading?</DialogTitle>
          <DialogContent>
            <Typography>
              You’ve reached 100% progress. Would you like to leave a review?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
              setaskToReview(false);
              navigate(`/review/${book.id}`);
              }}
              variant="coffee"
            >
              Yes
            </Button>
            <Button
              onClick={() => {
              setaskToReview(false);
              navigate("/");
            }}
              variant="dark"
            >
            No, go to Home
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}  