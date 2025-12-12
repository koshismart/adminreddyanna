import React from "react";
import ButtonNavLink from "../component/ButtonNavLink";
import { getAvailableAdminPanels } from "../../Hooks/getAvailableAdminPanels";

const UserTypeNavMenu = ({ myUserType, uniqueId, loginId }) => {
  // Get Available Admin-Panels Accessibility ----------------------------------------------------------------
  const { MyAvailableAdminPanels } = getAvailableAdminPanels();

  // Available panels from the API response
  const availablePanels = MyAvailableAdminPanels?.availableAdminPanels;

  // Get User-Type Links ----------------------------------------------------------------
  const userTypeLinks = [
    {
      userTypes: ["TechAdmin"],
      path: "SuperAdmin",
      title: "SuperAdmin",
    },
    {
      userTypes: ["TechAdmin", "SuperAdmin"],
      path: "Admin",
      title: "Admin",
    },
    {
      userTypes: ["TechAdmin", "SuperAdmin", "Admin"],
      path: "MiniAdmin",
      title: "Mini Admin",
    },
    {
      userTypes: ["TechAdmin", "SuperAdmin", "Admin", "MiniAdmin"],
      path: "SuperMaster",
      title: "Super Master",
    },
    {
      userTypes: [
        "TechAdmin",
        "SuperAdmin",
        "Admin",
        "MiniAdmin",
        "SuperMaster",
      ],
      path: "Master",
      title: "Master",
    },
    {
      userTypes: [
        "TechAdmin",
        "SuperAdmin",
        "Admin",
        "MiniAdmin",
        "SuperMaster",
        "Master",
      ],
      path: "SuperAgent",
      title: "Super Agent",
    },
    {
      userTypes: [
        "TechAdmin",
        "SuperAdmin",
        "Admin",
        "MiniAdmin",
        "SuperMaster",
        "Master",
        "SuperAgent",
      ],
      path: "Agent",
      title: "Agent",
    },
    {
      userTypes: [
        "TechAdmin",
        "SuperAdmin",
        "Admin",
        "MiniAdmin",
        "SuperMaster",
        "Master",
        "SuperAgent",
        "Agent",
      ],
      path: "Client",
      title: "Client",
    },
  ];

  return (
    <div className="flex items-center gap-3 sm:px-4 px-2 mx-1.5 md:mx-0 border-b pb-3 whitespace-nowrap overflow-x-auto bg-white">
      <ButtonNavLink
        to={`/user/all/${uniqueId}/${loginId}`}
        title={"All"}
        bgColor={"bg-[#128CA3]"}
        textColor={"text-white"}
      />

      {userTypeLinks?.map(
        ({ userTypes, path, title }) =>
          userTypes?.includes(myUserType) &&
          availablePanels?.includes(path) && (
            <ButtonNavLink
              key={path}
              to={`/user/${path}/${uniqueId}/${loginId}`}
              title={title}
              bgColor={"bg-[#128CA3]"}
              textColor={"text-white"}
            />
          )
      )}
    </div>
  );
};

export default UserTypeNavMenu;
