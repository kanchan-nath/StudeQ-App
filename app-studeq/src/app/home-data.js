// app/home-data.js
import {
  FileText,
  Bot,
  Layers,
  FlaskConical,
  Users,
  Image,
  FileSearch,
  CalendarClock,
} from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────────────── */
export const NAV_FEATURES = [
  { to: "/features/note", Icon: FileText, label: "AI Notes", desc: "PDF to structured notes in seconds" },
  { to: "/features/notebook", Icon: Bot, label: "AI Tutor", desc: "Subject aware multi turn chat" },
  { to: "/features/flashcard", Icon: Layers, label: "Flashcards", desc: "SM-2 spaced repetition decks" },
  { to: "/features/quiz", Icon: FlaskConical, label: "AI Quiz", desc: "6 question types, instant feedback" },
  { to: "/features/study-room", Icon: Users, label: "Study Room", desc: "Live collaborative sessions" },
  { to: "/features/image-analysis", Icon: Image, label: "Image Analysis", desc: "Diagrams, handwriting, LaTeX" },
  { to: "/features/pdf-analysis", Icon: FileSearch, label: "PDF Analysis", desc: "Chat with any PDF document" },
  { to: "/features/scheduler", Icon: CalendarClock, label: "AI Scheduler", desc: "Study plan around your exams" },
];

export const BLOG_POSTS = [
  { to: "/blog/10-20-70-rule-of-ai", Icon: FileText, label: "10/20/70 Rule of AI?", desc: "What Is the 10/20/70 Rule of AI? A Practical Framework" },
  { to: "/blog/ai-quiz-for-teacher", Icon: Bot, label: "AI Quiz for Teachers", desc: "The Best Free Generators That Actually Work" },
  { to: "/blog/ai-quiz-generator", Icon: Layers, label: "AI Quiz Generator", desc: "Create Practice Tests from PDF & Text in Seconds" },
  { to: "/blog/ai-study-faster", Icon: FlaskConical, label: "How to Use AI to Study Faster", desc: "Can AI help with studying, or does it just make you feel productive while you learn less?" },
  { to: "/blog/best-ai-tools-for-teachers", Icon: Users, label: "Best AI Tools for Teachers", desc: "Best AI Tools for Teachers in 2026: Free & Paid Options" },
  { to: "/blog/how-to-memorize-10x-faster", Icon: Image, label: "How to Memorize Faster", desc: "How to Memorize Faster: 5 Science-Backed Techniques for Students" },
  { to: "/blog/quiz-from-notes", Icon: CalendarClock, label: "How to Generate a Quiz from Notes with AI ", desc: "Stop rereading your notes and hoping something sticks" },
    { to: "/blog/how-ai-is-changing-the-way-students-learn-in-2026", Icon: CalendarClock, label: "How AI Is Changing the Way Students Learn in 2026", desc: "Discover how AI transforms student learning in 2026 with personalized tutoring, instant feedback, and adaptive study tools. Real examples from 2024-2025." },
];

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Computer Science",
  "English",
  "Economics",
  "AI",
];

export const TABS = [
  {
    id: "1",
    label: "AI Notes",
    features: [
      "Paste text, upload PDF, or drop an image — structured notes in seconds.",
      "Key insights automatically extracted and highlighted.",
      "Pin, copy, or export any note directly as PDF.",
      "Smart summaries that cut 200 pages down to what actually matters.",
    ],
  },
  {
    id: "2",
    label: "AI Tutor",
    features: [
      "Subject aware tutor across Maths, Physics, Chemistry, Biology, and more.",
      "Full multi turn conversations — it remembers what you discussed.",
      "Ask follow-up questions, request re explanations, go deeper.",
      "LaTeX rendering for formulas and equations built in.",
    ],
  },
  {
    id: "3",
    label: "Study Tools",
    features: [
      "SM-2 Spaced Repetition flashcards — proven to make you remember.",
      "6 quiz types: MCQ, True/False, Fill-blank, Short Answer, Free Response, Passage.",
      "Generate quizzes from your own notes or any topic on demand.",
      "Live Study Rooms — study with friends in real time.",
    ],
  },
  {
    id: "4",
    label: "AI Flashcard",
    features: [
      "Generate flashcards from any topic, PDF, or pasted notes instantly.",
      "SM-2 spaced repetition schedules cards based on how well you know them.",
      "Flip, rate, and track mastery — card by card.",
      "Export decks or share with classmates in one click.",
    ],
  },
  {
    id: "5",
    label: "AI Quiz",
    features: [
      "6 question types: MCQ, True/False, Fill-in-the-blank, Short Answer, Free Response, Passage.",
      "Generate from your own notes, a topic name, or an uploaded PDF.",
      "Instant feedback with explanations after every answer.",
      "Track score history and weak areas across all quizzes.",
    ],
  },
  {
    id: "6",
    label: "Live Study Room",
    features: [
      "Create or join a room and study alongside others in real time.",
      "Shared focus timer with Pomodoro and custom session modes.",
      "See who is active, what they are studying, and stay accountable.",
      "Room chat for quick questions without breaking focus.",
    ],
  },
  {
    id: "7",
    label: "Real Time Chat",
    features: [
      "Instant messaging with classmates or study group members.",
      "Share notes, flashcard decks, and quiz links directly in chat.",
      "Threaded replies keep discussions organized by topic.",
      "Persistent history — revisit what was discussed any time.",
    ],
  },
  {
    id: "8",
    label: "Doubt Solving",
    features: [
      "Snap a photo of any question — handwritten or printed and get a step by step solution.",
      "Subject aware explanations adapt to your level, not just the answer.",
      "Ask follow ups until the concept actually clicks.",
      "All solved doubts saved to your history for revision later.",
    ],
  },
];

export const COMPARISON = [
  {
    feature: "Input types",
    studeq: "PDFs, images, typed text, pasted notes — any format you have",
    other: "Text input only",
  },
  {
    feature: "AI Tutor",
    studeq: "Subject aware multi turn tutor that remembers your session",
    other: "Generic chatbot, no subject context",
  },
  {
    feature: "Quiz types",
    studeq:
      "6 types: MCQ, True/False, Fill-blank, Short Answer, Free Response, Passage",
    other: "Basic MCQ only",
  },
  {
    feature: "Image analysis",
    studeq:
      "Upload diagrams, charts, handwritten pages — full AI explanation with LaTeX",
    other: "Cannot process images",
  },
  {
    feature: "Collaboration",
    studeq: "Live Study Rooms — create and join sessions in real time",
    other: "Solo only",
  },
  {
    feature: "Scheduler",
    studeq: "AI generated study plan built around your exams and goals",
    other: "No scheduling at all",
  },
];

export const STEPS = [
  {
    num: "01",
    pill: "Sign Up",
    title: "Create your account",
    desc: "Free in seconds. No credit card, no setup. Start studying the moment you land.",
  },
  {
    num: "02",
    pill: "Upload",
    title: "Add your study material",
    desc: "Upload a PDF, paste notes, drop an image, or type a topic. StudeQ handles every format.",
  },
  {
    num: "03",
    pill: "Generate",
    title: "AI creates your study tools",
    desc: "Get smart summaries, SM-2 flashcards, and targeted quizzes from your content instantly.",
  },
  {
    num: "04",
    pill: "Study",
    title: "Use the AI Tutor or Study Room",
    desc: "Ask your subject aware AI Tutor anything. Or join a live Study Room and learn with friends.",
  },
  {
    num: "05",
    pill: "Track",
    title: "See progress and weak spots",
    desc: "Analytics show exactly what you know and what needs work. Scheduler builds a plan around your exam dates.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "IIT Delhi · Physics",
    quote:
      "StudeQ turned my 200 page module into flashcards in seconds. My quiz scores went from 60% to 88% in two weeks.",
    highlight: "flashcards in seconds",
  },
  {
    name: "Marcus O.",
    role: "Yale Law",
    quote:
      "The AI Tutor actually remembers what we discussed. It felt like a real study session, not a chatbot.",
    highlight: "actually remembers",
  },
  {
    name: "Sarah K.",
    role: "Stanford · Organic Chemistry",
    quote:
      "I have ADHD. Study Rooms with friends keep me accountable. StudeQ is the first tool that actually worked for me.",
    highlight: "actually worked for me",
  },
  {
    name: "Elena R.",
    role: "MIT · Education PhD",
    quote:
      "I upload lecture slides and StudeQ gives me passage based questions. Nothing else comes close.",
    highlight: "passage based questions",
  },
  {
    name: "Jason A.",
    role: "McKinsey Consultant",
    quote:
      "I use it to summarise long reports before client calls. The PDF analysis is shockingly accurate.",
    highlight: "PDF analysis",
  },
  {
    name: "Aditi M.",
    role: "NEET Aspirant",
    quote:
      "The image analysis understood my handwritten notes and explained every step. I stopped losing marks on Biology diagrams.",
    highlight: "image analysis",
  },
];

export const FAQS = [
  {
    q: "What is StudeQ?",
    a: "StudeQ is an AI powered study platform. Upload any material and instantly get smart notes, flashcards, quizzes, and access to a personal AI Tutor that knows your subject.",
  },
  {
    q: "Is StudeQ free?",
    a: "Yes — StudeQ has a generous free tier including note generation, flashcards, and quizzes. Upgrade for unlimited access and advanced features.",
  },
  {
    q: "What file types can I upload?",
    a: "PDFs, images (JPG/PNG), and plain text. You can also paste content directly or type a topic — StudeQ works with whatever you have.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "Select a subject, type your question, and have a full conversation. The tutor remembers your session history so follow ups are natural and contextual.",
  },
  {
    q: "What quiz types does StudeQ support?",
    a: "Multiple Choice, True/False, Fill in the blank, Short Answer, Free Response, and Multi Layered Passage questions — six types built for real exams.",
  },
  {
    q: "What are Study Rooms?",
    a: "Live collaborative spaces where you and friends can study together, share notes, and chat in real time — like a virtual library group session.",
  },
  {
    q: "How does Image Analysis work?",
    a: "Upload any image — a diagram, chart, or handwritten notes — and StudeQ explains it with full LaTeX support for mathematical formulas.",
  },
  {
    q: "Does the Scheduler use AI?",
    a: "Yes. Tell StudeQ your subjects, available hours, and goal date — it builds a personalised study plan that adjusts around your life.",
  },
];

export const TICKER_MESSAGES = [
  " Early access, shape the product with us",
  " Built for students, by a student",
  "New: AI powered notes & quizzes live now",
  " Feedback? We read every message",
];

export const MARQUEE_LOGOS = [
  "Exam Prep",
  "Lecture Notes",
  "Concept Summaries",
  "Practice Quizzes",
  "Doubt Solving",
  "Revision Cards",
  "One to One AI Tutor",
];