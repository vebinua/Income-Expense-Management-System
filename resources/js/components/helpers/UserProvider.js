import React, { createContext, useState } from "react";
import {UserContext} from './UserContext';


export const UserProvider = ({ children }) => {
  
  const [name, setName] = useState(localStorage.getItem('first_name'));
  const [loggedUserId, setLoggedUserId] = useState(localStorage.getItem('user_id'));

  return (
    <UserContext.Provider
      value={{
        name,
        loggedUserId,
        setName,
        setLoggedUserId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

