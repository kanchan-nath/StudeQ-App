/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Toast } from '../../pages/Notes'
import {userEvent} from "@testing-library/user-event"
describe("Toast",()=>{
    it("renders message text", ()=>{
        const onCloseMock = vi.fn()

        render(<Toast message="Hello World" type='Success' onClose={onCloseMock}/>)

        expect(screen.getByText("Hello World")).toBeInTheDocument()
    })

    it("renders ✦ icon for success type",()=>{
        const onCloseMock = vi.fn()

        render(<Toast message="Hello World" type='success' onClose={onCloseMock} />)

        expect(screen.getByText("✦")).toBeInTheDocument()
    })

    it("renders ✕ icon for error type", () => {
        const onCloseMock = vi.fn()

        render(<Toast message="Hello World" type='error' onClose={onCloseMock} />)

        expect(screen.getByText("x")).toBeInTheDocument()
    })

    it("calls onClose when close button clicked", async ()=>{
        const onCloseMock = vi.fn()

        render(<Toast message= "Hello World" type = 'error' onClose = { onCloseMock } /> )

        const button = screen.getByRole("button", {name: /dismiss/i})

        await userEvent.click(button)
        
        expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    test('has role="alert"', () => {
        render(
            <Toast
                message="Saved successfully"
                onClose={vi.fn()}
            />
        );

        expect(screen.getByRole("alert")).toBeInTheDocument();
    });
})