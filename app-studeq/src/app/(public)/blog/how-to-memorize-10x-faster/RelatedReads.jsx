// app/(public)/blog/how-to-memorize-faster/RelatedReads.jsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// --- RELATED READS DATA (PAA queries) ---
const relatedPosts = [
    {
        slug: 'how-to-use-spaced-repetition',
        title: 'How to Use Spaced Repetition to Remember Everything',
        description: 'Learn how to implement the 7 3 2 1 and 2 7 30 rules effectively.',
        readTime: '4 min read',
    },
    {
        slug: 'active-recall-techniques',
        title: 'Active Recall: The #1 Study Technique for Med Students',
        description: 'Discover why active recall is the most powerful tool for memorization.',
        readTime: '5 min read',
    },
    {
        slug: 'study-hacks-for-exams',
        title: '10 Study Hacks for Exams: How to Cram Effectively',
        description: 'How to memorize fast in 1 hour for a test tomorrow.',
        readTime: '6 min read',
    },
];

export default function RelatedReads() {
    // Memoize the list to prevent unnecessary re-renders
    const memoizedPosts = useMemo(() => relatedPosts, []);

    return (
        <section className={styles.relatedSection} aria-labelledby="related-heading">
            <div className={styles.relatedHeader}>
                <h2 id="related-heading" className={styles.relatedHeading}>
                    You might also ask
                </h2>
                <span className={styles.relatedSubtitle}>More resources to help you memorize faster</span>
            </div>
            <div className={styles.relatedGrid}>
                {memoizedPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className={styles.relatedCard}
                        aria-describedby={`desc-${post.slug}`}
                    >
                        <div className={styles.relatedCardContent}>
                            <h3 className={styles.relatedCardTitle}>{post.title}</h3>
                            <p id={`desc-${post.slug}`} className={styles.relatedCardDesc}>
                                {post.description}
                            </p>
                            <div className={styles.relatedCardMeta}>
                                <span className={styles.relatedReadTime}>{post.readTime}</span>
                                <span className={styles.relatedArrow} aria-hidden="true">
                                    →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}