import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./styles/ExamSchedule.module.css";
import BASE_URL from "../lib/api.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 7;

const EMPTY_FORM = {
  subjectName: "",
  examDate: "",
  examTime: "",
  duration: "",
  venue: "",
  onlineLink: "",
  subjectCode: "",
  notes: "",
  reminderEnabled: false,
  reminderDaysBefore: "",
  status: "upcoming",
};

const STATUS_OPTIONS = ["upcoming", "urgent", "completed"];

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (str) => {
  if (!str) return "—";
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const getCountdown = (dateStr, timeStr) => {
  if (!dateStr) return null;
  const dt = new Date(`${dateStr}T${timeStr || "00:00"}`);
  const diff = dt - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { d, h, m };
};

const deriveStatus = (exam) => {
  if (exam.status) return exam.status.toLowerCase();
  const dt = new Date(`${exam.examDate}T${exam.examTime || "00:00"}`);
  const diff = (dt - Date.now()) / 86400000;
  if (diff < 0) return "completed";
  if (diff <= 2) return "urgent";
  return "upcoming";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const s = (status || "upcoming").toLowerCase();
  const cls =
    s === "urgent"
      ? styles.urgent
      : s === "completed"
        ? styles.completed
        : styles.upcoming;
  const label =
    s === "urgent" ? "Urgent" : s === "completed" ? "Completed" : "Upcoming";
  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {label}
    </span>
  );
};

const SortIcon = ({ field, sortField, sortDir }) => (
  <span
    className={`${styles.sortIcon} ${sortField === field ? (sortDir === "asc" ? styles.sortAscActive : styles.sortDescActive) : ""}`}
  >
    <span className={styles.sortIconUp} />
    <span className={styles.sortIconDown} />
  </span>
);

const SkeletonRows = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <tr
      key={i}
      className={styles.skeletonRow}
    >
      {Array.from({ length: 8 }).map((__, j) => (
        <td key={j}>
          <div
            className={styles.skeletonLine}
            style={{ width: j === 7 ? 60 : "80%" }}
          />
        </td>
      ))}
    </tr>
  ));

// ─── Detail Drawer ────────────────────────────────────────────────────────────

const DetailDrawer = ({ exam, onClose, onEdit }) => {
  const countdown = getCountdown(exam.examDate, exam.examTime);
  const status = deriveStatus(exam);

  return (
    <>
      <div
        className={styles.drawerOverlay}
        onClick={onClose}
      />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Exam Details"
      >
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Exam Details</h2>
          <button
            className={styles.drawerClose}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.drawerBody}>
          {/* Subject card */}
          <div className={styles.drawerSubjectCard}>
            <div className={styles.drawerSubjectIcon}>
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className={styles.drawerSubjectName}>
                {exam.subjectName || "—"}
              </div>
              <div className={styles.drawerSubjectMeta}>
                {[exam.subjectCode, exam.examType]
                  .filter(Boolean)
                  .join(" · ") || "No code"}
              </div>
            </div>
          </div>

          {/* Countdown */}
          {countdown ? (
            <div className={styles.countdownCard}>
              <div className={styles.countdownLabel}>Starts In</div>
              <div className={styles.countdownValues}>
                <div className={styles.countdownUnit}>
                  <div className={styles.countdownNum}>
                    {String(countdown.d).padStart(2, "0")}
                  </div>
                  <div className={styles.countdownUnitLabel}>days</div>
                </div>
                <div className={styles.countdownSep}>:</div>
                <div className={styles.countdownUnit}>
                  <div className={styles.countdownNum}>
                    {String(countdown.h).padStart(2, "0")}
                  </div>
                  <div className={styles.countdownUnitLabel}>hrs</div>
                </div>
                <div className={styles.countdownSep}>:</div>
                <div className={styles.countdownUnit}>
                  <div className={styles.countdownNum}>
                    {String(countdown.m).padStart(2, "0")}
                  </div>
                  <div className={styles.countdownUnitLabel}>min</div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={styles.countdownCard}
              style={{ opacity: 0.5 }}
            >
              <div className={styles.countdownLabel}>Exam Ended</div>
            </div>
          )}

          {/* Details list */}
          <div className={styles.detailList}>
            {[
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                    />
                  </svg>
                ),
                key: "Date",
                val: formatDate(exam.examDate),
              },
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                key: "Time",
                val: formatTime(exam.examTime) || "—",
              },
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                    <circle
                      cx="12"
                      cy="11"
                      r="3"
                    />
                  </svg>
                ),
                key: "Venue",
                val: exam.venue || (exam.onlineLink ? "Online" : "—"),
              },
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                key: "Duration",
                val: exam.duration ? `${exam.duration} minutes` : "—",
              },
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                key: "Invigilator",
                val: exam.invigilator || "—",
              },
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                    />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                ),
                key: "Students",
                val: exam.enrolledCount
                  ? `${exam.enrolledCount} enrolled`
                  : "—",
              },
              {
                icon: (
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                    />
                  </svg>
                ),
                key: "Status",
                val: <StatusBadge status={status} />,
              },
            ].map(({ icon, key, val }) => (
              <div
                key={key}
                className={styles.detailRow}
              >
                <span className={styles.detailKey}>
                  {icon} {key}
                </span>
                <span className={styles.detailVal}>{val}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {exam.notes && (
            <div
              style={{
                background: "var(--es-surface-2)",
                borderRadius: "var(--es-radius-sm)",
                padding: "12px",
                fontSize: 13,
                color: "var(--es-text-secondary)",
                border: "1px solid var(--es-border)",
                lineHeight: 1.6,
              }}
            >
              {exam.notes}
            </div>
          )}
        </div>

        <div className={styles.drawerFooter}>
          <button
            className={styles.drawerEditBtn}
            onClick={() => {
              onClose();
              onEdit(exam);
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button className={styles.drawerNotifyBtn}>
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.74V11a10 10 0 00-9.29-9.94A10 10 0 002 11v5.74a2 2 0 001.19 1.82l5.81 2.58a2 2 0 001.62 0l1.38-.6 1.38.6a2 2 0 001.62 0l5.81-2.58A2 2 0 0022 16.74z" />
            </svg>
            Notify
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

const ExamModal = ({ mode, initial, onClose, onSuccess }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? `${BASE_URL}/api/scheduler/exam-dates/${initial._id}`
          : `${BASE_URL}/api/scheduler/exam-dates`;
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === "edit" ? "Edit Exam" : "Add New Exam"}
          </h2>
          <button
            className={styles.drawerClose}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject Name *</label>
                <input
                  name="subjectName"
                  className={styles.formInput}
                  value={form.subjectName}
                  onChange={handle}
                  required
                  placeholder="e.g. Data Structures"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject Code</label>
                <input
                  name="subjectCode"
                  className={styles.formInput}
                  value={form.subjectCode}
                  onChange={handle}
                  placeholder="e.g. CS201"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Exam Date *</label>
                <input
                  name="examDate"
                  type="date"
                  className={styles.formInput}
                  value={form.examDate}
                  onChange={handle}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Exam Time *</label>
                <input
                  name="examTime"
                  type="time"
                  className={styles.formInput}
                  value={form.examTime}
                  onChange={handle}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duration (min)</label>
                <input
                  name="duration"
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={form.duration}
                  onChange={handle}
                  placeholder="90"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Venue / Room</label>
                <input
                  name="venue"
                  className={styles.formInput}
                  value={form.venue}
                  onChange={handle}
                  placeholder="e.g. Hall B"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Status</label>
                <select
                  name="status"
                  className={styles.formSelect}
                  value={form.status}
                  onChange={handle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option
                      key={s}
                      value={s}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Online Link</label>
                <input
                  name="onlineLink"
                  className={styles.formInput}
                  value={form.onlineLink}
                  onChange={handle}
                  placeholder="https://..."
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label className={styles.formLabel}>Notes</label>
                <textarea
                  name="notes"
                  className={styles.formTextarea}
                  value={form.notes}
                  onChange={handle}
                  placeholder="Additional instructions or reminders..."
                />
              </div>
              <div className={styles.checkRow}>
                <input
                  id="reminderEnabled"
                  name="reminderEnabled"
                  type="checkbox"
                  className={styles.formCheck}
                  checked={form.reminderEnabled}
                  onChange={handle}
                />
                <label
                  htmlFor="reminderEnabled"
                  className={styles.checkLabel}
                >
                  Enable reminder
                </label>
              </div>
              {form.reminderEnabled && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Days Before</label>
                  <input
                    name="reminderDaysBefore"
                    type="number"
                    min="1"
                    className={styles.formInput}
                    value={form.reminderDaysBefore}
                    onChange={handle}
                    placeholder="3"
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : mode === "edit"
                  ? "Save Changes"
                  : "Add Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ exam, onClose, onConfirm }) => (
  <div
    className={styles.modalOverlay}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className={styles.confirmModal}>
      <div className={styles.confirmIcon}>🗑</div>
      <div className={styles.confirmTitle}>Delete Exam?</div>
      <div className={styles.confirmText}>
        This will permanently remove <strong>{exam.subjectName}</strong> from
        your schedule. This action cannot be undone.
      </div>
      <div className={styles.confirmActions}>
        <button
          className={styles.confirmCancelBtn}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={styles.confirmDeleteBtn}
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  // Sort
  const [sortField, setSortField] = useState("examDate");
  const [sortDir, setSortDir] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);

  // UI state
  const [selectedExam, setSelectedExam] = useState(null);
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/scheduler/exam-dates`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setExams(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${BASE_URL}/api/scheduler/exam-dates/${deleteTarget._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setDeleteTarget(null);
      if (selectedExam?._id === deleteTarget._id) setSelectedExam(null);
      fetchExams();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Sort toggle ────────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  // ── Derived: subjects list ─────────────────────────────────────────────────
  const subjectOptions = useMemo(
    () => [...new Set(exams.map((e) => e.subjectName).filter(Boolean))],
    [exams],
  );

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...exams];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          (e.subjectName || "").toLowerCase().includes(q) ||
          (e.venue || "").toLowerCase().includes(q) ||
          (e.subjectCode || "").toLowerCase().includes(q),
      );
    }
    if (filterStatus)
      list = list.filter((e) => deriveStatus(e) === filterStatus);
    if (filterSubject)
      list = list.filter((e) => e.subjectName === filterSubject);

    list.sort((a, b) => {
      let av, bv;
      if (sortField === "examDate") {
        av = new Date(`${a.examDate}T${a.examTime || "00:00"}`);
        bv = new Date(`${b.examDate}T${b.examTime || "00:00"}`);
      } else if (sortField === "subjectName") {
        av = (a.subjectName || "").toLowerCase();
        bv = (b.subjectName || "").toLowerCase();
      } else if (sortField === "examType") {
        av = (a.examType || "").toLowerCase();
        bv = (b.examType || "").toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [exams, search, filterStatus, filterSubject, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handlePageChange = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  // Pagination buttons: show prev, up to 3 pages, next
  const pageNumbers = useMemo(() => {
    const nums = [];
    const start = Math.max(1, Math.min(page - 1, totalPages - 2));
    const end = Math.min(totalPages, start + 2);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Exam Schedule</h1>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditTarget(null);
            setModalMode("add");
          }}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
            />
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
            />
          </svg>
          Add Exam
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search exams..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.filterSep} />

        <select
          className={styles.filterSelect}
          value={filterSubject}
          onChange={(e) => {
            setFilterSubject(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Subject</option>
          {subjectOptions.map((s) => (
            <option
              key={s}
              value={s}
            >
              {s}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="urgent">Urgent</option>
          <option value="completed">Completed</option>
        </select>

        <button className={styles.dateRangeBtn}>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
            />
            <line
              x1="16"
              y1="2"
              x2="16"
              y2="6"
            />
            <line
              x1="8"
              y1="2"
              x2="8"
              y2="6"
            />
            <line
              x1="3"
              y1="10"
              x2="21"
              y2="10"
            />
          </svg>
          Date Range
        </button>
      </div>

      {/* ── Table ── */}
      <div className={styles.tablePanel}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  className={`${styles.sortable} ${sortField === "subjectName" ? styles.sortActive : ""}`}
                  onClick={() => handleSort("subjectName")}
                >
                  <div className={styles.thInner}>
                    Subject
                    <SortIcon
                      field="subjectName"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </div>
                </th>
                <th
                  className={`${styles.sortable} ${sortField === "examType" ? styles.sortActive : ""}`}
                  onClick={() => handleSort("examType")}
                >
                  <div className={styles.thInner}>
                    Exam Type
                    <SortIcon
                      field="examType"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </div>
                </th>
                <th
                  className={`${styles.sortable} ${sortField === "examDate" ? styles.sortActive : ""}`}
                  onClick={() => handleSort("examDate")}
                >
                  <div className={styles.thInner}>
                    Date & Time
                    <SortIcon
                      field="examDate"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </div>
                </th>
                <th>Venue / Room</th>
                <th>Duration</th>
                <th>Invigilator</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📋</div>
                      <div className={styles.emptyText}>
                        {search || filterStatus || filterSubject
                          ? "No exams match your filters"
                          : "No exams scheduled yet"}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((exam) => {
                  const status = deriveStatus(exam);
                  const isSelected = selectedExam?._id === exam._id;
                  return (
                    <tr
                      key={exam._id}
                      className={isSelected ? styles.rowSelected : ""}
                      onClick={() => setSelectedExam(isSelected ? null : exam)}
                    >
                      <td className={styles.tdSubject}>
                        {exam.subjectName || "—"}
                      </td>
                      <td className={styles.tdMeta}>{exam.examType || "—"}</td>
                      <td className={styles.tdDateTime}>
                        <div className={styles.dateMain}>
                          {formatDate(exam.examDate)}
                        </div>
                        {exam.examTime && (
                          <div className={styles.dateTime}>
                            {formatTime(exam.examTime)}
                          </div>
                        )}
                      </td>
                      <td className={styles.tdMeta}>
                        {exam.venue || (exam.onlineLink ? "Online" : "—")}
                      </td>
                      <td className={styles.tdMeta}>
                        {exam.duration ? `${exam.duration} min` : "—"}
                      </td>
                      <td className={styles.tdMeta}>
                        {exam.invigilator || "—"}
                      </td>
                      <td>
                        <StatusBadge status={status} />
                      </td>
                      <td>
                        <div
                          className={styles.actions}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className={`${styles.iconBtn} ${styles.editBtn}`}
                            aria-label="Edit exam"
                            onClick={() => {
                              setEditTarget(exam);
                              setModalMode("edit");
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                            aria-label="Delete exam"
                            onClick={() => setDeleteTarget(exam)}
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className={styles.tableFooter}>
          <span className={styles.footerText}>
            {loading
              ? "Loading…"
              : `Showing ${filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} exam${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                onClick={() => handlePageChange(n)}
              >
                {n}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {selectedExam && (
        <DetailDrawer
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          onEdit={(exam) => {
            setEditTarget(exam);
            setModalMode("edit");
          }}
        />
      )}

      {/* ── Add / Edit Modal ── */}
      {modalMode && (
        <ExamModal
          mode={modalMode}
          initial={modalMode === "edit" ? editTarget : null}
          onClose={() => {
            setModalMode(null);
            setEditTarget(null);
          }}
          onSuccess={fetchExams}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <DeleteConfirm
          exam={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ExamSchedule;
