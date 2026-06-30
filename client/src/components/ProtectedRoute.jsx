import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../ContextApi/useUser.js";
import logout from "../lib/logout.js";

const ProtectedRoute = ({ component }) => {
  const { user, loading, status } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user]);

  if (loading) return null;
  return user ? component : null;
};

export default ProtectedRoute;