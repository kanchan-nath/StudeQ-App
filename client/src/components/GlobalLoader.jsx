import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./GlobalLoader.module.css";
import loaderAnimation from "../assets/loader.json";

// lottie-react is double-wrapped under Vite: module.default.default = component
import * as LottieModule from "lottie-react";
const Lottie =
    LottieModule?.default?.default ??
    LottieModule?.default ??
    LottieModule;

const GlobalLoader = ({ visible, label }) => {
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [visible]);

    if (!visible) return null;

    return createPortal(
        <div
            className={styles.overlay}
            role="status"
            aria-live="polite"
            aria-label={label || "Loading…"}
        >
            <div className={styles.card}>
                <Lottie
                    animationData={loaderAnimation}
                    loop
                    autoplay
                    className={styles.lottie}
                />
                {label && <p className={styles.label}>{label}</p>}
            </div>
        </div>,
        document.body
    );
};

export default GlobalLoader;