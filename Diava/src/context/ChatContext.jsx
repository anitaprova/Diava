import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const INITIAL_STATE = {
        chatId:"null",
        user:{}
    };

    const chatReducer = (state, action) => {
        switch(action.type) {
            case "CHANGE_USER":
                return {
                    user:action.payload,
                    chatId: currentUser.uid > action.payload.uid 
                    ? currentUser.uid + action.payload.uid 
                    : action.payload.uid + currentUser.uid
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data:state, dispatch }}>
            { children }
        </ChatContext.Provider>
    )
};

export const useChat = () => useContext(ChatContext);
