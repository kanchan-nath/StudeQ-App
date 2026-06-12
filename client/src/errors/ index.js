// errors/index.js — barrel export for the Spark.E error system

export { default as ErrorBoundary } from "./components/ErrorBoundary.jsx";
export {
  default as ErrorPage,
  RouteErrorPage,
} from "./components/ErrorPage.jsx";
export { default as ErrorIllustration } from "./components/ErrorIllustration.jsx";
export { default as ErrorToastStack } from "./components/ErrorToastStack.jsx";
export {
  default as useErrorHandler,
  ErrorProvider,
  ErrorContext,
} from "./hooks/useErrorHandler.jsx";
export {
  ERROR_TYPES,
  ERROR_CONFIG,
  resolveErrorType,
} from "./config/errorConfig.js";
