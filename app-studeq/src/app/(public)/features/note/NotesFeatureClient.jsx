"use client"
import { useState, useCallback } from 'react';
import styles from './page.module.css';

/* ─── DATA ─────────────────────────────────────────────────── */
const FAQ_ITEMS = [
    {
        id: 'faq-formats',
        question: 'What types of notes does StudeQ support?',
        answer:
            'StudeQ accepts plain text, formatted lecture notes, and PDF uploads. Paste directly from your LMS, type freehand, or drop in a file — the AI processes any format without extra steps.',
    },
    {
        id: 'faq-how',
        question: 'How does AI summarization work?',
        answer:
            'StudeQ analyzes note content using LLMs fine-tuned for academic material. It identifies key concepts, condenses lengthy explanations, and structures information into scannable summaries you can actually study from.',
    },
    {
        id: 'faq-organize',
        question: 'Can I organize notes by subject or course?',
        answer:
            'Yes. Notes are auto-tagged by detected subject area and you can manually assign them to courses. The dashboard groups by course so you find exactly what you need before an exam.',
    },
    {
        id: 'faq-accuracy',
        question: 'How accurate is the AI analysis?',
        answer:
            'Accuracy scales with input quality. Well-structured lecture content yields highly precise summaries. You can always review and correct AI output before converting to flashcards or quizzes.',
    },
    {
        id: 'faq-edit',
        question: 'Can I edit AI-generated summaries?',
        answer:
            'Absolutely. All AI output is fully editable. Think of it as a first draft — StudeQ handles the heavy lifting, you refine it to match your understanding.',
    },
    {
        id: 'faq-privacy',
        question: 'Is my note data private and secure?',
        answer:
            'Your notes are stored securely and never used to train models or shared with third parties. Each user\'s data is isolated and processed under strict data handling policies.',
    },
];

const FEATURES = [
    {
        id: 'feat-summary',
        icon: '✦',
        accentVar: '--theme-accent',
        title: 'AI Summarization',
        desc: 'Condenses hours of lecture content into scannable bullet points, retaining only what matters for exams.',
    },
    {
        id: 'feat-tag',
        icon: '◈',
        accentVar: '--theme-purple',
        title: 'Smart Auto-Tagging',
        desc: 'Topics, concepts, and subject areas are detected and tagged automatically. No manual filing.',
    },
    {
        id: 'feat-concepts',
        icon: '◉',
        accentVar: '--theme-accent',
        title: 'Key Concept Detection',
        desc: 'Formulas, definitions, and critical dates are identified and surfaced at the top — nothing gets buried.',
    },
    {
        id: 'feat-input',
        icon: '⬡',
        accentVar: '--theme-purple',
        title: 'Multi-Format Input',
        desc: 'Paste raw text, type freehand, or upload a PDF. StudeQ handles any format without extra steps.',
    },
    {
        id: 'feat-quiz',
        icon: '◑',
        accentVar: '--theme-accent',
        title: 'Notes → Quiz',
        desc: 'Turn any note into a multiple-choice or open-ended quiz in one click. Study what you wrote, tested.',
    },
    {
        id: 'feat-flash',
        icon: '◐',
        accentVar: '--theme-purple',
        title: 'Notes → Flashcards',
        desc: 'Generate a full flashcard deck from your notes instantly. Spaced repetition kicks in automatically.',
    },
];

const STEPS = [
    {
        num: '01',
        title: 'Add Your Notes',
        desc: 'Paste lecture text, type freehand, or upload a PDF. Any format, any length.',
    },
    {
        num: '02',
        title: 'AI Processes & Organizes',
        desc: 'The AI summarizes, tags topics, highlights key concepts, and structures your content.',
    },
    {
        num: '03',
        title: 'Study With Generated Material',
        desc: 'Convert to quizzes and flashcards, or review the structured summary — all in one place.',
    },
];

const INTEGRATIONS = [
    { icon: '⬡', label: 'Flashcards', desc: 'Deck built from note content' },
    { icon: '◑', label: 'Quiz Engine', desc: 'Questions from key concepts' },
    { icon: '◈', label: 'AI Study Chat', desc: 'Ask questions about your notes' },
    { icon: '◉', label: 'Scheduler', desc: 'Auto-schedule note review sessions' },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function NotesFeatureClient() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = useCallback((id) => {
        setOpenFaq((prev) => (prev === id ? null : id));
    }, []);

    return (
        <>
            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>

            <main id="main-content" className={styles.main}>

                {/* Hero */}
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className={styles.heroContent}>
                        <span className={styles.heroEyebrow} aria-label="StudeQ Feature: Notes">
                            ✦ Notes Feature
                        </span>

                        <h1 id="hero-heading" className={styles.heroHeading}>
                            Your Lectures,{' '}
                            <span className={styles.heroAccent}>Summarized by AI</span>
                        </h1>

                        <p className={styles.heroSubtext}>
                            Paste any lecture text or upload your notes. StudeQ organizes content,
                            highlights key concepts, and turns everything into study-ready material — automatically.
                        </p>

                        <div className={styles.heroCtas}>
                            <a href="/register" className={styles.btnPrimary}>
                                Start Taking Notes Free
                            </a>
                            <a href="#how-it-works" className={styles.btnSecondary}>
                                See How It Works
                            </a>
                        </div>
                    </div>

                    {/* CSS-animated note editor mockup */}
                    <div className={styles.heroVisual} aria-hidden="true" role="presentation">
                        <div className={styles.noteEditor}>
                            <div className={styles.editorBar}>
                                <span className={styles.dotRed} />
                                <span className={styles.dotYellow} />
                                <span className={styles.dotGreen} />
                                <span className={styles.editorBarTitle}>Lecture Notes · Organic Chemistry</span>
                            </div>

                            <div className={styles.editorBody}>
                                <div className={styles.editorLine} style={{ '--lw': '92%', '--ld': '0s' }} />
                                <div className={styles.editorLine} style={{ '--lw': '76%', '--ld': '0.08s' }} />
                                <div className={styles.editorLine} style={{ '--lw': '84%', '--ld': '0.16s' }} />

                                <div className={styles.editorHighlightRow} style={{ '--ld': '0.24s' }}>
                                    <span className={styles.conceptPill}>Key Concept</span>
                                    <div className={styles.editorLineAccent} style={{ '--lw': '55%' }} />
                                </div>

                                <div className={styles.editorLine} style={{ '--lw': '70%', '--ld': '0.32s' }} />
                                <div className={styles.editorLine} style={{ '--lw': '88%', '--ld': '0.4s' }} />

                                <div className={styles.editorHighlightRow} style={{ '--ld': '0.48s' }}>
                                    <span className={styles.formulaPill}>Formula</span>
                                    <div className={styles.editorLineAccent} style={{ '--lw': '48%' }} />
                                </div>

                                <div className={styles.editorLine} style={{ '--lw': '64%', '--ld': '0.56s' }} />
                            </div>

                            <div className={styles.aiPanel}>
                                <span className={styles.aiPanelLabel}>✦ AI Summary</span>
                                <div className={styles.summaryLine} style={{ '--lw': '88%', '--ld': '0s' }} />
                                <div className={styles.summaryLine} style={{ '--lw': '72%', '--ld': '0.12s' }} />
                                <div className={styles.summaryLine} style={{ '--lw': '60%', '--ld': '0.24s' }} />
                            </div>
                        </div>

                        <div className={styles.floatBadge} aria-hidden="true">
                            <span className={styles.floatBadgeIcon}>◈</span>
                            <div className={styles.floatBadgeText}>
                                <span className={styles.floatBadgeTitle}>3 concepts tagged</span>
                                <span className={styles.floatBadgeSub}>auto-detected</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Belt */}
                <section className={styles.statsBelt} aria-label="AI Notes key statistics">
                    <div className={styles.statItem}>
                        <span className={styles.statNum}>10×</span>
                        <span className={styles.statLabel}>Faster note review</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statItem}>
                        <span className={styles.statNum}>3 sec</span>
                        <span className={styles.statLabel}>To generate a summary</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statItem}>
                        <span className={styles.statNum}>100%</span>
                        <span className={styles.statLabel}>Editable AI output</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statItem}>
                        <span className={styles.statNum}>4</span>
                        <span className={styles.statLabel}>Input formats supported</span>
                    </div>
                </section>

                {/* Features Grid */}
                <section className={styles.featuresSection} aria-labelledby="features-heading">
                    <div className={styles.sectionHeader}>
                        <h2 id="features-heading" className={styles.sectionHeading}>
                            Everything Your Notes Need
                        </h2>
                        <p className={styles.sectionSub}>
                            Built for students who study with their notes — not just store them.
                        </p>
                    </div>

                    <ul className={styles.featuresGrid} role="list">
                        {FEATURES.map((f) => (
                            <li key={f.id} className={styles.featureCard}>
                                <span
                                    className={styles.featureIcon}
                                    style={{ color: `var(${f.accentVar})` }}
                                    aria-hidden="true"
                                >
                                    {f.icon}
                                </span>
                                <h3 className={styles.featureTitle}>{f.title}</h3>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* How It Works */}
                <section
                    id="how-it-works"
                    className={styles.howSection}
                    aria-labelledby="how-heading"
                >
                    <div className={styles.sectionHeader}>
                        <h2 id="how-heading" className={styles.sectionHeading}>
                            How It Works
                        </h2>
                        <p className={styles.sectionSub}>
                            From raw lecture content to structured study material in three steps.
                        </p>
                    </div>

                    <ol className={styles.stepsList} aria-label="How StudeQ AI Notes works">
                        {STEPS.map((step, idx) => (
                            <li key={step.num} className={styles.stepItem}>
                                <span className={styles.stepNum} aria-hidden="true">{step.num}</span>
                                <div className={styles.stepBody}>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDesc}>{step.desc}</p>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <span className={styles.stepArrow} aria-hidden="true">→</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Integrations */}
                <section className={styles.integrationsSection} aria-labelledby="integrations-heading">
                    <div className={styles.integrationsWrap}>
                        <div className={styles.integrationsText}>
                            <span className={styles.integrationsEyebrow}>Connected Features</span>
                            <h2 id="integrations-heading" className={styles.sectionHeading}>
                                Notes Power Your<br />Whole Study Flow
                            </h2>
                            <p className={styles.sectionSub}>
                                Notes don't sit in isolation. Every note you create connects directly
                                to StudeQ's full study ecosystem.
                            </p>
                        </div>

                        <ul className={styles.integrationCards} role="list">
                            {INTEGRATIONS.map((item) => (
                                <li key={item.label} className={styles.integrationCard}>
                                    <span className={styles.integrationIcon} aria-hidden="true">
                                        {item.icon}
                                    </span>
                                    <span className={styles.integrationLabel}>{item.label}</span>
                                    <span className={styles.integrationDesc}>{item.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* FAQ */}
                <section className={styles.faqSection} aria-labelledby="faq-heading">
                    <div className={styles.sectionHeader}>
                        <h2 id="faq-heading" className={styles.sectionHeading}>
                            Frequently Asked Questions
                        </h2>
                        <p className={styles.sectionSub}>
                            Everything you need to know about AI Notes in StudeQ.
                        </p>
                    </div>

                    <dl className={styles.faqList}>
                        {FAQ_ITEMS.map((faq) => {
                            const isOpen = openFaq === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                                >
                                    <dt>
                                        <button
                                            id={`${faq.id}-btn`}
                                            className={styles.faqBtn}
                                            onClick={() => toggleFaq(faq.id)}
                                            aria-expanded={isOpen}
                                            aria-controls={`${faq.id}-region`}
                                        >
                                            <span className={styles.faqQuestion}>{faq.question}</span>
                                            <span className={styles.faqToggle} aria-hidden="true">
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </button>
                                    </dt>
                                    <dd
                                        id={`${faq.id}-region`}
                                        aria-labelledby={`${faq.id}-btn`}
                                        aria-hidden={!isOpen}
                                        className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}
                                    >
                                        <div className={styles.faqAnswerInner}>
                                            <p className={styles.faqAnswerText}>{faq.answer}</p>
                                        </div>
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection} aria-labelledby="cta-heading">
                    <div className={styles.ctaInner}>
                        <h2 id="cta-heading" className={styles.ctaHeading}>
                            Ready to Take Smarter Notes?
                        </h2>
                        <p className={styles.ctaSub}>
                            Join thousands of university students who study with AI on their side.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/register" className={styles.btnPrimary}>
                                Get Started Free
                            </a>
                            <a href="/features" className={styles.btnSecondary}>
                                Explore All Features
                            </a>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}