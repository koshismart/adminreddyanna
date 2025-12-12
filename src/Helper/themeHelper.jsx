import React, { useEffect } from "react";
import { useQuery } from "react-query";
// import cricketBall from "../assets/Cricket_ball.svg";
import  useWhiteListData  from "../../src/Hooks/useWhiteListData";


export const ThemeProvider = ({ children }) => {
  // Custom hook for white list data
  const { baseUrl, whiteListData } = useWhiteListData();

  // Fetch the whitelist theme data from whiteListData
  const fetchTheme = async () => {
    try {
      // Extract theme data from whiteListData
      const themeData = whiteListData?.whiteListData?.WebsiteTheme;

      return {
        primaryBackground: themeData?.primaryBackground || "#0D7A8E",
        primaryBackground90: themeData?.primaryBackground90 || "#0D7A8E",
        secondaryBackground: themeData?.secondaryBackground || "#04303e",
        secondaryBackground70: themeData?.secondaryBackground70 || "#AE4600B3",
        secondaryBackground85: themeData?.secondaryBackground85 || "#AE4600E6",
        textPrimary: themeData?.textPrimary || "#FFFFFF",
        textSecondary: themeData?.textSecondary || "#CCCCCC",
      };
    } catch (error) {
      console.error("Error fetching whitelist data:", error);

      // Return fallback dummy theme in case of error
      return {
        primaryBackground: "#0D7A8E",
        primaryBackground90: "#0D7A8E",
        secondaryBackground: "#04303e",
        secondaryBackground70: "#AE4600B3",
        secondaryBackground85: "#AE4600E6",
        textPrimary: "#FFFFFF",
        textSecondary: "#CCCCCC",
      };
    }
  };

  // Fetch the theme with react-query, refetching when `baseUrl` changes
  const {
    data: theme,
    error,
    isLoading,
  } = useQuery(["theme", whiteListData], fetchTheme, {
    enabled: !!whiteListData, // Ensure the whiteListData is set before fetching
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    cacheTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Apply the theme to CSS variables once the data is fetched
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty(
        "--primary-background",
        theme.primaryBackground
      );
      document.documentElement.style.setProperty(
        "--primary-background90",
        theme.primaryBackground90
      );
      document.documentElement.style.setProperty(
        "--secondary-background",
        theme.secondaryBackground
      );
      document.documentElement.style.setProperty(
        "--secondary-background70",
        theme.secondaryBackground70
      );
      document.documentElement.style.setProperty(
        "--secondary-background85",
        theme.secondaryBackground85
      );
      document.documentElement.style.setProperty(
        "--textPrimary",
        theme.textPrimary
      );
      document.documentElement.style.setProperty(
        "--textSecondary",
        theme.textSecondary
      );
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-gray-10">
        {/* <img src={cricketBall} className="w-20 h-20 animate-spin m-auto" /> */}
      </div>
    );
  }

  if (error) {
    console.error("Error fetching theme:", error);
    // Set fallback theme in case of error
    document.documentElement.style.setProperty(
      "--primary-background",
      "#2bbcd9"
    );
    document.documentElement.style.setProperty(
      "--primary-background90",
      "#F0F0F0"
    );
    document.documentElement.style.setProperty(
      "--secondary-background",
      "#000000df"
    );
    document.documentElement.style.setProperty(
      "--secondary-background70",
      "#B3B3B3"
    );
    document.documentElement.style.setProperty(
      "--secondary-background85",
      "#E6E6E6"
    );
    document.documentElement.style.setProperty("--textPrimary", "#000000");
    document.documentElement.style.setProperty("--textSecondary", "#555555");
  }

  return <>{children}</>;
};
