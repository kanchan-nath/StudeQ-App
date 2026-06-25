import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import styles from "./styles/notes.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getSocket, connectSocket } from "../lib/socket.js";

// ── Error system imports ───────────────────────────────────────────────────────
import ErrorPage from "../errors/components/ErrorPage.jsx";
import { ERROR_TYPES, resolveErrorType } from "../errors/config/errorConfig.js";
import useErrorHandler from "../errors/hooks/useErrorHandler.jsx";

export const LLMMarkdown = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        mark({ children }) {
          return (
            <mark
              style={{
                background: "#ffe066",
                padding: "0 2px",
                borderRadius: "3px",
              }}
            >
              {children}
            </mark>
          );
        },
        u({ children }) {
          return <u>{children}</u>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

/* ─── tiny toast helper ─────────────────────────────────────── */
export const Toast = ({ message, type = "success", onClose }) => (
  <div
    className={`${styles.toast} ${styles[`toast--${type}`]}`}
    role="alert"
  >
    <span className={styles["toast__icon"]}>
      {type === "success" ? "✦" : "x"}
    </span>
    <span className={styles["toast__msg"]}>{message}</span>
    <button
      className={styles["toast__close"]}
      onClick={onClose}
      aria-label="Dismiss"
    >
      ✕
    </button>
  </div>
);

/* ─── welcome/landing panel ─────────────────────────────────── */
export const WelcomePanel = ({ onStart }) => (
  <section
    className={styles["welcome-panel"]}
    aria-label="Welcome screen"
  >
    <div className={styles["welcome-panel__inner"]}>
      <div
        className={styles["welcome-panel__icon-wrap"]}
        aria-hidden="true"
      >
        <span className={styles["welcome-panel__sparkle"]}>✦</span>
      </div>
      <h1 className={styles["welcome-panel__heading"]}>
        Your Knowledge, Distilled
      </h1>
      <p className={styles["welcome-panel__sub"]}>
        Paste any text — lecture notes, research, articles — and get a clean,
        structured summary with key insights in seconds.
      </p>

      <div
        className={styles["welcome-panel__features"]}
        data-testid="welcome-card"
      >
        <div
          className={styles["welcome-feature"]}
          data-testid="welcome-card1"
        >
          <span className={styles["welcome-feature__icon"]}>📋</span>
          <div>
            <strong>Smart Summaries</strong>
            <p>AI condenses long content into crisp, readable notes</p>
          </div>
        </div>
        <div
          className={styles["welcome-feature"]}
          data-testid="welcome-card2"
        >
          <span className={styles["welcome-feature__icon"]}>🔑</span>
          <div>
            <strong>Key Point Extraction</strong>
            <p>Never miss the important bits — surfaced automatically</p>
          </div>
        </div>
        <div
          className={styles["welcome-feature"]}
          data-testid="welcome-card3"
        >
          <span className={styles["welcome-feature__icon"]}>📥</span>
          <div>
            <strong>Export Anywhere</strong>
            <p>Copy to clipboard or download as PDF instantly</p>
          </div>
        </div>
        <div
          className={styles["welcome-feature"]}
          data-testid="welcome-card4"
        >
          <span className={styles["welcome-feature__icon"]}>📌</span>
          <div>
            <strong>Pin & Organise</strong>
            <p>Keep your most important notes front and centre</p>
          </div>
        </div>
      </div>

      <button
        className={styles["welcome-panel__cta"]}
        onClick={onStart}
      >
        <span>Create your first note</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  </section>
);

export const StyledSummary = ({ content }) => {
  const lines = (content ?? "").split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h4
          key={i}
          className={styles["sum-h3"]}
        >
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3
          key={i}
          className={styles["sum-h2"]}
        >
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2
          key={i}
          className={styles["sum-h1"]}
        >
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const bullets = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        bullets.push(
          <li key={i}>
            <LLMMarkdown content={lines[i].trim().slice(2)} />
          </li>,
        );
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className={styles["sum-list"]}
        >
          {bullets}
        </ul>,
      );
      continue;
    } else {
      elements.push(
        <div
          key={i}
          className={styles["sum-para"]}
        >
          <LLMMarkdown content={line} />
        </div>,
      );
    }
    i++;
  }

  return <div className={styles["sum-body"]}>{elements}</div>;
};

/* ─── single note document view ─────────────────────────────── */
export const NoteDocument = ({
  note,
  onEdit,
  onDelete,
  onDownload,
  onPin,
  onCopy,
  isCopied,
  docRef,
}) => {
  const keyPoints = Array.isArray(note.keyPoints)
    ? note.keyPoints
    : typeof note.keyPoints === "string"
      ? note.keyPoints.split("\n").filter(Boolean)
      : [];

  return (
    <article
      ref={docRef}
      className={styles["note-doc"]}
      aria-label={`Note: ${note.title}`}
    >
      <header className={styles["note-doc__header"]}>
        <div className={styles["note-doc__meta"]}>
          <span className={styles["note-doc__badge"]}>Summary</span>
          {note.isPinned && (
            <span
              className={`${styles["note-doc__badge"]} ${styles["note-doc__badge--pinned"]}`}
            >
              📌 Pinned
            </span>
          )}
        </div>
        <h1 className={styles["note-doc__title"]}>
          <ReactMarkdown>{note.title}</ReactMarkdown>
        </h1>
        <div className={styles["note-doc__actions"]}>
          <button
            className={`${styles["note-doc__btn"]} ${styles["note-doc__btn--ghost"]}`}
            onClick={() => onPin(note)}
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}
          >
            {note.isPinned ? "📌 Unpin" : "📌 Pin"}
          </button>
          <button
            className={`${styles["note-doc__btn"]} ${styles["note-doc__btn--ghost"]}`}
            onClick={() => onCopy(note)}
            aria-label="Copy note"
          >
            {isCopied ? "✓ Copied" : "⎘ Copy"}
          </button>
          <button
            className={`${styles["note-doc__btn"]} ${styles["note-doc__btn--ghost"]}`}
            onClick={() => onDownload(note)}
            aria-label="Download PDF"
          >
            ↓ PDF
          </button>
          <button
            className={`${styles["note-doc__btn"]} ${styles["note-doc__btn--primary"]}`}
            onClick={() => onEdit(note)}
            aria-label="Edit note"
          >
            ✎ Edit
          </button>
          <button
            className={`${styles["note-doc__btn"]} ${styles["note-doc__btn--danger"]}`}
            onClick={() => onDelete(note._id)}
            aria-label="Delete note"
          >
            ✕ Delete
          </button>
        </div>
      </header>

      <div className={styles["note-doc__body"]}>
        <section className={styles["note-doc__section"]}>
          <h2 className={styles["note-doc__section-title"]}>
            <span
              className={styles["note-doc__section-icon"]}
              aria-hidden="true"
            >
              ≡
            </span>
            Summary
          </h2>
          <div className={styles["note-doc__summary-text"]}>
            <StyledSummary content={note.summary} />
          </div>
        </section>

        {keyPoints.length > 0 && (
          <section className={styles["note-doc__section"]}>
            <h2 className={styles["note-doc__section-title"]}>
              <span
                className={styles["note-doc__section-icon"]}
                aria-hidden="true"
              >
                ◆
              </span>
              Key Points
            </h2>
            <ul className={styles["note-doc__keypoints"]}>
              {keyPoints.map((pt, i) => (
                <li
                  key={i}
                  className={styles["note-doc__keypoint"]}
                >
                  <span
                    className={styles["note-doc__keypoint-num"]}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ReactMarkdown>{pt}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
};

/* ─── input / edit form ─────────────────────────────────────── */
export const NoteInputForm = ({
  content,
  onChange,
  onSubmit,
  loading,
  editId,
  onCancelEdit,
  inputRef,
}) => (
  <div className={styles["note-input-wrap"]}>
    <div className={styles["note-input-card"]}>
      <div className={styles["note-input-card__header"]}>
        <span className={styles["note-input-card__label"]}>
          {editId ? "✎ Edit Note Content" : "✦ New Note"}
        </span>
        {editId && (
          <button
            className={styles["note-input-card__cancel"]}
            onClick={onCancelEdit}
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        )}
      </div>
      <form
        onSubmit={onSubmit}
        className={styles["note-input-card__form"]}
      >
        <textarea
          ref={inputRef}
          name="content"
          value={content}
          placeholder="Paste your lecture notes, article, or any text here…"
          required
          onChange={onChange}
          className={styles["note-input-card__textarea"]}
          rows={6}
          aria-label="Content to summarise"
        />
        <div className={styles["note-input-card__footer"]}>
          <span className={styles["note-input-card__hint"]}>
            {content.length > 0
              ? `${content.length} characters`
              : "Tip: longer text = richer summary"}
          </span>
          <button
            type="submit"
            disabled={loading}
            className={`${styles["note-input-card__submit"]}${loading ? ` ${styles.loading}` : ""}`}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span
                  className={styles.spinner}
                  aria-hidden="true"
                />
                Summarising…
              </>
            ) : editId ? (
              "✦ Update Note"
            ) : (
              "✦ Summarise & Save"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const SidebarContent = React.memo(({
  fetching, fetchError, notes, pinnedNotes, unpinnedNotes,
  activeNoteId, handleSidebarNoteClick, handleNewNote,
  setMobileSidebarOpen
}) => (
  <div
    className={styles.sidebarContent}
    aria-label="Saved notes"
  >
    <div className={styles.sidebarHeader}>
      <h3 className={styles.sidebarTitle}>📝 Your Notes</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button
          className={styles.sidebarNewBtn}
          onClick={handleNewNote}
          aria-label="Create new note"
          title="New note"
        >
          +
        </button>
        {/* ── NEW: close btn inside drawer header (mobile only via CSS) ── */}
        <button
          className={styles.sidebarCloseBtn}
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close notes sidebar"
        >
          ✕
        </button>
      </div>
    </div>

    {fetching && <p className={styles.sidebarEmpty}>Loading…</p>}
    {fetchError && (
      <p
        className={styles.sidebarEmpty}
        role="alert"
      >
        {fetchError}
      </p>
    )}
    {!fetching && notes.length === 0 && (
      <p className={styles.sidebarEmpty}>No notes yet.</p>
    )}

    {pinnedNotes.length > 0 && (
      <>
        <p className={styles.sidebarGroupLabel}>📌 Pinned</p>
        {pinnedNotes.map((note) => (
          <div
            key={note._id}
            className={`${styles.sidebarItem} ${activeNoteId === note._id ? styles.sidebarItemActive : ""}`}
            onClick={() => handleSidebarNoteClick(note)}
          >
            <div className={styles.sidebarItemTitle}>
              {note.title.replace(/\*\*/g, "")}
            </div>
            <div className={styles.sidebarItemMeta}>
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </>
    )}

    {unpinnedNotes.length > 0 && (
      <>
        {pinnedNotes.length > 0 && (
          <p className={styles.sidebarGroupLabel}>All Notes</p>
        )}
        {unpinnedNotes.map((note) => (
          <div
            key={note._id}
            className={`${styles.sidebarItem} ${activeNoteId === note._id ? styles.sidebarItemActive : ""}`}
            onClick={() => handleSidebarNoteClick(note)}
          >
            <div className={styles.sidebarItemTitle}>
              {note.title.replace(/\*\*/g, "")}
            </div>
            <div className={styles.sidebarItemMeta}>
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </>
    )}
  </div>
));

const checkApiResponse = (res, { navigate, notifyError, setPageError }) => {
  if (res.status === 401) { notifyError("Session expired. Sign in again."); navigate("/login"); return false; }
  if (res.status === 403) { setPageError(ERROR_TYPES.FORBIDDEN); return false; }
  if (res.status >= 500) { setPageError(ERROR_TYPES.SERVER_ERROR); return false; }
  if (!res.ok) { setPageError(ERROR_TYPES.UNKNOWN); return false; }
  return true;
};

/* ═══════════════════════════════════════════════════════════════
  MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Notes = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [generatedIds, setGeneratedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Error handler hook ───────────────────────────────────────────────────────
  const { notifyError, notifySuccess } = useErrorHandler();

  // ── Blocking error state — replaces the whole page ──────────────────────────
  // null = no error | ERROR_TYPES key = show full error page
  const [pageError, setPageError] = useState(null);

  // ── NEW: mobile drawer state ──
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const noteDocRef = useRef(null);
  const inputRef = useRef(null);

  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const activeNoteId = id || null;
  const panelView = location.pathname === "/notes/new"
    ? "form"
    : id && location.pathname.endsWith("/edit")
      ? "form"
      : id
        ? "note"
        : "welcome";

  const editId = location.pathname.endsWith("/edit") ? id : "";

  // ── NEW: lock body scroll when mobile drawer is open ──
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  const handler = (data) => {
    const { title, summary, keyPoints, _id, isPinned } = data;
    setSummaryData({ title, summary, keyPoints, _id, isPinned });
    setGeneratedIds((prev) => new Set(prev).add(_id));
    showToast("Note created!");
    fetchNotes();
    navigate(`/notes/${_id}`);
  }
  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    if (!socket) return;

    socket.on("ai-response", handler);

    return () => socket.off("ai-response", handler);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (editId) {
      try {
        const res = await apiFetch(`/api/notes/${editId}`, {
          method: "PATCH",
          body: JSON.stringify({ content }),
        });

        if (!checkApiResponse(res, { navigate, notifyError, setPageError })) return;

        showToast("Note updated successfully!");
        setContent("");
        await fetchNotes();
        navigate(`/notes/${id}`);
      } catch (err) {
        showToast(err.message || "Update failed", "error");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await apiFetch("/api/notes", {
          method: "POST",
          body: JSON.stringify({ content }),
        });

        if (!checkApiResponse(res, { navigate, notifyError, setPageError })) return;

        const data = await res.json();
        const { title, summary, keyPoints, _id, isPinned } = data.data;

        setSummaryData({ title, summary, keyPoints, _id, isPinned });
        setGeneratedIds((prev) => new Set(prev).add(_id));
        setContent("");
        showToast("Note created!");
        await fetchNotes();
        navigate(`/notes/${_id}`);
      } catch (err) {
        setError(err.message || "Content generation failed");
        showToast(err.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchNotes = useCallback(async () => {
    setFetching(true);
    try {
      const res = await apiFetch("/api/notes");

      if (!checkApiResponse(res, { navigate, notifyError, setPageError })) return;

      const data = await res.json();
      setNotes(data.data);
    } catch (err) {
      const type = resolveErrorType(err);
      if (type === ERROR_TYPES.NETWORK) {
        setPageError(ERROR_TYPES.NETWORK);
      } else {
        setFetchError(err.message);
      }
    } finally {
      setFetching(false);
    }
  }, [navigate, notifyError]);

  const handleSubmitDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!checkApiResponse(res, { navigate, notifyError, setPageError })) return;

      showToast("Note deleted");
      if (activeNoteId === id) {
        setSummaryData(null);
        navigate("/notes");
      }
      await fetchNotes();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const handleSubmitEdit = (note) => {
    setContent(note.summary);
    navigate(`/notes/${note._id}/edit`);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCancelEdit = () => {
    setContent("");
    navigate(activeNoteId ? `/notes/${activeNoteId}` : "/notes");
  };

  const handleCopy = async (note) => {
    try {
      const stripMarkdown = (text) => {
        if (!text) return "";
        return text
          .replace(/#{1,6}\s+/g, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/__(.*?)__/g, "$1")
          .replace(/_(.*?)_/g, "$1")
          .replace(/~~(.*?)~~/g, "$1")
          .replace(/`{1,3}[^`]*`{1,3}/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/^[-*+]\s+/gm, "• ")
          .replace(/^\d+\.\s+/gm, "")
          .replace(/^>\s+/gm, "")
          .replace(/---+/g, "")
          .replace(/<[^>]+>/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      };

      const keyPointsText = Array.isArray(note.keyPoints)
        ? note.keyPoints
          .map((pt, i) => `${i + 1}. ${stripMarkdown(pt)}`)
          .join("\n")
        : stripMarkdown(note.keyPoints);

      const text = [
        stripMarkdown(note.title),
        "",
        "Summary:",
        stripMarkdown(note.summary),
        ...(keyPointsText ? ["\nKey Points:", keyPointsText] : []),
      ].join("\n");

      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showToast("Copy failed", "error");
    }
  };

  const handleDownload = async (note) => {
    const element = noteDocRef.current;
    if (!element) return showToast("Nothing to export", "error");

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    showToast("Generating PDF…");

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = pageWidth / canvas.width;
      const imgHeightMm = canvas.height * ratio;

      let yOffset = 0;
      while (yOffset < imgHeightMm) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -yOffset, pageWidth, imgHeightMm);
        yOffset += pageHeight;
      }

      pdf.save(`${note.title.replace(/\*\*/g, "")}.pdf`);
      showToast("PDF downloaded!");
    } catch (err) {
      console.error(err);
      showToast("PDF export failed", "error");
    }
  };

  const tooglePin = async (note) => {
    const newPinned = !note.isPinned;
    try {
      const res = await apiFetch(`/api/notes/${note._id}/pin`, {
        method: "PATCH",
        body: JSON.stringify({ newPinned }),
      });
      if (!checkApiResponse(res, { navigate, notifyError, setPageError })) return;

      showToast(newPinned ? "Note pinned!" : "Note unpinned");
      if (summaryData && summaryData._id === note._id) {
        setSummaryData((prev) => ({ ...prev, isPinned: newPinned }));
      }
      fetchNotes();
    } catch (err) {
      showToast("Pin toggle failed", "error");
    }
  };

  const handleSidebarNoteClick = (note) => {
    setSummaryData(note);
    setContent("");
    navigate(`/notes/${note._id}`);
    setMobileSidebarOpen(false);
  };

  const handleNewNote = () => {
    setSummaryData(null);
    setContent("");
    navigate("/notes/new");
    setMobileSidebarOpen(false);
  };

  const activeNote = activeNoteId
    ? notes.find((n) => n._id === activeNoteId) || summaryData
    : summaryData;

  useEffect(() => {
    fetchNotes();
  }, []);

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  // ── Full-page error — replaces page entirely ─────────────────────────────────
  if (pageError) {
    return <ErrorPage type={pageError} onRetry={fetchNotes} />;
  }

  // ── Shared sidebar content — rendered in both desktop + mobile drawer ──

  return (
    <div className={styles["notes-page"]}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── MAIN PANEL ── */}
      <main
        className={styles["notes-main"]}
        role="main"
        aria-label="Note content"
      >
        {/* ── NEW: mobile topbar — sticky, visible only on ≤768px via CSS ── */}
        <div className={styles["mobile-topbar"]}>
          <span className={styles["mobile-topbar__title"]}>📝 Notes</span>
          <div className={styles["mobile-topbar__right"]}>
            <button
              className={styles["mobile-topbar__btn"]}
              onClick={handleNewNote}
              aria-label="New note"
              title="New note"
            >
              ✏️
            </button>
            <button
              className={styles["mobile-topbar__btn"]}
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open notes list"
              title="Your notes"
            >
              ☰
            </button>
          </div>
        </div>

        {panelView === "welcome" && (
          <WelcomePanel onStart={() => navigate("/notes/new")} />
        )}

        {panelView === "form" && (
          <NoteInputForm
            content={content}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            editId={editId}
            onCancelEdit={handleCancelEdit}
            inputRef={inputRef}
          />
        )}

        {panelView === "note" && activeNote && activeNote.title && (
          <NoteDocument
            note={activeNote}
            onEdit={handleSubmitEdit}
            onDelete={handleSubmitDelete}
            onDownload={handleDownload}
            onPin={tooglePin}
            onCopy={handleCopy}
            isCopied={isCopied}
            docRef={noteDocRef}
          />
        )}

        {error && (
          <div
            className={styles["notes-error"]}
            role="alert"
          >
            <span>⚠ {error}</span>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}
      </main>

      {/* ── DESKTOP SIDEBAR (RIGHT) — hidden on mobile via CSS ── */}
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <button
          className={styles.sidebarToggleBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "→" : "←"}
        </button>

        {sidebarOpen && <SidebarContent fetching={fetching}
          fetchError={fetchError}
          notes={notes}
          pinnedNotes={pinnedNotes}
          unpinnedNotes={unpinnedNotes}
          activeNoteId={activeNoteId}
          handleSidebarNoteClick={handleSidebarNoteClick}
          handleNewNote={handleNewNote}
          setMobileSidebarOpen={setMobileSidebarOpen} />}
      </div>

      {/* ── MOBILE DRAWER + BACKDROP ── */}
      {mobileSidebarOpen && (
        <>
          {/* backdrop — tap to close */}
          <div
            className={styles.sidebarOverlay}
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* drawer */}
          <div className={`${styles.sidebar} ${styles.sidebarMobileOpen}`}>
            <SidebarContent />
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;