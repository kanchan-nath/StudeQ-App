import { useEffect, useState, useCallback } from "react"; // [FIX-8] drop React import
import UserContext from "./UserContext.js";
import { apiFetch, registerUnauthorizedHandler } from "../lib/api.js";
import useLoader from "./useLoader.js";

// [FIX-5] explicit status enum — consumer knows WHY user is null
const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  UNAUTHENTICATED: "unauthenticated", // 401
  ERROR: "error",                      // network/server crash
};

const UserProvider = ({ children }) => {
  const { show, hide } = useLoader();
  const [user, setUserInternal] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  // [FIX-4] controlled setter — validate shape before accepting
  const setUser = useCallback((userData) => {
    if (userData !== null && typeof userData !== "object") {
      console.error("setUser: invalid user shape", userData);
      return;
    }
    setUserInternal(userData);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUserInternal(null);
      setStatus(STATUS.UNAUTHENTICATED);
    });
  }, []);
  
  useEffect(() => {
    let cancelled = false; // guard against unmount race

    const PUBLIC_PATHS = ["/", "/login", "/register"];
    if (PUBLIC_PATHS.includes(window.location.pathname)) {
      setStatus(STATUS.UNAUTHENTICATED);
      return;
    }
    
    const fetchUser = async () => {
      // [FIX-2] show INSIDE async fn, tied to this specific fetch
      show("Loading your profile…");
      setStatus(STATUS.LOADING);

      try {
        const res = await apiFetch("/api/auth/me");

        if (cancelled) return;

        if (res.status === 401) {
          // [FIX-5] 401 = unauthenticated, not error
          setUserInternal(null);
          setStatus(STATUS.UNAUTHENTICATED);
          return;
        }

        if (!res.ok) {
          // [FIX-5] other non-OK = real error
          setUserInternal(null);
          setStatus(STATUS.ERROR);
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          setUserInternal(data.data);
          setStatus(STATUS.SUCCESS);
        }
      } catch {
        if (!cancelled) {
          setUserInternal(null);
          setStatus(STATUS.ERROR); // [FIX-5] network crash ≠ logged out
        }
      } finally {
        if (!cancelled) hide();
      }
    };

    fetchUser();
    // [FIX-1] show/hide in deps — stable via useCallback([]) so no extra runs
    return () => { cancelled = true; }; // cleanup on unmount
  }, [show, hide]); // [FIX-1]

  // [FIX-3] single loading derived from status, no separate boolean
  const loading = status === STATUS.LOADING || status === STATUS.IDLE;

  return (
    // [FIX-4] expose controlled setter, not raw dispatch
    <UserContext.Provider value={{ user, setUser, loading, status }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;