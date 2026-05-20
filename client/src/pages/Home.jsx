/*
  LandingPage.jsx
  ===============
  FUSION DECISIONS:
  - Hero:         turbo.ai dark starfield + announcement badge + split hero with drop zone
                  → fastest value communication for Spark.E's content
  - Comparison:   penseum.com two-column card w/ dot lists (green ✓ / red ✗)
                  → adapted to dark bg, strongest visual contrast
  - Timeline:     penseum.com large numbered steps with pill labels
                  → adapted to light section bg for contrast break
  - Testimonials: turbo.ai 3×2 grid of dark cards with institution header
  - Footer:       penseum.com giant wordmark fused with turbo.ai link columns
  - Unique elem:  Live activity ticker + Subject chips in hero (signals tutor feature)
*/

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles/Home.module.css'

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'History', 'Computer Science',
  'English', 'Economics',
]

const TABS = [
  {
    id: 'notes',
    label: 'AI Notes',
    features: [
      'Paste text, upload PDF, or drop an image — structured notes in seconds.',
      'Key insights automatically extracted and highlighted.',
      'Pin, copy, or export any note directly as PDF.',
      'Smart summaries that cut 200 pages down to what actually matters.',
    ],
  },
  {
    id: 'tutor',
    label: 'AI Tutor',
    features: [
      'Subject-aware tutor across Maths, Physics, Chemistry, Biology, and more.',
      'Full multi-turn conversations — it remembers what you discussed.',
      'Ask follow-up questions, request re-explanations, go deeper.',
      'LaTeX rendering for formulas and equations built in.',
    ],
  },
  {
    id: 'tools',
    label: 'Study Tools',
    features: [
      'SM-2 Spaced Repetition flashcards — proven to make you remember.',
      '6 quiz types: MCQ, True/False, Fill-blank, Short Answer, Free Response, Passage.',
      'Generate quizzes from your own notes or any topic on demand.',
      'Live Study Rooms — study with friends in real-time.',
    ],
  },
]

const COMPARISON = [
  {
    feature: 'Input types',
    sparke: 'PDFs, images, typed text, pasted notes — any format you have',
    other: 'Text input only',
  },
  {
    feature: 'AI Tutor',
    sparke: 'Subject-aware multi-turn tutor that remembers your session',
    other: 'Generic chatbot, no subject context',
  },
  {
    feature: 'Quiz types',
    sparke: '6 types: MCQ, True/False, Fill-blank, Short Answer, Free Response, Passage',
    other: 'Basic MCQ only',
  },
  {
    feature: 'Image analysis',
    sparke: 'Upload diagrams, charts, handwritten pages — full AI explanation with LaTeX',
    other: 'Cannot process images',
  },
  {
    feature: 'Collaboration',
    sparke: 'Live Study Rooms — create and join sessions in real time',
    other: 'Solo only',
  },
  {
    feature: 'Scheduler',
    sparke: 'AI-generated study plan built around your exams and goals',
    other: 'No scheduling at all',
  },
]

const STEPS = [
  {
    num: '01',
    pill: 'Sign Up',
    title: 'Create your account',
    desc: 'Free in seconds. No credit card, no setup. Start studying the moment you land.',
  },
  {
    num: '02',
    pill: 'Upload',
    title: 'Add your study material',
    desc: 'Upload a PDF, paste notes, drop an image, or type a topic. Spark.E handles every format.',
  },
  {
    num: '03',
    pill: 'Generate',
    title: 'AI creates your study tools',
    desc: 'Get smart summaries, SM-2 flashcards, and targeted quizzes from your content instantly.',
  },
  {
    num: '04',
    pill: 'Study',
    title: 'Use the AI Tutor or Study Room',
    desc: 'Ask your subject-aware AI Tutor anything. Or join a live Study Room and learn with friends.',
  },
  {
    num: '05',
    pill: 'Track',
    title: 'See progress and weak spots',
    desc: 'Analytics show exactly what you know and what needs work. Scheduler builds a plan around your exam dates.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'IIT Delhi · Physics',
    quote: 'Spark.E turned my 200-page module into flashcards in seconds. My quiz scores went from 60% to 88% in two weeks.',
    highlight: 'flashcards in seconds',
  },
  {
    name: 'Marcus O.',
    role: 'Yale Law',
    quote: 'The AI Tutor actually remembers what we discussed. It felt like a real study session, not a chatbot.',
    highlight: 'actually remembers',
  },
  {
    name: 'Sarah K.',
    role: 'Stanford · Organic Chemistry',
    quote: 'I have ADHD. Study Rooms with friends keep me accountable. Spark.E is the first tool that actually worked for me.',
    highlight: 'actually worked for me',
  },
  {
    name: 'Elena R.',
    role: 'MIT · Education PhD',
    quote: 'I upload lecture slides and Spark.E gives me passage-based questions. Nothing else comes close.',
    highlight: 'passage-based questions',
  },
  {
    name: 'Jason A.',
    role: 'McKinsey Consultant',
    quote: 'I use it to summarise long reports before client calls. The PDF analysis is shockingly accurate.',
    highlight: 'PDF analysis',
  },
  {
    name: 'Aditi M.',
    role: 'NEET Aspirant',
    quote: 'The image analysis understood my handwritten notes and explained every step. I stopped losing marks on Biology diagrams.',
    highlight: 'image analysis',
  },
]

const FAQS = [
  {
    q: 'What is Spark.E?',
    a: 'Spark.E is an AI-powered study platform. Upload any material and instantly get smart notes, flashcards, quizzes, and access to a personal AI Tutor that knows your subject.',
  },
  {
    q: 'Is Spark.E free?',
    a: "Yes — Spark.E has a generous free tier including note generation, flashcards, and quizzes. Upgrade for unlimited access and advanced features.",
  },
  {
    q: 'What file types can I upload?',
    a: 'PDFs, images (JPG/PNG), and plain text. You can also paste content directly or type a topic — Spark.E works with whatever you have.',
  },
  {
    q: 'How does the AI Tutor work?',
    a: 'Select a subject, type your question, and have a full conversation. The tutor remembers your session history so follow-ups are natural and contextual.',
  },
  {
    q: 'What quiz types does Spark.E support?',
    a: 'Multiple Choice, True/False, Fill-in-the-blank, Short Answer, Free Response, and Multi-Layered Passage questions — six types built for real exams.',
  },
  {
    q: 'What are Study Rooms?',
    a: 'Live collaborative spaces where you and friends can study together, share notes, and chat in real-time — like a virtual library group session.',
  },
  {
    q: 'How does Image Analysis work?',
    a: 'Upload any image — a diagram, chart, or handwritten notes — and Spark.E explains it with full LaTeX support for mathematical formulas.',
  },
  {
    q: 'Does the Scheduler use AI?',
    a: "Yes. Tell Spark.E your subjects, available hours, and goal date — it builds a personalised study plan that adjusts around your life.",
  },
]

const TICKER_MESSAGES = [
  '247 students studying right now',
  '12,400+ notes generated today',
  'Used across 40+ countries',
  'New: Image Analysis now live ⚡',
]

const MARQUEE_LOGOS = [
  'Harvard', 'MIT', 'Yale', 'Stanford', 'Google', 'McKinsey',
  'Goldman Sachs', 'Deloitte', 'Duke', 'Northwestern', 'UT Austin', 'IIT Delhi',
]

/* ─── HOOKS ─────────────────────────────────────────────────────────────── */

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return scrolled
}

function useReveal(ref, rootMargin = '0px 0px -60px 0px') {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, rootMargin])
  return visible
}



function useCountUp(target, visible, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, target, duration])
  return val
}

/* ─── STAR FIELD ────────────────────────────────────────────────────────── */
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => {
    const rand = Math.random()
    const size = rand < 0.6 ? 1 : rand < 0.9 ? 2 : 3
    return {
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      dur: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 4}s`,
      size: `${size}px`,
    }
  })
  return (
    <div className={styles.stars} aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className={styles.star}
          style={{ top: s.top, left: s.left, '--dur': s.dur, '--delay': s.delay, '--size': s.size }}
        />
      ))}
    </div>
  )
}

/* ─── LIVE TICKER ───────────────────────────────────────────────────────── */
function LiveTicker() {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % TICKER_MESSAGES.length)
        setFade(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className={styles.ticker} style={{ opacity: fade ? 1 : 0 }}>
      <div className={styles.tickerDot} />
      <span>🟢 {TICKER_MESSAGES[idx]}</span>
    </div>
  )
}

/* ─── STATS BAR ─────────────────────────────────────────────────────────── */
function StatsBar() {
  const ref = useRef(null)
  const visible = useReveal(ref)
  const students = useCountUp(10000, visible)
  const accuracy = useCountUp(99, visible)
  const seconds = useCountUp(30, visible)
  return (
    <div className={styles.statsBar} ref={ref}>
      <div className={styles.statItem}>
        <div className={styles.statNum}>{students.toLocaleString()}+</div>
        <div className={styles.statLabel}>Active Students</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statNum}>{accuracy}%</div>
        <div className={styles.statLabel}>Accuracy Rate</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statNum}>{seconds}s</div>
        <div className={styles.statLabel}>Average Processing Time</div>
      </div>
    </div>
  )
}

/* ─── SPARK METER ───────────────────────────────────────────────────────── */
function SparkMeter() {
  const [count, setCount] = useState(10247)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3 + 1))
    }, 2800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className={styles.sparkMeter}>
      <span>⚡</span>
      <span>{count.toLocaleString()} notes generated today</span>
    </div>
  )
}

/* ─── REVEAL WRAPPER ────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const visible = useReveal(ref)
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealed : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */
const LandingPage = () => {
  const scrolled = useScrolled()
  const [activeTab, setActiveTab] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  // timeline ref
  // const timelineRef = useRef(null)
  // const timelineVisible = useReveal(timelineRef, '0px 0px -100px 0px')


  const wrapRef = useRef(null)
  const lineRef = useRef(null)
  const itemRefs = useRef([])
  
  useEffect(() => {
    const wrap = wrapRef.current
    const line = lineRef.current
    const items = itemRefs.current

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      const pct = Math.min(100, Math.max(0, (scrolled / rect.height) * 100))
      line.style.height = pct + '%'

      items.forEach(item => {
        const lineH = (pct / 100) * wrap.offsetHeight
        if (lineH >= item.offsetTop + 20) {
          item.classList.add(styles.timelineItemVisible)
        }
      })
    }

    window.addEventListener('scroll', onScroll)
    onScroll() // run once on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.page}>
      <StarField />
      <LiveTicker />

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`} aria-label="Main navigation">
        <div className={styles.navInner}>
          <div className={styles.navPill}>
            <Link to="/" className={styles.navLogo}>
              SPARK<span>.E</span>
            </Link>
            <ul className={styles.navLinks} role="list">
              <li><a href="#" className={styles.navLink}>Blog</a></li>
              <li><a href="#" className={styles.navLink}>Careers</a></li>
            </ul>
          </div>
          <Link to="/register" className={styles.navCta}>Start now</Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.beam1} aria-hidden="true" />
        <div className={styles.beam2} aria-hidden="true" />
        <div className={styles.beam3} aria-hidden="true" />
        <div className={styles.beam4} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>⚡ Now with Image Analysis &amp; Live Study Rooms</span>
            <span className={styles.heroBadgeArrow}>→</span>
          </div>

          <h1 className={styles.heroH1}>
            Turn anything into notes,<br />flashcards, quizzes, and more.
          </h1>

          <p className={styles.heroSub}>
            Your AI-powered study companion. Learn smarter, not harder.
          </p>

          <div className={styles.heroSubjectRow}>
            {SUBJECTS.map(s => (
              <Link to="/register" key={s} className={styles.subjectChip}>{s}</Link>
            ))}
          </div>

          <div className={styles.heroActions}>
            <Link to="/register" className={styles.heroCta}>
              Get Started — It's Free
            </Link>
          </div>

          <div className={styles.dropZone} role="button" tabIndex={0} aria-label="Upload study material">
            <span className={styles.dropIcon}>📄</span>
            <p className={styles.dropText}>Drop a PDF, image, or paste your notes</p>
            <p className={styles.dropSub}>PDF · PNG · JPG · Typed text — any format</p>
          </div>
        </div>

        <SparkMeter />
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <section className={styles.marqueeSection} aria-label="Trusted by students at">
        <p className={styles.marqueeLabel}>Used by 10,000+ students across 12+ subjects at</p>
        <div className={styles.marqueeTrack} aria-hidden="true">
          <ul className={styles.marqueeList} role="list">
            {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((name, i) => (
              <li key={i} className={styles.marqueeItem}>{name}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FEATURE TABS ────────────────────────────────────────── */}
      <section className={styles.section} id="features">
        <div className={styles.sectionInner}>
          <Reveal>
            <div className={styles.centered}>
              <span className={styles.sectionBadge}>Features</span>
              <h2 className={styles.sectionH2}>Everything you need to actually remember what you studied</h2>
              <p className={styles.sectionSub}>
                From raw material to exam-ready — Spark.E handles every step of the study journey.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className={styles.tabsWrap}>
              <ul className={styles.tabNav} role="tablist">
                {TABS.map((tab, i) => (
                  <li key={tab.id} role="presentation">
                    <button
                      role="tab"
                      aria-selected={activeTab === i}
                      className={`${styles.tabBtn} ${activeTab === i ? styles.tabBtnActive : ''}`}
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.tabPanelContainer}>
                {TABS.map((tab, i) => (
                  <div
                    key={tab.id}
                    role="tabpanel"
                    className={`${styles.tabPanel} ${activeTab === i ? styles.tabPanelActive : ''}`}
                    hidden={activeTab !== i}
                  >
                    <ul className={styles.tabFeatureList}>
                      {tab.features.map((f, j) => (
                        <li key={j} className={styles.tabFeatureItem}>
                          <span className={styles.tabCheckIcon}>✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DEVICES MOCKUP ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <Reveal>
            <div className={styles.centered}>
              <span className={styles.sectionBadge}>Cross-platform</span>
              <h2 className={styles.sectionH2}>Study anywhere. Pick up where you left off.</h2>
              <p className={styles.sectionSub}>
                Spark.E works seamlessly on web and mobile. Your notes, flashcards, and chat history sync instantly.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className={styles.devicesWrap}>
              <div className={styles.deviceLaptop}>
                <div className={styles.laptopScreen}>
                  <div className={styles.laptopScreenGlow} aria-hidden="true" />
                  <div className={styles.laptopScreenContent}>
                    <div className={styles.mockNoteTitle}>⚡ SPARK.E</div>
                    <div className={styles.mockNoteTitle} style={{ fontSize: 11, opacity: 0.7, fontFamily: 'inherit', fontWeight: 500 }}>
                      Cellular Biology — Summary
                    </div>
                    {[100, 85, 92, 70, 80, 65].map((w, i) => (
                      <div
                        key={i}
                        className={`${styles.mockNoteLine} ${i % 3 === 2 ? styles.mockNoteLineShort : ''}`}
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.laptopBase} />
                <div className={styles.laptopFoot} />
              </div>

              <div className={styles.devicePhone}>
                <div className={styles.phoneFrame}>
                  <div className={styles.phoneNotch} />
                  {[90, 75, 85, 60, 70, 80, 55].map((w, i) => (
                    <div key={i} className={styles.phoneLine} style={{ width: `${w}%` }} />
                  ))}
                  <div className={styles.phoneSyncBadge}>Synced ✓</div>
                </div>
              </div>
            </div>
            <p className={styles.devicesCaption}>
              Web · iOS · Android — always in sync
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── COMPARISON ──────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.comparisonSection}`} id="why">
        <div className={styles.sectionInner}>
          <Reveal>
            <div className={styles.centered}>
              <span className={styles.sectionBadge}>Why Spark.E</span>
              <h2 className={styles.sectionH2}>Why Spark.E hits different</h2>
              <p className={styles.sectionSub}>
                Not all study tools are equal. Here's what sets Spark.E apart from everything else.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className={styles.comparisonGrid}>
              {/* Left — Spark.E */}
              <div className={`${styles.compCol} ${styles.compColLeft}`}>
                <div className={styles.compHeader}>
                  <span className={styles.compLogo}>SPARK<span className={styles.compLogoAccent}>.E</span></span>
                </div>
                <ul className={styles.compList}>
                  {COMPARISON.map((row, i) => (
                    <li key={i} className={styles.compItem}>
                      <div className={styles.compDotGreen} />
                      <div>
                        <span className={styles.compFeatureLabel}>{row.feature}</span>
                        <span className={styles.compTextGood}>{row.sparke}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — Others */}
              <div className={styles.compCol}>
                <div className={styles.compHeader}>
                  <span className={styles.compLogoMuted}>Other Study Apps</span>
                </div>
                <ul className={styles.compList}>
                  {COMPARISON.map((row, i) => (
                    <li key={i} className={styles.compItem}>
                      <div className={styles.compDotRed} />
                      <div>
                        <span className={styles.compFeatureLabel}>{row.feature}</span>
                        <span className={styles.compTextBad}>{row.other}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TIMELINE ────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.timelineSection}`} id="how-it-works">
        <div className={styles.sectionInner}>
          <div className={styles.centered}>
            <span className={styles.timelineBadge}>Process</span>
            <h2 className={styles.timelineH2}>Four steps from confused to confident</h2>
            <p className={styles.timelineSub}>No setup. No learning curve. Just study.</p>
          </div>

          <div className={styles.timelineWrap} ref={wrapRef}>
            <div className={styles.timelineLine} ref={lineRef} aria-hidden="true" />
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={el => itemRefs.current[i] = el}
                className={styles.timelineItem}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={styles.timelineLeft}>
                  <div className={styles.timelineNum}>{step.num}</div>
                </div>
                <div className={styles.timelineRight}>
                  <span className={styles.timelinePill}>{step.pill}</span>
                  <h3 className={styles.timelineTitle}>{step.title}</h3>
                  <p className={styles.timelineDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <StatsBar />

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className={styles.section} id="testimonials">
        <div className={styles.sectionInner}>
          <Reveal>
            <div className={styles.centered}>
              <span className={styles.sectionBadge}>Students</span>
              <h2 className={styles.sectionH2}>Loved by students everywhere</h2>
              <p className={styles.sectionSub}>
                Real results from real students. Not marketing copy.
              </p>
            </div>
          </Reveal>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={styles.testimonialCard}>
                  <div className={styles.testimonialHeader}>
                    <div>
                      <div className={styles.testimonialName}>{t.name}</div>
                      <div className={styles.testimonialRole}>{t.role}</div>
                    </div>
                  </div>
                  <p className={styles.testimonialQuote}>
                    "{t.quote.split(t.highlight).map((part, j, arr) => (
                      <React.Fragment key={j}>
                        {part}
                        {j < arr.length - 1 && (
                          <span className={styles.testimonialHighlight}>{t.highlight}</span>
                        )}
                      </React.Fragment>
                    ))}"
                  </p>
                  <div className={styles.testimonialAttrib}>— {t.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className={styles.section} id="faq">
        <div className={styles.sectionInner}>
          <Reveal>
            <div className={styles.centered}>
              <span className={styles.sectionBadge}>FAQ</span>
              <h2 className={styles.sectionH2}>Everything you need to know</h2>
            </div>
          </Reveal>

          <div className={styles.faqList}>
            {FAQS.map((item, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className={styles.faqItem}>
                  <button
                    className={styles.faqQ}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <span className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ''}`}>+</span>
                  </button>
                  <div className={`${styles.faqAnswer} ${openFaq === i ? styles.faqAnswerOpen : ''}`}>
                    <p className={styles.faqAnswerText}>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerBeam} aria-hidden="true" />
        <Reveal>
          <h2 className={styles.ctaBannerH2}>Your exams won't wait. Neither should you.</h2>
          <p className={styles.ctaBannerSub}>Join 10,000+ students studying smarter with Spark.E.</p>
          <Link to="/register" className={styles.ctaBannerBtn}>
            Get Started — It's Free
          </Link>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogoBlock}>
            <Link to="/" className={styles.footerLogo}>
              SPARK<span>.E</span>
            </Link>
            <p className={styles.footerTagline}>Your AI-powered study companion.</p>
            <p className={styles.footerCopyright}>© 2026 Spark.E Inc.</p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.socialBtn} aria-label="X / Twitter">𝕏</a>
              <a href="#" className={styles.socialBtn} aria-label="LinkedIn">in</a>
              <a href="#" className={styles.socialBtn} aria-label="Instagram">◎</a>
              <a href="#" className={styles.socialBtn} aria-label="Discord">⊕</a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerLinkCol}>
              <span className={styles.footerLinkHeading}>Product</span>
              <a href="#" className={styles.footerLink}>AI Notes</a>
              <a href="#" className={styles.footerLink}>AI Tutor</a>
              <a href="#" className={styles.footerLink}>Quiz Maker</a>
              <a href="#" className={styles.footerLink}>Flashcards</a>
              <a href="#" className={styles.footerLink}>Study Rooms</a>
              <a href="#" className={styles.footerLink}>Scheduler</a>
            </div>
            <div className={styles.footerLinkCol}>
              <span className={styles.footerLinkHeading}>Use Cases</span>
              <a href="#" className={styles.footerLink}>Mathematics</a>
              <a href="#" className={styles.footerLink}>Physics</a>
              <a href="#" className={styles.footerLink}>Chemistry</a>
              <a href="#" className={styles.footerLink}>Biology</a>
              <a href="#" className={styles.footerLink}>Computer Science</a>
              <a href="#" className={styles.footerLink}>History</a>
            </div>
            <div className={styles.footerLinkCol}>
              <span className={styles.footerLinkHeading}>Company</span>
              <a href="#" className={styles.footerLink}>About</a>
              <a href="#" className={styles.footerLink}>Blog</a>
              <a href="#" className={styles.footerLink}>Careers</a>
              <a href="#" className={styles.footerLink}>Terms of Use</a>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
            </div>
            <div className={styles.footerLinkCol}>
              <span className={styles.footerLinkHeading}>Contact</span>
              <a href="mailto:hello@sparke.ai" className={styles.footerLink}>hello@sparke.ai</a>
              <a href="#" className={styles.footerLink}>Discord Community</a>
            </div>
          </div>
        </div>

        <div className={styles.footerWordmark} aria-hidden="true">
          <span className={styles.footerWordmarkText}>SPARK.E</span>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerBottomText}>© 2026 Spark.E Inc. — Learn smarter, not harder.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage