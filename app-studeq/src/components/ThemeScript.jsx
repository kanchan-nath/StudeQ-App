// components/ThemeScript.jsx
import Script from "next/script";
export const ThemeScript = () => {
    return (
        <Script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            try {
              var theme = localStorage.getItem('studeq-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `,
            }}
        />
    );
};