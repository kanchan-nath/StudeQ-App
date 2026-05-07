import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { questionAnswer } from "../lib/groq/question-answer.js"

const ask = asyncHandler(async(req, res)=>{
    const {question} = req.body

    if(!question){
        throw new ApiError(400, "Question not found")
    }

    const data = await questionAnswer(question)
    console.log(data);
    
    return res
    .status(200)
    .json(new ApiResponse(200, data, "Answer is provided of that question"))
})

export {
    ask
}