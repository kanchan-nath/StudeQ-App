import {Router} from "express"
import { createNote, getNote, deleteNote, updateNote } from "../controllers/note.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/notes").post(verifyJWT, createNote)
router.route("/notes").get(verifyJWT, getNote)
router.route("/notes/:id").delete(verifyJWT, deleteNote)
router.route("/notes/:id").patch(verifyJWT, updateNote)

export default router