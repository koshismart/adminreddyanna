import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import ButtonCard from "./component/ButtonCard";
import { MenuHanderContextBtn } from "./Context/MenuHandlerContext";
import { decodedTokenData } from "../Helper/auth";

const DynamicMenu = ({
  menuItems,
  link,
  icon,
  menuTitle = "Admin Details",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookies] = useCookies(["Admin"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { menuLeftSmall, setMenuSlider } = useContext(MenuHanderContextBtn);

  const shouldRenderButton = (userType, allowedTypes) => {
    return !allowedTypes || !allowedTypes.includes(userType);
  };

  const {
    userId = "",
    __type: userType = "",
    PersonalDetails,
  } = decodedTokenData(cookies) || {};

  // Check if the link matches the current location path for active state
  const isActive = location.pathname === link;

  useEffect(() => {
    if (!menuLeftSmall) {
      setMenuOpen(false);
    }
  }, [menuLeftSmall]);

  if (link) {
    return (
      <NavLink
        className={`w-full ${
          menuOpen ? "h-fit" : "h-[8.5vh]"
        } whitespace-nowrap cursor-pointer overflow-hidden text-black`}
        to={link}
      >
        <div
          onClick={() => {
            setMenuOpen(!menuOpen);
            setMenuSlider((state) => !state);
          }}
          className={`w-full h-[8.5vh] flex items-center justify-between gap-3 px-4 hover:text-white hover:bg-[#173b40] border-b border-zinc-400 ${
            isActive ? "bg-[#173b40] text-white" : "text-zinc-800"
          }`}
        >
          <div className="flex items-center gap-3 text-xl">
            {icon ? icon : <i className="ri-function-line text-2xl"></i>}
            <span className="text-base font-medium">{menuTitle}</span>
          </div>
        </div>
      </NavLink>
    );
  }

  return (
    <div
      className={`w-full ${
        menuOpen ? "h-fit" : "h-[8.5vh]"
      } border-b whitespace-nowrap cursor-pointer overflow-hidden border-zinc-400 text-black`}
    >
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className=" h-[8.5vh] w-full flex items-center justify-between gap-3 px-4 text-zinc-800 hover:bg-[#173b40] hover:text-white"
      >
        <div className="flex items-center gap-3 text-xl">
          {icon ? icon : <i className="ri-function-line text-2xl"></i>}
          <span className="text-base font-medium">{menuTitle}</span>
        </div>
        {menuItems && (
          <i
            className={`ri-arrow-down-s-line text-2xl ${
              menuOpen && "rotate-180"
            }`}
          ></i>
        )}
      </div>
      {menuItems &&
        menuItems.map((item, index) => {
          if (shouldRenderButton(userType, item?.allowedTypes)) {
            const dynamicLink = !item.allowedTypes
              ? item.link
              : `${item.link}/${userId}/${PersonalDetails?.loginId}`;

            return (
              <ButtonCard
                key={index}
                classList={"pl-[40px]"}
                title={item.name}
                to={!item.link || item?.link !== "" ? dynamicLink : null}
              />
            );
          }

          return null;
        })}
    </div>
  );
};

export default DynamicMenu;
