import React, { useRef, useState, useEffect } from "react";
import BASE_URL from "../lib/api.js";
import { jsPDF } from "jspdf";
import styles from "./styles/notes.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import html2canvas from "html2canvas";
import { getSocket, connectSocket } from "../lib/socket.js";

export const LLMMarkdown = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]} // enables raw HTML like <u> and <mark>
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

      <div className={styles["welcome-panel__features"]} data-testid= "welcome-card">
        <div className={styles["welcome-feature"]} data-testid="welcome-card1">
          <span className={styles["welcome-feature__icon"]}>📋</span>
          <div>
            <strong>Smart Summaries</strong>
            <p>AI condenses long content into crisp, readable notes</p>
          </div>
        </div>
        <div className={styles["welcome-feature"]} data-testid="welcome-card2">
          <span className={styles["welcome-feature__icon"]}>🔑</span>
          <div>
            <strong>Key Point Extraction</strong>
            <p>Never miss the important bits — surfaced automatically</p>
          </div>
        </div>
        <div className={styles["welcome-feature"]} data-testid="welcome-card3">
          <span className={styles["welcome-feature__icon"]}>📥</span>
          <div>
            <strong>Export Anywhere</strong>
            <p>Copy to clipboard or download as PDF instantly</p>
          </div>
        </div>
        <div className={styles["welcome-feature"]} data-testid="welcome-card4">
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

const StyledSummary = ({ content }) => {
  const lines = content.split("\n");
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
const NoteDocument = ({
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
const NoteInputForm = ({
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

/* ═══════════════════════════════════════════════════════════════
  MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Notes = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [editId, setEditId] = useState("");
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const [generatedIds, setGeneratedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [panelView, setPanelView] = useState("welcome");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const noteDocRef = useRef(null);

  const inputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    if (!socket) return;

    socket.on("ai-response", (data) => {
      const { title, summary, keyPoints, _id, isPinned } = data;
      setSummaryData({ title, summary, keyPoints, _id, isPinned });
      setActiveNoteId(_id);
      setGeneratedIds((prev) => new Set(prev).add(_id));
      showToast("Note created!");
      fetchNotes();
      setPanelView("note");
    });

    return () => socket.off("ai_response");
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
        const res = await fetch(`${BASE_URL}/api/notes/${editId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error("Update failed");
        const data = await res.json();
        showToast("Note updated successfully!");
        setEditId("");
        setContent("");
        await fetchNotes();
        setPanelView("note");
      } catch (err) {
        showToast(err.message || "Update failed", "error");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch(`${BASE_URL}/api/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error("Summarisation failed. Try again.");
        const data = await res.json();
        const { title, summary, keyPoints, _id, isPinned } = data.data;

        setSummaryData({ title, summary, keyPoints, _id, isPinned });
        setActiveNoteId(_id);
        setGeneratedIds((prev) => new Set(prev).add(_id));
        setContent("");
        showToast("Note created!");
        await fetchNotes();
        setPanelView("note");
      } catch (err) {
        setError(err.message || "Content generation failed");
        showToast(err.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data.data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Note deleted");
      if (activeNoteId === id) {
        setActiveNoteId(null);
        setSummaryData(null);
        setPanelView("welcome");
      }
      await fetchNotes();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const handleSubmitEdit = (note) => {
    setEditId(note._id);
    setContent(note.summary);
    setPanelView("form");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCancelEdit = () => {
    setEditId("");
    setContent("");
    setPanelView(activeNoteId ? "note" : "welcome");
  };

  const handleCopy = async (note) => {
    try {
      const stripMarkdown = (text) => {
        if (!text) return "";
        return text
          .replace(/#{1,6}\s+/g, "") // headings
          .replace(/\*\*(.*?)\*\*/g, "$1") // bold
          .replace(/\*(.*?)\*/g, "$1") // italic
          .replace(/__(.*?)__/g, "$1") // bold alt
          .replace(/_(.*?)_/g, "$1") // italic alt
          .replace(/~~(.*?)~~/g, "$1") // strikethrough
          .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → label only
          .replace(/^[-*+]\s+/gm, "• ") // bullets → •
          .replace(/^\d+\.\s+/gm, "") // numbered lists
          .replace(/^>\s+/gm, "") // blockquotes
          .replace(/---+/g, "") // hr
          .replace(/<[^>]+>/g, "") // html tags
          .replace(/\n{3,}/g, "\n\n") // excess newlines
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
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      // scale image to fit page width
      const ratio = pageWidth / imgWidthPx;
      const imgHeightMm = imgHeightPx * ratio;

      let yOffset = 0;

      // paginate if content taller than one page
      while (yOffset < imgHeightMm) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -yOffset, // shift up for each page
          pageWidth,
          imgHeightMm,
        );
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
      const res = await fetch(`${BASE_URL}/api/notes/${note._id}/pin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPinned }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const result = await res.json();
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
    setActiveNoteId(note._id);
    setSummaryData(note);
    setEditId("");
    setContent("");
    setPanelView("note");
  };

  const handleNewNote = () => {
    setActiveNoteId(null);
    setSummaryData(null);
    setEditId("");
    setContent("");
    setPanelView("welcome");
  };

  const activeNote = activeNoteId
    ? notes.find((n) => n._id === activeNoteId) || summaryData
    : summaryData;

  useEffect(() => {
    fetchNotes();
  }, []);

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return (
    <div
      className={styles["notes-page"]}
      style={{
        gridTemplateColumns: sidebarOpen
          ? `1fr var(--n-sidebar-w)`
          : "1fr 18px",
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── NOTES SIDEBAR ── */}

      <div className={styles["sidebar-wrapper"]}>
        <button
          className={styles["sidebar-toggle"]}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? ">" : "<"}
        </button>

        <aside
          className={styles["notes-sidebar"]}
          aria-label="Saved notes"
        >
          <div className={styles["notes-sidebar__header"]}>
            <span className={styles["notes-sidebar__title"]}>Your Notes</span>
            <button
              className={styles["notes-sidebar__new-btn"]}
              onClick={handleNewNote}
              aria-label="Create new note"
              title="New note"
            >
              +
            </button>
          </div>

          {fetching && (
            <div
              className={styles["notes-sidebar__loading"]}
              aria-live="polite"
            >
              <span
                className={`${styles.spinner} ${styles["spinner--sm"]}`}
                aria-hidden="true"
              />
              Loading…
            </div>
          )}

          {fetchError && (
            <p
              className={styles["notes-sidebar__error"]}
              role="alert"
            >
              {fetchError}
            </p>
          )}

          {!fetching && notes.length === 0 && (
            <div className={styles["notes-sidebar__empty"]}>
              <span aria-hidden="true">📝</span>
              <p>
                No notes yet.
                <br />
                Create your first one!
              </p>
            </div>
          )}

          {pinnedNotes.length > 0 && (
            <div className={styles["notes-sidebar__group"]}>
              <span className={styles["notes-sidebar__group-label"]}>
                📌 Pinned
              </span>
              {pinnedNotes.map((note) => (
                <button
                  key={note._id}
                  className={`${styles["notes-sidebar__item"]}${activeNoteId === note._id ? ` ${styles.active}` : ""}`}
                  onClick={() => handleSidebarNoteClick(note)}
                  aria-current={activeNoteId === note._id ? "true" : undefined}
                >
                  <span
                    className={styles["notes-sidebar__item-icon"]}
                    aria-hidden="true"
                  >
                    📄
                  </span>
                  <span className={styles["notes-sidebar__item-title"]}>
                    {note.title.replace(/\*\*/g, "")}
                  </span>
                </button>
              ))}
            </div>
          )}

          {unpinnedNotes.length > 0 && (
            <div className={styles["notes-sidebar__group"]}>
              {pinnedNotes.length > 0 && (
                <span className={styles["notes-sidebar__group-label"]}>
                  All Notes
                </span>
              )}
              {unpinnedNotes.map((note) => (
                <button
                  key={note._id}
                  className={`${styles["notes-sidebar__item"]}${activeNoteId === note._id ? ` ${styles.active}` : ""}`}
                  onClick={() => handleSidebarNoteClick(note)}
                  aria-current={activeNoteId === note._id ? "true" : undefined}
                >
                  <span
                    className={styles["notes-sidebar__item-icon"]}
                    aria-hidden="true"
                  >
                    📄
                  </span>
                  <span className={styles["notes-sidebar__item-title"]}>
                    {note.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ── MAIN PANEL ── */}
      <main
        className={styles["notes-main"]}
        role="main"
        aria-label="Note content"
      >
        {panelView === "welcome" && (
          <WelcomePanel onStart={() => setPanelView("form")} />
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
    </div>
  );
};

export default Notes;
