import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { usePermissions } from "../Hooks/usePermissions";
import { decodedTokenData, signout } from "../Helper/auth";
import SkeletonLoader from "../Components/loaders/SkeletonLoader1";

const checkPermissions = (WrappedComponent, PermissionName) => {
  return (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(["Admin"]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const { isLoading, AccessPermissions, error } = usePermissions(); // Fetch permissions

    // Ensure permission is available before checking
    const Permission =
      AccessPermissions?.featureAccessPermissions?.[PermissionName];

    useEffect(() => {
      if (isLoading) {
        setLoading(true); // Data is still loading
      } else {
        setLoading(false); // Data is available
        if (Permission) {
          if (WrappedComponent.name === "Login") {
            navigate("/"); // Redirect to home if logged in
          }
        } else {
          if (WrappedComponent.name !== "Login") {
            navigate("/login"); // Redirect to login if no access permissions
          }
        }
      }
    }, [isLoading, Permission, WrappedComponent.name, navigate]);

    // While loading or if no permissions, show loading spinner or nothing
    if (loading) {
      return <SkeletonLoader />;
    }

    if (!Permission && WrappedComponent.name !== "Login") {
      return null; // Return null if no permissions and not on Login page
    }

    // Render the wrapped component if everything is fine
    return <WrappedComponent {...props} />;
  };
};

export default checkPermissions;
