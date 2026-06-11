import React, { useEffect, useState } from "react";
import BASE_URL from "../lib/api.js";
import styles from "./styles/Assignments.module.css";

// ─── Icons (inline SVG helpers) ──────────────────────────────────────────────
const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const PaperclipIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 7.5l-6 6a4 4 0 01-5.66-5.66l6-6a2.5 2.5 0 013.54 3.54l-6 6a1 1 0 01-1.42-1.42l5.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);
const TrophyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 11v2m-3 2h6M5 2H2v3a3 3 0 003 3m6-6h3v3a3 3 0 01-3 3M5 2h6v4a3 3 0 01-6 0V2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const UploadIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);
const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 3.5h10M5.5 3.5V2h3v1.5M5 6v5m4-5v5M3 3.5l.75 8.5h6.5l.75-8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const WarningIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 1.5L12 11.5H1L6.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M6.5 5.5v3M6.5 10h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

// ─── FILTER TABS ──────────────────────────────────────────────────────────────
const FILTERS = ["All", "Today", "This Week", "Overdue", "Completed"];

// ─── Main Assignments Component ───────────────────────────────────────────────
const Assignments = () => {
    const token = localStorage.getItem("token");

    // ── State ──
    const [allAssignments, setAllAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        subject: "",
        dueDate: "",
        priority: "High",
        assignedBy: "",
        points: "",
        instructions: "",
        notifyStudents: true,
        allowLateSubmission: false,
        linkedAssignmentId: "",
    });
    const [updateId, setUpdateId] = useState(null);
    const [updateForm, setUpdateForm] = useState({});

    // ── Fetch ──
    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            const enriched = (data.data || []).map((item) => ({
                ...item,
                title: item.title || item.linkedAssignmentId || "Untitled Assignment",
                subject: item.subject || "General",
                priority: item.priority || "High",
                initials: item.initials || "DR",
                subjectColor: item.subjectColor || "orange",
            }));
            setAllAssignments(enriched);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ── Helpers ──
    const isOverdue = (item) => {
        if (item.submissionStatus === "submitted") return false;
        if (!item.dueDate) return false;
        return new Date(item.dueDate) < new Date();
    };

    const formatDate = (d) => {
        if (!d) return "";
        const date = new Date(d);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const filteredAssignments = allAssignments.filter((a) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Overdue") return isOverdue(a);
        if (activeFilter === "Completed") return a.submissionStatus === "submitted";
        if (activeFilter === "Today") {
            const today = new Date().toDateString();
            return new Date(a.dueDate).toDateString() === today;
        }
        if (activeFilter === "This Week") {
            const now = new Date();
            const end = new Date(now); end.setDate(now.getDate() + 7);
            const due = new Date(a.dueDate);
            return due >= now && due <= end;
        }
        return true;
    });

    const highPriority = filteredAssignments.filter((a) => a.priority === "High");

    // Group by subject
    const grouped = highPriority.reduce((acc, item) => {
        const key = item.subject || "General";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const subjectColors = ["orange", "teal", "blue", "purple"];
    const subjectColorMap = {};
    Object.keys(grouped).forEach((s, i) => {
        subjectColorMap[s] = subjectColors[i % subjectColors.length];
    });

    // ── Selection ──
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ── Create ──
    const handleCreate = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            const payload = {
                dueDate: form.dueDate,
                allowLateSubmission: form.allowLateSubmission,
                linkedAssignmentId: form.title,
                title: form.title,
                subject: form.subject,
                priority: form.priority,
                assignedBy: form.assignedBy,
                points: form.points,
                instructions: form.instructions,
            };
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Create failed");
            setShowModal(false);
            resetForm();
            fetchAll();
        } catch (err) {
            console.error(err);
        } finally {
            setModalLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ title: "", subject: "", dueDate: "", priority: "High", assignedBy: "", points: "", instructions: "", notifyStudents: true, allowLateSubmission: false, linkedAssignmentId: "" });
    };

    // ── Delete ──
    const handleDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}/api/scheduler/assignment-submission/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            fetchAll();
        } catch (err) { console.error(err); }
    };

    // ── Bulk delete ──
    const handleBulkDelete = async () => {
        for (const id of selectedIds) { await handleDelete(id); }
        setSelectedIds([]);
    };

    // ── Mark complete ──
    const handleMarkComplete = async () => {
        for (const id of selectedIds) {
            try {
                await fetch(`${BASE_URL}/api/scheduler/assignment-submission/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ submissionStatus: "submitted", submittedAt: new Date().toISOString() }),
                });
            } catch (err) { console.error(err); }
        }
        setSelectedIds([]);
        fetchAll();
    };

    // ── Update ──
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${BASE_URL}/api/scheduler/assignment-submission/${updateId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(updateForm),
            });
            setUpdateId(null);
            fetchAll();
        } catch (err) { console.error(err); }
    };

    return (
        <div className={styles.layout}>

            {/* ── Main ── */}
            <main className={styles.main}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Schedule Your Assignments</h1>
                    <button className={styles.newBtn} onClick={() => setShowModal(true)}>
                        <span>+</span> New Assignment
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className={styles.filters}>
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            className={`${styles.filterTab} ${activeFilter === f ? styles.filterActive : ""}`}
                            onClick={() => setActiveFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Assignment List */}
                <div className={styles.listArea}>
                    {loading ? (
                        <div className={styles.empty}>
                            <div className={styles.spinner} />
                            <p>Loading assignments…</p>
                        </div>
                    ) : Object.keys(grouped).length === 0 ? (
                        <div className={styles.empty}>
                            <p>No high-priority assignments found.</p>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([subject, items]) => {
                            const color = subjectColorMap[subject];
                            return (
                                <div key={subject} className={styles.group}>
                                    {/* Group Header */}
                                    <div className={styles.groupHeader}>
                                        <div className={styles.groupLeft}>
                                            <span className={`${styles.dot} ${styles[`dot_${color}`]}`} />
                                            <span className={styles.groupName}>{subject}</span>
                                            <span className={styles.groupBadge}>{items.length}</span>
                                        </div>
                                    </div>

                                    {/* Rows */}
                                    {items.map((item) => {
                                        const overdue = isOverdue(item);
                                        const expanded = expandedIds.includes(item._id);
                                        const selected = selectedIds.includes(item._id);

                                        return (
                                            <div key={item._id} className={`${styles.row} ${selected ? styles.rowSelected : ""}`}>
                                                <div className={styles.rowMain}>
                                                    <input
                                                        type="checkbox"
                                                        className={styles.checkbox}
                                                        checked={selected}
                                                        onChange={() => toggleSelect(item._id)}
                                                    />
                                                    <span className={`${styles.dot} ${overdue ? styles.dot_red : styles[`dot_${color}`]}`} />
                                                    <div className={styles.rowInfo}>
                                                        <p className={styles.rowTitle}>{item.title || item.linkedAssignmentId || "Untitled"}</p>
                                                        {overdue ? (
                                                            <p className={styles.overdueLine}>
                                                                <WarningIcon /> Overdue · {formatDate(item.dueDate)}
                                                            </p>
                                                        ) : (
                                                            <p className={styles.dueDate}>Due {formatDate(item.dueDate)}</p>
                                                        )}
                                                    </div>
                                                    <div className={styles.rowActions}>
                                                        <span className={styles.priorityBadge}>High</span>
                                                        <div className={styles.initials}>{item.initials || "DR"}</div>
                                                        <button className={styles.chevronBtn} onClick={() => toggleExpand(item._id)}>
                                                            {expanded ? <ChevronDown /> : <ChevronRight />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded */}
                                                {expanded && (
                                                    <div className={styles.expanded}>
                                                        <p className={styles.expandedDesc}>
                                                            {item.instructions || item.feedback || "No description provided."}
                                                        </p>
                                                        <div className={styles.expandedMeta}>
                                                            <span className={styles.metaItem}>
                                                                <PaperclipIcon /> 2 attachments
                                                            </span>
                                                            <span className={styles.viewRubric}>
                                                                <span className={styles.rubricDot} /> View rubric
                                                            </span>
                                                            <span className={styles.metaItem}>
                                                                <TrophyIcon /> {item.points || 100} pts
                                                            </span>
                                                            <button
                                                                className={styles.deleteSmall}
                                                                onClick={() => handleDelete(item._id)}
                                                            >
                                                                <TrashIcon /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* ── Bulk Action Bar ── */}
            {selectedIds.length > 0 && (
                <div className={styles.bulkBar}>
                    <span className={styles.bulkCount}>{selectedIds.length} selected</span>
                    <button className={styles.bulkComplete} onClick={handleMarkComplete}>
                        <CheckIcon /> Mark Complete
                    </button>
                    <button className={styles.bulkReassign}>
                        <UserIcon /> Reassign
                    </button>
                    <button className={styles.bulkDelete} onClick={handleBulkDelete}>
                        <TrashIcon /> Delete
                    </button>
                </div>
            )}

            {/* ── New Assignment Modal ── */}
            {showModal && (
                <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>Add New Assignment</h2>
                                <p className={styles.modalSub}>Fill in the details to create a new assignment.</p>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                                <XIcon />
                            </button>
                        </div>

                        <form className={styles.modalForm} onSubmit={handleCreate}>
                            {/* Title */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Assignment Title</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="e.g. Binary Trees Problem Set"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Subject + Due Date */}
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Subject</label>
                                    <select
                                        className={styles.input}
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        required
                                    >
                                        <option value="">Select subject</option>
                                        <option>Data Structures</option>
                                        <option>Operating Systems</option>
                                        <option>Algorithms</option>
                                        <option>Database Systems</option>
                                        <option>Networks</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Due Date</label>
                                    <input
                                        className={styles.input}
                                        type="date"
                                        value={form.dueDate}
                                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Priority */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Priority</label>
                                <div className={styles.radioGroup}>
                                    {["Low", "Med", "High"].map((p) => (
                                        <label key={p} className={`${styles.radioPill} ${form.priority === p ? styles.radioPillActive : ""}`}>
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={p}
                                                checked={form.priority === p}
                                                onChange={() => setForm({ ...form, priority: p })}
                                            />
                                            {p}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Assigned By + Points */}
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Assigned By</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Professor name"
                                        value={form.assignedBy}
                                        onChange={(e) => setForm({ ...form, assignedBy: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Points</label>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        placeholder="100"
                                        value={form.points}
                                        onChange={(e) => setForm({ ...form, points: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Instructions</label>
                                <textarea
                                    className={`${styles.input} ${styles.textarea}`}
                                    rows={3}
                                    placeholder="Describe the assignment requirements…"
                                    value={form.instructions}
                                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                                />
                            </div>

                            {/* Attachments */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Attachments</label>
                                <div className={styles.dropZone}>
                                    <UploadIcon />
                                    <p className={styles.dropText}>
                                        Drag files here or{" "}
                                        <span className={styles.browseLink}>Browse Files</span>
                                    </p>
                                </div>
                            </div>

                            {/* Notify Students */}
                            <div className={styles.notifyRow}>
                                <div>
                                    <p className={styles.notifyLabel}>Notify Students</p>
                                    <p className={styles.notifySub}>Send email notification to enrolled students</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={form.notifyStudents}
                                        onChange={(e) => setForm({ ...form, notifyStudents: e.target.checked })}
                                    />
                                    <span className={styles.toggleTrack}>
                                        <span className={styles.toggleThumb} />
                                    </span>
                                </label>
                            </div>

                            {/* Footer */}
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn} disabled={modalLoading}>
                                    {modalLoading ? "Saving…" : <><CheckIcon /> Save Assignment</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;