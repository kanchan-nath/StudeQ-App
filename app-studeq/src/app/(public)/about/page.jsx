// app/(public)/about/page.jsx
import styles from "./page.module.css";

export const metadata = {
    title: "About StudeQ — Our Mission to Transform How Students Learn",
    description:
        "Meet Kanchan, the founder of StudeQ, building AI powered study tools for university students.",
    robots: "index, follow",
    alternates: {
        canonical: "https://studeq.onrender.com/about",
    },
    openGraph: {
        title: "About StudeQ — Our Mission to Transform How Students Learn",
        description:
            "Meet Kanchan, the founder of StudeQ, building AI powered study tools for university students.",
        url: "https://studeq.onrender.com/about",
        type: "website",
        images: [
            {
                url: "https://studeq.onrender.com/images/og-about.jpg",
                width: 1200,
                height: 630,
                alt: "StudeQ team working together on a better study experience",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "About StudeQ — Our Mission to Transform How Students Learn",
        description:
            "Meet the team behind StudeQ. We are building a platform that makes deep, focused studying accessible to every university student through smart tools and community-driven design.",
        images: ["https://studeq.onrender.com/images/og-about.jpg"],
    },
};

const stats = [
    { value: "8+", label: "Study tools" },
    { value: "24/7", label: "AI tutor, always available" },
    { value: "48", label: "Hours saved per student monthly" },
    { value: "100%", label: "Free to start, no credit card" },
];

const values = [
    {
        title: "Student-first design",
        description:
            "Every feature we build starts with a question: will this help someone understand a topic better, faster, or with less frustration?",
        icon: "/images/student-first.svg",
        alt: "Illustration of a person centered at a desk with focused lighting",
    },
    {
        title: "Transparency in learning",
        description:
            "No hidden algorithms, no manipulative streaks that trick you into staying. We show you how our tools work and give you full control over your data.",
        icon: "/images/transparency.svg",
        alt: "Clear glass window symbol with light passing through",
    },
    {
        title: "Built with students, not just for them",
        description:
            "Our beta testers and early users shaped the roadmap. From the flashcard spacing algorithm to the notebook chat layout, feedback drives every update.",
        icon: "/images/built-with-students.svg",
        alt: "Two figures collaborating on a shared canvas",
    },
];

const timelineItems = [
    {
        year: "2026 May 5",
        title: "The idea behind StudeQ",
        description:
            "StudeQ started with a simple goal: build an all in one AI study platform that helps college students organize notes, create flashcards, generate quizzes, manage assignments, and study more efficiently without switching between multiple apps.",
    },
    {
        year: "2026 June 7",
        title: "Building the first version",
        description:
            "The first version of StudeQ focused on solving everyday study challenges with AI powered notes, smart flashcards, quiz generation, document chat, and productivity tools designed for university and college students.",
    },
    {
        year: "2026 July 1",
        title: "Public beta launched",
        description:
            "StudeQ officially launched in public beta, making its AI study tools available to students worldwide. Early users continue to shape the platform by sharing feedback that helps improve every feature.",
    },
    {
        year: "2026 Ongoing",
        title: "Growing with every update",
        description:
            "Today, StudeQ is continuously evolving with new AI learning tools, better performance, and improved study workflows. Our mission is to become the most complete AI powered study platform for students, helping them learn faster, stay organized, and achieve better academic results.",
    },
];

export default function AboutPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About StudeQ",
        description:
            "Meet the team behind StudeQ and learn about our mission to make deep, focused studying accessible to every university student.",
        url: "https://studeq.onrender.com/about",
        publisher: {
            "@type": "Organization",
            name: "StudeQ",
            url: "https://studeq.onrender.com",
            logo: {
                "@type": "ImageObject",
                url: "https://studeq.onrender.com/images/studeq-logo.png",
            },
        },
        mainEntity: {
            "@type": "Organization",
            name: "StudeQ",
            foundingDate: "2024",
            description:
                "StudeQ is a study platform for university students that combines notes, quizzes, flashcards, document chat, scheduling, and assignment tracking in one place.",
            url: "https://studeq.onrender.com",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>

            <main id="main-content">
                {/* ── HERO ────────────────────────────────────────── */}
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className={styles.heroContent}>
                        <h1 id="hero-heading" className={styles.heroHeading}>
                            We are building the study platform we wish we had in university
                        </h1>
                        <p className={styles.heroSub}>
                            StudeQ started with a simple belief: studying should feel less
                            like a chore and more like a skill you get better at. Every tool
                            we ship is designed to reduce friction so you can spend more time
                            actually learning.
                        </p>
                    </div>
                    <div className={styles.heroVisual}>
                        <img
                            src="/images/about-hero-team.svg"
                            alt="The StudeQ team gathered around a whiteboard sketching product ideas"
                            className={styles.heroImg}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                        <div className={styles.heroGlow} aria-hidden="true" />
                    </div>
                </section>

                {/* ── STATS ───────────────────────────────────────── */}
                <section
                    className={styles.stats}
                    aria-label="Key statistics about StudeQ"
                >
                    <div className={styles.statsGrid}>
                        {stats.map((stat) => (
                            <article key={stat.label} className={styles.statCard}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── MISSION ─────────────────────────────────────── */}
                <section className={styles.mission} aria-labelledby="mission-heading">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionText}>
                            <h2 id="mission-heading" className={styles.sectionHeading}>
                                Why we keep building
                            </h2>
                            <p className={styles.missionPara}>
                                Most study platforms treat students like content consumers. We
                                think differently. A student who understands their material
                                deeply doesn&apos;t just pass an exam — they carry that
                                confidence into their career, their relationships, and the
                                problems they choose to solve later in life.
                            </p>
                            <p className={styles.missionPara}>
                                StudeQ exists because we saw too many bright people burning out
                                on bad tools. We want to fix that, one feature at a time, with
                                honest priorities and a team that actually listens.
                            </p>
                        </div>
                        <div className={styles.missionVisual}>
                            <img
                                src="/images/about-mission.svg"
                                alt="A student sitting under a tree reading notes on a tablet with a calm expression"
                                className={styles.missionImg}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>
                </section>

                {/* ── VALUES ──────────────────────────────────────── */}
                <section className={styles.values} aria-labelledby="values-heading">
                    <h2 id="values-heading" className={styles.sectionHeading}>
                        What guides our work
                    </h2>
                    <div className={styles.valuesGrid}>
                        {values.map((value) => (
                            <article key={value.title} className={styles.valueCard}>
                                <img
                                    src={value.icon}
                                    alt={value.alt}
                                    className={styles.valueIcon}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className={styles.valueTitle}>{value.title}</h3>
                                <p className={styles.valueDesc}>{value.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── TIMELINE ────────────────────────────────────── */}
                <section
                    className={styles.timeline}
                    aria-labelledby="timeline-heading"
                >
                    <h2 id="timeline-heading" className={styles.sectionHeading}>
                        How we got here
                    </h2>
                    <div className={styles.timelineTrack} role="list">
                        {timelineItems.map((item, idx) => (
                            <div
                                key={item.year}
                                className={styles.timelineItem}
                                role="listitem"
                            >
                                <div className={styles.timelineMarker} aria-hidden="true">
                                    <span className={styles.timelineDot} />
                                    {idx < timelineItems.length - 1 && (
                                        <span className={styles.timelineLine} />
                                    )}
                                </div>
                                <div className={styles.timelineBody}>
                                    <span className={styles.timelineYear}>{item.year}</span>
                                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                                    <p className={styles.timelineDesc}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ─────────────────────────────────────────── */}
                <section className={styles.cta} aria-labelledby="cta-heading">
                    <div className={styles.ctaCard}>
                        <h2 id="cta-heading" className={styles.ctaHeading}>
                            Want to help shape what comes next?
                        </h2>
                        <p className={styles.ctaText}>
                            We are always looking for students who want to test early
                            features, report bugs, and tell us what actually matters to them.
                        </p>
                        <a
                            href="mailto:kanchannath.webdev@gmail.com"
                            className={styles.ctaLink}
                        >
                            Get in touch
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
}