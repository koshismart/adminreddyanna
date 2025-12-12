import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
export const UserLoginStatusContext = createContext();

const UserLoginSocketContext = (props) => {
  // ALL USERS LOGIN STATE
  const [loginStatuses, setLoginStatuses] = useState({});

  // User Login Status Socket Connection
  useEffect(() => {
    // Listen for login status updates from the server
    let socket;

    socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("userLoginStatus", ({ userId, status }) => {
      setLoginStatuses((prevStatuses) => ({
        ...prevStatuses,
        [userId]: status,
      }));
    });

    return () => {
      socket.off("userLoginStatus");
    };
  }, []);

  return (
    <UserLoginStatusContext.Provider
      value={{
        loginStatus: { loginStatuses, setLoginStatuses },
      }}
    >
      {props.children}
    </UserLoginStatusContext.Provider>
  );
};

export default UserLoginSocketContext;
