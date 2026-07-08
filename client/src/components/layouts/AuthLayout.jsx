import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <a href="https://studeq.onrender.com" className={styles.logo}>
                    Stude<span>Q</span>
                </a>
                <a href="https://studeq.onrender.com/" className={styles.backLink}>
                    ← Back to home
                </a>
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