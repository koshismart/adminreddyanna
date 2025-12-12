import { isAuthenticated } from "./auth";

export const mydefaultAllCasinoGames = (cookies) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/mydefaultcasinogames`,
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

export const updateMydefaultCasinoGame = ({ cookies, documentId, status }) => {
  const { token } = isAuthenticated(cookies);
  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/mydefaultcasinosettings/update/${documentId}`,
    {
      method: "PUT",
      headers: {
        Accept: "/", // Corrected Accept header
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  ).then((response) => {
    return response.json();
  });
};

export const getCasinoResultList = ({
  cookies,
  casinoGameSlug,
  mid,
  startDate,
  endDate,
}) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getCasinoResult`
  );
  if (casinoGameSlug) {
    url.searchParams.append("casinoGameSlug", casinoGameSlug);
  }
  if (mid) {
    url.searchParams.append("mid", mid);
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

export const getIntCasinoRound = ({ cookies, roundId }) => {
  const { token } = isAuthenticated(cookies);

  const url = new URL(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/admin/get/client/int-casino/game-round`
  );
  if (roundId) {
    url.searchParams.append("roundId", roundId);
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
