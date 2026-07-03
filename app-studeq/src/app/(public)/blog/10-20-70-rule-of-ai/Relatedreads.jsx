// app/(public)/blog/what-is-the-10-20-70-rule-of-ai/RelatedReads.jsx

'use client';

import { useMemo } from 'react';
import styles from './page.module.css';

const relatedArticles = [
    {
        title: 'What Is the 70/20/10 Model in HR?',
        href: '/blog/70-20-10-model-hr-learning-development',
        description:
            'The HR version of the rule focuses on experiential, social, and formal learning—a completely different framework despite the similar name.',
    },
    {
        title: 'How to Apply the 70/20/10 Rule at Work',
        href: '/blog/how-to-apply-70-20-10-rule-at-work',
        description:
            'Practical steps for using the learning-and-development model to structure your team\'s growth without derailing daily work.',
    },
    {
        title: 'What Is the 70/20/10 Budget Rule?',
        href: '/blog/70-20-10-budget-rule-personal-finance',
        description:
            'The personal finance version splits income into needs, savings, and wants. Not related to AI, but useful for managing your own money.',
    },
    {
        title: 'What Was Warren Buffett\'s 90/10 Rule?',
        href: '/blog/warren-buffett-90-10-rule-investing',
        description:
            'Buffett\'s investing heuristic puts 90% in low-cost index funds and 10% in short-term government bonds. Simple, and famously effective.',
    },
    {
        title: 'What Is the 3-3-3 Rule for Productivity?',
        href: '/blog/3-3-3-rule-productivity-deep-work',
        description:
            'A daily structure: three hours of deep work, three shorter tasks, and three maintenance items. Pairs well with any learning framework.',
    },
    {
        title: 'What Are the 7 Pillars of HR?',
        href: '/blog/7-pillars-of-hr-strategy',
        description:
            'From recruitment to compliance, the seven pillars define modern HR. Understanding them helps contextualize the 70/20/10 L&D model.',
    },
];

export default function RelatedReads() {
    const cards = useMemo(
        () =>
            relatedArticles.map((article) => ({
                ...article,
                id: article.href,
            })),
        []
    );

    return (
        <aside
            className={styles.relatedSection}
            aria-labelledby="related-reads-heading"
        >
            <h2 id="related-reads-heading" className={styles.relatedHeading}>
                You might also ask
            </h2>

            <nav
                className={styles.relatedGrid}
                aria-label="Related articles"
            >
                {cards.map((card) => (
                    <a
                        key={card.id}
                        href={card.href}
                        className={styles.relatedCard}
                    >
                        <h3 className={styles.relatedCardTitle}>{card.title}</h3>
                        <p className={styles.relatedCardDesc}>{card.description}</p>
                        <span className={styles.relatedArrow} aria-hidden="true">
                            →
                        </span>
                    </a>
                ))}
            </nav>
        </aside>
    );
}