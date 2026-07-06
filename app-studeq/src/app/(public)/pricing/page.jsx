import PricingClientPage from "./PricingClient.jsx";

// Metadata exported separately for App Router
export const metadata = {
    title: 'Pricing Plans — studeq | Free, Pro & Premium',
    description: 'Compare Free, Pro, and Premium plans for studeq. AI powered quizzes, flashcards, and tutor access from $0/month. Cancel anytime.',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://studeq.onrender.com/pricing',
    },
    openGraph: {
        title: 'studeq Pricing — Plans Starting at $0',
        description: 'AI study tools for every learner. Pick a plan that fits your goals.',
        url: 'https://studeq.onrender.com/pricing',
        type: 'website',
        images: [
            {
                url: 'https://studeq.onrender.com/og-pricing.svg',
                width: 1200,
                height: 630,
                alt: 'studeq Pricing Plans Comparison',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'studeq Pricing — Plans Starting at $0',
        description: 'AI-powered quizzes, flashcards, and tutor access. Free, Pro, and Premium plans.',
        images: ['https://studeq.onrender.com/og-pricing.svg'],
    },
};

export default function PricingPage() {
   return <PricingClientPage/>
}