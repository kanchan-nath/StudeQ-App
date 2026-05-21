import React, { useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from "../lib/api.js"
import { useState } from 'react'
import styles from "../pages/styles/login.module.css"
import { useSignIn } from "@clerk/react"

const Login = () => {

  const {signIn, isLoaded} = useSignIn()

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        return setError(data.message || "Login failed")
      }

      const data = await res.json()
      const token = data.data.accessToken
      localStorage.setItem("token", token)
      navigate("/dashboard")

    } catch (error) {
      setError(setError(error) || "Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async()=>{
    if(!isLoaded) return

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',          // Must match your callback route
        redirectUrlComplete: '/dashboard',     // Where to send them after login
      });
    } catch (error) {
      console.error('Google sign-in failed:', error)
    }
  }


  return (
    <>
      <div className={styles['auth-root']}>

        {/* ── LEFT PANEL ── */}
        <div className={styles['auth-left']}>
          <header className={styles['auth-header']}>
            <div className={styles['auth-logo']}>
              <span className={styles['auth-logo-icon']}>✦</span>
              <span className={styles['auth-logo-text']}>StudyFlow</span>
            </div>
          </header>

          <main className={styles['auth-form-wrapper']}>
            <div className={styles['auth-form-container']}>

              <div className={styles['auth-heading-group']}>
                <h1 className={styles['auth-title']}>Welcome back</h1>
                <p className={styles['auth-subtitle']}>Your launchpad to learn</p>
              </div>

              {/* Social buttons */}
              <div className={styles['auth-social-row']}>
                <button type="button" onClick={handleGoogleLogin} className={styles['auth-social-btn']}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button type="button" className={styles['auth-social-btn']}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.35.74 3.17.76 1.2-.24 2.35-.93 3.62-.84 1.54.12 2.7.72 3.47 1.84-3.17 1.89-2.42 5.98.48 7.13-.57 1.55-1.32 3.07-2.74 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Apple
                </button>
              </div>

              <div className={styles['auth-divider']}>
                <span className={styles['auth-divider-text']}>or</span>
              </div>

              <form className={styles['auth-form']} onSubmit={handleSubmit}>
                {error && (
                  <div className={styles['auth-error']} role="alert">
                    <span className={styles['auth-error-icon']}>!</span>
                    <p className={styles['auth-error-text']}>{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className={styles['auth-field-group']}>
                  <label className={styles['auth-label']} htmlFor="email">Your Email</label>
                  <div className={styles['auth-input-wrapper']}>
                    <span className={styles['auth-input-icon']}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m2 7 10 7 10-7" />
                      </svg>
                    </span>
                    <input
                      className={styles['auth-input']}
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

                {/* Password + eye toggle */}
                <div className={styles['auth-field-group']}>
                  <label className={styles['auth-label']} htmlFor="password">Your Password</label>
                  <div className={styles['auth-input-wrapper']}>
                    <span className={styles['auth-input-icon']}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      className={`${styles['auth-input']} ${styles['auth-input--password']}`}
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
                      className={styles['auth-eye-btn']}
                      onClick={() => setShowPassword(p => !p)}
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
                  className={styles['auth-submit-btn']}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles['auth-btn-loading']}>
                      <span className={styles['auth-spinner']} />
                      Redirecting…
                    </span>
                  ) : (
                    <span className={styles['auth-btn-label']}>
                      Login
                      <svg className={styles['auth-btn-arrow']} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <footer className={styles['auth-form-footer']}>
                <p className={`${styles['auth-footer-text']} ${styles['auth-footer-terms']}`}>
                  By logging in, you agree to our{" "}
                  <a className={styles['auth-link']} href="/terms">Terms of Service</a>
                  {" "}and{" "}
                  <a className={styles['auth-link']} href="/privacy">Privacy Policy</a>
                </p>
                <p className={styles['auth-footer-text']}>
                  Don't have an account?{" "}
                  <Link className={styles['auth-link']} to="/register">Register</Link>
                </p>
                <p className={styles['auth-footer-text']}>
                  Forgot your password?{" "}
                  <Link className={styles['auth-link']} to="/reset-password">Reset Password</Link>
                </p>
              </footer>

            </div>
          </main>
        </div>

        {/* ── RIGHT PANEL ── */}
        <aside className={styles['auth-right']} aria-hidden="true">
          <div className={styles['auth-right-inner']}>
            <div className={styles['auth-stat-banner']}>
              <span className={styles['auth-stat-number']}>92%</span>
              <span className={styles['auth-stat-label']}>of students get higher grades with StudyFlow</span>
            </div>

            <div className={styles['auth-showcase-card']}>
              <div className={styles['auth-showcase-header']}>
                <span className={styles['auth-showcase-tag']}>FEATURED</span>
                <h3 className={styles['auth-showcase-title']}>AI-Powered Study Plans</h3>
              </div>
              <div className={styles['auth-showcase-grid']}>
                <div className={`${styles['auth-showcase-item']} ${styles['auth-showcase-item--blue']}`}>Flashcards</div>
                <div className={`${styles['auth-showcase-item']} ${styles['auth-showcase-item--purple']}`}>Practice Tests</div>
                <div className={`${styles['auth-showcase-item']} ${styles['auth-showcase-item--teal']}`}>Live Tutoring</div>
                <div className={`${styles['auth-showcase-item']} ${styles['auth-showcase-item--orange']}`}>AI Chat</div>
              </div>
            </div>

            <div className={styles['auth-tagline']}>
              <p className={styles['auth-tagline-main']}>Drop your class materials,<br />we'll make your study plan.</p>
              <p className={styles['auth-tagline-sub']}>Trusted by students from top institutions</p>
              <div className={styles['auth-trust-logos']}>
                <span className={styles['auth-trust-logo']}>HARVARD</span>
                <span className={`${styles['auth-trust-logo']} ${styles['auth-trust-logo--lg']}`}>Yale</span>
                <span className={styles['auth-trust-logo']}>MIT</span>
              </div>
            </div>
          </div>

          <div className={`${styles['auth-blob']} ${styles['auth-blob--1']}`} />
          <div className={`${styles['auth-blob']} ${styles['auth-blob--2']}`} />
          <div className={`${styles['auth-blob']} ${styles['auth-blob--3']}`} />
        </aside>

      </div>
    </>
  )
}

export default Login