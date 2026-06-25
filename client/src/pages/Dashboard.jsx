import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import styles from "./styles/Dashboard.module.css";
import {
  Upload,
  CircleHelp,
  MessageSquare,
  Users,
  Image,
  FileText,
  CreditCard,
  Cpu,
  Calendar,
  LogOut,
  House,
} from "lucide-react";
import useLoader from "../ContextApi/useLoader.js";
// ── Error system imports ───────────────────────────────────────────────────────
import ErrorPage from "../errors/components/ErrorPage.jsx";
import { ERROR_TYPES, resolveErrorType } from "../errors/config/errorConfig.js";
import useErrorHandler from "../errors/hooks/useErrorHandler.jsx";

export const QUICK_ACTIONS = [
  {
    label: "Upload Material",
    icon: Upload,
    to: "/notes",
    primary: true,
  },
  {
    label: "Create Quiz",
    icon: CircleHelp,
    to: "/quiz",
    primary: false,
  },
  {
    label: "Chat with AI",
    icon: MessageSquare,
    to: "/tutor",
    primary: false,
  },
  {
    label: "Study Room",
    icon: Users,
    to: "/studyroom",
    primary: false,
  },
  {
    label: "Image Analysis",
    icon: Image,
    to: "/image-analyzer",
    primary: false,
  },
  {
    label: "PDF Analysis",
    icon: FileText,
    to: "/pdf-summary",
    primary: false,
  },
];

export const NAV_ITEMS = [
  { id: "home", icon: House, label: "Dashboard", to: "/" },
  { id: "notes", icon: Upload, label: "Upload Material", to: "/notes" },
  { id: "quiz", icon: CircleHelp, label: "Create Quiz", to: "/quiz" },
  { id: "tutor", icon: MessageSquare, label: "AI Tutor Chat", to: "/tutor" },
  {
    id: "studyroom",
    icon: Users,
    label: "Study Room",
    to: "/studyroom",
  },
  {
    id: "image-analysis",
    icon: Image,
    label: "Image Analysis",
    to: "/image-analyzer",
  },
  {
    id: "pdf-analysis",
    icon: FileText,
    label: "PDF Analysis",
    to: "/pdf-summary",
  },
  {
    id: "flashcards",
    icon: CreditCard,
    label: "Flashcards",
    to: "/flashcards",
  },
  {
    id: "scheduler",
    icon: Calendar,
    label: "Scheduler",
    to: "/scheduler",
  },
];
export const FEATURE_CARDS = [
  {
    icon: CreditCard,
    colorClass: "blue",
    title: "Flashcard Practice",
    desc: "Reinforce what you know with smart flashcard sessions built from your uploaded notes.",
    cta: "Start practicing",
    to: "/flashcards",
  },
  {
    icon: CircleHelp,
    colorClass: "purple",
    title: "Generate a Quiz",
    desc: "Turn any material into an instant quiz. Get real-time feedback on every answer.",
    cta: "Create quiz",
    to: "/quiz",
  },
  {
    icon: Image,
    colorClass: "teal",
    title: "Analyze an Image",
    desc: "Drop a diagram, chart, or handwritten page — get a full AI-powered explanation.",
    cta: "Analyze image",
    to: "/image-analyzer",
  },
  {
    icon: FileText,
    colorClass: "orange",
    title: "Break Down a PDF",
    desc: "Upload any PDF and extract key concepts, summaries, and quiz questions in seconds.",
    cta: "Analyze PDF",
    to: "/pdf-summary",
  },
  {
    icon: Cpu,
    colorClass: "pink",
    title: "AI Tutor Session",
    desc: "Ask anything. Your personal AI tutor walks you through tough concepts step by step.",
    cta: "Start session",
    to: "/tutor",
  },
  {
    icon: Calendar,
    colorClass: "green",
    title: "Plan Your Week",
    desc: "Build a smart study schedule around your exams, deadlines, and learning goals.",
    cta: "Open scheduler",
    to: "/scheduler",
  },
];

// ── Default values ─────────────────────────────────────────────────────────────
const DEFAULT_USER = { name: "", email: "", grade: "" };
const DEFAULT_QUIZ = { total: 0, lastScore: 0, avgScore: 0 };
const DEFAULT_FLASH = { total: 0, dueToday: 0 };
const DEFAULT_SCHEDULE = [];
const DEFAULT_PROFILE = {
  streak: 0,
  xp: 0,
  level: 1,
  xpPercent: 0,
  xpNextLevel: 2,
};

const TODAY_DISPLAY = new Date().toLocaleDateString("en-US", {
  weekday: "short", day: "2-digit", month: "short", year: "numeric",
});
const TODAY_ISO = new Date().toISOString().split("T")[0];

const Dashboard = () => {
  const { show, hide } = useLoader();
  const navigate = useNavigate();

  // ── Error handler hook ───────────────────────────────────────────────────────
  const { notifyError, notifySuccess } = useErrorHandler();
  const [userData, setUserData] = useState(DEFAULT_USER);
  const [userLoading, setUserLoading] = useState(true);

  // ── Blocking error state — replaces the whole page ──────────────────────────
  // null = no error | ERROR_TYPES key = show full error page
  const [pageError, setPageError] = useState(null); 

  // ── Dynamic data states ──────────────────────────────────────────────────────
  const [quizStats, setQuizStats] = useState(DEFAULT_QUIZ);
  const [flashcardStats, setFlashcardStats] = useState(DEFAULT_FLASH);
  const [scheduleItems, setScheduleItems] = useState(DEFAULT_SCHEDULE);
  const [profileStats, setProfileStats] = useState(DEFAULT_PROFILE);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    show("Fetching data…");
    setPageError(null);

    try {
      const [res, quizRes, flashRes, profileRes] = await Promise.all([
        apiFetch("/api/user/userinfo"),
        apiFetch("/api/quiz/stats"),
        apiFetch("/api/quiz/flashcards/stats"),
        apiFetch("/api/stats"),
      ]);

      if (res.status === 401) { notifyError("Session expired. Sign in again."); navigate("/login"); return; }
      if (res.status === 403) { setPageError(ERROR_TYPES.FORBIDDEN); return; }
      if (res.status >= 500) { setPageError(ERROR_TYPES.SERVER_ERROR); return; }
      if (!res.ok) { setPageError(ERROR_TYPES.UNKNOWN); return; }

      const [data, quizData, flashData, profileData] = await Promise.all([
        res.json(),
        quizRes.json(),
        flashRes.json(),
        profileRes.ok ? profileRes.json() : Promise.resolve(null),
      ]);

      setUserData({
        name: data?.data?.name ?? "",
        email: data?.data?.email ?? "",
        grade: data?.data?.grade ?? "",
      });

      setQuizStats({
        total:     quizData?.data?.total     ?? DEFAULT_QUIZ.total,
        lastScore: quizData?.data?.lastScore ?? DEFAULT_QUIZ.lastScore,
        avgScore:  quizData?.data?.avgScore  ?? DEFAULT_QUIZ.avgScore,
      });

      setFlashcardStats({
        total:    flashData?.data?.total    ?? DEFAULT_FLASH.total,
        dueToday: flashData?.data?.dueToday ?? DEFAULT_FLASH.dueToday,
      });

      setProfileStats({
        streak: profileData?.data?.streak ?? DEFAULT_PROFILE.streak,
        xp: profileData?.data?.xp ?? DEFAULT_PROFILE.xp,
        level: profileData?.data?.level ?? DEFAULT_PROFILE.level,
        xpPercent: profileData?.data?.xpPercent ?? DEFAULT_PROFILE.xpPercent,
        xpNextLevel: profileData?.data?.xpNextLevel ?? DEFAULT_PROFILE.xpNextLevel,
      });

      // ── Today's schedule (uncomment when route ready) ──────────────────────
      // const schedRes  = await fetch(`${BASE_URL}/api/schedule/today`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const schedData = await schedRes.json();
      // setScheduleItems(schedData?.data ?? DEFAULT_SCHEDULE);


    } catch (err) {
      // ── Network / TypeError (no connection) ─────────────────────────────────
      const type = resolveErrorType(err);
      console.log(err);
      
      if (type === ERROR_TYPES.NETWORK) {
        setPageError(ERROR_TYPES.NETWORK);
      } else {
        setPageError(ERROR_TYPES.UNKNOWN);
      }
    } finally {
      setUserLoading(false);
      hide();
    }
  }, [ navigate, notifyError, show, hide]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Full-page error — replaces dashboard entirely ───────────────────────────
  if (pageError) {
    return (
      <ErrorPage
        type={pageError}
        onRetry={fetchData}
      />
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────────
  const initials = useMemo(() =>
    userData.name
      ? userData.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "YOU",
    [userData.name]
  );

  return (
    <div className={styles.appShell}>
      {/* ── Main ── */}
      <main
        className={styles.main}
        role="main"
        aria-label="Dashboard content"
      >
        {/* Header */}
        <header className={styles.topBar}>
          <div className={styles.sessionIndicator}>
            <span
              className={styles.pulseDot}
              aria-hidden="true"
            >
              <span className={styles.pulseDotRing} />
              <span className={styles.pulseDotCore} />
            </span>
            <div>
              <p className={styles.sessionLabel}>Active Session</p>
              {/* {userLoading ? (
                <div
                  className={styles.skeletonHeading}
                  aria-hidden="true"
                  data-testid="skeleton-heading"
                />
              ) : (
                <h1
                  data-testid="welcome-heading"
                  className={styles.welcomeHeading}
                >
                  Welcome back,{" "}
                  <span className={styles.welcomeName}>
                    {userData.name.toUpperCase()}
                  </span>
                </h1>
              )} */}

              <h1 data-testid="welcome-heading" className={styles.welcomeHeading}>
                Welcome back,{" "}
                <span
                  className={`${styles.welcomeName} ${userLoading ? styles.welcomeNameSkeleton : ""}`}
                >
                  {userLoading ? "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" : userData.name.toUpperCase()}
                </span>
              </h1>
            </div>
          </div>
          <time
            className={styles.dateChip}
            dateTime={TODAY_ISO}
          >
            <Calendar size={14} />
            {TODAY_ISO}
          </time>
        </header>

        {/* Quick actions strip */}
        <section
          className={styles.quickStrip}
          aria-label="Quick actions"
        >
          {QUICK_ACTIONS.map(({ label, icon: Icon, to, primary }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.stripBtn} ${primary
                  ? styles.stripBtnPrimary
                  : styles.stripBtnSecondary
                }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </section>

        {/* Dashboard grid */}
        <div className={styles.dashGrid}>
          {/* AI Tutor — tall card */}
          <article className={`${styles.card} ${styles.cardTutor}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.cardIconWrap}>
              <MessageSquare
                size={18}
              />
            </div>
            <h2 className={styles.cardTitle}>AI Tutor Chat</h2>
            <p className={styles.cardDesc}>
              Get instant answers, explanations, and guided problem-solving from
              your personal AI tutor — available 24/7.
            </p>
            <div className={styles.chatPreview}>
              <div className={styles.chatBubble}>
                <div className={`${styles.chatAvatar} ${styles.chatAvatarBot}`}>
                  <Cpu
                    size={10}
                    color="var(--accent-purple)"
                  />
                </div>
                <p className={styles.chatText}>
                  "Explain the Krebs cycle in simple terms..."
                </p>
              </div>
              <div className={styles.chatBubble}>
                <div
                  className={`${styles.chatAvatar} ${styles.chatAvatarUser}`}
                >
                  <span>{initials[0]}</span>
                </div>
                <p className={`${styles.chatText} ${styles.chatTextUser}`}>
                  "Sure! The Krebs cycle is a series of..."
                </p>
              </div>
            </div>
            <div className={styles.cardBadge}>Multi LLM Powered</div>
            <Link
              to="/notebook"
              className={styles.cardCta}
            >
              Open Chat <span aria-hidden="true">→</span>
            </Link>
          </article>

          {/* Quiz card */}
          <article className={`${styles.card} ${styles.cardQuiz}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.cardRowHeader}>
              <div className={styles.cardIconGroup}>
                <div className={styles.cardIconWrap}>
                  <CircleHelp
                    size={18}
                  />
                </div>
                <div>
                  <h2 className={styles.cardTitleSm}>Create Quiz</h2>
                  <p className={styles.cardSubtitle}>
                    Auto-generate quizzes from your notes
                  </p>
                </div>
              </div>
              <span className={styles.quizBadge}>
                {quizStats.total} {quizStats.total === 1 ? "quiz" : "quizzes"}
              </span>
            </div>
            <div className={styles.quizStats}>
              <div className={styles.statBox}>
                <div className={styles.statBoxRow}>
                  <span className={styles.statLabel}>Last Score</span>
                  <span
                    className={`${styles.statValue} ${styles.statValueGreen}`}
                  >
                    {quizStats.lastScore}%
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={`${styles.progressBar} ${styles.progressBarGreen}`}
                    style={{ width: `${quizStats.lastScore}%` }}
                  />
                </div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxRow}>
                  <span className={styles.statLabel}>Avg Score</span>
                  <span
                    className={`${styles.statValue} ${styles.statValuePurple}`}
                  >
                    {quizStats.avgScore}%
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={`${styles.progressBar} ${styles.progressBarPurple}`}
                    style={{ width: `${quizStats.avgScore}%` }}
                  />
                </div>
              </div>
              <Link
                to="/quiz"
                className={styles.cardCta}
              >
                New Quiz <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          {/* Flashcards card */}
          <article className={`${styles.card} ${styles.cardFlash}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.cardIconGroup}>
              <div className={styles.cardIconWrap}>
                <CreditCard
                  size={18}
                />
              </div>
              <div>
                <h2 className={styles.cardTitleSm}>Flashcards</h2>
                <p className={styles.cardSubtitle}>
                  Spaced repetition learning
                </p>
              </div>
            </div>
            <div className={styles.flashStats}>
              <div className={styles.flashStat}>
                <span className={`${styles.flashNum} ${styles.flashNumGreen}`}>
                  {flashcardStats.total}
                </span>
                <span className={styles.flashLabel}>Cards</span>
              </div>
              <div
                className={styles.flashDivider}
                aria-hidden="true"
              />
              <div className={styles.flashStat}>
                <span className={styles.flashNum}>
                  {flashcardStats.dueToday}
                </span>
                <span className={styles.flashLabel}>Due Today</span>
              </div>
              <Link
                to="/flashcards"
                className={`${styles.cardCta} ${styles.cardCtaGreen} ${styles.flashCta}`}
              >
                Study <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          {/* Scheduler card */}
          <article className={`${styles.card} ${styles.cardScheduler}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.cardIconGroup}>
              <div className={styles.cardIconWrap}>
                <Calendar
                  size={18}
                />
              </div>
              <div>
                <h2 className={styles.cardTitleSm}>Scheduler</h2>
                <p className={styles.cardSubtitle}>Plan your study sessions</p>
              </div>
            </div>
            <ul className={styles.scheduleList}>
              {scheduleItems.length === 0 ? (
                <li className={styles.scheduleItem}>
                  <span
                    className={styles.scheduleTitle}
                    style={{ opacity: 0.5 }}
                  >
                    No sessions scheduled today
                  </span>
                </li>
              ) : (
                scheduleItems.map((item, i) => (
                  <li
                    key={item._id ?? item.title}
                    className={styles.scheduleItem}
                  >
                    <span
                      className={`${styles.scheduleDot} ${styles[`scheduleDot${item.color ?? "Purple"}`]}`}
                      aria-hidden="true"
                    />
                    <span className={styles.scheduleTitle}>{item.title}</span>
                    <time className={styles.scheduleTime}>{item.time}</time>
                  </li>
                ))
              )}
            </ul>
            <Link
              to="/scheduler"
              className={`${styles.cardCta} ${styles.cardCtaAmber}`}
            >
              View Schedule <span aria-hidden="true">→</span>
            </Link>
          </article>

          {/* Image Analysis card */}
          <article className={`${styles.card} ${styles.cardImage}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.cardIconGroup}>
              <div className={styles.cardIconWrap}>
                <Image
                  size={18}
                />
              </div>
              <div>
                <h2 className={styles.cardTitleSm}>Image Analysis</h2>
                <p className={styles.cardSubtitle}>
                  Extract insights from diagrams
                </p>
              </div>
            </div>
            <p className={styles.cardDesc}>
              Upload charts, diagrams, or handwritten notes and let AI decode
              them instantly.
            </p>
            <Link
              to="/image-analyzer"
              className={`${styles.cardCta} ${styles.cardCtaPink}`}
            >
              Analyze Image <span aria-hidden="true">→</span>
            </Link>
          </article>

          {/* PDF Analysis card */}
          <article className={`${styles.card} ${styles.cardPdf}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.cardIconGroup}>
              <div className={styles.cardIconWrap}>
                <FileText
                  size={18}
                />
              </div>
              <div>
                <h2 className={styles.cardTitleSm}>PDF Analysis</h2>
                <p className={styles.cardSubtitle}>Deep-dive into documents</p>
              </div>
            </div>
            <p className={styles.cardDesc}>
              Upload any PDF and get summaries, key points, and Q&amp;A from the
              content automatically.
            </p>
            <Link
              to="/pdf-summary"
              className={`${styles.cardCta} ${styles.cardCtaRed}`}
            >
              Analyze PDF <span aria-hidden="true">→</span>
            </Link>
          </article>

          {/* Profile card */}
          <article className={`${styles.card} ${styles.cardProfile}`}>
            <div
              className={styles.cardGlow}
              aria-hidden="true"
            />
            <div className={styles.profileTop}>
              <div
                className={styles.profileAvatar}
                aria-hidden="true"
              >
                {userLoading ? "…" : initials}
              </div>
              <div>
                {userLoading ? (
                  <>
                    <div className={styles.skeletonLine} />
                    <div
                      className={`${styles.skeletonLine} ${styles.skeletonLineSm}`}
                    />
                  </>
                ) : (
                  <>
                    <h2 className={styles.profileName}>
                      {userData.name.toUpperCase()}
                    </h2>
                    <p className={styles.profileEmail}>{userData.email}</p>
                  </>
                )}
              </div>
            </div>
            <div className={styles.profileDivider} />
            <div className={styles.profileStats}>
              <div className={styles.profileStat}>
                <span className={styles.profileStatLabel}>Grade</span>
                <span className={styles.profileStatValue}>
                  {userLoading ? "—" : userData.grade.toUpperCase() || "—"}
                </span>
              </div>
              <div className={styles.profileStat}>
                <span className={styles.profileStatLabel}>Streak</span>
                <span
                  className={`${styles.profileStatValue} ${styles.profileStatValuePurple}`}
                >
                  {profileStats.streak > 0
                    ? `${profileStats.streak} days 🔥`
                    : "—"}
                </span>
              </div>
              <div className={styles.profileStat}>
                <span className={styles.profileStatLabel}>XP</span>
                <span
                  className={`${styles.profileStatValue} ${styles.profileStatValueAmber}`}
                >
                  {profileStats.xp > 0 ? profileStats.xp.toLocaleString() : "—"}
                </span>
              </div>
            </div>
            <div className={styles.xpTrack}>
              <div
                className={styles.xpBar}
                style={{ width: `${profileStats.xpPercent}%` }}
              />
            </div>
            <div className={styles.xpLabels}>
              <span>Level {profileStats.level}</span>
              <span>
                {profileStats.xpPercent}% to Level {profileStats.xpNextLevel}
              </span>
            </div>
          </article>
        </div>

        {/* Feature cards */}
        <section
          className={styles.featureSection}
          aria-labelledby="explore-heading"
        >
          <div className={styles.sectionHeader}>
            <h2
              id="explore-heading"
              className={styles.sectionTitle}
            >
              Explore Your Tools
            </h2>
            <p className={styles.sectionSub}>
              Everything you need to learn smarter, not harder
            </p>
          </div>
          <div
            className={styles.featureGrid}
            role="list"
          >
            {FEATURE_CARDS.map(
              ({ icon: Icon, colorClass, title, desc, cta, to }) => (
                <article
                  key={to}
                  className={styles.featureCard}
                >
                  <div
                    className={`${styles.featureIcon} ${styles[`featureIcon--${colorClass}`]}`}
                    aria-hidden="true"
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureDesc}>{desc}</p>
                  <Link
                    to={to}
                    className={`${styles.featureCta} ${styles[`featureCta--${colorClass}`]}`}
                  >
                    {cta}
                  </Link>
                </article>
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
