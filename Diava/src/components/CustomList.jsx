import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import axios from "axios";

export default function CustomList({ id, name }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([
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

  return (
    <div className="mb-10 w-full">
      <Typography variant="h5">{name}</Typography>
      <Box className="bg-vanilla shadow-custom w-full rounded-md">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="p-6">
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                onClick={() => navigate(`/book/${book.id}`)}
                className="w-fit"
              />
            </div>
          ))
        ) : (
          <p>Nothing added yet!</p>
        )}
      </Box>
    </div>
  );
}
