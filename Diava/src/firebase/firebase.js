import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7siyh6tlEredpaHMdeBhXAiTeSNu3tRs",
  authDomain: "diava-capstone.firebaseapp.com",
  projectId: "diava-capstone",
  storageBucket: "diava-capstone.firebasestorage.app",
  messagingSenderId: "955461184225",
  appId: "1:955461184225:web:82b4cc2cd14b483d6e25a0",
  measurementId: "G-0QDWF22S5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// const analytics = getAnalytics(app);

export { app, auth };
