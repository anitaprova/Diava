import { Routes, Route, useLocation } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import "./index.css";

function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup", "/profile-setup"].includes(
    location.pathname
  );

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Book" element={<Book />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>
    </>
  );
}

export default App;
