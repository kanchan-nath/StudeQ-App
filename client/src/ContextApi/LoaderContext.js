import { createContext } from "react";

const LoaderContext = createContext({
    show: () => { },
    hide: () => { },
});

export default LoaderContext;