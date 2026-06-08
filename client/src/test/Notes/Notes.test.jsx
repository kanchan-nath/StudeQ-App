/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, act, within } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import Notes from '../../pages/Notes'
import styles from "/src/pages/styles/notes.module.css";

// ─── Hoisted socket setup ─────────────────────────────────────────────────────
const { socketHandlers, mockSocket, connectSocketMock } = vi.hoisted(() => {
    const socketHandlers = {}
    const connectSocketMock = vi.fn()
    const mockSocket = {
        on: vi.fn((event, cb) => { socketHandlers[event] = cb }),
        off: vi.fn()
    }
    return { socketHandlers, mockSocket, connectSocketMock }
})


// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('react-markdown', () => ({
    default: ({ children }) => <span>{children}</span>
}))

vi.mock("../../lib/socket.js", () => ({
    connectSocket: connectSocketMock,
    getSocket: vi.fn(() => mockSocket)
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const pinnedNote = { _id: 'pin-1', title: 'Pinned Note', summary: 'Sum A', keyPoints: ['KP 1'], isPinned: true }
const unpinnedNote = { _id: 'unpin-1', title: 'Unpinned Note', summary: 'Sum B', keyPoints: ['KP 2'], isPinned: false }
const aiNote = { _id: 'ai-1', title: 'AI Title', summary: 'AI Summary', keyPoints: ['AI KP'], isPinned: false }

// ─── Helper ───────────────────────────────────────────────────────────────────

async function openSidebar() {
    await userEvent.click(screen.getByRole('button', { name: /expand sidebar/i }))
}

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.clearAllTimers()
    Object.keys(socketHandlers).forEach(k => delete socketHandlers[k])
})

describe("Notes — initial render", () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    })

    it('calls fetchNotes on mount', () => {
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/notes'),
            expect.objectContaining({ method: 'GET' })
        )
    })

    it('connects socket on mount', () => {
        expect(connectSocketMock).toHaveBeenCalledTimes(1)
    })

    it('shows WelcomePanel as default view', () => {
        expect(screen.queryByRole('textbox', { name: /content to summarise/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('article')).not.toBeInTheDocument()
    })
})

describe("Notes — panel view switching", () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    })

    it('renders NoteInputForm when panelView is "form"', async () => {
        await userEvent.click(screen.getByRole('button', { name: /Create your first note/i }))
        expect(screen.getByRole('textbox', { name: /content to summarise/i })).toBeInTheDocument()
    })

    it('renders NoteDocument when panelView is "note" and activeNote exists', async () => {
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('WelcomePanel CTA click switches view to form', async () => {
        await userEvent.click(screen.getByRole('button', { name: /Create your first note/i }))
        expect(screen.getByRole('textbox', { name: /content to summarise/i })).toBeInTheDocument()
    })
})

describe('Notes — sidebar', () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [pinnedNote, unpinnedNote] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await openSidebar()
        await waitFor(() => expect(screen.getByText('Pinned Note')).toBeInTheDocument())
    })

    it('renders "Your Notes" title', () => {
        expect(screen.getByText(/Your Notes/i)).toBeInTheDocument()
    })

    it('shows loading spinner when fetching', async () => {
        cleanup()
        let resolveFetch
        global.fetch = vi.fn().mockReturnValue(new Promise(r => { resolveFetch = r }))
        render(<Notes />)
        await openSidebar()
        await waitFor(() => expect(screen.getByText(/loading…/i)).toBeInTheDocument())
        act(() => resolveFetch({ ok: true, json: async () => ({ data: [] }) }))
    })

    it('shows error message when fetchError is set', async () => {
        cleanup()
        global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
        render(<Notes />)
        await openSidebar()
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch notes'))
    })

    it('shows empty state when notes array is empty', async () => {
        cleanup()
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await openSidebar()
        await waitFor(() => expect(screen.getByText(/no notes yet/i)).toBeInTheDocument())
    })

    it('renders pinned notes group when pinned notes exist', () => {
        expect(screen.getByText('📌 Pinned')).toBeInTheDocument()
    })

    it('renders "All Notes" group label when both pinned and unpinned exist', () => {
        expect(screen.getByText('All Notes')).toBeInTheDocument()
    })

    it('clicking sidebar note sets it as active', async () => {
        const sidebar = screen.getByLabelText(/saved notes/i)
        await userEvent.click(within(sidebar).getByText('Unpinned Note'))
        expect(within(sidebar).getByText('Unpinned Note').parentElement)
            .toHaveClass(styles.sidebarItem)
    })

    it('clicking sidebar note switches panelView to "note"', async () => {
        await userEvent.click(screen.getByText('Unpinned Note'))
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('toggle button collapses sidebar', async () => {
        await userEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }))
        expect(screen.queryByRole('complementary', { name: /saved notes/i })).not.toBeInTheDocument()
    })

    it('toggle button aria-label updates on state', async () => {
        await userEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }))
        expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument()
    })
})

describe('Notes — new note flow', () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await openSidebar()
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('clicking + button resets state and shows form', async () => {
        await userEvent.click(screen.getByRole('button', { name: /create new note/i }))
        expect(screen.queryByRole('article')).not.toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: /content to summarise/i })).toBeInTheDocument()
    })
})

describe('Notes — edit flow', () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('handleSubmitEdit sets editId and switches to form view', async () => {
        await userEvent.click(screen.getByRole('button', { name: /edit note/i }))
        expect(screen.getByRole('textbox', { name: /content to summarise/i })).toBeInTheDocument()
        expect(screen.getByText('✎ Edit Note Content')).toBeInTheDocument()
    })

    it('handleCancelEdit clears editId and content', async () => {
        await userEvent.click(screen.getByRole('button', { name: /edit note/i }))
        expect(screen.getByRole('textbox', { name: /content to summarise/i })).toHaveValue(aiNote.summary)
        await userEvent.click(screen.getByRole('button', { name: /cancel editing/i }))
        expect(screen.queryByText('✎ Edit Note Content')).not.toBeInTheDocument()
    })

    it('handleCancelEdit goes to "note" view if activeNoteId exists', async () => {
        await userEvent.click(screen.getByRole('button', { name: /edit note/i }))
        await userEvent.click(screen.getByRole('button', { name: /cancel editing/i }))
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('handleCancelEdit goes to "welcome" if no activeNoteId', async () => {
        cleanup()
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        expect(screen.queryByRole('article')).not.toBeInTheDocument()
        expect(screen.queryByRole('textbox', { name: /content to summarise/i })).not.toBeInTheDocument()
    })
})

describe('Notes — toast', () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    })

    it('toast renders when toast state is set', async () => {
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByText('Note created!')).toBeInTheDocument())
    })

    it('clicking toast close button clears toast', async () => {
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByText('Note created!')).toBeInTheDocument())
        await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))
        await waitFor(() => expect(screen.queryByText('Note created!')).not.toBeInTheDocument())
    })
})


describe('Notes — pin toggle', () => {
    beforeEach(async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [unpinnedNote] }) })
            .mockResolvedValue({ ok: true, json: async () => ({ data: [unpinnedNote] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await openSidebar()
        await waitFor(() => expect(screen.getByText('Unpinned Note')).toBeInTheDocument())
        await userEvent.click(screen.getByText('Unpinned Note'))
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('PATCH request sent to /api/notes/:id/pin on pin', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        await userEvent.click(screen.getByRole('button', { name: /pin note/i }))
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/notes/${unpinnedNote._id}/pin`),
            expect.objectContaining({ method: 'PATCH' })
        ))
    })

    it('updates summaryData.isPinned if current note is active', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        await userEvent.click(screen.getByRole('button', { name: /pin note/i }))
        await waitFor(() => expect(screen.getByRole('button', { name: /unpin note/i })).toBeInTheDocument())
    })

    it('shows error toast if pin request fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false })
        await userEvent.click(screen.getByRole('button', { name: /pin note/i }))
        await waitFor(() => expect(screen.getByText('Pin toggle failed')).toBeInTheDocument())
    })
})

describe('Notes — delete flow', () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('DELETE request sent to correct endpoint', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        await userEvent.click(screen.getByRole('button', { name: /delete note/i }))
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/notes/${aiNote._id}`),
            expect.objectContaining({ method: 'DELETE' })
        ))
    })

    it('resets activeNoteId and goes to welcome if deleted note was active', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        await userEvent.click(screen.getByRole('button', { name: /delete note/i }))
        await waitFor(() => expect(screen.queryByRole('article')).not.toBeInTheDocument())
    })

    it('shows error toast if delete fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false })
        await userEvent.click(screen.getByRole('button', { name: /delete note/i }))
        await waitFor(() => expect(screen.getByText('Delete failed')).toBeInTheDocument())
    })
})

describe('Notes — copy handler', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)

    beforeEach(async () => {
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            writable: true, value: { writeText: writeTextMock }
        })

        writeTextMock.mockClear()

        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await act(async () => {
            socketHandlers['ai-response']({ _id: 'md-1', title: '**Bold**', summary: '*italic*', keyPoints: ['**KP**'], isPinned: false })
        })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('strips markdown from title, summary, keyPoints before copying', async () => {
        await userEvent.click(screen.getByRole('button', { name: /copy note/i }))
        await waitFor(() => expect(writeTextMock).toHaveBeenCalled())
        const text = writeTextMock.mock.calls[0][0]
        expect(text).not.toMatch(/\*\*/)
        expect(text).not.toMatch(/\*[^*]/)
    })

    it('writes plain text to clipboard', async () => {
        await userEvent.click(screen.getByRole('button', { name: /copy note/i }))
        await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith(expect.any(String)))
    })

    it('sets isCopied true then resets after 2s', async () => {
        await userEvent.click(screen.getByRole('button', { name: /copy note/i }))
        vi.useFakeTimers()
        expect(screen.getByRole('button', { name: /copy note/i })).toHaveTextContent('✓ Copied')
        await act(async () => {
            vi.advanceTimersByTime(2000)
        })
        expect(screen.getByRole('button', { name: /copy note/i })).toHaveTextContent('✓ Copied')
    })

    it('shows error toast if clipboard write fails', async () => {
        console.log(global.fetch.mock.calls)
        writeTextMock.mockRejectedValueOnce(new Error('Clipboard error'))
        await userEvent.click(screen.getByRole('button', { name: /copy note/i }))
        await waitFor(() => expect(screen.getByText('Copy failed')).toBeInTheDocument())
    })
})

describe('Notes — socket: ai-response', () => {
    beforeEach(async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    })

    it('ai-response event sets summaryData and switches to note view', async () => {
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article', { name: new RegExp(aiNote.title) })).toBeInTheDocument())
    })

    it('adds new note _id to generatedIds', async () => {
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('calls fetchNotes after ai-response', async () => {
        const callsBefore = global.fetch.mock.calls.length
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(global.fetch.mock.calls.length).toBeGreaterThan(callsBefore))
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/notes'),
            expect.objectContaining({ method: 'GET' })
        )
    })
})