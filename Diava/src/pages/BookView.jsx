import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Rating from "@mui/material/Rating";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { auth } from "../firebase/firebase";

export default function BookDetail() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const genresRaw = book?.volumeInfo?.categories || [];
  const genres = [
    ...new Set(genresRaw.flatMap((category) => category.split("/"))),
  ];

  // Dropdown related states
  const [open, setOpen] = useState(false);
  const [selectedListName, setSelectedListName] = useState("");
  const anchorRef = React.useRef(null);

  const handleMenuItemClick = async (event, listName) => {
    setSelectedListName(listName);
    setOpen(false);

    const selectedList = userLists.find((list) => list.name === listName);

    if (selectedList) {
      try {
        const bookData = {
          list_id: selectedList.id,
          google_book_id: book.id,
          title: book.volumeInfo.title,
          thumbnail: book.volumeInfo.imageLinks.thumbnail,
          user_id: auth.currentUser.uid,
          author: book.volumeInfo.authors?.join(", ")
        };
        await axios.post("http://localhost:5001/list_books", bookData);
        console.log(`Book added to ${listName} list`);
      } catch (error) {
        console.error("Error adding book to list:", error);
      }
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
        .then((response) => setBook(response.data || []))
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [id]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      axios
        .get(`http://localhost:5001/list/${userId}`)
        .then((response) => setUserLists(response.data || []))
        .catch((error) => console.error("Error fetching lists:", error));
    }
  }, []);

  return (
    <div className="font-merriweather mr-25 ml-25 mt-15">
      {book && book.volumeInfo.imageLinks ? (
        <div className="grid grid-cols-5 gap-x-8">
          <div className="flex flex-col gap-y-5">
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              className="w-75 rounded-lg"
            />
            <ul className="flex flex-wrap text-sm gap-3">
              {genres &&
                genres.map((genre) => (
                  <li className="bg-sand p-1 text-center rounded-sm w-fit">
                    <LocalOfferIcon color="secondary" /> {genre}
                  </li>
                ))}
            </ul>
          </div>

          <Box className="col-span-3">
            <Typography variant="title" component="div" fontWeight="bold">
              {book.volumeInfo.title}
            </Typography>

            <Typography variant="subtitle" color="text.secondary">
              by {book.volumeInfo.authors?.join(", ")}
            </Typography>

            <Typography variant="body" className="flex flex-row gap-x-8">
              <Typography className="flex gap-x-2">
                <AutoStoriesIcon fontSize="small" />
                {book.volumeInfo.pageCount} pages
              </Typography>

              <Typography className="flex gap-x-2">
                <AccessTimeIcon fontSize="small" /> ~
                {Math.floor(book.volumeInfo.pageCount / 0.6 / 60)} hrs
              </Typography>
            </Typography>

            <div className="flex mt-2 mb-4 gap-x-4">
              <Rating
                value={book.volumeInfo.averageRating}
                precision={0.5}
                size="large"
                readOnly
              />
              <p className="inline-block align-middle text-lg">
                {book.volumeInfo.averageRating}
              </p>
            </div>

            <Box className="rounded-lg border p-3 border-grey">
              <Typography variant="h5">Description</Typography>
              {seeMore ? (
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: book?.volumeInfo?.description,
                    }}
                  />
                  <span className="underline" onClick={() => setSeeMore(false)}>
                    See Less
                  </span>
                </div>
              ) : (
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        book?.volumeInfo?.description?.substr(0, 650) + "...",
                    }}
                  />
                  <span className="underline" onClick={() => setSeeMore(true)}>
                    See More
                  </span>
                </div>
              )}
            </Box>
          </Box>

          <div className="flex flex-col gap-y-5 h-fit w-fit">
            <ButtonGroup>
              <Button variant="soft" ref={anchorRef} onClick={handleToggle}>
                {selectedListName || "Select List"}
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="menu"
                variant="soft"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>

            <Popper
              sx={{ zIndex: 1 }}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        {userLists.map((list) => (
                          <MenuItem
                            key={list.id}
                            selected={list.name === selectedListName}
                            onClick={(event) =>
                              handleMenuItemClick(event, list.name)
                            }
                          >
                            {list.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Button
              variant="dark"
              onClick={() => navigate(`/review/${book.id}`)}
            >
              Add Review
            </Button>
          </div>
        </div>
      ) : (
        <Stack spacing={1}>
          <div className="grid grid-cols-5 gap-x-8">
            <Skeleton variant="rounded" width={250} height={400} />

            <div className="col-span-3">
              <Skeleton variant="text" width={500} height={60} />
              <Skeleton variant="text" width={100} height={40} />
              <Skeleton variant="text" width={150} height={40} />
              <Skeleton variant="text" width={550} height={350} />
            </div>

            <div className="flex flex-col gap-y-5 h-fit">
              <Skeleton variant="rectangular" width={250} height={40} />
              <Skeleton variant="rectangular" width={250} height={40} />
            </div>
          </div>
        </Stack>
      )}

      <Divider />

      <div className="mt-15">
        <Typography variant="h4">Ratings and Reviews</Typography>
        {review && review.length > 0 ? (
          <div className="bg-vanilla rounded-md p-5 space-y-5">
            <Typography variant="h5">Your Review</Typography>
            <span className="flex justify-between">
              <Rating value={review[0]?.rating} precision={0.5} readOnly />
              <Typography>{review[0]?.format}</Typography>
            </span>

            <Typography>{review[0]?.review_text}</Typography>
            <span className="flex justify-between">
              <Typography>
                Start: {review[0]?.start_date?.split("T")[0]}
              </Typography>
              <Typography>End: {review[0]?.end_date?.split("T")[0]}</Typography>
            </span>

            <ul className="flex flex-wrap text-sm gap-3">
              {review[0]?.tags &&
                review[0]?.tags.map((tag) => (
                  <li className="bg-sand p-1 text-center rounded-sm w-fit pr-4">
                    <LocalOfferIcon color="secondary" /> {tag}
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div>
            <Typography variant="body">Add your thoughts </Typography>
            <Button
              variant="dark"
              onClick={() => navigate(`/review/${book.id}`)}
            >
              Add Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}