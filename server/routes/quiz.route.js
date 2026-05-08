import { Router } from "express"
import {
    generateQuiz,
    generateFlashcards
} from "../controllers/quiz.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/generate").post(verifyJWT, generateQuiz)
router.route("/flashcards").post(verifyJWT, generateFlashcards)



export default router