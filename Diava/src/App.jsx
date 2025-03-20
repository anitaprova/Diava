import { Routes, Route, useLocation } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import SearchResults from "./components/SearchResults.jsx";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import theme from "./theme";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Review from "./pages/Review.jsx";
import Profile from "./pages/Profile.jsx";
import Messages from "./pages/Messages.jsx";
import "./index.css";

function App() {
  const location = useLocation();
  const isAuthPage = ["/","/login", "/signup"].includes(location.pathname);

  return (
    <>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          {!isAuthPage && <Navbar />}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Private Routs */}
            <Route path="/review/:id" element={<ProtectedRoute><Review /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute><Book /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
