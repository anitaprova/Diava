import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

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
  console.log(toRead);
  return (
    <div className="ml-50 mr-50 mt-10 mb-10 font-merriweather">
      <div className="grid grid-flow-col grid-rows-4 gap-x-8">
        <div className="row-span-4">
          <Typography variant="h4" className="w-full">
            Currently Reading
          </Typography>
          <Box className="bg-sand flex flex-col gap-y-3 rounded-lg h-full w-auto">
            {currentlyReading.length > 0 ? (
              toRead.slice(0, 3).map((book) => (
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

                      <Button variant="dark">Update Progress</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nothing added yet</p>
            )}
          </Box>
        </div>

        <div className="col-span-1 row-span-2">
          <Typography variant="h4">To Read Pile</Typography>
          <Box className="bg-sand flex gap-x-2 rounded-lg">
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
              <p>Nothing added yet</p>
            )}
          </Box>
        </div>

        <div className="col-span-1 row-span-2">
          <Typography variant="h4">Recommendation</Typography>
          <Box className="bg-sand flex rounded-lg">
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
              <p>Nothing added yet</p>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
