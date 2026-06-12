import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./GlobalLoader.module.css";
import loaderAnimation from "../assets/loader.json";

import * as LottieModule from "lottie-react";
const Lottie =
  LottieModule?.default?.default ?? LottieModule?.default ?? LottieModule;

const SHOW_DELAY_MS = 200; // don't show if fetch finishes before this 200
const MIN_VISIBLE_MS = 500; // once shown, stay at least this long 500

const GlobalLoader = ({ visible, label }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [frozenLabel, setFrozenLabel] = useState(label);
  const showTimer = useRef(null);
  const shownAt = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (visible) {
      // schedule show after SHOW_DELAY_MS
      showTimer.current = setTimeout(() => {
        setShouldRender(true);
        setFrozenLabel(label);
        shownAt.current = Date.now();
      }, SHOW_DELAY_MS);
    } else {
      // cancel pending show (fetch was fast — never show)
      clearTimeout(showTimer.current);

      if (shownAt.current) {
        // already visible — enforce minimum display time
        const elapsed = Date.now() - shownAt.current;
        const remaining = MIN_VISIBLE_MS - elapsed;

        hideTimer.current = setTimeout(
          () => {
            setShouldRender(false);
            shownAt.current = null;
          },
          Math.max(0, remaining),
        );
      }
    }

    return () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, [visible]);

  useEffect(() => {
    document.body.style.overflow = shouldRender ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label={frozenLabel || "Loading…"}
    >
      <div className={styles.card}>
        <Lottie
          animationData={loaderAnimation}
          loop
          autoplay
          className={styles.lottie}
        />
        {frozenLabel && <p className={styles.label}>{frozenLabel}</p>}
      </div>
    </div>,
    document.body,
  );
};

export default GlobalLoader;
