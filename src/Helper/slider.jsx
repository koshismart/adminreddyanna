import { isAuthenticated } from "./auth";

export const getAllMyCreatedSlider = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/slider/created/getall`,
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

export const createNewSlider = ({ cookies, formdata }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/createnewslider`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formdata,
  }).then((response) => {
    return response.json();
  });
};

export const updateMySliderStatus = ({ cookies, documentId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/slider/activateDeactivate/${documentId}`,
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

export const deleteSliderForm = ({ cookies, documentId }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/deleteslider/${documentId}`,
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
