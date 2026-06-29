import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <Link to="/" className={styles.logo}>
                    SPARK<span>.E</span>
                </Link>
                <Link to="/" className={styles.backLink}>
                    ← Back to home
                </Link>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <p className={styles.footerText}>© 2026 StudeQ Inc.</p>
            </footer>
        </div>
    );
};

export default AuthLayout;