import { useState, useCallback, useContext, createContext } from "react";
import { resolveErrorType, ERROR_CONFIG, ERROR_TYPES } from "../config/errorConfig.js";

// ── Context ───────────────────────────────────────────────────────────────────
const ErrorContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export const ErrorProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "error", duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    return (
        <ErrorContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ErrorContext.Provider>
    );
};

// ── useErrorHandler ────────────────────────────────────────────────────────────
/**
 * Drop-in hook matching the useLoader / useUser pattern.
 *
 * Usage:
 *   const { handleError, handleAIError, notifyError } = useErrorHandler();
 *
 *   // In a fetch catch block:
 *   catch (err) { handleError(err, { onRetry: loadData }); }
 */
const useErrorHandler = () => {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error("useErrorHandler must be used inside <ErrorProvider>");

    const { addToast } = ctx;

    /**
     * General-purpose error handler.
     * Resolves error type, shows toast for non-blocking, throws for blocking (caught by ErrorBoundary).
     */
    const handleError = useCallback((error, { silent = false } = {}) => {
        const type = resolveErrorType(error);
        const config = ERROR_CONFIG[type];

        if (!silent && config.toast) {
            addToast(config.toast, "error");
        }

        return type;
    }, [addToast]);

    /**
     * Specialized handler for AI/Groq/NIM service failures.
     */
    const handleAIError = useCallback((error) => {
        addToast(ERROR_CONFIG[ERROR_TYPES.AI_SERVICE].toast, "error");
        return ERROR_TYPES.AI_SERVICE;
    }, [addToast]);

    /**
     * Simple non-blocking notification (replaces scattered inline toast logic).
     */
    const notifyError = useCallback((message) => {
        addToast(message, "error");
    }, [addToast]);

    const notifySuccess = useCallback((message) => {
        addToast(message, "success");
    }, [addToast]);

    return { handleError, handleAIError, notifyError, notifySuccess };
};

export default useErrorHandler;
export { ErrorContext };