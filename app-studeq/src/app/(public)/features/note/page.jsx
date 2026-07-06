import NotesFeatureClient from "./NotesFeatureClient.jsx";

// Metadata for App Router
export const metadata = {
    title: 'AI Note Taking for Students — StudeQ Smart Notes',
    description: 'Summarize lectures, detect key concepts, and convert notes to quizzes or flashcards with AI. StudeQ Notes is built for university students.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://studeq.onrender.com/features/note',
    },
    openGraph: {
        title: 'AI Note Taking for Students — StudeQ Smart Notes',
        description: 'Paste any lecture, get a structured AI summary with key concepts, and convert to quizzes or flashcards instantly.',
        url: 'https://studeq.onrender.com/features/note',
        type: 'website',
        images: [
            {
                url: 'https://studeq.onrender.com/og/notes-feature.svg',
                width: 1200,
                height: 630,
                alt: 'StudeQ AI Notes Feature',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Note Taking for Students — StudeQ Smart Notes',
        description: 'Paste any lecture, get a structured AI summary with key concepts, and convert to quizzes or flashcards instantly.',
        images: ['https://studeq.onrender.com/og/notes-feature.svg'],
    },
};

// FAQ data (needed for JSON-LD)
const FAQ_ITEMS = [
    {
        id: 'faq-formats',
        question: 'What types of notes does StudeQ support?',
        answer:
            'StudeQ accepts plain text, formatted lecture notes, and PDF uploads. Paste directly from your LMS, type freehand, or drop in a file — the AI processes any format without extra steps.',
    },
    {
        id: 'faq-how',
        question: 'How does AI summarization work?',
        answer:
            'StudeQ analyzes note content using LLMs fine-tuned for academic material. It identifies key concepts, condenses lengthy explanations, and structures information into scannable summaries you can actually study from.',
    },
    {
        id: 'faq-organize',
        question: 'Can I organize notes by subject or course?',
        answer:
            'Yes. Notes are auto-tagged by detected subject area and you can manually assign them to courses. The dashboard groups by course so you find exactly what you need before an exam.',
    },
    {
        id: 'faq-accuracy',
        question: 'How accurate is the AI analysis?',
        answer:
            'Accuracy scales with input quality. Well-structured lecture content yields highly precise summaries. You can always review and correct AI output before converting to flashcards or quizzes.',
    },
    {
        id: 'faq-edit',
        question: 'Can I edit AI-generated summaries?',
        answer:
            'Absolutely. All AI output is fully editable. Think of it as a first draft — StudeQ handles the heavy lifting, you refine it to match your understanding.',
    },
    {
        id: 'faq-privacy',
        question: 'Is my note data private and secure?',
        answer:
            'Your notes are stored securely and never used to train models or shared with third parties. Each user\'s data is isolated and processed under strict data handling policies.',
    },
];

// JSON-LD Schema (moved to server)
const JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'SoftwareApplication',
            name: 'StudeQ AI Notes',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            description:
                'AI-powered note taking, summarization, and organization tool for university students.',
            url: 'https://studeq.onrender.com/features/notes',
            featureList: [
                'AI note summarization',
                'Auto-tagging and topic detection',
                'Key concept highlighting',
                'PDF and text input support',
                'Note-to-quiz conversion',
                'Note-to-flashcard generation',
            ],
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://studeq.onrender.com' },
                { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://studeq.onrender.com/features' },
                { '@type': 'ListItem', position: 3, name: 'AI Notes', item: 'https://studeq.onrender.com/features/notes' },
            ],
        },
        {
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
        },
    ],
};

export default function NotesFeaturePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
            />
            <NotesFeatureClient />
        </>
    );
}