import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import BASE_URL from "../lib/api.js"
import {Link} from "react-router-dom"
import "../pages/styles/register.css"
const Register = () => {

const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    grade:""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handleSubmit =async (e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if(!res.ok){
        const data = await res.json()
        return setError(data.message || "Registration failed")
      }
      const data = await res.json()

      navigate("/login")
      
    } catch (error) {
      console.error("Form submission error", error)
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
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">Your launchpad to learn</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && (
                  <div className="auth-error" role="alert">
                    <span className="auth-error-icon">!</span>
                    <p className="auth-error-text">{error}</p>
                  </div>
                )}

                {/* Name */}
                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="name">Name</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </span>
                    <input
                      className="auth-input"
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
                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="email">Email</label>
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
                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="password">Password</label>
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
                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="grade">Grade</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </span>
                    <input
                      className="auth-input"
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
                <div className="auth-tip">
                  <svg className="auth-tip-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <p className="auth-tip-text">
                    Got a <strong>.edu email</strong>? You might qualify for free premium!
                  </p>
                </div>

                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  onClick={() => setLoading(true)}
                >
                  {loading ? (
                    <span className="auth-btn-loading">
                      <span className="auth-spinner" />
                      Registering…
                    </span>
                  ) : (
                    <span className="auth-btn-label">
                      Register
                      <svg className="auth-btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <footer className="auth-form-footer">
                <p className="auth-footer-text">
                  Already have an account?{" "}
                  <Link className="auth-link" to="/login">Log In</Link>
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
              <span className="auth-stat-label">of students get higher grades with StudyFlow</span>
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

          <div className="auth-blob auth-blob--1" />
          <div className="auth-blob auth-blob--2" />
          <div className="auth-blob auth-blob--3" />
        </aside>

      </div>
    </>
  )
}

export default Register
