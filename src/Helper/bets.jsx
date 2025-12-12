import { isAuthenticated } from "./auth";

export const allCurrentBetsOfEvent = ({ cookies, eventId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/getAllCurrentBets/?eventId=${eventId}`,
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

export const getAllCurrentSportsBets = (cookies, page, limit, searchValue) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getAllCurrentBets`
  );

  if (page) {
    url.searchParams.append("page", page);
  }
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (searchValue) {
    url.searchParams.append("searchValue", searchValue);
  }

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const getAllCurrentCasinoBets = (cookies, page, limit, searchValue) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getAllCurrentCasinoBets`
  );

  if (page) {
    url.searchParams.append("page", page);
  }
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (searchValue) {
    url.searchParams.append("searchValue", searchValue);
  }

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const getClientCurrentBets = ({ cookies, userId }) => {
  // Get the authentication token from cookies
  const { token } = isAuthenticated(cookies);

  // Construct the URL with userId if provided
  let url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getClientCurrentBets`
  );

  if (userId) {
    url.searchParams.append("userId", userId);
  }

  // Make the API call and return the response
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
};

export const getClientCurrentCasinoBets = ({ cookies, userId }) => {
  // Get the authentication token from cookies
  const { token } = isAuthenticated(cookies);

  // Construct the URL with userId if provided
  let url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getClientCurrentCasinoBets`
  );

  if (userId) {
    url.searchParams.append("userId", userId);
  }

  // Make the API call and return the response
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
};

export const getClientCasinoBetHistory = ({
  cookies,
  casinoGameName,
  mid,
  startDate,
  endDate,
  userId,
}) => {
  // console.log(cookies,casinoGameName)
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/getCasinoBetHistory`
  );

  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (casinoGameName) {
    url.searchParams.append("casinoGameName", casinoGameName);
  }
  if (mid) {
    url.searchParams.append("mid", mid);
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

export const getOldClientCasinoBetHistory = ({
  cookies,
  casinoGameName,
  mid,
  startDate,
  endDate,
  userId,
}) => {
  // console.log(cookies,casinoGameName)
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/old/getCasinoBetHistory`
  );

  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (casinoGameName) {
    url.searchParams.append("casinoGameName", casinoGameName);
  }
  if (mid) {
    url.searchParams.append("mid", mid);
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

export const getClientSportBetHistory = ({
  cookies,
  sportType,
  eventId,
  startDate,
  endDate,
  userId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/getSportBetHistory`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (sportType) {
    url.searchParams.append("sportType", sportType);
  }
  if (eventId) {
    url.searchParams.append("eventId", eventId);
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

export const getOldClientSportBetHistory = ({
  cookies,
  sportType,
  eventId,
  startDate,
  endDate,
  userId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/old/getSportBetHistory`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (sportType) {
    url.searchParams.append("sportType", sportType);
  }
  if (eventId) {
    url.searchParams.append("eventId", eventId);
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

export const getClientQtGamesBetHistory = ({
  cookies,
  gameId,
  startDate,
  endDate,
  userId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/getQtGamesBetHistory`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (gameId) {
    url.searchParams.append("gameId", gameId);
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

export const getOldClientQtGamesBetHistory = ({
  cookies,
  gameId,
  startDate,
  endDate,
  userId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/old/getQtGamesBetHistory`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (gameId) {
    url.searchParams.append("gameId", gameId);
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

export const deleteVoidBet = async ({ cookies, documentId, requestType }) => {
  const { token } = isAuthenticated(cookies);

  const apiEndpoint = {
    sport: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/deletesportbet/${documentId}`,
    casino: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/deletecasinobet/${documentId}`,
  }[requestType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select from sport or casino bets only.`);
  }

  const response = await fetch(apiEndpoint, {
    method: "DELETE",
    headers: {
      Accept: "application/json", // Corrected Accept header
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};

export const getDeletedBets = (cookies, page, limit, searchValue) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/getDeletedBets`
  );

  if (page) {
    url.searchParams.append("page", page);
  }
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (searchValue) {
    url.searchParams.append("searchValue", searchValue);
  }

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const declareBet = async ({
  cookies,
  documentId,
  requestType,
  declareType,
}) => {
  const { token } = isAuthenticated(cookies);

  const apiEndpoint = {
    sport: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/declaresportbet/${documentId}`,
    casino: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/declarecasinobet/${documentId}`,
  }[requestType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select from sport or casino bets only.`);
  }

  // If declareType is provided, append it to the query parameters
  const url = new URL(apiEndpoint); // Use the URL constructor to manage query parameters

  if (declareType) {
    url.searchParams.append("betDeclareType", declareType);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json", // Corrected Accept header
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};
