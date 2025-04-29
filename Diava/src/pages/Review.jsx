import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CoffeeIcon from "@mui/icons-material/Coffee";
import StarsIcon from "@mui/icons-material/Stars";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { auth } from "../firebase/firebase";
import { supabase } from "../client";

export default function Review() {
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const [book, setBook] = useState(null);
  const genresRaw = book?.volumeInfo?.categories || [];
  const genres = [
    ...new Set(genresRaw.flatMap((category) => category.split("/"))),
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [format, setFormat] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tagsText, setTagsText] = useState("");
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState("");
  const [favorite, setFavorite] = useState(false);

  const handleTags = (event) => {
    if (event.key === "Enter") {
      if (tags.includes(tagsText)) {
        console.log("duplicate");
        return;
      }
      setTags([...tags, tagsText]);
    }
  };

  const addToFavorites = async () => {
    try {
      const userId = auth.currentUser.uid;
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select("id")
        .eq("user_id", userId)
        .eq("name", "Favorites")
        .single();

      if (listError || !listData) {
        console.error("Could not find list_id:", listError?.message);
        return;
      }

      const list_id = listData.id;
      const bookData = {
        list_id,
        google_books_id: book?.id,
        title: book?.volumeInfo?.title,
        thumbnail: book?.volumeInfo?.imageLinks?.thumbnail,
        user_id: userId,
        author: book?.volumeInfo?.authors?.join(", "),
        pages: book?.volumeInfo?.pageCount,
        genres: genres.map((genre) => genre.trim()),
      };

      console.log(bookData);

      const { error: insertError } = await supabase
        .from("list_books")
        .insert([bookData]);

      if (insertError) throw insertError;
    } catch (error) {
      console.error(
        "Error fetching list books:",
        error.response?.data || error.message
      );
    }
  };

  const addToReadList = async () => {
    try {
      const userId = auth.currentUser.uid;
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select("id")
        .eq("user_id", userId)
        .eq("name", "Read")
        .single();

      if (listError || !listData) {
        console.error("Could not find list_id:", listError?.message);
        return;
      }

      const list_id = listData.id;
      const bookData = {
        list_id,
        google_books_id: book?.id,
        title: book?.volumeInfo?.title,
        thumbnail: book?.volumeInfo?.imageLinks?.thumbnail,
        user_id: userId,
        author: book?.volumeInfo?.authors?.join(", "),
        pages: book?.volumeInfo?.pageCount,
        genres: genres.map((genre) => genre.trim()),
      };

      console.log(bookData);

      const { error: insertError } = await supabase
        .from("list_books")
        .insert([bookData]);

      if (insertError) throw insertError;
    } catch (error) {
      console.error(
        "Error fetching list books:",
        error.response?.data || error.message
      );
    }
  };

  const saveReview = async (listData) => {
    try {
      const { data } = await supabase.from("reviews").insert(listData);
      addToReadList();
      if(favorite){
        addToFavorites();
      }
      // navigate(`/book/${book.id}`);
    } catch (error) {
      console.error(
        "Error fetching list books:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
        .then((response) => setBook(response.data || []))
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [id]);

  return (
    <div className="flex bg-vanilla justify-center  font-merriweather h-full w-full bg-[linear-gradient(transparent_0px,transparent_38px,#C5AD91_40px),linear-gradient(90deg,transparent_0px,transparent_38px,#C5AD91_40px)] bg-[size:40px_40px]">
      {book ? (
        <Box
          component={"div"}
          variant="outlined"
          className="bg-vanilla border border-darkbrown border-10 solid mt-10 mb-10 ml-100 mr-100 p-8 space-y-12 w-full rounded-sm shadow-lg"
        >
          <div className="flex gap-x-4">
            <img src={book.volumeInfo.imageLinks.thumbnail} />
            <div className="flex flex-col justify-between gap-y-5">
              <div>
                <h2 className="text-3xl">{book.volumeInfo.title}</h2>
                <p className="text-grey">
                  by {book.volumeInfo.authors.join(",")}
                </p>
              </div>
              <div className="flex flex-col mt-2 mb-4 gap-x-4">
                <div className="flex gap-x-30">
                  <div className="flex flex-col">
                    <span>
                      <StarsIcon /> Rating
                    </span>
                    <Rating
                      defaultValue={0.0}
                      precision={0.5}
                      size="large"
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                    />
                  </div>
                  <FormControl>
                    <RadioGroup
                      row
                      onChange={(event, newValue) => setFormat(newValue)}
                    >
                      <FormControlLabel
                        value="ebook"
                        control={<Radio />}
                        label={<PhoneIphoneIcon />}
                        labelPlacement="top"
                      />
                      <FormControlLabel
                        value="book"
                        control={<Radio />}
                        label={<AutoStoriesIcon />}
                        labelPlacement="top"
                      />
                      <FormControlLabel
                        value="audio"
                        control={<Radio />}
                        label={<HeadphonesIcon size="large" />}
                        labelPlacement="top"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-5 w-full">
              <span className="w-full">
                <p>
                  <CalendarMonthIcon /> Start Date
                </p>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </span>

              <span className="w-full">
                <p>
                  <CalendarMonthIcon /> End Date
                </p>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="date"
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </span>
            </div>
            <Button variant="dark">Add Read Date</Button>
          </div>

          <div className="flex flex-col">
            <span>
              <LocalOfferIcon /> Tags
            </span>
            <div className="flex gap-x-4">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                onChange={(event) => setTagsText(event.target.value)}
                onKeyDown={handleTags}
              />
            </div>
            <div className="flex gap-4 mt-1 text-darkbrown">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <p key={index} className="bg-brown rounded-sm p-1 pl-2 pr-2">
                    {tag}{" "}
                    <CloseIcon
                      onClick={() => {
                        setTags(tags.filter((arg) => arg !== tag));
                      }}
                      sx={{
                        cursor: "pointer",
                      }}
                    />
                  </p>
                ))
              ) : (
                <p>Press enter after each tag!</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <CoffeeIcon /> Notes and Thoughts
            </div>
            <TextField
              size="large"
              variant="outlined"
              minRows={8}
              multiline
              onChange={(event) => setNotes(event.target.value)}
            />
            <div className="flex gap-x-2 mt-2">
              <Rating
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                max={1}
                variant="heart"
                onChange={() => favorite ? setFavorite(false) : setFavorite(true)}
              />{" "}
              <p className="text-md ">Add to Favorites</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="dark"
              onClick={() =>
                saveReview({
                  user_id: auth.currentUser.uid,
                  book_id: id,
                  rating: rating,
                  review_text: notes,
                  start_date: startDate,
                  end_date: endDate,
                  format: format,
                  tags: tags,
                })
              }
            >
              Save Review
            </Button>
          </div>
        </Box>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
