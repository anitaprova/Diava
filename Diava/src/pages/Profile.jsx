import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Typography, Chip, Paper } from "@mui/material";
import { Whatshot as Streak } from "@mui/icons-material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

export default function Profile() {
  return (
    <Box className="flex flex-col">
      <Box className="bg-vanilla pb-5">
        <Box className="flex items-center justify-between mr-25">
          <Box className="flex items-center">
            <AccountCircleIcon
              sx={{ width: 64, height: 64, margin: 5 }}
              fontSize="large"
            />
            <Box>
              <Typography variant="h5">
                Hello, <span className="font-bold">Username!</span>
              </Typography>
              <Typography variant="h7">Level 10</Typography>
            </Box>
          </Box>

          <Chip icon={<Streak />} label="7 Day Streak" />
        </Box>

        <Box className="flex gap-x-5 justify-around text-xl text-center">
          <Typography variant="h5">
            123
            <Typography variant="body2">Books Read</Typography>
          </Typography>
          <Typography variant="h5">
            12,345
            <Typography variant="body2">Pages Read</Typography>
          </Typography>
          <Typography variant="h5">
            80
            <Typography variant="body2">Reviews</Typography>
          </Typography>
          <Typography variant="h5">
            15
            <Typography variant="body2">Badges</Typography>
          </Typography>
        </Box>
      </Box>
      <div className="bg-white mb-5"></div>
      <div className="bg-darkbrown grid grid-cols-2">
        <Paper
          className="max-w-md mx-auto rounded-md overflow-hidden shadow-lg"
          sx={{
            backgroundColor: "#c1a882",
            color: "#433422",
            position: "relative",
            pt: 1,
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-white/80 rounded-b-sm" />

          <div className="flex justify-between px-4 mb-2">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-darkbrown" />
              ))}
          </div>

          <Typography variant="h5" className="text-center mb-2 font-semibold">
            Reading Progress
          </Typography>
          <Box className="px-4 py-2 border-t border-gray-600 flex justify-between items-center">
            <Typography variant="body2" className="font-medium">
              2025 Reading Challenge
            </Typography>
            <Typography variant="body2" className="font-medium">
              24/50
            </Typography>
          </Box>
          <Box className="px-4 py-2 border-t border-gray-600 flex justify-between items-center">
            <Typography variant="body2" className="font-medium">
              <TrendingUpIcon /> Current Pace
            </Typography>
            <Typography variant="body2" className="font-medium">
              <TrackChangesIcon /> Next Milestone
            </Typography>
          </Box>
          <Box className="px-4 py-2 border-t border-gray-600 flex justify-between items-center">
            <Typography variant="body2" className="font-medium">
              2 Books Ahead of Schedule
            </Typography>
            <Typography variant="body2" className="font-medium">
              25 Books - Silver Reader
            </Typography>
          </Box>
          <Box className="px-4 py-2 border-t border-gray-600 flex justify-between items-center"></Box>
        </Paper>
      </div>
    </Box>
  );
}
