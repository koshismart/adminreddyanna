import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../Helper/auth";
import { useCookies } from "react-cookie";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [cookies] = useCookies(["Admin"]);
    const navigate = useNavigate();
    const accessToken = isAuthenticated(cookies);

    useEffect(() => {
      if (accessToken && WrappedComponent.name === "Login") {
        navigate("/");
      } else if (!accessToken && WrappedComponent.name !== "Login") {
        navigate("/login");
      }
    }, [accessToken, navigate]);

    if (!accessToken && WrappedComponent.name !== "Login") {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
