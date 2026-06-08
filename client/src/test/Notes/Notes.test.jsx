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