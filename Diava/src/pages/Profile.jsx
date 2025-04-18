import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Typography, Chip } from "@mui/material";
import {
  Whatshot as Streak,
  EmojiEvents as Trophy,
  Grade as Star,
  WorkspacePremium as Medal,
  Add as Add,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import NotebookCard from "../components/Notebook";
import { auth } from "../firebase/firebase";
import { supabase } from "../client";

export default function Profile() {
  const [goals, setGoals] = useState([
    "Write 5 Reviews",
    "Complete Current Book",
    "Read 3 more classics",
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [text, setText] = useState("");
  const [username, setUserName] = useState("");
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState();
  console.log(stats);
  const getAchievements = async () => {
    try {
      const user_id = auth.currentUser?.uid;
      if (!user_id) return;

      const { data, error } = await supabase
        .from("user_achievements")
        .select(
          `
          *, 
          "achievements" (
            *
          )
          `
        )
        .eq("user_id", user_id)
        .order("achieved_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error.message);
    }
  };

  const getReadingStats = async () => {
    try {
      const user_id = auth.currentUser?.uid;
      if (!user_id) return;

      const { data, error } = await supabase
        .from("reading_statistics")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (error) throw error;

      setStats(data);
    } catch (error) {
      console.error("Error fetching reading stats:", error.message);
    }
  };

  const getGoals = async () => {
    try {
      const user_id = auth.currentUser?.uid;
      if (!user_id) return;

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user_id);

      if (error) throw error;

      setGoals(data.map((goal) => goal.goal));
    } catch (error) {
      console.error("Error fetching goals:", error.message);
    }
  };

  const createGoal = async (goalData) => {
    try {
      const { data, error } = await supabase
        .from("goals")
        .insert([goalData])
        .select();

      if (error) throw error;

      setGoals([...goals, goalData.goal]);
    } catch (error) {
      console.error("Error creating goal:", error.message);
    }
  };

  const handleClick = () => {
    setGoals([...goals, "Double click and enter a goal!"]);
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter" && editIndex !== null) {
      const updatedGoals = [...goals];
      updatedGoals[editIndex] = text;
      const user_id = auth.currentUser?.uid;
      const new_goal = { user_id, goal: text, is_completed: false };
      await createGoal(new_goal);
      setGoals(updatedGoals);
      setEditIndex(null);
      setText("");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user_id = auth.currentUser?.uid;
        if (!user_id) return;
        const { data, error } = await supabase
          .from("users")
          .select("name")
          .eq("user_id", user_id)
          .single();
        if (error) throw error;
        setUserName(data.name);
      } catch (error) {
        console.error("Cannot fetch username:", error.message);
      }
    };

    fetchUser();
    getGoals(); 
    getReadingStats();
    getAchievements();
  }, []);
 
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
                Hello, <span className="font-bold">{username}!</span>
              </Typography>
              <Typography variant="h7">Level 10</Typography>
            </Box>
          </Box>

          <Chip
            icon={<Streak />}
            label={stats?.streak + " Days" || 0 + " Days"}
          />
        </Box>

        <Box className="flex gap-x-5 justify-around text-xl text-center">
          <Typography variant="h4">
            {stats?.books_read || 0}
            <Typography variant="body2">Books Read</Typography>
          </Typography>
          <Typography variant="h4">
            {stats?.pages_read || 0}
            <Typography variant="body2">Pages Read</Typography>
          </Typography>
          <Typography variant="h4">
            {stats?.number_of_ratings || 0}
            <Typography variant="body2">Ratings</Typography>
          </Typography>
          <Typography variant="h4">
            {stats?.number_of_reviews || 0}
            <Typography variant="body2">Reviews</Typography>
          </Typography>
          <Typography variant="h4">
            {stats?.number_of_badges || 0}
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

        <div className="col-span-2 h-full">
          <NotebookCard
            title="Recent Achievements"
            hole={10}
            rows={[
              <div className="flex justify-around w-full">
                <span className="flex flex-col items-center gap-2">
                  <span>
                    {achievements?.[0]?.achievements?.icon}{" "}
                    <strong>{achievements?.[0]?.achievements?.title}</strong>
                  </span>
                  <span>{achievements?.[0]?.achievements?.description}</span>
                </span>
                <span className="flex flex-col items-center gap-2">
                  <span>
                    {achievements?.[1]?.achievements?.icon}{" "}
                    <strong>{achievements?.[1]?.achievements?.title}</strong>
                  </span>
                  <span>{achievements?.[1]?.achievements?.description}</span>
                </span>
              </div>,

              <div className="flex justify-around w-full">
                <span className="flex flex-col items-center gap-2">
                  <span>
                    {achievements?.[2]?.achievements?.icon}{" "}
                    <strong>{achievements?.[2]?.achievements?.title}</strong>
                  </span>
                  <span>{achievements?.[2]?.achievements?.description}</span>
                </span>
                <span className="flex flex-col items-center gap-2">
                  <span>
                    {achievements?.[3]?.achievements?.icon}{" "}
                    <strong>{achievements?.[3]?.achievements?.title}</strong>
                  </span>
                  <span>{achievements?.[3]?.achievements?.description}</span>
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
              <span>Average Reading Time</span>{" "}
              <span>{stats?.average_reading_time} Days</span>
            </div>,
            <div className="flex justify-between w-full">
              <span>Favorite Genre</span>{" "}
              <span>{stats?.favorite_genre || "Not calulated yet"}</span>
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
                  className="flex w-full ml-10 justify-between"
                  onDoubleClick={() => {
                    setEditIndex(index), setText(goal);
                  }}
                >
                  <Typography>🎯{goal}</Typography>
                  <CloseIcon
                    onClick={() => {
                      setGoals(goals.filter((arg) => arg !== goal));
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                  />
                </div>
              )
            )}
          />
        </div>
      </div>
    </Box>
  );
}
