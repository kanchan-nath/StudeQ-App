"use client";
import "../globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import Breadcrumb from "../../components/Breadcrumb.jsx";
import styles from "./PublicLayout.module.css";
import {
    FileText,
    Bot,
    Layers,
    FlaskConical,
    Users,
    Image,
    FileSearch,
    CalendarClock,
} from "lucide-react";

function useScrolled(threshold = 40) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > threshold);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, [threshold]);
    return scrolled;
}

const NAV_FEATURES = [
    { to: "/features/note", icon: "📝", label: "AI Notes", desc: "PDF → structured notes in seconds" },
    { to: "/features/notebook", icon: "🤖", label: "AI Tutor", desc: "Subject-aware multi-turn chat" },
    { to: "/features/flashcard", icon: "🃏", label: "Flashcards", desc: "SM-2 spaced repetition decks" },
    { to: "/features/quiz", icon: "🧪", label: "AI Quiz", desc: "6 question types, instant feedback" },
    { to: "/features/study-room", icon: "🏠", label: "Study Room", desc: "Live collaborative sessions" },
    { to: "/features/image-analysis", icon: "🖼️", label: "Image Analysis", desc: "Diagrams, handwriting, LaTeX" },
    { to: "/features/pdf-analysis", icon: "📄", label: "PDF Analysis", desc: "Chat with any PDF document" },
    { to: "/features/scheduler", icon: "📅", label: "AI Scheduler", desc: "Study plan around your exams" },
];

const BLOG_POSTS = [
    { to: "/blog/10-20-70-rule-of-ai", Icon: FileText, label: "10/20/70 Rule of AI?", desc: "What Is the 10/20/70 Rule of AI? A Practical Framework" },
    { to: "/blog/ai-quiz-for-teacher", Icon: Bot, label: "AI Quiz for Teachers", desc: "The Best Free Generators That Actually Work" },
    { to: "/blog/ai-quiz-generator", Icon: Layers, label: "AI Quiz Generator", desc: "Create Practice Tests from PDF & Text in Seconds" },
    { to: "/blog/ai-study-faster", Icon: FlaskConical, label: "How to Use AI to Study Faster", desc: "Can AI help with studying, or does it just make you feel productive while you learn less?" },
    { to: "/blog/best-ai-tools-for-teachers", Icon: Users, label: "Best AI Tools for Teachers", desc: "Best AI Tools for Teachers in 2026: Free & Paid Options" },
    { to: "/blog/how-to-memorize-10x-faster", Icon: Image, label: "How to Memorize Faster", desc: "How to Memorize Faster: 5 Science-Backed Techniques for Students" },
    { to: "/blog/quiz-from-notes", Icon: CalendarClock, label: "How to Generate a Quiz from Notes with AI ", desc: "Stop rereading your notes and hoping something sticks" },
];

const BREADCRUMB_MAP = {
    "/features": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
    ],
    "/features/note": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "AI Notes" },
    ],
    "/features/quiz": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "AI Quiz" },
    ],
    "/features/flashcard": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "AI Flashcard" },
    ],
    "/features/notebook": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "AI Tutor Chat" },
    ],
    "/features/study-room": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "Live Study Room" },
    ],
    "/features/scheduler": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "AI Scheduler" },
    ],
    "/features/time-table": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "Time Table" },
    ],
    "/features/image-analysis": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "Image Analysis" },
    ],
    "/features/pdf-analysis": [
        { label: "Home", to: "/" },
        { label: "Features", to: "/features" },
        { label: "PDF Analysis" },
    ],
    "/pricing": [{ label: "Home", to: "/" }, { label: "Pricing" }],
    "/our-mission": [{ label: "Home", to: "/" }, { label: "Our Mission" }],
};

export default function PublicLayout({ children }) {
    const scrolled = useScrolled();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const breadcrumb = BREADCRUMB_MAP[pathname] || null;

    return (
        <div className={styles.layout}>
            {/* ── NAVBAR ── */}
            <nav
                className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
                aria-label="Main navigation"
            >
                <div className={styles.navInner}>
                    <div className={styles.navLeft}>
                        <Link href="/" className={styles.navLogo}>
                            Stude<span>Q</span>
                        </Link>
                        <ul className={styles.navLinks} role="list">
                            <li className={`${styles.navItem} ${styles.hasDropdown}`} role="presentation">
                                <button
                                    className={styles.navLink}
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Features
                                    <span className={styles.navChevron} aria-hidden="true">▾</span>
                                </button>

                                <div className={styles.navDropdown} role="menu">
                                    <div className={styles.navDropdownArrow} aria-hidden="true" />
                                    <div className={styles.navDropdownGrid}>
                                        {NAV_FEATURES.map((item) => (
                                            <Link
                                                key={item.to}
                                                href={item.to}
                                                className={styles.navDropdownItem}
                                                role="menuitem"
                                            >
                                                <span className={styles.navDropdownIcon} aria-hidden="true">
                                                    {item.icon}
                                                </span>
                                                <span className={styles.navDropdownText}>
                                                    <span className={styles.navDropdownLabel}>{item.label}</span>
                                                    <span className={styles.navDropdownDesc}>{item.desc}</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className={styles.navDropdownFooter}>
                                        <Link href="/features" className={styles.navDropdownFooterLink}>
                                            View all features →
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Link href="/pricing" className={styles.navLink}>
                                    Pricing
                                </Link>
                            </li>
                            <li className={`${styles.navItem} ${styles.hasDropdown}`} role="presentation">
                                <button
                                    className={styles.navLink}
                                    aria-haspopup="true"
                                    aria-expanded="false"   // toggled by CSS :focus-within for keyboard
                                >
                                    Blogs
                                    <span className={styles.navChevron} aria-hidden="true">▾</span>
                                </button>

                                <div className={styles.navDropdown} role="menu">
                                    <div className={styles.navDropdownArrow} aria-hidden="true" />
                                    <div className={styles.navDropdownGrid}>
                                        {BLOG_POSTS.map((item) => (
                                            <Link
                                                key={item.to}
                                                href={item.to}
                                                className={styles.navDropdownItem}
                                                role="menuitem"
                                            >
                                                <span className={styles.navDropdownIcon} aria-hidden="true">
                                                    <item.Icon size={16} strokeWidth={1.8} />
                                                </span>
                                                <span className={styles.navDropdownText}>
                                                    <span className={styles.navDropdownLabel}>{item.label}</span>
                                                    <span className={styles.navDropdownDesc}>{item.desc}</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className={styles.navDropdownFooter}>
                                        <Link href="/features" className={styles.navDropdownFooterLink}>
                                            View all features →
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Link href="/how-it-works" className={styles.navLink}>
                                    How It Works
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.navRight}>
                        <ThemeToggle />
                        <Link href="/login" className={styles.navLoginBtn}>
                            Log in
                        </Link>
                        <Link href="/register" className={styles.navCta}>
                            Start now
                        </Link>
                    </div>

                    <button
                        className={styles.hamburger}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen1 : ""}`} />
                        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen2 : ""}`} />
                        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen3 : ""}`} />
                    </button>
                </div>

                {menuOpen && (
                    <div className={styles.mobileMenu}>
                        {NAV_FEATURES.map((link) => (
                            <Link
                                key={link.to}
                                href={link.to}
                                className={styles.mobileMenuLink}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className={styles.mobileMenuActions}>
                            <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setMenuOpen(false)}>
                                Log in
                            </Link>
                            <Link href="/register" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
                                Start now
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {breadcrumb && (
                <div className={styles.breadcrumbBar}>
                    <div className={styles.breadcrumbInner}>
                        <Breadcrumb items={breadcrumb} />
                    </div>
                </div>
            )}

            <main className={styles.main}>
                {children}
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerLogoBlock}>
                        <Link href="/" className={styles.footerLogo}>
                            Stude<span>Q</span>
                        </Link>
                        <p className={styles.footerTagline}>Your AI powered study companion.</p>
                        <p className={styles.footerCopyright}>© 2026 StudeQ Inc.</p>
                        <div className={styles.footerSocials}>
                            <a href="https://x.com/KanchanNathDev" className={styles.socialBtn} aria-label="X / Twitter">𝕏</a>
                            <a href="https://www.linkedin.com/company/studeq/" className={styles.socialBtn} aria-label="LinkedIn">in</a>
                            <a href="https://www.instagram.com/kanchannath.webdev" className={styles.socialBtn} aria-label="Instagram">◎</a>
                            {/* <a href="#" className={styles.socialBtn} aria-label="Discord">⊕</a> */}
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerLinkCol}>
                            <span className={styles.footerLinkHeading}>Product</span>
                            <Link href="/features/note" className={styles.footerLink}>AI Notes</Link>
                            <Link href="/features/notebook" className={styles.footerLink}>AI Tutor Chat</Link>
                            <Link href="/features/quiz" className={styles.footerLink}>Create Quiz</Link>
                            <Link href="/features/flashcard" className={styles.footerLink}>AI Flashcards</Link>
                            {/* <Link href="/features/time-table" className={styles.footerLink}>Time Table</Link>
                            <Link href="/features/scheduler" className={styles.footerLink}>AI Scheduler</Link>
                            <Link href="/features/study-room" className={styles.footerLink}>Collaborative Study Room</Link>
                            <Link href="/features/image-analysis" className={styles.footerLink}>Image Analysis</Link>
                            <Link href="/features/pdf-analysis" className={styles.footerLink}>PDF Analysis</Link> */}
                        </div>
                        <div className={styles.footerLinkCol}>
                            <span className={styles.footerLinkHeading}>Use Cases</span>
                            <a href="#" className={styles.footerLink}>Mathematics</a>
                            <a href="#" className={styles.footerLink}>Physics</a>
                            <a href="#" className={styles.footerLink}>Chemistry</a>
                            <a href="#" className={styles.footerLink}>Biology</a>
                            <a href="#" className={styles.footerLink}>Computer Science</a>
                            <a href="#" className={styles.footerLink}>History</a>
                        </div>
                        <div className={styles.footerLinkCol}>
                            <span className={styles.footerLinkHeading}>Company</span>
                            <Link href="/about" className={styles.footerLink}>About</Link>
                            <Link href="/profile" className={styles.footerLink}>Profile</Link>
                            <Link href="/blog" className={styles.footerLink}>Blog</Link>
                            <Link href="/careers" className={styles.footerLink}>Careers</Link>
                            <Link href="/term-of-use" className={styles.footerLink}>Terms of Use</Link>
                            <Link href="privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
                        </div>
                        <div className={styles.footerLinkCol}>
                            <span className={styles.footerLinkHeading}>Contact</span>
                            <a href="mailto:kanchannath.webdev@gmail.com" className={styles.footerLink}>kanchannath.webdev@gmail.com</a>
                            {/* <a href="#" className={styles.footerLink}>Discord Community</a> */}
                        </div>
                    </div>
                </div>

                <div className={styles.footerWordmark} aria-hidden="true">
                    <span className={styles.footerWordmarkText}>StudeQ</span>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.footerBottomText}>© 2026 StudeQ Inc. — Learn smarter, not harder.</p>
                </div>
            </footer>
        </div>
    );
}