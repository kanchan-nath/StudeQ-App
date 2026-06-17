import { useContext } from "react";
import LoaderContext from "./LoaderContext.js";

const useLoader = () => {
    const ctx = useContext(LoaderContext);
    // [FIX-6] [FIX-7] guard: fail loud in dev, not silently
    if (!ctx) throw new Error("useLoader must be used inside <LoaderProvider>");
    return ctx;
};

export default useLoader;