import { useEffect, useState } from "react";
import styles from "../components/Themetoggle.module.css";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("studeq-theme");
    // Default to dark (matches existing site design)
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("studeq-theme", theme);
  }, [dark]);

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
