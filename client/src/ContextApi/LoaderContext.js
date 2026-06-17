import { createContext } from "react";

// [FIX-7] null default → forces crash with message if used outside provider
const LoaderContext = createContext(null);

export default LoaderContext;