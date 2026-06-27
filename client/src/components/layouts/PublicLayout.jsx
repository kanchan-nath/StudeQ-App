import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import Breadcrumb from "../Breadcrumb";
import styles from "./PublicLayout.module.css";

function useScrolled(threshold = 40) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > threshold);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, [threshold]);
    return scrolled;
}

const NAV_LINKS = [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Our Mission", to: "/our-mission" },
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

const PublicLayout = () => {
    const scrolled = useScrolled();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const breadcrumb = BREADCRUMB_MAP[location.pathname] || null;

    return (
        <div className={styles.layout}>
            {/* ── NAVBAR ── */}
            <nav
                className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
                aria-label="Main navigation"
            >
                <div className={styles.navInner}>
                    <div className={styles.navLeft}>
                        <Link to="/" className={styles.navLogo}>
                            SPARK<span>.E</span>
                        </Link>
                        <ul className={styles.navLinks} role="list">
                            {NAV_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={`${styles.navLink} ${location.pathname === link.to || location.pathname.startsWith(link.to + "/") ? styles.navLinkActive : ""}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.navRight}>
                        <ThemeToggle />
                        <Link to="/login" className={styles.navLoginBtn}>
                            Log in
                        </Link>
                        <Link to="/register" className={styles.navCta}>
                            Start now
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
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

                {/* Mobile menu */}
                {menuOpen && (
                    <div className={styles.mobileMenu}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={styles.mobileMenuLink}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className={styles.mobileMenuActions}>
                            <Link to="/login" className={styles.mobileLoginBtn} onClick={() => setMenuOpen(false)}>
                                Log in
                            </Link>
                            <Link to="/register" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
                                Start now
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── BREADCRUMB ── */}
            {breadcrumb && (
                <div className={styles.breadcrumbBar}>
                    <div className={styles.breadcrumbInner}>
                        <Breadcrumb items={breadcrumb} />
                    </div>
                </div>
            )}

            {/* ── PAGE CONTENT ── */}
            <main className={styles.main}>
                <Outlet />
            </main>

            {/* ── FOOTER ── */}
            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerLogoBlock}>
                        <Link to="/" className={styles.footerLogo}>
                            SPARK<span>.E</span>
                        </Link>
                        <p className={styles.footerTagline}>Your AI-powered study companion.</p>
                        <p className={styles.footerCopyright}>© 2026 Spark.E Inc.</p>
                        <div className={styles.footerSocials}>
                            <a href="#" className={styles.socialBtn} aria-label="X / Twitter">𝕏</a>
                            <a href="#" className={styles.socialBtn} aria-label="LinkedIn">in</a>
                            <a href="#" className={styles.socialBtn} aria-label="Instagram">◎</a>
                            <a href="#" className={styles.socialBtn} aria-label="Discord">⊕</a>
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerLinkCol}>
                            <span className={styles.footerLinkHeading}>Product</span>
                            <Link to="/features/note" className={styles.footerLink}>AI Notes</Link>
                            <Link to="/features/notebook" className={styles.footerLink}>AI Tutor Chat</Link>
                            <Link to="/features/quiz" className={styles.footerLink}>Create Quiz</Link>
                            <Link to="/features/flashcard" className={styles.footerLink}>AI Flashcards</Link>
                            <Link to="/features/time-table" className={styles.footerLink}>Time Table</Link>
                            <Link to="/features/scheduler" className={styles.footerLink}>AI Scheduler</Link>
                            <Link to="/features/study-room" className={styles.footerLink}>Collaborative Study Room</Link>
                            <Link to="/features/image-analysis" className={styles.footerLink}>Image Analysis</Link>
                            <Link to="/features/pdf-analysis" className={styles.footerLink}>PDF Analysis</Link>
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
                            <a href="#" className={styles.footerLink}>About</a>
                            <a href="#" className={styles.footerLink}>Blog</a>
                            <a href="#" className={styles.footerLink}>Careers</a>
                            <a href="#" className={styles.footerLink}>Terms of Use</a>
                            <a href="#" className={styles.footerLink}>Privacy Policy</a>
                        </div>
                        <div className={styles.footerLinkCol}>
                            <span className={styles.footerLinkHeading}>Contact</span>
                            <a href="mailto:hello@sparke.ai" className={styles.footerLink}>hello@sparke.ai</a>
                            <a href="#" className={styles.footerLink}>Discord Community</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerWordmark} aria-hidden="true">
                    <span className={styles.footerWordmarkText}>SPARK.E</span>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.footerBottomText}>© 2026 Spark.E Inc. — Learn smarter, not harder.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;