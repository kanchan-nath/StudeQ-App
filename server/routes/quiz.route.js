import { Router } from "express"
import {
    generateQuiz,
    getQuizzes,
    getQuizAnswer,
    deleteQuiz,
    getAllQuiz,
    
    generateFlashcards,
    getFlashcards,
    deleteFlashcards,
    addMoreFlashcards

} from "../controllers/quiz.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/generate").post(verifyJWT, generateQuiz)
router.route("/:id").get(verifyJWT, getQuizzes)
router.route("/:id/answer").patch(verifyJWT, getQuizAnswer)
router.route("/:id").delete(verifyJWT, deleteQuiz)
router.route("/all").get(verifyJWT, getAllQuiz)
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