import { isAuthenticated } from "./auth";

export const getCricketMatchesList = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getCricketMatchesList`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const getTennisMatchesList = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getTennisMatchesList`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const getSoccerMatchesList = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getSoccerMatchesList`,
    {
      method: "get",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const getCasinoGamesList = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/client/mydefaultcasinogames`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};
