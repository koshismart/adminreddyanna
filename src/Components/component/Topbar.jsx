import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { decodedTokenData, signout } from "../../../../latestadmin/Jeetkaadda_admin_front_raw/src/Helper/auth";
import { useCookies } from "react-cookie";
import { getTreeRelationList } from "../../../../latestadmin/Jeetkaadda_admin_front_raw/src/Helper/users";
import { useQuery } from "react-query";
import moment from "moment";
import Select from "../../../../latestadmin/Jeetkaadda_admin_front_raw/src/Components/component/Select";
import DomainSelect from "../../../../latestadmin/Jeetkaadda_admin_front_raw/src/Components/component/DomainSelect";

// USER HIERARCHY -------------------------------->>>>>>>>>>>>>>>>>>>>>>>>
const userTypeHierarchy = {
  TechAdmin: [
    "TechAdmin",
    "SuperAdmin",
    "Admin",
    "MiniAdmin",
    "SuperMaster",
    "Master",
    "SuperAgent",
    "Agent",
    "Client",
  ],
  SuperAdmin: [
    "SuperAdmin",
    "Admin",
    "MiniAdmin",
    "SuperMaster",
    "Master",
    "SuperAgent",
    "Agent",
    "Client",
  ],
  Admin: [
    "Admin",
    "MiniAdmin",
    "SuperMaster",
    "Master",
    "SuperAgent",
    "Agent",
    "Client",
  ],
  MiniAdmin: [
    "MiniAdmin",
    "SuperMaster",
    "Master",
    "SuperAgent",
    "Agent",
    "Client",
  ],
  SuperMaster: ["SuperMaster", "Master", "SuperAgent", "Agent", "Client"],
  Master: ["Master", "SuperAgent", "Agent", "Client"],
  SuperAgent: ["SuperAgent", "Agent", "Client"],
  Agent: ["Agent", "Client"],
};
//  <<<<<<<<<<<<<<<<<<<<---------------------------------- USER HIERARCHY

const Topbar = ({
  icon,
  title,
  gamedate,
  userId,
  button,
  bgColor,
  textColor,
  width,
  gridCal,
  backBtn,
  dropdowns,
}) => {
  const navigate = useNavigate();

  const { usertype: userTypeParam, uniqueId, userId: loginId } = useParams();

  const [cookies, removeCookie] = useCookies(["Admin"]);

  // MY USER TYPE ---------------------------------------------------
  const { __type: myUserType = "" } = decodedTokenData(cookies) || {};

  const {
    isLoading,
    data: data1,
    refetch,
  } = useQuery(
    ["relationList", { cookies, uniqueId }],
    () => getTreeRelationList(cookies, uniqueId),
    { enabled: !!userId }
  );

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    if (
      data1?.error === "Token has expired" ||
      data1?.error === "Invalid token"
    ) {
      signout(userId, removeCookie, () => {
        navigate("/login");
        window.location.reload();
      });
    }
  }, [data1, removeCookie, navigate]);

  return (
    <div
      className={`w-full px-2 sm:flex grid grid-cols-1 justify-between ${bgColor} ${textColor} sm:gap-0 gap-1 whitespace-nowrap items-center md:py-3 py-2`}
    >
      <div className="flex items-center gap-2">
        {backBtn && (
          <span
            onClick={() => navigate(-1)}
            className="font-semibold cursor-pointer"
          >
            <i class="ri-arrow-left-line m-auto"></i>
          </span>
        )}
        <div className="flex items-center">
          <h1
            className={`font-semibold text-base flex items-center gap-1 ${
              title?.length > 150 ? "whitespace-normal" : "whitespace-nowrap"
            } sm:justify-start justify-center`}
          >
            <span>{title}</span>
            {gamedate && (
              <>
                <span className="mr-1">|</span>
                <span> {moment(gamedate).format("L")}</span>
              </>
            )}
          </h1>
          <div className="w-full breadcrumbs text-nowrap md:px-2">
            <ul>
              {isLoading
                ? "Loading..."
                : data1?.relationList
                    ?.filter((doc) =>
                      userTypeHierarchy[myUserType]?.includes(doc?.userType)
                    )
                    ?.map((doc) => (
                      <li>
                        <Link
                          className="font-bold text-[#ca2222] underline"
                          to={
                            doc?.userType == myUserType
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "TechAdmin"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "SuperAdmin"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "Admin"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "MiniAdmin"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "SuperMaster"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "Master"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "SuperAgent"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : doc?.userType === "Agent"
                              ? `/user/all/${doc?.uniqueId}/${doc?.loginId}`
                              : null
                          }
                        >
                          {doc?.loginId}
                        </Link>
                      </li>
                    ))
                    .reverse()}
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`sm:flex grid grid-cols-1 ${
          gridCal || "grid-cols-2"
        } items-center sm:gap-3 gap-1`}
      >
        {dropdowns.length != 0 &&
          dropdowns.map((dropdown, index) => (
            <DomainSelect
              defaultName={dropdown?.defaultName}
              selectedDomain={dropdown.selectedDomain}
              name={dropdown?.name}
              onChange={dropdown.handleChange}
              opt={dropdown?.domains}
            />
          ))}
        {button.length != 0 &&
          button.map((btn, index) => (
            <button
              key={index}
              onClick={btn.btn}
              className={`${width} py-1 px-2 mr-2 justify-center my-2 custom-shadow-bottom ${
                btn.btnColor || "bg-orange-500"
              } rounded-sm text-white uppercase flex items-center gap-1 font-medium ${
                btn.text
              }`}
            >
              <i
                class={`${btn.btnIcon || "ri-user-add-fill"} font-bold text-xl`}
              ></i>
              {btn.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Topbar;
