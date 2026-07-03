// app/(public)/blog/ai-quiz-generator/RelatedReads.jsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// --- RELATED READS DATA (PAA queries) ---
const relatedPosts = [
    {
        slug: 'best-ai-study-tools',
        title: '10 Best AI Study Tools for Students in 2026',
        description: 'Discover the top AI-powered learning tools, including quiz generators and study assistants.',
        readTime: '8 min read',
    },
    {
        slug: 'how-to-use-pdf-for-studying',
        title: 'How to Turn Your PDFs Into Interactive Study Materials',
        description: 'Learn how to transform static PDF documents into engaging flashcards and quizzes.',
        readTime: '4 min read',
    },
    {
        slug: 'spaced-repetition-with-ai',
        title: 'How AI Is Revolutionizing Spaced Repetition for Students',
        description: 'Explore how artificial intelligence enhances long-term retention through smart scheduling.',
        readTime: '5 min read',
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
                <span className={styles.relatedSubtitle}>More resources to help you study smarter with AI</span>
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