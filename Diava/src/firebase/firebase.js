import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// Web App Confiuration
const firebaseConfig = {
  apiKey: "AIzaSyD7siyh6tlEredpaHMdeBhXAiTeSNu3tRs",
  authDomain: "diava-capstone.firebaseapp.com",
  projectId: "diava-capstone",
  storageBucket: "diava-capstone.firebasestorage.app",
  messagingSenderId: "955461184225",
  appId: "1:955461184225:web:d8e9e56050e495cc6e25a0",
  measurementId: "G-LPS0V8JW45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
