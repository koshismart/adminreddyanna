import { isAuthenticated } from "./auth";

export const getClientOldProfitLossReport = ({ cookies, userId }) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/get/client/old/session`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
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

export const getClientProfitLossReport = ({
  cookies,
  startDate,
  endDate,
  userId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/get/client/profitLoss`
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

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const getOldClientProfitLossReport = ({
  cookies,
  startDate,
  endDate,
  userId,
  referenceId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/get/client/old/profitLoss`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (referenceId) {
    url.searchParams.append("referenceId", referenceId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
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

export const getQtGamesClientProfitLossReport = ({
  cookies,
  startDate,
  endDate,
  userId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/qtgames/client/profitLoss`
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

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const getOldQtGamesClientProfitLossReport = ({
  cookies,
  startDate,
  endDate,
  userId,
  referenceId,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/qtgames/client/old/profitLoss`
  );
  if (userId) {
    url.searchParams.append("userId", userId);
  }
  if (referenceId) {
    url.searchParams.append("referenceId", referenceId);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
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

export const getMyProfitLossReport = (
  cookies,
  sportType,
  startDate,
  endDate,
  page,
  limit,
  searchValue
) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getMyProfitLoss`
  );

  if (sportType) {
    url.searchParams.append("sportType", sportType);
  }
  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (page) {
    url.searchParams.append("page", page);
  }
  if (limit) {
    url.searchParams.append("limit", limit);
  }
  if (searchValue) {
    url.searchParams.append("searchValue", searchValue);
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
