import React, { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import './AppShell.css'

const NAV_MAIN = [
    { to: '/', label: 'Home', icon: '🏠', color: 'blue' },
    { to: '/notes', label: 'Notes', icon: '📝', color: 'teal' },
    { to: '/quiz', label: 'Quiz', icon: '⚡', color: 'purple' },
    { to: '/studyroom', label: 'Study Room', icon: '📚', color: 'green' },
    { to: '/scheduler', label: 'Scheduler', icon: '📅', color: 'orange' },
]

const NAV_AI = [
    { to: '/tutor', label: 'AI Tutor', icon: '🤖', color: 'purple' },
    { to: '/image-analysis', label: 'Image Analysis', icon: '🖼️', color: 'pink' },
    { to: '/pdf-analysis', label: 'PDF Analysis', icon: '📄', color: 'teal' },
]

const AppShell = ({ userName = '' }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U'

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="app-shell">

            {/* ── TOP BAR (static) ───────────────────────── */}
            <header className="topbar" role="banner">
                <div className="topbar__left">
                    <button className="topbar__icon-btn" aria-label="Search">🔍</button>
                    <button className="topbar__icon-btn" aria-label="Collapse sidebar">◀</button>
                </div>

                <button className="topbar__upgrade-btn" aria-label="Upgrade to premium">
                    ⬆ Upgrade
                </button>

                <div
                    className="topbar__avatar"
                    role="img"
                    aria-label={`User avatar for ${userName}`}
                >
                    {initials}
                </div>
            </header>

            {/* ── SIDEBAR (static) ──────────────────────── */}
            <aside className="sidebar" role="navigation" aria-label="Main navigation">
                <Link to="/" className="sidebar__logo" aria-label="SPARK.E home">
                    <div className="sidebar__logo-icon" aria-hidden="true">✦</div>
                    <div className="sidebar__logo-text">SPARK<span>.E</span></div>
                </Link>

                <nav className="sidebar__nav">
                    <span className="sidebar__section-label">Main</span>

                    {NAV_MAIN.map(({ to, label, icon, color }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`sidebar__link${location.pathname === to ? ' active' : ''}`}
                            data-color={color}
                        >
                            <span className="sidebar__link-icon" aria-hidden="true">{icon}</span>
                            {label}
                        </Link>
                    ))}

                    <span className="sidebar__section-label">AI Tools</span>

                    {NAV_AI.map(({ to, label, icon, color }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`sidebar__link${location.pathname === to ? ' active' : ''}`}
                            data-color={color}
                        >
                            <span className="sidebar__link-icon" aria-hidden="true">{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar__footer">
                    <button className="sidebar__logout-btn" onClick={handleLogout} aria-label="Log out">
                        <span aria-hidden="true">🚪</span>
                        Log out
                    </button>
                </div>
            </aside>

            {/* ── PAGE CONTENT (swaps on navigation) ────── */}
            <main className="main-content">
                <Outlet />
            </main>

        </div>
    )
}

export default AppShell