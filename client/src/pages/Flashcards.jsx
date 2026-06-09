import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import BASE_URL from "../lib/api.js";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles/Flashcards.module.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconSets = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
    />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const IconFlash = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="2"
      y="2"
      width="8"
      height="12"
      rx="1"
    />
    <rect
      x="14"
      y="2"
      width="8"
      height="12"
      rx="1"
    />
    <rect
      x="2"
      y="18"
      width="8"
      height="4"
      rx="1"
    />
    <rect
      x="14"
      y="18"
      width="8"
      height="4"
      rx="1"
    />
  </svg>
);
const IconStar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconUpload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line
      x1="12"
      y1="12"
      x2="12"
      y2="21"
    />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconShuffle = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line
      x1="4"
      y1="20"
      x2="21"
      y2="3"
    />
    <polyline points="21 16 21 21 16 21" />
    <line
      x1="15"
      y1="15"
      x2="21"
      y2="21"
    />
    <line
      x1="4"
      y1="4"
      x2="9"
      y2="9"
    />
  </svg>
);
const IconThumbUp = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);
const IconThumbDown = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </svg>
);
const IconBookmark = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IconX = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
    />
    <line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
    />
  </svg>
);
const IconScratch = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
  </svg>
);
const IconMaterials = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line
      x1="16"
      y1="13"
      x2="8"
      y2="13"
    />
    <line
      x1="16"
      y1="17"
      x2="8"
      y2="17"
    />
  </svg>
);
const IconTopic = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
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
    <line
      x1="11"
      y1="8"
      x2="11"
      y2="14"
    />
    <line
      x1="8"
      y1="11"
      x2="14"
      y2="11"
    />
  </svg>
);
const IconQuizlet = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
    />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
    />
  </svg>
);
const IconPDF = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 13h1a1 1 0 1 1 0 2H9v-5h1a1 1 0 1 1 0 2" />
  </svg>
);
const IconLightbulb = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      x1="9"
      y1="18"
      x2="15"
      y2="18"
    />
    <line
      x1="10"
      y1="22"
      x2="14"
      y2="22"
    />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);
const IconNote = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const VIEW = {
  HOME: "home",
  VIEWER: "viewer",
  CREATE_STEP1: "create_step1",
  CREATE_STEP2_TOPIC: "create_step2_topic",
  CREATE_STEP2_SCRATCH: "create_step2_scratch",
  CREATE_STEP2_PDF: "create_step2_pdf",
};

// ─── Path ↔ View maps ─────────────────────────────────────────────────────────
const PATH_MAP = {
  [VIEW.HOME]: "/flashcard",
  [VIEW.VIEWER]: "/flashcard/viewer",
  [VIEW.CREATE_STEP1]: "/flashcard/create",
  [VIEW.CREATE_STEP2_TOPIC]: "/flashcard/create/topic",
  [VIEW.CREATE_STEP2_SCRATCH]: "/flashcard/create/scratch",
  [VIEW.CREATE_STEP2_PDF]: "/flashcard/create/pdf",
};

const PATH_TO_VIEW = Object.fromEntries(
  Object.entries(PATH_MAP).map(([v, p]) => [p, v])
);

// ─── RIGHT Sidebar ────────────────────────────────────────────────────────────
const RightSidebar = ({ activeView, onNavigate, allFlashcards, onSelectSet, onDeleteSet }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <aside className={`${styles.historySidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <button
        className={styles.sidebarToggleBtn}
        onClick={() => setSidebarOpen((o) => !o)}
      >
        {sidebarOpen ? "→" : "←"}
      </button>

      {sidebarOpen && (
        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>🕓 Recent Flashcards</h3>

          {allFlashcards.length === 0 ? (
            <p className={styles.sidebarEmpty}>No flashcards yet.</p>
          ) : (
            allFlashcards.map((set) => (
              <div
                key={set._id}
                className={styles.sidebarItem}
                onClick={() => { setOpenMenuId(null); onSelectSet(set); }}
              >
                <div className={styles.sidebarItemRow}>
                  <div className={styles.sidebarItemText}>
                    <div className={styles.sidebarItemTitle}>
                      {set.topic || "Untitled"}
                    </div>
                    <div className={styles.sidebarItemMeta}>
                      {set.flashcards?.length || 0} cards
                      {set.subject ? ` · ${set.subject}` : ""}
                    </div>
                  </div>

                  <div className={styles.sidebarItemMenuWrapper}>
                    <button
                      className={styles.threeDotBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === set._id ? null : set._id);
                      }}
                    >
                      ···
                    </button>
                    {openMenuId === set._id && (
                      <div className={styles.dotMenu}>
                        <button
                          className={styles.dotMenuDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onDeleteSet(set._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
};

// ─── Flashcard Viewer ─────────────────────────────────────────────────────────
const FlashcardViewer = ({ allFlashcards, onNavigate }) => {
  const cards = allFlashcards.flatMap((set) => set.flashcards || []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState("Standard");
  const [modeOpen, setModeOpen] = useState(false);
  const [thumbUp, setThumbUp] = useState(false);
  const [thumbDown, setThumbDown] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const modes = ["Standard", "Spaced Repetition", "Bookmarked Flashcards"];

  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.code === "Space" &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
      if (e.code === "ArrowRight") goNext();
      if (e.code === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, cards.length]);

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };
  const goTo = (i) => {
    setCurrentIndex(i);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex] || {
    front: "No cards yet",
    back: "Add cards to your set",
  };

  return (
    <div className={styles.viewerLayout}>
      {/* Headbar */}
      <div className={styles.headbar}>
        <div className={styles.progressDots}>
          {cards.slice(0, Math.min(cards.length, 12)).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Card ${i + 1}`}
            />
          ))}
          {cards.length > 12 && <span className={styles.dotsMore}>›</span>}
        </div>

        <div className={styles.headbarRight}>
          <div className={styles.cardCounter}>
            {currentIndex + 1} / {cards.length}
          </div>
          <button
            className={styles.navArrow}
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <IconChevronLeft />
          </button>
          <button
            className={styles.navArrow}
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* Card area */}
      <div className={styles.cardArea}>
        <div className={styles.cardMeta}>
          <span className={styles.cardSideLabel}>
            {isFlipped ? "Definition" : "Term"}
          </span>
        </div>

        <div
          className={styles.cardScene}
          onClick={() => setIsFlipped((f) => !f)}
        >
          <div
            className={`${styles.card3d} ${isFlipped ? styles.cardFlipped : ""}`}
          >
            <div className={styles.cardFront}>
              <p className={styles.cardText}>{currentCard.front}</p>
            </div>
            <div className={styles.cardBack}>
              <p className={styles.cardText}>{currentCard.back}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <button
            className={styles.bottomNavBtn}
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <IconChevronLeft /> Previous
          </button>
          <button
            className={styles.flipBtn}
            onClick={() => setIsFlipped((f) => !f)}
          >
            <kbd className={styles.kbd}>SPACE</kbd> Flip
          </button>
          <button
            className={styles.bottomNavBtn}
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
          >
            Next <IconChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Create Step 1 ────────────────────────────────────────────────────────────
const CreateStep1 = ({ onSelect, onExit }) => {
  const tiles = [
    {
      label: "Create from Scratch",
      icon: <IconScratch />,
      color: "Indigo",
      view: VIEW.CREATE_STEP2_SCRATCH,
      active: true,
    },
    {
      label: "Create from Materials",
      icon: <IconMaterials />,
      color: "Amber",
      view: null,
      active: false,
    },
    {
      label: "Create from Topic",
      icon: <IconTopic />,
      color: "Violet",
      view: VIEW.CREATE_STEP2_TOPIC,
      active: true,
    },
    {
      label: "Import Quizlet",
      icon: <IconQuizlet />,
      color: "Sky",
      view: null,
      active: false,
    },
    {
      label: "Upload PDF",
      icon: <IconPDF />,
      color: "Teal",
      view: VIEW.CREATE_STEP2_PDF,
      active: true,
    },
  ];

  return (
    <div className={styles.createLayout}>
      <div className={styles.createHeader}>
        <div className={styles.createTitle}>
          <IconFlash />
          <span>Build a Study Set</span>
        </div>
        <button
          className={styles.exitBtn}
          onClick={onExit}
        >
          <IconX /> Exit
        </button>
      </div>
      <div className={styles.createBody}>
        <div className={styles.createLeft}>
          <p className={styles.stepIndicator}>1 of 4</p>
          <h2 className={styles.createHeading}>
            How would you like to build your flashcards?
          </h2>
          <div className={styles.tilesGrid}>
            {tiles.map((tile, i) => (
              <button
                key={tile.label}
                className={`${styles.tile} ${styles[`tileColor${tile.color}`]} ${!tile.active ? styles.tileDisabled : ""}`}
                style={{ "--tile-rotate": i % 2 === 0 ? "3deg" : "-3deg" }}
                onClick={() => tile.active && tile.view && onSelect(tile.view)}
                disabled={!tile.active}
              >
                <div className={styles.tileIcon}>{tile.icon}</div>
                <span className={styles.tileLabel}>{tile.label}</span>
                {!tile.active && (
                  <span className={styles.tileBadge}>Coming soon</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.createRight}>
          <div className={styles.previewPanel}>
            <h2 className={styles.previewTitle}>
              Build <span className={styles.accent}>Smarter</span> Flashcards
            </h2>
            <p className={styles.previewSub}>
              Turn any material into a personalised study set
            </p>
            <div className={styles.cardFanWrapper}>
              <div className={`${styles.fanCard} ${styles.fanCard1}`}>
                <div
                  className={styles.fanCardIcon}
                  style={{ background: "#fce7f3", color: "#ec4899" }}
                >
                  ♪
                </div>
                <span>Audio</span>
                <div className={styles.fanLine} />
                <div className={styles.fanLine} />
              </div>
              <div className={`${styles.fanCard} ${styles.fanCard2}`}>
                <div
                  className={styles.fanCardIcon}
                  style={{ background: "#fef3c7", color: "#f59e0b" }}
                >
                  U
                </div>
                <span>Fill in the blank</span>
                <div className={styles.fanLine} />
                <div className={styles.fanLine} />
              </div>
              <div className={`${styles.fanCard} ${styles.fanCard3}`}>
                <div
                  className={styles.fanCardIcon}
                  style={{ background: "#ede9fe", color: "#6366f1" }}
                >
                  ⊞
                </div>
                <strong>Term &amp; Definition</strong>
                <div className={styles.fanCardSection}>TERM</div>
                <div className={styles.fanLine} />
                <div className={styles.fanLine} />
                <div className={styles.fanCardSection}>DEFINITION</div>
                <div className={styles.fanLine} />
                <div className={styles.fanLine} />
              </div>
              <div className={`${styles.fanCard} ${styles.fanCard4}`}>
                <div
                  className={styles.fanCardIcon}
                  style={{ background: "#dcfce7", color: "#22c55e" }}
                >
                  ✓
                </div>
                <span>Practice</span>
                <div className={styles.fanLine} />
                <div className={styles.fanLine} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create Step 2 — Topic ────────────────────────────────────────────────────
const CreateStep2Topic = ({ onBack, onExit, onSubmit, loading }) => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");

  return (
    <div className={styles.createLayout}>
      <div className={styles.createHeader}>
        <div className={styles.createTitle}>
          <IconFlash />
          <span>Build a Study Set</span>
        </div>
        <button
          className={styles.exitBtn}
          onClick={onExit}
        >
          <IconX /> Exit
        </button>
      </div>
      <div className={styles.createBody}>
        <div className={styles.createLeft}>
          <p className={styles.stepIndicator}>Step 2 of 4</p>
          <h2 className={styles.createHeading}>Enter a Topic</h2>
          <p className={styles.createSubheading}>
            Type the topic you want to create flashcards about
          </p>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Topic</label>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="e.g. Photosynthesis, World War II..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <p className={styles.fieldHint}>
              Be specific for better flashcards.
            </p>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subject</label>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="e.g. Biology, History..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className={styles.stepNav}>
            <button
              className={styles.backBtn}
              onClick={onBack}
            >
              Back
            </button>
            <button
              className={styles.nextBtn}
              disabled={!topic.trim() || loading}
              onClick={() => onSubmit({ topic, subject })}
            >
              {loading ? "Generating..." : "Next →"}
            </button>
          </div>
        </div>
        <div className={styles.createRight}>
          <div className={styles.previewPanel}>
            <div className={styles.topicPreview}>
              <div className={styles.topicPreviewIcon}>
                <IconLightbulb />
              </div>
              <p className={styles.topicPreviewText}>
                {topic
                  ? `Generating flashcards for: "${topic}"`
                  : "Enter your topic to begin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create Step 2 — Scratch ──────────────────────────────────────────────────
const CreateStep2Scratch = ({ onBack, onExit, onSubmit, loading }) => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");

  return (
    <div className={styles.createLayout}>
      <div className={styles.createHeader}>
        <div className={styles.createTitle}>
          <IconFlash />
          <span>Build a Study Set</span>
        </div>
        <button
          className={styles.exitBtn}
          onClick={onExit}
        >
          <IconX /> Exit
        </button>
      </div>
      <div className={styles.createBody}>
        <div className={styles.createLeft}>
          <p className={styles.stepIndicator}>Step 2 of 4</p>
          <h2 className={styles.createHeading}>Name Your Set</h2>
          <p className={styles.createSubheading}>
            Give your flashcard set a topic and subject
          </p>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Topic / Set Name</label>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="e.g. Quantum Mechanics Chapter 3"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subject</label>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="e.g. Physics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className={styles.stepNav}>
            <button
              className={styles.backBtn}
              onClick={onBack}
            >
              Back
            </button>
            <button
              className={styles.nextBtn}
              disabled={!topic.trim() || loading}
              onClick={() => onSubmit({ topic, subject })}
            >
              {loading ? "Creating..." : "Next →"}
            </button>
          </div>
        </div>
        <div className={styles.createRight}>
          <div className={styles.previewPanel}>
            <h2 className={styles.previewTitle}>
              Create <span className={styles.accent}>from Scratch</span>
            </h2>
            <p className={styles.previewSub}>
              Build your set manually, card by card
            </p>
            <div className={styles.scratchPreview}>
              <div className={styles.scratchCard}>
                <span>Term</span>
                <div className={styles.fanLine} />
              </div>
              <div className={styles.scratchCard}>
                <span>Definition</span>
                <div className={styles.fanLine} />
                <div className={styles.fanLine} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create Step 2 — PDF ──────────────────────────────────────────────────────
const CreateStep2PDF = ({ onBack, onExit, onPdfSubmit }) => {
  const [file, setFile] = useState(null);
  return (
    <div className={styles.createLayout}>
      <div className={styles.createHeader}>
        <div className={styles.createTitle}>
          <IconFlash />
          <span>Build a Study Set</span>
        </div>
        <button
          className={styles.exitBtn}
          onClick={onExit}
        >
          <IconX /> Exit
        </button>
      </div>
      <div className={styles.createBody}>
        <div className={styles.createLeft}>
          <p className={styles.stepIndicator}>Step 2 of 4</p>
          <h2 className={styles.createHeading}>Upload Your Materials</h2>
          <p className={styles.createSubheading}>
            Upload a PDF and we'll generate flashcards automatically
          </p>
          <div className={styles.dropzone}>
            <IconPDF />
            <p>Drag & drop a PDF here, or click to browse</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.fileInput}
            />
            {file && <span className={styles.fileName}>{file.name}</span>}
          </div>
          <div className={styles.stepNav}>
            <button
              className={styles.backBtn}
              onClick={onBack}
            >
              Back
            </button>
            <button
              className={styles.nextBtn}
              disabled={!file}
              onClick={() => onPdfSubmit(file)}
            >
              Generate →
            </button>
          </div>
        </div>
        <div className={styles.createRight}>
          <div className={styles.previewPanel}>
            <h2 className={styles.previewTitle}>
              Upload <span className={styles.accent}>Materials</span>
            </h2>
            <p className={styles.previewSub}>
              We'll extract key concepts from your PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardHome = ({ onNavigate }) => (
  <div className={styles.flashHomeWrapper}>
    <div className={styles.flashHomeIcon}>🃏</div>
    <h1 className={styles.flashHomeHeading}>
      Build Flashcards from <span className={styles.accent}>Any Material</span>
    </h1>
    <p className={styles.flashHomeSub}>
      Upload a PDF, enter a topic, or build manually — AI generates your study set in seconds.
    </p>
    <button
      className={styles.flashHomeCard}
      onClick={() => onNavigate(VIEW.CREATE_STEP1)}
    >
      <div className={styles.flashHomeCardIcon}>
        <IconFlash />
      </div>
      <div>
        <p className={styles.flashHomeCardTitle}>Create Your Flashcards</p>
        <p className={styles.flashHomeCardSub}>Upload PDF, enter a topic, or build from scratch</p>
      </div>
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Flashcards = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pdfFilePath, setPdfFilePath] = useState("");
  const [moreFlashId, setMoreFlashId] = useState("");
  const [input, setInput] = useState({ topic: "", subject: "" });
  const [flashcardId, setFlashcardId] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputResult, setInputResult] = useState({});
  const [allFlashcards, setAllFlashcards] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  const inputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Derive currentView from URL — reload always restores correct view
  const currentView = location.pathname.startsWith("/flashcard/viewer")
    ? VIEW.VIEWER
    : (PATH_TO_VIEW[location.pathname] ?? VIEW.HOME);

  const navigateTo = (view) => navigate(PATH_MAP[view] ?? "/flashcard");
  const exitToViewer = () => navigate("/flashcard");

  const handleSubmit = async ({ topic, subject }) => {
    setLoading(true);
    const id = uuidv4();
    setFlashcardId(id);
    if (moreFlashId) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/quiz/flashcards/${moreFlashId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ topic, subject, flashcardId: id }),
          },
        );
        if (!res.ok) console.error("something went wrong");
        await res.json();
        fetchFlashcards();
        setSelectedSet(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ topic, subject, flashcardId: id }),
        });
        if (!res.ok) console.error("Something went wrong, Try Again!");
        const data = await res.json();
        setInputResult(data.data);
        setInput({ topic: "", subject: "" });
        fetchFlashcards();
        setSelectedSet(null);
        navigate("/flashcard/viewer/" + data.data._id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchFlashcards = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) console.error(`Something went wrong, Try Again`);
      const data = await res.json();
      console.log("Flashcards response:", data.data);
      setAllFlashcards(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickPdfFlash = async (file) => {
    const formData = new FormData();
    formData.append("pdfFilePath", file);
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) console.error("something went wrong");
      const data = await res.json();
      setInputResult(data.data);
      fetchFlashcards();
      setSelectedSet(null);
      navigate("/flashcard/viewer/" + data.data._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleDeleteSet = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/flashcards/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return console.error("Delete failed");
      setAllFlashcards((prev) => prev.filter((s) => s._id !== id));
      if (selectedSet?._id === id) {
        setSelectedSet(null);
        navigate("/flashcard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.appShell}>
      <main className={styles.mainContent}>
        {currentView === VIEW.VIEWER && (
          <FlashcardViewer
            allFlashcards={id ? allFlashcards.filter(s => s._id === id) : allFlashcards}
            onNavigate={navigateTo}
          />
        )}
        {currentView === VIEW.HOME && (
          <FlashcardHome onNavigate={navigateTo} />
        )}
        {currentView === VIEW.CREATE_STEP1 && (
          <CreateStep1
            onSelect={navigateTo}
            onExit={exitToViewer}
          />
        )}
        {currentView === VIEW.CREATE_STEP2_TOPIC && (
          <CreateStep2Topic
            onBack={() => navigateTo(VIEW.CREATE_STEP1)}
            onExit={exitToViewer}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
        {currentView === VIEW.CREATE_STEP2_SCRATCH && (
          <CreateStep2Scratch
            onBack={() => navigateTo(VIEW.CREATE_STEP1)}
            onExit={exitToViewer}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
        {currentView === VIEW.CREATE_STEP2_PDF && (
          <CreateStep2PDF
            onBack={() => navigateTo(VIEW.CREATE_STEP1)}
            onExit={exitToViewer}
            onPdfSubmit={handleClickPdfFlash}
          />
        )}
      </main>

      <RightSidebar
        activeView={currentView}
        onNavigate={navigateTo}
        allFlashcards={allFlashcards}
        onSelectSet={(set) => {
          setSelectedSet(set);
          navigate("/flashcard/viewer/" + set._id);
        }}
        onDeleteSet={handleDeleteSet}
      />
    </div>
  );
};

export default Flashcards;