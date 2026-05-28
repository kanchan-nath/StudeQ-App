import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {scheduleEntry, scheduleExamDates} from "../models/scheduleEntry.model.js"
import { generateStudyPlan } from "../lib/groq/generateStudyPlan.js"
import { StudyPlan } from "../models/studyPlan.js"

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

    const { subject, topic, schedulerDate, duration, completed } = req.body

    const userId = req.user.id

    const data = await scheduleEntry.findOneAndUpdate(
        {
            _id:schedulerId,
            userId
        },
        {
            subject,
            topic,
            schedulerDate,
            duration,
            completed
        },{
            new : true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Scheduler updated successfully"))


})

const generatePlan = asyncHandler(async(req, res)=>{
    const { subjects, hoursPerDay, goalDate } = req.body

    if(!subjects || !hoursPerDay | !goalDate){
        throw new ApiError(400, "All fields are required")
    }

     
    const data = await generateStudyPlan(subjects, hoursPerDay, goalDate)

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Study plan created"))

})

const saveGeneratePlan = asyncHandler(async(req, res)=>{
    const { subjects, hoursPerDay, goalDate, generatedPlan } = req.body

    const userId = req.user.id

    if (!subjects || !hoursPerDay | !goalDate || !generatedPlan) {
        throw new ApiError(400, "All fields are required")
    }


    const data = await StudyPlan.create({
        userId,
        subjects,
        hoursPerDay,
        goalDate,
        generatedPlan
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Study plan saved in mognoDB"))

})

const createExamScheduler = asyncHandler(async(req, res)=>{
    const { subjectName, examDate, examTime, duration, venue, onlineLink, subjectCode, notes, reminderEnabled, reminderDaysBefore, status,  } = req.body

    if(!subjectName || !examDate || !examTime){
        throw new ApiError(400, "All fields are required")
    }

    const userId = req.use.id

    const data = await scheduleExamDates.create({
        userId,
        subjectName,
        examDate,
        examTime,
        duration: duration || undefined,
        venue: venue || undefined,
        onlineLink: onlineLink || undefined,
        subjectCode: subjectCode || undefined,
        notes: notes || undefined,
        reminderEnabled: reminderEnabled,
        reminderDaysBefore: reminderDaysBefore || undefined,
        status: status,



    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Exam date created"))
})

const getExamScheduler = asyncHandler(async(req, res)=>{
    const userId = req.user.id


    const data = scheduleExamDates.find({
        userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All exam dates are fetched "))
})
export {
    createScheduler,
    getScheduler,
    updateScheduler,
    generatePlan,
    saveGeneratePlan,
    createExamScheduler,
    getExamScheduler
}