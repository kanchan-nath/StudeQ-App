import React, { useState, useEffect, useRef, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import BASE_URL from "../lib/api.js"
import styles from "./styles/Quiz.module.css"

// ─── PHASE CONSTANTS ───────────────────────────────────────────────
const PHASE = {
  HOME: "home",
  STEP1: "step1",
  STEP2A: "step2a",      // file upload
  STEP2B: "step2b",      // text input
  STEP3: "step3",        // question types
  LOADING: "loading",
  QUIZ: "quiz",
  RESULTS: "results",
  HISTORY: "history",
}

// ─── QUESTION TYPE CONFIG ─────────────────────────────────────────
const QTYPES = [
  { id: "multiple-choice", name: "Multiple Choice", desc: "Select the correct answer from options", icon: "📋", bg: "#dcfce7" },
  { id: "true-false", name: "True / False", desc: "Determine if a statement is true or false", icon: "☑️", bg: "#ede9fe" },
  { id: "fill-blank", name: "Fill in the Blank", desc: "Complete the sentence with the missing word", icon: "[ ]", bg: "#cffafe" },
  { id: "short-answer", name: "Short Answer", desc: "Provide a brief written response", icon: "📝", bg: "#dbeafe" },
  { id: "free-response", name: "Free Response", desc: "Write a detailed answer in your own words", icon: "📄", bg: "#fce7f3" },
  { id: "passage", name: "Multi-Layered Passage", desc: "Passage-based questions with 3 progressive layers", icon: "📚", bg: "#ede9fe" },
]

const LOADER_STATUSES = [
  "Reading your content…",
  "Identifying key concepts…",
  "Crafting questions…",
  "Finalizing your quiz…",
]

export default function Quiz() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // ─── GLOBAL STATE ──────────────────────────────────────────────
  const [phase, setPhase] = useState(PHASE.HOME)
  const [method, setMethod] = useState(null)          // "materials" | "text"

  // Step 2A
  const [file, setFile] = useState(null)

  // Step 2B
  const [quizTitle, setQuizTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [audience, setAudience] = useState("Student")

  // Step 3
  const [typeCounts, setTypeCounts] = useState(
    Object.fromEntries(QTYPES.map(q => [q.id, 0]))
  )

  // Quiz taking
  const [quizData, setQuizData] = useState(null)    // full quiz doc from API
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])      // user's answers array

  // Results
  const [allQuizzes, setAllQuizzes] = useState([])

  // UI
  const [loading, setLoading] = useState(false)
  const [loaderStatus, setLoaderStatus] = useState(LOADER_STATUSES[0])
  const [elapsedSec, setElapsedSec] = useState(0)
  const [error, setError] = useState("")
  const [dragover, setDragover] = useState(false)
  const [reviewFilter, setReviewFilter] = useState("all")

  const timerRef = useRef(null)
  const loaderRef = useRef(null)
  const token = localStorage.getItem("token")

  // ─── FETCH ALL QUIZZES (history) ────────────────────────────────
  const fetchAllQuizzes = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      console.log(data);

      if (data.data) setAllQuizzes(data.data)
    } catch (e) {
      console.error("fetchAllQuizzes:", e)
    }
  }, [token])

  useEffect(() => {
    fetchAllQuizzes()
  }, [fetchAllQuizzes])

  // ─── TIMER (quiz screen) ─────────────────────────────────────────
  useEffect(() => {
    if (phase === PHASE.QUIZ) {
      timerRef.current = setInterval(() => setElapsedSec(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
      if (phase !== PHASE.RESULTS) setElapsedSec(0)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  // ─── LOADER STATUS CYCLING ────────────────────────────────────────
  useEffect(() => {
    if (phase === PHASE.LOADING) {
      let i = 0
      loaderRef.current = setInterval(() => {
        i = (i + 1) % LOADER_STATUSES.length
        setLoaderStatus(LOADER_STATUSES[i])
      }, 2500)
    } else {
      clearInterval(loaderRef.current)
    }
    return () => clearInterval(loaderRef.current)
  }, [phase])

  // ─── HELPERS ────────────────────────────────────────────────────
  const fmtTime = (sec) => {
    const m = Math.floor(sec / 60), s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const totalQuestions = Object.values(typeCounts).reduce((a, b) => a + b, 0)

  // ─── FILE HANDLING ───────────────────────────────────────────────
  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const f = e.dataTransfer?.files?.[0] || e.target.files?.[0]
    if (f) setFile(f)
  }

  // ─── GENERATE QUIZ (calls backend) ──────────────────────────────
  const generateQuiz = async () => {
    setPhase(PHASE.LOADING)
    setError("")

    try {
      let res

      if (method === "materials" && file) {
        // ── FILE UPLOAD PATH ──────────────────────────────────────
        // POST /api/quiz/generate-from-file
        // Multipart FormData with: file, types (JSON string), total (number)
        const fd = new FormData()
        const selectedTypes = QTYPES
          .filter(q => typeCounts[q.id] > 0)
          .map(q => ({ type: q.id, count: typeCounts[q.id] }))

        fd.append("file", file)
        fd.append("types", JSON.stringify(selectedTypes))
        fd.append("total", totalQuestions)

        res = await fetch(`${BASE_URL}/api/quiz/generate/file`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        })
      } else {
        // ── TEXT INPUT PATH ───────────────────────────────────────
        // POST /api/quiz/generate
        // JSON body with topic, subject, title, types, difficulty, audience
        const selectedTypes = QTYPES
          .filter(q => typeCounts[q.id] > 0)
          .map(q => ({ type: q.id, count: typeCounts[q.id] }))

        res = await fetch(`${BASE_URL}/api/quiz/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ topic, subject, title: quizTitle, types: selectedTypes, difficulty, audience }),
        })
      }

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      // data.data is the full Quiz mongoose doc: { _id, quiz:{title,totalQuestion,meta}, questions:[] }
      startQuiz(data.data)
      fetchAllQuizzes() // refresh history

    } catch (e) {
      console.error(e)
      setError("Generation failed. Check your connection or API.")
      setPhase(PHASE.STEP3)
    }
  }

  // ─── START QUIZ ──────────────────────────────────────────────────
  const startQuiz = (doc) => {
    setQuizData(doc)
    setCurrentQ(0)
    setAnswers(new Array(doc.questions.length).fill(null))
    setPhase(PHASE.QUIZ)
  }

  const viewResult = async (doc) => {
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/${doc._id}/result`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const saved = data.data[0]

      setQuizData(saved)
      setAnswers(saved.questions.map(q => q.userResponse ?? null))
      setElapsedSec(0)
      setReviewFilter("all")
      setPhase(PHASE.RESULTS)
    } catch (e) {
      console.error("viewResult:", e)
    }
  }

  // ─── SUBMIT QUIZ ─────────────────────────────────────────────────
  const submitQuiz = async () => {
    clearInterval(timerRef.current)

    // PATCH /api/quiz/:id/submit
    // Body: { answers: ["answer string", ...] }  — index maps to questions array
    try {
      await fetch(`${BASE_URL}/api/quiz/${quizData._id}/submit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      })
      fetchAllQuizzes()
    } catch (e) {
      console.error("submitQuiz:", e)
    }

    setPhase(PHASE.RESULTS)
  }

  // ─── SCORE CALC ──────────────────────────────────────────────────
  const calcScore = () => {
    if (!quizData) return { correct: 0, total: 0, pct: 0 }
    const total = quizData.questions.length
    const correct = quizData.questions.filter((q, i) => answers[i] === q.answer).length
    return { correct, total, pct: Math.round((correct / total) * 100) }
  }

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <div className={styles.app}>

      {/* ── HOME ─────────────────────────────────────────────────── */}
      {phase === PHASE.HOME && (
        <div className={styles.homeWrapper}>
          {/* ── MAIN ── */}
          <div className={`${styles.homeScreen} ${sidebarOpen ? styles.homeScreenShrunk : ""}`}>
            <div className={styles.homeCenter}>
              <div className={styles.homeIcon}>🧠</div>
              <h1 className={styles.homeH1}>
                Generate Quizzes from{" "}
                <span className={styles.accent}>Any Material</span>
              </h1>
              <p className={styles.homeSub}>
                Upload a document or type your content — AI crafts targeted quiz
                questions in seconds.
              </p>
              <div className={styles.homeCards}>
                <div
                  className={styles.homeCard}
                  onClick={() => { setMethod("materials"); setPhase(PHASE.STEP1) }}
                >
                  <div className={styles.homeCardIcon}>📄</div>
                  <h3>Create Your Quizzes</h3>
                  <p>Upload PDF, Word, PPT, or images or Text</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className={`${styles.historySidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            {/* Toggle arrow */}
            <button
              className={styles.sidebarToggleBtn}
              onClick={() => setSidebarOpen(o => !o)}
            >
              {sidebarOpen ? "→" : "←"}
            </button>

            {/* Content — only render when open */}
            {sidebarOpen && (
              <div className={styles.sidebarContent}>
                <h3 className={styles.sidebarTitle}>🕓 Quiz History</h3>
                {allQuizzes.length === 0 ? (
                  <p className={styles.sidebarEmpty}>No quizzes yet.</p>
                ) : (
                  allQuizzes.map((q) => (
                    <div
                      key={q._id}
                      className={styles.sidebarItem}
                      onClick={() => viewResult(q)}
                    >
                      <div className={styles.sidebarItemTitle}>{q.quiz?.title || "Untitled"}</div>
                      <div className={styles.sidebarItemMeta}>
                        {q.quiz?.totalQuestion} q · {new Date(q.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 1: METHOD ───────────────────────────────────────── */}
      {phase === PHASE.STEP1 && (
        <div className={styles.screen}>
          <Topbar step="1 of 4" onExit={() => setPhase(PHASE.HOME)} />
          <div className={styles.split}>
            <div className={styles.splitLeft}>
              <StepLabel n="1 of 4" heading="How would you like to create your quiz?" />
              <div className={styles.methodGrid}>
                {[
                  { id: "materials", icon: "📄", title: "Create from Materials", sub: "Generate from study materials", bg: "#fef3c7" },
                  { id: "text", icon: "✏️", title: "Create from Text", sub: "Enter topic and content manually", bg: "#ede9fe" },
                ].map(m => (
                  <div
                    key={m.id}
                    className={`${styles.methodCard} ${method === m.id ? styles.selected : ""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <div className={styles.methodIcon} style={{ background: m.bg }}>{m.icon}</div>
                    <h3>{m.title}</h3>
                    <p>{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.splitRight}>
              <PreviewCardStack />
            </div>
          </div>
          <BottomBar
            onBack={() => setPhase(PHASE.HOME)}
            onNext={() => setPhase(method === "materials" ? PHASE.STEP2A : PHASE.STEP2B)}
            nextDisabled={!method}
          />
        </div>
      )}

      {/* ── STEP 2A: FILE UPLOAD ─────────────────────────────────── */}
      {phase === PHASE.STEP2A && (
        <div className={styles.screen}>
          <Topbar step="2 of 4" onExit={() => setPhase(PHASE.HOME)} />
          <div className={styles.split}>
            <div className={styles.splitLeft}>
              <StepLabel n="2 of 4" heading="Upload your study material" sub="We'll extract content and generate questions from it" />
              <div className={styles.formatPills}>
                {["📄 PDF", "📊 Excel", "📑 PPT", "🖼️ Images", "📝 Word", "📃 Text"].map(p => (
                  <span key={p} className={styles.pill}>{p}</span>
                ))}
              </div>
              <div
                className={`${styles.dropzone} ${dragover ? styles.dragover : ""} ${file ? styles.uploaded : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
                onDragLeave={() => setDragover(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.ppt,.pptx,.xlsx,.xls,.docx,.doc,.txt,.jpg,.png"
                  style={{ display: "none" }}
                  onChange={handleFileDrop}
                />
                <span className={styles.dropIcon}>{file ? "✅" : "⬆️"}</span>
                <p className={styles.dropText}>
                  {file ? file.name : <>Drag &amp; drop your file here, or <span className={styles.browseLink}>browse</span></>}
                </p>
                <p className={styles.dropSub}>
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Max 20 MB · PDF, PPT, Excel, Word, Images"}
                </p>
              </div>
            </div>
            <div className={styles.splitRight}>
              <div className={styles.rpanelInfo}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
                <h3>Smart <span className={styles.accent}>Extraction</span></h3>
                <p>Our AI reads your document and identifies key concepts worth testing.</p>
              </div>
            </div>
          </div>
          <BottomBar
            onBack={() => setPhase(PHASE.STEP1)}
            onNext={() => setPhase(PHASE.STEP3)}
            nextDisabled={!file}
          />
        </div>
      )}

      {/* ── STEP 2B: TEXT INPUT ──────────────────────────────────── */}
      {phase === PHASE.STEP2B && (
        <div className={styles.screen}>
          <Topbar step="2 of 4" onExit={() => setPhase(PHASE.HOME)} />
          <div className={styles.split}>
            <div className={styles.splitLeft}>
              <StepLabel n="2 of 4" heading="Enter your content" sub="Fill in the details below to generate a customized quiz" />

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quiz Title</label>
                <input className={styles.formInput} placeholder="e.g. Chapter 5 Review" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject</label>
                <select className={styles.formInput} value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="">Select subject…</option>
                  {["Mathematics", "Physics", "Chemistry", "Biology", "History", "English", "Computer Science", "Economics"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Topic</label>
                <input className={styles.formInput} placeholder="e.g. Quadratic Equations" value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Content</label>
                <textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  placeholder="Paste or type content here…"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  maxLength={5000}
                />
                <p className={styles.charCount}>{content.length} / 5000</p>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Difficulty</label>
                <div className={styles.segControl}>
                  {["easy", "medium", "hard"].map(d => (
                    <button
                      key={d}
                      className={`${styles.segBtn} ${difficulty === d ? styles.segActive : ""}`}
                      onClick={() => setDifficulty(d)}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Audience</label>
                <select className={styles.formInput} value={audience} onChange={e => setAudience(e.target.value)}>
                  {["Student", "Professional", "General"].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.splitRight}>
              <div className={styles.rpanelInfo}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
                <h3>Custom <span className={styles.accent}>Questions</span></h3>
                <p>More detail = more targeted questions.</p>
              </div>
            </div>
          </div>
          <BottomBar
            onBack={() => setPhase(PHASE.STEP1)}
            onNext={() => setPhase(PHASE.STEP3)}
            nextDisabled={!quizTitle || !subject || !topic}
          />
        </div>
      )}

      {/* ── STEP 3: QUESTION TYPES ───────────────────────────────── */}
      {phase === PHASE.STEP3 && (
        <div className={styles.screen}>
          <Topbar step="3 of 4" onExit={() => setPhase(PHASE.HOME)} />
          <div className={styles.split}>
            <div className={styles.splitLeft}>
              <StepLabel
                n="3 of 4"
                heading="How many questions of each type?"
                sub="Select the types and quantities for your quiz"
              />
              {error && <p className={styles.errorMsg}>{error}</p>}
              <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

                <div className={styles.totalBar}>
                  <span>Total: <strong className={styles.accent}>{totalQuestions}</strong> / 250</span>
                  <span className={styles.mutedText}>Max 200 per type</span>
                </div>
                <div className={styles.qtypeList}>
                  {QTYPES.map((qt, i) => (
                    <div key={qt.id} className={styles.qtypeRow}>
                      <div className={styles.qtypeIcon} style={{ background: qt.bg }}>{qt.icon}</div>
                      <div className={styles.qtypeInfo}>
                        <div className={styles.qtypeName}>{qt.name}</div>
                        <div className={styles.qtypeDesc}>{qt.desc}</div>
                      </div>
                      <div className={styles.counter}>
                        <button className={styles.cntBtn} onClick={() => setTypeCounts(c => ({ ...c, [qt.id]: Math.max(0, c[qt.id] - 1) }))}>−</button>
                        <input
                          className={styles.cntVal}
                          type="number" min="0" max="200"
                          value={typeCounts[qt.id]}
                          onChange={e => setTypeCounts(c => ({ ...c, [qt.id]: Math.min(200, Math.max(0, parseInt(e.target.value) || 0)) }))}
                        />
                        <button className={styles.cntBtn} onClick={() => setTypeCounts(c => ({ ...c, [qt.id]: Math.min(200, c[qt.id] + 1) }))}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.splitRight}>
              <div className={styles.quizPreviewCard}>
                <div className={styles.pcHeader}>
                  <span className={styles.pcTitle}>
                    {QTYPES.find(q => typeCounts[q.id] > 0)?.name || "Multiple Choice"}
                  </span>
                  <div className={styles.pcBadge}>
                    {typeCounts[QTYPES.find(q => typeCounts[q.id] > 0)?.id] || 0}
                  </div>
                </div>
                <div className={styles.pcLine} />
                <div className={styles.pcLine} style={{ width: "70%" }} />
                <div className={styles.pcOpt}>A: ──────────────</div>
                <div className={styles.pcOpt}>B: ──────────</div>
                <div className={styles.pcOpt}>C: ───────────────</div>
              </div>
            </div>
          </div>
          <BottomBar
            onBack={() => setPhase(method === "materials" ? PHASE.STEP2A : PHASE.STEP2B)}
            onNext={generateQuiz}
            nextLabel="Generate Quiz →"
            nextDisabled={totalQuestions === 0}
          />
        </div>
      )}

      {/* ── LOADING ──────────────────────────────────────────────── */}
      {phase === PHASE.LOADING && (
        <div className={styles.loadingScreen}>
          <div className={styles.loaderCard}>
            <div className={styles.pcHeader}>
              <span>📋</span>
              <div className={styles.pcBadge}>AI</div>
            </div>
            <div className={styles.loaderLines}>
              <div className={styles.loaderLine} />
              <div className={styles.loaderLine} />
              <div className={styles.loaderLine} />
            </div>
          </div>
          <h2 className={styles.loaderHeading}>Building your quiz…</h2>
          <p className={styles.loaderStatus}>{loaderStatus}</p>
        </div>
      )}

      {/* ── QUIZ SCREEN ──────────────────────────────────────────── */}
      {phase === PHASE.QUIZ && quizData && (() => {
        const q = quizData.questions[currentQ]
        const total = quizData.questions.length
        const letters = ["A", "B", "C", "D", "E"]
        const isLast = currentQ === total - 1

        return (
          <div className={styles.quizScreen}>
            <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #e2e5ef", display: "flex", alignItems: "center", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#f59e0b,#f97316)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
              <span style={{ fontWeight: 600, fontSize: 15, marginLeft: 12 }}>Quiz Results</span>
              <button onClick={() => setPhase(PHASE.HOME)} style={{ marginLeft: "auto", border: "1px solid #e2e5ef", background: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, color: "#5a6080", cursor: "pointer" }}>
                ✕ Exit
              </button>
            </div>
            <div className={styles.quizTopbar}>

              <span className={styles.quizTitleBar}>{quizData.quiz?.title || "Quiz"}</span>
              <div className={styles.quizProgress}>
                <div className={styles.quizProgressFill} style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
              </div>
              <span className={styles.quizQnum}>{currentQ + 1} / {total}</span>
              <div className={styles.quizTimer}>⏱ {fmtTime(elapsedSec)}</div>

            </div>
            <div className={styles.quizBody}>
              <p className={styles.quizQText}>{q.question}</p>
              <div className={styles.optionList}>
                {(q.options || []).map((opt, i) => (
                  <div
                    key={i}
                    className={`${styles.optionCard} ${answers[currentQ] === opt ? styles.optionSelected : ""}`}
                    onClick={() => setAnswers(a => { const n = [...a]; n[currentQ] = opt; return n })}
                  >
                    <div className={`${styles.optionLetter} ${answers[currentQ] === opt ? styles.optionLetterActive : ""}`}>
                      {letters[i] || i + 1}
                    </div>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <div className={styles.quizNav}>
                <button
                  className={styles.btnNav}
                  style={{ visibility: currentQ === 0 ? "hidden" : "visible" }}
                  onClick={() => setCurrentQ(c => c - 1)}
                >← Back</button>
                <button
                  className={isLast ? styles.btnSubmit : styles.btnNav}
                  onClick={isLast ? submitQuiz : () => setCurrentQ(c => c + 1)}
                >
                  {isLast ? "Submit Quiz" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── HISTORY ──────────────────────────────────────────────── */}


      {/* ── RESULTS ──────────────────────────────────────────────── */}
      {phase === PHASE.RESULTS && quizData && (() => {
        const { correct, total, pct } = calcScore()
        const grade = pct >= 80 ? "Excellent 🏆" : pct >= 60 ? "Good 👍" : "Needs Work 📚"
        const questions = quizData.questions

        const filtered = questions.filter((_, i) => {
          if (reviewFilter === "correct") return answers[i] === questions[i].answer
          if (reviewFilter === "incorrect") return answers[i] !== questions[i].answer
          return true
        })

        return (
          <div className={styles.resultsScreen}>
            <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #e2e5ef", display: "flex", alignItems: "center", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#f59e0b,#f97316)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
              <span style={{ fontWeight: 600, fontSize: 15, marginLeft: 12 }}>Quiz Results</span>
              <button onClick={() => setPhase(PHASE.HOME)} style={{ marginLeft: "auto", border: "1px solid #e2e5ef", background: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, color: "#5a6080", cursor: "pointer" }}>
                ✕ Exit
              </button>
            </div>
            <div className={styles.resultsTop}>
              <div className={styles.scoreRing}>
                <svg width="90" height="90" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e5ef" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="#4f46e5" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
                    style={{ transition: "stroke-dashoffset 1.2s ease" }}
                  />
                </svg>
                <div className={styles.scoreRingText}>
                  <span className={styles.scorePct}>{pct}%</span>
                  <span className={styles.scoreLabel}>Score</span>
                </div>
              </div>
              <div className={styles.scoreInfo}>
                <div className={styles.scoreGrade}>{grade}</div>
                <h2>{quizData.quiz?.title || "Quiz Complete!"}</h2>
                <div className={styles.scoreStats}>
                  <span>✅ {correct} correct</span>
                  <span>❌ {total - correct} incorrect</span>
                  <span>⏱ {fmtTime(elapsedSec)}</span>
                </div>
              </div>
            </div>
            <div className={styles.resultsBody}>
              <div className={styles.filterTabs}>
                {["all", "correct", "incorrect"].map(f => (
                  <button key={f} className={`${styles.tabBtn} ${reviewFilter === f ? styles.tabActive : ""}`} onClick={() => setReviewFilter(f)}>
                    {f === "all" ? "All" : f === "correct" ? "✅ Correct" : "❌ Incorrect"}
                  </button>
                ))}
              </div>
              <div className={styles.reviewList}>
                {filtered.map((q, i) => {
                  const realIdx = questions.indexOf(q)
                  const isCorrect = answers[realIdx] === q.answer
                  return (
                    <div key={i} className={`${styles.reviewCard} ${isCorrect ? styles.correctCard : styles.wrongCard}`}>
                      <p className={styles.reviewQ}>{realIdx + 1}. {q.question}</p>
                      <div className={`${styles.reviewAns} ${isCorrect ? styles.userCorrect : styles.userWrong}`}>
                        {isCorrect ? "✅" : "❌"} Your answer: {answers[realIdx] || "(not answered)"}
                      </div>
                      {!isCorrect && (
                        <div className={`${styles.reviewAns} ${styles.correctAns}`}>
                          ✅ Correct: {q.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className={styles.resultActions}>
              <button className={`${styles.btnAction} ${styles.btnPrimary}`} onClick={() => {
                setAnswers(new Array(quizData.questions.length).fill(null))
                setCurrentQ(0)
                setElapsedSec(0)
                setPhase(PHASE.QUIZ)
              }}>
                🔁 Retake This Quiz
              </button>
              <button className={styles.btnAction} onClick={() => { setQuizData(null); setPhase(PHASE.STEP1) }}>
                ➕ New Quiz
              </button>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────

function Topbar({ step, onExit }) {
  return (
    <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #e2e5ef", display: "flex", alignItems: "center", padding: "0 24px", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#f59e0b,#f97316)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
      <span style={{ fontWeight: 600, fontSize: 15 }}>Create Quiz</span>
      <span style={{ fontSize: 13, color: "#9298b0", marginLeft: 8 }}>{step}</span>
      <button onClick={onExit} style={{ marginLeft: "auto", border: "1px solid #e2e5ef", background: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, color: "#5a6080", cursor: "pointer" }}>
        ✕ Exit
      </button>
    </div>
  )
}

function StepLabel({ n, heading, sub }) {
  return (
    <>
      <p style={{ fontSize: 13, color: "#9298b0", marginBottom: 8, fontWeight: 500 }}>{n}</p>
      <h2 style={{ fontSize: 24, marginBottom: 6, fontFamily: "DM Sans,sans-serif", fontWeight: 700 }}>{heading}</h2>
      {sub && <p style={{ fontSize: 14, color: "#5a6080", marginBottom: 28 }}>{sub}</p>}
    </>
  )
}

function BottomBar({ onBack, onNext, nextDisabled, nextLabel = "Continue →" }) {
  return (
    <div style={{ padding: "16px 48px", background: "#fff", borderTop: "1px solid #e2e5ef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button onClick={onBack} style={{ border: "1.5px solid #e2e5ef", background: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#5a6080" }}>
        ← Back
      </button>
      <button onClick={onNext} disabled={nextDisabled} style={{ background: nextDisabled ? "#e2e5ef" : "#4f46e5", color: nextDisabled ? "#9298b0" : "#fff", border: "none", padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: nextDisabled ? "not-allowed" : "pointer", transition: "all .2s" }}>
        {nextLabel}
      </button>
    </div>
  )
}

function PreviewCardStack() {
  return (
    <div style={{ position: "relative", width: 220, height: 280, margin: "0 auto" }}>
      {[
        { rot: "-6deg", tx: "-20px", ty: "30px", z: 1, title: "True or False" },
        { rot: "-2deg", tx: "-5px", ty: "15px", z: 2, title: "Fill in the Blank" },
        { rot: "2deg", tx: "0", ty: "0", z: 3, title: "Multiple Choice", accent: true },
      ].map((c, i) => (
        <div key={i} style={{ position: "absolute", width: 200, background: "#fff", border: `1.5px solid ${c.accent ? "#4f46e5" : "#e2e5ef"}`, borderRadius: 14, padding: 16, zIndex: c.z, transform: `rotate(${c.rot}) translate(${c.tx},${c.ty})`, boxShadow: "0 2px 16px rgba(79,70,229,.08)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
          <div style={{ height: 7, background: "#e2e5ef", borderRadius: 4, marginBottom: 7 }} />
          <div style={{ height: 7, background: "#e2e5ef", borderRadius: 4, width: "70%", marginBottom: 10 }} />
          {["A", "B", "C"].map(l => (
            <div key={l} style={{ border: "1px solid #e2e5ef", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#9298b0", marginBottom: 4 }}>{l}: ──────────</div>
          ))}
        </div>
      ))}
    </div>
  )
}