import { useContext } from "react";
import UserContext from "./UserContext.js";

const useUser = () => {
  const ctx = useContext(UserContext);
  // [FIX-6] guard: crash loud instead of silent null destructure
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
};

export default useUser;