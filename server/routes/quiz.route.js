import { Router } from "express"
import {
    generateQuiz,
    getQuizzes,
    getQuizAnswer,

    generateFlashcards,
    getFlashcards,
    deleteFlashcards,
    addMoreFlashcards

} from "../controllers/quiz.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/generate").post(verifyJWT, generateQuiz)
router.route("/quiz/:id").get(verifyJWT, getQuizzes)
router.route("/quiz/:id/answer").patch(verifyJWT, getQuizAnswer)
router.route("/quiz/:id").delete(verifyJWT, getQuizzes)

router.route("/flashcards").post(verifyJWT,
    upload.fields ([
        {
            name:"pdfFilePath"
        }
    ])
    ,generateFlashcards)
router.route("/flashcards").get(verifyJWT, getFlashcards)
router.route("/flashcards/:id").delete(verifyJWT, deleteFlashcards)
router.route("/flashcards/:id").patch(verifyJWT, addMoreFlashcards)


export default router