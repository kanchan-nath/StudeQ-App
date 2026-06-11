import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from "./appShell.module.css";
import {
  Home03Icon,
  NoteEditIcon,
  Quiz03Icon,
  Cards02Icon,
  Book01Icon,
  Calendar03Icon,
  Notebook01Icon,
  TeachingIcon,
  SearchList01Icon,
  Pdf02Icon,
  Logout02Icon,
  CashbackIcon,
  StarsIcon,
} from "hugeicons-react";
import { disConnectSocket } from "../../lib/socket.js";

const NAV_MAIN = [
  { to: "/dashboard", label: "Home", icon: Home03Icon, color: "blue" },
  { to: "/notes", label: "Notes", icon: NoteEditIcon, color: "teal" },
  { to: "/quiz", label: "Quiz", icon: Quiz03Icon, color: "purple" },
  {
    to: "/flashcards",
    label: "Flashcards",
    icon: Cards02Icon,
    color: "purple",
  },
  {
    to: "/event-scheduling",
    label: "Event",
    icon: Book01Icon,
    color: "green",
  },
  // {
  //   to: "/study-room",
  //   label: "Study Room",
  //   icon: Book01Icon,
  //   color: "green",
  // },
  {
    to: "/search",
    label: "Search",
    icon: Calendar03Icon,
    color: "orange",
  },
  {
    to: "/time-table",
    label: "Time Table",
    icon: Calendar03Icon,
    color: "orange",
  },
  {
    to: "/event-scheduling/assignments",
    label: " Assignment",
    icon: Calendar03Icon,
    color: "orange",
  },
  {
    to: "/event-scheduling/projects",
    label: "Schedule Project",
    icon: Calendar03Icon,
    color: "orange",
  },
  {
    to: "/event-scheduling/exams",
    label: "Exam Schedule",
    icon: Calendar03Icon,
    color: "orange",
  },
  { to: "/notebook", label: "Notebook", icon: Notebook01Icon, color: "blue" },
];

const NAV_AI = [
  { to: "/tutor", label: "AI Tutor", icon: TeachingIcon, color: "purple" },
  {
    to: "/image-analysis",
    label: "Image Analysis",
    icon: SearchList01Icon,
    color: "pink",
  },
  {
    to: "/pdf-analysis",
    label: "PDF Analysis",
    icon: Pdf02Icon,
    color: "teal",
  },
];

const AppShell = ({ userName = "" }) => {
  const [isDark, setIsDark] = useState(() => {
    return (localStorage.getItem("sparke-theme") ?? "dark") === "dark";
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPanelOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const initials = userName
    ? userName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "KN";

  const handleLogout = (e) => {
    e.preventDefault();
    disConnectSocket();
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sparke-theme", theme);
  }, [isDark]);
  
  return (
    <div
      className={`${styles["app-shell"]}${panelOpen ? ` ${styles["app-shell--panel-open"]}` : ""}`}
    >
      {/* ── TOP BAR ── */}
      <header className={styles.topbar} role="banner">
        <div className={styles["topbar__left"]} />

        <button
          className={styles["topbar__upgrade-btn"]}
          aria-label="Upgrade to premium"
        >
          <CashbackIcon /> Upgrade
        </button>

        {/* ── THEME TOGGLE ── */}
        <button
          className={styles["topbar__theme-toggle"]}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setIsDark((prev) => !prev)}
        >
          {isDark ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div
          className={styles["topbar__avatar"]}
          role="img"
          aria-label={`User avatar for ${userName}`}
        >
          {initials}
        </div>
      </header>

      {/* ── LEFT SIDEBAR ── */}
      <aside
        className={styles.sidebar}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className={styles["sidebar__logo"]}
          aria-label="SPARK.E home"
        >
          <div className={styles["sidebar__logo-text"]}>
            SPARK<span>.E</span>
          </div>
        </Link>

        <nav className={styles["sidebar__nav"]}>
          <span className={styles["sidebar__section-label"]}>Main</span>

          {NAV_MAIN.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className={`${styles["sidebar__link"]}${location.pathname === to ? ` ${styles.active}` : ""}`}
              data-color={color}
            >
              <span
                className={styles["sidebar__link-icon"]}
                aria-hidden="true"
              >
                <Icon
                  size={20}
                  color="white"
                />
              </span>
              {label}
            </Link>
          ))}

          <span className={styles["sidebar__section-label"]}>AI Tools</span>

          {NAV_AI.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className={`${styles["sidebar__link"]}${location.pathname === to ? ` ${styles.active}` : ""}`}
              data-color={color}
            >
              <span
                className={styles["sidebar__link-icon"]}
                aria-hidden="true"
              >
                <Icon
                  size={20}
                  color="white"
                />
              </span>
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles["sidebar__footer"]}>
          <button
            className={styles["sidebar__logout-btn"]}
            onClick={handleLogout}
            aria-label="Log out"
          >
            <span aria-hidden="true">
              <Logout02Icon />
            </span>
            Log out
          </button>
        </div>
      </aside>

      {/* ── RIGHT SIDEBAR ── */}
      <aside
        className={`${styles["right-panel"]}${panelOpen ? ` ${styles["right-panel--open"]}` : ""}`}
        role="complementary"
        aria-label="Sidebar widgets"
      >
        {/* Close button */}
        <button
          className={styles["panel-close-btn"]}
          onClick={() => setPanelOpen(false)}
          aria-label="Close panel"
        >
          ✕
        </button>

        <div className={styles["upgrade-card"]}>
          <div className={styles["upgrade-card__header"]}>
            <div
              className={styles["upgrade-card__badge"]}
              aria-hidden="true"
            >
              <StarsIcon />
            </div>
            <h3 className={styles["upgrade-card__title"]}>Go Premium</h3>
          </div>
          <p className={styles["upgrade-card__desc"]}>
            Unlock unlimited AI sessions, advanced PDF analysis, priority tutor
            access, and your full study history.
          </p>
          <button className={styles["upgrade-card__btn"]}>
            <CashbackIcon />
            Upgrade now
          </button>
        </div>

        <div
          className={styles["panel-widget"]}
          aria-labelledby="upcoming-heading"
        >
          <h3
            className={styles["panel-widget__title"]}
            id="upcoming-heading"
          >
            📅 Upcoming
          </h3>
          <p className={styles["panel-widget__body"]}>
            No exams scheduled yet. Add a deadline to get a personalized study
            plan.
          </p>
          <Link
            to="/scheduler"
            className={styles["panel-widget__link"]}
          >
            Add exam date →
          </Link>
        </div>

        <div
          className={`${styles["panel-widget"]} ${styles["streak-widget"]}`}
          role="status"
          aria-label="Current study streak"
        >
          <div className={styles["streak-widget__left"]}>
            <span aria-hidden="true">🔥</span>
            1-day streak!
          </div>
          <Link
            to="/"
            className={styles["streak-widget__link"]}
          >
            Leaderboard →
          </Link>
        </div>

        <div
          className={styles["panel-widget"]}
          aria-labelledby="announce-heading"
        >
          <h3
            className={styles["panel-widget__title"]}
            id="announce-heading"
          >
            🎉 What's New
          </h3>
          <p className={styles["panel-widget__body"]}>
            <strong className={styles["text-primary"]}>
              Image Analysis is live!
            </strong>
            <br />
            Drop any diagram or photo and get an instant AI breakdown. Try it
            now.
          </p>
          <Link
            to="/image-analysis"
            className={styles["panel-widget__link"]}
          >
            Try it →
          </Link>
        </div>
      </aside>

      {/* ── PAGE CONTENT ── */}
      <main className={styles["main-content"]}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
