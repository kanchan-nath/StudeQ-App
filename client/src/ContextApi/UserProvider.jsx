import React, { useEffect, useState } from "react";
import UserContext from "./UserContext.js";
import { apiFetch } from "../lib/api.js";
import useLoader from "./useLoader.js";

const UserProvider = ({ children }) => {
  const { show, hide } = useLoader();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    show("Loading your profile…");

    const fetchUser = async () => {
      try {
        // Cookie sent automatically — no Authorization header, no localStorage
        const res = await apiFetch("/api/auth/me");

        if (!res.ok) {
          // 401 = no valid cookie, user not logged in
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        hide();
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;