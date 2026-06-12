import React from "react";
import styles from "../Error.module.css";
import ErrorPage from "./ErrorPage.jsx";
import { ERROR_TYPES } from "../config/errorConfig.js";

/**
 * ErrorBoundary
 * Class component — only way to catch render-phase errors in React.
 * Wraps the whole app or individual subtrees.
 *
 * Usage in main.jsx (wrap entire app):
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Usage on a single panel:
 *   <ErrorBoundary fallback={<p>Panel failed to load.</p>}>
 *     <SomeUnstablePanel />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });

    // Log to console in dev; swap for your error tracking (Sentry, etc.)
    if (import.meta.env?.DEV) {
      console.error("[ErrorBoundary] Caught render error:", error, info);
    }

    // Optional external reporter from props
    this.props.onError?.(error, info);
  }

  handleRetry() {
    this.setState({ hasError: false, error: null, info: null });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Allow custom fallback UI
    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className={styles.boundaryWrap}>
        <ErrorPage
          type={ERROR_TYPES.UNKNOWN}
          customHeadline="Something crashed"
          customDescription="An unexpected error broke this page. Refresh to recover, or go back to safety."
          onRetry={this.handleRetry}
        />
      </div>
    );
  }
}

export default ErrorBoundary;
