import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ClubProvider } from "./context/ClubContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ClubProvider>
        <ChatProvider>
          <App />
        </ChatProvider>        
      </ClubProvider>
    </AuthProvider>
  </BrowserRouter>
);
