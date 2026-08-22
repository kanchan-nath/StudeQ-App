import { Router } from "express"
// import {
//     generateQuiz,
//     getAllQuiz,
//     getQuizById,
//     submitQuizAnswers,
//     deleteQuiz,
//     generateQuizFromFiles,
//     getResult,
//     getQuizStats,

//     generateFlashcards,
//     getFlashcards,
//     deleteFlashcards,
//     addMoreFlashcards,
//     getFlashcardStats

// } from "../controllers/quiz.controller.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js"
// import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// router.route("/generate").post(verifyJWT, generateQuiz)
// router.route("/stats").get(verifyJWT, getQuizStats)
// router.route("/generate/file").post(verifyJWT,
//     upload.fields([
//         {
//             name: "file"
//         }
//     ]),
//     generateQuizFromFiles)
// router.route("/all").get(verifyJWT, getAllQuiz)


// router.route("/flashcards").post(verifyJWT,
//     upload.fields([
//         {
//             name: "pdfFilePath"
//         }
//     ])
//     , generateFlashcards)
// router.route("/flashcards").get(verifyJWT, getFlashcards)
// router.route("/flashcards/stats").get(verifyJWT, getFlashcardStats)
// router.route("/:id").get(verifyJWT, getQuizById)
// router.route("/:id/submit").patch(verifyJWT, submitQuizAnswers)
// router.route("/:id").delete(verifyJWT, deleteQuiz)
// router.route("/:id/result").get(verifyJWT, getResult)
// router.route("/flashcards/:id").delete(verifyJWT, deleteFlashcards)
// router.route("/flashcards/:id").patch(verifyJWT, addMoreFlashcards)


export default router