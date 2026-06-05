import { useState, useEffect, useRef, useCallback } from "react";
import BASE_URL from "../lib/api.js";
import styles from "./styles/SearchResults.module.css";

// ─── Helpers ──────────────────────────────────────────────────

async function fetchSearch(query, token) {
    const res = await fetch(
        `${BASE_URL}/api/search?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    const json = await res.json();
    return json.data;
}

function getCredibility(url = "") {
    if (!url) return "unknown";
    if (url.includes(".edu") || url.includes(".gov")) return "edu";
    const established = [
        "wikipedia", "ibm", "google", "nasa", "stanford", "mit",
        "bbc", "nytimes", "reuters", "sas", "iso.org"
    ];
    if (established.some((d) => url.includes(d))) return "established";
    return "unknown";
}

function credLabel(type) {
    if (type === "edu") return "Edu/Gov";
    if (type === "established") return "Trusted";
    return "Unknown";
}

function readingTime(snippet = "") {
    const words = snippet.split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `~${mins} min read`;
}

function flattenShorts(shortsResults = []) {
    return shortsResults.flatMap((b) => b.shorts || []);
}

function formatViews(n) {
    if (!n) return "";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
}

// ─── Sub-components ───────────────────────────────────────────

function ThemeToggle({ dark, onToggle }) {
    return (
        <button
            className={styles.themeToggle}
            onClick={onToggle}
            aria-label="Toggle dark mode"
            title={dark ? "Switch to light" : "Switch to dark"}
        >
            {dark ? "☀" : "☾"}
        </button>
    );
}

function SearchBar({ onSearch, loading, initialQuery = "", activeTab, onTabChange }) {
    const [input, setInput] = useState(initialQuery);

    useEffect(() => setInput(initialQuery), [initialQuery]);

    function handleSubmit(e) {
        e.preventDefault();
        if (input.trim()) onSearch(input.trim());
    }

    return (
        <form className={styles.searchBar} onSubmit={handleSubmit}>
            <div className={styles.searchInputWrap}>
                <span className={styles.searchIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    className={styles.searchInput}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search anything…"
                    disabled={loading}
                    autoFocus
                />
                {input && (
                    <button
                        type="button"
                        className={styles.clearBtn}
                        onClick={() => setInput("")}
                        aria-label="Clear"
                    >×</button>
                )}
            </div>
            <button
                className={styles.searchBtn}
                type="submit"
                disabled={loading || !input.trim()}
            >
                {loading ? (
                    <span className={styles.spinner} />
                ) : "Search"}
            </button>
        </form>
    );
}

function FilterChips({ active, onChange }) {
    const chips = ["All", "News", "Images", "Videos", "Shopping", "Books", "More", "Tools"];
    return (
        <div className={styles.filterChips}>
            {chips.map((c) => (
                <button
                    key={c}
                    className={`${styles.chip} ${active === c ? styles.chipActive : ""}`}
                    onClick={() => onChange(c)}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}

function AIOverview({ aiOverview }) {
    const [expanded, setExpanded] = useState(false);
    const cardRef = useRef(null);

    if (!aiOverview?.text_blocks) return null;

    return (
        <>
            {expanded && (
                <div
                    className={styles.blurOverlay}
                    onClick={() => setExpanded(false)}
                />
            )}
            <div
                ref={cardRef}
                className={`${styles.aiCard} ${expanded ? styles.aiCardExpanded : ""}`}
            >
                <div className={styles.aiCardHeader}>
                    <div className={styles.aiCardTitle}>
                        <span className={styles.aiDot} />
                        AI Overview
                        <span className={styles.aiPowered}>Gemini</span>
                    </div>
                    <button
                        className={styles.aiExpandBtn}
                        onClick={() => setExpanded((v) => !v)}
                    >
                        {expanded ? "Collapse" : "Expand"}
                        <svg
                            width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 350ms" }}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>

                <div className={`${styles.aiBody} ${expanded ? styles.aiBodyExpanded : ""}`}>
                    {aiOverview.text_blocks.map((block, i) => {
                        if (block.type === "paragraph") return <p key={i} className={styles.aiPara}>{block.snippet}</p>;
                        if (block.type === "heading") return <h3 key={i} className={styles.aiHeading}>{block.snippet}</h3>;
                        if (block.type === "list") return (
                            <ul key={i} className={styles.aiList}>
                                {block.list.map((item, j) => <li key={j}>{item.snippet}</li>)}
                            </ul>
                        );
                        return null;
                    })}
                </div>

                {aiOverview.references?.length > 0 && (
                    <div className={styles.aiSources}>
                        {aiOverview.references.slice(0, 6).map((ref, i) => (
                            <a key={i} href={ref.link} target="_blank" rel="noreferrer" className={styles.aiSourceChip}>
                                {ref.source || ref.title?.split(" ")[0] || "Source"}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function PeopleAlsoAsk({ questions }) {
    const [openIdx, setOpenIdx] = useState(null);

    if (!questions?.length) return null;

    return (
        <div className={styles.paaSection}>
            <h2 className={styles.sectionTitle}>People also ask</h2>
            <div className={styles.paaList}>
                {questions.slice(0, 4).map((q, i) => (
                    <div key={i} className={styles.paaItem}>
                        <button
                            className={styles.paaQuestion}
                            onClick={() => setOpenIdx(openIdx === i ? null : i)}
                        >
                            <span>{q.question}</span>
                            <svg
                                width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2.5"
                                style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform 350ms", flexShrink: 0 }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        {openIdx === i && (
                            <div className={styles.paaAnswer}>
                                <p>This question relates to: <em>{q.question}</em>. See search results above for detailed answers from authoritative sources.</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function OrganicResults({ results, savedLinks, onToggleSave, activeIndex }) {
    const [copiedIdx, setCopiedIdx] = useState(null);

    if (!results?.length) return null;

    function handleCopy(e, link, idx) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(link).catch(() => { });
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
    }

    return (
        <div className={styles.organicList}>
            {results.map((r, i) => {
                const cred = getCredibility(r.link);
                const saved = savedLinks.includes(r.link);
                const isActive = activeIndex === i;
                return (
                    <article
                        key={i}
                        className={`${styles.resultCard} ${isActive ? styles.resultCardActive : ""}`}
                        data-result-index={i}
                    >
                        <div className={styles.resultMeta}>
                            {r.favicon && (
                                <img src={r.favicon} alt="" className={styles.favicon} width={16} height={16} />
                            )}
                            <span className={styles.breadcrumb}>{r.displayed_link}</span>
                            <span className={`${styles.credBadge} ${styles[`cred_${cred}`]}`}>
                                {credLabel(cred)}
                            </span>
                        </div>

                        <h3 className={styles.resultTitle}>
                            <a href={r.link} target="_blank" rel="noreferrer">{r.title}</a>
                        </h3>

                        <p className={styles.resultSnippet}>{r.snippet}</p>

                        <div className={styles.resultFooter}>
                            {r.date && <span className={styles.resultDate}>{r.date}</span>}
                            <span className={styles.readTime}>{readingTime(r.snippet)}</span>
                            <div className={styles.resultActions}>
                                <button
                                    className={`${styles.bookmarkBtn} ${saved ? styles.bookmarkActive : ""}`}
                                    onClick={() => onToggleSave(r.link)}
                                    title={saved ? "Unsave" : "Save"}
                                >
                                    {saved ? "★" : "☆"}
                                </button>
                                <button
                                    className={styles.copyBtn}
                                    onClick={(e) => handleCopy(e, r.link, i)}
                                    title="Copy link"
                                >
                                    {copiedIdx === i ? "✓" : "⎘"}
                                </button>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

function InlineVideos({ videos }) {
    if (!videos?.length) return null;
    return (
        <div className={styles.inlineVideos}>
            <h2 className={styles.sectionTitle}>Videos</h2>
            <div className={styles.inlineVideoRow}>
                {videos.map((v, i) => (
                    <a key={i} href={v.link} target="_blank" rel="noreferrer" className={styles.inlineVideoCard}>
                        {v.thumbnail && (
                            <div className={styles.inlineVideoThumb}>
                                <img src={v.thumbnail} alt={v.title} />
                                <span className={styles.durationBadge}>{v.duration}</span>
                            </div>
                        )}
                        <div className={styles.inlineVideoInfo}>
                            <strong className={styles.inlineVideoTitle}>{v.title}</strong>
                            <span className={styles.inlineVideoChannel}>{v.channel}</span>
                            {v.date && <span className={styles.inlineVideoDate}>{v.date}</span>}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function KnowledgePanel({ google }) {
    // Derive entity info from search_information + organic first result
    const firstResult = google?.organic_results?.[0];
    const query = google?.search_parameters?.q || "";
    if (!firstResult && !query) return null;

    const facts = [
        { label: "Query", value: query },
        { label: "Results", value: google?.search_information?.total_results?.toLocaleString() },
        { label: "Engine", value: google?.search_parameters?.engine || "Google" },
        { label: "Device", value: google?.search_parameters?.device || "desktop" },
    ].filter((f) => f.value);

    const topicChips = google?.related_searches?.slice(0, 4) || [];

    return (
        <aside className={styles.knowledgePanel}>
            <div className={styles.kpHeader}>
                <div className={styles.kpIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                <div>
                    <div className={styles.kpTitle}>{query || "Search"}</div>
                    <div className={styles.kpCategory}>Search · Information retrieval</div>
                </div>
            </div>
            <p className={styles.kpDesc}>
                {firstResult?.snippet || "Results from across the web for your search query."}
            </p>
            <table className={styles.kpTable}>
                <tbody>
                    {facts.map((f, i) => (
                        <tr key={i}>
                            <td className={styles.kpLabel}>{f.label}</td>
                            <td className={styles.kpValue}>{f.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {topicChips.length > 0 && (
                <div className={styles.kpChips}>
                    {topicChips.map((s, i) => (
                        <span key={i} className={styles.kpChip}>{s.query}</span>
                    ))}
                </div>
            )}
        </aside>
    );
}

function RelatedSearches({ searches, onSearch }) {
    if (!searches?.length) return null;
    return (
        <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>Related searches</h2>
            <div className={styles.relatedGrid}>
                {searches.map((s, i) => (
                    <button
                        key={i}
                        className={styles.relatedItem}
                        onClick={() => onSearch(s.query)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        {s.query}
                    </button>
                ))}
            </div>
        </div>
    );
}

function YouTubeVideoCard({ v }) {
    return (
        <a href={v.link} target="_blank" rel="noreferrer" className={styles.ytCard}>
            <div className={styles.ytThumbWrap}>
                {v.thumbnail?.static && (
                    <img src={v.thumbnail.static} alt={v.title} className={styles.ytThumb} />
                )}
                {v.length && <span className={styles.ytDuration}>{v.length}</span>}
            </div>
            <div className={styles.ytCardInfo}>
                <div className={styles.ytChannelRow}>
                    {v.channel?.thumbnail && (
                        <img src={v.channel.thumbnail} alt={v.channel.name} className={styles.ytAvatar} />
                    )}
                    <span className={styles.ytChannelName}>{v.channel?.name}</span>
                    {v.channel?.verified && <span className={styles.ytVerified}>✓</span>}
                </div>
                <h3 className={styles.ytTitle}>{v.title}</h3>
                <div className={styles.ytMeta}>
                    {v.views && <span>{formatViews(v.views)} views</span>}
                    {v.published_date && <span>· {v.published_date}</span>}
                </div>
                {v.description && <p className={styles.ytDesc}>{v.description}</p>}
            </div>
        </a>
    );
}

function ShortsRow({ shorts }) {
    if (!shorts?.length) return null;
    return (
        <div className={styles.shortsSection}>
            <h2 className={styles.sectionTitle}>Shorts</h2>
            <div className={styles.shortsRow}>
                {shorts.map((s, i) => (
                    <a key={i} href={s.link} target="_blank" rel="noreferrer" className={styles.shortCard}>
                        <div className={styles.shortThumbWrap}>
                            {s.thumbnail && <img src={s.thumbnail} alt={s.title} className={styles.shortThumb} />}
                        </div>
                        <p className={styles.shortTitle}>{s.title}</p>
                        <span className={styles.shortViews}>{s.views_original}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────

export default function SearchResults() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Google");
    const [filterChip, setFilterChip] = useState("All");
    const [dark, setDark] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("search_theme") === "dark" ||
                window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    });
    const [savedLinks, setSavedLinks] = useState(() => {
        try { return JSON.parse(localStorage.getItem("saved_links") || "[]"); }
        catch { return []; }
    });
    const [activeResultIndex, setActiveResultIndex] = useState(-1);

    const token = typeof window !== "undefined"
        ? (localStorage.getItem("token") || "")
        : "";

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        localStorage.setItem("search_theme", dark ? "dark" : "light");
    }, [dark]);

    // Save bookmarks
    useEffect(() => {
        localStorage.setItem("saved_links", JSON.stringify(savedLinks));
    }, [savedLinks]);

    // Keyboard navigation
    useEffect(() => {
        const organicResults = data?.googleResponse?.organic_results || [];
        function onKeyDown(e) {
            if (e.target.tagName === "INPUT") return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveResultIndex((i) => Math.min(i + 1, organicResults.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveResultIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && activeResultIndex >= 0) {
                const r = organicResults[activeResultIndex];
                if (r) window.open(r.link, "_blank");
            } else if (e.key === "b" || e.key === "B") {
                const r = organicResults[activeResultIndex];
                if (r) toggleSave(r.link);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [data, activeResultIndex]);

    async function handleSearch(q) {
        setQuery(q);
        setLoading(true);
        setError(null);
        setData(null);
        setActiveResultIndex(-1);
        try {
            const result = await fetchSearch(q, token);
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function toggleSave(link) {
        setSavedLinks((prev) =>
            prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
        );
    }

    const google = data?.googleResponse;
    const youtube = data?.youtubeResponse;
    const shorts = flattenShorts(youtube?.shorts_results);
    const totalResults = google?.search_information?.total_results;
    const ytTotal = youtube?.search_information?.total_results;
    const googleUrl = google?.search_metadata?.google_url;
    const youtubeUrl = youtube?.search_metadata?.youtube_url;

    return (
        <div className={styles.page}>
            {/* Top bar */}
            <header className={styles.topBar}>
                <div className={styles.logoWrap}>
                    <span className={styles.logoText}>Lumina</span>
                    <span className={styles.logoSub}>Search</span>
                </div>
                <div className={styles.topBarRight}>
                    {savedLinks.length > 0 && (
                        <span className={styles.savedCount}>★ {savedLinks.length} saved</span>
                    )}
                    <ThemeToggle dark={dark} onToggle={() => setDark((v) => !v)} />
                </div>
            </header>

            {/* Search bar */}
            <div className={styles.searchWrap}>
                <SearchBar onSearch={handleSearch} loading={loading} initialQuery={query} />
            </div>

            {/* Tabs */}
            <div className={styles.tabsBar}>
                <div className={styles.tabs}>
                    {["Google", "YouTube"].map((t) => (
                        <button
                            key={t}
                            className={`${styles.tab} ${activeTab === t ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t === "Google" ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 5 }}>
                                    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 5 }}>
                                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                                </svg>
                            )}
                            {t}
                            {t === "Google" && totalResults != null && query && (
                                <span className={styles.tabCount}>{(totalResults / 1e6).toFixed(1)}M</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* External link pill */}
                {activeTab === "Google" && googleUrl && query && (
                    <a href={googleUrl} target="_blank" rel="noreferrer" className={styles.openPill}>
                        Open in Google ↗
                    </a>
                )}
                {activeTab === "YouTube" && youtubeUrl && query && (
                    <a href={youtubeUrl} target="_blank" rel="noreferrer" className={styles.openPill}>
                        Open YouTube ↗
                    </a>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className={styles.errorBanner}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className={styles.skeletonWrap}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.skeleton}>
                            <div className={styles.skeletonLine} style={{ width: "40%" }} />
                            <div className={styles.skeletonLine} style={{ width: "70%" }} />
                            <div className={styles.skeletonLine} style={{ width: "90%" }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !data && !error && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <p>Type a query and hit Search</p>
                    <span className={styles.emptyHint}>↑↓ to navigate · B to bookmark · Enter to open</span>
                </div>
            )}

            {/* ── GOOGLE TAB ── */}
            {!loading && google && activeTab === "Google" && (
                <div className={styles.contentLayout}>
                    <main className={styles.mainCol}>
                        {/* Filter chips */}
                        <FilterChips active={filterChip} onChange={setFilterChip} />

                        {/* Result count row */}
                        <div className={styles.resultCountRow}>
                            <span className={styles.resultCount}>
                                About <strong>{totalResults?.toLocaleString()}</strong> results
                            </span>
                            <span className={styles.resultTime}>
                                ({google.search_information?.time_taken_displayed}s)
                            </span>
                        </div>

                        {/* AI Overview */}
                        <AIOverview aiOverview={google.ai_overview} />

                        {/* Inline videos */}
                        <InlineVideos videos={google.inline_videos} />

                        {/* People Also Ask */}
                        <PeopleAlsoAsk questions={google.related_questions} />

                        {/* Organic results */}
                        <OrganicResults
                            results={google.organic_results}
                            savedLinks={savedLinks}
                            onToggleSave={toggleSave}
                            activeIndex={activeResultIndex}
                        />

                        {/* Related searches */}
                        <RelatedSearches searches={google.related_searches} onSearch={handleSearch} />
                    </main>

                    {/* Sidebar */}
                    <KnowledgePanel google={google} />
                </div>
            )}

            {/* ── YOUTUBE TAB ── */}
            {!loading && youtube && activeTab === "YouTube" && (
                <div className={styles.ytLayout}>
                    {/* Result count */}
                    <div className={styles.resultCountRow}>
                        <span className={styles.resultCount}>
                            About <strong>{ytTotal?.toLocaleString()}</strong> results
                        </span>
                    </div>

                    {/* Video grid */}
                    <div className={styles.ytGrid}>
                        {youtube.video_results?.map((v, i) => (
                            <YouTubeVideoCard key={i} v={v} />
                        ))}
                    </div>

                    {/* Shorts */}
                    <ShortsRow shorts={shorts} />
                </div>
            )}
        </div>
    );
}