import { Routes, Route } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import "./index.css"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Book />} />
        <Route path="/Book" element={<Book />} />
      </Routes>
    </>
  );
}

export default App;
