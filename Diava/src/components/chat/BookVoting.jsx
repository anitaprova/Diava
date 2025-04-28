import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { FaHashtag } from "react-icons/fa";

const WindowContainer = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "#f1eada",
});

const Header = styled(Box)({
  padding: "16px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#aaa396",
});

const ContentContainer = styled(Box)({
  flex: 1,
  padding: "16px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const BookItem = styled(Paper)({
  display: "flex",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

const BookImage = styled("img")({
  width: "80px",
  height: "120px",
  objectFit: "cover",
  borderRadius: "4px",
  marginRight: "16px",
});

const BookInfo = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const BookTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "1.1rem",
  color: "#5d4b3d",
});

const BookAuthor = styled(Typography)({
  fontSize: "0.9rem",
  color: "#5d4b3d",
  marginBottom: "8px",
});

const BookDetails = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "8px",
});

const BookDetail = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "0.85rem",
  color: "#5d4b3d",
});

const BookGenres = styled(Box)({
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "auto",
});

const GenreTag = styled(Box)({
  padding: "4px 8px",
  borderRadius: "16px",
  backgroundColor: "#cec1a8",
  fontSize: "0.75rem",
  color: "#5d4b3d",
});

const VoteButton = styled(IconButton)({
  marginLeft: "auto",
  alignSelf: "center",
});

// Mock data for books
const mockBooks = [
  {
    id: "1",
    title: "A Thousand Splendid Suns",
    author: "Khaled Hosseini",
    pages: 372,
    readTime: "~6 Hours",
    rating: 4.67,
    genres: ["Historical Fiction", "Fiction"],
    image:
      "https://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    votes: 5,
  },
  {
    id: "2",
    title: "They Both Die at the End",
    author: "Adam Silvera",
    pages: 389,
    readTime: "~5 Hours",
    rating: 4.14,
    genres: ["Young Adult", "Fiction", "Romance", "Fantasy"],
    image:
      "https://books.google.com/books/content?id=Im2JDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    votes: 3,
  },
  {
    id: "3",
    title: "Wuthering Heights",
    author: "Emily Bronte",
    pages: 416,
    readTime: "~6 Hours",
    rating: 3.85,
    genres: ["Gothic Novel", "Classic"],
    image:
      "https://books.google.com/books/content?id=4RVWAAAAYAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    votes: 2,
  },
];

const BookVoting = ({ clubName }) => {
  const [books, setBooks] = useState(mockBooks);

  const handleVote = (bookId) => {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, votes: book.votes + 1 } : book
      )
    );
  };

  return (
    <WindowContainer>
      <Header>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FaHashtag size={20} style={{ marginRight: "8px" }} />
          <Typography variant="h6">
            Book Voting
            {clubName && (
              <Typography
                variant="caption"
                sx={{ ml: 1, color: "text.secondary" }}
              >
                {clubName}
              </Typography>
            )}
          </Typography>
        </Box>
      </Header>

      <ContentContainer>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Vote for next month's book
        </Typography>

        {books.map((book) => (
          <BookItem key={book.id}>
            <BookImage src={book.image} alt={book.title} />
            <BookInfo>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>by {book.author}</BookAuthor>

              <BookDetails>
                <BookDetail>
                  <span role="img" aria-label="pages">
                    📄
                  </span>{" "}
                  {book.pages} Pages
                </BookDetail>
                <BookDetail>
                  <span role="img" aria-label="time">
                    ⏱️
                  </span>{" "}
                  {book.readTime}
                </BookDetail>
                <BookDetail>
                  <span role="img" aria-label="rating">
                    ⭐
                  </span>{" "}
                  {book.rating}
                </BookDetail>
              </BookDetails>

              <BookGenres>
                {book.genres.map((genre, index) => (
                  <GenreTag key={index}>{genre}</GenreTag>
                ))}
              </BookGenres>
            </BookInfo>

            <Tooltip title="Vote for this book">
              <VoteButton onClick={() => handleVote(book.id)} color="primary">
                <Badge badgeContent={book.votes} color="primary">
                  <ThumbUpIcon />
                </Badge>
              </VoteButton>
            </Tooltip>
          </BookItem>
        ))}
      </ContentContainer>
    </WindowContainer>
  );
};

export default BookVoting;
