import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import Rating from "@mui/material/Rating";

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
      pageRange: "30-40",
      comment:
        '"Really enjoyed today\'s chapter! The pacing is picking up and the characters..."',
      date: "03/02/2025",
      rating: 5,
    },
    {
      pageRange: "10-20",
      comment: '"Wow I can\'t believe that she did that."',
      date: "02/25/2025",
      rating: 4,
    },
    {
      pageRange: "0-10",
      comment:
        '"I\'m loving the book so far, interested to see where the story heads and I love the characters...."',
      date: "02/23/2025",
      rating: 3,
    },
  ]);

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

            <Button variant="dark" className="self-center w-fit">
              Add Log
            </Button>
          </Box>
        </div>
      ) : (
        <p>Loading</p>
      )}

      <Box className="flex flex-col gap-y-5 mt-10 ">
        {logs.map((entry, index) => (
          <Box
            key={index}
            className="bg-vanilla flex flex-row justify-between items-start p-6 rounded-lg shadow-small"
          >
            <Box className="flex flex-col">
              <Typography variant="h5">
                Pages: {entry.pageRange}{" "}
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
                <Button size="small" variant="coffee">
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