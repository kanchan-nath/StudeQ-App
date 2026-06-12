import React, { useCallback } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import styles from "../Error.module.css";
import ErrorIllustration from "./ErrorIllustration.jsx";
import {
  ERROR_CONFIG,
  ERROR_TYPES,
  resolveErrorType,
} from "../config/errorConfig.js";

// ── Starfield ─────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  dur: `${2 + Math.random() * 4}s`,
  delay: `${Math.random() * 4}s`,
}));

const Starfield = () => (
  <div
    className={styles.starfield}
    aria-hidden="true"
  >
    {STARS.map((s) => (
      <span
        key={s.id}
        className={styles.star}
        style={{
          top: s.top,
          left: s.left,
          "--dur": s.dur,
          "--delay": s.delay,
        }}
      />
    ))}
  </div>
);

// ── CTA button factory ────────────────────────────────────────────────────────
const CTAButton = ({ label, action, onRetry, index }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (action === "back") navigate(-1);
    else if (action === "home") navigate("/dashboard");
    else if (action === "login") navigate("/login");
    else if (action === "retry" && onRetry) onRetry();
    else if (action === "retry") window.location.reload();
  }, [action, navigate, onRetry]);

  const isPrimary = index === 0;

  return (
    <button
      className={isPrimary ? styles.btnPrimary : styles.btnSecondary}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

// ── Main ErrorPage ────────────────────────────────────────────────────────────
/**
 * ErrorPage — full-page error display
 *
 * Props:
 *   type      – ERROR_TYPES key (overrides auto-resolution)
 *   error     – raw error object / HTTP status
 *   onRetry   – optional retry callback
 *   inline    – if true, render compact inline version (no starfield, no full-page)
 *   emptyState – if true, render soft empty-state variant
 *   customHeadline / customDescription – override copy
 *   children  – optional CTA override slot
 */
const ErrorPage = ({
  type,
  error,
  onRetry,
  inline = false,
  emptyState = false,
  customHeadline,
  customDescription,
  children,
}) => {
  const resolvedType = type ?? resolveErrorType(error) ?? ERROR_TYPES.UNKNOWN;
  const config = ERROR_CONFIG[resolvedType];

  const headline = customHeadline ?? config.headline;
  const description = customDescription ?? config.description;

  // ── Empty state variant ───────────────────────────────────────────────────
  if (emptyState) {
    return (
      <div
        className={styles.emptyState}
        role="status"
        aria-label={headline}
      >
        <ErrorIllustration
          icon="empty"
          className={styles.emptyIllustration}
        />
        <p className={styles.emptyHeadline}>{headline}</p>
        {description && <p className={styles.emptyDesc}>{description}</p>}
        {children}
      </div>
    );
  }

  // ── Inline variant ────────────────────────────────────────────────────────
  if (inline) {
    return (
      <div
        className={styles.inlineError}
        role="alert"
        aria-label={`Error: ${headline}`}
      >
        <ErrorIllustration
          icon={config.icon}
          className={styles.inlineIcon}
        />
        <p className={styles.inlineHeadline}>{headline}</p>
        {description && <p className={styles.inlineDesc}>{description}</p>}
        {config.ctas.length > 0 && (
          <div className={styles.actions}>
            {config.ctas.map((cta, i) => (
              <CTAButton
                key={cta.action}
                {...cta}
                index={i}
                onRetry={onRetry}
              />
            ))}
          </div>
        )}
        {children}
      </div>
    );
  }

  // ── Full-page variant ─────────────────────────────────────────────────────
  return (
    <main
      className={styles.errorPage}
      role="main"
      aria-label={`Error page: ${headline}`}
    >
      <Starfield />
      <div
        className={styles.orb}
        style={{ "--orb": 1 }}
        aria-hidden="true"
      >
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div
        className={styles.card}
        tabIndex={-1}
      >
        {/* Scan-line detail for server errors */}
        {resolvedType === ERROR_TYPES.SERVER_ERROR && (
          <div
            className={styles.scanEffect}
            aria-hidden="true"
          />
        )}

        {config.code && (
          <div
            className={styles.codeBadge}
            aria-label={`Error code ${config.code}`}
          >
            {config.code}
          </div>
        )}

        <ErrorIllustration
          icon={config.icon}
          className={styles.illustration}
        />

        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.description}>{description}</p>

        {config.ctas.length > 0 && (
          <div
            className={styles.actions}
            role="group"
            aria-label="Recovery options"
          >
            {config.ctas.map((cta, i) => (
              <CTAButton
                key={cta.action}
                {...cta}
                index={i}
                onRetry={onRetry}
              />
            ))}
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

export default ErrorPage;

// ── Route-aware wrapper for React Router errorElement ────────────────────────
/**
 * RouteErrorPage — used as errorElement in router config.
 * Auto-reads useRouteError() from RR v6.
 *
 * Usage:
 *   <Route path="*" errorElement={<RouteErrorPage />} />
 */
export const RouteErrorPage = ({ onRetry }) => {
  const routeError = useRouteError?.();
  return (
    <ErrorPage
      error={routeError}
      onRetry={onRetry}
    />
  );
};
