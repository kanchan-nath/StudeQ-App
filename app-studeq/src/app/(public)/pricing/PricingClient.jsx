"use client"
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const PLANS = [
    {
        id: 'free',
        icon: '▤',
        name: 'Free',
        tagline: 'Basic access to get started',
        monthlyPrice: 0,
        yearlyPrice: 0,
        billingLabel: { monthly: 'forever free', yearly: 'forever free' },
        cta: 'Choose Plan',
        ctaVariant: 'ghost',
        isCurrent: false,
        isPopular: false,
        features: [
            '5 quizzes per month',
            'Basic flashcards',
            'Limited chat access',
        ],
    },
    {
        id: 'pro',
        icon: '♛',
        name: 'Pro',
        tagline: 'For serious students',
        monthlyPrice: 9,
        yearlyPrice: 86,
        billingLabel: { monthly: 'per month · billed monthly', yearly: 'per year · billed yearly' },
        cta: 'Upgrade Pro',
        ctaVariant: 'current',
        isCurrent: true,
        isPopular: true,
        features: [
            'Unlimited quizzes',
            'Unlimited flashcards',
            'AI tutor access',
            'Priority support',
        ],
    },
    {
        id: 'premium',
        icon: '▤',
        name: 'Premium',
        tagline: 'Full power, no limits',
        monthlyPrice: 19,
        yearlyPrice: 182,
        billingLabel: { monthly: 'per month · billed monthly', yearly: 'per year · billed yearly' },
        cta: 'Go Premium',
        ctaVariant: 'outline',
        isCurrent: false,
        isPopular: false,
        features: [
            'Everything in Pro',
            'Advanced AI models',
            'Custom study scheduler',
            'Early access features',
        ],
    },
];

const ALL_FEATURES = [
    { icon: '💬', label: 'AI Chat Assistant' },
    { icon: '⚡', label: 'Real-time Streaming Answers' },
    { icon: '▤', label: 'Flashcards' },
    { icon: '◎', label: 'Smart Quizzes' },
    { icon: '📅', label: 'Event Scheduling' },
    { icon: '🎓', label: 'AI Tutor Support' },
];

// Structured data
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Pricing — studeq',
    description: 'Compare Free, Pro, and Premium plans for studeq. AI-powered quizzes, flashcards, and tutor access from $0/month.',
    url: 'https://studeq.onrender.com/pricing',
    mainEntity: {
        '@type': 'ItemList',
        itemListElement: PLANS.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Offer',
                name: p.name,
                price: p.monthlyPrice,
                priceCurrency: 'USD',
                description: p.tagline,
            },
        })),
    },
};

export default function PricingClientPage() {
    const [billing, setBilling] = useState('monthly');
    const router = useRouter();

    const toggleBilling = useCallback((val) => setBilling(val), []);

    const displayPrice = useCallback(
        (plan) => (billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice),
        [billing]
    );

    const handleButtonClick = useCallback(() => {
        router.push("/login");
    }, [router]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <a href="#main-content" className={styles.skipLink}>Skip to main content</a>

            <main id="main-content" className={styles.main}>
                {/* Hero */}
                <section className={styles.hero} aria-labelledby="pricing-heading">
                    <h1 id="pricing-heading" className={styles.heroTitle}>Choose Your Plan</h1>
                    <p className={styles.heroSub}>Upgrade anytime. Cancel anytime.</p>

                    {/* Billing toggle */}
                    <div className={styles.toggleWrap} role="group" aria-label="Billing frequency">
                        <button
                            className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.toggleActive : ''}`}
                            onClick={() => toggleBilling('monthly')}
                            aria-pressed={billing === 'monthly'}
                        >
                            Monthly
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${billing === 'yearly' ? styles.toggleActive : ''}`}
                            onClick={() => toggleBilling('yearly')}
                            aria-pressed={billing === 'yearly'}
                        >
                            Yearly <span className={styles.saveBadge}>Save 20%</span>
                        </button>
                    </div>
                </section>

                {/* Cards */}
                <section className={styles.cardsSection} aria-label="Pricing plans">
                    <div className={styles.cardsGrid}>
                        {PLANS.map((plan) => (
                            <article
                                key={plan.id}
                                className={`${styles.card} ${plan.isPopular ? styles.cardPopular : ''}`}
                                aria-label={`${plan.name} plan`}
                            >
                                {plan.isPopular && (
                                    <div className={styles.popularBadge} aria-label="Most popular plan">
                                        ☆ Most Popular
                                    </div>
                                )}

                                <header className={styles.cardHeader}>
                                    <div className={styles.planMeta}>
                                        <span className={styles.planIcon} aria-hidden="true">{plan.icon}</span>
                                        <h2 className={styles.planName}>{plan.name}</h2>
                                        <span className={styles.planDash} aria-hidden="true">~∿~</span>
                                    </div>
                                    <p className={styles.planTagline}>{plan.tagline}</p>
                                </header>

                                <div className={styles.priceRow} aria-label={`Price: $${displayPrice(plan)}`}>
                                    <span className={styles.priceAmount}>${displayPrice(plan)}</span>
                                    {plan.monthlyPrice > 0 && (
                                        <span className={styles.priceDetail}>
                                            <span className={styles.pricePer}>
                                                {billing === 'monthly' ? 'per month' : 'per year'}
                                            </span>
                                            <span className={styles.priceBilling}>
                                                {billing === 'monthly' ? 'billed monthly' : 'billed yearly'}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                <button
                                    className={`${styles.ctaBtn} ${styles[`cta_${plan.ctaVariant}`]}`}
                                    aria-label={`${plan.cta} — ${plan.name} plan`}
                                    onClick={handleButtonClick}
                                >
                                    {plan.cta}
                                </button>

                                <ul className={styles.featureList} aria-label={`${plan.name} features`}>
                                    {plan.features.map((f) => (
                                        <li key={f} className={styles.featureItem}>
                                            <span className={styles.featureDiamond} aria-hidden="true">✦</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </section>

                {/* All plans include */}
                <section className={styles.allPlans} aria-labelledby="all-plans-heading">
                    <p id="all-plans-heading" className={styles.allPlansLabel}>ALL PLANS INCLUDE</p>
                    <ul className={styles.allPlansList} aria-label="Features included in all plans">
                        {ALL_FEATURES.map((f) => (
                            <li key={f.label} className={styles.allPlansItem}>
                                <span aria-hidden="true">{f.icon}</span>
                                {f.label}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* SEO prose section */}
                <section className={styles.seoSection} aria-labelledby="seo-heading">
                    <div className={styles.seoInner}>
                        <h2 id="seo-heading" className={styles.seoTitle}>AI-Powered Study Tools for Every Learner</h2>
                        <div className={styles.seoCols}>
                            <div className={styles.seoBlock}>
                                <h3 className={styles.seoBlockTitle}>Why studeq?</h3>
                                <p className={styles.seoText}>
                                    studeq combines adaptive flashcards, unlimited AI-generated quizzes, and a real-time AI tutor
                                    into one platform. Whether you're cramming for finals or building long-term knowledge, our plans
                                    scale with your ambition — from free basics to premium AI models.
                                </p>
                            </div>
                            <div className={styles.seoBlock}>
                                <h3 className={styles.seoBlockTitle}>Flexible Billing</h3>
                                <p className={styles.seoText}>
                                    Switch between monthly and yearly billing at any time. Yearly subscribers save 20% — that's
                                    two months free on Pro and Premium. No contracts, no hidden fees. Cancel with one click from
                                    your account settings.
                                </p>
                            </div>
                            <div className={styles.seoBlock}>
                                <h3 className={styles.seoBlockTitle}>Who's Pro for?</h3>
                                <p className={styles.seoText}>
                                    Pro is built for students who need more than basics — unlimited quizzes, unlimited flashcard
                                    decks, and direct AI tutor access for $9/month. Most active users choose Pro within their
                                    first week once they hit the free limits.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className={styles.faqSection} aria-labelledby="faq-heading">
                    <div className={styles.faqInner}>
                        <h2 id="faq-heading" className={styles.faqTitle}>Frequently Asked Questions</h2>
                        <dl className={styles.faqList}>
                            {[
                                {
                                    q: 'Can I upgrade or downgrade my plan?',
                                    a: 'Yes. You can switch plans at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.',
                                },
                                {
                                    q: 'Is there a free trial for Pro or Premium?',
                                    a: 'The Free plan lets you explore core features indefinitely. We do not offer a time- limited trial, but you can upgrade any time and cancel if it is not the right fit.',
                                },
                                {
                                    q: 'What payment methods do you accept?',
                                    a: 'We accept all major credit and debit cards via Stripe. No PayPal at this time.',
                                },
                                {
                                    q: 'What is the AI tutor?',
                                    a: 'The AI tutor answers questions on any subject in real time, explains concepts step-by-step, and adapts explanations to your level. Available on Pro and Premium.',
                                },
                            ].map(({ q, a }) => (
                                <div key={q} className={styles.faqItem}>
                                    <dt className={styles.faqQ}>{q}</dt>
                                    <dd className={styles.faqA}>{a}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>
            </main>
        </>
    );
}