import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { quiz, flashcards, quizFromFile } from "../lib/groq/quiz.js"
import { Quiz } from "../models/quiz.model.js"
import PDFParse from "pdf-parse";
import fs from "fs"
import { pdfToFlashcard } from "../lib/groq/pdfToFlashcard.js"
import { v4 as uuidv4 } from "uuid" // ✅ ADDED: need this to generate unique quizId on server
import { Flascards } from "../models/flashcard.model.js"
import textExtractor from "../services/textExtractor.js"
import mongoose from "mongoose"
import { answersValidator, quizValidator, generateQuizFromFilesValidator } from "../validators/quiz.validator.js"
import { flashcardValidator } from "../validators/flashcard.validator.js"
import { idParamValidator } from "../validators/params.validator.js"
import { grantXP } from "../services/xpService.js"

const generateQuiz = asyncHandler(async (req, res) => {
    console.log(req.body);
    
    const { data, error } = quizValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { topic, subject, types, title, difficulty, audience } = data

    if (!topic || !subject || !types) {
        throw new ApiError(400, "topic, subject, and types are required")
    }

    const userId = req.user.id

    const quizId = uuidv4()

    const response = await quiz(types, topic, subject, userId)

    if (!Array.isArray(response) || response.length === 0) {
        throw new ApiError(500, "Quiz generation returned invalid data")
    }
    const quizDoc = await Quiz.create({
        userId,
        quiz: {
            title: title || response.title || `${topic} Quiz`,
            totalQuestion: response.length,
        },
        data: response.map(q => ({
            types: q.type,
            question: q.question,
            options: q.options,
            answer: q.answer,
            userResponse: null,
            isCorrect: false
        }))
    })

    return res
        .status(201)
        .json(new ApiResponse(201, quizDoc, "Quiz generated successfully"))
})

const getAllQuiz = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await Quiz.find({ userId }).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All quizzes fetched"))
})

const getQuizById = asyncHandler(async (req, res) => {

    const { data, error } = idParamValidator.safeParse(req.params)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { id } = data

    // if (!(mongoose.Types.ObjectId.isValid(id))) {
    //     throw new ApiError(400, "Invalid quiz ID")
    // }

    const userId = req.user.id

    const quizDoc = await Quiz.findOne({ _id: id, userId })

    if (!quizDoc) {
        throw new ApiError(404, "Quiz not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, quizDoc, "Quiz fetched"))
})

const submitQuizAnswers = asyncHandler(async (req, res) => {
    
    const { data, error } = answersValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { answers } = data


    const isIdValid = idParamValidator.safeParse(req.params)

    if (isIdValid.error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { id } = isIdValid.data

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid quiz ID")
    }

    if (!answers || !Array.isArray(answers)) {
        throw new ApiError(400, "answers must be an array")
    }

    const userId = req.user.id

    const quizDoc = await Quiz.findOne({ _id: id, userId })

    if (!quizDoc) {
        throw new ApiError(404, "Quiz not found")
    }

    let correctCount = 0

    const updatedQuestions = quizDoc.questions.map((q, i) => {
        const userResp = answers[i] ?? null
        const isCorrect = userResp === q.answer

        if (isCorrect) correctCount++

        return {
            ...q.toObject(),
            userResponse: userResp,
            isCorrect
        }
    })

    const totalQ = quizDoc.questions.length
    const scorePercent = Math.round((correctCount / totalQ) * 100)

    const updated = await Quiz.findByIdAndUpdate(
        id,
        {
            questions: updatedQuestions,
            "quiz.meta.submittedAt": new Date().toISOString(),
            "quiz.meta.score": `${correctCount}/${totalQ}`
        },
        { new: true }
    )

    let xpResult = null
    try {
        xpResult = await grantXP(req.user.id, "QUIZ_COMPLETE")
    } catch (err) {
        logger.error("XP grant failed:", err.message) 
    }


    return res
        .status(200)
        .json(new ApiResponse(200, {
            quiz: updated,
            score: scorePercent,
            correct: correctCount,
            total: totalQ
        }, "Quiz submitted successfully"))
})

const deleteQuiz = asyncHandler(async (req, res) => {

    const { data, error } = idParamValidator.safeParse(req.params)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { id } = data

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid quiz ID")
    }

    const userId = req.user.id

    const deleted = await Quiz.findOneAndDelete({ _id: id, userId })

    if (!deleted) {
        throw new ApiError(404, "Quiz not found or unauthorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Quiz deleted"))
})

const generateQuizFromFiles = asyncHandler(async (req, res) => {
    const { data, error } = generateQuizFromFilesValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { types } = data
    
    const userId = req.user.id

    const localFile = req.files?.file?.[0]

    if (!types || !localFile) {
        throw new ApiError(400, "file and types are required")
    }

    const extractedText = await textExtractor(localFile)

    const response = await quizFromFile(types, extractedText, userId)

    const { title, questions } = response

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new ApiError(500, "Quiz generation returned invalid data")
    }

    const quizDoc = await Quiz.create({
        userId,
        quiz: {
            title,
            totalQuestion: questions.length,
        },
        questions: questions.map(q => ({
            types: q.type,
            question: q.question,
            options: q.options,
            answer: q.answer,
            userResponse: null,
            isCorrect: false
        }))
    })

    return res
        .status(201)
        .json(new ApiResponse(201, quizDoc, "Quiz created from file"))
})

const getResult = asyncHandler(async (req, res) => {

    const { data, error } = idParamValidator.safeParse(req.params)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { id } = data

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid quiz ID")
    }

    const userId = req.user.id

    const dbData = await Quiz.find({ _id: id, userId })

    if (!dbData) {
        throw new ApiError(404, "Quiz not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, dbData, "Quiz result fetched"))

})

// ── Quiz stats for dashboard ─────────────────────────────────────────────────
const getQuizStats = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const allQuizzes = await Quiz.find({ userId }).select("quiz.meta.score").lean()

    const total = allQuizzes.length

    // Extract numeric scores from "correct/total" string e.g. "7/10"
    const scores = allQuizzes
        .map(q => q.quiz?.meta?.score)
        .filter(Boolean)
        .map(s => {
            const [correct, total] = s.split("/").map(Number)
            return total > 0 ? Math.round((correct / total) * 100) : null
        })
        .filter(n => n !== null)

    const lastScore = scores.at(-1) ?? 0
    const avgScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

    return res
        .status(200)
        .json(new ApiResponse(200, { total, lastScore, avgScore }, "Quiz stats fetched"))
})


const generateFlashcards = asyncHandler(async (req, res) => {
    const { data, error } = flashcardValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }

    const { topic, subject, flashcardId } = data

    const pdfFile = req.files?.pdfFilePath?.[0]
    const userId = req.user.id

    if (pdfFile) {
        const extractedText = await textExtractor(pdfFile)

        const { difficultyLevel, card } = await pdfToFlashcard(extractedText, userId)

        const data = await Flascards.create({
            userId,
            difficultyLevel,
            flashcards: card
        })

        return res
            .status(200)
            .json(new ApiResponse(201, data, "Flashcard generated"))

    } else {
        if (!topic || !subject) {
            throw new ApiError(400, "topic and subject are required")
        }

        const flashcardId = uuidv4()

        const { difficultyLevel, card } = await flashcards(topic, subject, userId)

        const data = await Flascards.create({
            userId,
            flashcardId,
            flashcards: card,
            subject,
            topic,
            difficultyLevel
        })

        try {
            await grantXP(req.user.id, "FLASHCARD_SESSION")
        } catch (err) {
            logger.error("XP grant failed:", err.message) // non-fatal
        }

        return res
            .status(201)
            .json(new ApiResponse(201, data, "Flashcards generated successfully"))
    }

})

const getFlashcards = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const existedFlashcards = await Flascards.find({ userId })

    return res
        .status(200)
        .json(new ApiResponse(200, existedFlashcards, "All flashcards fetched"))
})

const deleteFlashcards = asyncHandler(async (req, res) => {
    const { data, error } = idParamValidator.safeParse(req.params)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { id } = data

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid flashcard ID")
    }

    const userId = req.user.id

    const dbData = await Flascards.findOneAndDelete(
        {
            userId,
            _id: id
        },

    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Flashcard deleted successfully"))
})


const addMoreFlashcards = asyncHandler(async (req, res) => {
    const { data, error } = generateQuizFromFilesValidetor.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { topic, subject, flashcardId } = data

    const isIdValid = idParamValidator.safeParse(req.params)

    if (isIdValid.error) {
        throw new ApiError(400, (isIdValid.error).issues.map(e => e.message).join(", "))
    }
    const { id } = isIdValid.data
    if (!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid flashcard ID")
    }
    const userId = req.user.id

    const { card } = await flashcards(topic, subject, userId)

    const dbData = await Flascards.findOneAndUpdate(
        {
            _id: id,
            userId,
        },
        {
            $push: {
                flashcards: {
                    $each: card
                }
            }
        },
        { new: true }
    )

    if (!data){
        throw new ApiError(404, "Flashcard not found or unauthorized")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, dbData, "Flashcard updated successfully"))

})

const getFlashcardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const allDecks = await Flascards.find({ userId }).select("flashcards createdAt").lean()

    const total = allDecks.reduce((sum, deck) => sum + (deck.flashcards?.length ?? 0), 0)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const dueToday = allDecks
        .filter(deck => new Date(deck.createdAt) >= todayStart)
        .reduce((sum, deck) => sum + (deck.flashcards?.length ?? 0), 0)

    return res
        .status(200)
        .json(new ApiResponse(200, { total, dueToday }, "Flashcard stats fetched"))
})

export {
    generateQuiz,
    getAllQuiz,
    getQuizById,
    submitQuizAnswers,
    deleteQuiz,
    generateQuizFromFiles,
    getResult,
    getQuizStats,

    generateFlashcards,
    getFlashcards,
    deleteFlashcards,
    addMoreFlashcards,
    getFlashcardStats
}