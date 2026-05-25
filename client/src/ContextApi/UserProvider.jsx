import React, { useEffect, useState } from "react";
import UserContext from "./UserContext.js";
import BASE_URL from "../lib/api.js";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/userinfo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("user details not fetched");
        }

        const data = await res.json();

        setUser(data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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
