import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./ContextApi/UserProvider.jsx";
import LoaderProvider from "./ContextApi/LoaderProvider.jsx";

try {
  const savedTheme = localStorage.getItem("sparke-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
} catch (e) { }

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoaderProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </LoaderProvider>
  </BrowserRouter>,
);
