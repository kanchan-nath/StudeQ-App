// components/ThemeScript.jsx
export const ThemeScript = () => {
    return (
        <script
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