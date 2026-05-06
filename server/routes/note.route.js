import {Router} from "express"
import {createNote, getNote} from "../controllers/note.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/notes").post(verifyJWT, createNote)
router.route("/notes").get(verifyJWT, getNote)

export default router