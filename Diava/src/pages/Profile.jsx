import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Typography, Chip } from "@mui/material";
import { Whatshot as Streak } from "@mui/icons-material";

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
      <div className="bg-darkbrown"></div>
    </Box>
  );
}
