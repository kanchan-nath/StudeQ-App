import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

describe('Dashboard profile card', () => {

    beforeEach(() => {
        localStorage.setItem('token', 'fake-token')
    })

    afterEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('shows ellipsis avatar while loading', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => { })))

        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        // avatar shows "…" during load
        expect(screen.getByText('…')).toBeInTheDocument()
    })

    it('shows user initials after load', async () => {
        vi.stubGlobal('fetch', vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: { name: 'John Doe', email: 'john@test.com', grade: '10' }
                })
            })
        ))

        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        await waitFor(() => {
            expect(screen.getAllByText(/john doe/i)).toHaveLength(2)// initials
        })
    })

    it('shows user email after load', async () => {
        vi.stubGlobal('fetch', vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: { name: 'John Doe', email: 'john@test.com', grade: '10' }
                })
            })
        ))

        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        await waitFor(() => {
            expect(screen.getByText('john@test.com')).toBeInTheDocument()
        })
    })

})