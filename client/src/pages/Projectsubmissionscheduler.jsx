import React, { useEffect, useState } from "react";
import BASE_URL from "../lib/api.js";
import styles from "./styles/ProjectSubmissions.module.css";
import {
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  Layers,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// ─── Constants ────────────────────────────────────────────────────────────────

const PHASES = ["Not Started", "In Progress", "Submitted", "Graded"];

const PHASE_META = {
  "Not Started": { dot: styles.dotGray, bar: styles.barPurple },
  "In Progress": { dot: styles.dotBlue, bar: styles.barPurple },
  Submitted: { dot: styles.dotBlue, bar: styles.barBlue },
  Graded: { dot: styles.dotGreen, bar: styles.barGreen },
};

const EMPTY_FORM = {
  projectTitle: "",
  submissionDate: "",
  projectLink: "",
  phase: "Not Started",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const daysLeft = (iso) => {
  if (!iso) return null;
  const diff = Math.ceil((new Date(iso) - new Date()) / 86400000);
  return diff;
};

const dateLabel = (item) => {
  const phase = item.phase;
  const diff = daysLeft(item.submissionDate);
  if (phase === "Graded")
    return {
      icon: <Clock size={12} />,
      text: `Graded ${formatDate(item.submissionDate)}`,
      cls: styles.dateGreen,
    };
  if (phase === "Submitted")
    return {
      icon: "⏱",
      text: `Submitted ${formatDate(item.submissionDate)}`,
      cls: styles.dateBlue,
    };
  if (diff === null) return null;
  if (diff < 0)
    return {
      icon: <Clock size={12} />,
      text: `Overdue · ${formatDate(item.submissionDate)}`,
      cls: styles.dateRed,
    };
  return {
    icon: "⏱",
    text: `Due in ${diff} day${diff !== 1 ? "s" : ""}`,
    cls: styles.dateOrange,
  };
};

const initials = (title = "") =>
  title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarColor = (str = "") => {
  const colors = [
    "#f97316",
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
  ];
  let hash = 0;
  for (let c of str) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
};

// ─── New Project Modal ─────────────────────────────────────────────────────────

const NewProjectModal = ({ onClose, onSave, defaultPhase }) => {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    phase: defaultPhase || "Not Started",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.projectTitle.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!form.submissionDate) {
      setError("Submission date is required.");
      return;
    }
    setError("");
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Add New Project</h2>
            <p className={styles.modalSub}>
              Fill in the details to add a new project to the board.
            </p>
          </div>
          <button
            className={styles.modalClose}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={submit}
          className={styles.modalForm}
        >
          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Project Title</label>
              <input
                name="projectTitle"
                type="text"
                className={styles.formInput}
                placeholder="e.g. Mobile App Prototype"
                value={form.projectTitle}
                onChange={handle}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Submission Date</label>
              <input
                name="submissionDate"
                type="date"
                className={styles.formInput}
                value={form.submissionDate}
                onChange={handle}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phase</label>
            <div className={styles.radioGroup}>
              {PHASES.map((p) => (
                <label
                  key={p}
                  className={`${styles.radioPill} ${form.phase === p ? styles.radioPillActive : ""}`}
                >
                  <input
                    type="radio"
                    name="phase"
                    value={p}
                    checked={form.phase === p}
                    onChange={handle}
                    hidden
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Project Link</label>
              <input
                name="projectLink"
                type="url"
                className={styles.formInput}
                placeholder="https://github.com/..."
                value={form.projectLink}
                onChange={handle}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={loading}
            >
              <Check size={14} /> {loading ? "Saving…" : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Detail Panel ─────────────────────────────────────────────────────────────

const DetailPanel = ({ project, onClose, onDelete, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ ...project });
  const [saving, setSaving] = useState(false);

  const handle = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    setSaving(true);
    await onEdit(project._id, editForm);
    setSaving(false);
    setEditMode(false);
  };

  const dl = daysLeft(project.submissionDate);
  const badge =
    dl !== null && project.phase === "In Progress"
      ? dl < 0
        ? "Overdue"
        : `${dl} days left`
      : null;

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailHeader}>
        <div className={styles.detailMeta}>
          <span className={styles.detailCourse}>{project.phase}</span>
          <span
            className={`${styles.detailStatusBadge} ${styles[`badge${project.phase?.replace(" ", "")}`]}`}
          >
            {project.phase}
          </span>
        </div>
        <button
          className={styles.modalClose}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <h2 className={styles.detailTitle}>{project.projectTitle}</h2>

      {!editMode ? (
        <>
          <div className={styles.detailSection}>
            <div className={styles.detailSectionTitle}>Deadline</div>
            <div className={styles.detailDeadline}>
              <span className={styles.detailDeadlineIcon}>
                <CalendarDays size={16} />
              </span>
              <span>
                {project.submissionDate
                  ? new Date(project.submissionDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "—"}
              </span>
              {badge && <span className={styles.daysLeftBadge}>{badge}</span>}
            </div>
          </div>

          {project.projectLink && (
            <div className={styles.detailSection}>
              <div className={styles.detailSectionTitle}>Project Link</div>
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className={styles.detailLink}
              >
                🔗 {project.projectLink}
              </a>
            </div>
          )}

          <div className={styles.detailSection}>
            <div className={styles.detailSectionTitle}>Phase</div>
            <span className={styles.detailPhaseTag}>
              {project.phase || "—"}
            </span>
          </div>

          <div className={styles.detailActions}>
            <button
              className={styles.btnSubmitProject}
              onClick={() => setEditMode(true)}
            >
              <ClipboardList size={14} /> Edit Details
            </button>
            <Button
              variant="destructive"
              onClick={() => onDelete(project._id)}
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.editForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Project Title</label>
            <input
              name="projectTitle"
              type="text"
              className={styles.formInput}
              value={editForm.projectTitle}
              onChange={handle}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Submission Date</label>
            <input
              name="submissionDate"
              type="date"
              className={styles.formInput}
              value={editForm.submissionDate?.slice(0, 10)}
              onChange={handle}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Project Link</label>
            <input
              name="projectLink"
              type="url"
              className={styles.formInput}
              value={editForm.projectLink}
              onChange={handle}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phase</label>
            <div className={styles.radioGroup}>
              {PHASES.map((p) => (
                <label
                  key={p}
                  className={`${styles.radioPill} ${editForm.phase === p ? styles.radioPillActive : ""}`}
                >
                  <input
                    type="radio"
                    name="phase"
                    value={p}
                    checked={editForm.phase === p}
                    onChange={handle}
                    hidden
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.detailActions}>
            <button
              className={styles.btnSubmitProject}
              onClick={saveEdit}
              disabled={saving}
            >
              {saving ? (
                "Saving…"
              ) : (
                <>
                  <Check size={14} /> Save Changes
                </>
              )}
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Kanban Card ─────────────────────────────────────────────────────────────

const ProjectCard = ({ item, onView, isActive }) => {
  const dl = dateLabel(item);
  const bg = avatarColor(item.projectTitle);
  const ini = initials(item.projectTitle);

  return (
    <Card
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      onClick={() => onView(item._id)}
    >
      <CardContent className={styles.cardContent}>
        <div className={styles.cardTitle}>{item.projectTitle}</div>
        {item.phase && (
          <span className={styles.cardCourse}>
            <Badge
              variant="secondary"
              className={styles.cardCourse}
            >
              {item.phase}
            </Badge>
          </span>
        )}

        <div className={styles.cardAvatars}>
          <Avatar className={styles.avatar}>
            <AvatarFallback
              style={{ background: bg, color: "#fff", fontSize: 10 }}
            >
              {ini}
            </AvatarFallback>
          </Avatar>
        </div>

        {dl && (
          <div className={`${styles.cardDate} ${dl.cls}`}>
            <span>{dl.icon}</span>
            <span>{dl.text}</span>
          </div>
        )}

        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${PHASE_META[item.phase]?.bar || styles.barPurple}`}
            style={{
              width:
                item.phase === "Graded"
                  ? "100%"
                  : item.phase === "Submitted"
                    ? "75%"
                    : item.phase === "In Progress"
                      ? "50%"
                      : "15%",
            }}
          />
        </div>

        {item.projectLink && <span className={styles.cardBadge}>🔗 Link</span>}
      </CardContent>
    </Card>
  );
};

// ─── Kanban Column ───────────────────────────────────────────────────────────

const KanbanColumn = ({ phase, items, onView, activeId, onAddCard }) => {
  const meta = PHASE_META[phase];

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnLeft}>
          <span className={`${styles.dot} ${meta.dot}`} />
          <span className={styles.columnTitle}>{phase}</span>
          <span className={styles.columnCount}>{items.length}</span>
        </div>
        <button className={styles.columnMenu}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className={styles.cards}>
        {items.map((item) => (
          <ProjectCard
            key={item._id}
            item={item}
            onView={onView}
            isActive={activeId === item._id}
          />
        ))}
      </div>

      <button
        className={styles.addCard}
        onClick={() => onAddCard(phase)}
      >
        <Plus size={13} />
        Drop or add a card
      </button>
    </div>
  );
};

// ─── View Toggle ─────────────────────────────────────────────────────────────

const ViewToggle = ({ view, setView }) => (
  <div className={styles.viewToggle}>
    {["List", "Kanban", "Calendar"].map((v) => (
      <button
        key={v}
        className={`${styles.viewBtn} ${view === v ? styles.viewBtnActive : ""}`}
        onClick={() => setView(v)}
      >
        {v === "List" ? (
          <List size={14} />
        ) : v === "Kanban" ? (
          <LayoutGrid size={14} />
        ) : (
          <CalendarDays size={14} />
        )}{" "}
        {v}
      </button>
    ))}
  </div>
);

// ─── List View ────────────────────────────────────────────────────────────────

const ListView = ({ projects, onView, onDelete }) => (
  <div className={styles.listView}>
    <div className={styles.listHeader}>
      <span>Project</span>
      <span>Phase</span>
      <span>Due Date</span>
      <span>Link</span>
      <span>Actions</span>
    </div>
    {projects.map((item) => (
      <div
        key={item._id}
        className={styles.listRow}
      >
        <span className={styles.listTitle}>{item.projectTitle}</span>
        <span
          className={`${styles.detailStatusBadge} ${styles[`badge${item.phase?.replace(" ", "")}`]}`}
        >
          {item.phase}
        </span>
        <span>{formatDate(item.submissionDate) || "—"}</span>
        <span>
          {item.projectLink ? (
            <a
              href={item.projectLink}
              target="_blank"
              rel="noreferrer"
              className={styles.detailLink}
            >
              Link
            </a>
          ) : (
            "—"
          )}
        </span>
        <span className={styles.listActions}>
          <button
            className={styles.listBtn}
            onClick={() => onView(item._id)}
          >
            View
          </button>
          <button
            className={`${styles.listBtn} ${styles.listBtnDanger}`}
            onClick={() => onDelete(item._id)}
          >
            Del
          </button>
        </span>
      </div>
    ))}
    {projects.length === 0 && (
      <div className={styles.emptyState}>No projects yet.</div>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProjectSubmissionScheduler = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState("Not Started");
  const [view, setView] = useState("Kanban");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/scheduler/project-submission`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw Error("Fetch failed");
      const data = await res.json();
      setAllProjects(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = async (form) => {
    try {
      const res = await fetch(`${BASE_URL}/api/scheduler/project-submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw Error("Create failed");
      setShowModal(false);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/scheduler/project-submission/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw Error("Fetch failed");
      const data = await res.json();
      const proj = Array.isArray(data.data) ? data.data[0] : data.data;
      setSelectedProject(proj);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/scheduler/project-submission/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw Error("Delete failed");
      setSelectedProject(null);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (id, form) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/scheduler/project-submission/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );
      if (!res.ok) throw Error("Update failed");
      fetchAll();
      // refresh panel
      const updated = await fetch(
        `${BASE_URL}/api/scheduler/project-submission/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const d = await updated.json();
      setSelectedProject(Array.isArray(d.data) ? d.data[0] : d.data);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const byPhase = PHASES.reduce((acc, p) => {
    acc[p] = allProjects.filter((pr) => pr.phase === p);
    return acc;
  }, {});

  const totalActive = allProjects.filter((p) => p.phase !== "Graded").length;

  return (
    <div
      className={`${styles.wrapper} ${selectedProject ? styles.wrapperSplit : ""}`}
    >
      {/* ── Main ───────────────────────────────────────────────────────── */}
      <div className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Project Submissions</h1>
            <p className={styles.pageSubtitle}>
              <Layers size={15} />
              {loading
                ? "Loading…"
                : `${totalActive} active projects across ${PHASES.length} stages`}
            </p>
          </div>
          <div className={styles.topRight}>
            <ViewToggle
              view={view}
              setView={setView}
            />
            <button
              className={styles.btnNew}
              onClick={() => {
                setModalPhase("Not Started");
                setShowModal(true);
              }}
            >
              <Plus size={15} /> New Project
            </button>
          </div>
        </div>

        {/* Board */}
        {loading ? (
          <div className={styles.loadingState}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={styles.skeletonCol}
              />
            ))}
          </div>
        ) : view === "Kanban" ? (
          <div className={styles.board}>
            {PHASES.map((phase) => (
              <KanbanColumn
                key={phase}
                phase={phase}
                items={byPhase[phase]}
                onView={handleView}
                activeId={selectedProject?._id}
                onAddCard={(p) => {
                  setModalPhase(p);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <ListView
            projects={allProjects}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ── Detail Panel ────────────────────────────────────────────────── */}
      {selectedProject && (
        <DetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
          defaultPhase={modalPhase}
        />
      )}
    </div>
  );
};

export default ProjectSubmissionScheduler;
