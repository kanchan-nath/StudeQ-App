/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { Toast, WelcomePanel } from '../../pages/Notes'

describe("StyledSummary",()=>{
    const onStartMock = vi.fn()

    beforeEach(()=>{
        onStartMock.mockClear()
        render(<WelcomePanel onStart={onStartMock} />)
    })

    it("")
})