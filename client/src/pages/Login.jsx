import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import { useState } from "react";
import styles from "../pages/styles/login.module.css";
import { connectSocket } from "../lib/socket.js";
import useUser from "../ContextApi/useUser.js";
import { Helmet } from "react-helmet-async"

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // credentials:'include' is handled by apiFetch — backend sets httpOnly cookie
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        return setError(data.message || "Login failed");
      }

      const data = await res.json();

      // Update context with returned user — no localStorage, no token handling
      setUser(data.data.user ?? data.data);

      connectSocket();
      navigate("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // If already logged in (cookie valid = user in context), redirect immediately
  useEffect(() => {
    if (user) {
      setRedirecting(true);
      setTimeout(() => navigate("/dashboard"), 6000);
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {redirecting && (
        <div className={styles["auth-toast"]}>
          <span className={styles["auth-toast-text"]}>
            ✓ Already logged in — Redirecting to Dashboard…
          </span>
          <div className={styles["auth-toast-bar"]} />
        </div>
      )}
      <div className={styles["auth-root"]}>
        {/* ── LEFT PANEL ── */}
        <div className={styles["auth-left"]}>
          <header className={styles["auth-header"]}>
          </header>

          <main className={styles["auth-form-wrapper"]}>
            <div className={styles["auth-form-container"]}>
              <div className={styles["auth-heading-group"]}>
                <h1 className={styles["auth-title"]}>Welcome back</h1>
                <p className={styles["auth-subtitle"]}>
                  Your launchpad to learn
                </p>
              </div>

              <div className={styles["auth-divider"]}>
                <span className={styles["auth-divider-text"]}>or</span>
              </div>

              <form className={styles["auth-form"]} onSubmit={handleSubmit}>
                {error && (
                  <div className={styles["auth-error"]} role="alert">
                    <span className={styles["auth-error-icon"]}>!</span>
                    <p className={styles["auth-error-text"]}>{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className={styles["auth-field-group"]}>
                  <label className={styles["auth-label"]} htmlFor="email">
                    Your Email
                  </label>
                  <div className={styles["auth-input-wrapper"]}>
                    <span className={styles["auth-input-icon"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m2 7 10 7 10-7" />
                      </svg>
                    </span>
                    <input
                      className={styles["auth-input"]}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className={styles["auth-field-group"]}>
                  <label className={styles["auth-label"]} htmlFor="password">
                    Your Password
                  </label>
                  <div className={styles["auth-input-wrapper"]}>
                    <span className={styles["auth-input-icon"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      className={`${styles["auth-input"]} ${styles["auth-input--password"]}`}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className={styles["auth-eye-btn"]}
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  className={styles["auth-submit-btn"]}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles["auth-btn-loading"]}>
                      <span className={styles["auth-spinner"]} />
                      Redirecting…
                    </span>
                  ) : (
                    <span className={styles["auth-btn-label"]}>
                      Login
                      <svg className={styles["auth-btn-arrow"]} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <footer className={styles["auth-form-footer"]}>
                <p className={`${styles["auth-footer-text"]} ${styles["auth-footer-terms"]}`}>
                  By logging in, you agree to our{" "}
                  <a className={styles["auth-link"]} href="https://studeq.onrender.com/terms-of-service">Terms of Service</a>{" "}
                  and{" "}
                  <a className={styles["auth-link"]} href="https://studeq.onrender.com/privacy-policy">Privacy Policy</a>
                </p>
                <p className={styles["auth-footer-text"]}>
                  Don't have an account?{" "}
                  <Link className={styles["auth-link"]} to="/register">Register</Link>
                </p>
                <p className={styles["auth-footer-text"]}>
                  Forgot your password?{" "}
                  <Link className={styles["auth-link"]} to="/reset-password">Reset Password</Link>
                </p>
              </footer>
            </div>
          </main>
        </div>

        {/* ── RIGHT PANEL ── */}
        <aside className={styles["auth-right"]} aria-hidden="true">
          <div className={styles["auth-right-inner"]}>
            <div className={styles["auth-stat-banner"]}>
              <span className={styles["auth-stat-number"]}>92%</span>
              <span className={styles["auth-stat-label"]}>
                of students get higher grades with StudeQ
              </span>
            </div>

            <div className={styles["auth-showcase-card"]}>
              <div className={styles["auth-showcase-header"]}>
                <span className={styles["auth-showcase-tag"]}>FEATURED</span>
                <h3 className={styles["auth-showcase-title"]}>
                  AI-Powered Study Plans
                </h3>
              </div>
              <div className={styles["auth-showcase-grid"]}>
                <div className={`${styles["auth-showcase-item"]} ${styles["auth-showcase-item--blue"]}`}>Flashcards</div>
                <div className={`${styles["auth-showcase-item"]} ${styles["auth-showcase-item--purple"]}`}>Practice Tests</div>
                <div className={`${styles["auth-showcase-item"]} ${styles["auth-showcase-item--teal"]}`}>Live Tutoring</div>
                <div className={`${styles["auth-showcase-item"]} ${styles["auth-showcase-item--orange"]}`}>AI Chat</div>
              </div>
            </div>

            <div className={styles["auth-tagline"]}>
              <p className={styles["auth-tagline-main"]}>
                Drop your class materials,
                <br />
                we'll make your study plan.
              </p>
              <p className={styles["auth-tagline-sub"]}>
                Trusted by students from top institutions
              </p>
              <div className={styles["auth-trust-logos"]}>
                <span className={styles["auth-trust-logo"]}>HARVARD</span>
                <span className={`${styles["auth-trust-logo"]} ${styles["auth-trust-logo--lg"]}`}>Yale</span>
                <span className={styles["auth-trust-logo"]}>MIT</span>
              </div>
            </div>
          </div>

          <div className={`${styles["auth-blob"]} ${styles["auth-blob--1"]}`} />
          <div className={`${styles["auth-blob"]} ${styles["auth-blob--2"]}`} />
          <div className={`${styles["auth-blob"]} ${styles["auth-blob--3"]}`} />
        </aside>
      </div>
    </>
  );
};

export default Login;