import React, { useState } from "react";
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
import axios from "axios"


export default function Profile() {
  const [goals, setGoals] = useState([
    "Write 5 Reviews",
    "Complete Current Book",
    "Read 3 more classics",
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [text, setText] = useState("");
  
  const getGoals = async () => {
    try {
      const response  = await axios.get('http://localhost:5001/goals')

    } catch (error) {
      console.error("Error creating goal:", error)
    }
  };
  
  const createGoal = async (goalData) => {
    try {
      const response = await axios.post("http://localhost:5001/goals", goalData);
      setGoals([...goals, response.data]); 
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleClick = () => {
    setGoals([...goals, "Double click and enter a goal!"]);
    console.log();
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter" && editIndex !== null) {
      const updatedGoals = [...goals];
      updatedGoals[editIndex] = text;
      const user_id = 12345678
      const new_goal = {user_id, goal: text, is_completed: false};
      await createGoal(new_goal);
      console.log('New goal added: ', createGoal.goalData);
      setGoals(updatedGoals);
      setEditIndex(null);
      setText("");
    }
  };
  /*
  const handleClick = () => {
    setGoals([...goals, "Double click and enter a goal!"]);
    console.log();
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      const updatedGoals = [...goals];
      updatedGoals[editIndex] = text;
      setGoals(updatedGoals);
      setEditIndex(null);
      setText("");
    }
  };
*/
  return (
    <Box className="flex flex-col">
      <Box className="bg-vanilla pb-5 text-darkbrown">
        <Box className="flex items-center justify-between mr-25">
          <Box className="flex items-center ml-10">
            <AccountCircleIcon
              sx={{
                width: 100,
                height: 100,
                margin: 5,
              }}
              fontSize="large"
            />
            <Box>
              <Typography variant="h4">
                Hello, <span className="font-bold">Username!</span>
              </Typography>
              <Typography variant="h7">Level 10</Typography>
            </Box>
          </Box>

          <Chip icon={<Streak />} label="7 Day Streak" />
        </Box>

        <Box className="flex gap-x-5 justify-around text-xl text-center">
          <Typography variant="h4">
            123
            <Typography variant="body2">Books Read</Typography>
          </Typography>
          <Typography variant="h4">
            12,345
            <Typography variant="body2">Pages Read</Typography>
          </Typography>
          <Typography variant="h4">
            80
            <Typography variant="body2">Reviews</Typography>
          </Typography>
          <Typography variant="h4">
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
              <div className="flex justify-between w-full">
                <span className="fgrow">2025 Reading Challenge</span>{" "}
                <span>24/50</span>
              </div>,
              <div className="flex justify-between w-full">
                <span>
                  <TrendingUpIcon /> <span>Current Pace</span>
                </span>
                <span>2 Books Ahead of Schedule</span>
              </div>,
              <div className="flex justify-between w-full">
                <span>
                  <TrackChangesIcon /> <span>Next Milestone</span>
                </span>
                <span>25 Books - Silver Reader</span>
              </div>,
            ]}
          />
        </div>

        <NotebookCard
          title="Your Badges"
          hole={6}
          rows={[
            <div className="flex justify-between gap-8 w-fit">
              <div className="bg-vanilla w-15 rounded-lg p-1 flex flex-col items-center">
                <Medal />
                Copper
              </div>
              <div className="bg-vanilla w-15 rounded-lg p-1 flex flex-col items-center">
                <Medal />
                Gold
              </div>
            </div>,
          ]}
        />

        <div className="col-span-2">
          <NotebookCard
            title="Recent Achievements"
            hole={10}
            rows={[
              <div className="flex justify-around w-full">
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
              <div className="flex justify-around w-full">
                <span className="flex flex-col items-center gap-2">
                  <span>
                    🏃 <strong>Speed Reader</strong>
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
            <div className="flex justify-between w-full">
              <span>Average Reading Time</span> <span>2 Days</span>
            </div>,
            <div className="flex justify-between w-full">
              <span>Favorite Genre</span> <span>Fiction</span>
            </div>,
            <div className="flex justify-between w-full">
              <span>Longest Streak</span> <span>42 Days</span>
            </div>,
          ]}
        />

        <div className="col-span-3">
          <NotebookCard
            title={
              <div
                className="flex justify-between items-center w-full"
                onClick={handleClick}
              >
                <span className="flex-grow text-center">Goals</span>
                <Add className="bg-vanilla rounded-sm mr-4" />
              </div>
            }
            hole={16}
            rows={goals.map((goal, index) =>
              editIndex === index ? (
                <input
                  type="text"
                  value={text}
                  onKeyDown={handleEnter}
                  defaultChecked="Enter Goal"
                  onChange={(event) => setText(event.target.value)}
                  className="w-full ml-10"
                />
              ) : (
                <div
                  className="w-full ml-10"
                  onDoubleClick={() => {
                    setEditIndex(index), setText(goal);
                  }}
                >
                  🎯{goal}
                </div>
              )
            )}
          />
        </div>
      </div>
    </Box>
  );
}
