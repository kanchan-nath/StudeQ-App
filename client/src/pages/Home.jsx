import React from 'react'
import { Link } from "react-router-dom";

const features = [
  { icon: "🧠", title: "AI Notes", desc: "Auto-generate smart notes from any content" },
  { icon: "🤖", title: "AI Tutor", desc: "Ask anything, get instant explanations" },
  { icon: "📝", title: "Quiz Maker", desc: "Auto-generate quizzes from your material" },
  { icon: "🃏", title: "Flashcards", desc: "Spaced repetition flashcards powered by SM-2" },
  { icon: "👥", title: "Study Rooms", desc: "Collaborate with friends in real-time" },
  { icon: "📊", title: "Analytics", desc: "Track progress and weak spots over time" },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds" },
  { num: "02", title: "Study", desc: "Upload notes, chat with AI, generate quizzes" },
  { num: "03", title: "Track Progress", desc: "See what you know and what needs work" },
];

const Home = () => {
  return (
    <div>

      <section>
        <div>
          <span>⚡</span>
          <h1>Spark.E</h1>
        </div>
        <p>Your AI-powered study companion. Learn smarter, not harder.</p>
        <Link to="/register">
          <button>Get Started — It's Free</button>
        </Link>
      </section>

      <section>
        <h2>Everything you need to ace your studies</h2>
        <p>Six powerful tools, one platform.</p>
        <div>
          {features.map((f) => (
            <div key={f.title}>
              <span>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>How it works</h2>
        <div>
          {steps.map((s, i) => (
            <div key={s.num}>
              <span>{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <span>→</span>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Ready to study smarter?</h2>
        <p>Join thousands of students already using Spark.E.</p>
        <Link to="/register">
          <button>Start Learning Free</button>
        </Link>
      </section>
    </div>
  )
}

export default Home
