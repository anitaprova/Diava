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
  const [books, setBooks] = useState([
    {
      id: "3vo0NQbIN2YC",
      volumeInfo: {
        title: "A Thousand Splendid Suns",
        authors: ["Khaled Hosseini"],
        publishedDate: "2008-09-18",
        description:
          "'A Thousand Splendid Suns' is a chronicle of Afghan history, and a deeply moving story of family, friendship, and the salvation to be found in love.",
        pageCount: 419,
        categories: ["Fiction / General"],
        averageRating: 5,
        imageLinks: {
          thumbnail:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71jVhNuWmSXykiQxuqgjmnYXICqQKU_xGWgCb8bckuuq2JGVGBufunssx_MEON9cwxnZSVZ7X7gf9btSeZttBEqmw5ANGbrJDpjA_PALpf5beNOV5Gm7NKhu6Tr_cbaajc60bIG&source=gbs_api",
        },
      },
    },
  ]);

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

  return (
    <div className="mb-10 w-full">
      <Typography variant="h5">
        {currName ? currName : name} <EditIcon onClick={handleOpen} />
      </Typography>
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
      <Box className="bg-vanilla shadow-custom w-full rounded-md">
        {books?.length > 0 ? (
          books?.map((book) => (
            <div className="p-6">
              <img
                src={book?.volumeInfo?.imageLinks?.thumbnail}
                onClick={() => navigate(`/book/${book.id}`)}
                className="w-fit"
              />
            </div>
          ))
        ) : (
          <p>Nothing added yet!</p>
        )}
      </Box>
    </div>
  );
}
