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
            "Learn evidence‑backed AI study techniques that help students prepare for exams in half the time.",
        question: "Can AI really help me study faster?",
    },
    {
        slug: "best-free-flashcard-apps",
        title: "The Best Free Flashcard Apps for College Students in 2026",
        excerpt:
            "Compare Anki, Quizlet, and StudeQ flashcards — which one fits your study style best?",
        question: "Which flashcard app is actually free?",
    },
    {
        slug: "ai-vs-traditional-learning",
        title: "AI vs Traditional Learning: What the Research Says",
        excerpt:
            "A look at recent studies comparing AI‑assisted learning outcomes with conventional methods.",
        question: "Does AI improve learning outcomes?",
    },
    {
        slug: "active-recall-techniques",
        title: "Active Recall Techniques That Actually Work",
        excerpt:
            "Move beyond highlighting and rereading — these active recall methods boost long‑term memory.",
        question: "What is the best active recall method?",
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