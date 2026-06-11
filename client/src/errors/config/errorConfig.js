/**
 * Spark.E Error Config
 * Maps error types → UI content + metadata
 * Used by ErrorPage, ErrorBoundary, useErrorHandler
 */

export const ERROR_TYPES = {
    NOT_FOUND: "NOT_FOUND",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    SERVER_ERROR: "SERVER_ERROR",
    NETWORK: "NETWORK",
    AI_SERVICE: "AI_SERVICE",
    EMPTY_STATE: "EMPTY_STATE",
    UNKNOWN: "UNKNOWN",
};

/**
 * Resolve a raw HTTP status / JS error → ERROR_TYPE key
 * @param {number|string|Error} error
 * @returns {string} ERROR_TYPE key
 */
export function resolveErrorType(error) {
    if (!error) return ERROR_TYPES.UNKNOWN;

    // JS TypeError / fetch NetworkError
    if (error instanceof TypeError || (typeof error === "string" && error.includes("fetch"))) {
        return ERROR_TYPES.NETWORK;
    }

    const status = error?.status ?? error?.response?.status ?? error;
    if (status === 404) return ERROR_TYPES.NOT_FOUND;
    if (status === 401) return ERROR_TYPES.UNAUTHORIZED;
    if (status === 403) return ERROR_TYPES.FORBIDDEN;
    if (status >= 500 && status < 600) return ERROR_TYPES.SERVER_ERROR;
    if (!navigator.onLine) return ERROR_TYPES.NETWORK;

    return ERROR_TYPES.UNKNOWN;
}

/**
 * Full config map. Each entry:
 *  icon       – inline SVG path data (used in ErrorIllustration)
 *  headline   – short, punchy
 *  description – human, helpful
 *  ctas       – [{label, action}] where action = "back" | "home" | "retry" | "login"
 *  toast      – optional short message for non-blocking toast version
 *  blocking   – true = full-page, false = inline/toast
 */
export const ERROR_CONFIG = {
    [ERROR_TYPES.NOT_FOUND]: {
        code: "404",
        icon: "not_found",
        headline: "Lost in space",
        description: "This page drifted off the map. It may have been moved, renamed, or never existed.",
        ctas: [
            { label: "Go back", action: "back" },
            { label: "Go home", action: "home" },
        ],
        blocking: true,
    },

    [ERROR_TYPES.UNAUTHORIZED]: {
        code: "401",
        icon: "lock",
        headline: "Session expired",
        description: "Your session timed out. Sign in again to pick up where you left off.",
        ctas: [
            { label: "Sign in", action: "login" },
            { label: "Go home", action: "home" },
        ],
        blocking: true,
    },

    [ERROR_TYPES.FORBIDDEN]: {
        code: "403",
        icon: "shield",
        headline: "Access denied",
        description: "You don't have permission to view this. Contact your instructor if you think this is wrong.",
        ctas: [
            { label: "Go back", action: "back" },
            { label: "Go home", action: "home" },
        ],
        blocking: true,
    },

    [ERROR_TYPES.SERVER_ERROR]: {
        code: "500",
        icon: "server",
        headline: "Something broke on our end",
        description: "The server hit an unexpected error. We're on it — try again in a moment.",
        ctas: [
            { label: "Try again", action: "retry" },
            { label: "Go home", action: "home" },
        ],
        toast: "Server error. Retrying…",
        blocking: true,
    },

    [ERROR_TYPES.NETWORK]: {
        code: "NET",
        icon: "network",
        headline: "No connection",
        description: "Spark.E can't reach the server. Check your internet connection and try again.",
        ctas: [
            { label: "Retry", action: "retry" },
            { label: "Go home", action: "home" },
        ],
        toast: "Connection lost. Check your network.",
        blocking: true,
    },

    [ERROR_TYPES.AI_SERVICE]: {
        code: "AI",
        icon: "ai",
        headline: "AI tutor is taking a break",
        description: "The AI service is temporarily unavailable or over capacity. Your work is safe — try again shortly.",
        ctas: [
            { label: "Try again", action: "retry" },
            { label: "Go back", action: "back" },
        ],
        toast: "AI service unavailable. Try again shortly.",
        blocking: false,
    },

    [ERROR_TYPES.EMPTY_STATE]: {
        code: null,
        icon: "empty",
        headline: "Nothing here yet",
        description: "This space is waiting for you to fill it.",
        ctas: [],
        blocking: false,
    },

    [ERROR_TYPES.UNKNOWN]: {
        code: "ERR",
        icon: "unknown",
        headline: "Something went wrong",
        description: "An unexpected error occurred. Try refreshing the page.",
        ctas: [
            { label: "Refresh", action: "retry" },
            { label: "Go home", action: "home" },
        ],
        toast: "Something went wrong.",
        blocking: true,
    },
};