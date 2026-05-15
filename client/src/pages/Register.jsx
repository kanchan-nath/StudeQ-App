import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import BASE_URL from "../lib/api.js"
import { Link } from "react-router-dom"
import styles from "../pages/styles/register.module.css"

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: ""
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
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        return setError(data.message || "Registration failed")
      }
      const data = await res.json()

      navigate("/login")

    } catch (error) {
      console.error("Form submission error", error)
    } finally {
      setLoading(false)
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
                <h1 className={styles['auth-title']}>Create your account</h1>
                <p className={styles['auth-subtitle']}>Your launchpad to learn</p>
              </div>

              <form className={styles['auth-form']} onSubmit={handleSubmit}>
                {error && (
                  <div className={styles['auth-error']} role="alert">
                    <span className={styles['auth-error-icon']}>!</span>
                    <p className={styles['auth-error-text']}>{error}</p>
                  </div>
                )}

                {/* Name */}
                <div className={styles['auth-field-group']}>
                  <label className={styles['auth-label']} htmlFor="name">Name</label>
                  <div className={styles['auth-input-wrapper']}>
                    <span className={styles['auth-input-icon']}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </span>
                    <input
                      className={styles['auth-input']}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className={styles['auth-field-group']}>
                  <label className={styles['auth-label']} htmlFor="email">Email</label>
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

                {/* Password */}
                <div className={styles['auth-field-group']}>
                  <label className={styles['auth-label']} htmlFor="password">Password</label>
                  <div className={styles['auth-input-wrapper']}>
                    <span className={styles['auth-input-icon']}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      className={styles['auth-input']}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Grade */}
                <div className={styles['auth-field-group']}>
                  <label className={styles['auth-label']} htmlFor="grade">Grade</label>
                  <div className={styles['auth-input-wrapper']}>
                    <span className={styles['auth-input-icon']}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </span>
                    <input
                      className={styles['auth-input']}
                      id="grade"
                      name="grade"
                      type="text"
                      placeholder="What is your grade?"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Tip banner */}
                <div className={styles['auth-tip']}>
                  <svg className={styles['auth-tip-icon']} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <p className={styles['auth-tip-text']}>
                    Got a <strong>.edu email</strong>? You might qualify for free premium!
                  </p>
                </div>

                <button
                  className={styles['auth-submit-btn']}
                  type="submit"
                  disabled={loading}
                  onClick={() => setLoading(true)}
                >
                  {loading ? (
                    <span className={styles['auth-btn-loading']}>
                      <span className={styles['auth-spinner']} />
                      Registering…
                    </span>
                  ) : (
                    <span className={styles['auth-btn-label']}>
                      Register
                      <svg className={styles['auth-btn-arrow']} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <footer className={styles['auth-form-footer']}>
                <p className={styles['auth-footer-text']}>
                  Already have an account?{" "}
                  <Link className={styles['auth-link']} to="/login">Log In</Link>
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

export default Register