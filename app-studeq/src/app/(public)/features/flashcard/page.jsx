import FlashcardFeatureClient from "./FlashcardFeatureClient.jsx";

// Metadata for App Router
export const metadata = {
    title: 'AI Flashcard Maker — Spaced Repetition from Your Notes | StudeQ',
    description: 'Generate smart flashcard decks from any notes or PDF. Six study modes, spaced repetition, and AI powered mastery tracking. Study less, remember more.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://studeq.onrender.com/features/flashcard',
    },
    openGraph: {
        title: 'AI Flashcard Maker — Spaced Repetition from Your Notes | StudeQ',
        description: 'Generate smart flashcard decks from any notes or PDF. Six study modes, spaced repetition, and AI powered mastery tracking.',
        url: 'https://studeq.onrender.com/features/flashcard',
        type: 'website',
        images: [
            {
                url: 'https://studeq.onrender.com/og-flashcards.svg',
                width: 1200,
                height: 630,
                alt: 'StudeQ AI Flashcard Maker with Spaced Repetition',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Flashcard Maker — Spaced Repetition from Your Notes | StudeQ',
        description: 'Generate smart flashcard decks from any notes or PDF. Six study modes, spaced repetition, and AI-powered mastery tracking.',
        images: ['https://studeq.onrender.com/og-flashcards.svg'],
    },
};

// JSON-LD Schema (moved to server component)
const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StudeQ AI Flashcard Maker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
        'AI-powered flashcard maker that generates smart decks from your notes, PDFs, or any topic. Spaced repetition, six study modes, and a mastery dashboard — all in one place.',
    featureList: [
        'AI flashcard generation from notes and PDFs',
        'Spaced repetition SM-2 algorithm',
        'Six study modes including voice and match game',
        'Mastery dashboard and per-card analytics',
        'AI card editor with mnemonic generation',
        'Anki-compatible export',
        'Deck sharing and collaboration',
    ],
    url: 'https://studeq.onrender.com/features/flashcard',
    screenshot: 'https://studeq.onrender.com/og-flashcards.svg',
};

export default function FlashcardFeaturePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
            />
            <FlashcardFeatureClient />
        </>
    );
}