import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Button, TextField } from "@mui/material";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ToRead() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [logs, setLogs] = useState([
    {
      page: "40",
      comment:
        "Really enjoyed today's chapter! The pacing is picking up and the characters...",
      date: "03/02/2025",
      rating: 5,
    },
    {
      page: "20",
      comment: "Wow I can't believe that she did that.",
      date: "02/25/2025",
      rating: 4,
    },
    {
      page: "10",
      comment:
        "Im loving the book so far, interested to see where the story heads and I love the characters....",
      date: "02/23/2025",
      rating: 3,
    },
  ]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

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

          <Box className="bg-vanilla rounded-lg col-span-3 flex flex-col gap-y-10 col-span-4 shadow-small">
            <Box className="text-center mt-5">
              <Typography variant="h4">{book.volumeInfo.title}</Typography>
              <Typography variant="subtitle1">
                by {book.volumeInfo.authors?.join(", ")}
              </Typography>
            </Box>

            <Box className="flex gap-x-5 justify-around text-xl text-center">
              <Typography variant="h6">
                Start Date
                <Typography component="div">03/05/2025</Typography>
              </Typography>
              <Typography variant="h6">
                Target End Date
                <Typography component="div">03/21/2025</Typography>
              </Typography>
            </Box>

            <Box className="text-center">
              <Typography variant="h5">Average Stats</Typography>
              <Box className="flex gap-x-10 justify-center text-xl mt-5">
                <Typography component="h6">
                  13
                  <Typography component="div">Pages Per Day</Typography>
                </Typography>
                <Typography component="h6">
                  55 minutes
                  <Typography component="div">Spend Per Day</Typography>
                </Typography>
              </Box>
            </Box>

            <Button
              variant="dark"
              className="self-center w-fit"
              sx={{ marginBottom: "3%" }}
              onClick={handleOpen}
            >
              Add Log
            </Button>

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
                    const newLog = {
                      page: formJson.page,
                      date: formJson.date,
                      comment: formJson.notes,
                      rating: formJson.rating,
                    };

                    console.log(newLog);

                    if (selectedLog) {
                      setLogs((prevLogs) =>
                        prevLogs.map((log) =>
                          log === selectedLog ? newLog : log
                        )
                      );
                    } else {
                      setLogs((prevState) => [newLog, ...prevState]);
                    }

                    handleClose();
                  },
                },
              }}
            >
              <DialogTitle>
                {selectedLog ? "Edit Log" : "Add a New Log"}
              </DialogTitle>
              <DialogContent className="space-y-5">
                <div className="gap-x-5">
                  <Typography>On Page</Typography>
                  <TextField
                    size="small"
                    variant="outlined"
                    type="number"
                    name="page"
                    defaultValue={selectedLog?.page}
                  />
                </div>

                <div className="gap-x-5">
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
                          ? new Date(selectedLog.date)
                              .toISOString()
                              .split("T")[0]
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
                  Update
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      ) : (
        <Typography className="text-center mt-10">
          Loading book details...
        </Typography>
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
                {entry.date}
              </Typography>
              <Box>
                <Button
                  size="small"
                  variant="coffee"
                  sx={{ marginRight: "5px" }}
                  onClick={() => handleEditOpen(entry)}
                >
                  Edit
                </Button>
                <Button
                  variant="dark"
                  size="small"
                  onClick={() => setLogs(logs.filter((item) => item !== entry))}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
}