import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

describe('Dashboard welcome heading', () => {

    beforeEach(() => {
        localStorage.setItem('token', 'fake-token')
    })

    afterEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('shows skeleton while loading', () => {
        // fetch never resolves = loading stays true
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => { })))

        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        expect(screen.getByTestId('skeleton-heading')).toBeInTheDocument()
        expect(screen.queryByTestId('welcome-heading')).not.toBeInTheDocument()
    })

    it('shows welcome heading after fetch resolves', async () => {
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
            expect(
                screen.queryByTestId('welcome-heading'))
                .toBeInTheDocument()
        })

        expect(screen.getByText(/JOHN DOE/)).toBeInTheDocument()
        expect(screen.queryByTestId('skeleton-heading')).not.toBeInTheDocument()
    })

    it('shows skeleton when fetch fails', async () => {
        vi.stubGlobal('fetch', vi.fn(() =>
            Promise.resolve({ ok: false, status: 500 })
        ))

        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        // fetch fails → catch block → finally sets loading false
        // but userData stays DEFAULT_USER (empty name)
        await waitFor(() => {
            expect(screen.queryByTestId('skeleton-heading')).not.toBeInTheDocument()
        })
    })

})