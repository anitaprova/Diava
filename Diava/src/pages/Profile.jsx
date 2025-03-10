import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Typography, Chip, Paper } from "@mui/material";
import {
  Whatshot as Streak,
  EmojiEvents as Trophy,
  Grade as Star,
  WorkspacePremium as Medal,
  Add as Add,
} from "@mui/icons-material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import NotebookCard from "../components/Notebook";

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
      <div className="bg-darkbrown grid grid-cols-3 gap-10 pt-10 pr-25 pl-25 pb-10">
        <div className="col-span-2">
          <NotebookCard
            title="Reading Progress"
            hole={10}
            rows={[
              <div className="flex justify-between items-center">
                <span>2025 Reading Challenge</span> <span>24/50</span>
              </div>,
              <div className="flex justify-between items-center">
                <span>Current Pace</span> <span>2 Books Ahead of Schedule</span>
              </div>,
              <div className="flex justify-between items-center">
                <span>Next Milestone</span>{" "}
                <span>25 Books - Silver Reader</span>
              </div>,
            ]}
            icons={[null, <TrendingUpIcon />, <TrackChangesIcon />]}
          />
        </div>

        <NotebookCard
          title="Your Badges"
          hole={6}
          rows={[
            <div className="flex justify-between items-center">
              <div className="bg-vanilla rounded-lg p-1 flex flex-col items-center">
                <Medal />
                Copper
              </div>
              <div className="bg-vanilla rounded-lg p-1 flex flex-col items-center">
                <Medal />
                Copper
              </div>
            </div>,
          ]}
        />

        <div className="col-span-2">
          <NotebookCard
            title="Recent Achievements"
            hole={10}
            rows={[
              <div className="flex justify-between items-center">
                <span className="flex flex-col items-center gap-2">
                  <span>
                    <Trophy /> <strong>Review Master</strong>
                  </span>
                  <span>Wrote 50 reviews</span>
                </span>
                <span className="flex flex-col items-center gap-2">
                  <span>
                    <Star /> <strong>Genre Explorer</strong>
                  </span>
                  <span>Read 5 Different Genres</span>
                </span>
              </div>,
              <div className="flex justify-between items-center">
                <span className="flex flex-col items-center gap-2">
                  <span>
                    🏆 <strong>Speed Reader</strong>
                  </span>
                  <span>Finish a book in a day</span>
                </span>
                <span className="flex flex-col items-center gap-2">
                  <span>
                    🏆 <strong>Consistency Champion</strong>
                  </span>
                  <span>30-Day Reading Streak</span>
                </span>
              </div>,
            ]}
          />
        </div>

        <NotebookCard
          title="Reading Stats"
          hole={6}
          rows={[
            <div className="flex justify-between items-center">
              <span>Average Reading Time</span> <span>2 Days</span>
            </div>,
            <div className="flex justify-between items-center">
              <span>Favorite Genre</span> <span>Fiction</span>
            </div>,
            <div className="flex justify-between items-center">
              <span>Longest Streak</span> <span>42 Days</span>
            </div>,
          ]}
        />

        <div className="col-span-3">
          <NotebookCard
            title={
              <div className="flex justify-between items-center w-full">
                <span className="flex-grow text-center">Goals</span>
                <Add className="bg-vanilla rounded-sm mr-4" />{" "}
              </div>
            }
            hole={12}
            rows={[
              <div className="flex justify-between items-center">
                <span>✔ Write 5 more reviews</span>
              </div>,
              <div className="flex justify-between items-center">
                <span>✔ Complete Current Book</span>
              </div>,
              <div className="flex justify-between items-center">
                <span>✔ Read 3 more classics</span>
              </div>,
            ]}
          />
        </div>
      </div>
    </Box>
  );
}
