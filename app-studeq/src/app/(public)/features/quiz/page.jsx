import QuizFeatureClient from "./QuizFeatureClient.jsx";

// Metadata for App Router
export const metadata = {
    title: 'AI Quiz Maker — Generate Quizzes from Notes | StudeQ',
    description: 'Create MCQ, true/false, fill in the blank, and short answer quizzes from your notes or any topic in seconds. StudeQ AI quiz engine adapts to your learning.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://studeq.onrender.com/features/quiz',
    },
    openGraph: {
        title: 'AI Quiz Maker — Generate Quizzes from Notes | StudeQ',
        description: 'Generate smart quizzes from your notes, PDFs, or topics. Multiple question types, adaptive difficulty, and instant AI explanations.',
        url: 'https://studeq.onrender.com/features/quiz',
        type: 'website',
        images: [
            {
                url: 'https://studeq.onrender.com/og-quiz.svg',
                width: 1200,
                height: 630,
                alt: 'StudeQ AI Quiz Maker - Generate Quizzes from Notes',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Quiz Maker — Generate Quizzes from Notes | StudeQ',
        description: 'Generate smart quizzes from your notes, PDFs, or topics. Multiple question types, adaptive difficulty, and instant AI explanations.',
        images: ['https://studeq.onrender.com/og-quiz.svg'],
    },
};

// JSON-LD Schema (moved to server)
const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StudeQ AI Quiz Maker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
        'AI-powered quiz maker that generates MCQ, true/false, fill-in-the-blank, and short-answer quizzes from your notes, PDFs, or any topic in seconds.',
    featureList: [
        'AI quiz generation from notes and PDFs',
        'Multiple question types',
        'Adaptive difficulty engine',
        'Performance analytics dashboard',
        'Spaced repetition flashcards',
        'Quiz sharing and leaderboards',
    ],
    url: 'https://studeq.onrender.com/features/quiz',
    screenshot: 'https://studeq.onrender.com/og-quiz.png',
};

export default function QuizFeaturePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
            />
            <QuizFeatureClient />
        </>
    );
}