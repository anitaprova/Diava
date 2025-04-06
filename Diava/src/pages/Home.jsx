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
import axios from "axios";
import CustomList from "../components/CustomList";
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
      setUserLists((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error creating list:", error.response?.data || error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
  

        const crResponse = await axios.get(
          `http://localhost:5001/list_books/${userId}/Currently Reading`
        );
        setCurrentlyReading(crResponse.data || []);
  
        // 2. Fetch books for "To Read"
        const trResponse = await axios.get(
          `http://localhost:5001/list_books/${userId}/Want To Read`
        );
        setToRead(trResponse.data || []);
  
      } catch (error) {
        console.error("Error fetching list books:", error.response?.data || error.message);
      }
    };
  
    fetchData();
  }, []);
  return (
    <div className="ml-50 mr-50 mt-10 mb-25 font-merriweather text-darkbrown">
      <div className="grid grid-flow-col grid-rows-4 gap-x-20">
        {/* Currently Reading */}
        <div className="row-span-4">
          <Typography
            variant="h4"
            className="w-full"
            onClick={() => navigate(`/currentlyreading`)}
          >
            Currently Reading
          </Typography>
          <Box className="bg-sand flex flex-col justify-around rounded-lg h-full w-auto shadow-custom">
            {currentlyReading.length > 0 ? (
              currentlyReading.slice(0, 2).map((book, index) => (
                <div className="flex mt-5 ml-5 gap-x-5" key={index}>
                  <img
                    src={book.thumbnail}
                    onClick={() => navigate(`/book/${book.google_book_id}`)}
                    className="w-fit cursor-pointer"
                  />
                  <div className="space-y-5">
                    <div>
                      <Typography variant="h6">{book.title}</Typography>
                      <Typography variant="subtitle2">
                        By {book.author}
                      </Typography>
                    </div>
                    <div className="space-y-5">
                      <Typography>Reading Progress:</Typography>
                      <div className="flex align-center">
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={book.progress || 60}
                            sx={{ height: "100%" }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">
                            {book.progress || 60}%
                          </Typography>
                        </Box>
                      </div>
                      <Button
                        variant="dark"
                        onClick={() => navigate(`/update/${book.google_book_id}`)}
                      >
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-5">Nothing added yet!</p>
            )}
            <Button
              variant="dark"
              className="w-fit self-center"
              onClick={() => navigate(`/currentlyreading`)}
            >
              See More
            </Button>
          </Box>
        </div>

        {/* To Read */}
        <div className="col-span-1 row-span-2">
          <Typography variant="h4" onClick={() => navigate(`/toread`)}>
            To Read Pile
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {toRead.length > 0 ? (
              toRead.slice(0, 3).map((book, index) => (
                <img
                  key={index}
                  src={book.thumbnail}
                  onClick={() => navigate(`/book/${book.google_book_id}`)}
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
        <div className="col-span-1 row-span-2 mt-5">
          <Typography variant="h4" onClick={() => navigate(`/recommendations`)}>
            Recommendations
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {recommendation.length > 0 ? (
              recommendation.slice(0, 3).map((book, index) => (
                <img
                  key={index}
                  src={book.thumbnail}
                  onClick={() => navigate(`/book/${book.google_book_id}`)}
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