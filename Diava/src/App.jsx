import { Routes, Route, useLocation } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import SearchResults from "./components/SearchResults.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import "./index.css";

function App() {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      <ThemeProvider theme={theme}>
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
