// src/main.jsx — UPDATED
// Changes: +ErrorBoundary (wrap root), +ErrorProvider (wrap app)
// Everything else unchanged.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./ContextApi/UserProvider.jsx";
import LoaderProvider from "./ContextApi/LoaderProvider.jsx";

// ── NEW IMPORTS ───────────────────────────────────────────────
import ErrorBoundary from "./errors/components/ErrorBoundary.jsx";
import { ErrorProvider } from "./errors/hooks/useErrorHandler.jsx";
import ErrorToastStack from "./errors/components/ErrorToastStack.jsx";
// ─────────────────────────────────────────────────────────────

try {
  const savedTheme = localStorage.getItem("sparke-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
} catch (e) { }

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* ErrorBoundary wraps everything — catches catastrophic render crashes */}
    <ErrorBoundary>
      <ErrorProvider>          {/* provides useErrorHandler + global toast queue */}
        <LoaderProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </LoaderProvider>
        {/* Renders toasts at root level — appears above all content */}
        <ErrorToastStack />
      </ErrorProvider>
    </ErrorBoundary>
  </BrowserRouter>
);