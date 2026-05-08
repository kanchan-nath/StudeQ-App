import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {quiz} from "../lib/groq/quiz.js"
import {Quiz} from "../models/quiz.model.js"

const generateQuiz = asyncHandler(async(req, res)=>{
    const {topic, subject, quizId} = req.body
    const userId = req.user.id

    if(!topic || !subject || !quizId){
        throw new ApiError(400, "All fields are required")
    }

    const data =await quiz(topic, subject)
    console.log(data);
    
    
    let quizStore = await Quiz.findOne({quizId})

    if (!quizStore){
        await Quiz.create({
            userId,
            quizId,
            quiz:data
        })
    }else{
        await Quiz.findOneAndUpdate(
            {
                quizId,
            },
            {
                $push:{
                    quiz:{
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


export {
    generateQuiz
}