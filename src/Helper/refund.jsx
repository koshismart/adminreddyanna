import { isAuthenticated } from "./auth";

export const updateRefundConfiguration = ({ cookies, formdata }) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/update/refund/configuration`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    }
  ).then((response) => {
    return response.json();
  });
};

export const initiateRefundConfiguration = ({ cookies }) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/initiate/client/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const getRefundStatement = (cookies, userId) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/refund/statement`
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
