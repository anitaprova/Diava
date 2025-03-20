import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import bookBackground from "../assets/book-background.jpg";
import { FaBook, FaGamepad, FaUsers, FaGoogle } from "react-icons/fa";
import "../styles/Auth.css";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const mainpage = "/profile";

  // Check if user is logged in
  const { currentUser } = useAuth();
  if (currentUser && currentUser.emailVerified) {
    return <Navigate to={mainpage} replace />
  }

  // State to manage form input values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then( async (userCredentials) => {
          const user = userCredentials.user;
          await sendEmailVerification(user);
          alert("Go to your email and verify your account.");

          /* 
          NOTE: this is done BEFORE user verifies account due to potential issues
          of having the first and last names persist if they wait or refresh the page.
          Accounts not verified can be removed after a set time or a better solution
          can be made to ensure fields are filled even if user doesn't make the account there.
          */
          // Store user in database.
          if (user) {
            await setDoc(doc(db, "Users", user.uid), {
              email: user.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
            });
          }

          navigate("/login");
          console.log("User signed up successfully.");
        });
    }
    catch (error) {
      console.log(error.message);
    }

    console.log("Form submitted:", formData);
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = () => {
    // Google authentication will be implemented here
    // Seperate page will be needed
    console.log("Google sign up clicked");
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
