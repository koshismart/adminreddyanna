import { useState } from "react";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie"; // If using react-cookie
import { getMyAvailableAdminPanels } from "../Helper/users";

export const getAvailableAdminPanels = () => {
  const [cookies] = useCookies(["Admin"]); // Only need cookies, no need for setters/removers here

  const { isLoading, data, error } = useQuery(
    ["MyAvailableAdminPanels", { cookies }],
    () => getMyAvailableAdminPanels(cookies),
    {
      enabled: !!cookies.token, // Ensure query only runs if user cookie is available
      onError: (error) => {
        console.error("Error fetching My Available Admin-Panels:", error); // Optional: handle error
      },
    }
  );

  return { isLoading, MyAvailableAdminPanels: data, error };
};
