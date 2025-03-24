import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bookBackground from "../assets/book-background.jpg";
import { FaBook, FaGamepad, FaUsers } from "react-icons/fa";
import "../styles/Auth.css";

const ProfileSetup = () => {
  const navigate = useNavigate();

  // State to manage form input values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
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
    console.log("Profile setup complete:", formData);
    // Here you would typically save this data to your backend
    // Then redirect to the home page
    navigate("/");
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

      {/* Right side - Profile Setup Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Complete Your Profile</h2>
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
              placeholder="Choose a Username"
              required
            />

            {/* Submit button */}
            <button type="submit" className="auth-button">
              Complete Setup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
