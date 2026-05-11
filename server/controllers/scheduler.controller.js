import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {scheduleEntry} from "../models/scheduleEntry.model.js"

const createScheduler = asyncHandler(async(req, res)=>{
    const {  subject ,topic, schedulerDate,duration} = req.body

    if (!subject || !topic || !schedulerDate || !duration){
        throw new ApiError(400, "All fields are required")
    }

    const userId = req.user.id

    const data = await scheduleEntry.create({
        userId,
        subject,
        topic,
        schedulerDate,
        duration
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "New scheduler craeted "))
})

const getScheduler = asyncHandler(async(req,res)=>{
    const userId = req.user.id

    const data = await scheduleEntry.find({
        userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All scheduler fetched successfully"))
})

const updateScheduler = asyncHandler(async(req, res)=>{
    const {schedulerId} = req.params

    const { subject, topic, schedulerDate, duration } = req.body

    const userId = req.user.id

    const data = await scheduleEntry.findOneAndUpdate(
        {
            schedulerId,
            userId
        },
        {
            subject,
            topic,
            schedulerDate,
            duration
        },{
            const : true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Scheduler updated successfully"))


})
export {
    createScheduler,
    getScheduler,
    updateScheduler
}