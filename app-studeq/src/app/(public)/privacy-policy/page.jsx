// app/(public)/privacy-policy/page.jsx

import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'Privacy Policy | StudeQ — How We Protect Your Data',
    description:
        'Read the StudeQ privacy policy to understand how we collect, use, and safeguard your personal information while you study smarter.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://www.studeq.onrender.com/privacy-policy',
    },
    openGraph: {
        title: 'StudeQ Privacy Policy — Your Data, Your Trust',
        description:
            'Transparent details on data collection, cookies, third-party sharing, and your rights under our privacy framework.',
        url: 'https://www.studeq.com/privacy-policy',
        type: 'website',
        images: [
            {
                url: '/images/studeq-privacy-og.svg',
                width: 1200,
                height: 630,
                alt: 'StudeQ privacy policy and data protection overview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'StudeQ Privacy Policy — Your Data, Your Trust',
        description:
            'Transparent details on data collection, cookies, third party sharing, and your rights under our privacy framework.',
        images: ['/images/studeq-privacy-twitter.svg'],
    },
};

const lastUpdated = '2026-06-28T10:00:00+00:00';
const publishedDate = '2025-01-15T08:00:00+00:00';

export default function PrivacyPolicyPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'StudeQ Privacy Policy',
        description:
            'Comprehensive privacy policy detailing how StudeQ collects, uses, and protects user data in compliance with global regulations.',
        image: '/images/studeq-privacy-hero.jpg',
        author: {
            '@type': 'Organization',
            name: 'StudeQ',
            url: 'https://www.studeq.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'StudeQ',
            logo: {
                '@type': 'ImageObject',
                url: '/images/studeq-logo.png',
            },
        },
        datePublished: publishedDate,
        dateModified: lastUpdated,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.studeq.com/privacy-policy',
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

            <main id="main-content" className={styles.page}>
                {/* ── Hero Section ── */}
                <header className={styles.hero}>
                    <div className={styles.heroContent}>
                        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
                            <Link href="/">Home</Link>
                            <span aria-hidden="true" className={styles.separator}>
                                /
                            </span>
                            <span aria-current="page">Privacy Policy</span>
                        </nav>
                        <h1 className={styles.title}>Your Privacy, Our Priority</h1>
                        <p className={styles.subtitle}>
                            We believe trust is the foundation of great learning. Here&apos;s exactly how
                            we handle your information at StudeQ.
                        </p>
                        <p className={styles.meta}>
                            Effective as of{' '}
                            <time dateTime="2025-01-15">January 15, 2025</time> &middot; Last updated{' '}
                            <time dateTime="2026-06-28">June 28, 2026</time>
                        </p>
                    </div>
                    <div className={styles.heroVisual}>
                        <img
                            src="/images/studeq-privacy-hero.svg"
                            alt="Illustration of a shield with a lock icon, symbolizing data protection and privacy at StudeQ"
                            title="StudeQ Data Protection & Privacy Shield"
                            width={480}
                            height={360}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className={styles.heroImage}
                        />
                    </div>
                </header>

                {/* ── Main Content Area ── */}
                <div className={styles.contentLayout}>
                    {/* Sidebar quick nav */}
                    <aside className={styles.sidebar} aria-label="On this page">
                        <div className={styles.sidebarSticky}>
                            <span className={styles.sidebarHeading}>On this page</span>
                            <ul className={styles.sidebarList}>
                                <li>
                                    <a href="#introduction">1. Introduction</a>
                                </li>
                                <li>
                                    <a href="#information-we-collect">2. Information We Collect</a>
                                </li>
                                <li>
                                    <a href="#how-we-use-data">3. How We Use Your Data</a>
                                </li>
                                <li>
                                    <a href="#cookies">4. Cookies & Tracking</a>
                                </li>
                                <li>
                                    <a href="#third-party">5. Third-Party Services</a>
                                </li>
                                <li>
                                    <a href="#your-rights">6. Your Rights</a>
                                </li>
                                <li>
                                    <a href="#security">7. Security Measures</a>
                                </li>
                                <li>
                                    <a href="#contact-us">8. Contact Us</a>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Article body */}
                    <article className={styles.article}>
                        {/* Card: Introduction */}
                        <section id="introduction" className={styles.card} aria-labelledby="heading-intro">
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-document-shield.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-intro" className={styles.sectionTitle}>
                                1. Introduction
                            </h2>
                            <p>
                                StudeQ (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
                                committed to protecting your privacy. This policy explains what data we
                                collect when you visit our website or use our study tools, why we collect
                                it, and what choices you have. By using StudeQ, you agree to the practices
                                described here. If anything isn&apos;t clear, please reach out — we&apos;re
                                happy to clarify.
                            </p>
                        </section>

                        {/* Card: Information We Collect */}
                        <section
                            id="information-we-collect"
                            className={styles.card}
                            aria-labelledby="heading-info"
                        >
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-data-collection.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-info" className={styles.sectionTitle}>
                                2. Information We Collect
                            </h2>
                            <p>
                                We collect information you provide directly and data gathered automatically
                                when you interact with StudeQ.
                            </p>
                            <h3 className={styles.subHeading}>Account Information</h3>
                            <p>
                                When you sign up, we store your display name, email address, and a hashed
                                password. You can also sign in through Google or GitHub, in those cases we
                                receive your public profile details as permitted by the provider.
                            </p>
                            <h3 className={styles.subHeading}>Study Activity</h3>
                            <p>
                                StudeQ tracks your flashcard decks, quiz scores, revision streaks, and
                                saved notes. We use this to personalize your dashboard and show your
                                progress over time. This data stays tied to your account and is never sold.
                            </p>
                            <h3 className={styles.subHeading}>Device & Usage Data</h3>
                            <p>
                                Like most websites, we log IP addresses, browser type, referring pages,
                                and time stamps. This helps us diagnose technical issues and keep the
                                platform secure.
                            </p>
                        </section>

                        {/* Card: How We Use Data */}
                        <section
                            id="how-we-use-data"
                            className={styles.card}
                            aria-labelledby="heading-usage"
                        >
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-data-usage.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-usage" className={styles.sectionTitle}>
                                3. How We Use Your Data
                            </h2>
                            <ul className={styles.featureList}>
                                <li>
                                    <strong>Core Service Delivery.</strong> Creating your account, saving
                                    study progress, and syncing across devices.
                                </li>
                                <li>
                                    <strong>Personalization.</strong> Recommending study sets based on your
                                    weak areas and showing streak milestones.
                                </li>
                                <li>
                                    <strong>Communication.</strong> Sending product updates, security alerts,
                                    or responses to your support tickets. You can opt out of non-essential
                                    emails anytime.
                                </li>
                                <li>
                                    <strong>Analytics & Improvements.</strong> Aggregated, anonymized trends
                                    help us decide which features to build next.
                                </li>
                            </ul>
                        </section>

                        {/* Card: Cookies */}
                        <section id="cookies" className={styles.card} aria-labelledby="heading-cookies">
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-cookie.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-cookies" className={styles.sectionTitle}>
                                4. Cookies & Tracking
                            </h2>
                            <p>
                                StudeQ uses essential cookies to keep you signed in and remember your
                                preferences (like dark mode). We also use optional analytics cookies
                                through a privacy focused provider to understand how the app is used, no
                                personal identifiers are included. You can disable non essential cookies
                                from your browser settings, though the platform may behave slightly
                                differently.
                            </p>
                            <div className={styles.callout} role="note">
                                <span className={styles.calloutLabel}>Note</span>
                                We do not use fingerprinting, pixel tracking, or any form of covert
                                surveillance.
                            </div>
                        </section>

                        {/* Card: Third-Party */}
                        <section
                            id="third-party"
                            className={styles.card}
                            aria-labelledby="heading-third-party"
                        >
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-integration.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-third-party" className={styles.sectionTitle}>
                                5. Third-Party Services
                            </h2>
                            <p>
                                We rely on a small set of trusted partners to run StudeQ. Each has been
                                vetted for compliance with data protection standards:
                            </p>
                            <ul className={styles.featureList}>
                                <li>
                                    <strong>Render</strong> — hosting and serverless functions. They process
                                    request logs under their own privacy framework.
                                </li>
                                <li>
                                    <strong>Supabase</strong> — database and authentication. Your credentials
                                    and study data are stored here.
                                </li>
                                <li>
                                    <strong>Resend</strong> — transactional emails (password resets, login
                                    alerts). Email addresses are shared solely for delivery.
                                </li>
                            </ul>
                            <p>
                                StudeQ does not embed third party ad networks or data brokers. We will
                                notify you before adding any new sub processor.
                            </p>
                        </section>

                        {/* Card: Your Rights */}
                        <section
                            id="your-rights"
                            className={styles.card}
                            aria-labelledby="heading-rights"
                        >
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-user-rights.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-rights" className={styles.sectionTitle}>
                                6. Your Rights
                            </h2>
                            <p>
                                Depending on where you live, you may have the right to access, correct,
                                delete, or export your data. To make a request, email{' '}
                                <a href="mailto:privacy@studeq.com" className={styles.inlineLink}>
                                    kanchannath.webdev@gmail.com
                                </a>{' '}
                                with the subject &ldquo;Data Request&rdquo;. We&apos;ll respond within 30
                                days. You also have the right to lodge a complaint with your local data
                                protection authority if you believe your rights have been violated.
                            </p>
                            <div className={styles.callout}>
                                <span className={styles.calloutLabel}>Quick Links</span>
                                <Link href="/contact" className={styles.inlineLink}>
                                    Contact Support
                                </Link>{' '}
                                or visit your{' '}
                                <a href="https://studeq.onrender.com/dashboard" className={styles.inlineLink}>
                                    Account Settings
                                </a>{' '}
                                to update your data directly.
                            </div>
                        </section>

                        {/* Card: Security */}
                        <section
                            id="security"
                            className={styles.card}
                            aria-labelledby="heading-security"
                        >
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-lock-shield.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-security" className={styles.sectionTitle}>
                                7. Security Measures
                            </h2>
                            <p>
                                We encrypt data in transit (TLS 1.3) and at rest (AES-256). Access to
                                production infrastructure is restricted to key engineers and requires
                                multi factor authentication. We run automated vulnerability scans and apply
                                patches within 48 hours of critical disclosures. If a breach occurs, you
                                will be notified within 72 hours along with a clear action plan.
                            </p>
                            <div className={styles.badgeGroup}>
                                <span className={styles.badge}>TLS 1.3</span>
                                <span className={styles.badge}>AES-256</span>
                                <span className={styles.badge}>SOC 2 Compliant</span>
                            </div>
                        </section>

                        {/* Card: Contact Us */}
                        <section
                            id="contact-us"
                            className={styles.card}
                            aria-labelledby="heading-contact"
                        >
                            <div className={styles.cardIcon} aria-hidden="true">
                                <img
                                    src="/images/icon-mail.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h2 id="heading-contact" className={styles.sectionTitle}>
                                8. Contact Us
                            </h2>
                            <p>
                                StudeQ is operated by Kanchan Nath. For privacy related questions,
                                reach our Founder at:
                            </p>
                            <address className={styles.address}>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:privacy@studeq.com" className={styles.inlineLink}>
                                    kanchannath.webdev@gmail.com
                                </a>
                                <br />
                                <strong>Address:</strong> Basirhat,North 24 Pgs. , West Bengal, 743412,India
                            </address>
                        </section>

                        {/* Secondary CTA / Internal links for engagement */}
                        <div className={styles.relatedLinks} aria-label="Related pages">
                            <span className={styles.relatedLabel}>Explore StudeQ</span>
                            <div className={styles.linkGrid}>
                                <Link href="/terms-of-service" className={styles.relatedCard}>
                                    <img
                                        src="/images/icon-terms.svg"
                                        alt="Terms of Service document icon"
                                        width={24}
                                        height={24}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span>Terms of Service</span>
                                </Link>
                                <Link href="/blog/how-to-study-effectively" className={styles.relatedCard}>
                                    <img
                                        src="/images/icon-blog.svg"
                                        alt="Blog article icon"
                                        width={24}
                                        height={24}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span>How to Study Effectively</span>
                                </Link>
                                <Link href="/pricing" className={styles.relatedCard}>
                                    <img
                                        src="/images/icon-pricing.svg"
                                        alt="Pricing plans icon"
                                        width={24}
                                        height={24}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span>StudeQ Plans</span>
                                </Link>
                                <Link href="/about" className={styles.relatedCard}>
                                    <img
                                        src="/images/icon-about.svg"
                                        alt="About StudeQ team icon"
                                        width={24}
                                        height={24}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span>About Us</span>
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </>
    );
}