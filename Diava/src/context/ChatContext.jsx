import { createContext, useContext, useReducer } from "react";
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
            case "CHANGE_USER_CHAT":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid 
                    ? currentUser.uid + action.payload.uid 
                    : action.payload.uid + currentUser.uid,
                };
            case "CHANGE_CHANNEL_CHAT":
                return {
                    user: null,
                    chatId: action.payload.id,
                }
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
