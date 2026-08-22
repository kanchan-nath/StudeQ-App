import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"

/**
 * Single source of truth for PDF text extraction.
 * Swap engine here only — callers never touch the lib directly.
 * @param {Uint8Array|Buffer} input
 * @returns {Promise<{ text: string, numpages: number }>}
 */
export const extractPdfText = async (input) => {
    const uint8Array = input instanceof Uint8Array ? input : new Uint8Array(input)
    const loadingTask = getDocument({ data: uint8Array })
    const pdf = await loadingTask.promise

    let text = ""
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(item => item.str).join(" ") + "\n"
        page.cleanup()
    }

    return { text: text.trim(), numpages: pdf.numPages }
}