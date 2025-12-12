import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import MenuHandlerContext, {
  MenuHanderContextBtn,
} from "./Components/Context/MenuHandlerContext.jsx";
import AdminDirectFormContext from "./Components/Context/AdminDirectFormContext.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import UserLoginSocketContext from "./Components/Context/UserLoginStatusContext.jsx";
import { ThemeProvider } from "./Helper/themeHelper.jsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserLoginSocketContext>
    <MenuHandlerContext>
      <AdminDirectFormContext>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <CookiesProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </CookiesProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </AdminDirectFormContext>
    </MenuHandlerContext>
  </UserLoginSocketContext>
);
