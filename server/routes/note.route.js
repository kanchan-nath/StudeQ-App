import {Router} from "express"
import { createNote, getNote, deleteNote } from "../controllers/note.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/notes").post(verifyJWT, createNote)
router.route("/notes").get(verifyJWT, getNote)
router.route("/notes/:id").delete(verifyJWT, deleteNote)

export default router