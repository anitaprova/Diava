import React, { useState } from "react";
import { Link } from "react-router-dom";
import bookBackground from "../assets/book-background.jpg";
import { FaGoogle, FaBook, FaGamepad, FaUsers } from "react-icons/fa";
import "../styles/Auth.css";

const Login = () => {
  // State to manage form input values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
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

      {/* Right side - Login Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            {/* Login form fields */}
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
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>

            {/* Submit buttons */}
            <button type="submit" className="auth-button">
              Sign In
            </button>
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle /> Sign in with Google
            </button>
          </form>

          {/* Link to signup page */}
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
