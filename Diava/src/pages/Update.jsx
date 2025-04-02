import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Button, TextField } from "@mui/material";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ToRead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    id: "3vo0NQbIN2YC",
    volumeInfo: {
      title: "A Thousand Splendid Suns",
      authors: ["Khaled Hosseini"],
      publishedDate: "2008-09-18",
      description:
        "'A Thousand Splendid Suns' is a chronicle of Afghan history, and a deeply moving story of family, friendship, and the salvation to be found in love.",
      pageCount: 419,
      categories: ["Fiction / General"],
      averageRating: 5,
      imageLinks: {
        thumbnail:
          "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71jVhNuWmSXykiQxuqgjmnYXICqQKU_xGWgCb8bckuuq2JGVGBufunssx_MEON9cwxnZSVZ7X7gf9btSeZttBEqmw5ANGbrJDpjA_PALpf5beNOV5Gm7NKhu6Tr_cbaajc60bIG&source=gbs_api",
      },
    },
  });

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
      {book && book.volumeInfo.imageLinks ? (
        <div className="grid grid-cols-5 gap-x-8 w-full">
          <div className="col-span-1 flex flex-col gap-y-5">
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              className="w-75 rounded-lg"
            />
          </div>

          <Box className="bg-vanilla rounded-lg col-span-3 flex flex-col gap-y-10 col-span-4 shadow-small">
            <Box className="flex gap-x-5 justify-around text-xl text-center mt-5">
              <Typography variant="h5">
                Start Date
                <Typography>03/05/2025</Typography>
              </Typography>
              <Typography variant="h5">
                Target End Date
                <Typography>03/21/2025</Typography>
              </Typography>
            </Box>

            <Box className="justify-items-center">
              <Typography variant="h5">Average Stats</Typography>
              <Box className="flex gap-x-10 justify-between text-xl text-center mt-5">
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

            <Button
              variant="dark"
              className="self-center w-fit"
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
                    value={selectedLog?.page || ""}
                  />
                </div>

                <div className="gap-x-5">
                  <Typography>Session Rating</Typography>
                  <Rating
                    value={selectedLog?.rating || ""}
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
                      value={
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
                    value={selectedLog?.comment || ""}
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
        <p>Loading</p>
      )}

      <Box className="flex flex-col gap-y-10 mt-10 ">
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
    </div>
  );
}
