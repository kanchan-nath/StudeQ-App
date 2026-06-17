import { useState, useCallback } from "react"; // [FIX-8] drop React import
import LoaderContext from "./LoaderContext.js";
import GlobalLoader from "../components/GlobalLoader.jsx";

const LoaderProvider = ({ children }) => {
  const [state, setState] = useState({ visible: false, label: "" });

  const show = useCallback((label = "") => {
    setState({ visible: true, label });
  }, []);

  const hide = useCallback(() => {
    setState({ visible: false, label: "" });
  }, []);

  return (
    <LoaderContext.Provider value={{ show, hide }}>
      {children}
      <GlobalLoader visible={state.visible} label={state.label} />
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;