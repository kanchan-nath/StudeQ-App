import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { quiz, flashcards, quizFromFile } from "../lib/groq/quiz.js"
import { Quiz } from "../models/quiz.model.js"
import { PDFParse } from "pdf-parse"
import fs from "fs"
import { pdfToFlashcard } from "../lib/groq/pdfToFlashcard.js"
import { v4 as uuidv4 } from "uuid" // ✅ ADDED: need this to generate unique quizId on server
import { Flascards } from "../models/flashcard.model.js"
import textExtractor from "../services/textExtractor.js"
import mongoose from "mongoose"
import { quizValidator } from "../validators/quizValidator.js"

const generateQuiz = asyncHandler(async (req, res) => {    
    const {data, error} = quizValidator.safeParse(req.body)

    if(error){
        throw new ApiError(400, error.issues.map(e=>e.message).join(", "))
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


// ─────────────────────────────────────────────
// GET SINGLE QUIZ BY ID
// GET /api/quiz/:id
// ─────────────────────────────────────────────
const getQuizById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    // ✅ ADDED: was missing entirely — needed for quiz-taking screen to load questions
    const quizDoc = await Quiz.findOne({ _id: id, userId })

    if (!quizDoc) {
        throw new ApiError(404, "Quiz not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, quizDoc, "Quiz fetched"))
})


// ─────────────────────────────────────────────
// SUBMIT QUIZ ANSWERS
// PATCH /api/quiz/:id/submit
// Body: { answers: ["answer1", "answer2", ...] }
//       answers array index maps to questions array index
// ─────────────────────────────────────────────
const submitQuizAnswers = asyncHandler(async (req, res) => {
    const { answers } = req.body   // array of user answer strings, index-matched to questions
    const { id } = req.params
    const userId = req.user.id

    if (!answers || !Array.isArray(answers)) {
        throw new ApiError(400, "answers must be an array")
    }

    // Load quiz to compare answers
    const quizDoc = await Quiz.findOne({ _id: id, userId })

    if (!quizDoc) {
        throw new ApiError(404, "Quiz not found")
    }

    let correctCount = 0

    // ✅ FIX: old getQuizAnswer only stored one answer string on the whole doc
    //         New: iterate each question, store userResponse + mark isCorrect
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

    // Update questions + meta (score, submittedAt) in one operation
    const updated = await Quiz.findByIdAndUpdate(
        id,
        {
            questions: updatedQuestions,
            "quiz.meta.submittedAt": new Date().toISOString(),
            "quiz.meta.score": `${correctCount}/${totalQ}` // e.g. "7/10"
        },
        { new: true } // return updated doc
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {
            quiz: updated,
            score: scorePercent,
            correct: correctCount,
            total: totalQ
        }, "Quiz submitted successfully"))
})


// ─────────────────────────────────────────────
// DELETE QUIZ
// DELETE /api/quiz/:id
// ─────────────────────────────────────────────
const deleteQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    if (!id) {
        throw new ApiError(400, "Quiz id is required")
    }

    // ✅ FIX: old code deleted by _id only — anyone could delete anyone's quiz
    //         Now checks userId too so users can only delete their own quizzes
    const deleted = await Quiz.findOneAndDelete({ _id: id, userId })

    if (!deleted) {
        throw new ApiError(404, "Quiz not found or unauthorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Quiz deleted"))
})


// ─────────────────────────────────────────────
// GENERATE QUIZ FROM UPLOADED FILE (PDF)
// POST /api/quiz/generate-from-file
// Multipart: file (PDF), body: { types, total }
// ─────────────────────────────────────────────
const generateQuizFromFiles = asyncHandler(async (req, res) => {    
    const { types, total } = req.body
    const userId = req.user.id
    const localFilePath = req.files?.file?.[0].path
    console.log("Types: ",types);
    
    if (!types || !localFilePath || !total) {
        throw new ApiError(400, "file, types, and total are required")
    }

    let extractedText = ""

    try {
        // Read PDF buffer and extract text
        const dataBuffer = fs.readFileSync(localFilePath)
        const unit8Array = new Uint8Array(dataBuffer)
        const parser = new PDFParse(unit8Array)
        const result = await parser.getText()
        extractedText = result.text
    } finally {
        // ✅ FIX: old code had fs.unlinkSync AFTER return statement (unreachable)
        //         Now cleanup always runs in finally block
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
    }

    // Pass extracted text to Groq — types is JSON string from FormData, parse it
    // const parsedTypes = typeof types === "string" ? JSON.parse(types) : types
    const result = await quizFromFile(types, extractedText, parseInt(total))
    const { title, questions } = result

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

const getResult = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const userId = req.user.id

    if(!id){
        throw new ApiError(404, "Quiz not found")
    }

    const data = await Quiz.find({_id:id})

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All results"))

})


const generateFlashcards = asyncHandler(async (req, res) => {
    const { topic, subject, flashcardId } = req.body
    const pdfFile = req.files?.pdfFilePath?.[0].path
    const userId = req.user.id
    console.log(pdfFile);
    
    if (pdfFile) {
        console.log(pdfFile);
        
        try {
            const dataBuffer = fs.readFileSync(pdfFile)
            const unit8Array = new Uint8Array(dataBuffer)
            const parser = new PDFParse(unit8Array)

            const extractedText = await parser.getText()
            
            const {difficultyLevel , card} = await pdfToFlashcard(extractedText.text)            
            
            const data = await Flascards.create({
                userId,
                difficultyLevel,
                flashcards: card
            })
            return res
            .status(200)
            .json(new ApiResponse(200, data, "Flashcard generated"))
            fs.unlinkSync(pdfFile)
        }finally {
            if (pdfFile && fs.existsSync(pdfFile)) {
                fs.unlinkSync(pdfFile)
        }
    }

    } else {
        if (!topic || !subject || !flashcardId) {
            throw new ApiError(400, "All fields are required")
        }

        const { difficultyLevel, card } = await flashcards(topic, subject)
        

        let flashcard = await Flascards.findOne({
            flashcardId
        })

        if (!flashcard) {
            const data = await Flascards.create({
                userId,
                flashcardId,
                flashcards: card,
                subject,
                topic,
                difficultyLevel
            })

            return res
                .status(200)
                .json(new ApiResponse(200, data, "FLashcards generate successfully"))
        } else {
            const updatedData = await Flascards.updateOne(
                {
                    flashcardId
                },
                {
                    $push: {
                        flashcards: {
                            $each: data
                        }
                    }
                }
            )
            return res
                .status(200)
                .json(new ApiResponse(200, updatedData, "FLashcards generate successfully"))
        }
    }

})

const getFlashcards = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const existedFlashcards = await Flascards.find({ userId })

    if (!existedFlashcards) {
        throw new ApiError(400, "No flashcard found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, existedFlashcards, "All flashcards fetched"))
})

const deleteFlashcards = asyncHandler(async (req, res) => {
    const { id } = req.params

    const userId = req.user.id

    const data = await Flascards.findOneAndDelete(
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
    const { topic, subject, flashcardId } = req.body
    const { id } = req.params
    const userId = req.user.id

    const result = await flashcards(topic, subject)

    const data = await Flascards.findOneAndUpdate(
        {
            _id: id,
            // userId,
            // flashcardId
        },
        {
            $push: {
                flashcards: {
                    $each: result
                }
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Flashcard updated successfully"))

})

export {
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
}