/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { StyledSummary } from '../../pages/Notes'
import styles from "/src/pages/styles/notes.module.css";

describe("StyledSummary", () => {

    it("renders h2 for # heading", () => {
        render(<StyledSummary content="# Hello World!" />)

        const h2 = screen.getByRole("heading",
            {
                level: 2,
                name: "Hello World!"
            }
        )

        expect(h2).toBeInTheDocument()
    })

    it("renders h3 for # heading", () => {
        render(<StyledSummary content="## Hello World!" />)

        const h3 = screen.getByRole("heading",
            {
                level: 3,
                name: "Hello World!"
            }
        )

        expect(h3).toBeInTheDocument()
    })

    it("renders h4 for # heading", () => {
        render(<StyledSummary content="### Hello World!" />)

        const h4 = screen.getByRole("heading",
            {
                level: 4,
                name: "Hello World!"
            }
        )

        expect(h4).toBeInTheDocument()
    })

    it("renders ul and li for - bullet lines", () => {
        render(<StyledSummary content=
            {
                `
                 - Bleach
                 - Naruto
                 - One Piece
                `
            } />)

        const list = screen.getByRole("list")

        expect(list).toBeInTheDocument()

        const listitems = screen.getAllByRole("listitem")

        expect(listitems).toHaveLength(3)
        expect(listitems[0]).toHaveTextContent("Bleach")
        expect(listitems[1]).toHaveTextContent("Naruto")
        expect(listitems[2]).toHaveTextContent("One Piece")

    })

    it("renders ul and li for * bullet lines", () => {
        render(<StyledSummary content=
            {
                `
                 * Bleach
                 * Naruto
                 * One Piece
                `
            } />)

        const list = screen.getByRole("list")

        expect(list).toBeInTheDocument()

        const listitems = screen.getAllByRole("listitem")

        expect(listitems).toHaveLength(3)
        expect(listitems[0]).toHaveTextContent("Bleach")
        expect(listitems[1]).toHaveTextContent("Naruto")
        expect(listitems[2]).toHaveTextContent("One Piece")

    })

    it("renders paragraph div for plain text", () => {
        const { container } = render(<StyledSummary content="Hello World" />)

        const div = container.querySelector(`.${styles["sum-para"]}`);
        expect(div).toBeInTheDocument()
        expect(div).toHaveTextContent("Hello World")
    })

    it("skips empty lines without rendering element",()=>{
        const { container } = render(<StyledSummary content={
            `
            
            
            `
        }/>)

        const div = container.querySelector(`.${styles["sum-para"]}`)

        expect(div).not.toBeInTheDocument()
        expect(screen.queryByRole("heading")).not.toBeInTheDocument()
        expect(screen.queryByRole("list")).not.toBeInTheDocument()
        expect(screen.queryByText(/.+/)).not.toBeInTheDocument()
    })

    it("groups consecutive bullet lines into single ul", ()=>{
        const { container } = render(<StyledSummary content={
            `
                - Naruto
                - Bleach
                - One Piece
            `
        }/>)

        const list = screen.getAllByRole("list")
        const items = screen.getAllByRole("listitem")

        expect(list).toHaveLength(1)
        expect(items).toHaveLength(3);
    })
})