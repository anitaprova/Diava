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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { FaHashtag } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import { useClub } from "../../context/ClubContext";

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

const BookVoting = ({ clubName, isAdmin }) => {
  const { currentUser } = useAuth();
  const { currentClub } = useClub();
  const [books, setBooks] = useState(mockBooks);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    pages: "",
    readTime: "",
    rating: "",
    image: "",
    genres: ""
  });

  // Check if the user is an admin or owner based on the club data
  const checkIsAdmin = () => {
    if (!currentClub || !currentUser) return false;

    const userRole = currentClub.members?.[currentUser.uid]?.role;
    return userRole === "Admin" || userRole === "Owner";
  };

  const handleVote = (bookId) => {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, votes: book.votes + 1 } : book
      )
    );
  };

  const handleAddBook = () => {
    setAddBookOpen(true);
  };

  const handleCloseAddBook = () => {
    setAddBookOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleSubmitNewBook = () => {
    // Create new book object
    const genresArray = newBook.genres.split(',').map(genre => genre.trim());

    const bookToAdd = {
      id: Date.now().toString(), // Simple id for now
      title: newBook.title,
      author: newBook.author,
      pages: parseInt(newBook.pages) || 0,
      readTime: newBook.readTime || "~5 Hours",
      rating: parseFloat(newBook.rating) || 0,
      genres: genresArray,
      image: newBook.image || "https://via.placeholder.com/80x120?text=No+Image",
      votes: 0
    };

    // Add new book to the list
    setBooks([...books, bookToAdd]);

    // Reset form and close dialog
    setNewBook({
      title: "",
      author: "",
      pages: "",
      readTime: "",
      rating: "",
      image: "",
      genres: ""
    });
    setAddBookOpen(false);
  };

  // Determine if current user has admin privileges
  const isUserAdmin = isAdmin || checkIsAdmin();

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Vote for next month's book</Typography>

          {/* Admin Add Book Button */}
          {isUserAdmin && (
            <Tooltip title="Add book for voting">
              <IconButton
                onClick={handleAddBook}
                sx={{ color: "#5d4b3d" }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

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

      {/* Add Book Dialog */}
      <Dialog open={addBookOpen} onClose={handleCloseAddBook}>
        <DialogTitle>Add a Book for Voting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a book to the voting list. Club members will be able to vote for this book.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Book Title"
            fullWidth
            variant="outlined"
            value={newBook.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="author"
            label="Author"
            fullWidth
            variant="outlined"
            value={newBook.author}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              margin="dense"
              name="pages"
              label="Pages"
              type="number"
              variant="outlined"
              value={newBook.pages}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="readTime"
              label="Read Time"
              variant="outlined"
              value={newBook.readTime}
              onChange={handleInputChange}
              placeholder="~5 Hours"
            />
            <TextField
              margin="dense"
              name="rating"
              label="Rating"
              type="number"
              variant="outlined"
              value={newBook.rating}
              onChange={handleInputChange}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </Box>
          <TextField
            margin="dense"
            name="genres"
            label="Genres (comma separated)"
            fullWidth
            variant="outlined"
            value={newBook.genres}
            onChange={handleInputChange}
            placeholder="Fiction, Fantasy, Adventure"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="image"
            label="Book Cover URL"
            fullWidth
            variant="outlined"
            value={newBook.image}
            onChange={handleInputChange}
            placeholder="https://example.com/book-cover.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBook} sx={{ color: "#5d4b3d" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitNewBook}
            variant="contained"
            sx={{
              bgcolor: "#5d4b3d",
              color: "white",
              "&:hover": { bgcolor: "#433422" },
            }}
            disabled={!newBook.title || !newBook.author}
          >
            Add Book
          </Button>
        </DialogActions>
      </Dialog>
    </WindowContainer>
  );
};

export default BookVoting;
