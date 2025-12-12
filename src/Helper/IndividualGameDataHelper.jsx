export const getDragonGameData = (data) => {
  if (!data) return null;

  const resultData = data.split("*");
  if (resultData.length < 3) return null;

  const [winner, pair] = resultData[0]?.split("|") || [null, null];
  const [dColor, dType, dSuit] = resultData[1]?.split("|") || [null, null, null];
  const [tColor, tType, tSuit] = resultData[2]?.split("|") || [null, null, null];

  return { winner, pair, dColor, dType, dSuit, tColor, tType, tSuit };
};


export const getAmarAkbarAnthonyGameData = (data) => {
  if (!data) return null;
  const resultData = data?.split("|");

  const winner = resultData[0];
  const color = resultData[1];
  const type = resultData[2];
  const underOver = resultData[3];
  const card = resultData[4];
  return { winner, color, type, underOver, card };
};
export const getLuckySevenGameData = (data) => {
 
  if (!data) return null;
  const resultData = data?.split("||");

  const winner = resultData[0];
  const color = resultData[1];
  const type = resultData[2];
  const card = resultData[3];
  return { winner, color, type, card };
};

export const getBollywoodTableGameData = (data) => {
  
  if (!data) return null;
  const resultData = data?.split("|");
    console.log(resultData)
  
    const winner = resultData[0];
    const color = resultData[1];
    const type = resultData[2];
    const movieType = resultData[3];
    const card =resultData[4]
    return { winner, color, type, movieType,card };
  };

  
