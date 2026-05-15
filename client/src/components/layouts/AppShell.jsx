import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import styles from './appShell.module.css'

const NAV_MAIN = [
    { to: '/dashboard', label: 'Home', icon: '🏠', color: 'blue' },
    { to: '/notes', label: 'Notes', icon: '📝', color: 'teal' },
    { to: '/quiz', label: 'Quiz', icon: '⚡', color: 'purple' },
    { to: '/flashcards', label: 'Flashcards', icon: '⚡', color: 'purple' },
    { to: '/study-room', label: 'Study Room', icon: '📚', color: 'green' },
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

    const [panelOpen, setPanelOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setPanelOpen(true), 2500)
        return () => clearTimeout(timer)
    }, [])

    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'KN'

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className={styles['app-shell']}>

            {/* ── TOP BAR ── */}
            <header className={styles.topbar} role="banner">
                <div className={styles['topbar__left']}>
                    <button className={styles['topbar__icon-btn']} aria-label="Search">🔍</button>
                    <button className={styles['topbar__icon-btn']} aria-label="Collapse sidebar">◀</button>
                </div>

                <button className={styles['topbar__upgrade-btn']} aria-label="Upgrade to premium">
                    ⬆ Upgrade
                </button>

                <div
                    className={styles['topbar__avatar']}
                    role="img"
                    aria-label={`User avatar for ${userName}`}
                >
                    {initials}
                </div>
            </header>

            {/* ── LEFT SIDEBAR ── */}
            <aside className={styles.sidebar} role="navigation" aria-label="Main navigation">
                <Link to="/" className={styles['sidebar__logo']} aria-label="SPARK.E home">
                    <div className={styles['sidebar__logo-icon']} aria-hidden="true">✦</div>
                    <div className={styles['sidebar__logo-text']}>SPARK<span>.E</span></div>
                </Link>

                <nav className={styles['sidebar__nav']}>
                    <span className={styles['sidebar__section-label']}>Main</span>

                    {NAV_MAIN.map(({ to, label, icon, color }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${styles['sidebar__link']}${location.pathname === to ? ` ${styles.active}` : ''}`}
                            data-color={color}
                        >
                            <span className={styles['sidebar__link-icon']} aria-hidden="true">{icon}</span>
                            {label}
                        </Link>
                    ))}

                    <span className={styles['sidebar__section-label']}>AI Tools</span>

                    {NAV_AI.map(({ to, label, icon, color }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${styles['sidebar__link']}${location.pathname === to ? ` ${styles.active}` : ''}`}
                            data-color={color}
                        >
                            <span className={styles['sidebar__link-icon']} aria-hidden="true">{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className={styles['sidebar__footer']}>
                    <button className={styles['sidebar__logout-btn']} onClick={handleLogout} aria-label="Log out">
                        <span aria-hidden="true">🚪</span>
                        Log out
                    </button>
                </div>
            </aside>

            {/* ── RIGHT SIDEBAR ── */}
            <aside
                className={`${styles['right-panel']}${panelOpen ? ` ${styles['right-panel--open']}` : ''}`}
                role="complementary"
                aria-label="Sidebar widgets"
            >
                {/* Close button */}
                <button
                    className={styles['panel-close-btn']}
                    onClick={() => setPanelOpen(false)}
                    aria-label="Close panel"
                >
                    ✕
                </button>

                <div className={styles['upgrade-card']}>
                    <div className={styles['upgrade-card__header']}>
                        <div className={styles['upgrade-card__badge']} aria-hidden="true">⭐</div>
                        <h3 className={styles['upgrade-card__title']}>Go Premium</h3>
                    </div>
                    <p className={styles['upgrade-card__desc']}>
                        Unlock unlimited AI sessions, advanced PDF analysis, priority tutor access,
                        and your full study history.
                    </p>
                    <button className={styles['upgrade-card__btn']}>Upgrade now</button>
                </div>

                <div className={styles['panel-widget']} aria-labelledby="upcoming-heading">
                    <h3 className={styles['panel-widget__title']} id="upcoming-heading">
                        📅 Upcoming
                    </h3>
                    <p className={styles['panel-widget__body']}>
                        No exams scheduled yet. Add a deadline to get a personalized study plan.
                    </p>
                    <Link to="/scheduler" className={styles['panel-widget__link']}>Add exam date →</Link>
                </div>

                <div className={`${styles['panel-widget']} ${styles['streak-widget']}`} role="status" aria-label="Current study streak">
                    <div className={styles['streak-widget__left']}>
                        <span aria-hidden="true">🔥</span>
                        1-day streak!
                    </div>
                    <Link to="/" className={styles['streak-widget__link']}>Leaderboard →</Link>
                </div>

                <div className={styles['panel-widget']} aria-labelledby="announce-heading">
                    <h3 className={styles['panel-widget__title']} id="announce-heading">
                        🎉 What's New
                    </h3>
                    <p className={styles['panel-widget__body']}>
                        <strong className={styles['text-primary']}>Image Analysis is live!</strong><br />
                        Drop any diagram or photo and get an instant AI breakdown. Try it now.
                    </p>
                    <Link to="/image-analysis" className={styles['panel-widget__link']}>Try it →</Link>
                </div>

            </aside>

            {/* ── PAGE CONTENT ── */}
            <main className={styles['main-content']}>
                <Outlet />
            </main>

        </div>
    )
}

export default AppShell