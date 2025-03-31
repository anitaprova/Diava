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
import DialogContentText from "@mui/material/DialogContentText";
import { auth } from "../firebase/firebase";

export default function Home() {
  const navigate = useNavigate();
  const [toRead, setToRead] = useState([
    {
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
    },
    {
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
    },
    {
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
    },
  ]);
  const [currentlyReading, setCurrentlyReading] = useState([""]);
  const [recommendation, setRecommendation] = useState([""]);
  const [userLists, setUserLists] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createList = async (listData) => {
    try {
      const response = await axios.post("http://localhost:5000/list", listData);
      console.log(response);
      setUserLists([...userLists, response.data]);
    } catch (error) {
      console.error("Error creating list:", error.response.data);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/list`, {
        params: { user_id: auth.currentUser.uid }
      })
      .then((response) => setUserLists(response.data || []))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div className="ml-50 mr-50 mt-10 mb-25 font-merriweather text-darkbrown">
      <div className="grid grid-flow-col grid-rows-4 gap-x-20">
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
              toRead.slice(0, 2).map((book) => (
                <div className="flex mt-5 ml-5 gap-x-5">
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="w-fit"
                  />
                  <div className="space-y-5">
                    <div>
                      <Typography variant="h6">
                        {book.volumeInfo.title}
                      </Typography>
                      <Typography variant="subtitle2">
                        By {book.volumeInfo.authors}
                      </Typography>
                    </div>
                    <div className="space-y-5">
                      <Typography>Reading Progress:</Typography>
                      <div className="flex align-center">
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={60}
                            sx={{ height: "100%" }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">60%</Typography>
                        </Box>
                      </div>

                      <Button
                        variant="dark"
                        onClick={() => navigate(`/update/${book.id}`)}
                      >
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
              onClick={() => navigate(`/currentlyreading`)}
            >
              See More
            </Button>
          </Box>
        </div>

        <div className="col-span-1 row-span-2">
          <Typography variant="h4" onClick={() => navigate(`/toread`)}>
            To Read Pile
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {toRead.length > 0 ? (
              toRead
                .slice(0, 3)
                .map((book) => (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="p-4"
                  />
                ))
            ) : (
              <p>Nothing added yet!</p>
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

        <div className="col-span-1 row-span-2 mt-5">
          <Typography variant="h4" onClick={() => navigate(`/recommendations`)}>
            Recommendations
          </Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg overflow-x-auto shadow-custom">
            {recommendation.length > 0 ? (
              toRead
                .slice(0, 3)
                .map((book) => (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="p-4"
                  />
                ))
            ) : (
              <p>Nothing added yet!</p>
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
                const name = formJson.name;
                createList({
                  user_id: auth.currentUser.uid,
                  name: name,
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
              <CustomList id={list.id} name={list.name} list_id={list.list_id} />
            ))
          ) : (
            <p>Nothing added yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}
