import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import styles from './styles/QuizFeaturePage.module.css';

const QUIZ_TYPES = [
    {
        id: 'mcq',
        icon: '◎',
        label: 'Multiple Choice',
        desc: 'Classic 4-option questions auto-generated from any topic or uploaded notes.',
    },
    {
        id: 'truefalse',
        icon: '⇌',
        label: 'True / False',
        desc: 'Rapid-fire binary questions — great for fact retention and quick review.',
    },
    {
        id: 'shortans',
        icon: '✏',
        label: 'Short Answer',
        desc: 'Open-ended questions graded by AI for semantic accuracy, not exact match.',
    },
    {
        id: 'blanks',
        icon: '___',
        label: 'Fill in the Blank',
        desc: 'Cloze-style questions pulled directly from your study material.',
    },
    {
        id: 'flashcard',
        icon: '⟳',
        label: 'Flashcard Drill',
        desc: 'Spaced-repetition flashcards with difficulty ratings and auto-scheduling.',
    },
    {
        id: 'explain',
        icon: '💡',
        label: 'Concept Explain',
        desc: 'AI asks you to explain a concept; grades your answer for depth and accuracy.',
    },
];

const STEPS = [
    { num: '01', title: 'Upload or Paste', body: 'Drop in notes, PDFs, URLs, or type a topic. SPARK.E reads everything.' },
    { num: '02', title: 'Configure Quiz', body: 'Pick question types, count, difficulty, and time limit.' },
    { num: '03', title: 'Generate in Seconds', body: 'AI produces a full, structured quiz with answer keys and explanations.' },
    { num: '04', title: 'Take & Track', body: 'Attempt the quiz, get instant feedback, and watch your weak spots surface.' },
];

const DETAILS = [
    {
        icon: '🧠',
        title: 'Context-Aware Generation',
        body:
            'SPARK.E reads your actual study material — not just a topic keyword. Questions are grounded in your content, so no hallucinated facts.',
    },
    {
        icon: '📊',
        title: 'Performance Analytics',
        body:
            'Per-question accuracy, time spent, repeated mistakes, and a mastery score per concept. Know exactly what to study next.',
    },
    {
        icon: '🔄',
        title: 'Adaptive Difficulty',
        body:
            'Struggle on a question type? SPARK.E increases those. Ace a topic? It backs off and focuses energy elsewhere.',
    },
    {
        icon: '📝',
        title: 'Detailed Explanations',
        body:
            'Every answer comes with a source-cited explanation pulled from your notes, plus an AI rationale for why the other options are wrong.',
    },
    {
        icon: '🗂️',
        title: 'Quiz History & Retake',
        body:
            'Every quiz saved. Retake same quiz, regenerate variants, or export as PDF for offline study.',
    },
    {
        icon: '🤝',
        title: 'Share & Compete',
        body:
            'Publish a quiz link. Friends attempt it, scores compare on a leaderboard. Study groups just got competitive.',
    },
];

const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SPARK.E AI Quiz Maker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
        'AI-powered quiz maker that generates MCQ, true/false, fill-in-the-blank, and short-answer quizzes from your notes, PDFs, or any topic in seconds.',
    featureList: [
        'AI quiz generation from notes and PDFs',
        'Multiple question types',
        'Adaptive difficulty engine',
        'Performance analytics dashboard',
        'Spaced repetition flashcards',
        'Quiz sharing and leaderboards',
    ],
    url: 'https://sparke.app/features/quiz',
    screenshot: 'https://sparke.app/og-quiz.png',
};

export default function QuizFeaturePage() {
    const [activeType, setActiveType] = useState('mcq');

    const activeDetail = useMemo(
        () => QUIZ_TYPES.find((t) => t.id === activeType),
        [activeType]
    );

    const handleTypeClick = useCallback((id) => setActiveType(id), []);

    return (
        <>
            <Helmet>
                <title>AI Quiz Maker — Generate Quizzes from Notes | SPARK.E</title>
                <meta
                    name="description"
                    content="Create MCQ, true/false, fill-in-the-blank, and short-answer quizzes from your notes or any topic in seconds. SPARK.E's AI quiz engine adapts to your weaknesses."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://sparke.app/features/quiz" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sparke.app/features/quiz" />
                <meta property="og:title" content="AI Quiz Maker — Generate Quizzes from Notes | SPARK.E" />
                <meta
                    property="og:description"
                    content="Generate smart quizzes from your notes, PDFs, or topics. Multiple question types, adaptive difficulty, and instant AI explanations."
                />
                <meta property="og:image" content="https://sparke.app/og-quiz.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AI Quiz Maker — Generate Quizzes from Notes | SPARK.E" />
                <meta
                    name="twitter:description"
                    content="Generate smart quizzes from your notes, PDFs, or topics. Multiple question types, adaptive difficulty, and instant AI explanations."
                />
                <meta name="twitter:image" content="https://sparke.app/og-quiz.png" />

                {/* JSON-LD */}
                <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
            </Helmet>

            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>

            <main id="main-content" className={styles.main}>

                {/* ── HERO ─────────────────────────────────────── */}
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className={styles.heroBadge} aria-hidden="true">
                        <span className={styles.badgeDot} />
                        AI-Powered Feature
                    </div>
                    <h1 id="hero-heading" className={styles.heroTitle}>
                        Turn Any Notes into a
                        <span className={styles.heroAccent}> Smart Quiz</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Upload notes, paste a topic, or drop a PDF — SPARK.E generates
                        high-quality quizzes with answer keys and explanations in seconds.
                        Study smarter, not harder.
                    </p>
                    <div className={styles.heroCta}>
                        <a href="/dashboard/quiz/new" className={styles.btnPrimary}>
                            Generate a Quiz Free
                        </a>
                        <a href="#how-it-works" className={styles.btnGhost}>
                            See how it works ↓
                        </a>
                    </div>

                    {/* Floating stat pills */}
                    <div className={styles.heroStats} aria-label="Feature highlights">
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>6+</span>
                            <span className={styles.statLabel}>Question types</span>
                        </div>
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>&lt;10s</span>
                            <span className={styles.statLabel}>Generation time</span>
                        </div>
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>100%</span>
                            <span className={styles.statLabel}>From your material</span>
                        </div>
                    </div>
                </section>

                {/* ── QUESTION TYPE EXPLORER ────────────────────── */}
                <section className={styles.typeSection} aria-labelledby="types-heading">
                    <div className={styles.sectionLabel}>Question Types</div>
                    <h2 id="types-heading" className={styles.sectionTitle}>
                        Six Ways to Test Your Knowledge
                    </h2>
                    <p className={styles.sectionSub}>
                        SPARK.E doesn't just do multiple choice. Pick the format that matches your study goal.
                    </p>

                    <div className={styles.typeGrid} role="tablist" aria-label="Quiz question types">
                        {QUIZ_TYPES.map((type) => (
                            <button
                                key={type.id}
                                role="tab"
                                aria-selected={activeType === type.id}
                                aria-controls={`type-detail-${type.id}`}
                                className={`${styles.typeCard} ${activeType === type.id ? styles.typeCardActive : ''}`}
                                onClick={() => handleTypeClick(type.id)}
                            >
                                <span className={styles.typeIcon} aria-hidden="true">{type.icon}</span>
                                <span className={styles.typeLabel}>{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {activeDetail && (
                        <div
                            id={`type-detail-${activeDetail.id}`}
                            role="tabpanel"
                            aria-label={`${activeDetail.label} details`}
                            className={styles.typeDetail}
                        >
                            <span className={styles.typeDetailIcon} aria-hidden="true">{activeDetail.icon}</span>
                            <div>
                                <h3 className={styles.typeDetailTitle}>{activeDetail.label}</h3>
                                <p className={styles.typeDetailDesc}>{activeDetail.desc}</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── HOW IT WORKS ──────────────────────────────── */}
                <section id="how-it-works" className={styles.stepsSection} aria-labelledby="steps-heading">
                    <div className={styles.sectionLabel}>How It Works</div>
                    <h2 id="steps-heading" className={styles.sectionTitle}>
                        From Notes to Quiz in Four Steps
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

                {/* ── FEATURE DETAIL GRID ───────────────────────── */}
                <section className={styles.detailsSection} aria-labelledby="details-heading">
                    <div className={styles.sectionLabel}>Feature Deep Dive</div>
                    <h2 id="details-heading" className={styles.sectionTitle}>
                        Everything You Need to Actually Learn
                    </h2>
                    <p className={styles.sectionSub}>
                        SPARK.E quizzes aren't just question generators. They're a full study feedback loop.
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

                {/* ── INPUT SOURCES ─────────────────────────────── */}
                <section className={styles.sourcesSection} aria-labelledby="sources-heading">
                    <div className={styles.sourcesInner}>
                        <div className={styles.sourcesText}>
                            <div className={styles.sectionLabel}>Input Sources</div>
                            <h2 id="sources-heading" className={styles.sectionTitle}>
                                Works With What You Already Have
                            </h2>
                            <p className={styles.sectionSub}>
                                No reformatting. No copy-paste marathon. SPARK.E ingests your material as-is.
                            </p>
                            <ul className={styles.sourceList} aria-label="Supported input types">
                                {[
                                    ['📄', 'PDF lecture notes or textbook chapters'],
                                    ['📋', 'Pasted raw text or bullet points'],
                                    ['🔗', 'Article or Wikipedia URL'],
                                    ['🎙️', 'Lecture transcript (auto or manual)'],
                                    ['💬', 'Just a topic name — AI fills the rest'],
                                ].map(([icon, label]) => (
                                    <li key={label} className={styles.sourceItem}>
                                        <span aria-hidden="true">{icon}</span>
                                        <span>{label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.sourcesVisual} aria-hidden="true">
                            <div className={styles.fakeCard}>
                                <div className={styles.fakeCardHeader}>
                                    <span className={styles.fakeCardDot} style={{ '--c': 'var(--theme-red)' }} />
                                    <span className={styles.fakeCardDot} style={{ '--c': 'var(--theme-accent)' }} />
                                    <span className={styles.fakeCardDot} style={{ '--c': 'var(--theme-green)' }} />
                                    <span className={styles.fakeCardTitle}>quiz-gen.ai</span>
                                </div>
                                <div className={styles.fakeLines}>
                                    <div className={styles.fakeLine} style={{ '--w': '80%' }} />
                                    <div className={styles.fakeLine} style={{ '--w': '60%' }} />
                                    <div className={styles.fakeQuestion}>
                                        <div className={styles.fakeQLabel}>Q1 — MCQ</div>
                                        <div className={styles.fakeLine} style={{ '--w': '90%' }} />
                                        <div className={styles.fakeOpts}>
                                            <div className={styles.fakeOpt + ' ' + styles.fakeOptCorrect}>A</div>
                                            <div className={styles.fakeOpt}>B</div>
                                            <div className={styles.fakeOpt}>C</div>
                                            <div className={styles.fakeOpt}>D</div>
                                        </div>
                                    </div>
                                    <div className={styles.fakeQuestion}>
                                        <div className={styles.fakeQLabel}>Q2 — True / False</div>
                                        <div className={styles.fakeLine} style={{ '--w': '70%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA STRIP ─────────────────────────────────── */}
                <section className={styles.ctaSection} aria-labelledby="cta-heading">
                    <h2 id="cta-heading" className={styles.ctaTitle}>
                        Ready to stop re-reading and start testing?
                    </h2>
                    <p className={styles.ctaSub}>
                        Generate your first AI quiz free — no credit card, no setup.
                    </p>
                    <a href="/dashboard/quiz/new" className={styles.btnPrimary}>
                        Create Quiz Now →
                    </a>
                </section>

            </main>
        </>
    );
}