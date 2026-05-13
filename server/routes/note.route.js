import {Router} from "express"
import { createNote, getNote, deleteNote, updateNote, tooglePin } from "../controllers/note.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/notes").post(verifyJWT, createNote)
router.route("/notes").get(verifyJWT, getNote)
router.route("/notes/:id").delete(verifyJWT, deleteNote)
router.route("/notes/:id").patch(verifyJWT, updateNote)
router.route("/notes/:id/pin").patch(verifyJWT, tooglePin)


export default router