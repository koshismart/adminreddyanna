import { isAuthenticated } from "./auth";

export const getCasinoGamesList = (cookies) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/client/mydefaultcasinogames`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const casinoGameOdds = (cookies, slugName) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/getCasinoGameOdds/${slugName}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const casinoGameTopTenResult = (cookies, slugName) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/getCasinoTopTenResult/${slugName}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};

export const casinoIndividualResult = (cookies, resultId, slug) => {
  const { token } = isAuthenticated(cookies);

  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/getCasinoIndividualResult/${resultId}/${slug}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const casinoCricketGameScore = (cookies, marketId, gameSlug) => {
  const { token } = isAuthenticated(cookies);
  //market id is number after decimals value

  return fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/api/v1/getCasinoSportScore?marketId=${marketId}&gameSlug=${gameSlug}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.json();
  });
};
