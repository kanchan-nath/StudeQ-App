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
})
