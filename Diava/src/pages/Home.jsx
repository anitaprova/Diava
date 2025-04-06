import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, TextField } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Add from "@mui/icons-material/Add";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import axios from "axios";
import CustomList from "../components/CustomList";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { auth } from "../firebase/firebase";

export default function Home() {
  const navigate = useNavigate();
  const [toRead, setToRead] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createList = async (listData) => {
    try {
      const response = await axios.post("http://localhost:5001/list", listData);
      setUserLists([...userLists, response.data]);
    } catch (error) {
      console.error("Error creating list:", error.response?.data);
    }
  };

  const fetchBooksMetadata = async (listSetter, listName) => {
    try {
      const response = await axios.get("http://localhost:5001/list_books", {
        params: { user_id: auth.currentUser.uid, name: listName },
      });
      const books = response.data || [];

      const metadataPromises = books.map(async (book) => {
        const googleId = book.google_book_id;
        const metadata = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleId}`);
        return {
          ...book,
          ...metadata.data.volumeInfo,
          google_book_id: googleId
        };
      });

      const enrichedBooks = await Promise.all(metadataPromises);
      listSetter(enrichedBooks);
    } catch (error) {
      console.error(`Error fetching books for ${listName}:`, error);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const user_id = auth.currentUser.uid
    axios
      .get(`http://localhost:5001/list/${user_id}`)
      .then((response) => setUserLists(response.data || []))
      .catch((error) => console.error("Error fetching lists:", error));

    fetchBooksMetadata(setCurrentlyReading, "Currently Reading");
    fetchBooksMetadata(setToRead, "To Read");
  }, []);

  return (
    <div className="ml-50 mr-50 mt-10 mb-25 font-merriweather text-darkbrown">
      <div className="grid grid-flow-col grid-rows-4 gap-x-20">
        <div className="row-span-4">
          <Typography
            variant="h4"
            className="w-full"
            onClick={() => navigate("/currentlyreading")}
          >
            Currently Reading
          </Typography>
          <Box className="bg-sand flex flex-col justify-around rounded-lg h-full w-auto shadow-custom">
            {currentlyReading.length > 0 ? (
              currentlyReading.slice(0, 2).map((book) => (
                <div className="flex mt-5 ml-5 gap-x-5" key={book.google_book_id}>
                  <img
                    src={book.imageLinks?.thumbnail}
                    onClick={() => navigate(`/book/${book.google_book_id}`)}
                    className="w-fit"
                  />
                  <div className="space-y-5">
                    <div>
                      <Typography variant="h6">{book.title}</Typography>
                      <Typography variant="subtitle2">By {book.authors?.join(", ")}</Typography>
                    </div>
                    <div className="space-y-5">
                      <Typography>Reading Progress:</Typography>
                      <div className="flex align-center">
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <LinearProgress variant="determinate" value={60} sx={{ height: "100%" }} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">60%</Typography>
                        </Box>
                      </div>
                      <Button variant="dark" onClick={() => navigate(`/update/${book.google_book_id}`)}>
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nothing added yet!</p>
            )}
            <Button
              variant="dark"
              className="w-fit self-center"
              onClick={() => navigate("/currentlyreading")}
            >
              See More
            </Button>
          </Box>
        </div>

        {/* To Read Pile */}
        <div className="col-span-1 row-span-2">
          <Typography variant="h4" onClick={() => navigate(`/toread`)}>
            To Read Pile
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {toRead.length > 0 ? (
              toRead.slice(0, 3).map((book) => (
                <img
                  key={book.google_book_id}
                  src={book.imageLinks?.thumbnail}
                  onClick={() => navigate(`/book/${book.google_book_id}`)}
                  className="p-4"
                />
              ))
            ) : (
              <p>Nothing added yet!</p>
            )}
            <ArrowCircleRightIcon
              size="large"
              sx={{ display: "flex", alignSelf: "center", width: 30, height: 30 }}
              onClick={() => navigate(`/toread`)}
            />
          </Box>
        </div>

        {/* Recommendations */}
        <div className="col-span-1 row-span-2 mt-5">
          <Typography variant="h4" onClick={() => navigate(`/recommendations`)}>
            Recommendations
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {recommendation.length > 0 ? (
              recommendation.slice(0, 3).map((book) => (
                <img
                  key={book.google_book_id}
                  src={book.thumbnail}
                  onClick={() => navigate(`/book/${book.google_book_id}`)}
                  className="p-4"
                />
              ))
            ) : (
              <p>Nothing added yet!</p>
            )}
            <ArrowCircleRightIcon
              size="large"
              sx={{ alignSelf: "center", textAlign: "right", width: 30, height: 30 }}
              onClick={() => navigate(`/recommendations`)}
            />
          </Box>
        </div>
      </div>

      {/* Custom Lists */}
      <div className="mt-30">
        <Typography variant="h4" className="flex justify-between">
          Your Lists <Add className="bg-vanilla rounded-sm mr-4" onClick={handleOpen} />
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
                const name = formJson.name;
                createList({ user_id: auth.currentUser.uid, name });
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
            userLists.map((list) => <CustomList key={list.id} id={list.id} name={list.name} />)
          ) : (
            <p>Nothing added yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}
