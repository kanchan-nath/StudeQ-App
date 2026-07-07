// app/page.jsx
import LandingPageClient from './LandingPageClient.jsx';
import { FAQS, COMPARISON } from './home-data.js';

export const metadata = {
  title: 'StudeQ — AI Powered Study Platform for Students',
  description: 'Turn any PDF, image, or notes into flashcards, quizzes, and summaries in seconds. Free AI study tools — notes, tutor, quiz maker, and live study rooms.',
  alternates: {
    canonical: 'https://studeq.onrender.com/',
  },
  openGraph: {
    type: 'website',
    siteName: 'StudeQ',
    title: 'StudeQ — AI Study Platform',
    description: 'Turn any PDF into flashcards, quizzes, and notes instantly. Free to start.',
    images: [{ url: 'https://studeq.onrender.com/og-image.jpg' }],
    url: 'https://studeq.onrender.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudeQ — AI Study Platform',
    description: 'Turn any PDF into flashcards, quizzes, and notes instantly.',
    images: ['https://studeq.onrender.com/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "StudeQ",
            "applicationCategory": "EducationApplication",
            "description": "AI-powered study platform with quizzes, flashcards, notes, AI tutor, and live study rooms.",
            "url": "https://studeq.onrender.com",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
            "featureList": "AI Notes, AI Tutor, Flashcards, Quiz Maker, Live Study Rooms, Scheduler"
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "StudeQ vs Other Study Apps",
            "itemListElement": COMPARISON.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.feature,
              "description": `StudeQ: ${item.studeq}. Other apps: ${item.other}`
            }))
          })
        }}
      />
      <LandingPageClient />
    </>
  );
}