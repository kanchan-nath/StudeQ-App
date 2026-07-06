// src/app/layout.jsx

import "./globals.css";
import Script from "next/script";
import { ThemeScript } from "@/components/ThemeScript";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  metadataBase: new URL("https://studeq.onrender.com"), // Change to your real domain

  title: "StudeQ — AI Powered Study Platform",

  description:
    "StudeQ helps students study smarter with AI generated quizzes, flashcards, notes, and personalised timetables.",

  applicationName: "StudeQ",

  manifest: "/manifest.json",

  themeColor: "#6c47ff",

  verification: {
    google: "nuIuORa0PeSDcS_sze1GxUt1ET5hyhVBU5Vh3x1HWrc",
    other: {
      "msvalidate.01": "84C19D9F44AD40DB58C75CE622092E5A",
    },
  },
  
  openGraph: {
    type: "website",
    siteName: "StudeQ",
    title: "StudeQ — AI Powered Study Platform",
    description:
      "Study smarter with AI quizzes, flashcards, notes, and timetables.",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StudeQ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StudeQ — AI Powered Study Platform",
    description:
      "Study smarter with AI quizzes, flashcards, notes, and timetables.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EPFWDB8HYE"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EPFWDB8HYE');
          `}
        </Script>

        {/* Ahrefs */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="BzueQFYBTleU4WENyLbgRw"
          strategy="afterInteractive"
        />
      </head>

      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}