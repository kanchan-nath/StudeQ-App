// app/(public)/blog/best-ai-tools-for-teachers/RelatedReads.jsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// --- RELATED READS DATA (PAA queries) ---
const relatedPosts = [
    {
        slug: 'ai-lesson-plan-generator',
        title: 'AI Lesson Plan Generator: How to Create Perfect Lessons in Minutes',
        description: 'Learn how to use AI tools for teachers lesson plans and save hours of preparation time.',
        readTime: '4 min read',
    },
    {
        slug: 'free-ai-tools-for-education',
        title: '10 Free AI Tools for Education That Every Teacher Should Know',
        description: 'Discover the best free AI tools for teachers in India and worldwide.',
        readTime: '6 min read',
    },
    {
        slug: 'ai-in-classroom-management',
        title: 'How AI is Revolutionizing Classroom Management for Teachers',
        description: 'Explore AI teaching tools for students and how they improve learning outcomes.',
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
                <span className={styles.relatedSubtitle}>More resources to help you integrate AI into your classroom</span>
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