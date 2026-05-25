import { Router } from "express"
import {
    generateQuiz,
    getAllQuiz,
    getQuizById,
    submitQuizAnswers,
    deleteQuiz,
    generateQuizFromFiles,
    getResult,

    generateFlashcards,
    getFlashcards,
    deleteFlashcards,
    addMoreFlashcards

} from "../controllers/quiz.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// flashcard routes FIRST
router.route("/flashcards").post(verifyJWT, upload.fields([{ name: "pdfFilePath" }]), generateFlashcards)
router.route("/flashcards").get(verifyJWT, getFlashcards)
router.route("/flashcards/:id").delete(verifyJWT, deleteFlashcards)
router.route("/flashcards/:id").patch(verifyJWT, addMoreFlashcards)

// THEN /:id routes
router.route("/:id").get(verifyJWT, getQuizById)
router.route("/:id/submit").patch(verifyJWT, submitQuizAnswers)
router.route("/:id").delete(verifyJWT, deleteQuiz)
router.route("/:id/result").get(verifyJWT, getResult)


export default router