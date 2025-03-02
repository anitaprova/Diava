import { Routes, Route } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import Home from "./pages/Home.jsx"
import Navbar from "./components/Navbar.jsx"
import "./index.css"

function App() {
  return (
    <>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Book" element={<Book />} />
      </Routes>
    </>
  );
}

export default App;
