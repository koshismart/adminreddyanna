import { isAuthenticated } from "./auth";

export const chipDepositWithdraw = async ({
  cookies,
  requestType,
  transactionPassword,
  downlineUserId,
  uplineUserId,
  amount,
}) => {
  const { token } = isAuthenticated(cookies);

  const apiEndpoint = {
    deposit: `${import.meta.env.VITE_SERVER_URL}/api/v1/depositchips`,
    withdraw: `${import.meta.env.VITE_SERVER_URL}/api/v1/withdrawchips`,
  }[requestType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select deposit or withdraw only.`);
  }

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json", // Corrected Accept header
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      transactionPassword,
      downlineUserId,
      uplineUserId,
      amount,
    }), // Convert form data to JSON
  });

  return response.json();
};

export const bulkChipsDepositWithdraw = async ({
  cookies,
  requestType,
  transactionPassword,
  downlineUserIds,
  uplineUserId,
  amount,
}) => {
  const { token } = isAuthenticated(cookies);

  const apiEndpoint = {
    deposit: `${import.meta.env.VITE_SERVER_URL}/api/v1/depositbulkchips`,
    withdraw: `${import.meta.env.VITE_SERVER_URL}/api/v1/withdrawbulkchips`,
  }[requestType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select deposit or withdraw only.`);
  }

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json", // Corrected Accept header
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      transactionPassword,
      downlineUserIds,
      uplineUserId,
      amount,
    }), // Convert form data to JSON
  });

  return response.json();
};
