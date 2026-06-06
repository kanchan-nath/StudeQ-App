import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

// mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

describe('Dashboard handleLogout', () => {

    beforeEach(() => {
        localStorage.setItem('token', 'fake-token')
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => { })))
    })

    afterEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
        mockNavigate.mockReset()
    })

    it('removes token from localStorage on logout', async () => {
        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        const logoutBtn = screen.getByRole('button', { name: /logout/i })
        await userEvent.click(logoutBtn)

        expect(localStorage.getItem('token')).toBeNull()
    })

    it('navigates to /login on logout', async () => {
        render(<MemoryRouter><Dashboard /></MemoryRouter>)

        const logoutBtn = screen.getByRole('button', { name: /logout/i })
        await userEvent.click(logoutBtn)

        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

})