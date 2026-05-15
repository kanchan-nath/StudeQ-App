import React, { useRef, useState, useEffect, useCallback } from 'react'
import BASE_URL from "../lib/api.js"
import { v4 as uuidv4 } from "uuid"
import styles from "./styles/Flashcards.module.css"

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const IconHome = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)
const IconSets = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
)
const IconFlash = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8" height="12" rx="1" /><rect x="14" y="2" width="8" height="12" rx="1" /><rect x="2" y="18" width="8" height="4" rx="1" /><rect x="14" y="18" width="8" height="4" rx="1" />
    </svg>
)
const IconStar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)
const IconUpload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
)
const IconChevronLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
)
const IconChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)
const IconChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)
const IconShuffle = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
    </svg>
)
const IconThumbUp = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
)
const IconThumbDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
)
const IconBookmark = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
)
const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const IconScratch = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
)
const IconMaterials = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)
const IconTopic = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
)
const IconQuizlet = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)
const IconPDF = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 13h1a1 1 0 1 1 0 2H9v-5h1a1 1 0 1 1 0 2" />
    </svg>
)
const IconLightbulb = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
)
const IconNote = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
)

// ─── Mock data for preview ────────────────────────────────────────────────────
const MOCK_FLASHCARDS = [
    { front: "Electromagnetic Waves", back: "Oscillating electric and magnetic fields that propagate through space or matter." },
    { front: "Frequency", back: "The number of wave cycles that pass a fixed point per unit time, measured in Hz." },
    { front: "Wavelength", back: "The distance between successive crests of a wave, denoted by lambda (λ)." },
    { front: "Amplitude", back: "The maximum displacement of a wave from its equilibrium position." },
]

// ─── VIEW MODES ───────────────────────────────────────────────────────────────
const VIEW = {
    VIEWER: 'viewer',
    CREATE_STEP1: 'create_step1',
    CREATE_STEP2_TOPIC: 'create_step2_topic',
    CREATE_STEP2_SCRATCH: 'create_step2_scratch',
    CREATE_STEP2_PDF: 'create_step2_pdf',
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────
const LeftSidebar = ({ activeView, onNavigate }) => {
    const navItems = [
        { label: 'Home', icon: <IconHome />, view: null },
        { label: 'My Sets', icon: <IconSets />, view: VIEW.VIEWER },
        { label: 'Flashcards', icon: <IconFlash />, view: VIEW.VIEWER },
        { label: 'Favourites', icon: <IconStar />, view: null },
    ]
    return (
        <aside className={styles.leftSidebar}>
            <div className={styles.sidebarLogo}>
                <div className={styles.logoMark}>
                    <IconFlash />
                </div>
                <span className={styles.logoText}>CardForge</span>
            </div>

            <nav className={styles.sidebarNav}>
                {navItems.map(item => (
                    <button
                        key={item.label}
                        className={`${styles.navItem} ${activeView === item.view ? styles.navItemActive : ''}`}
                        onClick={() => item.view && onNavigate(item.view)}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={styles.sidebarUpload}>
                <button className={styles.uploadBtn} onClick={() => onNavigate(VIEW.CREATE_STEP1)}>
                    <IconUpload />
                    <span>New Set</span>
                </button>
            </div>

            <div className={styles.recentNotes}>
                <div className={styles.recentHeader}>
                    <span>Recent Sets</span>
                    <button className={styles.viewAllBtn}>View All</button>
                </div>
                {['Physics Fundamentals', 'Calc Derivatives', 'World History'].map(note => (
                    <div key={note} className={styles.noteItem}>
                        <IconNote />
                        <span>{note}</span>
                    </div>
                ))}
            </div>
        </aside>
    )
}

// ─── Flashcard Viewer Page ────────────────────────────────────────────────────
const FlashcardViewer = ({ allFlashcards, onNavigate }) => {
    const cards = allFlashcards.length > 0
        ? allFlashcards.flatMap(set => set.flashcards || [])
        : MOCK_FLASHCARDS

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [mode, setMode] = useState('Standard')
    const [modeOpen, setModeOpen] = useState(false)
    const [thumbUp, setThumbUp] = useState(false)
    const [thumbDown, setThumbDown] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [rightOpen, setRightOpen] = useState(false)

    const modes = ['Standard', 'Spaced Repetition', 'Bookmarked Flashcards']

    // Spacebar flip
    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault()
                setIsFlipped(f => !f)
            }
            if (e.code === 'ArrowRight') goNext()
            if (e.code === 'ArrowLeft') goPrev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [currentIndex, cards.length])

    const goNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(i => i + 1)
            setIsFlipped(false)
        }
    }
    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1)
            setIsFlipped(false)
        }
    }
    const goTo = (i) => {
        setCurrentIndex(i)
        setIsFlipped(false)
    }

    const currentCard = cards[currentIndex] || { front: 'No cards yet', back: 'Add cards to your set' }

    return (
        <div className={styles.viewerLayout}>
            {/* Headbar */}
            <div className={styles.headbar}>
                <div className={styles.headbarLeft}>
                    {/* Mode dropdown */}
                    <div className={styles.modeDropdownWrapper}>
                        <button
                            className={styles.modeBtn}
                            onClick={() => setModeOpen(o => !o)}
                        >
                            <IconSets />
                            <span>{mode}</span>
                            <IconChevronDown />
                        </button>
                        {modeOpen && (
                            <div className={styles.modeDropdown}>
                                {modes.map(m => (
                                    <button
                                        key={m}
                                        className={`${styles.modeOption} ${mode === m ? styles.modeOptionActive : ''}`}
                                        onClick={() => { setMode(m); setModeOpen(false) }}
                                    >
                                        {m === 'Standard' && <IconSets />}
                                        {m === 'Spaced Repetition' && <IconShuffle />}
                                        {m === 'Bookmarked Flashcards' && <IconBookmark />}
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress dots */}
                <div className={styles.progressDots}>
                    {cards.slice(0, Math.min(cards.length, 12)).map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`Card ${i + 1}`}
                        />
                    ))}
                    {cards.length > 12 && <span className={styles.dotsMore}>›</span>}
                </div>

                <div className={styles.headbarRight}>
                    <button className={styles.shuffleBtn} title="Shuffle cards">
                        <IconShuffle />
                    </button>
                    <div className={styles.cardCounter}>{currentIndex + 1} / {cards.length}</div>
                    <button className={styles.navArrow} onClick={goPrev} disabled={currentIndex === 0}><IconChevronLeft /></button>
                    <button className={styles.navArrow} onClick={goNext} disabled={currentIndex === cards.length - 1}><IconChevronRight /></button>
                </div>
            </div>

            {/* Card area */}
            <div className={styles.cardArea}>
                {/* Card label + rating row */}
                <div className={styles.cardMeta}>
                    <span className={styles.cardSideLabel}>{isFlipped ? 'Definition' : 'Term'}</span>
                    <div className={styles.ratingBtns}>
                        <button
                            className={`${styles.ratingBtn} ${thumbUp ? styles.ratingBtnActive : ''}`}
                            onClick={() => { setThumbUp(u => !u); setThumbDown(false) }}
                        ><IconThumbUp /></button>
                        <button
                            className={`${styles.ratingBtn} ${thumbDown ? styles.ratingBtnDown : ''}`}
                            onClick={() => { setThumbDown(d => !d); setThumbUp(false) }}
                        ><IconThumbDown /></button>
                        <button
                            className={`${styles.ratingBtn} ${bookmarked ? styles.ratingBtnBookmark : ''}`}
                            onClick={() => setBookmarked(b => !b)}
                        ><IconBookmark /></button>
                    </div>
                </div>

                {/* The flashcard */}
                <div
                    className={`${styles.cardScene}`}
                    onClick={() => setIsFlipped(f => !f)}
                >
                    <div className={`${styles.card3d} ${isFlipped ? styles.cardFlipped : ''}`}>
                        <div className={styles.cardFront}>
                            <p className={styles.cardText}>{currentCard.front}</p>
                        </div>
                        <div className={styles.cardBack}>
                            <p className={styles.cardText}>{currentCard.back}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom action bar */}
                <div className={styles.bottomBar}>
                    <button className={styles.bottomNavBtn} onClick={goPrev} disabled={currentIndex === 0}>
                        <IconChevronLeft /> Previous
                    </button>
                    <button className={styles.flipBtn} onClick={() => setIsFlipped(f => !f)}>
                        <kbd className={styles.kbd}>SPACE</kbd> Flip
                    </button>
                    <button className={styles.bottomNavBtn} onClick={goNext} disabled={currentIndex === cards.length - 1}>
                        Next <IconChevronRight />
                    </button>
                </div>
            </div>

            {/* Right sidebar toggle */}
            <div className={`${styles.rightSidebar} ${rightOpen ? styles.rightSidebarOpen : ''}`}>
                <button
                    className={styles.rightToggle}
                    onClick={() => setRightOpen(o => !o)}
                    aria-label="Toggle panel"
                >
                    {rightOpen ? <IconChevronRight /> : <IconChevronLeft />}
                </button>
                <div className={styles.rightContent}>
                    <h3 className={styles.rightTitle}>AI Study Hints</h3>
                    <p className={styles.rightPlaceholder}>Smart hints and related notes will appear here as you study.</p>
                    <div className={styles.rightPlaceholderCard} />
                    <div className={styles.rightPlaceholderCard} />
                </div>
            </div>
        </div>
    )
}

// ─── Create Page Step 1 ───────────────────────────────────────────────────────
const CreateStep1 = ({ onSelect, onExit }) => {
    const tiles = [
        { label: 'Create from Scratch', icon: <IconScratch />, color: 'indigo', view: VIEW.CREATE_STEP2_SCRATCH, active: true },
        { label: 'Create from Materials', icon: <IconMaterials />, color: 'amber', view: null, active: false },
        { label: 'Create from Topic', icon: <IconTopic />, color: 'violet', view: VIEW.CREATE_STEP2_TOPIC, active: true },
        { label: 'Import Quizlet', icon: <IconQuizlet />, color: 'sky', view: null, active: false },
        { label: 'Upload PDF', icon: <IconPDF />, color: 'teal', view: VIEW.CREATE_STEP2_PDF, active: true },
    ]

    return (
        <div className={styles.createLayout}>
            <div className={styles.createHeader}>
                <div className={styles.createTitle}>
                    <IconFlash />
                    <span>Build a Study Set</span>
                </div>
                <button className={styles.exitBtn} onClick={onExit}>
                    <IconX /> Exit
                </button>
            </div>

            <div className={styles.createBody}>
                <div className={styles.createLeft}>
                    <p className={styles.stepIndicator}>1 of 4</p>
                    <h2 className={styles.createHeading}>How would you like to build your flashcards?</h2>

                    <div className={styles.tilesGrid}>
                        {tiles.map((tile, i) => (
                            <button
                                key={tile.label}
                                className={`${styles.tile} ${styles[`tileColor${tile.color.charAt(0).toUpperCase() + tile.color.slice(1)}`]} ${!tile.active ? styles.tileDisabled : ''}`}
                                style={{ '--tile-rotate': i % 2 === 0 ? '3deg' : '-3deg' }}
                                onClick={() => tile.active && tile.view && onSelect(tile.view)}
                                disabled={!tile.active}
                            >
                                <div className={styles.tileIcon}>{tile.icon}</div>
                                <span className={styles.tileLabel}>{tile.label}</span>
                                {!tile.active && <span className={styles.tileBadge}>Coming soon</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.createRight}>
                    <div className={styles.previewPanel}>
                        <h2 className={styles.previewTitle}>
                            Build <span className={styles.accent}>Smarter</span> Flashcards
                        </h2>
                        <p className={styles.previewSub}>Turn any material into a personalised study set</p>
                        <div className={styles.cardFanWrapper}>
                            <div className={`${styles.fanCard} ${styles.fanCard1}`}>
                                <div className={styles.fanCardIcon} style={{ background: '#fce7f3', color: '#ec4899' }}>♪</div>
                                <span>Audio</span>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                            </div>
                            <div className={`${styles.fanCard} ${styles.fanCard2}`}>
                                <div className={styles.fanCardIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>U</div>
                                <span>Fill in the blank</span>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                            </div>
                            <div className={`${styles.fanCard} ${styles.fanCard3}`}>
                                <div className={styles.fanCardIcon} style={{ background: '#ede9fe', color: '#6366f1' }}>⊞</div>
                                <strong>Term &amp; Definition</strong>
                                <div className={styles.fanCardSection}>TERM</div>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                                <div className={styles.fanCardSection}>DEFINITION</div>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                            </div>
                            <div className={`${styles.fanCard} ${styles.fanCard4}`}>
                                <div className={styles.fanCardIcon} style={{ background: '#dcfce7', color: '#22c55e' }}>✓</div>
                                <span>Practice</span>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Create Page Step 2 — Topic ───────────────────────────────────────────────
const CreateStep2Topic = ({ onBack, onExit, onSubmit, loading }) => {
    const [topic, setTopic] = useState('')
    const [subject, setSubject] = useState('')

    return (
        <div className={styles.createLayout}>
            <div className={styles.createHeader}>
                <div className={styles.createTitle}>
                    <IconFlash />
                    <span>Build a Study Set</span>
                </div>
                <button className={styles.exitBtn} onClick={onExit}>
                    <IconX /> Exit
                </button>
            </div>

            <div className={styles.createBody}>
                <div className={styles.createLeft}>
                    <p className={styles.stepIndicator}>Step 2 of 4</p>
                    <h2 className={styles.createHeading}>Enter a Topic</h2>
                    <p className={styles.createSubheading}>Type the topic you want to create flashcards about</p>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Topic</label>
                        <input
                            className={styles.fieldInput}
                            type="text"
                            placeholder="e.g. Photosynthesis, World War II, Calculus Derivatives..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        />
                        <p className={styles.fieldHint}>Be specific for better flashcards. Instead of "History," try "Causes of the French Revolution."</p>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Subject</label>
                        <input
                            className={styles.fieldInput}
                            type="text"
                            placeholder="e.g. Biology, History, Mathematics..."
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                        />
                    </div>

                    <div className={styles.stepNav}>
                        <button className={styles.backBtn} onClick={onBack}>Back</button>
                        <button
                            className={styles.nextBtn}
                            disabled={!topic.trim() || loading}
                            onClick={() => onSubmit({ topic, subject })}
                        >
                            {loading ? 'Generating...' : 'Next →'}
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
                                {topic ? `Generating flashcards for: "${topic}"` : 'Enter your topic to begin'}
                            </p>
                        </div>
                        <div className={styles.cardFanWrapper} style={{ opacity: 0.5 }}>
                            <div className={`${styles.fanCard} ${styles.fanCard2}`}>
                                <div className={styles.fanCardIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>U</div>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                            </div>
                            <div className={`${styles.fanCard} ${styles.fanCard3}`}>
                                <div className={styles.fanCardIcon} style={{ background: '#ede9fe', color: '#6366f1' }}>⊞</div>
                                <strong>Term &amp; Definition</strong>
                                <div className={styles.fanCardSection}>TERM</div>
                                <div className={styles.fanLine} /><div className={styles.fanLine} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Create Page Step 2 — Scratch ────────────────────────────────────────────
const CreateStep2Scratch = ({ onBack, onExit, onSubmit, loading }) => {
    const [topic, setTopic] = useState('')
    const [subject, setSubject] = useState('')

    return (
        <div className={styles.createLayout}>
            <div className={styles.createHeader}>
                <div className={styles.createTitle}>
                    <IconFlash />
                    <span>Build a Study Set</span>
                </div>
                <button className={styles.exitBtn} onClick={onExit}>
                    <IconX /> Exit
                </button>
            </div>
            <div className={styles.createBody}>
                <div className={styles.createLeft}>
                    <p className={styles.stepIndicator}>Step 2 of 4</p>
                    <h2 className={styles.createHeading}>Name Your Set</h2>
                    <p className={styles.createSubheading}>Give your flashcard set a topic and subject</p>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Topic / Set Name</label>
                        <input className={styles.fieldInput} type="text" placeholder="e.g. Quantum Mechanics Chapter 3" value={topic} onChange={e => setTopic(e.target.value)} />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Subject</label>
                        <input className={styles.fieldInput} type="text" placeholder="e.g. Physics" value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>
                    <div className={styles.stepNav}>
                        <button className={styles.backBtn} onClick={onBack}>Back</button>
                        <button className={styles.nextBtn} disabled={!topic.trim() || loading} onClick={() => onSubmit({ topic, subject })}>
                            {loading ? 'Creating...' : 'Next →'}
                        </button>
                    </div>
                </div>
                <div className={styles.createRight}>
                    <div className={styles.previewPanel}>
                        <h2 className={styles.previewTitle}>Create <span className={styles.accent}>from Scratch</span></h2>
                        <p className={styles.previewSub}>Build your set manually, card by card</p>
                        <div className={styles.scratchPreview}>
                            <div className={styles.scratchCard}><span>Term</span><div className={styles.fanLine} /></div>
                            <div className={styles.scratchCard}><span>Definition</span><div className={styles.fanLine} /><div className={styles.fanLine} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Create Page Step 2 — PDF ─────────────────────────────────────────────────
const CreateStep2PDF = ({ onBack, onExit, onPdfSubmit }) => {
    const [file, setFile] = useState(null)
    return (
        <div className={styles.createLayout}>
            <div className={styles.createHeader}>
                <div className={styles.createTitle}><IconFlash /><span>Build a Study Set</span></div>
                <button className={styles.exitBtn} onClick={onExit}><IconX /> Exit</button>
            </div>
            <div className={styles.createBody}>
                <div className={styles.createLeft}>
                    <p className={styles.stepIndicator}>Step 2 of 4</p>
                    <h2 className={styles.createHeading}>Upload Your Materials</h2>
                    <p className={styles.createSubheading}>Upload a PDF and we'll generate flashcards automatically</p>
                    <div className={styles.dropzone}>
                        <IconPDF />
                        <p>Drag & drop a PDF here, or click to browse</p>
                        <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className={styles.fileInput} />
                        {file && <span className={styles.fileName}>{file.name}</span>}
                    </div>
                    <div className={styles.stepNav}>
                        <button className={styles.backBtn} onClick={onBack}>Back</button>
                        <button className={styles.nextBtn} disabled={!file} onClick={() => onPdfSubmit(file)}>Generate →</button>
                    </div>
                </div>
                <div className={styles.createRight}>
                    <div className={styles.previewPanel}>
                        <h2 className={styles.previewTitle}>Upload <span className={styles.accent}>Materials</span></h2>
                        <p className={styles.previewSub}>We'll extract key concepts from your PDF</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Main Flashcards Component ────────────────────────────────────────────────
const Flashcards = () => {
    const [pdfFilePath, setPdfFilePath] = useState("")
    const [moreFlashId, setMoreFlashId] = useState("")
    const [input, setInput] = useState({ topic: "", subject: "" })
    const [flashcardId, setFlashcardId] = useState("")
    const [loading, setLoading] = useState(false)
    const [inputResult, setInputResult] = useState({})
    const [allFlashcards, setAllFlashcards] = useState([])
    const [currentView, setCurrentView] = useState(VIEW.VIEWER)

    const inputRef = useRef(null)
    const token = localStorage.getItem("token")

    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value })

    const handleSubmit = async ({ topic, subject }) => {
        setLoading(true)
        const id = uuidv4()
        setFlashcardId(id)
        if (moreFlashId) {
            try {
                const res = await fetch(`${BASE_URL}/api/quiz/flashcards/${moreFlashId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ topic, subject, flashcardId: id })
                })
                if (!res.ok) console.error("something went wrong")
                await res.json()
                fetchFlashcards()
            } catch (error) { console.error(error) }
            finally { setLoading(false) }
        } else {
            try {
                const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ topic, subject, flashcardId: id })
                })
                if (!res.ok) console.error("Something went wrong, Try Again!")
                const data = await res.json()
                setInputResult(data.data)
                setInput({ topic: "", subject: "" })
                fetchFlashcards()
                setCurrentView(VIEW.VIEWER)
            } catch (error) { console.error(error) }
            finally { setLoading(false) }
        }
    }

    const fetchFlashcards = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) console.error(`Something went wrong, Try Again`)
            const data = await res.json()
            setAllFlashcards(data.data)
        } catch (error) { console.error(error) }
    }

    const handleClickDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}/api/quiz/flashcards/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            fetchFlashcards()
        } catch (error) { console.error(error) }
    }

    const handleClickAddMoreFlash = (item) => {
        setMoreFlashId(item._id)
        setInput({ topic: item.topic, subject: item.subject })
        setCurrentView(VIEW.CREATE_STEP2_TOPIC)
        setTimeout(() => inputRef.current?.focus(), 0)
    }

    const handleClickPdfFlash = async (file) => {
        const formData = new FormData()
        formData.append("pdfFilePath", file)
        try {
            const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            })
            if (!res.ok) console.error("something went wrong")
            const data = await res.json()
            setInputResult(data.data)
            fetchFlashcards()
            setCurrentView(VIEW.VIEWER)
        } catch (error) { console.error(error) }
    }

    useEffect(() => { fetchFlashcards() }, [])

    const navigateTo = (view) => setCurrentView(view)
    const exitToViewer = () => setCurrentView(VIEW.VIEWER)

    return (
        <div className={styles.appShell}>
            <LeftSidebar activeView={currentView} onNavigate={navigateTo} />

            <main className={styles.mainContent}>
                {currentView === VIEW.VIEWER && (
                    <FlashcardViewer
                        allFlashcards={allFlashcards}
                        onNavigate={navigateTo}
                    />
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
            
        </div>
    )
}


export default Flashcards