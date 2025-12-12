import { isAuthenticated } from "./auth";

// Match odds Api
export const matchOddsLiveEventData = ({
  eventId,
  sportId,
  cookies,
  gameName,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/api/v1/getMatchOdds`);

  if (eventId) {
    url.searchParams.append("eventId", eventId);
  }
  if (sportId) {
    url.searchParams.append("sportId", sportId);
  }

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

// Bookmaker odds Api
export const bookmakerOddsLiveEventData = ({
  eventId,
  sportId,
  cookies,
  gameName,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getBookMakerOdds`
  );

  if (eventId) {
    url.searchParams.append("eventId", eventId);
  }
  if (sportId) {
    url.searchParams.append("sportId", sportId);
  }

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

// Fancy odds Api
export const fancyOddsLiveEventData = ({
  eventId,
  sportId,
  cookies,
  gameName,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/api/v1/getFancyOdds`);

  if (eventId) {
    url.searchParams.append("eventId", eventId);
  }
  if (sportId) {
    url.searchParams.append("sportId", sportId);
  }

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

// Filters Api Of Events
export const getFiltersOfEvent = ({ cookies, eventId }) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getSportFilter/${eventId}`
  );

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const addFiltersOfEvent = async ({
  cookies,
  eventId,
  filterName,
  filter,
}) => {
  // Retrieve token from isAuthenticated function
  const { token } = isAuthenticated(cookies);

  console.log(filterName, filter);

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/addSportFilter/${eventId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json", // Corrected Accept header
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filterName, filter }), // Convert form data to JSON
    }
  );

  return response.json();
};
