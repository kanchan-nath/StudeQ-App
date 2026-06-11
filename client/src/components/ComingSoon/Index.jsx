import { useState, memo } from "react";
import styles from "./ComingSoon.module.css";

const ComingSoon = memo(({ label, eta, showNotifyForm = false }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = () => {
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.stars}
        aria-hidden="true"
      />
      <div
        className={styles.glow}
        aria-hidden="true"
      />

      <div className={styles.content}>
        <div
          className={styles.orbitContainer}
          aria-hidden="true"
        >
          <span className={`${styles.ring} ${styles.ringOuter}`} />
          <span className={styles.ring} />
          <span className={styles.sparkIcon}>✦</span>
        </div>

        <h1 className={styles.heading}>Coming Soon</h1>

        {label && (
          <p className={styles.label}>
            <span className={styles.labelFeature}>{label}</span> is almost ready
          </p>
        )}

        {eta && (
          <span className={styles.etaBadge}>
            <span className={styles.etaDot} />
            Expected: {eta}
          </span>
        )}

        {showNotifyForm &&
          (submitted ? (
            <p className={styles.notifySuccess}>
              ✓ You're on the list — we'll let you know!
            </p>
          ) : (
            <div
              className={styles.notifyForm}
              role="group"
              aria-label="Notify me form"
            >
              <input
                className={styles.notifyInput}
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                aria-label="Email address"
              />
              <button
                className={styles.notifyBtn}
                onClick={handleNotify}
                type="button"
              >
                Notify me
              </button>
            </div>
          ))}
      </div>
    </div>
  );
});

ComingSoon.displayName = "ComingSoon";

export { ComingSoon };
export default ComingSoon;
