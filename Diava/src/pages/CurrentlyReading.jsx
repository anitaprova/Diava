import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

export default function CurrentlyReading() {
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
    <div className="font-merriweather ml-50 mr-50 mt-10 mb-10">
      <Typography variant="h4">Currently Reading</Typography>
      <Box className="bg-mocha shadow-custom w-fit grid grid-cols-2 rounded-lg">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="bg-vanilla rounded-md p-6 w-fit flex m-5 gap-x-5">
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
      </Box>
    </div>
  );
}
