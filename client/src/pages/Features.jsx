import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Features.module.css';

/* ── Structured data ─────────────────────────────────── */
const SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Spark.E',
    applicationCategory: 'EducationApplication',
    description:
        'AI-powered study platform with quiz generation, smart flashcards, document chat, and intelligent scheduling for students.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
    },
    featureList: [
        'AI Quiz Generator',
        'Smart Flashcards',
        'AI Note Summarizer',
        'Document Chat (RAG)',
        'Timetable & Calendar',
        'Google + YouTube Search',
    ],
};

const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What file types does Spark.E support for quiz generation?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Spark.E supports PDF, PowerPoint, Excel, Word documents, and images for quiz generation.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does the document chat feature work?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Upload any document up to 20 MB and ask questions about it. Spark.E uses retrieval-augmented generation (RAG) to answer from your document with full markdown and math rendering.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I study without uploading files?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes — paste any text to generate quizzes, summaries, or flashcards instantly without uploading a file.',
            },
        },
    ],
};

/* ── Feature data ────────────────────────────────────── */
const FEATURES = [
    {
        id: 'quiz',
        category: 'AI Learning',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M9 12h6M9 16h4M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M9 4a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
        ),
        label: 'Quiz Generator',
        tagline: 'Six question types. One paste.',
        description:
            'Turn any text, PDF, slide deck, or image into a full quiz in seconds. Choose from multiple-choice, true/false, fill-in-the-blank, short answer, free response, or multi-layered passage questions.',
        bullets: [
            'Upload PDF, PPT, Excel, Word, or image',
            'Set difficulty and target audience',
            'Live timer, progress bar, and result scoring',
            'Full history with retake support',
        ],
        accent: 'purple',
        path: '/quiz',
    },
    {
        id: 'flashcards',
        category: 'AI Learning',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 12h8M12 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
        label: 'Smart Flashcards',
        tagline: 'Generate, flip, and remember.',
        description:
            'Create flashcard sets from a topic, a PDF, or from scratch. Study with a flip-card viewer powered by keyboard navigation and spaced repetition.',
        bullets: [
            'AI-generates cards from any topic or PDF',
            'Keyboard-first viewer (Space / Arrow keys)',
            'Progress dots and card counter',
            'Standard and spaced repetition modes',
        ],
        accent: 'accent',
        path: '/flashcards',
    },
    {
        id: 'notes',
        category: 'AI Learning',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M12 20h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'AI Notes',
        tagline: 'Paste once. Get a structured summary.',
        description:
            'Paste any lecture, article, or study material and get an AI-generated title, summary, and key-point list streamed in real time. Pin, edit, export to PDF.',
        bullets: [
            'Real-time streaming via Socket.io',
            'Pin important notes to the top',
            'Export any note to PDF in one click',
            'Mobile-friendly sidebar drawer',
        ],
        accent: 'green',
        path: '/notes',
    },
    {
        id: 'notebook',
        category: 'AI Learning',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Document Chat',
        tagline: 'Ask your PDF anything.',
        description:
            'Upload a document up to 20 MB and chat with it. Answers are pulled directly from your file via vector search — with full markdown and LaTeX/KaTeX rendering.',
        bullets: [
            'Supports PDF, PPT, Excel, Word, images',
            'RAG-powered answers from your own docs',
            'Markdown + math rendering out of the box',
            'Chat history with edit and delete',
        ],
        accent: 'teal',
        path: '/notebook',
    },
    {
        id: 'timetable',
        category: 'Productivity',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
        label: 'Timetable',
        tagline: 'Your whole week, one view.',
        description:
            'A full calendar with Day, Week, Month, and Agenda views. Create recurring events with categories, color labels, and reminders. Drag-and-drop scheduling built in.',
        bullets: [
            'Four views: Day, Week, Month, Agenda',
            'Recurring events with custom recurrence',
            'Color-coded categories (Learning, Health, Work…)',
            'Reminder notifications',
        ],
        accent: 'orange',
        path: '/time-table/week',
    },
    {
        id: 'search',
        category: 'Utility',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
        label: 'Smart Search',
        tagline: 'Google + YouTube in one tab.',
        description:
            'Search the web and YouTube side by side without leaving the app. An AI overview summarises results; credibility badges flag Edu, Gov, and trusted sources instantly.',
        bullets: [
            'Dual-tab: Google results + YouTube videos',
            'Gemini-powered AI overview block',
            'Credibility badges on every result',
            'Bookmark links with keyboard nav (↑↓/B)',
        ],
        accent: 'pink',
        path: '/search',
    },
];

const STATS = [
    { value: '6', label: 'Question types', sub: 'in the quiz generator' },
    { value: '20MB', label: 'Document size', sub: 'for chat & analysis' },
    { value: '4', label: 'Calendar views', sub: 'day · week · month · agenda' },
    { value: '3', label: 'Flashcard modes', sub: 'AI · manual · from PDF' },
];

export default function Features() {
    const featuresByCategory = useMemo(() => {
        return FEATURES.reduce((acc, f) => {
            (acc[f.category] ||= []).push(f);
            return acc;
        }, {});
    }, []);

    return (
        <>
            <Helmet>
                <title>Features — Spark.E AI Study Platform</title>
                <meta
                    name="description"
                    content="Explore Spark.E's AI tools: quiz generator, smart flashcards, note summarizer, document chat, timetable, and dual search — built for students."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://yourdomain.com/features" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Features — Spark.E AI Study Platform" />
                <meta
                    property="og:description"
                    content="Quiz generator, document chat, AI flashcards, timetable & more. Everything a student needs to study smarter."
                />
                <meta property="og:image" content="https://sparke.app/og-features.jpg" />
                <meta property="og:url" content="https://sparke.app/features" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Features — Spark.E AI Study Platform" />
                <meta
                    name="twitter:description"
                    content="Quiz generator, document chat, AI flashcards, timetable & more. Everything a student needs to study smarter."
                />
                <meta name="twitter:image" content="https://sparke.app/og-features.jpg" />

                {/* Structured data */}
                <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
                <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
            </Helmet>

            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>

            <main id="main-content" className={styles.main}>

                {/* ── HERO ─────────────────────────────────────── */}
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className={styles.heroInner}>
                        <p className={styles.eyebrow} aria-hidden="true">Everything you need to learn faster</p>
                        <h1 id="hero-heading" className={styles.heroHeading}>
                            AI tools built<br />
                            <span className={styles.heroAccent}>for how students actually study</span>
                        </h1>
                        <p className={styles.heroSub}>
                            From pasting a paragraph to a polished quiz — Spark.E handles the busywork so you can focus on understanding.
                        </p>
                        <div className={styles.heroCta} role="group" aria-label="Get started actions">
                            <Link to="/register" className={styles.ctaPrimary}>
                                Start for free
                            </Link>
                            <Link to="/login" className={styles.ctaSecondary}>
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* Decorative grid pattern */}
                    <div className={styles.heroGrid} aria-hidden="true">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <span key={i} className={styles.heroGridCell} />
                        ))}
                    </div>
                </section>

                {/* ── STATS STRIP ──────────────────────────────── */}
                <section className={styles.statsSection} aria-label="Platform statistics">
                    <ul className={styles.statsList} role="list">
                        {STATS.map((s) => (
                            <li key={s.label} className={styles.statItem}>
                                <span className={styles.statValue} aria-label={`${s.value} — ${s.label}`}>
                                    {s.value}
                                </span>
                                <span className={styles.statLabel}>{s.label}</span>
                                <span className={styles.statSub}>{s.sub}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── FEATURE SECTIONS ─────────────────────────── */}
                {Object.entries(featuresByCategory).map(([category, features]) => (
                    <section
                        key={category}
                        className={styles.categorySection}
                        aria-labelledby={`cat-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        <div className={styles.categoryHeader}>
                            <h2
                                id={`cat-${category.toLowerCase().replace(/\s+/g, '-')}`}
                                className={styles.categoryLabel}
                            >
                                {category}
                            </h2>
                        </div>

                        <ul className={styles.featureGrid} role="list">
                            {features.map((feature) => (
                                <li
                                    key={feature.id}
                                    className={`${styles.featureCard} ${styles[`accent-${feature.accent}`]}`}
                                >
                                    <article aria-labelledby={`feat-${feature.id}-heading`}>
                                        <header className={styles.cardHeader}>
                                            <div className={styles.cardIcon} aria-hidden="true">
                                                {feature.icon}
                                            </div>
                                            <div className={styles.cardMeta}>
                                                <p className={styles.cardTagline}>{feature.tagline}</p>
                                                <h3 id={`feat-${feature.id}-heading`} className={styles.cardTitle}>
                                                    {feature.label}
                                                </h3>
                                            </div>
                                        </header>

                                        <p className={styles.cardDesc}>{feature.description}</p>

                                        <ul className={styles.cardBullets} role="list" aria-label={`${feature.label} highlights`}>
                                            {feature.bullets.map((b) => (
                                                <li key={b} className={styles.cardBullet}>
                                                    <span className={styles.bulletDot} aria-hidden="true" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            to={feature.path}
                                            className={styles.cardCta}
                                            aria-label={`Open ${feature.label}`}
                                        >
                                            Open {feature.label}
                                            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className={styles.ctaArrow}>
                                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Link>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}

                {/* ── FAQ ──────────────────────────────────────── */}
                <section className={styles.faqSection} aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className={styles.faqHeading}>Common questions</h2>
                    <dl className={styles.faqList}>
                        {FAQ_SCHEMA.mainEntity.map((item) => (
                            <div key={item.name} className={styles.faqItem}>
                                <dt className={styles.faqQuestion}>{item.name}</dt>
                                <dd className={styles.faqAnswer}>{item.acceptedAnswer.text}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* ── FINAL CTA ────────────────────────────────── */}
                <section className={styles.finalCta} aria-labelledby="cta-heading">
                    <h2 id="cta-heading" className={styles.finalCtaHeading}>
                        Ready to study smarter?
                    </h2>
                    <p className={styles.finalCtaSub}>
                        Free to start. No credit card required.
                    </p>
                    <Link to="/register" className={styles.ctaPrimary}>
                        Create your account
                    </Link>
                </section>
            </main>
        </>
    );
}