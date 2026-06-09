import { useContext } from "react";
import LoaderContext from "./LoaderContext.js";

const useLoader = () => useContext(LoaderContext);

export default useLoader;