import React, { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  TextField,
  Autocomplete,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { FaHashtag } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext";
import { useClub } from "../../context/ClubContext";
import { supabase } from "../../client";
import axios from "axios";

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



const BookVoting = ({ clubName, isAdmin }) => {
  const { currentUser } = useAuth();
  const { currentClub } = useClub();
  const [books, setBooks] = useState([]);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const voteMonth = new Date().toLocaleString("default", { month: "long" });


  useEffect(() => {
    const fetchBooks = async () => {
      if (!currentClub) return;
      const { data, error } = await supabase
        .from("voting_books")
        .select("*")
        .eq("club_uid", currentClub.uid)
        .eq("voting_month", voteMonth);
      if (!error) setBooks(data);
    };
    fetchBooks();
  }, [currentClub]);

  // Check if the user is an admin or owner based on the club data
  const checkIsAdmin = () => {
    if (!currentClub || !currentUser) return false;

    const userRole = currentClub.members?.[currentUser.uid]?.role;
    return userRole === "Admin" || userRole === "Owner";
  };

  const handleVote = async (bookId) => {
     const { data: existingVotes } = await supabase
      .from("voting")
      .select("*")
      .eq("user_id", currentUser.uid)
      .eq("club_id", currentClub.uid)
      .eq("vote_month", voteMonth);

    if (existingVotes?.length) {
      setSnackbarMessage("You've already voted this month!");
      setSnackbarOpen(true);
      return;
    }
    await supabase.from("voting").insert([
      {
        club_id: currentClub.uid,
        user_id: currentUser.uid,
        vote_month: voteMonth,
      },
    ]);

    const {error} = await supabase
      .from("voting_books")
      .update({votes: bookId.votes + 1})
      .eq("google_book_id", bookId.id);

      if(!error){
        setBooks(
          books.map((book) =>
            book.id === bookId ? { ...book, votes: book.votes + 1 } : book
        )
      );
      }
    
  };

  const handleAddBook = () => {
    setAddBookOpen(true);
  };

  const handleCloseAddBook = () => {
    setAddBookOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`
      );
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

 const handleSelectBook = async (selectedBook) => {
    if (!selectedBook) return;
    const voteMonth = new Date().toLocaleString("default", { month: "long" });

    const { data: existing } = await supabase
      .from("voting_books")
      .select("id")
      .eq("google_book_id", selectedBook.id)
      .eq("club_uid", currentClub.uid)
      .eq("voting_month", voteMonth);

    if (existing?.length) {
      setSnackbarMessage("This book is already added for this month's vote.");
      setSnackbarOpen(true);
      return;
    } else {
      const bookToAdd = {
        title: selectedBook.volumeInfo.title,
        author: selectedBook.volumeInfo.authors?.join(", ") || "Unknown Author",
        pages: selectedBook.volumeInfo.pageCount || 0,
        image:
          selectedBook.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/80x120?text=No+Image",
        genres: selectedBook.volumeInfo.categories || [],
        votes: 0,
        google_book_id: selectedBook.id,
        read_time: `~${Math.floor(
          (selectedBook.volumeInfo.pageCount || 0) / 0.6 / 60
        )} Hours`,
        club_uid: currentClub.uid,
        voting_month: voteMonth,
        rating: selectedBook.volumeInfo.averageRating || 0,
      };

      const { data, error } = await supabase
        .from("voting_books")
        .insert([bookToAdd])
        .select();

      console.log(error);

      if (!error && data?.[0]) {
        setBooks([...books, bookToAdd]);
        setSnackbarMessage("Book added successfully!");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to add the book. Please try again.");
        setSnackbarOpen(true);
      }

      setAddBookOpen(false);
    }
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
                  {book.read_time}
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
      <Dialog open={addBookOpen} onClose={handleCloseAddBook} maxWidth="md" fullWidth>
        <DialogTitle>Add a Book for Voting</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Search for a book to add to the voting list. Club members will be able to vote for this book.
          </DialogContentText>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a book..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: "#5d4b3d",
                color: "white",
                "&:hover": { bgcolor: "#433422" },
              }}
            >
              Search
            </Button>
          </Box>

          {searchResults.length > 0 && (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {searchResults.map((book) => (
                <Paper
                  key={book.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  onClick={() => handleSelectBook(book)}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/80x120?text=No+Image"}
                      alt={book.volumeInfo.title}
                      style={{ width: 80, height: 120, objectFit: 'cover' }}
                    />
                    <Box>
                      <Typography variant="h6">{book.volumeInfo.title}</Typography>
                      <Typography variant="subtitle1">
                        by {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.volumeInfo.pageCount} pages • {book.volumeInfo.averageRating ? `${book.volumeInfo.averageRating}⭐` : "No rating"}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBook} sx={{ color: "#5d4b3d" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </WindowContainer>
  );
};

export default BookVoting;
