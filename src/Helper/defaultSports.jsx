import { isAuthenticated } from "./auth";

export const getAllDefaultSportsSettings = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/mydefaultsportsettings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const updateDefaultSportsSetting = ({
  cookies,
  documentId,
  sportDefaultSetting,
}) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/mydefaultsportsettings/update/${documentId}`,
    {
      method: "PUT",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sportDefaultSetting }),
    }
  ).then((response) => {
    return response.json();
  });
};
export const updateDefaultChildSportsSetting = ({
  cookies,
  documentId,
  childSportDefaultSetting,
}) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/mydefaultsportsettings/update/${documentId}`,
    {
      method: "PUT",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ childSportDefaultSetting }),
    }
  ).then((response) => {
    return response.json();
  });
};

export const updateWhiteListedGamesConfiguration = ({
  cookies,
  sportsSettings,
}) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/update/whitelisted/games/configuration`,
    {
      method: "PUT",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sportsSettings }),
    }
  ).then((response) => {
    return response.json();
  });
};
