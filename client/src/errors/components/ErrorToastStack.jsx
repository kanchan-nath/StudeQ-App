import React, { useContext } from "react";
import { ErrorContext } from "../hooks/useErrorHandler.jsx";
import styles from "../Error.module.css";

/**
 * ErrorToastStack
 * Drop this once anywhere in the component tree (inside ErrorProvider).
 * It renders the global toast queue from ErrorContext.
 *
 * Usage in AppShell or main layout:
 *   <ErrorToastStack />
 */
const ErrorToastStack = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) return null;

  const { toasts, removeToast } = ctx;

  if (toasts.length === 0) return null;

  return (
    <div
      className={styles.toastStack}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${
            t.type === "success" ? styles.toastSuccess : styles.toastError
          } ${t.exiting ? styles.toastExit : styles.toastEnter}`}
          role="alert"
          aria-atomic="true"
        >
          <span
            className={styles.toastIcon}
            aria-hidden="true"
          >
            {t.type === "success" ? "✓" : "✕"}
          </span>
          <span className={styles.toastMsg}>{t.message}</span>
          <button
            className={styles.toastClose}
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorToastStack;
