import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"
import BASE_URL from "../lib/api.js"
import { useNavigate, Link } from "react-router-dom"
// import { socket } from '../lib/socket.js'
import "../pages/styles/dashboard.css"
const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('home');
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    grade: ""
  })
  const token = localStorage.getItem("token")

  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("Connected to server:", socket.id);
    // });
    
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/api/user/userinfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      setUserData({ ...userData, name: data.data.name, email: data.data.email, grade: data.data.grade })


    };

    fetchData();
  }, []);

  const handleSubmitLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")

    navigate("/login")

  }

  // ── Quick actions ─────────────────────────────────────────────
  const QUICK_ACTIONS = [
    { label: 'Upload Material', icon: '⬆️', to: '/notes' },
    { label: 'Create Quiz', icon: '⚡', to: '/quiz' },
    { label: 'Chat with AI', icon: '💬', to: '/tutor' },
    { label: 'Study Room', icon: '📚', to: '/studyroom' },
    { label: 'Image Analysis', icon: '🖼️', to: '/image-analysis' },
    { label: 'PDF Analysis', icon: '📄', to: '/pdf-analysis' },
  ];

  // ── Feature / activity cards ──────────────────────────────────
  const FEATURE_CARDS = [
    {
      icon: '🧠', colorClass: 'blue',
      title: 'Flashcard Practice',
      desc: 'Reinforce what you know with smart flashcard sessions built from your uploaded notes.',
      cta: 'Start practicing', to: '/studyroom',
    },
    {
      icon: '⚡', colorClass: 'purple',
      title: 'Generate a Quiz',
      desc: 'Turn any material into an instant quiz. Get real-time feedback on every answer.',
      cta: 'Create quiz', to: '/quiz',
    },
    {
      icon: '🖼️', colorClass: 'teal',
      title: 'Analyze an Image',
      desc: 'Drop a diagram, chart, or handwritten page — get a full AI-powered explanation.',
      cta: 'Analyze image', to: '/image-analysis',
    },
    {
      icon: '📄', colorClass: 'orange',
      title: 'Break Down a PDF',
      desc: 'Upload any PDF and extract key concepts, summaries, and quiz questions in seconds.',
      cta: 'Analyze PDF', to: '/pdf-analysis',
    },
    {
      icon: '🤖', colorClass: 'pink',
      title: 'AI Tutor Session',
      desc: 'Ask anything. Your personal AI tutor walks you through tough concepts step by step.',
      cta: 'Start session', to: '/tutor',
    },
    {
      icon: '📅', colorClass: 'green',
      title: 'Plan Your Week',
      desc: 'Build a smart study schedule around your exams, deadlines, and learning goals.',
      cta: 'Open scheduler', to: '/scheduler',
    },
  ];

  const initials = userData?.name
    ? userData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="app-shell">

      {/* ── MAIN CONTENT (scrollable) ──────────────────────── */}
      <main className="main-content" role="main" aria-label="Dashboard content">

        {/* Greeting banner */}
        <section className="greeting-banner" aria-label="Welcome banner">
          <div className="greeting-banner__avatar" aria-hidden="true">👋</div>
          <div className="greeting-banner__text">
            <h1>Welcome back, {userData?.name}!</h1>
            <p>
              Ready to pick up where you left off?{' '}
              <strong>Upload a new document</strong> or jump into a{' '}
              <Link to="/studyroom"><strong>Study Room</strong></Link> session.
            </p>
          </div>
        </section>

        {/* Quick actions */}
        <section className="quick-actions" aria-labelledby="quick-actions-heading">
          <div className="section-header">
            <div>
              <h2 id="quick-actions-heading">Quick Actions</h2>
              <p>Jump straight into any tool</p>
            </div>
          </div>

          <div className="quick-actions__grid" role="list">
            {QUICK_ACTIONS.map(({ label, icon, to }) => (
              <Link
                key={to}
                to={to}
                className="quick-action-card"
                role="listitem"
              >
                <div className="quick-action-card__icon" aria-hidden="true">
                  {icon}
                </div>
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Profile details */}
        <section className="profile-section" aria-labelledby="profile-heading">
          <div className="section-header">
            <div>
              <h2 id="profile-heading">Your Profile</h2>
              <p>Your account details at a glance</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-card__info">
              <p className="profile-card__label">Account Info</p>
              <div className="profile-card__rows">
                <div className="profile-card__row">
                  <span className="profile-card__row-key">Name</span>
                  <span className="profile-card__row-val">{userData?.name}</span>
                </div>
                <div className="profile-card__row">
                  <span className="profile-card__row-key">Grade</span>
                  <span className="profile-card__row-val">{userData?.grade}</span>
                </div>
                <div className="profile-card__row">
                  <span className="profile-card__row-key">Email</span>
                  <span className="profile-card__row-val">{userData?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature / activity cards */}
        <section className="feature-section" aria-labelledby="explore-heading">
          <div className="section-header">
            <div>
              <h2 id="explore-heading">Explore Your Tools</h2>
              <p>Everything you need to learn smarter, not harder</p>
            </div>
          </div>

          <div className="feature-cards-grid" role="list">
            {FEATURE_CARDS.map(({ icon, colorClass, title, desc, cta, to }) => (
              <article key={to} className="feature-card" role="listitem">
                <div className={`feature-card__icon feature-card__icon--${colorClass}`} aria-hidden="true">
                  {icon}
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
                <Link to={to} className="feature-card__cta">{cta}</Link>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* ── RIGHT PANEL (no scroll) ────────────────────────── */}
      <aside className="right-panel" role="complementary" aria-label="Sidebar widgets">

        {/* Upgrade card */}
        <div className="upgrade-card">
          <div className="upgrade-card__header">
            <div className="upgrade-card__badge" aria-hidden="true">⭐</div>
            <h3 className="upgrade-card__title">Go Premium</h3>
          </div>
          <p className="upgrade-card__desc">
            Unlock unlimited AI sessions, advanced PDF analysis, priority tutor access,
            and your full study history.
          </p>
          <button className="upgrade-card__btn">Upgrade now</button>
        </div>

        {/* Upcoming exams */}
        <div className="panel-widget" aria-labelledby="upcoming-heading">
          <h3 className="panel-widget__title" id="upcoming-heading">
            📅 Upcoming
          </h3>
          <p className="panel-widget__body">
            No exams scheduled yet. Add a deadline to get a personalized study plan.
          </p>
          <Link to="/scheduler" className="panel-widget__link">Add exam date →</Link>
        </div>

        {/* Streak */}
        <div className="panel-widget streak-widget" role="status" aria-label="Current study streak">
          <div className="streak-widget__left">
            <span aria-hidden="true">🔥</span>
            1-day streak!
          </div>
          <Link to="/" className="streak-widget__link">Leaderboard →</Link>
        </div>

        {/* Announcements */}
        <div className="panel-widget" aria-labelledby="announce-heading">
          <h3 className="panel-widget__title" id="announce-heading">
            🎉 What's New
          </h3>
          <p className="panel-widget__body">
            <strong className="text-primary">Image Analysis is live!</strong><br />
            Drop any diagram or photo and get an instant AI breakdown. Try it now.
          </p>
          <Link to="/image-analysis" className="panel-widget__link">Try it →</Link>
        </div>

      </aside>
    </div>
  )
}

export default Dashboard
