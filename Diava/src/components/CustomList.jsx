import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { auth } from "../firebase/firebase";
import axios from "axios";
import { supabase } from "../client";

export default function CustomList({ id, name, list_id }) {
  const navigate = useNavigate();
  const [currName, setCurrName] = useState(name);
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("list_books")
        .select("*")
        .eq("list_id", list_id);

      if (error) {
        console.error("Error fetching books for list:", error);
      } else {
        setBooks(data || []);
      }
    };

    fetchBooks();
  }, [list_id]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateList = async (listData) => {
    const { data, error } = await supabase
      .from("lists")
      .update(listData)
      .eq("id", id)
      .select("*");

    if (error) console.error("Error fetching data:", error);
    else {
      setCurrName(data[0].name);
    }
  };

  const deleteList = async () => {
    const { error } = await supabase
      .from("lists")
      .delete()
      .eq("id", id);

    if (error) console.error("Error fetching data:", error);
    else {
      window.location.reload();
    }
  };

  const handleListClick = () => {
    navigate(`/customlist/${id}`);
  };
  

  return (
  <div className="mb-10 w-full">
    <div className="flex items-center mb-2">
      <Typography
        variant="h5"
        onClick={handleListClick}
        className="cursor-pointer mr-2"
      >
        {currName ? currName : name}
      </Typography>
      <EditIcon
        onClick={handleOpen}
        className="text-gray-600 cursor-pointer hover:text-black"
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const newName = formJson.name;
              updateList({
                user_id: auth.currentUser.uid,
                name: newName,
                id: id,
              });
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Edit {name}</DialogTitle>
        <DialogContent className="space-y-5">
          <div className="gap-x-5">
            <Typography>New name</Typography>
            <TextField size="small" variant="outlined" name="name" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="dark"
            onClick={() => {
              deleteList();
              handleClose();
            }}
          >
            Delete
          </Button>
          <Button type="submit" variant="coffee">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Box className="bg-vanilla shadow-custom w-full rounded-md overflow-x-auto">
        <Box className="flex gap-x-4 p-4">
          {books?.length > 0 ? (
            books.map((book, idx) => (
              <img
                key={idx}
                src={book.thumbnail}
                onClick={() => navigate(`/book/${book.google_books_id}`)}
                className="w-[120px] h-auto cursor-pointer flex-shrink-0"
              />
            ))
          ) : (
            <p className="p-5">Nothing added yet!</p>
          )}
        </Box>
      </Box>
    </div>
  );
}
