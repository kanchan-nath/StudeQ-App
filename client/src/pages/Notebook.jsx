import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../lib/api.js";
import styles from "./styles/Notebook.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
// ── Toast helper ──────────────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
  <div className={styles.toastStack}>
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`${styles.toast} ${styles[`toast_${t.type}`]} ${t.exiting ? styles.toastExit : styles.toastEnter}`}
      >
        <span className={styles.toastIcon}>
          {t.type === "success" ? "✓" : "✕"}
        </span>
        <span className={styles.toastMsg}>{t.message}</span>
        <button
          className={styles.toastClose}
          onClick={() => removeToast(t.id)}
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

// ── Typing / AI-waiting animation ─────────────────────────────────────────────
const ThinkingBubble = () => (
  <div className={styles.thinkingBubble}>
    <span className={styles.thinkingLabel}>Crafting your answer</span>
    <span className={styles.dots}>
      <span />
      <span />
      <span />
    </span>
  </div>
);

// ── Morphing upload loader ─────────────────────────────────────────────────────
const UploadLoader = () => (
  <div className={styles.uploadLoader}>
    <div className={styles.morphBlob} />
    <p className={styles.uploadLoaderText}>Analysing your document…</p>
  </div>
);

// ── Sidebar chat item ──────────────────────────────────────────────────────────
const SidebarItem = ({ chat, isActive, onSelect, onDelete, chatTitle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const title = chat.messages[0]?.content || chatTitle;
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <li
      className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ""}`}
      onClick={() => onSelect(chat)}
    >
      <span className={styles.sidebarTitle}>{title}</span>
      <button
        className={styles.sidebarDots}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        aria-label="Options"
      >
        ⋯
      </button>
      {menuOpen && (
        <div className={styles.sidebarMenu} ref={menuRef}>
          <button
            className={styles.sidebarMenuDelete}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onDelete(chat);
            }}
          >
            🗑 Delete
          </button>
        </div>
      )}
    </li>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const Notebook = () => {
  // ── Router ─────────────────────────────────────────────────────────────────
  const { chatId } = useParams();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [inputFile, setInputFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputFileResult, setInputFileResult] = useState({});

  // chatRoom is now derived from URL param — no useState needed
  const chatRoom = !!chatId;

  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const [query, setQuery] = useState("");
  const [loadingSendQuery, setLoadingQuery] = useState(false);
  const [result, setResult] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [hiddenAiIds, setHiddenAiIds] = useState([]);

  const [allChats, setAllChats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("sparke-theme") || "dark");

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // ── Theme ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const pushToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
      );
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        350,
      );
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  };

  // ── Scroll to bottom on new messages ──────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result, loadingSendQuery]);

  // ── Restore state on reload (chatId exists but inputFileResult is empty) ──
  useEffect(() => {
    if (!chatId || allChats.length === 0) return;
    if (inputFileResult?.id) return; // already set
    const found = allChats.find((c) => (c._id || c.id) === chatId);
    if (found) {
      setInputFileResult({ id: found._id, chatRoomKey: found.chatRoomKey });
    }
  }, [chatId, allChats]);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleChangeFile = (e) => setInputFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setInputFile(file);
  };

  // ── Upload submit ──────────────────────────────────────────────────────────
  const handleClickSubmit = async () => {
    if (!inputFile) {
      pushToast("Please select a file first.", "error");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", inputFile);

    if (editId) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/documents/${inputFileResult.id}/chat/${inputFileResult.chatRoomKey}/${editId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(inputFile),
          },
        );
        if (!res.ok) throw new Error("Edit failed, try again.");
        const data = await res.json();
        setInputFileResult(data.data);
        fetchAllChats();
        pushToast("Document updated successfully.");
      } catch (err) {
        pushToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch(`${BASE_URL}/api/documents/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("File upload failed.");
        const data = await res.json();
        setInputFileResult(data.data);
        setInputFile(null);
        fetchAllChats();
        pushToast("Document uploaded! Chat is ready.");
        // Navigate to chatroom route — this is what switches the view
        navigate(`/notebook/${data.data._id}`);
      } catch (err) {
        pushToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // ── Send query ─────────────────────────────────────────────────────────────
  const handleSubmitQuery = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoadingQuery(true);

    if (editId) {
      setHiddenAiIds((prev) => [...prev, editId]);
    }

    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: "user",
      content: query,
      createdAt: new Date().toISOString(),
      temp: true,
    };
    setResult((prev) => {
      const flat = prev.flatMap((item) => item.messages || []);
      return [{ messages: [...flat, tempUserMsg] }];
    });
    setQuery("");
    setEditId(null);
    setEditingMessageId(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/documents/${inputFileResult.id}/chat/${inputFileResult.chatRoomKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        },
      );
      if (!res.ok) throw new Error("Message failed, try again.");
      await fetchAllMessages();
    } catch (err) {
      pushToast(err.message, "error");
    } finally {
      setLoadingQuery(false);
    }
  };

  // ── Fetch messages ─────────────────────────────────────────────────────────
  const fetchAllMessages = async () => {
    if (!inputFileResult?.id) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/documents/${inputFileResult.id}/chat/${inputFileResult.chatRoomKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to load messages.");
      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      pushToast(err.message, "error");
    }
  };

  // ── Fetch all chats (sidebar) ──────────────────────────────────────────────
  const fetchAllChats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/documents/chat/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load chat history.");
      const data = await res.json();
      console.log(data.data);

      setAllChats(data.data || []);
    } catch (err) {
      pushToast(err.message, "error");
    }
  };

  // ── Delete chat ────────────────────────────────────────────────────────────
  const handleDeleteChat = async (chat) => {
    try {
      const res = await fetch(`${BASE_URL}/api/documents/${chat._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed.");
      pushToast("Chat deleted.");
      fetchAllChats();
      // If deleted chat is the currently open one, go back to upload view
      if (chatId === chat._id) {
        navigate("/notebook");
        setResult([]);
        setInputFileResult({});
      }
    } catch (err) {
      pushToast(err.message, "error");
    }
  };

  // ── Select chat from sidebar ───────────────────────────────────────────────
  const handleSelectChat = (chat) => {
    setInputFileResult({ id: chat._id, chatRoomKey: chat.chatRoomKey });
    navigate(`/notebook/${chat._id}`);
  };

  useEffect(() => {
    if (inputFileResult?.id) fetchAllMessages();
  }, [inputFileResult?.id]);

  useEffect(() => {
    fetchAllChats();
  }, []);

  // ── Edit click ─────────────────────────────────────────────────────────────
  const handleClickEdit = (messageId, content) => {
    setEditId(messageId);
    setEditingMessageId(messageId);
    setQuery(content);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Chat title from first user message ────────────────────────────────────
  const chatTitle = (() => {
    const allMsgs = result.flatMap((r) => r.messages || []);
    const first = allMsgs.find((m) => m.role === "user");
    return first?.content?.slice(0, 60) || "Study Session";
  })();

  // ── Format timestamp ───────────────────────────────────────────────────────
  const fmtTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ── Flatten messages ───────────────────────────────────────────────────────
  const flatMessages = result.flatMap((r) => r.messages || []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    // FIX: root is now a flex row containing appShell + rightSidebar
    <div className={styles.root}>
      {/* Theme toggle */}

      <Toast toasts={toasts} removeToast={removeToast} />

      {/* FIX: appShell wraps both views and fills remaining width */}
      <div className={styles.appShell}>

        {/* ── VIEW 1: Upload ── */}
        {!chatRoom && (
          <main className={styles.uploadPage}>
            <header className={styles.uploadHeader}>
              <div className={styles.logoMark}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="10" fill="var(--accent)" />
                  <path
                    d="M10 18h16M18 10v16"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1 className={styles.uploadTitle}>
                Turn Any Document Into
                <br />
                <em>Your Personal Tutor</em>
              </h1>
              <p className={styles.uploadSubtitle}>
                Upload a file and ask anything — your AI study partner is ready.
              </p>
            </header>

            {/* Supported formats */}
            <ul className={styles.formatGrid}>
              {[
                { icon: "📄", label: "PDF" },
                { icon: "📊", label: "Excel" },
                { icon: "📑", label: "PPT" },
                { icon: "🖼️", label: "Images" },
                { icon: "📝", label: "Word" },
                { icon: "📃", label: "Text" },
              ].map((f) => (
                <li key={f.label} className={styles.formatChip}>
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>

            {/* Drop zone */}
            <div
              className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""} ${inputFile ? styles.dropZoneHasFile : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleChangeFile}
                accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                className={styles.hiddenInput}
              />
              {inputFile ? (
                <div className={styles.filePreview}>
                  <span className={styles.fileIcon}>📎</span>
                  <span className={styles.fileName}>{inputFile.name}</span>
                  <button
                    className={styles.fileRemove}
                    onClick={(e) => { e.stopPropagation(); setInputFile(null); }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className={styles.dropHint}>
                  <span className={styles.dropIcon}>⬆</span>
                  <p>Drag & drop your file here, or <u>browse</u></p>
                  <p className={styles.dropMeta}>Max 20 MB · PDF, PPT, Excel, Word, Images</p>
                </div>
              )}
            </div>

            {loading ? (
              <UploadLoader />
            ) : (
              <button
                className={`${styles.submitBtn} ${inputFile ? styles.submitBtnActive : ""}`}
                onClick={handleClickSubmit}
                disabled={!inputFile}
              >
                <span>Start Studying</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </main>
        )}

        {/* ── VIEW 2: Chatroom ── */}
        {chatRoom && (
          <div className={styles.chatroomShell}>
            {/* Left Sidebar */}

            {/* Main chat area */}
            <div className={styles.chatroomMain}>
              {/* Chat header */}
              <header className={styles.chatHeader}>
                <div className={styles.chatHeaderInner}>
                  <span className={styles.chatHeaderDot} />
                  <h2 className={styles.chatTitle}>{chatTitle}</h2>
                </div>
              </header>

              {/* Messages */}
              <section className={styles.messagesArea}>
                {flatMessages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  const isHidden =
                    hiddenAiIds.includes(flatMessages[i - 1]?._id) && !isUser;
                  if (isHidden) return null;

                  return (
                    <div
                      key={msg._id || i}
                      className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowAI}`}
                    >
                      {!isUser && (
                        <div className={styles.aiAvatar}>
                          <img src="/favicon.svg" alt="AI" width={15} height={15} />
                        </div>
                      )}
                      <div
                        className={`${styles.messageBubble} ${isUser ? styles.bubbleUser : styles.bubbleAI} ${editingMessageId === msg._id ? styles.bubbleEditing : ""}`}
                        onMouseEnter={() => isUser && setEditingMessageId(msg._id)}
                        onMouseLeave={() => isUser && setEditingMessageId(null)}
                      >
                        {isUser ? (
                          <p className={styles.messageContent}>{msg.content}</p>
                        ) : (
                          <div className={styles.aiContent}>
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                        <span className={styles.messageTime}>{fmtTime(msg.createdAt)}</span>

                        {isUser && editingMessageId === msg._id && (
                          <button
                            className={styles.editBtn}
                            onClick={() => handleClickEdit(msg._id, msg.content)}
                          >
                            ✏ Edit
                          </button>
                        )}
                      </div>
                      {isUser && <div className={styles.userAvatar}>You</div>}
                    </div>
                  );
                })}

                {loadingSendQuery && (
                  <div className={`${styles.messageRow} ${styles.messageRowAI}`}>
                    <div className={styles.aiAvatar}>AI</div>
                    <ThinkingBubble />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </section>

              {/* Input bar */}
              <footer className={styles.inputBar}>
                {editId && (
                  <div className={styles.editBanner}>
                    <span>✏ Editing message</span>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditingMessageId(null);
                        setQuery("");
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
                <form className={styles.inputForm} onSubmit={handleSubmitQuery}>
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.queryInput}
                    placeholder="Ask anything about your document…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loadingSendQuery}
                  />
                  <button
                    type="submit"
                    className={`${styles.sendBtn} ${query.trim() ? styles.sendBtnActive : ""}`}
                    disabled={loadingSendQuery || !query.trim()}
                    aria-label="Send"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </form>
              </footer>
            </div>
          </div>
        )}

      </div>{/* end appShell */}

      {/* FIX: Right sidebar is NOW outside chatRoom block — always visible */}
      <div className={`${styles.rightSidebar} ${rightSidebarOpen ? styles.rightSidebarOpen : styles.rightSidebarClosed}`}>
        <button
          className={styles.rightSidebarToggleBtn}
          onClick={() => setRightSidebarOpen((o) => !o)}
        >
          {rightSidebarOpen ? "→" : "←"}
        </button>

        {rightSidebarOpen && (
          <div className={styles.rightSidebarContent}>
            <h3 className={styles.rightSidebarTitle}>📄 Document History</h3>
            {sidebarOpen && (
              <ul className={styles.sidebarList}>
                {allChats.length === 0 && (
                  <li className={styles.sidebarEmpty}>No past sessions yet.</li>
                )}
                {allChats.map((chat) => (
                  <SidebarItem
                    key={chat.id || chat._id}
                    chat={chat}
                    isActive={chatId === (chat.id || chat._id)}
                    onSelect={handleSelectChat}
                    onDelete={handleDeleteChat}
                    chatTitle={chatTitle}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notebook;