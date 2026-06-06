import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

describe('Dashboard scheduler card', () => {

    beforeEach(() => {
        localStorage.setItem('token', 'fake-token')
    })

    afterEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('shows no sessions message by default', async () => {
        vi.stubGlobal('fetch', vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: { name: 'John', email: 'j@t.com', grade: '9' }
                })
            })
        ))

        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        await waitFor(() => {
            expect(
                screen.getByText('No sessions scheduled today')
            ).toBeInTheDocument()
        })
    })

})