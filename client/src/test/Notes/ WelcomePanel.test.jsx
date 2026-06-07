/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { Toast, WelcomePanel } from '../../pages/Notes'

describe("WelcomePanel", ()=>{
    it("renders heading and subtitle text",()=>{
        const onStartMock = vi.fn()

        render(<WelcomePanel onStart={onStartMock} />)

        const heading = screen.getByRole("heading",
            {
                name:/Your Knowledge, Distilled/i
            }
        )

        const subtitleText = screen.getByText(/Paste any text/i)

        expect(heading).toBeInTheDocument()
        expect(subtitleText).toBeInTheDocument()

    })

    it("renders all 4 feature cards",()=>{
        const onStartMock = vi.fn()

        render(<WelcomePanel onStart={onStartMock} />)

        const card1 = screen.getByTestId("welcome-card1")
        const card2 = screen.getByTestId("welcome-card2")
        const card3 = screen.getByTestId("welcome-card3")
        const card4 = screen.getByTestId("welcome-card4")

        expect(screen.getByTestId("welcome-card")).toBeInTheDocument()
        expect(card1).toHaveTextContent("Smart Summaries")
        expect(card1).toHaveTextContent("AI condenses long content")
        expect(card2).toHaveTextContent("Key Point Extraction")
        expect(card2).toHaveTextContent("Never miss the important")
        expect(card3).toBeInTheDocument("Export Anywhere")
        expect(card3).toBeInTheDocument("Copy to clipboard or download as PDF instantly")
        expect(card4).toBeInTheDocument("Pin & Organise")
        expect(card4).toBeInTheDocument("Keep your most important notes front and centre")

    })

    it("calls onStart when CTA button clicked",async()=>{
        const onStartMock = vi.fn()

        render(<WelcomePanel onStart={onStartMock} />)

        const button = screen.getByRole("button")

        await userEvent.click(button)

        expect(onStartMock).toHaveBeenCalledTimes(1)
    })

    it("has aria-label on section", ()=>{
        const onStartMock = vi.fn()

        render(<WelcomePanel onStart={onStartMock} />)

        expect(screen.getByRole("region",{
            name:/Welcome screen/
        })).toBeInTheDocument()
    })
})