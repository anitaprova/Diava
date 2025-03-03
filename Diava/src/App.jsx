import { Routes, Route } from "react-router-dom";
import Book from "./pages/BookView.jsx";
import Home from "./pages/Home.jsx"
import Navbar from "./components/Navbar.jsx"
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./index.css"

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Book" element={<Book />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
