import FeaturesClientPage from "./FeaturesClient.jsx";

// Metadata for App Router
export const metadata = {
    title: 'Features — StudeQ AI Study Platform',
    description: 'Explore StudeQ\'s AI tools: quiz generator, smart flashcards, note summarizer, document chat, timetable, and dual search — built for students.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://studeq.onrender.com/features',
    },
    openGraph: {
        title: 'Features — StudeQ AI Study Platform',
        description: 'Quiz generator, document chat, AI flashcards, timetable & more. Everything a student needs to study smarter.',
        url: 'https://studeq.onrender.com/features',
        type: 'website',
        images: [
            {
                url: 'https://studeq.onrender.com/og-features.svg',
                width: 1200,
                height: 630,
                alt: 'StudeQ AI Study Platform Features',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Features — StudeQ AI Study Platform',
        description: 'Quiz generator, document chat, AI flashcards, timetable & more. Everything a student needs to study smarter.',
        images: ['https://studeq.onrender.com/og-features.svg'],
    },
};

// Schema data (moved to server component)
const SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StudeQ',
    applicationCategory: 'EducationApplication',
    description:
        'AI-powered study platform with quiz generation, smart flashcards, document chat, and intelligent scheduling for students.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
    },
    featureList: [
        'AI Quiz Generator',
        'Smart Flashcards',
        'AI Note Summarizer',
        'Document Chat (RAG)',
        'Timetable & Calendar',
        'Google + YouTube Search',
    ],
};

const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What file types does StudeQ support for quiz generation?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'StudeQ supports PDF, PowerPoint, Excel, Word documents, and images for quiz generation.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does the document chat feature work?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Upload any document up to 20 MB and ask questions about it. StudeQ uses retrieval-augmented generation (RAG) to answer from your document with full markdown and math rendering.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I study without uploading files?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes — paste any text to generate quizzes, summaries, or flashcards instantly without uploading a file.',
            },
        },
    ],
};

export default function FeaturesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
            />
            <FeaturesClientPage />
        </>
    );
}