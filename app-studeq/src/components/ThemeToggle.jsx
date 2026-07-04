// components/ThemeToggle.jsx
"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const [dark, setDark] = useState(true); // Default to dark

    useEffect(() => {
        setMounted(true);
        // Read from localStorage only on client side
        try {
            const savedTheme = localStorage.getItem("studeq-theme");
            if (savedTheme) {
                setDark(savedTheme === "dark");
            }
        } catch (e) {
            console.warn("Failed to read theme from localStorage:", e);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const theme = dark ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);

        try {
            localStorage.setItem("studeq-theme", theme);
        } catch (e) {
            console.warn("Failed to save theme to localStorage:", e);
        }
    }, [dark, mounted]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <button className={styles.toggleBtn} aria-label="Loading theme toggle">
                <span className={styles.track}>
                    <span className={`${styles.thumb} ${styles.thumbDark}`}>
                        🌙
                    </span>
                </span>
            </button>
        );
    }

    return (
        <button
            className={styles.toggleBtn}
            onClick={() => setDark((prev) => !prev)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
        >
            <span className={styles.track}>
                <span
                    className={`${styles.thumb} ${dark ? styles.thumbDark : styles.thumbLight}`}
                >
                    {dark ? "🌙" : "☀️"}
                </span>
            </span>
        </button>
    );
};

export default ThemeToggle;