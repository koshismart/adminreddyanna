import { isAuthenticated } from "./auth";

export const getDepositWithdraw = (cookies, userId) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/account/statement/deposit/withdraw`
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
