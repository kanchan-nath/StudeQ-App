import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/EventScheduling.module.css";
import BASE_URL from "../lib/api.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "ti-layout-dashboard", label: "Dashboard", path: "/dashboard" },
  {
    icon: "ti-file-description",
    label: "Exams",
    path: "/event-scheduling/exams",
  },
  { icon: "ti-briefcase", label: "Projects", path: "/projects" },
  { icon: "ti-checklist", label: "Assignments", path: "/assignments" },
  { icon: "ti-calendar", label: "Calendar", path: "/calendar" },
  { icon: "ti-settings", label: "Settings", path: "/settings" },
];

const SUBJECT_COLORS = {
  DS: {
    base: "#4f6ef7",
    ramp: [
      "#1a1f3c",
      "#232d5c",
      "#2e3d7f",
      "#3a4fa3",
      "#4f6ef7",
      "#7f9bff",
      "#b3c3ff",
    ],
  },
  Algo: {
    base: "#7c3aed",
    ramp: [
      "#1e1230",
      "#2d1a4a",
      "#3d2266",
      "#522e88",
      "#7c3aed",
      "#9f6ef5",
      "#c8aafa",
    ],
  },
  DB: {
    base: "#10b981",
    ramp: [
      "#051f14",
      "#083024",
      "#0c4632",
      "#0e6044",
      "#10b981",
      "#34d399",
      "#6ee7b7",
    ],
  },
  OS: {
    base: "#f59e0b",
    ramp: [
      "#2a1b02",
      "#3d2804",
      "#574009",
      "#7a5a10",
      "#f59e0b",
      "#fbbf24",
      "#fde68a",
    ],
  },
};

const DAY_ABBRS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const toDateObj = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
};

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getEventStatus = (item, type) => {
  const now = new Date();
  const dateStr =
    type === "exam"
      ? item.examDate
      : type === "project"
        ? item.submissionDate
        : item.dueDate;
  const d = toDateObj(dateStr);
  if (!d) return "upcoming";
  if (item.status === "completed" || item.submissionStatus === "submitted")
    return "done";
  if (d < now) return "urgent";
  const diff = (d - now) / (1000 * 60 * 60 * 24);
  if (diff <= 2) return "urgent";
  return type === "exam" ? "class" : "upcoming";
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatCardSkeleton = () => (
  <div
    className={`${styles.statCard} ${styles.blue}`}
    style={{ pointerEvents: "none" }}
  >
    <div className={styles.statCardTop}>
      <div
        className={`${styles.skeleton} ${styles.skeletonCount}`}
        style={{ width: 34, height: 34, borderRadius: 6 }}
      />
    </div>
    <div className={`${styles.skeleton} ${styles.skeletonCount}`} />
    <div
      className={`${styles.skeleton} ${styles.skeletonText}`}
      style={{ marginBottom: 8 }}
    />
    <div className={`${styles.skeleton} ${styles.skeletonTextSm}`} />
  </div>
);

const HeatmapCell = ({ subject, week, value }) => {
  const [show, setShow] = useState(false);
  const colorRamp = SUBJECT_COLORS[subject]?.ramp || [];
  const idx =
    value === 0
      ? 0
      : Math.min(Math.floor(value * 1.2) + 2, colorRamp.length - 1);
  const bg = value === 0 ? "var(--bg-surface-3)" : colorRamp[idx];

  return (
    <div
      className={styles.heatmapCell}
      style={{ background: bg }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {show && (
        <div className={styles.tooltip}>
          {subject} · W{week + 1} · {value}h
        </div>
      )}
    </div>
  );
};

// ─── Donut Chart (Chart.js) ────────────────────────────────────────────────────

const DonutChart = ({ exams, projects, assignments }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const loadChart = () => {
      if (!window.Chart) return;
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(el, {
        type: "doughnut",
        data: {
          labels: [
            "Data Struct.",
            "Algorithms",
            "Databases",
            "Op. Systems",
            "Essays",
          ],
          datasets: [
            {
              data: [30, 25, 20, 15, 10],
              backgroundColor: [
                "#4f6ef7",
                "#7c3aed",
                "#10b981",
                "#f59e0b",
                "#4b5563",
              ],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          cutout: "68%",
          responsive: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed}% credit hrs`,
              },
              backgroundColor: "#1c2333",
              titleColor: "#e6edf3",
              bodyColor: "#8b949e",
              borderColor: "rgba(48,54,61,0.9)",
              borderWidth: 1,
            },
          },
        },
      });
    };
    if (window.Chart) {
      loadChart();
    } else {
      const script = document.querySelector('script[src*="chart.js"]');
      if (script) script.addEventListener("load", loadChart);
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  const legendItems = [
    { label: "Data Struct.", pct: 30, color: "#4f6ef7" },
    { label: "Algorithms", pct: 25, color: "#7c3aed" },
    { label: "Databases", pct: 20, color: "#10b981" },
    { label: "Op. Systems", pct: 15, color: "#f59e0b" },
    { label: "Essays", pct: 10, color: "#4b5563" },
  ];

  return (
    <>
      <div className={styles.donutWrap}>
        <canvas
          ref={canvasRef}
          width={100}
          height={100}
          className={styles.donutCanvas}
        />
        <div className={styles.donutLegend}>
          {legendItems.map((item) => (
            <div
              key={item.label}
              className={styles.donutLegendItem}
            >
              <span
                className={styles.donutDot}
                style={{ background: item.color }}
              />
              <span>{item.label}</span>
              <span className={styles.donutPercent}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.chartNote}>Subject load · Credit hrs this sem.</p>
    </>
  );
};

// ─── Mini Calendar ─────────────────────────────────────────────────────────────

const MiniCalendar = ({ exams, projects, assignments }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];

  const examDates = exams.map((e) => toDateObj(e.examDate)).filter(Boolean);
  const projectDates = projects
    .map((p) => toDateObj(p.submissionDate))
    .filter(Boolean);
  const assignmentDates = assignments
    .map((a) => toDateObj(a.dueDate))
    .filter(Boolean);

  const getDotsForDay = (d) => {
    const dots = [];
    if (examDates.some((e) => isSameDay(e, d))) dots.push("exam");
    if (projectDates.some((p) => isSameDay(p, d))) dots.push("due");
    if (assignmentDates.some((a) => isSameDay(a, d))) dots.push("done");
    return dots;
  };

  // prev month padding
  const prevDays = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevDays - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  return (
    <div className={styles.calendarWrap}>
      <div className={styles.calendarNav}>
        <button
          className={styles.calNavBtn}
          onClick={prevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.calMonthLabel}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          className={styles.calNavBtn}
          onClick={nextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className={styles.calGrid}>
        {DAY_ABBRS.map((d) => (
          <div
            key={d}
            className={styles.calDayHeader}
          >
            {d[0]}
          </div>
        ))}
        {cells.map((cell, i) => {
          const date = cell.current
            ? new Date(viewYear, viewMonth, cell.day)
            : null;
          const isToday = date && isSameDay(date, today);
          const dots = date ? getDotsForDay(date) : [];
          return (
            <div
              key={i}
              className={[
                styles.calCell,
                !cell.current ? styles.otherMonth : "",
                isToday ? styles.today : "",
              ].join(" ")}
            >
              <span>{cell.day}</span>
              {dots.length > 0 && !isToday && (
                <div className={styles.calDots}>
                  {dots.slice(0, 3).map((t, j) => (
                    <span
                      key={j}
                      className={`${styles.calDot} ${styles[t]}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.calLegend}>
        <div className={styles.calLegendItem}>
          <span className={`${styles.calDot} ${styles.exam}`} />
          Exam
        </div>
        <div className={styles.calLegendItem}>
          <span className={`${styles.calDot} ${styles.due}`} />
          Due
        </div>
        <div className={styles.calLegendItem}>
          <span className={`${styles.calDot} ${styles.done}`} />
          Done
        </div>
      </div>
    </div>
  );
};

// ─── Heatmap Placeholder (TODO: wire to study session API) ────────────────────

const HEATMAP_DATA = {
  DS: [2, 3, 4, 2, 3],
  Algo: [1, 2, 3, 4, 2],
  DB: [3, 1, 2, 3, 1],
  OS: [0, 2, 1, 2, 3],
};

const StudyHeatmap = () => (
  <div className={styles.heatmapWrap}>
    <div className={styles.heatmapWeekHeaders}>
      {["W1", "W2", "W3", "W4", "W5"].map((w) => (
        <div
          key={w}
          className={styles.heatmapWeekLabel}
        >
          {w}
        </div>
      ))}
    </div>
    {Object.entries(HEATMAP_DATA).map(([subject, weeks]) => (
      <div
        key={subject}
        className={styles.heatmapRow}
      >
        <span className={styles.heatmapLabel}>{subject}</span>
        <div className={styles.heatmapCells}>
          {weeks.map((val, wi) => (
            <HeatmapCell
              key={wi}
              subject={subject}
              week={wi}
              value={val}
            />
          ))}
        </div>
      </div>
    ))}
    {/* TODO: Replace HEATMAP_DATA with GET /api/study-sessions/heatmap once endpoint is ready */}
  </div>
);

// ─── Priority + Streak Placeholder (TODO: wire to AI + streak API) ────────────

const PriorityStreak = ({ exams }) => {
  // Derive top priority from nearest upcoming exam
  // TODO: Replace with GET /api/ai/suggested-task once endpoint is ready
  const now = new Date();
  const upcoming = exams
    .map((e) => ({ ...e, d: toDateObj(e.examDate) }))
    .filter((e) => e.d && e.d > now)
    .sort((a, b) => a.d - b.d);
  const top = upcoming[0] || null;
  const daysLeft = top
    ? Math.ceil((top.d - now) / (1000 * 60 * 60 * 24))
    : null;

  // TODO: Replace with GET /api/study-sessions/streak once endpoint is ready
  const mockStreak = [true, true, true, false, true, false, false];
  const streakCount = 3;

  return (
    <>
      <div className={styles.priorityCard}>
        <div className={styles.priorityCardHeader}>
          <span className={styles.urgencyChip}>⚡ High</span>
          <span className={styles.aiBadge}>AI suggested</span>
        </div>
        {top ? (
          <>
            <p className={styles.priorityDeadline}>
              {daysLeft === 1
                ? "Due tomorrow"
                : daysLeft
                  ? `${daysLeft} days left`
                  : "Due soon"}
            </p>
            <p className={styles.priorityName}>
              {top.subjectName || "Exam Prep"}
            </p>
            <p className={styles.priorityDesc}>
              {top.venue ? `${top.venue} · ` : ""}
              {top.subjectCode || "Revise key topics before exam"}
            </p>
          </>
        ) : (
          <>
            <p className={styles.priorityDeadline}>No upcoming exams</p>
            <p className={styles.priorityName}>Stay ahead</p>
            <p className={styles.priorityDesc}>
              Review your weakest subject today.
            </p>
          </>
        )}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: "42%" }}
          />
          {/* TODO: Wire progress to real session data */}
        </div>
      </div>

      <div className={styles.streakSection}>
        <div className={styles.streakHeader}>
          <div>
            <span className={styles.streakCount}>{streakCount}</span>
            <span className={styles.streakLabel}> day streak</span>
          </div>
          <span className={styles.streakMotivation}>Keep it up!</span>
        </div>
        <div className={styles.streakDays}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              className={styles.streakDay}
            >
              <span className={styles.streakDayLabel}>{d}</span>
              <div
                className={`${styles.streakPill} ${mockStreak[i] ? styles.studied : ""}`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const EventScheduling = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("/event-scheduling");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [eRes, aRes, pRes] = await Promise.all([
        fetch(`${BASE_URL}/api/scheduler/exam-dates`, {
          headers: authHeaders(),
        }),
        fetch(`${BASE_URL}/api/scheduler/assignment-submission`, {
          headers: authHeaders(),
        }),
        fetch(`${BASE_URL}/api/scheduler/project-submission`, {
          headers: authHeaders(),
        }),
      ]);
      const [eData, aData, pData] = await Promise.all([
        eRes.ok ? eRes.json() : { data: [] },
        aRes.ok ? aRes.json() : { data: [] },
        pRes.ok ? pRes.json() : { data: [] },
      ]);
      setExams(eData.data || []);
      setAssignments(aData.data || []);
      setProjects(pData.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const now = new Date();

  const upcomingExams = exams.filter((e) => {
    const d = toDateObj(e.examDate);
    return d && d > now && e.status !== "completed";
  });

  const nextExamDays = (() => {
    const sorted = [...upcomingExams].sort(
      (a, b) => toDateObj(a.examDate) - toDateObj(b.examDate),
    );
    if (!sorted.length) return null;
    return Math.ceil(
      (toDateObj(sorted[0].examDate) - now) / (1000 * 60 * 60 * 24),
    );
  })();

  const pendingProjects = projects.filter(
    (p) => p.phase !== "submitted" && p.phase !== "completed",
  );
  const projectsDueThisWeek = projects.filter((p) => {
    const d = toDateObj(p.submissionDate);
    const { monday, sunday } = getWeekRange();
    return d && d >= monday && d <= sunday;
  });

  const dueAssignments = assignments.filter((a) => {
    const d = toDateObj(a.dueDate);
    return d && a.submissionStatus !== "submitted";
  });
  const overdueAssignments = dueAssignments.filter(
    (a) => toDateObj(a.dueDate) < now,
  );

  const completedAssignments = assignments.filter(
    (a) => a.submissionStatus === "submitted",
  );
  const completedThisWeek = completedAssignments.filter((a) => {
    const d = toDateObj(a.submittedAt);
    const { monday, sunday } = getWeekRange();
    return d && d >= monday && d <= sunday;
  });

  // ── Week schedule: merge all 3 sources, filter current week ───────────────
  const { monday, sunday } = getWeekRange();

  const scheduleItems = [
    ...exams.map((e) => ({
      date: toDateObj(e.examDate),
      name: e.subjectName,
      meta: `${formatTime(e.examTime)}${e.venue ? " · " + e.venue : ""}${e.duration ? " · " + e.duration + " min" : ""}`,
      status: getEventStatus(e, "exam"),
      type: "exam",
    })),
    ...projects.map((p) => ({
      date: toDateObj(p.submissionDate),
      name: p.projectTitle,
      meta: `${p.phase ? "Phase: " + p.phase : "Submission deadline"}`,
      status: getEventStatus(p, "project"),
      type: "project",
    })),
    ...assignments.map((a) => ({
      date: toDateObj(a.dueDate),
      name: `Assignment due`,
      meta: `Due ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : ""}${a.allowLateSubmission ? " · Late ok" : ""}`,
      status: getEventStatus(a, "assignment"),
      type: "assignment",
    })),
  ]
    .filter((item) => item.date && item.date >= monday && item.date <= sunday)
    .sort((a, b) => a.date - b.date)
    .slice(0, 7);

  // ── Activity table: all items sorted by date desc ─────────────────────────
  const activityRows = [
    ...exams.map((e) => ({
      subject: e.subjectName,
      type: "Exam",
      date: e.examDate,
      status: getEventStatus(e, "exam"),
      id: e._id,
      route: `/exams`,
    })),
    ...projects.map((p) => ({
      subject: p.projectTitle,
      type: "Project",
      date: p.submissionDate,
      status: getEventStatus(p, "project"),
      id: p._id,
      route: `/projects`,
    })),
    ...assignments.map((a) => ({
      subject: "Assignment",
      type: "Assignment",
      date: a.dueDate,
      status: getEventStatus(a, "assignment"),
      id: a._id,
      route: `/assignments`,
    })),
  ]
    .filter((r) => r.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const statusBadgeClass = (s) => {
    if (s === "urgent") return styles.badge + " " + styles.urgent;
    if (s === "done") return styles.badge + " " + styles.done;
    if (s === "class") return styles.badge + " " + styles.class;
    return styles.badge + " " + styles.upcoming;
  };

  const statusLabel = (s) => {
    if (s === "urgent") return "Urgent";
    if (s === "done") return "Done";
    if (s === "class") return "Exam";
    return "Upcoming";
  };

  const handleExport = () => {
    const rows = [
      ["Subject", "Type", "Date", "Status"],
      ...activityRows.map((r) => [r.subject, r.type, r.date, r.status]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Inject Chart.js once */}
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"
        async
      />

      <div className={styles.shell}>
        {/* ── Main ── */}
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Schedule Your Events</h1>
            <p className={styles.pageSubtitle}>
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* ── Stat Cards ── */}
          <div className={styles.statsGrid}>
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <div
                  className={`${styles.statCard} ${styles.blue}`}
                  onClick={() => navigate("/exams?filter=upcoming")}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate("/exams?filter=upcoming")
                  }
                >
                  <div className={styles.statCardTop}>
                    <div className={`${styles.statIconBlock} ${styles.blue}`}>
                      <i
                        className="ti ti-file-description"
                        aria-hidden="true"
                      />
                    </div>
                    <i
                      className={`ti ti-arrow-up-right ${styles.statArrow}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={styles.statCount}>{upcomingExams.length}</div>
                  <div className={styles.statLabel}>Upcoming Exams</div>
                  <div className={`${styles.statHint} ${styles.blue}`}>
                    {nextExamDays !== null
                      ? `Next in ${nextExamDays} day${nextExamDays !== 1 ? "s" : ""}`
                      : "No upcoming exams"}
                  </div>
                </div>

                <div
                  className={`${styles.statCard} ${styles.amber}`}
                  onClick={() =>
                    navigate("/projects?filter=pending-submission")
                  }
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate("/projects?filter=pending-submission")
                  }
                >
                  <div className={styles.statCardTop}>
                    <div className={`${styles.statIconBlock} ${styles.amber}`}>
                      <i
                        className="ti ti-briefcase"
                        aria-hidden="true"
                      />
                    </div>
                    <i
                      className={`ti ti-arrow-up-right ${styles.statArrow}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={styles.statCount}>
                    {pendingProjects.length}
                  </div>
                  <div className={styles.statLabel}>Pending Submissions</div>
                  <div className={`${styles.statHint} ${styles.amber}`}>
                    {projectsDueThisWeek.length > 0
                      ? `${projectsDueThisWeek.length} due this week`
                      : "None this week"}
                  </div>
                </div>

                <div
                  className={`${styles.statCard} ${styles.red}`}
                  onClick={() => navigate("/assignments?filter=due")}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate("/assignments?filter=due")
                  }
                >
                  <div className={styles.statCardTop}>
                    <div className={`${styles.statIconBlock} ${styles.red}`}>
                      <i
                        className="ti ti-clock"
                        aria-hidden="true"
                      />
                    </div>
                    <i
                      className={`ti ti-arrow-up-right ${styles.statArrow}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={styles.statCount}>
                    {dueAssignments.length}
                  </div>
                  <div className={styles.statLabel}>Due Assignments</div>
                  <div className={`${styles.statHint} ${styles.red}`}>
                    {overdueAssignments.length > 0
                      ? `${overdueAssignments.length} overdue`
                      : "None overdue"}
                  </div>
                </div>

                <div
                  className={`${styles.statCard} ${styles.green}`}
                  onClick={() => navigate("/assignments?filter=completed")}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate("/assignments?filter=completed")
                  }
                >
                  <div className={styles.statCardTop}>
                    <div className={`${styles.statIconBlock} ${styles.green}`}>
                      <i
                        className="ti ti-circle-check"
                        aria-hidden="true"
                      />
                    </div>
                    <i
                      className={`ti ti-arrow-up-right ${styles.statArrow}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={styles.statCount}>
                    {completedAssignments.length}
                  </div>
                  <div className={styles.statLabel}>Completed</div>
                  <div className={`${styles.statHint} ${styles.green}`}>
                    {completedThisWeek.length > 0
                      ? `+${completedThisWeek.length} this week`
                      : "Keep going!"}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Schedule + Calendar ── */}
          <div className={styles.midSection}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>This week's schedule</h2>
                <button
                  className={styles.viewAll}
                  onClick={() => navigate("/calendar")}
                >
                  View all{" "}
                  <i
                    className="ti ti-arrow-right"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className={styles.scheduleList}>
                {loading ? (
                  <div className={styles.emptyState}>Loading schedule…</div>
                ) : scheduleItems.length === 0 ? (
                  <div className={styles.emptyState}>No events this week</div>
                ) : (
                  scheduleItems.map((item, i) => (
                    <div
                      key={i}
                      className={styles.scheduleRow}
                    >
                      <div className={styles.scheduleDay}>
                        <span className={styles.scheduleDayAbbr}>
                          {DAY_ABBRS[item.date.getDay()]}
                        </span>
                        <span className={styles.scheduleDayNum}>
                          {item.date.getDate()}
                        </span>
                      </div>
                      <div
                        className={`${styles.scheduleBar} ${styles[item.status]}`}
                      />
                      <div className={styles.scheduleInfo}>
                        <div className={styles.scheduleName}>{item.name}</div>
                        <div className={styles.scheduleMeta}>{item.meta}</div>
                      </div>
                      <span className={statusBadgeClass(item.status)}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Calendar</h2>
              </div>
              <MiniCalendar
                exams={exams}
                projects={projects}
                assignments={assignments}
              />
            </div>
          </div>

          {/* ── Focus Insights ── */}
          <div className={styles.insightsGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Study heatmap</h2>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <StudyHeatmap />
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Subject load</h2>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <DonutChart
                  exams={exams}
                  projects={projects}
                  assignments={assignments}
                />
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Priority & streak</h2>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <PriorityStreak exams={exams} />
              </div>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div className={`${styles.panel} ${styles.activityPanel}`}>
            <div className={styles.activityHeader}>
              <h2 className={styles.panelTitle}>Recent activity</h2>
              <button
                className={styles.exportBtn}
                onClick={handleExport}
              >
                <i
                  className="ti ti-download"
                  aria-hidden="true"
                />
                Export
              </button>
            </div>
            {loading ? (
              <div className={styles.emptyState}>Loading activity…</div>
            ) : activityRows.length === 0 ? (
              <div className={styles.emptyState}>No recent activity</div>
            ) : (
              <table className={styles.activityTable}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activityRows.map((row, i) => (
                    <tr key={i}>
                      <td className={styles.tdSubject}>{row.subject}</td>
                      <td>{row.type}</td>
                      <td>
                        {row.date
                          ? new Date(row.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td>
                        <span className={statusBadgeClass(row.status)}>
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.actionLink}
                          onClick={() => navigate(row.route)}
                        >
                          {row.status === "done" ? "Review" : "Open"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default EventScheduling;
