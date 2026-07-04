'use client';

import Link from 'next/link';
import styles from './ExploreStudeQ.module.css';

// Make the component configurable with props
export default function ExploreStudeQ({
    variant = 'default', // 'default', 'compact', 'minimal'
    showHeading = true,
    showCTA = true,
    maxItems = 6,
    className = '',
    title = 'Discover StudeQ',
    subtitle = 'Transform your learning experience with AI-powered study tools designed for modern students'
}) {
    const allItems = [
        {
            href: '/features/flashcard',
            icon: '🃏',
            title: 'AI Flashcards',
            description: 'Turn your notes into smart flashcards with spaced repetition',
            color: '#FF6B6B',
            category: 'feature'
        },
        {
            href: '/features/quiz',
            icon: '📝',
            title: 'Quiz Generator',
            description: 'Create custom quizzes from your study materials instantly',
            color: '#4ECDC4',
            category: 'feature'
        },
        {
            href: '/features/notebook',
            icon: '📓',
            title: 'Smart Notebook',
            description: 'Organize and enhance your notes with AI-powered insights',
            color: '#FFD93D',
            category: 'feature'
        },
        {
            href: '/features/note',
            icon: '✍️',
            title: 'Note Taking',
            description: 'Take and organize notes with AI assistance',
            color: '#6C5CE7',
            category: 'feature'
        },
        {
            href: '/pricing',
            icon: '💎',
            title: 'Pricing Plans',
            description: 'Choose the right plan for your study needs',
            color: '#A29BFE',
            category: 'page'
        },
        {
            href: '/about',
            icon: '🌟',
            title: 'About StudeQ',
            description: 'Learn more about our mission and team',
            color: '#FD79A8',
            category: 'page'
        },
        // Add more items as needed
        {
            href: '/features',
            icon: '🚀',
            title: 'All Features',
            description: 'Explore all the powerful features StudeQ has to offer',
            color: '#74B9FF',
            category: 'page'
        },
        {
            href: '/blog',
            icon: '📚',
            title: 'Blog',
            description: 'Read the latest articles and study tips',
            color: '#55EFC4',
            category: 'page'
        }
    ];

    // Filter and limit items based on props
    const displayItems = allItems
        .filter(item => {
            if (variant === 'compact') {
                return item.category === 'feature';
            }
            return true;
        })
        .slice(0, maxItems);

    // Different variants for different use cases
    const getVariantStyles = () => {
        switch (variant) {
            case 'compact':
                return styles.compact;
            case 'minimal':
                return styles.minimal;
            default:
                return styles.default;
        }
    };

    return (
        <section className={`${styles.exploreSection} ${getVariantStyles()} ${className}`} aria-labelledby="explore-heading">
            {showHeading && (
                <div className={styles.exploreHeader}>
                    <span className={styles.exploreBadge}>✨ Explore</span>
                    <h2 id="explore-heading" className={styles.exploreHeading}>
                        {title}
                    </h2>
                    <p className={styles.exploreSubheading}>
                        {subtitle}
                    </p>
                </div>
            )}

            <div className={styles.exploreGrid}>
                {displayItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={styles.exploreCard}
                        style={{ '--card-accent': item.color }}
                        aria-label={`Explore ${item.title}`}
                    >
                        <div className={styles.exploreCardIcon} style={{ background: `${item.color}20` }}>
                            <span>{item.icon}</span>
                        </div>
                        <div className={styles.exploreCardContent}>
                            <h3 className={styles.exploreCardTitle}>{item.title}</h3>
                            <p className={styles.exploreCardDesc}>{item.description}</p>
                        </div>
                        <div className={styles.exploreCardArrow} aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {showCTA && (
                <div className={styles.exploreCTA}>
                    <div className={styles.exploreCTAContent}>
                        <h3 className={styles.exploreCTATitle}>Ready to start learning smarter?</h3>
                        <p className={styles.exploreCTADesc}>Join thousands of students who are already using StudeQ to ace their exams</p>
                    </div>
                    <Link href="/" className={styles.exploreMainCTA}>
                        Get Started Free
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <span className={styles.exploreCTASubtext}>No credit card required • Free forever plan</span>
                </div>
            )}
        </section>
    );
}