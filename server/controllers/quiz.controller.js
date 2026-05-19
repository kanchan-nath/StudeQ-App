import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { quiz, flashcards, quizFromFile } from "../lib/groq/quiz.js"
import { Quiz } from "../models/quiz.model.js"
import { Flascards } from "../models/flashcard.model.js"
import { PDFParse } from "pdf-parse"
import fs from "fs"
import {pdfToFlashcard} from "../lib/groq/pdfToFlashcard.js"

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

const getQuizAnswer = asyncHandler(async (req, res) => {
    const {answer} = req.body
    const {id} = req.params
    console.log(id);
    
    const userId = req.user.id

    if(!answer || !id ){
        throw new  ApiError(404, "All fields are required")
    }

    const data = await Quiz.findOneAndUpdate(
        {
            _id:id,
            userId
            
        },
        {
            userAnswer:answer
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "User answer is updated"))
})

const deleteQuiz = asyncHandler(async(req, res)=>{
    const {id} = req.params

    if(!id){
        throw new ApiError(404, "Quiz id is not found")
    }

    const userId = req.user.id

    await Quiz.findByIdAndDelete(id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Quiz deleted"))
})

const getAllQuiz = asyncHandler(async(req, res)=>{
    const userId = req.user.id

    const data = await Quiz.find({userId})

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All quiz lists fetched"))
})

const generateQuizFromFiles = asyncHandler(async(req, res)=>{
    const {file} = req.body


    const localFilePath = req.files?.file?.[0].path
    console.log(localFilePath);

    const dataBuffer = fs.readFileSync(localFilePath)
    const unit8Array = await Uint8Array(dataBuffer)
    const parser = new PDFParse(unit8Array)

    const extractedText = parser.getText()

    console.log(extractedText);
    const result = await quizFromFile(extractedText)
    console.log(data);
    

    const data = ""

    
    const userId = req.user.id
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
    getQuizzes,
    getQuizAnswer,
    deleteQuiz,
    getAllQuiz,
    generateQuizFromFiles,

    generateFlashcards,
    getFlashcards,
    deleteFlashcards,
    addMoreFlashcards
}