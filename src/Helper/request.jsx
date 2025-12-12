import { isAuthenticated } from "./auth";

export const allDepositWithdrawRequests = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/recievingAllRequest`,
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

export const depositRequests = (cookies, page, limit, searchValue) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/recievingDepositRequest`
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

export const withdrawRequests = (
  cookies,
  loginId,
  page,
  limit,
  searchValue
) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/recievingWithdrawRequest`
  );

  if (loginId) {
    url.searchParams.append("loginId", loginId);
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

export const updateRequest = ({
  requestType,
  requestId,
  cookies,
  status,
  reason,
  transactionPassword,
}) => {
  // Define the API endpoint based on userType
  const apiEndpoint = {
    depositrequest: ` ${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/updateDepositRequest/${requestId}`,
    withdrawrequest: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/updateWithdrawRequest/${requestId}`,
  }[requestType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select a valid option: ${requestType}`);
  }
  const { token } = isAuthenticated(cookies);
  return fetch(apiEndpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, reason, transactionPassword }),
  }).then((response) => {
    return response.json();
  });
};

export const checkStatus = ({ txnid, cookies }) => {
  // Correct endpoint: txnid in the path
  const apiEndpoint = `${
    import.meta.env.VITE_SERVER_URL
  }/api/v1/payment/verify/${txnid}?isManual=true`;

  const { token } = isAuthenticated(cookies);

  return fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
