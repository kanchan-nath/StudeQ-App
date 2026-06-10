import React, { useEffect, useState, useRef } from "react";
import BASE_URL from "../lib/api.js";
import styles from "./styles/TimeTable.module.css";

const VIEWS = ["Day", "Week", "Month", "Agenda"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DEFAULT_CONFIG = {
    categories: ["All", "Work", "Personal", "Health", "Learning", "Social"],
    categoryColors: {
        All: { dot: "#6c63ff", pill: "#6c63ff22", text: "#6c63ff" },
        Work: { dot: "#4f8ef7", pill: "#4f8ef722", text: "#4f8ef7" },
        Personal: { dot: "#a78bfa", pill: "#a78bfa22", text: "#a78bfa" },
        Health: { dot: "#34d399", pill: "#34d39922", text: "#34d399" },
        Learning: { dot: "#fbbf24", pill: "#fbbf2422", text: "#fbbf24" },
        Social: { dot: "#f472b6", pill: "#f472b622", text: "#f472b6" },
    },
    eventColors: [
        "#4f8ef7", "#a78bfa", "#34d399", "#fbbf24", "#f472b6",
        "#6c63ff", "#f87171", "#38bdf8", "#fb923c", "#a3e635",
    ],
    repeatOptions: ["Does not repeat", "Daily", "Weekly", "Monthly", "Custom"],
};

// ── Date helpers ──────────────────────────────────────────────────────────────
// Backend returns either ISO string or { $date: "..." }
function parseDate(val) {
    if (!val) return null;
    if (typeof val === "object" && val.$date) return new Date(val.$date);
    return new Date(val);
}

function formatHour(h) {
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
}
function formatDateHeader(date) {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function getWeekDays(date) {
    const d = new Date(date);
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
        const dd = new Date(start);
        dd.setDate(start.getDate() + i);
        return dd;
    });
}
function getMonthDays(date) {
    const year = date.getFullYear(), month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < first.getDay(); i++) {
        const d = new Date(year, month, -first.getDay() + i + 1);
        days.push({ date: d, inMonth: false });
    }
    for (let i = 1; i <= last.getDate(); i++) {
        days.push({ date: new Date(year, month, i), inMonth: true });
    }
    while (days.length % 7 !== 0) {
        const last_ = days[days.length - 1].date;
        const nd = new Date(last_); nd.setDate(last_.getDate() + 1);
        days.push({ date: nd, inMonth: false });
    }
    return days;
}
function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}
function toLocalDateStr(date) {
    return date.toISOString().split("T")[0];
}

// category is array in backend — resolve first entry for color lookup
function evColor(ev, config) {
    if (ev.color) return ev.color;
    const cat = Array.isArray(ev.category) ? ev.category[0] : ev.category;
    return config.categoryColors[cat]?.dot || "#6c63ff";
}

const EMPTY_FORM_BASE = {
    title: "", topic: "", startTime: "", endTime: "",
    plannedDuration: "", isRecurring: false,
    recurrencePattern: "", recurrenceDays: [],
    recurrenceEndDate: "", status: "in_progress", actualDuration: "",
    goalDescription: "", reminderEnabled: false,
    reminderMinutesBefore: 10,
    repeat: "Does not repeat", notes: "",
    date: toLocalDateStr(new Date()),
    category: [], color: DEFAULT_CONFIG.eventColors[0],
};

// ─── Component ────────────────────────────────────────────────────────────────
const TimeTable = () => {
    const token = localStorage.getItem("token");

    const [view, setView] = useState("Day");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeCategory, setActiveCategory] = useState("All");
    const [allTimeTables, setAllTimeTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [config] = useState(DEFAULT_CONFIG);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_FORM_BASE });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [dragPreview, setDragPreview] = useState(null);
    const gridRef = useRef(null);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // ── Fetch helpers ─────────────────────────────────────────────────────────
    const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const fetchAll = () => {
        setLoading(true);
        fetch(`${BASE_URL}/api/scheduler/time-table`, { headers: authHeaders })
            .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
            .then(d => setAllTimeTables(d.data || []))
            .catch(e => console.error("fetchAll:", e))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Form helpers ──────────────────────────────────────────────────────────
    const makeEmptyForm = () => ({
        ...EMPTY_FORM_BASE,
        date: toLocalDateStr(new Date()),
        color: config.eventColors[0],
        category: [],
        repeat: config.repeatOptions[0],
    });

    const handleFormChange = (field, value) =>
        setForm(f => ({ ...f, [field]: value }));

    const openCreate = (prefill = {}) => {
        setForm({ ...makeEmptyForm(), ...prefill });
        setModalMode("create");
        setEditId(null);
        setFormError("");
        setShowModal(true);
    };

    const openEdit = (item) => {
        const start = parseDate(item.startTime);
        const end = parseDate(item.endTime);
        const recEnd = parseDate(item.recurrenceEndDate);
        setForm({
            ...makeEmptyForm(),
            title: item.title || "",
            topic: item.topic || "",
            date: start ? toLocalDateStr(start) : toLocalDateStr(new Date()),
            startTime: start ? start.toTimeString().slice(0, 5) : "",
            endTime: end ? end.toTimeString().slice(0, 5) : "",
            plannedDuration: item.plannedDuration || "",
            actualDuration: item.actualDuration ?? "",
            category: Array.isArray(item.category) ? item.category : (item.category ? [item.category] : []),
            color: item.color || config.eventColors[0],
            repeat: item.repeat || config.repeatOptions[0],
            notes: item.goalDescription || "",
            isRecurring: item.isRecurring || false,
            recurrencePattern: item.recurrencePattern || "",
            recurrenceDays: item.recurrenceDays || [],
            recurrenceEndDate: recEnd ? toLocalDateStr(recEnd) : "",
            status: item.status || "in_progress",
            reminderEnabled: item.reminderEnabled || false,
            reminderMinutesBefore: item.reminderMinutesBefore ?? 10,
        });
        setModalMode("edit");
        setEditId(item._id);
        setFormError("");
        setShowModal(true);
        setSelectedEvent(null);
    };

    const handleSave = () => {
        if (!form.title || !form.topic || !form.startTime || !form.endTime || !form.plannedDuration) {
            setFormError("Title, topic, start time, end time and duration are required.");
            return;
        }
        setSaving(true);
        setFormError("");

        const startISO = new Date(`${form.date}T${form.startTime}`).toISOString();
        const endISO = new Date(`${form.date}T${form.endTime}`).toISOString();
        const body = JSON.stringify({
            title: form.title,
            topic: form.topic,
            startTime: startISO,
            endTime: endISO,
            plannedDuration: Number(form.plannedDuration),
            actualDuration: form.actualDuration !== "" ? Number(form.actualDuration) : undefined,
            isRecurring: form.isRecurring,
            recurrencePattern: form.recurrencePattern || undefined,
            recurrenceDays: form.recurrenceDays.length ? form.recurrenceDays : undefined,
            recurrenceEndDate: form.recurrenceEndDate || undefined,
            status: form.status,
            goalDescription: form.notes,
            reminderEnabled: form.reminderEnabled,
            reminderMinutesBefore: form.reminderMinutesBefore,
            category: form.category,
            color: form.color,
        });

        const url = modalMode === "create"
            ? `${BASE_URL}/api/scheduler/time-table`
            : `${BASE_URL}/api/scheduler/time-table/${editId}`;
        const method = modalMode === "create" ? "POST" : "PATCH";

        fetch(url, { method, headers: authHeaders, body })
            .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
            .then(() => { setShowModal(false); fetchAll(); })
            .catch(() => setFormError("Failed to save. Check for time conflicts."))
            .finally(() => setSaving(false));
    };

    const handleDelete = (id) => {
        fetch(`${BASE_URL}/api/scheduler/time-table/${id}`, { method: "DELETE", headers: authHeaders })
            .then(r => { if (!r.ok) throw new Error(`${r.status}`); })
            .then(() => { setSelectedEvent(null); fetchAll(); })
            .catch(e => console.error("delete:", e));
    };

    const handleDownloadICS = (id) => {
        fetch(`${BASE_URL}/api/scheduler/time-table/${id}/ics`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => { if (!r.ok) throw new Error("ICS failed"); return r.blob(); })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `sparke-${id}.ics`; a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(e => console.error("ics:", e));
    };

    // ── Navigation ────────────────────────────────────────────────────────────
    const navigate = (dir) => {
        const d = new Date(currentDate);
        if (view === "Day") d.setDate(d.getDate() + dir);
        else if (view === "Week") d.setDate(d.getDate() + dir * 7);
        else if (view === "Month") d.setMonth(d.getMonth() + dir);
        else if (view === "Agenda") d.setDate(d.getDate() + dir * 7);
        setCurrentDate(d);
    };

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredEvents = allTimeTables.filter(ev => {
        if (activeCategory === "All") return true;
        const cats = Array.isArray(ev.category) ? ev.category : [ev.category];
        return cats.includes(activeCategory);
    });

    const eventsForDay = (date) => filteredEvents.filter(ev => {
        const start = parseDate(ev.startTime);
        return start && sameDay(start, date);
    });

    // ── Drag to create ────────────────────────────────────────────────────────
    const handleGridMouseDown = (e, hour) => {
        if (view !== "Day") return;
        setDragPreview({ startMin: hour * 60, endMin: (hour + 1) * 60 });
    };
    const handleGridMouseMove = (e, hour) => {
        if (!dragPreview) return;
        setDragPreview(p => ({ ...p, endMin: (hour + 1) * 60 }));
    };
    const handleGridMouseUp = () => {
        if (!dragPreview) return;
        const sh = Math.floor(dragPreview.startMin / 60).toString().padStart(2, "0");
        const eh = Math.floor(dragPreview.endMin / 60).toString().padStart(2, "0");
        openCreate({ date: toLocalDateStr(currentDate), startTime: `${sh}:00`, endTime: `${eh}:00` });
        setDragPreview(null);
    };

    // ── Header label ──────────────────────────────────────────────────────────
    const headerLabel = () => {
        if (view === "Day") return formatDateHeader(currentDate);
        if (view === "Week") {
            const days = getWeekDays(currentDate);
            return `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
        }
        if (view === "Month") return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        return "Upcoming";
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={styles.root}>
            {/* ── Navbar ── */}
            <header className={styles.navbar}>
                <div className={styles.navLogo}>
                    <span className={styles.logoText}>Time Table</span>
                </div>
                <nav className={styles.viewSwitcher}>
                    {VIEWS.map(v => (
                        <button
                            key={v}
                            className={`${styles.viewTab} ${view === v ? styles.viewTabActive : ""}`}
                            onClick={() => setView(v)}
                        >{v}</button>
                    ))}
                </nav>
                <div className={styles.navRight}>
                    <button
                        className={styles.themeToggle}
                        onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                        title="Toggle theme"
                    >{theme === "dark" ? "☀️" : "🌙"}</button>
                    <button className={styles.createBtn} onClick={() => openCreate()}>
                        <span className={styles.createPlus}>+</span> Create Block
                    </button>
                </div>
            </header>

            {/* ── Sub-header ── */}
            <div className={styles.subHeader}>
                <div className={styles.dateNav}>
                    <button className={styles.navArrow} onClick={() => setCurrentDate(new Date())}>Today</button>
                    <button className={styles.navArrow} onClick={() => navigate(-1)}>‹</button>
                    <button className={styles.navArrow} onClick={() => navigate(1)}>›</button>
                    <span className={styles.dateLabel}>{headerLabel()}</span>
                </div>
            </div>

            {/* ── Main Canvas ── */}
            <main className={styles.canvas}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner} />
                        <span>Loading your blocks…</span>
                    </div>
                )}

                {/* DAY VIEW */}
                {view === "Day" && (
                    <div className={styles.dayView}>
                        <div className={styles.timeLabels}>
                            {HOURS.map(h => (
                                <div key={h} className={styles.timeLabel}>{formatHour(h)}</div>
                            ))}
                        </div>
                        <div
                            className={styles.dayGrid}
                            ref={gridRef}
                            onMouseLeave={() => setDragPreview(null)}
                            onMouseUp={handleGridMouseUp}
                        >
                            {HOURS.map(h => (
                                <div
                                    key={h}
                                    className={styles.hourRow}
                                    onMouseDown={e => handleGridMouseDown(e, h)}
                                    onMouseMove={e => handleGridMouseMove(e, h)}
                                >
                                    <div className={styles.hourLine} />
                                </div>
                            ))}

                            {dragPreview && (
                                <div
                                    className={styles.dragPreview}
                                    style={{
                                        top: `${(dragPreview.startMin / 60) * 64}px`,
                                        height: `${((dragPreview.endMin - dragPreview.startMin) / 60) * 64}px`,
                                    }}
                                />
                            )}

                            {eventsForDay(currentDate).map(ev => {
                                const start = parseDate(ev.startTime);
                                const end = parseDate(ev.endTime);
                                const startMin = start.getHours() * 60 + start.getMinutes();
                                const endMin = end.getHours() * 60 + end.getMinutes();
                                const top = (startMin / 60) * 64;
                                const height = Math.max(((endMin - startMin) / 60) * 64, 32);
                                const color = evColor(ev, config);
                                const cats = Array.isArray(ev.category) ? ev.category : (ev.category ? [ev.category] : []);
                                return (
                                    <div
                                        key={ev._id}
                                        className={styles.eventBlock}
                                        style={{
                                            top: `${top}px`, height: `${height}px`,
                                            "--ev-color": color,
                                            background: `${color}22`,
                                            borderLeft: `3px solid ${color}`,
                                        }}
                                        onClick={() => setSelectedEvent(ev)}
                                    >
                                        <span className={styles.eventTitle}>{ev.title}</span>
                                        <span className={styles.eventTime}>
                                            {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} –{" "}
                                            {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        {cats.length > 0 && (
                                            <div className={styles.eventCatPills}>
                                                {cats.map(c => (
                                                    <span key={c} className={styles.eventCatPill} style={{ background: `${color}33`, color }}>{c}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className={styles.eventActions}>
                                            <button className={styles.eventActionBtn} onClick={e => { e.stopPropagation(); openEdit(ev); }}>✏️</button>
                                            <button className={styles.eventActionBtn} onClick={e => { e.stopPropagation(); handleDelete(ev._id); }}>🗑️</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* WEEK VIEW */}
                {view === "Week" && (
                    <div className={styles.weekView}>
                        <div className={styles.weekHeader}>
                            <div className={styles.weekTimeGutter} />
                            {getWeekDays(currentDate).map((d, i) => (
                                <div
                                    key={i}
                                    className={`${styles.weekDayHeader} ${sameDay(d, new Date()) ? styles.weekDayToday : ""}`}
                                    onClick={() => { setCurrentDate(d); setView("Day"); }}
                                >
                                    <span className={styles.weekDayName}>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                                    <span className={styles.weekDayNum}>{d.getDate()}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.weekBody}>
                            <div className={styles.weekTimeCol}>
                                {HOURS.map(h => (
                                    <div key={h} className={styles.weekTimeLabel}>{formatHour(h)}</div>
                                ))}
                            </div>
                            {getWeekDays(currentDate).map((d, di) => (
                                <div key={di} className={styles.weekDayCol}>
                                    {HOURS.map(h => <div key={h} className={styles.weekHourCell} />)}
                                    {eventsForDay(d).map(ev => {
                                        const start = parseDate(ev.startTime);
                                        const end = parseDate(ev.endTime);
                                        const sMin = start.getHours() * 60 + start.getMinutes();
                                        const eMin = end.getHours() * 60 + end.getMinutes();
                                        const top = (sMin / 60) * 48;
                                        const h_ = Math.max(((eMin - sMin) / 60) * 48, 24);
                                        const color = evColor(ev, config);
                                        return (
                                            <div
                                                key={ev._id}
                                                className={styles.weekEventChip}
                                                style={{
                                                    top: `${top}px`, height: `${h_}px`,
                                                    background: `${color}33`, borderLeft: `3px solid ${color}`,
                                                }}
                                                onClick={() => setSelectedEvent(ev)}
                                            >
                                                <span>{ev.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MONTH VIEW */}
                {view === "Month" && (
                    <div className={styles.monthView}>
                        <div className={styles.monthWeekRow}>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                <div key={d} className={styles.monthWeekLabel}>{d}</div>
                            ))}
                        </div>
                        <div className={styles.monthGrid}>
                            {getMonthDays(currentDate).map(({ date, inMonth }, i) => {
                                const dayEvs = eventsForDay(date);
                                const isToday = sameDay(date, new Date());
                                return (
                                    <div
                                        key={i}
                                        className={`${styles.monthCell} ${!inMonth ? styles.monthCellOut : ""} ${isToday ? styles.monthCellToday : ""}`}
                                        onClick={() => { setCurrentDate(date); setView("Day"); }}
                                    >
                                        <span className={styles.monthDayNum}>{date.getDate()}</span>
                                        <div className={styles.monthDots}>
                                            {dayEvs.slice(0, 3).map(ev => (
                                                <span
                                                    key={ev._id}
                                                    className={styles.monthDot}
                                                    style={{ background: evColor(ev, config) }}
                                                    title={ev.title}
                                                />
                                            ))}
                                            {dayEvs.length > 3 && <span className={styles.monthMore}>+{dayEvs.length - 3}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* AGENDA VIEW */}
                {view === "Agenda" && (
                    <div className={styles.agendaView}>
                        {(() => {
                            const sorted = [...filteredEvents].sort((a, b) =>
                                parseDate(a.startTime) - parseDate(b.startTime)
                            );
                            if (sorted.length === 0) return (
                                <div className={styles.agendaEmpty}>
                                    <span>No blocks scheduled. <button className={styles.agendaCreateLink} onClick={() => openCreate()}>Create one →</button></span>
                                </div>
                            );
                            const groups = {};
                            sorted.forEach(ev => {
                                const key = parseDate(ev.startTime).toDateString();
                                if (!groups[key]) groups[key] = [];
                                groups[key].push(ev);
                            });
                            return Object.entries(groups).map(([dateStr, evs]) => (
                                <div key={dateStr} className={styles.agendaGroup}>
                                    <div className={styles.agendaDateHeader}>
                                        {new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                    </div>
                                    {evs.map(ev => {
                                        const color = evColor(ev, config);
                                        const cats = Array.isArray(ev.category) ? ev.category : (ev.category ? [ev.category] : []);
                                        const start = parseDate(ev.startTime);
                                        const end = parseDate(ev.endTime);
                                        return (
                                            <div
                                                key={ev._id}
                                                className={styles.agendaItem}
                                                style={{ "--ev-color": color, borderLeft: `3px solid ${color}` }}
                                                onClick={() => setSelectedEvent(ev)}
                                            >
                                                <div className={styles.agendaItemLeft}>
                                                    <span className={styles.agendaItemTitle}>{ev.title}</span>
                                                    <span className={styles.agendaItemMeta}>{ev.topic}</span>
                                                    {ev.goalDescription && (
                                                        <span className={styles.agendaItemMeta}>{ev.goalDescription}</span>
                                                    )}
                                                </div>
                                                <div className={styles.agendaItemRight}>
                                                    <span className={styles.agendaItemTime}>
                                                        {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} –{" "}
                                                        {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                    {cats.map(c => (
                                                        <span
                                                            key={c}
                                                            className={styles.agendaCat}
                                                            style={{ background: `${color}22`, color }}
                                                        >{c}</span>
                                                    ))}
                                                    <span className={styles.agendaItemMeta}>
                                                        {ev.plannedDuration} min planned
                                                        {ev.actualDuration > 0 ? ` · ${ev.actualDuration} min actual` : ""}
                                                    </span>
                                                    <span className={styles.agendaItemMeta} style={{ textTransform: "capitalize" }}>
                                                        {ev.status?.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div className={styles.agendaActions}>
                                                    <button className={styles.agendaBtn} onClick={e => { e.stopPropagation(); openEdit(ev); }}>Edit</button>
                                                    <button className={styles.agendaBtn} onClick={e => { e.stopPropagation(); handleDownloadICS(ev._id); }}>ICS</button>
                                                    <button className={`${styles.agendaBtn} ${styles.agendaBtnDanger}`} onClick={e => { e.stopPropagation(); handleDelete(ev._id); }}>Del</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </main>

            {/* ── Event Detail Panel ── */}
            {selectedEvent && (() => {
                const ev = selectedEvent;
                const color = evColor(ev, config);
                const start = parseDate(ev.startTime);
                const end = parseDate(ev.endTime);
                const recEnd = parseDate(ev.recurrenceEndDate);
                const cats = Array.isArray(ev.category) ? ev.category : (ev.category ? [ev.category] : []);
                return (
                    <div className={styles.detailBackdrop} onClick={() => setSelectedEvent(null)}>
                        <div className={styles.detailPanel} onClick={e => e.stopPropagation()}>
                            <div className={styles.detailColorBar} style={{ background: color }} />
                            <button className={styles.detailClose} onClick={() => setSelectedEvent(null)}>✕</button>
                            <h3 className={styles.detailTitle}>{ev.title}</h3>
                            <p className={styles.detailTopic}>{ev.topic}</p>

                            <div className={styles.detailRow}>
                                <span>🕐</span>
                                <span>
                                    {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} –{" "}
                                    {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>

                            <div className={styles.detailRow}>
                                <span>📅</span>
                                <span>{start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                            </div>

                            {cats.length > 0 && (
                                <div className={styles.detailRow}>
                                    <span>🏷️</span>
                                    <span>{cats.join(", ")}</span>
                                </div>
                            )}

                            <div className={styles.detailRow}>
                                <span>⏱️</span>
                                <span>
                                    {ev.plannedDuration} min planned
                                    {ev.actualDuration > 0 ? ` · ${ev.actualDuration} min actual` : ""}
                                </span>
                            </div>

                            <div className={styles.detailRow}>
                                <span>📌</span>
                                <span style={{ textTransform: "capitalize" }}>{ev.status?.replace("_", " ")}</span>
                            </div>

                            {ev.isRecurring && (
                                <div className={styles.detailRow}>
                                    <span>🔁</span>
                                    <span>
                                        {ev.recurrencePattern}
                                        {ev.recurrenceDays?.length > 0 ? ` — ${ev.recurrenceDays.join(", ")}` : ""}
                                        {recEnd ? ` until ${recEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                                    </span>
                                </div>
                            )}

                            {ev.reminderEnabled && (
                                <div className={styles.detailRow}>
                                    <span>🔔</span>
                                    <span>{ev.reminderMinutesBefore} min before</span>
                                </div>
                            )}

                            {ev.goalDescription && (
                                <div className={styles.detailRow}><span>📝</span><span>{ev.goalDescription}</span></div>
                            )}

                            {ev.completedAt && (
                                <div className={styles.detailRow}>
                                    <span>✅</span>
                                    <span>Completed {parseDate(ev.completedAt).toLocaleDateString()}</span>
                                </div>
                            )}

                            <div className={styles.detailActions}>
                                <button className={styles.detailEditBtn} onClick={() => openEdit(ev)}>Edit Block</button>
                                <button className={styles.detailICSBtn} onClick={() => handleDownloadICS(ev._id)}>↓ ICS</button>
                                <button className={styles.detailDeleteBtn} onClick={() => handleDelete(ev._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ── Create / Edit Modal ── */}
            {showModal && (
                <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{modalMode === "create" ? "Create Time Block" : "Edit Time Block"}</h2>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Title</label>
                                <input className={styles.fieldInput} placeholder="e.g. Team Standup"
                                    value={form.title} onChange={e => handleFormChange("title", e.target.value)} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Topic / Subject</label>
                                <input className={styles.fieldInput} placeholder="e.g. Project sync"
                                    value={form.topic} onChange={e => handleFormChange("topic", e.target.value)} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Date</label>
                                <input className={styles.fieldInput} type="date"
                                    value={form.date} onChange={e => handleFormChange("date", e.target.value)} />
                            </div>

                            <div className={styles.fieldRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Start Time</label>
                                    <input className={styles.fieldInput} type="time"
                                        value={form.startTime} onChange={e => handleFormChange("startTime", e.target.value)} />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>End Time</label>
                                    <input className={styles.fieldInput} type="time"
                                        value={form.endTime} onChange={e => handleFormChange("endTime", e.target.value)} />
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Planned Duration (min)</label>
                                <input className={styles.fieldInput} type="number" placeholder="60"
                                    value={form.plannedDuration} onChange={e => handleFormChange("plannedDuration", e.target.value)} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Actual Duration (min)</label>
                                <input className={styles.fieldInput} type="number" placeholder="0"
                                    value={form.actualDuration} onChange={e => handleFormChange("actualDuration", e.target.value)} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Status</label>
                                <select className={styles.fieldSelect} value={form.status}
                                    onChange={e => handleFormChange("status", e.target.value)}>
                                    {["scheduled", "in_progress", "completed", "skipped", "cancelled"].map(s => (
                                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Category (tags)</label>
                                <input
                                    className={styles.fieldInput}
                                    placeholder="e.g. Study, DSA (comma separated)"
                                    value={form.category.join(", ")}
                                    onChange={e => handleFormChange("category",
                                        e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                    )}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Color</label>
                                <div className={styles.colorRow}>
                                    {config.eventColors.map(c => (
                                        <button key={c}
                                            className={`${styles.colorSwatch} ${form.color === c ? styles.colorSwatchActive : ""}`}
                                            style={{ background: c }}
                                            onClick={() => handleFormChange("color", c)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Repeat</label>
                                <select className={styles.fieldSelect} value={form.repeat}
                                    onChange={e => {
                                        handleFormChange("repeat", e.target.value);
                                        handleFormChange("isRecurring", e.target.value !== config.repeatOptions[0]);
                                        handleFormChange("recurrencePattern", e.target.value.toLowerCase() === "does not repeat" ? "" : e.target.value.toLowerCase());
                                    }}>
                                    {config.repeatOptions.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>

                            {form.isRecurring && (
                                <>
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Recurrence Days (comma separated)</label>
                                        <input
                                            className={styles.fieldInput}
                                            placeholder="e.g. Monday, Wednesday, Friday"
                                            value={form.recurrenceDays.join(", ")}
                                            onChange={e => handleFormChange("recurrenceDays",
                                                e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                            )}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Recurrence End Date</label>
                                        <input className={styles.fieldInput} type="date"
                                            value={form.recurrenceEndDate}
                                            onChange={e => handleFormChange("recurrenceEndDate", e.target.value)} />
                                    </div>
                                </>
                            )}

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>
                                    <input type="checkbox" checked={form.reminderEnabled}
                                        onChange={e => handleFormChange("reminderEnabled", e.target.checked)} />
                                    {" "}Enable Reminder
                                </label>
                                {form.reminderEnabled && (
                                    <input className={styles.fieldInput} type="number" placeholder="Minutes before"
                                        value={form.reminderMinutesBefore}
                                        onChange={e => handleFormChange("reminderMinutesBefore", Number(e.target.value))} />
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Notes / Goal</label>
                                <textarea className={styles.fieldTextarea} placeholder="Add any notes or context…"
                                    value={form.notes} onChange={e => handleFormChange("notes", e.target.value)} />
                            </div>

                            {formError && <p className={styles.formError}>{formError}</p>}
                        </div>

                        <div className={styles.modalFooter}>
                            <p className={styles.modalTip}>Tip: You can also click and drag on the grid to quick-create a block.</p>
                            <div className={styles.modalFooterBtns}>
                                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving…" : "Save Block"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeTable;