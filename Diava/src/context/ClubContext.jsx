import React, { createContext, useContext, useState } from "react";

const ClubContext = createContext();

export const ClubProvider = ({ children }) => {
  const [currentClub, setCurrentClub] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  const value = {
    currentClub,
    setCurrentClub,
    currentChannel,
    setCurrentChannel,
  }

  return (
    <ClubContext.Provider value={value}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => useContext(ClubContext);
