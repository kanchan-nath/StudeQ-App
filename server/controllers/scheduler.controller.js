import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {
    scheduleEntry, 
    scheduleExamDates,
    AssignmentSubmission
} from "../models/scheduleEntry.model.js"
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

// 


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

const getAllExamScheduler = asyncHandler(async(req, res)=>{
    const userId = req.user.id


    const data = scheduleExamDates.find({
        userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All exam dates are fetched "))
})

const deleteExamScheduler = asyncHandler(async(req,res)=>{
    const userId = req.user.id

    const {id} = req.params

    if(!id){
        throw new ApiError(400, "scheduler id is required")
    }

    const data = await scheduleExamDates.findOneAndDelete(
        {
            userId,
            _id:id
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Exam Scheduler is deleted "))
})

const updateExamScheduler = asyncHandler(async(req, res)=>{
    const { subjectName, examDate, examTime, duration, venue, onlineLink, subjectCode, notes, reminderEnabled, reminderDaysBefore, status }= req.body

    const {id} = req.params

    if(!id){
        throw new ApiError(400, "Scheduler id id required")
    }

    const objects = { subjectName, examDate, examTime, duration, venue, onlineLink, subjectCode, notes, reminderEnabled, reminderDaysBefore, status }

    const filteredObjects = Object.fromEntries(
        Object.entries(([key, value])=> value !==undefined)
    )
    console.log(filteredObjects);

    if(Object.keys(filteredObjects).length ===0){
        throw new ApiError(400, "At least one field is required to update")
    }

    const userId = req.user.id

    const data = await scheduleExamDates.findOneAndUpdate(
        {
            _id:id,
            userId
        },
        {
            $set:filteredObjects
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Exam scheduler updated successfully"))

})

const getSchedulerExam  = asyncHandler(async(req, res)=>{
    const {id} = req.params

    if(!id){
        throw new ApiError(400, "Id is required")
    }

    const data = await scheduleExamDates.find({
        _id:id,
        userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Scheduler exam fetched"))
})

// 


const createAssignmentSubmissionScheduler = asyncHandler(async(req, res)=>{
    const { dueDate, allowLateSubmission, linkedAssignmentId } = req.body

    if(!dueDate){
        throw new ApiError(400, "Due date is required")
    }

    const userId = req.user.id

    const data = await AssignmentSubmission.create({
        userId,
        dueDate,
        allowLateSubmission,
        linkedAssignmentId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data,"Assignment scheduler created"))
})

const getAllAssignmentSubmission = asyncHandler(async(req, res)=>{
    const userId = req.user.id

    const data = await AssignmentSubmission.find({userId})

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All assignment submission fetched"))
})
export {
    createScheduler,
    getScheduler,
    updateScheduler,
    generatePlan,
    saveGeneratePlan,


    createExamScheduler,
    getAllExamScheduler,
    deleteExamScheduler,
    updateExamScheduler,
    getSchedulerExam,

    createAssignmentSubmissionScheduler,
    getAllAssignmentSubmission
}