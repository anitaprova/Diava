import { Routes, Route, useLocation } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import SearchResults from "./components/SearchResults.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Review from "./pages/Review.jsx";
import CurrentlyReading from "./pages/CurrentlyReading.jsx";
import ToRead from "./pages/ToRead.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Update from "./pages/Update.jsx";
import "./index.css";

function App() {
  const location = useLocation();
  const isAuthPage = ["/","/login", "/signup"].includes(location.pathname);

  return (
    <>
      <ThemeProvider theme={theme}>
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/review/:id" element={<Review />} />
          <Route path="/home" element={<Home />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/currentlyreading" element={<CurrentlyReading />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/toread" element={<ToRead />} />
          <Route path="/update/:id" element={<Update />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
