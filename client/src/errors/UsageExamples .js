/**
 * USAGE EXAMPLES — Spark.E Error System
 * One example per error category.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. 404 / Undefined routes
//    → Already handled by route catch-all in App.jsx router diff.
//    → Also usable imperatively:
// ─────────────────────────────────────────────────────────────────────────────

import ErrorPage from "./errors/components/ErrorPage.jsx";
import { ERROR_TYPES } from "./errors/config/errorConfig.js";

// In any component:
function NotFound() {
    return <ErrorPage type={ERROR_TYPES.NOT_FOUND} />;
}


// ─────────────────────────────────────────────────────────────────────────────
// 2. 401 / Session expired — detect in ProtectedRoute or fetch interceptor
// ─────────────────────────────────────────────────────────────────────────────

import useErrorHandler from "./errors/hooks/useErrorHandler.jsx";

function SomePage() {
    const { handleError } = useErrorHandler();

    async function loadData() {
        try {
            const res = await fetch(`${BASE_URL}/api/user/userinfo`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (res.status === 401) {
                handleError({ status: 401 }); // → toast + returns "UNAUTHORIZED" type
                navigate("/login");
                return;
            }

            const data = await res.json();
            // ...
        } catch (err) {
            handleError(err); // auto-resolves type, shows toast
        }
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. 500 / Backend crash — show full-page error with retry
// ─────────────────────────────────────────────────────────────────────────────

function Dashboard() {
    const [errorType, setErrorType] = useState(null);
    const { handleError } = useErrorHandler();

    async function fetchDashboard() {
        try {
            const res = await fetch(`${BASE_URL}/api/dashboard`);
            if (res.status >= 500) {
                setErrorType(ERROR_TYPES.SERVER_ERROR);
                return;
            }
            // ...
        } catch (err) {
            const type = handleError(err);
            if (ERROR_CONFIG[type].blocking) {
                setErrorType(type);
            }
        }
    }

    if (errorType) {
        return (
            <ErrorPage
                type={errorType}
                onRetry={() => { setErrorType(null); fetchDashboard(); }}
            />
        );
    }

    return <div>Dashboard content</div>;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. Network failure — auto-detected by handleError(TypeError)
// ─────────────────────────────────────────────────────────────────────────────

async function saveNote(content) {
    const { handleError } = useErrorHandler(); // in component scope

    try {
        const res = await fetch(`${BASE_URL}/api/notes`, {
            method: "POST",
            body: JSON.stringify({ content }),
        });
        // ...
    } catch (err) {
        // TypeError: Failed to fetch → resolves to NETWORK
        handleError(err); // → shows "Connection lost. Check your network." toast
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. AI service failure — specialized handler
// ─────────────────────────────────────────────────────────────────────────────

function TutorPage() {
    const { handleAIError } = useErrorHandler();
    const [aiDown, setAiDown] = useState(false);

    async function askTutor(question) {
        try {
            const res = await fetch(`${BASE_URL}/api/tutor/ask`, {
                method: "POST",
                body: JSON.stringify({ question }),
            });

            if (res.status === 503 || res.status === 429) {
                handleAIError(res); // → "AI service unavailable. Try again shortly." toast
                setAiDown(true);
                return;
            }

            setAiDown(false);
            // ...
        } catch (err) {
            handleAIError(err);
            setAiDown(true);
        }
    }

    return (
        <div>
            {aiDown && (
                <ErrorPage
                    type={ERROR_TYPES.AI_SERVICE}
                    inline
                    onRetry={() => { setAiDown(false); }}
                />
            )}
            {/* rest of tutor UI */}
        </div>
    );
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. Empty states — soft, non-error "nothing here" messaging
// ─────────────────────────────────────────────────────────────────────────────

function FlashcardList({ cards }) {
    if (cards.length === 0) {
        return (
            <ErrorPage
                emptyState
                customHeadline="No flashcards yet"
                customDescription="Create your first deck to get started."
            >
                {/* Optional child CTA */}
                <button onClick={() => navigate("/flashcards/create")}>
                    Create deck
                </button>
            </ErrorPage>
        );
    }

    return <div>{cards.map(/* ... */)}</div>;
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. ErrorBoundary — JS crash catchall (already in main.jsx)
//    For wrapping specific unstable panels:
// ─────────────────────────────────────────────────────────────────────────────

import ErrorBoundary from "./errors/components/ErrorBoundary.jsx";

function NotebookPage() {
    return (
        <div>
            {/* If AIPanel crashes, only that panel shows error — rest of page survives */}
            <ErrorBoundary
                fallback={
                    <ErrorPage
                        type={ERROR_TYPES.UNKNOWN}
                        inline
                        customHeadline="AI panel crashed"
                        customDescription="Reload the page or go back."
                    />
                }
                onError={(err) => console.error("AIPanel error:", err)}
            >
                <AIPanel />
            </ErrorBoundary>
        </div>
    );
}