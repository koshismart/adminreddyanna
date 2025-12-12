import { isAuthenticated } from "./auth";

// GET ONLY DOWNLINE CREATED BY ME
export const getWhiteListedDomains = (cookies) => {
    const { token } = isAuthenticated(cookies);
    return fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/v1/get/whitelisted/domains`,
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