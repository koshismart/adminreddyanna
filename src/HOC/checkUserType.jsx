import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decodedTokenData } from "../Helper/auth";

const checkUserType = (WrappedComponent, comingUserType) => {
  return (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(["Admin"]);
    const navigate = useNavigate();

    const { __type: myUserType = "" } = decodedTokenData(cookies) || {};

    useEffect(() => {
      if (
        myUserType.toLowerCase() === comingUserType.toLowerCase() &&
        WrappedComponent.name === "Login"
      ) {
        navigate("/");
      } else if (
        myUserType.toLowerCase() != comingUserType.toLowerCase() &&
        WrappedComponent.name !== "Login"
      ) {
        navigate("/login");
      }
    }, [comingUserType, navigate]);

    if (
      myUserType.toLowerCase() != comingUserType.toLowerCase() &&
      WrappedComponent.name !== "Login"
    ) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default checkUserType;
