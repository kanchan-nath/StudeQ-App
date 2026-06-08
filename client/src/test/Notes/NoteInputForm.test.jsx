/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { NoteInputForm } from '../../pages/Notes'
import styles from "/src/pages/styles/notes.module.css";

describe('NoteInputForm', () => {
    const onChangeMock = vi.fn()
    const onSubmitMock = vi.fn()
    const onCancelEditMock = vi.fn()

    beforeEach(() => {
        onChangeMock.mockClear()
        onSubmitMock.mockClear()
        onCancelEditMock.mockClear()

        render(<NoteInputForm content="" onChange={onChangeMock} onSubmit={onSubmitMock} loading={false} editId={null} onCancelEdit={onCancelEditMock} inputRef={null} />)
    })

    it("renders '✦ New Note' label when no editId", () => {
        expect(screen.getByText("✦ New Note")).toBeInTheDocument()
    })

    it("renders '✎ Edit Note Content' label when editId provided", () => {
        cleanup()
        render(<NoteInputForm content="" onChange={onChangeMock} onSubmit={onSubmitMock} loading={false} editId="abc123" onCancelEdit={onCancelEditMock} inputRef={null} />)
        expect(screen.getByText("✎ Edit Note Content")).toBeInTheDocument()
    })

    it("shows Cancel button when editId provided", () => {
        cleanup()
        render(<NoteInputForm content="" onChange={onChangeMock} onSubmit={onSubmitMock} loading={false} editId="abc123" onCancelEdit={onCancelEditMock} inputRef={null} />)
        expect(screen.getByRole("button", { name: /cancel editing/i })).toBeInTheDocument()
    })

    it("hides Cancel button when no editId", () => {
        expect(screen.queryByRole("button", { name: /cancel editing/i })).not.toBeInTheDocument()
    })

    it("textarea shows placeholder when empty", () => {
        const textarea = screen.getByRole("textbox", { name: /content to summarise/i })
        expect(textarea).toHaveAttribute("placeholder", "Paste your lecture notes, article, or any text here…")
    })

    it("shows character count when content is not empty", () => {
        cleanup()
        render(<NoteInputForm content="Hello World" onChange={onChangeMock} onSubmit={onSubmitMock} loading={false} editId={null} onCancelEdit={onCancelEditMock} inputRef={null} />)
        expect(screen.getByText("11 characters")).toBeInTheDocument()
    })

    it("shows tip text when content is empty", () => {
        expect(screen.getByText("Tip: longer text = richer summary")).toBeInTheDocument()
    })

    it("shows spinner and 'Summarising…' text when loading", () => {
        cleanup()
        render(<NoteInputForm content="" onChange={onChangeMock} onSubmit={onSubmitMock} loading={true} editId={null} onCancelEdit={onCancelEditMock} inputRef={null} />)
        expect(screen.getByRole("button", { name: /summarising/i })).toHaveTextContent("Summarising…")
    })

    it("shows '✦ Update Note' on submit button when editId set", () => {
        cleanup()
        render(<NoteInputForm content="" onChange={onChangeMock} onSubmit={onSubmitMock} loading={false} editId="abc123" onCancelEdit={onCancelEditMock} inputRef={null} />)
        expect(screen.getByRole("button", { name: /update note/i })).toHaveTextContent("✦ Update Note")
    })
})
