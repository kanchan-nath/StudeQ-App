import { apiFetch } from "./api.js";
import { disConnectSocket } from "./socket.js";

const logout = async (setUser, navigate) => {
    disConnectSocket();
    try {
        await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err){
        console.warn("Logout API failed:", err.message);
    }
    setUser(null);
    navigate("/login");
};
export default  logout