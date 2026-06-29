import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import {
    Crown,
    CircleCheckBig,
    Star,
    MessageSquare,
    CircleHelp,
    CreditCard,
    Cpu,
    Calendar,
    Zap,
    Code,
} from "lucide-react";
import useLoader from "../ContextApi/useLoader.js";

// ── Error system imports ───────────────────────────────────────────────────────
import ErrorPage from "../errors/components/ErrorPage.jsx";
import { ERROR_TYPES, resolveErrorType } from "../errors/config/errorConfig.js";
import useErrorHandler from "../errors/hooks/useErrorHandler.jsx";

import styles from "../pages/styles/Payment.module.css";
import { useRazorpayCheckout } from "../lib/useRazorpaycheckout.js"

// ── Icon lookup for backend-provided feature keys ───────────────────────────────
const FEATURE_ICON_MAP = {
    chat: MessageSquare,
    quiz: CircleHelp,
    flashcards: CreditCard,
    tutor: Cpu,
    scheduler: Calendar,
    streaming: Zap,
    codegen: Code,
};

// ── Default values ─────────────────────────────────────────────────────────────
const DEFAULT_PLANS = [];
const DEFAULT_FEATURES = [];
const DEFAULT_SUBSCRIPTION = { planId: null, billingCycle: "monthly" };

// const DEFAULT_PLANS = [
//     {
//         id: "free",
//         name: "Free",
//         description: "Basic access to get started",
//         priceMonthly: 0,
//         priceYearly: 0,
//         isPopular: false,
//         ctaLabel: "Choose Plan",
//         features: [
//             "5 quizzes per month",
//             "Basic flashcards",
//             "Limited chat access",
//         ],
//     },
//     {
//         id: "pro",
//         name: "Pro",
//         description: "For serious students",
//         priceMonthly: 9,
//         priceYearly: 86,
//         isPopular: true,
//         ctaLabel: "Upgrade to Pro",
//         features: [
//             "Unlimited quizzes",
//             "Unlimited flashcards",
//             "AI tutor access",
//             "Priority support",
//         ],
//     },
//     {
//         id: "premium",
//         name: "Premium",
//         description: "Full power, no limits",
//         priceMonthly: 19,
//         priceYearly: 182,
//         isPopular: false,
//         ctaLabel: "Go Premium",
//         features: [
//             "Everything in Pro",
//             "Advanced AI models",
//             "Custom study scheduler",
//             "Early access features",
//         ],
//     },
// ];

// const DEFAULT_FEATURES = [
//     { iconKey: "chat", label: "AI Chat Assistant" },
//     { iconKey: "quiz", label: "Smart Quizzes" },
//     { iconKey: "flashcards", label: "Flashcards" },
//     { iconKey: "scheduler", label: "Event Scheduling" },
// ];

// const DEFAULT_SUBSCRIPTION = { planId: null, billingCycle: "monthly" };

const Payment = () => {
    const { show, hide } = useLoader();
    const navigate = useNavigate();
    const { pay } = useRazorpayCheckout();
    // ── Error handler hook ───────────────────────────────────────────────────────
    const { notifyError, notifySuccess } = useErrorHandler();

    // ── State ────────────────────────────────────────────────────────────────────
    // billingCycle: lives here — page-local, drives price display + subscribe payload
    const [billingCycle, setBillingCycle] = useState(DEFAULT_SUBSCRIPTION.billingCycle);
    const [plans, setPlans] = useState(DEFAULT_PLANS);
    const [sharedFeatures, setSharedFeatures] = useState(DEFAULT_FEATURES);
    const [currentPlanId, setCurrentPlanId] = useState(DEFAULT_SUBSCRIPTION.planId);
    const [pageLoading, setPageLoading] = useState(true);

    // ── Blocking error state — replaces the whole page ──────────────────────────
    const [pageError, setPageError] = useState(null);

    // ── Per-plan CTA loading (checkout in flight) ───────────────────────────────
    // loadingPlanId: lives here — only one checkout can be in flight at a time
    const [loadingPlanId, setLoadingPlanId] = useState(null);

    // NOTE: no `hoveredCard` state. Card hover (lift + border glow) is handled
    // entirely in CSS via :hover / :focus-visible — no re-render needed for a
    // pure visual hover effect. Kept out per "flag where parent/context should
    // own it" — this one shouldn't be owned by React state at all.

    // ── Fetch ────────────────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        show("Fetching plans…");
        setPageError(null);

        try {
            const res = await apiFetch("/api/billing/plans");

            if (res.status === 401) {
                notifyError("Session expired. Sign in again.");
                navigate("/login");
                return;
            }

            if (res.status === 403) {
                setPageError(ERROR_TYPES.FORBIDDEN);
                return;
            }

            if (res.status >= 500) {
                setPageError(ERROR_TYPES.SERVER_ERROR);
                return;
            }

            if (!res.ok) {
                setPageError(ERROR_TYPES.UNKNOWN);
                return;
            }

            const data = await res.json();

            setPlans(data.data.plans);
            setSharedFeatures(data.data.sharedFeatures);

            // ── Current subscription (separate call — plans are public, this isn't) ──
            const subRes = await apiFetch("/api/billing/subscription");

            if (subRes.ok) {
                const subData = await subRes.json();
                setCurrentPlanId(subData?.data?.planId ?? DEFAULT_SUBSCRIPTION.planId);
                setBillingCycle(subData?.data?.billingCycle ?? DEFAULT_SUBSCRIPTION.billingCycle);
            }
        } catch (err) {
            const type = resolveErrorType(err);
            console.log(err);

            if (type === ERROR_TYPES.NETWORK) {
                setPageError(ERROR_TYPES.NETWORK);
            } else {
                setPageError(ERROR_TYPES.UNKNOWN);
            }
        } finally {
            setPageLoading(false);
            hide();
        }
    }, [navigate, notifyError, show, hide]);

    useEffect(() => {
        fetchData();
    }, []);

    // ── Plan selection / checkout ────────────────────────────────────────────────
    // const handleSelectPlan = useCallback(
    //     async (planId) => {
    //         if (planId === currentPlanId || loadingPlanId) return;

    //         setLoadingPlanId(planId);

    //         try {
    //             const res = await apiFetch("/api/billing/subscribe", {
    //                 method: "POST",
    //                 body: JSON.stringify({ planId, billingCycle }),
    //             });

    //             if (res.status === 401) {
    //                 notifyError("Session expired. Sign in again.");
    //                 navigate("/login");
    //                 return;
    //             }

    //             if (!res.ok) {
    //                 notifyError("Could not start checkout. Try again.");
    //                 return;
    //             }

    //             const data = await res.json();

    //             if (data?.data?.checkoutUrl) {
    //                 window.location.href = data.data.checkoutUrl;
    //                 return;
    //             }

    //             setCurrentPlanId(planId);
    //             notifySuccess("Plan updated.");
    //         } catch (err) {
    //             console.log(err);
    //             notifyError("Network error. Try again.");
    //         } finally {
    //             setLoadingPlanId(null);
    //         }
    //     },
    //     [currentPlanId, loadingPlanId, billingCycle, navigate, notifyError, notifySuccess],
    // );

    const handleSelectPlan = useCallback(
        async (plan) => {
            if (plan.planId === currentPlanId || loadingPlanId) return;
            setLoadingPlanId(plan.planId);

            pay({
                productType: "plan_upgrade",
                productRef: plan.planId,
                id:plan._id,
                billingCycle: billingCycle,
                onSuccess: () => {
                    setCurrentPlanId(plan.planId);
                    notifySuccess("Plan updated. Confirmation incoming…");
                    setLoadingPlanId(null);
                },
                onError: (err) => {
                    if (err.status === 401) {
                        notifyError("Session expired. Sign in again.");
                        navigate("/login");
                    } else if (err.status === 403) {
                        setPageError(ERROR_TYPES.FORBIDDEN);
                    } else if (err.status >= 500) {
                        setPageError(ERROR_TYPES.SERVER_ERROR);
                    } else if (err.status === 0) {
                        notifyError("Network error. Check connection and try again.");
                    } else {
                        notifyError(err.message ?? "Could not start checkout. Try again.");
                    }
                    setLoadingPlanId(null);
                },
            });
            // no finally — pay() opens modal async, callbacks fire later
        },
        [currentPlanId, loadingPlanId, pay, navigate, notifyError, notifySuccess],
    );

    // ── Full-page error — replaces page entirely ────────────────────────────────
    if (pageError) {
        return <ErrorPage type={pageError} onRetry={fetchData} />;
    }

    // ── Derived values ───────────────────────────────────────────────────────────
    const getPrice = (plan) =>
        billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

    return (
        <div className={styles.page}>
            <main role="main" aria-label="Pricing page" className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Choose Your Plan</h1>
                    <p className={styles.subtitle}>Upgrade anytime. Cancel anytime.</p>
                </header>

                <section aria-label="Billing cycle toggle" className={styles.toggleWrap}>
                    <div className={styles.toggle} role="group" aria-label="Billing cycle">
                        <span
                            className={styles.toggleThumb}
                            data-position={billingCycle}
                            aria-hidden="true"
                        />
                        <button
                            type="button"
                            aria-pressed={billingCycle === "monthly"}
                            className={`${styles.toggleBtn} ${billingCycle === "monthly" ? styles.toggleBtnActive : ""}`}
                            onClick={() => setBillingCycle("monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            aria-pressed={billingCycle === "yearly"}
                            className={`${styles.toggleBtn} ${billingCycle === "yearly" ? styles.toggleBtnActive : ""}`}
                            onClick={() => setBillingCycle("yearly")}
                        >
                            Yearly <span className={styles.toggleSave}>Save 20%</span>
                        </button>
                    </div>
                </section>

                <section aria-label="Plans" role="list" className={styles.plansGrid}>
                    {pageLoading ? (
                        <p className={styles.loadingText}>Loading plans…</p>
                    ) : (
                        plans.map((plan, idx) => {
                            const isCurrent = plan.planId === currentPlanId;
                            const isProcessing = loadingPlanId === plan.planId;
                            const price = getPrice(plan);
                            const isPro = plan.planId === "pro";
                            const isPremium = plan.planId === "premium";

                            const cardClass = [
                                styles.card,
                                isPro ? styles.cardPro : "",
                                isPremium ? styles.cardPremium : "",
                            ]
                                .filter(Boolean)
                                .join(" ");

                            return (
                                <article
                                    key={plan._id}
                                    role="listitem"
                                    aria-current={isCurrent ? "true" : undefined}
                                    data-testid={`plan-card-${plan.planId}`}
                                    className={cardClass}
                                    style={{ "--stagger-index": idx }}
                                >
                                    {plan.isPopular && (
                                        <span className={styles.popularBadge}>
                                            <Star size={12} className={styles.popularBadgeIcon} />
                                            Most Popular
                                        </span>
                                    )}

                                    <div className={styles.planNameRow}>
                                        {isPro ? (
                                            <Crown size={18} className={styles.planIcon} />
                                        ) : (
                                            <CreditCard size={18} className={styles.planIcon} />
                                        )}
                                        <h2 className={styles.planName}>
                                            {plan.name}
                                            <svg
                                                className={styles.constellation}
                                                viewBox="0 0 40 16"
                                                aria-hidden="true"
                                            >
                                                <circle cx="4" cy="8" r="1.5" />
                                                <circle cx="20" cy="3" r="1.5" />
                                                <circle cx="36" cy="8" r="1.5" />
                                                <path d="M4 8 L20 3 L36 8" />
                                            </svg>
                                        </h2>
                                    </div>

                                    <p className={styles.planDescription}>{plan.description}</p>

                                    <p className={`${styles.price} ${isPro || isPremium ? styles.priceGradient : ""}`}>
                                        <span className={styles.priceValue}>
                                            {price === 0 ? "$0" : `$${price}`}
                                        </span>
                                        {price > 0 && (
                                            <span className={styles.priceMeta}>
                                                <span>per {billingCycle === "yearly" ? "year" : "month"}</span>
                                                <span className={styles.priceBilling}>
                                                    billed {billingCycle}
                                                </span>
                                            </span>
                                        )}
                                    </p>

                                    <button
                                        type="button"
                                        disabled={isCurrent || isProcessing}
                                        onClick={() => handleSelectPlan(plan)}
                                        data-testid={`plan-cta-${plan.planId}`}
                                        className={[
                                            styles.cta,
                                            isPro ? styles.ctaPro : "",
                                            isPremium ? styles.ctaPremium : "",
                                            isCurrent ? styles.ctaCurrent : "",
                                            isProcessing ? styles.ctaLoading : "",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        {isProcessing && <span className={styles.spinner} aria-hidden="true" />}
                                        {isCurrent
                                            ? "Current Plan"
                                            : isProcessing
                                                ? "Processing…"
                                                : (plan.ctaLabel ?? "Choose Plan")}
                                    </button>

                                    <ul className={styles.featureList}>
                                        {(plan.features ?? []).map((feature, i) => (
                                            <li key={i} className={styles.featureItem}>
                                                <span className={styles.featureStar} aria-hidden="true">✦</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            );
                        })
                    )}
                </section>

                <section aria-label="All plans include" className={styles.includeStrip}>
                    <h2 className={styles.includeTitle}>All plans include</h2>
                    <ul className={styles.includeList}>
                        {sharedFeatures.map((feature, i) => {
                            const Icon = FEATURE_ICON_MAP[feature.iconKey] ?? CircleCheckBig;
                            return (
                                <li key={i} className={styles.includePill}>
                                    <Icon size={14} className={styles.includeIcon} />
                                    <span>{feature.label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default Payment;