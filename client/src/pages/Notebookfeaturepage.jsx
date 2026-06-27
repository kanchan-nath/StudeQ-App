import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo } from 'react';
import styles from './styles/NotebookFeaturePage.module.css';

const CAPABILITIES = [
    {
        id: 'ask',
        icon: '💬',
        label: 'Ask Anything',
        desc: 'Ask questions about your uploaded documents in plain language. AI answers with exact page-level citations from your sources — not from the internet.',
    },
    {
        id: 'summarize',
        icon: '📋',
        label: 'Summarize Docs',
        desc: 'Get a structured summary of any document: key arguments, methodology, conclusions, and open questions — in seconds.',
    },
    {
        id: 'compare',
        icon: '⇄',
        label: 'Compare Sources',
        desc: 'Upload multiple papers or chapters. Ask SPARK.E to compare theories, find contradictions, or synthesize a unified view across all sources.',
    },
    {
        id: 'explain',
        icon: '🔍',
        label: 'Explain Concepts',
        desc: 'Highlight any passage and ask AI to explain it in simpler terms, elaborate with examples, or connect it to other parts of your notebook.',
    },
    {
        id: 'outline',
        icon: '🗂️',
        label: 'Generate Outlines',
        desc: 'Turn any document or discussion into a structured essay outline, study guide, or presentation skeleton — one click.',
    },
    {
        id: 'cite',
        icon: '📎',
        label: 'Auto-Citations',
        desc: 'Every AI answer links back to exact source locations. Export citations in APA, MLA, or Chicago format instantly.',
    },
];

const STEPS = [
    {
        num: '01',
        title: 'Create a Notebook',
        body: 'Name your notebook by topic, course, or project. Each notebook is an isolated knowledge space.',
    },
    {
        num: '02',
        title: 'Upload Your Sources',
        body: 'Drop in PDFs, Word docs, slides, or paste text. SPARK.E parses and indexes everything.',
    },
    {
        num: '03',
        title: 'Start the Conversation',
        body: 'Ask questions, request summaries, compare sources — all in a threaded chat grounded in your documents.',
    },
    {
        num: '04',
        title: 'Export & Share',
        body: 'Export your conversation, notes, and citations as a PDF or shareable link. Collaborate with teammates in real time.',
    },
];

const USE_CASES = [
    {
        icon: '🎓',
        title: 'Research Papers',
        body: 'Upload 10 papers, ask "what do they agree and disagree on?" — get a synthesis in under 30 seconds.',
    },
    {
        icon: '📚',
        title: 'Textbook Study',
        body: 'Upload chapters, ask for concept explanations, generate practice questions — all from the same notebook.',
    },
    {
        icon: '⚖️',
        title: 'Case Analysis',
        body: 'Upload legal, business, or medical case documents and interrogate them like you\'d interrogate an expert.',
    },
    {
        icon: '🧪',
        title: 'Lab Reports & Data',
        body: 'Upload experimental data, methodology docs, and prior studies — ask AI to spot patterns and anomalies.',
    },
];

const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SPARK.E AI Notebook',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
        'AI-powered notebook that lets you upload documents and have grounded, cited conversations about your sources — like NotebookLM but built for students.',
    featureList: [
        'Upload PDFs and documents',
        'AI chat grounded in uploaded sources',
        'Multi-document comparison and synthesis',
        'Auto-citation generation APA MLA Chicago',
        'Concept explanation from source material',
        'Export conversations and notes',
        'Collaborative shared notebooks',
    ],
    url: 'https://sparke.app/features/notebook',
    screenshot: 'https://sparke.app/og-notebook.png',
};

export default function NotebookFeaturePage() {
    const [activeCap, setActiveCap] = useState('ask');

    const activeDetail = useMemo(
        () => CAPABILITIES.find((c) => c.id === activeCap),
        [activeCap]
    );

    const handleCapClick = useCallback((id) => setActiveCap(id), []);

    return (
        <>
            <Helmet>
                <title>AI Notebook — Chat With Your Documents | SPARK.E</title>
                <meta
                    name="description"
                    content="Upload PDFs, research papers, or notes and have AI-powered conversations grounded in your sources. SPARK.E Notebook cites every answer back to your documents."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://sparke.app/features/notebook" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sparke.app/features/notebook" />
                <meta property="og:title" content="AI Notebook — Chat With Your Documents | SPARK.E" />
                <meta
                    property="og:description"
                    content="Upload your documents and discuss them with AI. Every answer is grounded in your sources with exact citations. No hallucinations."
                />
                <meta property="og:image" content="https://sparke.app/og-notebook.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AI Notebook — Chat With Your Documents | SPARK.E" />
                <meta
                    name="twitter:description"
                    content="Upload your documents and discuss them with AI. Every answer is grounded in your sources with exact citations."
                />
                <meta name="twitter:image" content="https://sparke.app/og-notebook.png" />

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
                        AI Notebook — New Feature
                    </div>

                    <h1 id="hero-heading" className={styles.heroTitle}>
                        Your Documents.
                        <br />
                        <span className={styles.heroAccent}>Your AI Expert.</span>
                    </h1>

                    <p className={styles.heroSub}>
                        Upload any PDF, research paper, or lecture slide — then have a full
                        conversation with your material. SPARK.E cites every answer directly
                        from your sources. No guessing. No hallucinations.
                    </p>

                    <div className={styles.heroCta}>
                        <a href="/dashboard/notebook/new" className={styles.btnPrimary}>
                            Create a Notebook Free
                        </a>
                        <a href="#how-it-works" className={styles.btnGhost}>
                            See how it works ↓
                        </a>
                    </div>

                    <div className={styles.heroStats} aria-label="Feature highlights">
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>100+</span>
                            <span className={styles.statLabel}>Documents per notebook</span>
                        </div>
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>100%</span>
                            <span className={styles.statLabel}>Source-grounded answers</span>
                        </div>
                        <div className={styles.statPill}>
                            <span className={styles.statNum}>3</span>
                            <span className={styles.statLabel}>Citation formats</span>
                        </div>
                    </div>

                    {/* Decorative notebook chat mockup */}
                    <div className={styles.heroMockup} aria-hidden="true">
                        <div className={styles.mockupSidebar}>
                            <div className={styles.mockupSidebarLabel}>Notebooks</div>
                            {['Research — Ch.4', 'ML Paper Review', 'Thesis Draft'].map((n, i) => (
                                <div key={n} className={`${styles.mockupNotebook} ${i === 0 ? styles.mockupNotebookActive : ''}`}>
                                    <span>📓</span> {n}
                                </div>
                            ))}
                            <div className={styles.mockupSidebarLabel} style={{ marginTop: 'var(--sp-4)' }}>Sources</div>
                            {['paper_01.pdf', 'notes.docx', 'slides.pdf'].map((f) => (
                                <div key={f} className={styles.mockupFile}>
                                    <span>📄</span> {f}
                                </div>
                            ))}
                        </div>
                        <div className={styles.mockupChat}>
                            <div className={styles.mockupMsg + ' ' + styles.mockupMsgUser}>
                                What is the main argument of Chapter 4?
                            </div>
                            <div className={styles.mockupMsg + ' ' + styles.mockupMsgAi}>
                                <span className={styles.mockupAiLabel}>SPARK.E</span>
                                Chapter 4 argues that attention mechanisms outperform RNNs for long-range dependencies.
                                <span className={styles.mockupCite}>📎 paper_01.pdf · p.12</span>
                            </div>
                            <div className={styles.mockupMsg + ' ' + styles.mockupMsgUser}>
                                How does this compare to the slides?
                            </div>
                            <div className={styles.mockupMsg + ' ' + styles.mockupMsgAi}>
                                <span className={styles.mockupAiLabel}>SPARK.E</span>
                                The slides simplify this — they only cover self-attention, not cross-attention.
                                <span className={styles.mockupCite}>📎 slides.pdf · slide 7</span>
                            </div>
                            <div className={styles.mockupInputRow}>
                                <div className={styles.mockupInput}>Ask anything about your sources…</div>
                                <div className={styles.mockupSend}>↑</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CAPABILITY EXPLORER ───────────────────────── */}
                <section className={styles.capSection} aria-labelledby="cap-heading">
                    <div className={styles.sectionLabel}>What You Can Do</div>
                    <h2 id="cap-heading" className={styles.sectionTitle}>
                        Six Ways to Learn From Your Documents
                    </h2>
                    <p className={styles.sectionSub}>
                        Notebook isn't just a search box. It's a full research workflow in one place.
                    </p>

                    <div className={styles.capGrid} role="tablist" aria-label="Notebook capabilities">
                        {CAPABILITIES.map((cap) => (
                            <button
                                key={cap.id}
                                role="tab"
                                aria-selected={activeCap === cap.id}
                                aria-controls={`cap-detail-${cap.id}`}
                                className={`${styles.capCard} ${activeCap === cap.id ? styles.capCardActive : ''}`}
                                onClick={() => handleCapClick(cap.id)}
                            >
                                <span className={styles.capIcon} aria-hidden="true">{cap.icon}</span>
                                <span className={styles.capLabel}>{cap.label}</span>
                            </button>
                        ))}
                    </div>

                    {activeDetail && (
                        <div
                            id={`cap-detail-${activeDetail.id}`}
                            role="tabpanel"
                            aria-label={`${activeDetail.label} details`}
                            className={styles.capDetail}
                        >
                            <span className={styles.capDetailIcon} aria-hidden="true">{activeDetail.icon}</span>
                            <div>
                                <h3 className={styles.capDetailTitle}>{activeDetail.label}</h3>
                                <p className={styles.capDetailDesc}>{activeDetail.desc}</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── HOW IT WORKS ──────────────────────────────── */}
                <section id="how-it-works" className={styles.stepsSection} aria-labelledby="steps-heading">
                    <div className={styles.sectionLabel}>How It Works</div>
                    <h2 id="steps-heading" className={styles.sectionTitle}>
                        From Upload to Insight in Four Steps
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

                {/* ── CITATION / GROUNDED ANSWERS HIGHLIGHT ─────── */}
                <section className={styles.citationSection} aria-labelledby="citation-heading">
                    <div className={styles.citationInner}>
                        <div className={styles.citationText}>
                            <div className={styles.sectionLabel}>Trust the Answers</div>
                            <h2 id="citation-heading" className={styles.sectionTitle}>
                                Every Answer Cites Its Source
                            </h2>
                            <p className={styles.sectionSub}>
                                Unlike generic AI chatbots, SPARK.E Notebook only answers from
                                what you uploaded. Every response links back to an exact page,
                                paragraph, or slide — so you can verify in one click.
                            </p>
                            <ul className={styles.citationList} aria-label="Citation features">
                                {[
                                    ['📍', 'Page-level source pins on every answer'],
                                    ['🚫', 'No internet data — only your documents'],
                                    ['📤', 'Export citations in APA, MLA, or Chicago'],
                                    ['🔗', 'Click any citation to jump to the source passage'],
                                ].map(([icon, text]) => (
                                    <li key={text} className={styles.citationItem}>
                                        <span aria-hidden="true">{icon}</span>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.citationVisual} aria-hidden="true">
                            <div className={styles.citationCard}>
                                <div className={styles.citationCardQ}>
                                    "Explain the methodology used in the study."
                                </div>
                                <div className={styles.citationCardA}>
                                    <span className={styles.citationCardALabel}>SPARK.E</span>
                                    The study used a randomized controlled trial with 240 participants split into two cohorts. Inclusion criteria required prior exposure to the intervention domain.
                                </div>
                                <div className={styles.citationPins}>
                                    <div className={styles.citationPin}>📎 methodology.pdf · p.4</div>
                                    <div className={styles.citationPin}>📎 study_design.pdf · p.2</div>
                                </div>
                                <div className={styles.citationExportRow}>
                                    <div className={styles.citationExportBtn}>Export APA</div>
                                    <div className={styles.citationExportBtn}>Export MLA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── USE CASES ─────────────────────────────────── */}
                <section className={styles.useCaseSection} aria-labelledby="usecase-heading">
                    <div className={styles.sectionLabel}>Who It's For</div>
                    <h2 id="usecase-heading" className={styles.sectionTitle}>
                        Built for Every Kind of Deep Study
                    </h2>
                    <p className={styles.sectionSub}>
                        Whether you're writing a thesis or cracking a case study, Notebook
                        adapts to your workflow.
                    </p>

                    <ul className={styles.useCaseGrid}>
                        {USE_CASES.map((uc) => (
                            <li key={uc.title} className={styles.useCaseCard}>
                                <span className={styles.useCaseIcon} aria-hidden="true">{uc.icon}</span>
                                <h3 className={styles.useCaseTitle}>{uc.title}</h3>
                                <p className={styles.useCaseBody}>{uc.body}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── SOURCE TYPES ──────────────────────────────── */}
                <section className={styles.sourcesSection} aria-labelledby="sources-heading">
                    <div className={styles.sourcesInner}>
                        <div className={styles.sourcesText}>
                            <div className={styles.sectionLabel}>Supported Sources</div>
                            <h2 id="sources-heading" className={styles.sectionTitle}>
                                Upload Anything. Discuss Everything.
                            </h2>
                            <p className={styles.sectionSub}>
                                SPARK.E parses your files deeply — not just surface text. Tables,
                                figures, footnotes, and headers all indexed.
                            </p>
                            <ul className={styles.sourceList} aria-label="Supported file types">
                                {[
                                    ['📄', 'PDF — research papers, textbooks, reports'],
                                    ['📝', 'Word Docs — essays, drafts, case notes'],
                                    ['📊', 'Slide Decks — lecture PPTs and keynotes'],
                                    ['📋', 'Pasted Text — raw notes or copied passages'],
                                    ['🔗', 'URLs — articles, Wikipedia, blog posts'],
                                    ['🎙️', 'Transcripts — lecture recordings or interviews'],
                                ].map(([icon, label]) => (
                                    <li key={label} className={styles.sourceItem}>
                                        <span aria-hidden="true">{icon}</span>
                                        <span>{label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Decorative file-upload visual */}
                        <div className={styles.uploadVisual} aria-hidden="true">
                            <div className={styles.uploadDropzone}>
                                <span className={styles.uploadIcon}>☁️</span>
                                <span className={styles.uploadLabel}>Drop files here</span>
                                <span className={styles.uploadSub}>PDF · DOCX · PPTX · TXT · URL</span>
                            </div>
                            <div className={styles.uploadFileList}>
                                {[
                                    { name: 'transformer_paper.pdf', size: '2.1 MB', done: true },
                                    { name: 'lecture_notes.docx', size: '340 KB', done: true },
                                    { name: 'week5_slides.pptx', size: '5.8 MB', done: false },
                                ].map((f) => (
                                    <div key={f.name} className={styles.uploadFileItem}>
                                        <span className={styles.uploadFileIcon}>📄</span>
                                        <div className={styles.uploadFileMeta}>
                                            <span className={styles.uploadFileName}>{f.name}</span>
                                            <span className={styles.uploadFileSize}>{f.size}</span>
                                        </div>
                                        <span className={f.done ? styles.uploadDone : styles.uploadProgress}>
                                            {f.done ? '✓' : '…'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA ───────────────────────────────────────── */}
                <section className={styles.ctaSection} aria-labelledby="cta-heading">
                    <h2 id="cta-heading" className={styles.ctaTitle}>
                        Stop reading. Start understanding.
                    </h2>
                    <p className={styles.ctaSub}>
                        Create your first notebook free — upload any document and ask your
                        first question in under 60 seconds.
                    </p>
                    <a href="/notebook" className={styles.btnPrimary}>
                        Open Notebook →
                    </a>
                </section>

            </main>
        </>
    );
}