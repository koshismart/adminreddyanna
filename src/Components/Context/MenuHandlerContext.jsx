import React, { createContext, useState } from "react";
export const MenuHanderContextBtn = createContext();

const MenuHandlerContext = (props) => {
  const [menuLeftSmall, setMenuLeftSmall] = useState(false);
  const [menuSlider, setMenuSlider] = useState(false);
  return (
    <MenuHanderContextBtn.Provider
      value={{ menuSlider, setMenuSlider, menuLeftSmall, setMenuLeftSmall }}
    >
      {props.children}
    </MenuHanderContextBtn.Provider>
  );
};

export default MenuHandlerContext;
