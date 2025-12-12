import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

export const getWhiteListData = async (baseUrl) => {
  try {
    const incomingUrlOrigin = new URL(baseUrl.trim().toLowerCase()).origin;
    console.log({ incomingUrlOrigin });

    let apiEndpoint = "";

    if (incomingUrlOrigin.includes("techadmin")) {
      apiEndpoint = `${
        import.meta.env.VITE_SERVER_URL
      }/api/v1/getWhiteListData/?TechAdminUrl=${baseUrl}`;
    } else if (incomingUrlOrigin.includes("admin")) {
      apiEndpoint = `${
        import.meta.env.VITE_SERVER_URL
      }/api/v1/getWhiteListData/?AdminUrl=${baseUrl}`;
    } else {
      throw new Error(
        "Invalid origin: Host URL does not match a valid endpoint."
      );
    }

    const response = await fetch(apiEndpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Invalid URL");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const signIn = async ({ loginId, password, IpAddress, hostUrl }) => {
  try {
    const incomingUrlOrigin = new URL(hostUrl.trim().toLowerCase()).origin;

    let apiEndpoint = "";

    if (incomingUrlOrigin.includes("techadmin")) {
      apiEndpoint = `${
        import.meta.env.VITE_SERVER_URL
      }/api/v1/techadmin/signin`;
    } else if (incomingUrlOrigin.includes("admin")) {
      apiEndpoint = `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/signin`;
    } else {
      throw new Error(
        "Invalid origin: Host URL does not match a valid sign-in endpoint."
      );
    }

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json", // Changed to standard MIME type
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId, password, IpAddress, hostUrl }),
    });

    return await response.json();
  } catch (error) {
    console.error("Sign-in Error:", error);
    throw error;
  }
};

export const updatePassword = async ({
  cookies,
  currentPassword,
  newPassword,
}) => {
  const { token } = isAuthenticated(cookies);
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/changeOwnPassword`,
    {
      method: "PATCH",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};

export const signout = (userId, removeCookie, next) => {
  if (typeof window !== "undefined") {
    removeCookie("token");

    let socket;
    socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Emit to server to broadcast to others
    socket.emit("userLoginStatus", {
      event: `userLoginStatus`,
      data: {
        success: true,
        userId: userId,
        status: "Offline",
        message: "Sign-Out Detected",
      },
    });

    next();
  }
};

// To remain signed in even browser automatically remove user details
export const authenticate = (data, next, setCookie) => {
  if (typeof window !== "undefined") {
    const cookieExpireTime = parseInt(import.meta.env.VITE_COOKIE_EXPIRE_TIME); // Read the expiration time from env
    const expiresInCustomTime = new Date();
    expiresInCustomTime.setTime(
      expiresInCustomTime.getTime() + cookieExpireTime
    );
    setCookie("token", JSON.stringify(data?.token), {
      expires: expiresInCustomTime,
    });
    next();
  }
};

// check whether user is signed in or not
export const isAuthenticated = (cookies) => {
  if (typeof window == "undefined") {
    return false;
  }

  // If cookies.jwt exists and is not empty, return its parsed value
  if (cookies?.token) {
    return cookies;
  }
};

export const decodedTokenData = (cookies) => {
  if (typeof window == "undefined") {
    return false;
  }

  // If cookies.token exists and is not empty, return its parsed value
  if (cookies?.token && cookies?.token !== "undefined") {
    // Decode the token
    const decodedData = jwtDecode(cookies?.token);
    return decodedData;
  }
};

export const refreshRedisCacheAll = async ({ cookies }) => {
  const { token } = isAuthenticated(cookies);
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/clear/cache/all`,
    {
      method: "POST",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};
