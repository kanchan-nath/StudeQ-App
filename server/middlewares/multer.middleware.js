import multer from "multer"
import path from "path"
import fs from "fs"
import crypto from "crypto"
import { fileURLToPath } from "url"

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads")

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const safeName = `${crypto.randomBytes(16).toString("hex")}${ext}`
        cb(null, safeName)
    }
})

const ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
])

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`File type not allowed: ${file.mimetype}`), false)
    }
}


export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: Number(process.env.MAX_UPLOAD_SIZE_MB || 20) * 1024 * 1024, 
        files: 1 
    }
})