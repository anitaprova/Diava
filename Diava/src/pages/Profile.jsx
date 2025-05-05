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
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
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
  const [stats, setStats] = useState({
    books_read: 0,
    pages_read: 0,
    number_of_reviews: 0,
    number_of_ratings: 0,
    streak: 0,
    xp: 0,
    level: 0,});
  const [achievements, setAchievements] = useState();
  const [badge, setBadge] = useState("");
  const [nextBadge, setNextBadge] = useState("");
  
  const getNextMileStone = async () => {
    const curr = badge[0]?.tier;
    if (curr == "Copper") {
      setNextBadge("25 Books-Silver Reader");
    } else if (curr == "Silver") {
      setNextBadge("50 Books-Gold Reader");
    } else if (curr == "Gold") {
      setNextBadge("100 Books-Platinum Reader");
    } else if (curr == "Platinum") {
      setNextBadge("150 Books-Diamond Reader");
    } else if (curr == "Diamond") {
      setNextBadge("You have achieved the highest badge!");
    }
  };

  const getBadges = async () => {
    try {
      if (!stats?.current_badge) return;

      const { data, error } = await supabase
        .from("badges")
        .select()
        .eq("id", stats?.current_badge);

      if (error) throw error;

      setBadge(data);
    } catch (error) {
      console.error("Error fetching badge:", error.message);
    }
  };

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
      const xp = calculateXP(data);
      const level = getLevel(xp);
      setStats({ ...data, level});
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


 
  const calculateXP = (stats) => {
    return Math.floor(
      (stats.books_read || 0) * 50 + //maybe change point system?
      (stats.pages_read || 0) * 1.0 +
      (stats.number_of_reviews || 0) * 30 +
      (stats.number_of_ratings || 0) * 10 +
      (stats.streak || 0) * 5
    );
  };
  const getLevel = (xp) => Math.floor(Math.sqrt(xp / 100));

  useEffect(() => {
    getBadges();
  }, [stats]);

  useEffect(() => {
    getNextMileStone();
  }, [badge]);

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
              <Typography variant="h7">Level {stats.level || 0 }</Typography>
            </Box>
          </Box>

          <Chip
            icon={<Streak />}
            label={stats?.streak + " Day(s)" || 0 + " Day(s)"}
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
                <span>
                  <TrendingUpIcon /> <span>Current Level Pace</span>
                </span>
                <span>2 Books Ahead of Schedule</span>
              </div>,
              <div className="flex justify-between w-full">
                <span>
                  <ImportContactsIcon /> Your Reading Progress
                </span>
                <span>
                  {stats?.books_read}/{nextBadge.split("-")[0] || "10 Books"}
                </span>
              </div>,
              <div className="flex justify-between w-full">
                <span>
                  <TrackChangesIcon /> <span>Next Badge Milestone</span>
                </span>
                <span>{nextBadge.split("-")[1] || "Copper Reader"}</span>
              </div>,
            ]}
          />
        </div>

        <NotebookCard
          title="Current Badge"
          hole={6}
          rows={[
            <div className="flex justify-center w-full">
              <div className="flex flex-col items-center text-lg">
                {badge ? (
                  <span className="bg-vanilla rounded-lg p-5">
                    <Medal fontSize="large" />
                    {badge?.[0]?.tier}
                  </span>
                ) : (
                  <span className="rounded-lg p-5">No badges earned yet</span>
                )}
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
              <span>{stats?.average_reading_time || 0} Days</span>
            </div>,
            <div className="flex justify-between w-full">
              <span>Favorite Genre</span>{" "}
              <span>{stats?.favorite_genre || "Not calulated yet"}</span>
            </div>,
            <div className="flex justify-between w-full">
              <span>Longest Streak</span>
              <span>
                {stats?.longest_streak ?? 0} Day{stats?.longest_streak === 1 ? '' : 's'}
              </span>
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
