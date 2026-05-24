import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"
import BASE_URL from "../lib/api.js"
import { useNavigate, Link } from "react-router-dom"
import styles from "../pages/styles/dashboard.module.css"
import {
  Upload01Icon,
  Quiz04Icon,
  Chat01Icon,
  MeetingRoomIcon,
  Image01Icon,
  Pdf02Icon,
  Cards01Icon,
  CpuChargeIcon,
  Calendar01Icon
} from "hugeicons-react"

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

  const QUICK_ACTIONS = [
    { label: 'Upload Material', icon: Upload01Icon, to: '/notes' },
    { label: 'Create Quiz', icon: Quiz04Icon, to: '/quiz' },
    { label: 'Chat with AI', icon: Chat01Icon, to: '/tutor' },
    { label: 'Study Room', icon: MeetingRoomIcon, to: '/studyroom' },
    { label: 'Image Analysis', icon: Image01Icon, to: '/image-analysis' },
    { label: 'PDF Analysis', icon: Pdf02Icon, to: '/pdf-analysis' },
  ];

  const FEATURE_CARDS = [
    {
      icon: Cards01Icon, colorClass: 'blue',
      title: 'Flashcard Practice',
      desc: 'Reinforce what you know with smart flashcard sessions built from your uploaded notes.',
      cta: 'Start practicing', to: '/studyroom',
    },
    {
      icon: Quiz04Icon, colorClass: 'purple',
      title: 'Generate a Quiz',
      desc: 'Turn any material into an instant quiz. Get real-time feedback on every answer.',
      cta: 'Create quiz', to: '/quiz',
    },
    {
      icon: Image01Icon, colorClass: 'teal',
      title: 'Analyze an Image',
      desc: 'Drop a diagram, chart, or handwritten page — get a full AI-powered explanation.',
      cta: 'Analyze image', to: '/image-analysis',
    },
    {
      icon: Pdf02Icon, colorClass: 'orange',
      title: 'Break Down a PDF',
      desc: 'Upload any PDF and extract key concepts, summaries, and quiz questions in seconds.',
      cta: 'Analyze PDF', to: '/pdf-analysis',
    },
    {
      icon: CpuChargeIcon, colorClass: 'pink',
      title: 'AI Tutor Session',
      desc: 'Ask anything. Your personal AI tutor walks you through tough concepts step by step.',
      cta: 'Start session', to: '/tutor',
    },
    {
      icon: Calendar01Icon, colorClass: 'green',
      title: 'Plan Your Week',
      desc: 'Build a smart study schedule around your exams, deadlines, and learning goals.',
      cta: 'Open scheduler', to: '/scheduler',
    },
  ];

  const initials = userData?.name
    ? userData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className={styles['app-shell']}>

      <main className={styles['main-content']} role="main" aria-label="Dashboard content">

        {/* Greeting banner */}
        <section className={styles['greeting-banner']} aria-label="Welcome banner">
          <div className={styles['greeting-banner__avatar']} aria-hidden="true">👋</div>
          <div className={styles['greeting-banner__text']}>
            <h1>Welcome back, {userData?.name}!</h1>
            <p>
              Ready to pick up where you left off?{' '}
              <strong>Upload a new document</strong> or jump into a{' '}
              <Link to="/studyroom"><strong>Study Room</strong></Link> session.
            </p>
          </div>
        </section>

        {/* Quick actions */}
        <section className={styles['quick-actions']} aria-labelledby="quick-actions-heading">
          <div className={styles['section-header']}>
            <div>
              <h2 id="quick-actions-heading">Quick Actions</h2>
              <p>Jump straight into any tool</p>
            </div>
          </div>

          <div className={styles['quick-actions__grid']} role="list">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
              <Link
                key={to}
                to={to}
                className={styles['quick-action-card']}
                role="listitem"
              >
                <div className={styles['quick-action-card__icon']} aria-hidden="true">
                  <Icon color='white'/>
                </div>
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Profile details */}
        <section className={styles['profile-section']} aria-labelledby="profile-heading">
          <div className={styles['section-header']}>
            <div>
              <h2 id="profile-heading">Your Profile</h2>
              <p>Your account details at a glance</p>
            </div>
          </div>

          <div className={styles['profile-card']}>
            <div className={styles['profile-card__info']}>
              <p className={styles['profile-card__label']}>Account Info</p>
              <div className={styles['profile-card__rows']}>
                <div className={styles['profile-card__row']}>
                  <span className={styles['profile-card__row-key']}>Name</span>
                  <span className={styles['profile-card__row-val']}>{userData?.name}</span>
                </div>
                <div className={styles['profile-card__row']}>
                  <span className={styles['profile-card__row-key']}>Grade</span>
                  <span className={styles['profile-card__row-val']}>{userData?.grade}</span>
                </div>
                <div className={styles['profile-card__row']}>
                  <span className={styles['profile-card__row-key']}>Email</span>
                  <span className={styles['profile-card__row-val']}>{userData?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature / activity cards */}
        <section className={styles['feature-section']} aria-labelledby="explore-heading">
          <div className={styles['section-header']}>
            <div>
              <h2 id="explore-heading">Explore Your Tools</h2>
              <p>Everything you need to learn smarter, not harder</p>
            </div>
          </div>

          <div className={styles['feature-cards-grid']} role="list">
            {FEATURE_CARDS.map(({ icon: Icon, colorClass, title, desc, cta, to }) => (
              <article key={to} className={styles['feature-card']} role="listitem">
                <div className={`${styles['feature-card__icon']} ${styles[`feature-card__icon--${colorClass}`]}`} aria-hidden="true">
                  <Icon color='white'/>
                </div>
                <h3 className={styles['feature-card__title']}>{title}</h3>
                <p className={styles['feature-card__desc']}>{desc}</p>
                <Link to={to} className={styles['feature-card__cta']}>{cta}</Link>
              </article>
            ))}
          </div>

          
        </section>

      </main>
            
    </div>
  )
}

export default Dashboard