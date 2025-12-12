import { isAuthenticated } from "./auth";

export const getMyBalance = (cookies, userId) => {
  const { token } = isAuthenticated(cookies);

  return fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/getBalance`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const getUserBalance = (cookies, loginId) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/api/v1/getBalance`);

  if (loginId) {
    url.searchParams.append("loginId", loginId);
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

export const getUserExposure = (cookies, loginId) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/api/v1/getExposure`);

  if (loginId) {
    url.searchParams.append("loginId", loginId);
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

export const getCurrentSportsSettings = (cookies, userId) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/mycurrentsportsettings/${userId}`,
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

// GET ONLY DOWNLINE CREATED BY ME
export const getDownlineUsers = (
  cookies,
  uniqueId,
  usertype,
  accountType,
  page,
  limit,
  searchValue
) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getAllDownlineList/${uniqueId}`
  );

  if (usertype) {
    url.searchParams.append("usertype", usertype);
  }
  if (accountType) {
    url.searchParams.append("accountType", accountType);
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

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

// GET ALL MEMBERS IN MY GROUP
export const getAllMembers = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/getAllMembers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};

export const createNewUser = async ({ userType, cookies, userData }) => {
  // Retrieve token from isAuthenticated function
  const { token } = isAuthenticated(cookies);

  // Define the API endpoint based on userType
  const apiEndpoint = {
    SuperAdmin: `${import.meta.env.VITE_SERVER_URL}/api/v1/createsuperadmin`,
    Admin: `${import.meta.env.VITE_SERVER_URL}/api/v1/createadmin`,
    MiniAdmin: `${import.meta.env.VITE_SERVER_URL}/api/v1/createminiadmin`,
    SuperMaster: `${import.meta.env.VITE_SERVER_URL}/api/v1/createsupermaster`,
    Master: `${import.meta.env.VITE_SERVER_URL}/api/v1/createmaster`,
    SuperAgent: `${import.meta.env.VITE_SERVER_URL}/api/v1/createsuperagent`,
    Agent: `${import.meta.env.VITE_SERVER_URL}/api/v1/createagent`,
    Client: `${import.meta.env.VITE_SERVER_URL}/api/v1/createclient`,
  }[userType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select a valid option: ${userType}`);
  }

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json", // Corrected Accept header
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // Convert form data to JSON
  });

  return response.json();
};

export const createNewChildUser = async ({
  userType,
  parentId,
  cookies,
  userData,
}) => {
  // Retrieve token from isAuthenticated function
  const { token } = isAuthenticated(cookies);

  // Define the API endpoint based on userType
  const apiEndpoint = {
    SuperMaster: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/child/createsupermaster/${parentId}`,
    Master: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/child/createmaster/${parentId}`,
    Agent: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/child/createagent/${parentId}`,
    Client: `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/child/createclient/${parentId}`,
  }[userType];

  // Check if userType is valid and throw an error if not
  if (!apiEndpoint) {
    throw new Error(`Please select a valid option: ${userType}`);
  }

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json", // Corrected Accept header
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // Convert form data to JSON
  });

  return response.json();
};

//WHITELIST LOGO
export const uploadWebsiteLogo = async ({ userId, cookies, logoFormData }) => {
  const { token } = isAuthenticated(cookies);

  const apiEndpoint = `${
    import.meta.env.VITE_SERVER_URL
  }/api/v1/uploadWebsiteLogo/${userId}`; // Define your logo upload endpoint

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: logoFormData, // Send the FormData with the file
  });

  if (!response.ok) {
    throw new Error(`Error uploading logo: ${response.statusText}`);
  }

  return response.json();
};

//UPDATE WHITELIST DATA
export const updateWhitelistData = async ({
  docId,
  cookies,
  AdminUrl,
  ClientUrl,
}) => {
  const { token } = isAuthenticated(cookies);
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/updateWhiteListData/${docId}`,
    {
      method: "PATCH",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ AdminUrl, ClientUrl }),
    }
  );
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};

export const updateUser = async ({ documentId, cookies, userData }) => {
  // Retrieve token from isAuthenticated function
  const { token } = isAuthenticated(cookies);

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/updateuser/${documentId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json", // Corrected Accept header
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), // Convert form data to JSON
    }
  );

  return response.json();
};

export const changeUserPassword = async ({ userId, cookies, newPassword }) => {
  const { token } = isAuthenticated(cookies);
  const response = await fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/changeDownlinePassword/${userId}`,
    {
      method: "PATCH",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    }
  );
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};

export const changeTransactionPassword = async ({
  userId,
  cookies,
  transactionPassword,
}) => {
  const { token } = isAuthenticated(cookies);
  const response = await fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/change/downline/transactionPassword/${userId}`,
    {
      method: "PATCH",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionPassword }),
    }
  );
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};

export const deleteAccount = async ({
  cookies,
  userId,
  transactionPassword,
}) => {
  const { token } = isAuthenticated(cookies);
  const response = await fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/deleteDownlineAccount?userId=${userId}&transactionPassword=${transactionPassword}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data; // Don't forget to return the fetched data
};

export const updateToggle = async ({ cookies, userId, toggleName }) => {
  const { token } = isAuthenticated(cookies);

  // Define the API endpoint based on toggleName
  const apiEndpoints = {
    "Fancy Lock": `/api/v1/fancyLocked/${userId}`,
    "Betting Lock": `/api/v1/bettingLocked/${userId}`,
    "User Lock": `/api/v1/userLocked/${userId}`,
    "Closed Lock": `/api/v1/closedAccounts/${userId}`,
    "Special Permissions": `/api/v1/specialpermissions/${userId}`,
    whiteList: `/api/v1/permission/update/whiteList/${userId}`,
    canDeleteBets: `/api/v1/permission/update/candeletebets/${userId}`,
    canDeleteUsers: `/api/v1/permission/update/candeleteusers/${userId}`,
    enableMultipleLogin: `/api/v1/permission/update/enablemultipleLogin/${userId}`,
    depositWithdrawl: `/api/v1/permission/update/depositWithdrawl/${userId}`,
    canEditDepositWithdrawl: `/api/v1/permission/update/canEditDepositWithdrawl/${userId}`,
    autoSignUpFeature: `/api/v1/permission/update/autoSignUpFeature/${userId}`,
    displayUsersOnlineStatus: `/api/v1/permission/update/displayUsersOnlineStatus/${userId}`,
    canDeclareResultAsOperator: `/api/v1/permission/update/canDeclareResultAsOperator/${userId}`,
  };

  const endpoint = apiEndpoints[toggleName];

  // Check if toggleName is valid and throw an error if not
  if (!endpoint) {
    throw new Error(`Invalid toggle name: ${toggleName}`);
  }

  const apiEndpoint = `${import.meta.env.VITE_SERVER_URL}${endpoint}`;

  const response = await fetch(apiEndpoint, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const getTreeRelationList = (cookies, uniqueId) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/getUplineRelationList/${uniqueId}`,
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

export const getFeatureAccessPermissions = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/get/feature/permissions`,
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

export const getMyAvailableAdminPanels = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getAvailableAdminPanels`,
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

export const getLoginReport = ({ cookies, loginId, startDate, endDate }) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/get/my/login/report`
  );

  if (startDate) {
    url.searchParams.append("startDate", startDate);
  }
  if (endDate) {
    url.searchParams.append("endDate", endDate);
  }
  if (loginId) {
    url.searchParams.append("loginId", loginId);
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

export const getMySocialContacts = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/get/my/socialcontacts`,
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

export const updateMySocialContacts = ({ cookies, formdata }) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/update/my/socialcontacts`,
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

export const saveAndClearUserSession = ({ cookies, userId }) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/old/session/clear`
  );

  if (userId) {
    url.searchParams.append("userId", userId);
  }

  return fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
};
