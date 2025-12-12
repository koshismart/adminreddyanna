import { isAuthenticated } from "./auth";

export const getMyLedger = (cookies) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/api/v1/getMyLedger`);

  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const getLedger = (
  cookies,
  usertype,
  clientLoginId,
  startDate,
  endDate
) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getDownlineLedger`
  );

  if (usertype) {
    url.searchParams.append("usertype", usertype);
  }
  if (clientLoginId) {
    url.searchParams.append("clientLoginId", clientLoginId);
  }

  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
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

// reset commission using commission (_id)
export const resetCommission = ({ cookies, documentId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/commission/reset/${documentId}`,
    {
      method: "Post",
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

// Settle ledger
export const ledgerSettleApi = async ({ cookies, formData }) => {
  const { token } = isAuthenticated(cookies);

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/settleLedger`,
    {
      method: "POST",
      headers: {
        Accept: "application/json", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        formData,
      }), // Convert form data to JSON
    }
  );

  return response.json();
};

// Settlement history
export const getSettlements = async (cookies, userId) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/get/settlementHistory`
  );

  if (userId) {
    url.searchParams.append("userId", userId);
  }

  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

// Update ledger
export const updateLedger = async ({ cookies }) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/updateAllLedger`
  );

  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};
