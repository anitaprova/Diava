import React, { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
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
import { supabase } from "../client";
import EditIcon from "@mui/icons-material/Edit";

export default function BookDetail() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const genresRaw = book?.volumeInfo?.categories || [];
  const genres = [
    ...new Set(
      genresRaw.flatMap((category) => category.split("/"))
    ),
  ];
  const [open, setOpen] = useState(false);
  const [selectedListName, setSelectedListName] = useState("");
  const anchorRef = React.useRef(null);
  const [review, setReview] = useState();
  const [userReviews, setUserReviews] = useState(null);
  
  const handleMenuItemClick = async (event, listName) => {
    setSelectedListName(listName);
    setOpen(false);
  
    try {
      const userId = auth.currentUser.uid;
      const { data: listData, error: listError } = await supabase
        .from("lists") 
        .select("id")
        .eq("user_id", userId)
        .eq("name", listName)
        .single();
  
      if (listError || !listData) {
        console.error("Could not find list_id:", listError?.message);
        return;
      }
      
      const list_id = listData.id;
      const { data: existingBooks, error: fetchError } = await supabase
        .from("list_books")
        .select(`
          *,
          lists!list_id (name)
        `)
        .eq("user_id", userId)
        .eq("google_books_id", book?.id)
        .in("lists.name", ["Currently Reading", "Want to Read"]);

      if (fetchError) {
        console.error("Error checking existing books:", fetchError.message);
        return;
      }
        if ((existingBooks ?? []).length > 0) {
          alert(
            "This book is already in your 'Currently Reading' or 'Want to Read'. Please remove it from one list before adding it to the other."
          );
          return;
        }
  
        const bookData = {
          list_id,
          google_books_id: book?.id,
          title: book?.volumeInfo?.title,
          thumbnail: book?.volumeInfo?.imageLinks?.thumbnail,
          user_id: userId,
          author: book?.volumeInfo?.authors?.join(", "),
          pages: book?.volumeInfo?.pageCount,
          description: book?.volumeInfo?.description?.replace(
            /<\/?[^>]+(>|$)/g,
            ""
          ),
          genres: genres?.map((genre) => genre.trim()),
        };
  
      const { error: insertError } = await supabase
        .from("list_books")
        .insert([bookData]);
  
      if (insertError) throw insertError;
  
      console.log(`Book added to '${listName}' list`);
    } catch (error) {
      console.error("Error adding book to list:", error.message);
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
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const { data: existingBooks } = await supabase
          .from("list_books")
          .select(
            `
          *,
          lists!list_id (name)
        `
          )
          .eq("user_id", userId)
          .eq("google_books_id", book?.id)
          .in("lists.name", ["Currently Reading", "Want to Read"]);
        setSelectedListName(existingBooks?.[0]?.lists?.name);
      } catch (error) {
        console.error(
          "Error fetching list name:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, [book?.id]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const { data } = await supabase
          .from("lists")
          .select()
          .eq("user_id", userId);
        setUserLists(data);
      } catch (error) {
        console.error(
          "Error fetching list books:",
          error.response?.data || error.message
        );
      }
    }
    fetchData();
    }, []);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const { data } = await supabase
            .from("reviews")
            .select()
            .eq("user_id", userId)
            .eq("book_id", id);
          setReview(data);
        } catch (error) {
          console.error(
            "Error fetching list books:",
            error.response?.data || error.message
          );
        }
      };
      fetchData();
    }, []);
    
    useEffect(() => {
      const fetchAverageRating = async () => {
        try {
          const { data, error } = await supabase
            .from("reviews")
            .select("rating")
            .eq("book_id", id); 
          if (error) {
            console.error("Error fetching ratings:", error.message);
            return;
          }
    
          if (data.length === 0) {
            setAverageRating(null); 
            return;
          }
          //get array of ratings
          const avg =
            data.reduce((sum, r) => sum + r.rating, 0) / data.length;
            //convert into string and round up to one decimal place
          setAverageRating(parseFloat(avg.toFixed(1)));
        } catch (err) {
          console.error("Error calculating average rating:", err.message);
        }
      };
    
      if (id) {
        fetchAverageRating();
      }
    }, [id]);

    useEffect(() => {
      const fetchUserReviews = async () => {
        try {
          const currentUserId = auth.currentUser.uid;
          const { data, error } = await supabase
            .from("reviews")
            .select("*, users(name)")
            .eq("book_id", id)
            .neq("user_id", currentUserId);

          if (error) {
          console.error("Error fetching other user reviews:", error.message);
          return;
      }
      setUserReviews(data || []);
    } catch (err) {
      console.error("Error loading other user reviews:", err.message);
      }
      };
      if (id) fetchUserReviews();
    }, [id]);

    return (
      <div className="font-merriweather mr-25 ml-25 mt-15 mb-15">
        {book && book.volumeInfo.imageLinks ? (
          <div className="grid grid-cols-5 gap-x-8 mb-15">
            <div className="flex flex-col gap-y-5">
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                className="w-75 rounded-lg"
              />
              <ul className="flex flex-wrap text-sm gap-3">
                {genres &&
                  genres.map((genre) => (
                    <li className="bg-sand p-1 text-center rounded-sm w-fit pr-4">
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
                  {book?.volumeInfo?.pageCount || 0} pages
                </Typography>
    
                <Typography className="flex gap-x-2">
                  <AccessTimeIcon fontSize="small" /> ~
                  {Math.floor(book?.volumeInfo?.pageCount / 45) || 0} hrs
                </Typography>
              </Typography>
    
              <div className="flex mt-2 mb-4 gap-x-4">
                <Rating
                  value={averageRating || 0}
                  precision={0.5}
                  size="large"
                  readOnly
                />
                <p className="inline-block align-middle text-lg">
                  {averageRating}
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
                  {selectedListName}
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
                          {userLists?.map((list) => (
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
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Ratings and Reviews
          </Typography>
    
          {/* Your Review */}
          {review && review.length > 0 ? (
            <div className="bg-vanilla rounded-md p-5 space-y-5">
              <Typography variant="h5">
                Your Review{" "}
                <EditIcon onClick={() => navigate(`/review/edit/${book?.id}`)} />{" "}
              </Typography>
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
            <div className="bg-sand flex flex-col items-center p-5 text-center rounded-sm">
              <Typography variant="h5">Add your thoughts</Typography>
              <Button
                variant="dark"
                onClick={() => navigate(`/review/${book.id}`)}
                className="w-fit"
                sx={{ marginTop: "20px" }}
              >
                Add Review
              </Button>
            </div>
          )}
    
          {/* User Reviews */}
          {userReviews && userReviews.length > 0 && (
            <div className="mt-15 space-y-5">
              <Typography variant="h5">Other User Reviews</Typography>
    
              {userReviews.map((rev, index) => (
                <div key={index} className="bg-vanilla rounded-md p-5 space-y-5">
                  <Typography variant="h6">{rev.username}</Typography>
    
                  <span className="flex justify-between">
                    <Rating value={rev.rating} precision={0.5} readOnly />
                    <Typography>{rev.format}</Typography>
                  </span>
    
                  <Typography>{rev.review_text}</Typography>
                  <span className="flex justify-between">
                    <Typography>
                      Start: {rev.start_date?.split("T")[0]}
                    </Typography>
                    <Typography>End: {rev.end_date?.split("T")[0]}</Typography>
                  </span>
                  {rev.tags && rev.tags.length > 0 && (
                    <ul className="flex flex-wrap text-sm gap-3">
                      {rev.tags.map((tag, i) => (
                        <li
                          key={i}
                          className="bg-sand p-1 text-center rounded-sm w-fit pr-4"
                        >
                          <LocalOfferIcon color="secondary" /> {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }