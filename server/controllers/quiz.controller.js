import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { quiz, flashcards } from "../lib/groq/quiz.js"
import { Quiz } from "../models/quiz.model.js"
import { Flascards } from "../models/flashcard.model.js"

const generateQuiz = asyncHandler(async (req, res) => {
    const { topic, subject, quizId } = req.body
    const userId = req.user.id

    if (!topic || !subject || !quizId) {
        throw new ApiError(400, "All fields are required")
    }

    const data = await quiz(topic, subject)
    console.log(data);


    let quizStore = await Quiz.findOne({ quizId })

    if (!quizStore) {
        await Quiz.create({
            userId,
            quizId,
            quiz: data
        })
    } else {
        await Quiz.findOneAndUpdate(
            {
                quizId,
            },
            {
                $push: {
                    quiz: {
                        $each: data
                    }
                }
            }
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Quiz generate successfully"))
})

const getQuizzes = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const existedQuiz = await Quiz.find({ userId })

    if (!existedQuiz) {
        throw new ApiError(400, "No quizzes found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, existedQuiz, "All quizzes fetched"))
})

const getQuizAnswer = asyncHandler(async (req, rs) => {

})


const generateFlashcards = asyncHandler(async (req, res) => {
    const { topic, subject, flashcardId } = req.body
    const userId = req.user.id

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
    getQuizzes,
    getQuizAnswer,

    generateFlashcards,
    getFlashcards,
    deleteFlashcards,
    addMoreFlashcards
}