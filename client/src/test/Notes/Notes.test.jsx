/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, act } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import Notes  from '../../pages/Notes'
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

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    Object.keys(socketHandlers).forEach(k => delete socketHandlers[k])
})

describe("Notes — initial render", ()=>{
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

describe("Notes — panel view switching", ()=>{
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
        await waitFor(() => expect(screen.getByText('Pinned Note')).toBeInTheDocument())
    })

    it('renders "Your Notes" title', () => {
        expect(screen.getByText('Your Notes')).toBeInTheDocument()
    })

    it('shows loading spinner when fetching', async () => {
        cleanup()
        let resolveFetch
        global.fetch = vi.fn().mockReturnValue(new Promise(r => { resolveFetch = r }))
        render(<Notes />)
        await waitFor(() => expect(screen.getByText(/loading…/i)).toBeInTheDocument())
        act(() => resolveFetch({ ok: true, json: async () => ({ data: [] }) }))
    })

    it('shows error message when fetchError is set', async () => {
        cleanup()
        global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
        render(<Notes />)
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch notes'))
    })

    it('shows empty state when notes array is empty', async () => {
        cleanup()
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
        render(<Notes />)
        await waitFor(() => expect(screen.getByText(/no notes yet/i)).toBeInTheDocument())
    })

    it('renders pinned notes group when pinned notes exist', () => {
        expect(screen.getByText('📌 Pinned')).toBeInTheDocument()
        // expect(screen.getByRole('button', { name: /Pinned Note/i })).toBeInTheDocument()
    })

    it('renders "All Notes" group label when both pinned and unpinned exist', () => {
        expect(screen.getByText('All Notes')).toBeInTheDocument()
    })

    it('clicking sidebar note sets it as active', async () => {
        await userEvent.click(screen.getByRole('button', { name: /Unpinned Note/i }))
        expect(screen.getByRole('button', { name: /Unpinned Note/i })).toHaveAttribute('aria-current', 'true')
    })

    it('clicking sidebar note switches panelView to "note"', async () => {
        await userEvent.click(screen.getByRole('button', { name: /Unpinned Note/i }))
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
        await act(async () => { socketHandlers['ai-response'](aiNote) })
        await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument())
    })

    it('clicking + button resets state and shows welcome', async () => {
        await userEvent.click(screen.getByRole('button', { name: /create new note/i }))
        expect(screen.queryByRole('article')).not.toBeInTheDocument()
        expect(screen.queryByRole('textbox', { name: /content to summarise/i })).not.toBeInTheDocument()
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
})

