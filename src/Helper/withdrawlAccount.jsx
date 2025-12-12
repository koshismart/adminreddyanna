import { isAuthenticated } from "./auth";

export const getAllWithdrawlAccounts = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/withdrawlaccount/getall`,
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

export const createWithdrawlAccountOfUser = ({
  cookies,
  userId,
  withdrawAccountForm,
}) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/createWithdrawlAccount/${userId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: withdrawAccountForm,
    }
  ).then((response) => {
    return response.json();
  });
};

export const AccountApproveOrReject = ({ cookies, documentId, status }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/withdrawlaccount/approveReject/${documentId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  ).then((response) => {
    return response.json();
  });
};

export const activateOrDeactivateWithdrawlAccount = ({
  cookies,
  documentId,
}) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/withdrawlaccount/activateDeactivate/${documentId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const deleteWithdrawlAccountOfUser = ({ cookies, documentId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/deletewithdrawlaccount/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const updateDepositRequest = ({
  requestId,
  cookies,
  status,
  reason,
  transactionPassword,
}) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/updateDepositRequest/${requestId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, reason, transactionPassword }),
    }
  ).then((response) => {
    return response.json();
  });
};
