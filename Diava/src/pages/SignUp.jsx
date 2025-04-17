import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bookBackground from "../assets/book-background.jpg";
import { FaBook, FaGamepad, FaUsers, FaGoogle } from "react-icons/fa";
import "../styles/Auth.css";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../client";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const mainpage = "/profile";

  // Check if user is logged in
  useEffect(() => {
    if (currentUser && currentUser.emailVerified) {
      navigate(mainpage, { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.emailVerified) {
      navigate(mainpage, { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "username") {
      const exists = await checkUsernameExists(value);
      setUsernameMessage(
        exists
          ? "Username already taken. Please choose another."
          : "Username available."
      );
    }
  };

  // Handle form submission
  const checkUsernameExists = async (username) => {
    if (!username) {
      console.error("Username cannot be empty.");
      return false;
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("name", username)
        .single();

      return !!data;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  async function getAllUsers() {
    const { data, error } = await supabase.from("lists").select("*");

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return data;
  }

  getAllUsers().then((lists) => {
    console.log("Users:", lists);
  });

  const createDefaultLists = async (user_id) => {
    const defaultLists = [
      { user_id, name: "Want to Read" },
      { user_id, name: "Currently Reading" },
      { user_id, name: "Read" },
      { user_id, name: "Favorites" },
    ];

    try {
      const { error } = await supabase.from("lists").insert(defaultLists);
      if (error) throw error;
      console.log("Default lists created");
    } catch (err) {
      console.error("Error creating user's default lists:", err.message);
    }
  };

  const createUserStatistic = async (user_id) => {
    const stat = [{ user_id }];

    try {
      const { error } = await supabase.from("reading_statistics").insert(stat);
      if (error) throw error;
      console.log("Default stat created");
    } catch (err) {
      console.error("Error creating user's stats", err.message);
    }
  };

  const createAchievement = async (user_id) => {
    const achievement = [{ user_id, achievement_key: "login" }];

    try {
      const { error } = await supabase
        .from("user_achievements")
        .insert(achievement);
      if (error) throw error;
      console.log("Default achievement created");
    } catch (err) {
      console.error("Error creating user's achievement", err.message);
    }
  };

  const createUser = async (userData) => {
    try {
      const { error } = await supabase.from("users").insert([userData]);

      if (error) throw error;
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usernameAvailabe = await checkUsernameExists(formData.username);
      if (usernameAvailabe) {
        alert("Username is already taken. Please pick another one.");
        return;
      }

      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      ).then(async (userCredentials) => {
        const user = userCredentials.user;
        await sendEmailVerification(user);
        alert("Go to your email and verify your account.");

        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            uid: user.uid,
          });

          await setDoc(doc(db, "UserChats", user.uid), {});
          await setDoc(doc(db, "UserClubs", user.uid), {});

          // Store username in database
          const newUser = { user_id: user.uid, name: formData.username };
          await createUser(newUser);
          await createDefaultLists(user.uid);
          await createUserStatistic(user.uid);
          await createAchievement(user.uid);
          console.log("New user created in Supabase");
        }

        navigate("/login");
        console.log("User signed up successfully.");
      });
    } catch (error) {
      console.log(error.message);
    }

    console.log("Form submitted:", formData);
    navigate("/");
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
    navigate("/googlesignup");
  };

  return (
    <div className="auth-container">
      {/* Left side - Brand and Features */}
      <div className="auth-left">
        <div className="brand">
          <h1>Diava</h1>
          <img src={bookBackground} alt="Open book with flowers" />
        </div>

        <div className="features">
          {/* Feature highlights */}
          <div className="feature">
            <FaBook size={70} />
            <span>Track Your Reading</span>
          </div>
          <div className="feature">
            <FaGamepad size={70} />
            <span>Gamified Features</span>
          </div>
          <div className="feature">
            <FaUsers size={70} />
            <span>Join a Book Club</span>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Welcome to Diava</h2>
          <form onSubmit={handleSubmit}>
            {/* Name fields */}
            <div className="name-fields">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </div>

            {/* Username field */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />

            {/* Email and password fields */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />

            {/* Submit buttons */}
            <button type="submit" className="auth-button">
              Sign Up
            </button>
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignUp}
            >
              <FaGoogle /> Sign up with Google
            </button>
          </form>

          {/* Link to login page */}
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
