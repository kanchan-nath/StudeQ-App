import React, { useEffect, useState, useRef, useCallback } from "react";
import BASE_URL from "../lib/api.js";
import styles from "./styles/TimeTable.module.css";

// ─── Constants ───────────────────────────────────────────────────────────────
const VIEWS = ["Day", "Week", "Month", "Agenda"];
const CATEGORIES = ["All", "Work", "Personal", "Health", "Learning", "Social"];
const CATEGORY_COLORS = {
    All: { dot: "#6c63ff", pill: "#6c63ff22", text: "#6c63ff" },
    Work: { dot: "#4f8ef7", pill: "#4f8ef722", text: "#4f8ef7" },
    Personal: { dot: "#a78bfa", pill: "#a78bfa22", text: "#a78bfa" },
    Health: { dot: "#34d399", pill: "#34d39922", text: "#34d399" },
    Learning: { dot: "#fbbf24", pill: "#fbbf2422", text: "#fbbf24" },
    Social: { dot: "#f472b6", pill: "#f472b622", text: "#f472b6" },
};
const EVENT_COLORS = [
    "#4f8ef7", "#a78bfa", "#34d399", "#fbbf24", "#f472b6",
    "#6c63ff", "#f87171", "#38bdf8", "#fb923c", "#a3e635",
];
const REPEAT_OPTIONS = [
    "Does not repeat", "Daily", "Weekly", "Monthly", "Custom"
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

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
function timeToMinutes(t) {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}
function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}
function toLocalDateStr(date) {
    return date.toISOString().split("T")[0];
}

// ─── Default form state ───────────────────────────────────────────────────────
const EMPTY_FORM = {
    title: "", topic: "", startTime: "", endTime: "",
    plannedDuration: "", isRecurring: false,
    recurrencePattern: "", recurrenceDays: [],
    recurrenceEndDate: "", status: "in_progress", actualDuration: "",
    goalDescription: "", reminderEnabled: false,
    reminderMinutesBefore: 10, category: "Work",
    color: EVENT_COLORS[0], repeat: "Does not repeat", notes: "",
    date: toLocalDateStr(new Date()),
};

// ─── Component ────────────────────────────────────────────────────────────────
const TimeTable = () => {
    const token = localStorage.getItem("token");

    // State
    const [view, setView] = useState("Day");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeCategory, setActiveCategory] = useState("All");
    const [allTimeTables, setAllTimeTables] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // Drag-to-create
    const [dragPreview, setDragPreview] = useState(null);
    const gridRef = useRef(null);

    // Detail panel
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Theme
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // ── API helpers ──────────────────────────────────────────────────────────
    const apiFetch = useCallback(async (path, opts = {}) => {
        const res = await fetch(`${BASE_URL}/api/scheduler/time-table${path}`, {
            ...opts,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(opts.headers || {}),
            },
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
    }, [token]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch("", { method: "GET" });
            setAllTimeTables(data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [apiFetch]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Form handlers ────────────────────────────────────────────────────────
    const handleFormChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
    };

    const openCreate = (prefill = {}) => {
        setForm({ ...EMPTY_FORM, ...prefill });
        setModalMode("create");
        setEditId(null);
        setFormError("");
        setShowModal(true);
    };

    const openEdit = (item) => {
        const d = item.startTime ? new Date(item.startTime) : new Date();
        setForm({
            ...EMPTY_FORM,
            title: item.title || "",
            topic: item.topic || "",
            date: toLocalDateStr(d),
            startTime: item.startTime ? d.toTimeString().slice(0, 5) : "",
            endTime: item.endTime ? new Date(item.endTime).toTimeString().slice(0, 5) : "",
            plannedDuration: item.plannedDuration || "",
            category: item.category || "Work",
            color: item.color || EVENT_COLORS[0],
            repeat: item.repeat || "Does not repeat",
            notes: item.goalDescription || "",
            isRecurring: item.isRecurring || false,
            status: item.status || "pending",
        });
        setModalMode("edit");
        setEditId(item._id);
        setFormError("");
        setShowModal(true);
        setSelectedEvent(null);
    };

    const handleSave = async () => {
        if (!form.title || !form.topic || !form.startTime || !form.endTime || !form.plannedDuration) {
            setFormError("Title, topic, start time, end time and duration are required.");
            return;
        }
        setSaving(true);
        setFormError("");
        try {
            const startISO = new Date(`${form.date}T${form.startTime}`).toISOString();
            const endISO = new Date(`${form.date}T${form.endTime}`).toISOString();
            const body = {
                title: form.title, topic: form.topic,
                startTime: startISO, endTime: endISO,
                plannedDuration: Number(form.plannedDuration),
                isRecurring: form.isRecurring,
                recurrencePattern: form.recurrencePattern,
                recurrenceDays: form.recurrenceDays,
                recurrenceEndDate: form.recurrenceEndDate || undefined,
                status: form.status,
                goalDescription: form.notes,
                reminderEnabled: form.reminderEnabled,
                reminderMinutesBefore: form.reminderMinutesBefore,
                category: form.category,
                color: form.color,
                repeat: form.repeat,
            };
            if (modalMode === "create") {
                await apiFetch("", { method: "POST", body: JSON.stringify(body) });
            } else {
                await apiFetch(`/${editId}`, { method: "PATCH", body: JSON.stringify(body) });
            }
            setShowModal(false);
            fetchAll();
        } catch (e) {
            setFormError("Failed to save. Please check for time conflicts.");
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        try {
            await apiFetch(`/${id}`, { method: "DELETE" });
            setSelectedEvent(null);
            fetchAll();
        } catch (e) { console.error(e); }
    };

    const handleDownloadICS = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${id}/ics`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("ICS download failed");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `sparke-${id}.ics`; a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) { console.error(e); }
    };

    // ── Navigation ───────────────────────────────────────────────────────────
    const navigate = (dir) => {
        const d = new Date(currentDate);
        if (view === "Day") d.setDate(d.getDate() + dir);
        else if (view === "Week") d.setDate(d.getDate() + dir * 7);
        else if (view === "Month") d.setMonth(d.getMonth() + dir);
        else if (view === "Agenda") d.setDate(d.getDate() + dir * 7);
        setCurrentDate(d);
    };

    // ── Filter events ────────────────────────────────────────────────────────
    const filteredEvents = allTimeTables.filter(ev => {
        if (activeCategory === "All") return true;
        return (ev.category || "Work") === activeCategory;
    });

    // ── Events for a given day ───────────────────────────────────────────────
    const eventsForDay = (date) => filteredEvents.filter(ev => {
        if (!ev.startTime) return false;
        return sameDay(new Date(ev.startTime), date);
    });

    // ── Drag to create ───────────────────────────────────────────────────────
    const handleGridMouseDown = (e, hour) => {
        if (view !== "Day") return;
        const startMin = hour * 60;
        setDragPreview({ startMin, endMin: startMin + 60 });
    };
    const handleGridMouseMove = (e, hour) => {
        if (!dragPreview) return;
        setDragPreview(p => ({ ...p, endMin: (hour + 1) * 60 }));
    };
    const handleGridMouseUp = () => {
        if (!dragPreview) return;
        const sh = Math.floor(dragPreview.startMin / 60).toString().padStart(2, "0");
        const sm = "00";
        const eh = Math.floor(dragPreview.endMin / 60).toString().padStart(2, "0");
        const em = "00";
        openCreate({
            date: toLocalDateStr(currentDate),
            startTime: `${sh}:${sm}`,
            endTime: `${eh}:${em}`,
        });
        setDragPreview(null);
    };

    // ── Header label ─────────────────────────────────────────────────────────
    const headerLabel = () => {
        if (view === "Day") return formatDateHeader(currentDate);
        if (view === "Week") {
            const days = getWeekDays(currentDate);
            return `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
        }
        if (view === "Month") return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        return "Upcoming";
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={styles.root}>
            {/* ── Navbar ── */}
            <header className={styles.navbar}>
                <div className={styles.navLogo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>Spark<span className={styles.logoAccent}>.E</span></span>
                </div>

                <nav className={styles.viewSwitcher}>
                    {VIEWS.map(v => (
                        <button
                            key={v}
                            className={`${styles.viewTab} ${view === v ? styles.viewTabActive : ""}`}
                            onClick={() => setView(v)}
                        >
                            {v}
                        </button>
                    ))}
                </nav>

                <div className={styles.navRight}>
                    <button
                        className={styles.themeToggle}
                        onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                        title="Toggle theme"
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    <button className={styles.createBtn} onClick={() => openCreate()}>
                        <span className={styles.createPlus}>+</span> Create Block
                    </button>
                </div>
            </header>

            {/* ── Sub-header: date nav + category filter ── */}
            <div className={styles.subHeader}>
                <div className={styles.dateNav}>
                    <button className={styles.navArrow} onClick={() => setCurrentDate(new Date())}>Today</button>
                    <button className={styles.navArrow} onClick={() => navigate(-1)}>‹</button>
                    <button className={styles.navArrow} onClick={() => navigate(1)}>›</button>
                    <span className={styles.dateLabel}>{headerLabel()}</span>
                </div>

                <div className={styles.categoryRow}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.catPill} ${activeCategory === cat ? styles.catPillActive : ""}`}
                            style={{
                                "--cat-color": CATEGORY_COLORS[cat].dot,
                                "--cat-bg": CATEGORY_COLORS[cat].pill,
                                "--cat-text": CATEGORY_COLORS[cat].text,
                            }}
                            onClick={() => setActiveCategory(cat)}
                        >
                            <span className={styles.catDot} />
                            {cat}
                        </button>
                    ))}
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
                            {/* Hour rows */}
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

                            {/* Drag preview */}
                            {dragPreview && (
                                <div
                                    className={styles.dragPreview}
                                    style={{
                                        top: `${(dragPreview.startMin / 60) * 64}px`,
                                        height: `${((dragPreview.endMin - dragPreview.startMin) / 60) * 64}px`,
                                    }}
                                />
                            )}

                            {/* Events */}
                            {eventsForDay(currentDate).map(ev => {
                                const start = new Date(ev.startTime);
                                const end = new Date(ev.endTime);
                                const startMin = start.getHours() * 60 + start.getMinutes();
                                const endMin = end.getHours() * 60 + end.getMinutes();
                                const top = (startMin / 60) * 64;
                                const height = Math.max(((endMin - startMin) / 60) * 64, 32);
                                const color = ev.color || CATEGORY_COLORS[ev.category || "Work"]?.dot || "#6c63ff";
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
                                        const start = new Date(ev.startTime);
                                        const end = new Date(ev.endTime);
                                        const sMin = start.getHours() * 60 + start.getMinutes();
                                        const eMin = end.getHours() * 60 + end.getMinutes();
                                        const top = (sMin / 60) * 48;
                                        const h_ = Math.max(((eMin - sMin) / 60) * 48, 24);
                                        const color = ev.color || CATEGORY_COLORS[ev.category || "Work"]?.dot || "#6c63ff";
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
                                                    style={{ background: ev.color || CATEGORY_COLORS[ev.category || "Work"]?.dot || "#6c63ff" }}
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
                            const sorted = [...filteredEvents].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                            if (sorted.length === 0) return (
                                <div className={styles.agendaEmpty}>
                                    <span>No blocks scheduled. <button className={styles.agendaCreateLink} onClick={() => openCreate()}>Create one →</button></span>
                                </div>
                            );
                            const groups = {};
                            sorted.forEach(ev => {
                                const key = new Date(ev.startTime).toDateString();
                                if (!groups[key]) groups[key] = [];
                                groups[key].push(ev);
                            });
                            return Object.entries(groups).map(([dateStr, evs]) => (
                                <div key={dateStr} className={styles.agendaGroup}>
                                    <div className={styles.agendaDateHeader}>{new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                                    {evs.map(ev => {
                                        const color = ev.color || CATEGORY_COLORS[ev.category || "Work"]?.dot || "#6c63ff";
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
                                                </div>
                                                <div className={styles.agendaItemRight}>
                                                    <span className={styles.agendaItemTime}>
                                                        {new Date(ev.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} –{" "}
                                                        {new Date(ev.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                    <span
                                                        className={styles.agendaCat}
                                                        style={{ background: `${color}22`, color }}
                                                    >{ev.category || "Work"}</span>
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
            {selectedEvent && (
                <div className={styles.detailBackdrop} onClick={() => setSelectedEvent(null)}>
                    <div className={styles.detailPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.detailColorBar} style={{ background: selectedEvent.color || "#6c63ff" }} />
                        <button className={styles.detailClose} onClick={() => setSelectedEvent(null)}>✕</button>
                        <h3 className={styles.detailTitle}>{selectedEvent.title}</h3>
                        <p className={styles.detailTopic}>{selectedEvent.topic}</p>
                        <div className={styles.detailRow}>
                            <span>🕐</span>
                            <span>
                                {new Date(selectedEvent.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} –{" "}
                                {new Date(selectedEvent.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                        {selectedEvent.goalDescription && (
                            <div className={styles.detailRow}><span>📝</span><span>{selectedEvent.goalDescription}</span></div>
                        )}
                        <div className={styles.detailActions}>
                            <button className={styles.detailEditBtn} onClick={() => openEdit(selectedEvent)}>Edit Block</button>
                            <button className={styles.detailICSBtn} onClick={() => handleDownloadICS(selectedEvent._id)}>↓ ICS</button>
                            <button className={styles.detailDeleteBtn} onClick={() => handleDelete(selectedEvent._id)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Create / Edit Modal ── */}
            {showModal && (
                <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{modalMode === "create" ? "Create Time Block" : "Edit Time Block"}</h2>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            {/* Title */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Title</label>
                                <input
                                    className={styles.fieldInput}
                                    placeholder="e.g. Team Standup"
                                    value={form.title}
                                    onChange={e => handleFormChange("title", e.target.value)}
                                />
                            </div>

                            {/* Topic */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Topic / Subject</label>
                                <input
                                    className={styles.fieldInput}
                                    placeholder="e.g. Project sync"
                                    value={form.topic}
                                    onChange={e => handleFormChange("topic", e.target.value)}
                                />
                            </div>

                            {/* Date */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Date</label>
                                <input
                                    className={styles.fieldInput}
                                    type="date"
                                    value={form.date}
                                    onChange={e => handleFormChange("date", e.target.value)}
                                />
                            </div>

                            {/* Start + End time */}
                            <div className={styles.fieldRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Start Time</label>
                                    <input
                                        className={styles.fieldInput}
                                        type="time"
                                        value={form.startTime}
                                        onChange={e => handleFormChange("startTime", e.target.value)}
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>End Time</label>
                                    <input
                                        className={styles.fieldInput}
                                        type="time"
                                        value={form.endTime}
                                        onChange={e => handleFormChange("endTime", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Planned Duration (min)</label>
                                <input
                                    className={styles.fieldInput}
                                    type="number"
                                    placeholder="60"
                                    value={form.plannedDuration}
                                    onChange={e => handleFormChange("plannedDuration", e.target.value)}
                                />
                            </div>

                            {/* Category */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Category</label>
                                <div className={styles.catSegmented}>
                                    {CATEGORIES.filter(c => c !== "All").map(cat => (
                                        <button
                                            key={cat}
                                            className={`${styles.catSeg} ${form.category === cat ? styles.catSegActive : ""}`}
                                            style={{ "--cat-color": CATEGORY_COLORS[cat].dot }}
                                            onClick={() => handleFormChange("category", cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Color</label>
                                <div className={styles.colorRow}>
                                    {EVENT_COLORS.map(c => (
                                        <button
                                            key={c}
                                            className={`${styles.colorSwatch} ${form.color === c ? styles.colorSwatchActive : ""}`}
                                            style={{ background: c }}
                                            onClick={() => handleFormChange("color", c)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Repeat */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Repeat</label>
                                <select
                                    className={styles.fieldSelect}
                                    value={form.repeat}
                                    onChange={e => {
                                        handleFormChange("repeat", e.target.value);
                                        handleFormChange("isRecurring", e.target.value !== "Does not repeat");
                                    }}
                                >
                                    {REPEAT_OPTIONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>

                            {/* Notes */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Notes</label>
                                <textarea
                                    className={styles.fieldTextarea}
                                    placeholder="Add any notes or context…"
                                    value={form.notes}
                                    onChange={e => handleFormChange("notes", e.target.value)}
                                />
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