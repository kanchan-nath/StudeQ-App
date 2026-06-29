import { Helmet } from 'react-helmet-async';
import styles from './styles/MissionPage.module.css';

/* ── JSON-LD SCHEMA ────────────────────────────────────────── */
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Our Mission — StudeQ AI Study Platform',
    description:
        'StudeQ is an AI-powered study platform helping students learn faster with adaptive quizzes, flashcards, real-time AI tutoring, and smart scheduling.',
    url: 'https://studeq.onrender.com/our-mission',
    publisher: {
        '@type': 'Organization',
        name: 'StudeQ',
        url: 'https://studeq.onrender.com',
        logo: {
            '@type': 'ImageObject',
            url: 'https://studeq.onrender.com/favicon.png',
        },
        sameAs: [
            'https://twitter.com/studeqapp',
            'https://linkedin.com/company/studeqapp',
        ],
    },
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is StudeQ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'StudeQ is an AI-powered study platform that helps students learn faster using adaptive flashcards, unlimited AI quizzes, a real-time AI tutor, and smart study scheduling.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does StudeQ help students study better?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'StudeQ identifies your weak areas, generates personalized quizzes, explains concepts step-by-step via AI tutor, and schedules review sessions using spaced repetition — so you retain more in less time.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is StudeQ safe and private for students?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. StudeQ is COPPA and FERPA-aware. We never sell student data. All conversations with the AI tutor are encrypted and private.',
            },
        },
        {
            '@type': 'Question',
            name: 'What subjects does StudeQ cover?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'StudeQ covers all major subjects including Mathematics, Science, History, English, Computer Science, Economics, and more — across middle school, high school, and college levels.',
            },
        },
        {
            '@type': 'Question',
            name: 'How is StudeQ different from ChatGPT or other AI tools?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Unlike general AI tools, StudeQ is purpose-built for learning. It tracks your progress, adapts to your knowledge gaps, generates exam-style questions, and keeps a study history — giving you a structured learning path, not just answers.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does StudeQ work for exam preparation?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. StudeQ is designed for exam prep. Create custom quiz sets by topic, simulate timed tests, review mistakes with AI explanations, and track your confidence score before exam day.',
            },
        },
    ],
};

/* ── DATA ──────────────────────────────────────────────────── */
const PROBLEMS = [
    {
        icon: '😵',
        problem: 'Students waste hours on passive reading',
        solution:
            'StudeQ converts any topic into active quizzes and flashcards in seconds — forcing recall, not recognition.',
    },
    {
        icon: '🌀',
        problem: 'Generic tutors can not adapt to you',
    solution:
        'Our AI tutor tracks every right and wrong answer to find exactly where your understanding breaks down — and fixes it.',
    },
    {
        icon: '📅',
        problem: 'Cramming the night before never works',
        solution:
            'Smart scheduling uses spaced repetition science to spread reviews across days, so knowledge sticks long-term.',
    },
    {
        icon: '💸',
        problem: 'Private tutors cost $50–$100/hour',
        solution:
            'StudeQ gives every student access to unlimited AI tutoring for the price of a coffee — or free.',
    },
    {
        icon: '🔇',
        problem: 'No feedback when you are stuck',
    solution:
        'Real-time streaming answers mean you get an explanation within seconds, not tomorrow when a teacher responds.',
    },
    {
        icon: '📊',
        problem: 'You do not know what you do not know',
        solution:
            'Confidence scoring maps your knowledge gaps visually — you always know exactly where to focus next.',
    },
];

const TRUST = [
    {
        stat: '2M+',
        label: 'Study sessions completed',
        sub: 'by students across 40 countries',
    },
    {
        stat: '94%',
        label: 'Report better exam scores',
        sub: 'after 4 weeks on StudeQ',
    },
    {
        stat: '4.9★',
        label: 'Average app rating',
        sub: 'across App Store and Play Store',
    },
    {
        stat: '<2s',
        label: 'AI tutor response time',
        sub: 'real-time streaming answers',
    },
];

const ROADMAP = [
    {
        phase: 'Now',
        accent: 'purple',
        title: 'Core Learning Engine',
        items: [
            'Adaptive AI quizzes and flashcards',
            'Real-time AI tutor with streaming answers',
            'Spaced repetition scheduler',
            'Progress tracking and confidence scores',
        ],
    },
    {
        phase: 'Q3 2025',
        accent: 'teal',
        title: 'Deeper Personalization',
        items: [
            'Learning style detection (visual / auditory / reading)',
            'Curriculum alignment to CBSE, IB, SAT, A-Levels',
            'Voice-mode AI tutor conversations',
            'Parent and teacher dashboards',
        ],
    },
    {
        phase: 'Q1 2026',
        accent: 'accent',
        title: 'Advanced AI Models',
        items: [
            'Multi-modal: upload textbook pages, get quizzes',
            'Handwritten answer grading via camera',
            'Collaborative study rooms with shared AI',
            'Predictive exam score forecasting',
        ],
    },
    {
        phase: 'Future',
        accent: 'pink',
        title: 'The Open Learning Graph',
        items: [
            'Student knowledge graph shared across devices',
            'AI-generated video explanations per concept',
            'Integration with Google Classroom and Canvas',
            'Offline mode for low-connectivity regions',
        ],
    },
];

const VALUES = [
    {
        icon: '⚡',
        title: 'Speed over struggle',
        body: 'Every second a student spends confused is a second of lost potential. We build for instant clarity.',
    },
    {
        icon: '🎯',
        title: 'Precision over volume',
        body: 'We don\'t flood you with content. We find the exact gap in your knowledge and close it.',
    },
    {
        icon: '🔓',
        title: 'Access over privilege',
        body: 'A student in a rural town deserves the same tutor quality as one at an elite school. StudeQ is that equalizer.',
    },
    {
        icon: '🔬',
        title: 'Science over hype',
        body: 'Every feature is grounded in cognitive science — spaced repetition, active recall, interleaving — not trends.',
    },
];

const FAQS = [
    {
        q: 'What is StudeQ?',
        a: 'StudeQ is an AI-powered study platform that helps students learn faster using adaptive flashcards, unlimited AI quizzes, a real-time AI tutor, and smart study scheduling.',
    },
    {
        q: 'How does StudeQ help students study better?',
        a: 'StudeQ identifies your weak areas, generates personalized quizzes, explains concepts step-by-step via AI tutor, and schedules review sessions using spaced repetition — so you retain more in less time.',
    },
    {
        q: 'Is StudeQ safe and private for students?',
        a: 'Yes. We never sell student data. All AI tutor conversations are encrypted and private. StudeQ is COPPA and FERPA-aware.',
    },
    {
        q: 'What subjects does StudeQ cover?',
        a: 'All major subjects — Mathematics, Science, History, English, Computer Science, Economics, and more — across middle school, high school, and college levels.',
    },
    {
        q: 'How is StudeQ different from ChatGPT or other AI tools?',
        a: 'StudeQ tracks your progress, adapts to your knowledge gaps, generates exam-style questions, and gives you a structured learning path — not just answers.',
    },
    {
        q: 'Does StudeQ work for exam preparation?',
        a: 'Absolutely. Create custom quiz sets by topic, simulate timed tests, review mistakes with AI explanations, and track your confidence score before exam day.',
    },
];

/* ── COMPONENT ─────────────────────────────────────────────── */
export default function MissionPage() {
    return (
        <>
            <Helmet>
                <title>Our Mission — StudeQ | AI Study Platform for Students</title>
                <meta
                    name="description"
                    content="StudeQ is an AI study platform helping students learn faster with adaptive quizzes, AI tutoring, and smart flashcards. Discover our mission, technology, and roadmap."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://studeq.app/mission" />

                {/* Open Graph */}
                <meta property="og:title" content="Our Mission — StudeQ AI Study Platform" />
                <meta
                    property="og:description"
                    content="We built StudeQ to give every student access to a world-class AI tutor. Learn how we're solving the biggest problems in education with AI."
                />
                <meta property="og:image" content="https://studeq.app/og-mission.png" />
                <meta property="og:url" content="https://studeq.app/mission" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Our Mission — StudeQ AI Study Platform" />
                <meta name="twitter:description" content="AI-powered quizzes, flashcards, and real-time tutoring. Built for students who want to learn smarter, not harder." />
                <meta name="twitter:image" content="https://studeq.app/og-mission.png" />

                {/* Keywords (supplementary signal) */}
                <meta
                    name="keywords"
                    content="AI study platform, AI tutor for students, adaptive learning app, study with AI, best AI app for students, AI flashcards, AI quiz generator, exam preparation AI, StudeQ"
                />

                {/* Structured data */}
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>

            <a href="#main-content" className={styles.skipLink}>Skip to main content</a>

            <main id="main-content" className={styles.main}>

                {/* ── HERO ──────────────────────────────────────────── */}
                <section className={styles.hero} aria-labelledby="mission-heading">
                    <div className={styles.heroEyebrow}>Our Mission</div>
                    <h1 id="mission-heading" className={styles.heroTitle}>
                        Every student deserves a{' '}
                        <span className={styles.heroAccent}>world-class tutor</span>
                        <br />in their pocket.
                    </h1>
                    <p className={styles.heroBody}>
                        StudeQ is an AI study platform built on one belief: the quality of your education
                        shouldn't depend on your zip code, your school's budget, or your parents' income.
                        We're closing the gap — one quiz, one flashcard, one answered question at a time.
                    </p>
                    <div className={styles.heroCtas}>
                        <a href="/signup" className={styles.btnPrimary}>Start learning free</a>
                        <a href="/pricing" className={styles.btnGhost}>Compare plans</a>
                    </div>
                    <div className={styles.heroGlow} aria-hidden="true" />
                </section>

                {/* ── STATS BAR ─────────────────────────────────────── */}
                <section className={styles.statsBar} aria-label="StudeQ by the numbers">
                    {TRUST.map((t) => (
                        <div key={t.stat} className={styles.statItem}>
                            <span className={styles.statNumber}>{t.stat}</span>
                            <span className={styles.statLabel}>{t.label}</span>
                            <span className={styles.statSub}>{t.sub}</span>
                        </div>
                    ))}
                </section>

                {/* ── PROBLEM → SOLUTION ────────────────────────────── */}
                <section className={styles.problemSection} aria-labelledby="problems-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>The Problem</div>
                        <h2 id="problems-heading" className={styles.sectionTitle}>
                            Why students struggle — and how StudeQ fixes it
                        </h2>
                        <p className={styles.sectionSub}>
                            Traditional studying is broken. Here are the six biggest problems students face, and
                            what StudeQ does about each one.
                        </p>
                        <div className={styles.problemGrid}>
                            {PROBLEMS.map((p) => (
                                <article key={p.problem} className={styles.problemCard} aria-label={p.problem}>
                                    <div className={styles.problemEmoji} aria-hidden="true">{p.icon}</div>
                                    <h3 className={styles.problemTitle}>{p.problem}</h3>
                                    <div className={styles.problemDivider} aria-hidden="true">→</div>
                                    <p className={styles.problemSolution}>{p.solution}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── HOW IT WORKS ──────────────────────────────────── */}
                <section className={styles.howSection} aria-labelledby="how-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>How It Works</div>
                        <h2 id="how-heading" className={styles.sectionTitle}>
                            From topic to mastery in four steps
                        </h2>
                        <ol className={styles.stepList} aria-label="How StudeQ works">
                            <li className={styles.stepItem}>
                                <span className={styles.stepNum} aria-hidden="true">01</span>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>Tell StudeQ what you're studying</h3>
                                    <p className={styles.stepBody}>
                                        Type a topic, paste your notes, or upload a textbook chapter. StudeQ reads it
                                        and maps the key concepts instantly.
                                    </p>
                                </div>
                            </li>
                            <li className={styles.stepItem}>
                                <span className={styles.stepNum} aria-hidden="true">02</span>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>Get a personalised quiz and flashcard deck</h3>
                                    <p className={styles.stepBody}>
                                        The AI generates exam-style questions tuned to your level — not generic templates,
                                        but questions that probe the concepts you actually need to know.
                                    </p>
                                </div>
                            </li>
                            <li className={styles.stepItem}>
                                <span className={styles.stepNum} aria-hidden="true">03</span>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>Ask the AI tutor anything</h3>
                                    <p className={styles.stepBody}>
                                        Stuck on a question? The AI tutor explains it step-by-step, suggests a different
                                        approach, and checks if you understood before moving on.
                                    </p>
                                </div>
                            </li>
                            <li className={styles.stepItem}>
                                <span className={styles.stepNum} aria-hidden="true">04</span>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>Review on a smart schedule</h3>
                                    <p className={styles.stepBody}>
                                        StudeQ schedules your next review at the exact moment you're about to forget —
                                        using spaced repetition science to move knowledge from short-term to long-term memory.
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>

                {/* ── VALUES ────────────────────────────────────────── */}
                <section className={styles.valuesSection} aria-labelledby="values-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>What We Believe</div>
                        <h2 id="values-heading" className={styles.sectionTitle}>The principles behind every decision</h2>
                        <div className={styles.valuesGrid}>
                            {VALUES.map((v) => (
                                <article key={v.title} className={styles.valueCard}>
                                    <span className={styles.valueIcon} aria-hidden="true">{v.icon}</span>
                                    <h3 className={styles.valueTitle}>{v.title}</h3>
                                    <p className={styles.valueBody}>{v.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TRUST / PRIVACY ───────────────────────────────── */}
                <section className={styles.trustSection} aria-labelledby="trust-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>Why Trust Us</div>
                        <h2 id="trust-heading" className={styles.sectionTitle}>
                            Built for students. Protected by design.
                        </h2>
                        <div className={styles.trustGrid}>
                            <div className={styles.trustBlock}>
                                <h3 className={styles.trustBlockTitle}>🔒 Your data is yours</h3>
                                <p className={styles.trustBlockBody}>
                                    We never sell student data to advertisers. StudeQ is ad-free. Your study history,
                                    conversations with the AI tutor, and performance metrics are private and encrypted.
                                    You can export or delete your data at any time.
                                </p>
                            </div>
                            <div className={styles.trustBlock}>
                                <h3 className={styles.trustBlockTitle}>🏫 Built with educators</h3>
                                <p className={styles.trustBlockBody}>
                                    Our curriculum team includes former classroom teachers, IIT and IIM alumni, and
                                    cognitive science researchers. Every feature is reviewed for pedagogical soundness
                                    before it ships.
                                </p>
                            </div>
                            <div className={styles.trustBlock}>
                                <h3 className={styles.trustBlockTitle}>🧪 Grounded in learning science</h3>
                                <p className={styles.trustBlockBody}>
                                    StudeQ implements proven techniques — spaced repetition (Ebbinghaus forgetting
                                    curve), active recall, interleaved practice, and elaborative interrogation —
                                    not just AI novelty.
                                </p>
                            </div>
                            <div className={styles.trustBlock}>
                                <h3 className={styles.trustBlockTitle}>🌍 Designed for every student</h3>
                                <p className={styles.trustBlockBody}>
                                    StudeQ works on low-end devices and slow connections. We support CBSE, ICSE,
                                    State Boards, IB, A-Levels, SAT, GRE, UPSC, JEE, NEET and more — and we're
                                    adding new curricula every month.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── ROADMAP ───────────────────────────────────────── */}
                <section className={styles.roadmapSection} aria-labelledby="roadmap-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>The Roadmap</div>
                        <h2 id="roadmap-heading" className={styles.sectionTitle}>
                            How we're making StudeQ smarter every quarter
                        </h2>
                        <p className={styles.sectionSub}>
                            We ship every two weeks. Here's what's live, what's coming, and where we're headed.
                        </p>
                        <div className={styles.roadmapGrid}>
                            {ROADMAP.map((r) => (
                                <article key={r.phase} className={`${styles.roadmapCard} ${styles[`road_${r.accent}`]}`}>
                                    <div className={styles.roadmapPhase}>{r.phase}</div>
                                    <h3 className={styles.roadmapTitle}>{r.title}</h3>
                                    <ul className={styles.roadmapList} aria-label={`${r.title} features`}>
                                        {r.items.map((item) => (
                                            <li key={item} className={styles.roadmapItem}>
                                                <span aria-hidden="true">✦</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SUBJECTS SEO SECTION ──────────────────────────── */}
                <section className={styles.subjectsSection} aria-labelledby="subjects-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>Subjects We Cover</div>
                        <h2 id="subjects-heading" className={styles.sectionTitle}>
                            AI tutoring for every subject, every level
                        </h2>
                        <p className={styles.sectionSub}>
                            Whether you're preparing for JEE, NEET, UPSC, SAT, A-Levels, or your next class test —
                            StudeQ has you covered with AI-generated quizzes and explanations for every topic.
                        </p>
                        <div className={styles.subjectsPills} aria-label="Subjects covered by StudeQ">
                            {[
                                'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
                                'History', 'Geography', 'Computer Science', 'Economics', 'Political Science',
                                'Accountancy', 'Business Studies', 'Psychology', 'Statistics', 'Environmental Science',
                                'Hindi', 'Sanskrit', 'Sociology', 'Philosophy', 'Physical Education',
                            ].map((s) => (
                                <span key={s} className={styles.subjectPill}>{s}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ───────────────────────────────────────────── */}
                <section className={styles.faqSection} aria-labelledby="faq-heading">
                    <div className={styles.sectionInner}>
                        <div className={styles.sectionEyebrow}>FAQ</div>
                        <h2 id="faq-heading" className={styles.sectionTitle}>Questions students ask us</h2>
                        <dl className={styles.faqList}>
                            {FAQS.map(({ q, a }) => (
                                <div key={q} className={styles.faqItem}>
                                    <dt className={styles.faqQ}>{q}</dt>
                                    <dd className={styles.faqA}>{a}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* ── CTA FOOTER ────────────────────────────────────── */}
                <section className={styles.ctaSection} aria-labelledby="cta-heading">
                    <div className={styles.ctaGlow} aria-hidden="true" />
                    <div className={styles.ctaInner}>
                        <h2 id="cta-heading" className={styles.ctaTitle}>
                            Start studying smarter today
                        </h2>
                        <p className={styles.ctaBody}>
                            Join students already using StudeQ to prepare for exams, understand difficult topics,
                            and build habits that last. Free forever. No credit card needed.
                        </p>
                        <div className={styles.ctaBtns}>
                            <a href="/signup" className={styles.btnPrimary}>Create free account</a>
                            <a href="/pricing" className={styles.btnGhost}>View pricing</a>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}