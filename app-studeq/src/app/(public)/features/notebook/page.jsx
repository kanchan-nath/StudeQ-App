import NotebookFeatureClient from "./NotebookFeatureClient.jsx";

// Metadata for App Router
export const metadata = {
    title: 'AI Notebook — Chat With Your Documents | StudeQ',
    description: 'Upload PDFs, research papers, or notes and have AI-powered conversations grounded in your sources. StudeQ Notebook cites every answer back to your documents.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://studeq.onrender.com/features/notebook',
    },
    openGraph: {
        title: 'AI Notebook — Chat With Your Documents | StudeQ',
        description: 'Upload your documents and discuss them with AI. Every answer is grounded in your sources with exact citations. No hallucinations.',
        url: 'https://studeq.onrender.com/features/notebook',
        type: 'website',
        images: [
            {
                url: 'https://studeq.onrender.com/og-notebook.svg',
                width: 1200,
                height: 630,
                alt: 'StudeQ AI Notebook - Chat With Your Documents',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Notebook — Chat With Your Documents | StudeQ',
        description: 'Upload your documents and discuss them with AI. Every answer is grounded in your sources with exact citations.',
        images: ['https://studeq.onrender.com/og-notebook.svg'],
    },
};

// JSON-LD Schema (moved to server)
const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StudeQ AI Notebook',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
        'AI-powered notebook that lets you upload documents and have grounded, cited conversations about your sources — like NotebookLM but built for students.',
    featureList: [
        'Upload PDFs and documents',
        'AI chat grounded in uploaded sources',
        'Multi-document comparison and synthesis',
        'Auto-citation generation APA MLA Chicago',
        'Concept explanation from source material',
        'Export conversations and notes',
        'Collaborative shared notebooks',
    ],
    url: 'https://studeq.onrender.com/features/notebook',
    screenshot: 'https://studeq.onrender.com/og-notebook.svg',
};

export default function NotebookFeaturePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
            />
            <NotebookFeatureClient />
        </>
    );
}