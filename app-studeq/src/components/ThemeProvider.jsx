// components/ThemeProvider.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    theme: "dark",
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const savedTheme = localStorage.getItem("studeq-theme") || "dark";
            setTheme(savedTheme);
        } catch (e) {
            console.warn("Failed to read theme:", e);
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "dark" ? "light" : "dark";
            try {
                localStorage.setItem("studeq-theme", newTheme);
            } catch (e) {
                console.warn("Failed to save theme:", e);
            }
            document.documentElement.setAttribute("data-theme", newTheme);
            return newTheme;
        });
    };

    // Prevent hydration issues
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;