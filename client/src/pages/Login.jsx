import React, { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import BASE_URL from "../lib/api.js"
import { useState } from 'react'
import "../pages/styles/login.css"

const Login = () => {

  const navigate = useNavigate()
  const [formData, setFormData]  = useState({
    email:"",
    password:"",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok){
        const data = await res.json()
        return setError(data.message || "Login failed")
      }

      const data = await res.json()
      
      const token = data.data.accessToken
      
      localStorage.setItem("token", token)
      navigate("/dashboard")
      
    } catch (error) {
      setError(setError(error)||"Something went wrong. Try again.") 
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-root">

        {/* ── LEFT PANEL ── */}
        <div className="auth-left">
          <header className="auth-header">
            <div className="auth-logo">
              <span className="auth-logo-icon">✦</span>
              <span className="auth-logo-text">StudyFlow</span>
            </div>
          </header>

          <main className="auth-form-wrapper">
            <div className="auth-form-container">
              <div className="auth-heading-group">
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Your launchpad to learn</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && (
                  <div className="auth-error" role="alert">
                    <span className="auth-error-icon">!</span>
                    <p className="auth-error-text">{error}</p>
                  </div>
                )}

                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="email">
                    Email
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m2 7 10 7 10-7" />
                      </svg>
                    </span>
                    <input
                      className="auth-input"
                      id="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      name="email"
                      value={formData.email}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="password">
                    Password
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      className="auth-input"
                      id="password"
                      type="password"
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      name="password"
                      value={formData.password}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="auth-btn-loading">
                      <span className="auth-spinner" />
                      Redirecting…
                    </span>
                  ) : (
                    <span className="auth-btn-label">
                      Login
                      <svg className="auth-btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <footer className="auth-form-footer">
                <p className="auth-footer-text">
                  Don't have an account?{" "}
                  <a className="auth-link" href="/signup">Sign up</a>
                </p>
              </footer>
            </div>
          </main>
        </div>

        {/* ── RIGHT PANEL ── */}
        <aside className="auth-right" aria-hidden="true">
          <div className="auth-right-inner">
            <div className="auth-stat-banner">
              <span className="auth-stat-number">92%</span>
              <span className="auth-stat-label">of students improve grades within 30 days</span>
            </div>

            <div className="auth-showcase-card">
              <div className="auth-showcase-header">
                <span className="auth-showcase-tag">FEATURED</span>
                <h3 className="auth-showcase-title">AI-Powered Study Plans</h3>
              </div>
              <div className="auth-showcase-grid">
                <div className="auth-showcase-item auth-showcase-item--blue">Flashcards</div>
                <div className="auth-showcase-item auth-showcase-item--purple">Practice Tests</div>
                <div className="auth-showcase-item auth-showcase-item--teal">Live Tutoring</div>
                <div className="auth-showcase-item auth-showcase-item--orange">AI Chat</div>
              </div>
            </div>

            <div className="auth-tagline">
              <p className="auth-tagline-main">Drop your class materials,<br />we'll make your study plan.</p>
              <p className="auth-tagline-sub">Trusted by students from top institutions</p>
              <div className="auth-trust-logos">
                <span className="auth-trust-logo">HARVARD</span>
                <span className="auth-trust-logo auth-trust-logo--lg">Yale</span>
                <span className="auth-trust-logo">MIT</span>
              </div>
            </div>
          </div>

          {/* decorative blobs */}
          <div className="auth-blob auth-blob--1" />
          <div className="auth-blob auth-blob--2" />
          <div className="auth-blob auth-blob--3" />
        </aside>

      </div>
    </>
  )
}

export default Login
