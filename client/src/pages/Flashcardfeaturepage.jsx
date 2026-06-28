import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo } from 'react';
import styles from './styles/FlashcardFeaturePage.module.css';

const MODES = [
    { id: 'classic', icon: '⟳', label: 'Classic Flip', desc: 'Tap to reveal the answer. Rate yourself — Got it, Almost, or Missed. StudeQ reschedules based on your rating.' },
    { id: 'spaced', icon: '📅', label: 'Spaced Repetition', desc: 'SM-2 algorithm surfaces cards at optimal intervals — so you review just before you forget, never earlier.' },
    { id: 'typed', icon: '⌨️', label: 'Type the Answer', desc: 'AI grades your typed response semantically — partial credit for correct concepts, even with different wording.' },
    { id: 'mcq', icon: '◎', label: 'Quiz Mode', desc: 'Each flashcard becomes a 4-option MCQ. Wrong answers are generated from related cards in your deck for maximum challenge.' },
    { id: 'match', icon: '⇌', label: 'Match Game', desc: 'Drag terms to definitions under a timer. Competitive and fast — great for vocabulary and formula memorization.' },
    { id: 'voice', icon: '🎙️', label: 'Speak the Answer', desc: 'Say your answer aloud. AI transcribes and grades it — hands-free study while commuting or doing chores.' },
];

const STEPS = [
    { num: '01', title: 'Pick a Source', body: 'Upload notes, paste text, enter a topic, or link a URL. StudeQ reads it all.' },
    { num: '02', title: 'AI Generates Cards', body: 'StudeQ extracts key terms, concepts, and relationships. You get a full deck in under 10 seconds.' },
    { num: '03', title: 'Review & Customize', body: 'Edit, delete, or add cards. Merge multiple sources into one deck. Tag and organize by topic.' },
    { num: '04', title: 'Study & Track Progress', body: 'Pick your study mode. Watch mastery scores rise. Weak cards resurface automatically.' },
];

const DETAILS = [
    { icon: '🧠', title: 'Concept-Level Generation', body: 'AI doesn\'t just lift sentences — it identifies the actual concepts worth testing and writes cards that isolate each one cleanly.' },
    { icon: '📊', title: 'Mastery Dashboard', body: 'Per-card accuracy, streak, last reviewed date, and a deck-level mastery percentage. Know your weak spots instantly.' },
    { icon: '🔄', title: 'Smart Resurfacing', body: 'Struggle with a card? It comes back sooner, more often. Ace it three times? It backs off for days. Zero manual scheduling.' },
    { icon: '✏️', title: 'AI Card Editor', body: 'Highlight any card and ask AI to rewrite it simpler, add an example, split it into two cards, or generate a mnemonic.' },
    { icon: '🗂️', title: 'Deck Merging & Tagging', body: 'Merge decks from different notebooks, tag by exam or topic, and filter your review session to exactly what you need.' },
    { icon: '📤', title: 'Export & Share', body: 'Export decks as CSV, Anki-compatible APKG, or a shareable link. Share with your study group in one click.' },
];

const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StudeQ AI Flashcard Maker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
        'AI-powered flashcard maker that generates smart decks from your notes, PDFs, or any topic. Spaced repetition, six study modes, and a mastery dashboard — all in one place.',
    featureList: [
        'AI flashcard generation from notes and PDFs',
        'Spaced repetition SM-2 algorithm',
        'Six study modes including voice and match game',
        'Mastery dashboard and per-card analytics',
        'AI card editor with mnemonic generation',
        'Anki-compatible export',
        'Deck sharing and collaboration',
    ],
    url: 'https://studeq.app/features/flashcards',
    screenshot: 'https://studeq.app/og-flashcards.png',
};

export default function FlashcardFeaturePage() {
    const [activeMode, setActiveMode] = useState('classic');

    const activeDetail = useMemo(
        () => MODES.find((m) => m.id === activeMode),
        [activeMode]
    );

    const handleModeClick = useCallback((id) => setActiveMode(id), []);

    return (
        <>
            <Helmet>
                <title>AI Flashcard Maker — Spaced Repetition from Your Notes | StudeQ</title>
                <meta
                    name="description"
                    content="Generate smart flashcard decks from any notes or PDF. Six study modes, spaced repetition, and AI-powered mastery tracking. Study less, remember more."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://studeq.app/features/flashcards" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://studeq.app/features/flashcards" />
                <meta property="og:title" content="AI Flashcard Maker — Spaced Repetition from Your Notes | StudeQ" />
                <meta property="og:description" content="Generate smart flashcard decks from any notes or PDF. Six study modes, spaced repetition, and AI-powered mastery tracking." />
                <meta property="og:image" content="https://studeq.app/og-flashcards.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AI Flashcard Maker — Spaced Repetition from Your Notes | StudeQ" />
                <meta name="twitter:description" content="Generate smart flashcard decks from any notes or PDF. Six study modes, spaced repetition, and AI-powered mastery tracking." />
                <meta name="twitter:image" content="https://studeq.app/og-flashcards.png" />

                <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
            </Helmet>

            <a href="#main-content" className={styles.skipLink}>Skip to main content</a>

            <main id="main-content" className={styles.main}>

                {/* ── HERO ─────────────────────────────────────── */}
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className={styles.heroBadge} aria-hidden="true">
                        <span className={styles.badgeDot} />
                        AI Flashcards — Spaced Repetition
                    </div>

                    <h1 id="hero-heading" className={styles.heroTitle}>
                        Flashcards That
                        <br />
                        <span className={styles.heroAccent}>Actually Make You Remember.</span>
                    </h1>

                    <p className={styles.heroSub}>
                        Upload your notes, paste a topic, or drop a PDF — StudeQ generates
                        a full flashcard deck in seconds. Then studies you with spaced
                        repetition until you actually know the material.
                    </p>

                    <div className={styles.heroCta}>
                        <a href="/dashboard/flashcards/new" className={styles.btnPrimary}>
                            Generate My Deck Free
                        </a>
                        <a href="#study-modes" className={styles.btnGhost}>
                            See study modes ↓
                        </a>
                    </div>

                    <div className={styles.heroStats} aria-label="Feature highlights">
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>6</span>
                            <span className={styles.statLabel}>Study modes</span>
                        </div>
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>&lt;10s</span>
                            <span className={styles.statLabel}>Deck generation</span>
                        </div>
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>SM-2</span>
                            <span className={styles.statLabel}>Spaced repetition</span>
                        </div>
                    </div>

                    {/* Decorative flip card stack */}
                    <div className={styles.heroCardStack} aria-hidden="true">
                        <div className={`${styles.stackCard} ${styles.stackCard3}`}>
                            <span className={styles.stackCardLabel}>What is gradient descent?</span>
                        </div>
                        <div className={`${styles.stackCard} ${styles.stackCard2}`}>
                            <span className={styles.stackCardLabel}>Define backpropagation.</span>
                        </div>
                        <div className={`${styles.stackCard} ${styles.stackCard1}`}>
                            <div className={styles.stackCardFront}>
                                <span className={styles.stackCardMeta}>Q · Machine Learning</span>
                                <span className={styles.stackCardQ}>What is the vanishing gradient problem?</span>
                                <span className={styles.stackCardTap}>Tap to flip →</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STUDY MODES ───────────────────────────────── */}
                <section id="study-modes" className={styles.modesSection} aria-labelledby="modes-heading">
                    <div className={styles.sectionLabel}>Study Modes</div>
                    <h2 id="modes-heading" className={styles.sectionTitle}>
                        Six Ways to Drill Until It Sticks
                    </h2>
                    <p className={styles.sectionSub}>
                        Switch modes mid-session. Mix classic flip with typed answers and match games — whatever keeps you engaged.
                    </p>

                    <div className={styles.modeGrid} role="tablist" aria-label="Flashcard study modes">
                        {MODES.map((mode) => (
                            <button
                                key={mode.id}
                                role="tab"
                                aria-selected={activeMode === mode.id}
                                aria-controls={`mode-detail-${mode.id}`}
                                className={`${styles.modeCard} ${activeMode === mode.id ? styles.modeCardActive : ''}`}
                                onClick={() => handleModeClick(mode.id)}
                            >
                                <span className={styles.modeIcon} aria-hidden="true">{mode.icon}</span>
                                <span className={styles.modeLabel}>{mode.label}</span>
                            </button>
                        ))}
                    </div>

                    {activeDetail && (
                        <div
                            id={`mode-detail-${activeDetail.id}`}
                            role="tabpanel"
                            aria-label={`${activeDetail.label} details`}
                            className={styles.modeDetail}
                        >
                            <span className={styles.modeDetailIcon} aria-hidden="true">{activeDetail.icon}</span>
                            <div>
                                <h3 className={styles.modeDetailTitle}>{activeDetail.label}</h3>
                                <p className={styles.modeDetailDesc}>{activeDetail.desc}</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── HOW IT WORKS ──────────────────────────────── */}
                <section className={styles.stepsSection} aria-labelledby="steps-heading">
                    <div className={styles.sectionLabel}>How It Works</div>
                    <h2 id="steps-heading" className={styles.sectionTitle}>
                        Notes to Mastery in Four Steps
                    </h2>
                    <ol className={styles.stepsList}>
                        {STEPS.map((step) => (
                            <li key={step.num} className={styles.stepItem}>
                                <span className={styles.stepNum} aria-hidden="true">{step.num}</span>
                                <div className={styles.stepBody}>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDesc}>{step.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* ── SPACED REPETITION EXPLAINER ───────────────── */}
                <section className={styles.srSection} aria-labelledby="sr-heading">
                    <div className={styles.srInner}>
                        <div className={styles.srText}>
                            <div className={styles.sectionLabel}>The Science</div>
                            <h2 id="sr-heading" className={styles.sectionTitle}>
                                Spaced Repetition —<br />Not Just a Buzzword
                            </h2>
                            <p className={styles.sectionSub}>
                                StudeQ uses the SM-2 algorithm — the same engine behind Anki —
                                to schedule every card at the exact moment you're about to forget
                                it. Review at the right time and memory consolidates 5× faster.
                            </p>
                            <ul className={styles.srList} aria-label="Spaced repetition benefits">
                                {[
                                    ['⏱️', 'Review only cards you\'re about to forget — zero wasted sessions'],
                                    ['📈', 'Each correct answer pushes the next review further out'],
                                    ['🔁', 'Missed cards return the next day; mastered cards return in weeks'],
                                    ['🎯', 'Deck mastery score tracks your real retention, not just attempts'],
                                ].map(([icon, text]) => (
                                    <li key={text} className={styles.srItem}>
                                        <span aria-hidden="true">{icon}</span>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Decorative SR schedule visual */}
                        <div className={styles.srVisual} aria-hidden="true">
                            <div className={styles.srCard}>
                                <div className={styles.srCardHeader}>Spaced Repetition Schedule</div>
                                <div className={styles.srCardSub}>Card: "What is backpropagation?"</div>
                                <div className={styles.srTimeline}>
                                    {[
                                        { label: 'Day 0', note: 'First review', filled: true },
                                        { label: 'Day 1', note: 'Missed → resurface', filled: true },
                                        { label: 'Day 3', note: 'Got it ✓', filled: true },
                                        { label: 'Day 10', note: 'Got it ✓✓', filled: true },
                                        { label: 'Day 24', note: 'Upcoming', filled: false },
                                    ].map((point, i) => (
                                        <div key={i} className={styles.srTimelineItem}>
                                            <div className={`${styles.srDot} ${point.filled ? styles.srDotFilled : ''}`} />
                                            <div className={styles.srTimelineText}>
                                                <span className={styles.srTimelineLabel}>{point.label}</span>
                                                <span className={styles.srTimelineNote}>{point.note}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.srRatingRow}>
                                    <div className={styles.srRatingBtn + ' ' + styles.srMissed}>Missed</div>
                                    <div className={styles.srRatingBtn + ' ' + styles.srAlmost}>Almost</div>
                                    <div className={styles.srRatingBtn + ' ' + styles.srGot}>Got It</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURE DETAIL GRID ───────────────────────── */}
                <section className={styles.detailsSection} aria-labelledby="details-heading">
                    <div className={styles.sectionLabel}>Feature Deep Dive</div>
                    <h2 id="details-heading" className={styles.sectionTitle}>
                        Everything Built Around Retention
                    </h2>
                    <p className={styles.sectionSub}>
                        StudeQ flashcards aren't a card generator. They're a full memory system.
                    </p>
                    <ul className={styles.detailGrid}>
                        {DETAILS.map((d) => (
                            <li key={d.title} className={styles.detailCard}>
                                <span className={styles.detailIcon} aria-hidden="true">{d.icon}</span>
                                <h3 className={styles.detailTitle}>{d.title}</h3>
                                <p className={styles.detailBody}>{d.body}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── ANKI COMPAT + EXPORT ──────────────────────── */}
                <section className={styles.exportSection} aria-labelledby="export-heading">
                    <div className={styles.exportInner}>
                        <div className={styles.exportText}>
                            <div className={styles.sectionLabel}>Works With Your Stack</div>
                            <h2 id="export-heading" className={styles.sectionTitle}>
                                Anki Compatible. No Lock-In.
                            </h2>
                            <p className={styles.sectionSub}>
                                Already use Anki? Export any StudeQ deck as an APKG file and
                                import it directly. Or share a deck link with your study group —
                                they open it in their own notebook, no account needed.
                            </p>
                            <ul className={styles.exportList} aria-label="Export and compatibility options">
                                {[
                                    ['📦', 'Export as Anki APKG — full compatibility'],
                                    ['📋', 'Export as CSV — open in any spreadsheet'],
                                    ['🔗', 'Share deck link — anyone can study or fork it'],
                                    ['📄', 'Export as printable PDF flashcard sheets'],
                                ].map(([icon, text]) => (
                                    <li key={text} className={styles.exportItem}>
                                        <span aria-hidden="true">{icon}</span>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Decorative export card */}
                        <div className={styles.exportVisual} aria-hidden="true">
                            <div className={styles.exportCard}>
                                <div className={styles.exportCardHeader}>Export Deck</div>
                                <div className={styles.exportCardDeckName}>ML Fundamentals · 48 cards</div>
                                <div className={styles.exportBtnList}>
                                    <div className={styles.exportBtn}><span>📦</span> Anki APKG</div>
                                    <div className={styles.exportBtn}><span>📋</span> CSV</div>
                                    <div className={styles.exportBtn}><span>📄</span> PDF</div>
                                    <div className={`${styles.exportBtn} ${styles.exportBtnShare}`}><span>🔗</span> Copy Share Link</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA ───────────────────────────────────────── */}
                <section className={styles.ctaSection} aria-labelledby="cta-heading">
                    <h2 id="cta-heading" className={styles.ctaTitle}>
                        Stop re-reading. Start remembering.
                    </h2>
                    <p className={styles.ctaSub}>
                        Generate your first AI flashcard deck free — any topic, any notes, under 10 seconds.
                    </p>
                    <a href="/dashboard/flashcards/new" className={styles.btnPrimary}>
                        Build My Deck →
                    </a>
                </section>

            </main>
        </>
    );
}