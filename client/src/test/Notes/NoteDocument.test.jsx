/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { NoteDocument } from '../../pages/Notes'
import styles from "/src/pages/styles/notes.module.css";

describe("NoteDocument", ()=>{
    const onEditMock = vi.fn()
    const onDeleteMock = vi.fn()
    const onDownloadMock = vi.fn()
    const onPinMock = vi.fn()
    const onCopyMock = vi.fn()
    
    const noteMock = {
        _id: "1",
        title: "React Notes",
        summary: "This is a summary",
        keyPoints: [
            "Hooks are functions",
            "State triggers re-renders"
        ],
        isPinned: false,
    };

    beforeEach(()=>{
        onEditMock.mockClear()
        onDeleteMock.mockClear()
        onDownloadMock.mockClear()
        onPinMock.mockClear()
        onCopyMock.mockClear()

        render(<NoteDocument note={{...noteMock, isPinned:true }} onCopy={onCopyMock} onDelete={onDeleteMock} onDownload={onDownloadMock} onEdit={onEditMock} onPin={onPinMock} isCopied={true} docRef={ null} />)
    })

    it("renders note title", ()=>{
      const title = screen.getByRole("heading",
        {
            level:1,
            name: noteMock.title
        }
      )

      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent(noteMock.title)
    })

    it("shows Pinned badge when isPinned is true",()=>{

        const unpin = screen.getByText(/^📌 Pinned$/i)

        expect(unpin).toBeInTheDocument()
        
    })

    it("hides Pinned badge when isPinned is false", ()=>{

        cleanup();
        render(
            <NoteDocument note={{ ...noteMock, isPinned: false }} onCopy={onCopyMock} onDelete={onDeleteMock} onDownload={onDownloadMock} onEdit={onEditMock} onPin={onPinMock} isCopied={true} docRef={null} />
        );

        const pin = screen.queryByText(/^📌 Pinned$/i)
        expect(pin).not.toBeInTheDocument()
        
    })

    it("shows Unpin button text when note is pinned", async()=>{
        const button = screen.getByRole("button",
            {
                name: /Unpin note/i
            }
        )

        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent("📌 Unpin")

        await userEvent.click(button)

        expect(onPinMock).toHaveBeenCalledTimes(1)
    })

    it("shows Pin button text when note is not pinned",async()=>{
        cleanup()

        render(
            <NoteDocument note={{ ...noteMock, isPinned: false }} onCopy={onCopyMock} onDelete={onDeleteMock} onDownload={onDownloadMock} onEdit={onEditMock} onPin={onPinMock} isCopied={true} docRef={null} />
        );
        const button = screen.getByRole("button",
            {
                name: /Pin note/i
            }
        )

        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent("📌 Pin")
        await userEvent.click(button)

        expect(onPinMock).toHaveBeenCalledTimes(1)
    })

    it("shows Copied text when isCopied is true", () => {
        const copyBtn = screen.getByRole("button", { name: /copy note/i })
        expect(copyBtn).toHaveTextContent("✓ Copied")
    })

    it("renders Summary section", () => {
        const heading = screen.getByRole("heading", { level: 2, name: "Summary" })
        expect(heading).toBeInTheDocument()
    })

    it("renders Key Points list when keyPoints is array", () => {
        expect(screen.getByText("Hooks are functions")).toBeInTheDocument()
        expect(screen.getByText("State triggers re-renders")).toBeInTheDocument()
    })

    it("renders Key Points list when keyPoints is newline-separated string", () => {
        cleanup()
        render(
            <NoteDocument note={{ ...noteMock, keyPoints: "Hooks are functions\nState triggers re-renders" }} onCopy={onCopyMock} onDelete={onDeleteMock} onDownload={onDownloadMock} onEdit={onEditMock} onPin={onPinMock} isCopied={false} docRef={null} />
        )
        expect(screen.getByText("Hooks are functions")).toBeInTheDocument()
        expect(screen.getByText("State triggers re-renders")).toBeInTheDocument()
    })

    it("hides Key Points section when keyPoints is empty", () => {
        cleanup()
        render(
            <NoteDocument note={{ ...noteMock, keyPoints: [] }} onCopy={onCopyMock} onDelete={onDeleteMock} onDownload={onDownloadMock} onEdit={onEditMock} onPin={onPinMock} isCopied={false} docRef={null} />
        )
        expect(screen.queryByText(/key points/i)).not.toBeInTheDocument()
    })

    it("pads key point numbers with leading zero", () => {
        expect(screen.getByText("01")).toBeInTheDocument()
        expect(screen.getByText("02")).toBeInTheDocument()
    })

    it("calls onPin with note when Pin button clicked", async () => {
        const button = screen.getByRole("button", { name: /unpin note/i })
        await userEvent.click(button)
        expect(onPinMock).toHaveBeenCalledTimes(1)
        expect(onPinMock).toHaveBeenCalledWith({ ...noteMock, isPinned: true })
    })

    it("calls onCopy with note when Copy button clicked", async () => {
        const button = screen.getByRole("button", { name: /copy note/i })
        await userEvent.click(button)
        expect(onCopyMock).toHaveBeenCalledTimes(1)
        expect(onCopyMock).toHaveBeenCalledWith({ ...noteMock, isPinned: true })
    })

    it("calls onDownload with note when PDF button clicked", async () => {
        const button = screen.getByRole("button", { name: /download pdf/i })
        await userEvent.click(button)
        expect(onDownloadMock).toHaveBeenCalledTimes(1)
        expect(onDownloadMock).toHaveBeenCalledWith({ ...noteMock, isPinned: true })
    })

    it("calls onEdit with note when Edit button clicked", async () => {
        const button = screen.getByRole("button", { name: /edit note/i })
        await userEvent.click(button)
        expect(onEditMock).toHaveBeenCalledTimes(1)
        expect(onEditMock).toHaveBeenCalledWith({ ...noteMock, isPinned: true })
    })

})