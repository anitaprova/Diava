import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function NotebookCard({ title, rows, hole }) {
  return (
    <Paper
      className="w-full mx-auto rounded-md overflow-hidden shadow-lg"
      sx={{
        backgroundColor: "#c1a882",
        color: "#433422",
        position: "relative",
        pt: 1,
        boxShadow: "-10px 20px 0px 0px #EEE8D8",
      }}
    >
      <div className="flex justify-between px-4 mb-2">
        {Array.from({ length: hole }).map((_, i) => (
          <div key={i} className="w-7 h-7 rounded-full bg-darkbrown" />
        ))}
      </div>

      <Typography variant="h5" className="text-center mb-2 font-semibold">
        {title}
      </Typography>

      {rows.map((row, index) => (
        <Box
          key={index}
          className="px-4 py-2 border-t border-gray-600 flex justify-between items-center"
        >
          <Typography variant="body2" className="font-medium">
            {row}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
