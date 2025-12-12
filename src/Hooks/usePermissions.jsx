import { useState } from "react";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie"; // If using react-cookie
import { getFeatureAccessPermissions } from "../Helper/users";

export const usePermissions = () => {
  const [cookies] = useCookies(["Admin"]); // Only need cookies, no need for setters/removers here
  const [AccessPermissions, setAccessPermissions] = useState(null);

  const { isLoading, data, error } = useQuery(
    ["AccessPermissions", { cookies }],
    () => getFeatureAccessPermissions(cookies),
    {
      enabled: !!cookies.token, // Ensure query only runs if user cookie is available
      onError: (error) => {
        console.error("Error fetching access permissions:", error); // Optional: handle error
      },
    }
  );

  return { isLoading, AccessPermissions: data, error };
};
