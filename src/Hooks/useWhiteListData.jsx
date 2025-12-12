import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getWhiteListData } from "../Helper/auth";

// Custom hook to get the white list data based on the environment
const useWhiteListData = () => {
  const [fullUrl, setFullUrl] = useState("");

  // Dynamically select the URL based on the environment
  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEVELOPMENT_MODE_URL
      : fullUrl;

  // Get the current URL dynamically
  const getCurrentUrl = () => {
    try {
      setFullUrl(window.location.href); // Capture the full URL of the page
    } catch (error) {
      console.error("Error capturing URL:", error);
    }
  };

  useEffect(() => {
    getCurrentUrl();
  }, []);

  // Fetch whitelist data based on the domain URL
  const {
    data: whiteListData,
    isLoading,
    error,
    refetch,
  } = useQuery(["whiteListData", baseUrl], () => getWhiteListData(baseUrl), {
    enabled: !!baseUrl, // Only fetch when baseUrl is truthy
  });

  return {
    baseUrl,
    whiteListData,
    isLoading,
    error,
    refetch
  };
};

export default useWhiteListData;