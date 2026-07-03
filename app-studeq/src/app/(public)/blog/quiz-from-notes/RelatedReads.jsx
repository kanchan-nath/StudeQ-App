"use client";

import { useMemo } from "react";
import styles from "./page.module.css";

// ---------------------------------------------------------------------------
// PAA / Related reads data
// ---------------------------------------------------------------------------
const relatedArticles = [
    {
        slug: "how-to-use-ai-to-study-faster",
        title: "How to Use AI to Study Faster Without Sacrificing Retention",
        excerpt:
            "Evidence-backed techniques that combine AI tools with active recall and spaced repetition for faster, deeper learning.",
        question: "Can AI really help me study faster?",
    },
    {
        slug: "active-recall-techniques",
        title: "Active Recall Techniques That Actually Work",
        excerpt:
            "Move past highlighting and rereading — these active recall methods are backed by cognitive science and easy to apply.",
        question: "What is the best way to use active recall?",
    },
    {
        slug: "best-free-flashcard-apps",
        title: "The Best Free Flashcard Apps for College Students in 2026",
        excerpt:
            "Anki, Quizlet, StudeQ — we compare the top free flashcard tools so you can pick the right one for your study style.",
        question: "Which flashcard app is actually free?",
    },
    {
        slug: "ai-quiz-for-teachers",
        title: "AI Quiz for Teachers: Best Free Generators That Actually Work",
        excerpt:
            "Educators can also benefit from AI-generated quizzes — here is how teachers are cutting prep time by hours each week.",
        question: "Can teachers use AI to make quizzes too?",
    },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function RelatedReads() {
    const cards = useMemo(() => relatedArticles, []);

    return (
        <section className={styles.container} aria-labelledby="related-heading">
            <h2 id="related-heading" className={styles.heading}>
                You Might Also Ask
            </h2>
            <div className={styles.grid}>
                {cards.map((article) => (
                    <a
                        key={article.slug}
                        href={`/blog/${article.slug}`}
                        className={styles.card}
                        aria-label={`${article.question} — ${article.title}`}
                    >
                        <span className={styles.cardQuestion}>{article.question}</span>
                        <h3 className={styles.cardTitle}>{article.title}</h3>
                        <p className={styles.cardExcerpt}>{article.excerpt}</p>
                        <span className={styles.cardArrow} aria-hidden="true">
                            →
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}