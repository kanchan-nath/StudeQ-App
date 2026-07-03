// src/app/layout.jsx
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "StudeQ — AI Powered Study Platform",
  description: "Turn any PDF, image, or notes into flashcards, quizzes, and summaries in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}