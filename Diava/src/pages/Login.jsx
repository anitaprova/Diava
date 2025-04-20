import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import bookBackground from "../assets/book-background.jpg";
import { FaGoogle, FaBook, FaGamepad, FaUsers } from "react-icons/fa";
import "../styles/Auth.css";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const mainpage = "/profile";

  // Check if user is logged in
  useEffect(() => {
    if (currentUser && currentUser.emailVerified && !loading) {
      navigate(mainpage, { replace: true });
    }
  }, [currentUser, navigate]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredentials.user;
      
      if (!user.emailVerified) {
        console.log("Email is not verified. Check the provided email's inbox to verify.");
        alert("Please verify your email before trying to log in");
        return;
      }

      navigate(mainpage);
      console.log("User logged in sucessfully.")
    }
    catch (error) {
      alert("Either email or password was incorrect. Please try again.")
      console.log(error);
    }

    console.log("Form submitted:", formData);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      if (result.user) {
        // Get user doc
        const userRef = doc(db, "Users", result.user.uid);
        const userDoc = await getDoc(userRef);

        // Check if gmail exists in database
        if (!userDoc.exists()) {
          console.log("User is not in database. Signing out.")
          await signOut(auth);

          // Make sure user is logged out first
          setLoading(false); 
          navigate("/googlesignup", { replace: true });
          return;
        }
        
        setLoading(false); 
        navigate(mainpage);
      }
    }
    catch (error) {
      console.log(error);
      setLoading(false); 
    }
  };

  // Handle resetting user password
  const handlePasswordReset = async () => {
    try {
      if (!formData.email || formData.email.length === 0) {
        alert("Please enter your email to receive a password reset link.");
        return;
      }

      await sendPasswordResetEmail(auth, formData.email);
      alert("Check your email inbox to reset your password and try again.");
    }
    catch (error) {
      console.log(error);
    }
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
            <Link 
              to="#" 
              onClick={(e) => {
                e.preventDefault();
                handlePasswordReset();
              }}
              className="forgot-password"
            >
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
