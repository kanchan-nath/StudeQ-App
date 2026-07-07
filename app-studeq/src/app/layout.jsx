import "./globals.css"; 
import { ThemeScript } from "@/components/ThemeScript"; 
import ThemeProvider from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  metadataBase: new URL("https://studeq.onrender.com"),

  title: "StudeQ — AI Powered Study Platform",

  description:
    "StudeQ helps students study smarter with AI generated quizzes, flashcards, notes, and personalised timetables.",

  applicationName: "StudeQ",

  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  authors: [
    {
      name: "Kanchan Nath",
    },
  ],

  creator: "Kanchan Nath",

  publisher: "StudeQ",

  keywords: [
    "AI study platform",
    "AI notes",
    "AI flashcards",
    "AI quizzes",
    "AI tutor",
    "PDF to notes",
    "study with AI",
    "AI learning platform",
    "exam preparation",
    "student productivity",
    "study planner",
    "AI education",
  ],

  verification: {
    google: "nuIuORa0PeSDcS_sze1GxUt1ET5hyhVBU5Vh3x1HWrc",
    other: {
      "msvalidate.01": "84C19D9F44AD40DB58C75CE622092E5A",
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
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
    creator: "Kanchan Nath",
    images: ["/favicon.svg"],
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
      </head>

      <body>
        <ThemeProvider>{children}</ThemeProvider>
         <GoogleAnalytics gaId="G-EPFWDB8HYE" />
      </body>
    </html>
  );
}