import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Rating from "@mui/material/Rating";

export default function ToRead() {
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
  const genres = [
    ...new Set(
      books[0].volumeInfo.categories.flatMap((category) => category.split("/"))
    ),
  ];

  return (
    <div className="font-merriweather ml-50 mr-50 mt-10">
      <Typography variant="h4">To Read Pile</Typography>
      <Box className="bg-mocha rounded-lg grid grid-cols-2 gap-x-4 shadow-custom">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="bg-vanilla rounded-md p-6 w-fit flex mt-5 ml-5 mb-5 gap-x-5">
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                onClick={() => navigate(`/book/${book.id}`)}
                className="w-fit"
              />
              <div className="space-y-4">
                <div>
                  <Typography variant="h6">{book.volumeInfo.title}</Typography>
                  <Typography variant="subtitle2">
                    By {book.volumeInfo.authors}
                  </Typography>
                </div>

                <Typography variant="body2" className="flex flex-row gap-x-8">
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

                <ul className="flex flex-wrap text-sm gap-3">
                  {genres.map((genre) => (
                    <li className="bg-sand p-1 text-center rounded-sm w-fit">
                      <LocalOfferIcon color="secondary" /> {genre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>Nothing added yet!</p>
        )}
      </Box>
    </div>
  );
}
