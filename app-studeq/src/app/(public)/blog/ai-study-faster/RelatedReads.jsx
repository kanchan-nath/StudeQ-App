import styles from "./page.module.css";

const RELATED_READS = [
    {
        q: "What is the 10-20-70 rule of AI?",
        href: "/blog/10-20-70-rule-of-ai",
    },
    {
        q: "What is the 20-60-20 rule for AI?",
        href: "/blog/20-60-20-rule-for-ai",
    },
    {
        q: "What is the 70-30 rule in AI?",
        href: "/blog/70-30-rule-in-ai",
    },
    {
        q: "Is 50% AI acceptable in your work?",
        href: "/blog/is-50-percent-ai-acceptable",
    },
    {
        q: "What is the 30% rule for AI?",
        href: "/blog/30-percent-rule-for-ai",
    },
    {
        q: "What are the 3 rules of AI?",
        href: "/blog/3-rules-of-ai",
    },
    {
        q: "What is the 80-20 rule of AI?",
        href: "/blog/80-20-rule-of-ai",
    },
    {
        q: "Is 40% AI-generated content bad?",
        href: "/blog/is-40-percent-ai-generated-bad",
    },
];

export default function RelatedReads() {
    return (
        <section
            className={styles.relatedSection}
            aria-labelledby="related-reads-heading"
        >
            <h2 id="related-reads-heading" className={styles.relatedHeading}>
                You might also ask
            </h2>
            <div className={styles.relatedGrid}>
                {RELATED_READS.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={styles.relatedCard}
                    >
                        <span className={styles.relatedCardText}>{item.q}</span>
                        <span className={styles.relatedCardArrow} aria-hidden="true">
                            →
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}