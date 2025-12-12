import { isAuthenticated } from "./auth";

export const getAllMyCreatedBanners = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/banner/created/getall`,
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

export const createNewBanner = ({ cookies, formdata }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/createnewbanner`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formdata,
  }).then((response) => {
    return response.json();
  });
};

export const updateMyBannerStatus = ({ cookies, documentId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/banner/activateDeactivate/${documentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const deleteBanner = ({ cookies, documentId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/deletebanner/${documentId}`,
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
