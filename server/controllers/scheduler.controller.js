import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {
    scheduleEntry,
    scheduleExamDates,
    AssignmentSubmission,
    ProjectSubmission,
    TimeTable,
    RawSchedule,
    ToDoList
} from "../models/scheduleEntry.model.js"
import { generateStudyPlan } from "../lib/groq/generateStudyPlan.js"
import { StudyPlan } from "../models/studyPlan.model.js"
import pdfToImages from "../services/pdfToImages.js"
import { PDFParse } from "pdf-parse"
import fs, { rmSync } from "fs"
import createSchedule from "../lib/groq/createSchedule.js"
import recurringTasks from "../lib/cronJobs/cron.js"
import icsFileGeneretor from "../services/icsFile.js"
import mailICSFile from "../services/nodemailer.js"
import { userInfo } from "os"

const createScheduler = asyncHandler(async (req, res) => {
    const { subject, topic, schedulerDate, duration } = req.body

    if (!subject || !topic || !schedulerDate || !duration) {
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

const getScheduler = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await scheduleEntry.find({
        userId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All scheduler fetched successfully"))
})

const updateScheduler = asyncHandler(async (req, res) => {
    const { schedulerId } = req.params

    const { subject, topic, schedulerDate, duration, completed } = req.body

    const userId = req.user.id

    const data = await scheduleEntry.findOneAndUpdate(
        {
            _id: schedulerId,
            userId
        },
        {
            subject,
            topic,
            schedulerDate,
            duration,
            completed
        }, {
        new: true
    }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Scheduler updated successfully"))


})

const generatePlan = asyncHandler(async (req, res) => {
    const { subjects, hoursPerDay, goalDate } = req.body

    if (!subjects || !hoursPerDay | !goalDate) {
        throw new ApiError(400, "All fields are required")
    }


    const data = await generateStudyPlan(subjects, hoursPerDay, goalDate)

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Study plan created"))

})

const saveGeneratePlan = asyncHandler(async (req, res) => {
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


const createExamScheduler = asyncHandler(async (req, res) => {
    const { subjectName, examDate, examTime, duration, venue, onlineLink, subjectCode, notes, reminderEnabled, reminderDaysBefore, status, } = req.body

    if (!subjectName || !examDate || !examTime) {
        throw new ApiError(400, "All fields are required")
    }

    const userId = req.user.id

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

const getAllExamScheduler = asyncHandler(async (req, res) => {
    const userId = req.user.id


    const data = await scheduleExamDates.find({
        userId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All exam dates are fetched "))
})

const deleteExamScheduler = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "scheduler id is required")
    }

    const data = await scheduleExamDates.findOneAndDelete(
        {
            userId,
            _id: id
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Exam Scheduler is deleted "))
})

const updateExamScheduler = asyncHandler(async (req, res) => {
    const { subjectName, examDate, examTime, duration, venue, onlineLink, subjectCode, notes, reminderEnabled, reminderDaysBefore, status } = req.body

    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Scheduler id id required")
    }

    const objects = { subjectName, examDate, examTime, duration, venue, onlineLink, subjectCode, notes, reminderEnabled, reminderDaysBefore, status }

    const filteredObjects = Object.fromEntries(
        Object.entries(objects).filter(([key, value]) => value !== undefined)
    )
    console.log(filteredObjects);

    if (Object.keys(filteredObjects).length === 0) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const userId = req.user.id

    const data = await scheduleExamDates.findOneAndUpdate(
        {
            _id: id,
            userId
        },
        {
            $set: filteredObjects
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Exam scheduler updated successfully"))

})

const getSchedulerExam = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const data = await scheduleExamDates.find({
        _id: id,
    })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Scheduler exam fetched"))
})

// 


const createAssignmentSubmissionScheduler = asyncHandler(async (req, res) => {
    const { dueDate, allowLateSubmission, linkedAssignmentId } = req.body

    if (!dueDate) {
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
        .json(new ApiResponse(200, data, "Assignment scheduler created"))
})

const getAllAssignmentSubmission = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await AssignmentSubmission.find({ userId })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All assignment submission fetched"))
})

const getAssignmentSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "id is required")
    }

    const userId = req.user.id

    const data = await AssignmentSubmission.find({ userId, _id: id })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Assignment fetched successfully"))
})

const deleteAssignmentSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "id is required")
    }

    const userId = req.user.id

    const data = await AssignmentSubmission.findOneAndDelete(
        {
            userId,
            _id: id
        },

    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Assignment delted successfully"))
})

const updateAssignmentSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { dueDate, submittedAt, submissionStatus, feedback, allowLateSubmission, linkedAssignmentId } = req.body

    if (!id) {
        throw new ApiError(400, "id is required")
    }

    const objects = { dueDate, submittedAt, submissionStatus, feedback, allowLateSubmission, linkedAssignmentId }

    const filteredObjects = Object.fromEntries(
        Object.entries(objects).filter(([key, value]) => value !== undefined)
    )

    if (Object.keys(filteredObjects).length === 0) {
        throw new ApiError(400, "At least one field is required for update")
    }

    const userId = req.user.id

    const data = await AssignmentSubmission.findOneAndUpdate(
        {
            userId,
            _id: id
        },
        {
            $set: filteredObjects
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, 'Assignment upadted'))

})

// 

const createProjectSubmissionScheduler = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const { projectTitle, submissionDate, projectLink, phase } = req.body

    if (!projectTitle || !submissionDate) {
        throw new ApiError(400, "These two fields are required")
    }

    const data = await ProjectSubmission.create({
        userId,
        projectTitle,
        projectTitle,
        submissionDate,
        phase,

    })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Project suhbmission scheduler created"))
})

const getAllProjectSubmission = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await ProjectSubmission.find({ userId })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All project submission schedules fetched sucessfully"))
})

const getProjectSubmission = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const data = await ProjectSubmission.find(
        {
            userId,
            _id: id
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Project submission schedule fetched successfully"))
})

const deleteProjectSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Project schedule not fetched")
    }

    const userId = req.user.id

    const data = await ProjectSubmission.findOneAndDelete(
        {
            userId,
            _id: id
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Project schedule deleted successfully"))
})

const updateProjectSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Project id is required")
    }
    const { projectTitle, submissionDate, projectLink, phase } = req.body

    const objects = { projectTitle, submissionDate, projectLink, phase }

    const filteredObjects = Object.fromEntries(
        Object.entries(([key, value]) => value !== undefined)
    )

    if (Object.keys(filteredObjects).length === 0) {
        throw new ApiError(400, "Atleast one field is required")
    }

    const data = await ProjectSubmission.findOneAndUpdate(
        {
            _id: id
        },
        {
            $set: filteredObjects
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Project schedule is updated"))

})
// 

const createTimeTable = asyncHandler(async (req, res) => {
    const { title, topic, startTime, endTime, plannedDuration, isRecurring, recurrencePattern, recurrenceDays, recurrenceEndDate, status, actualDuration, goalDescription, reminderEnabled, reminderMinutesBefore, } = req.body

    if (!title || !topic || !startTime || !endTime || !plannedDuration) {
        throw new ApiError(400, "These fields are required")
    }

    const userId = req.user.id


    const conflict = await TimeTable.findOne(
        {
            userId,
            startTime: {
                $lt: endTime
            },
            endTime: {
                $gt: startTime
            }
        }
    )

    if (conflict) {
        throw new ApiError(400, "This slot is already booked ")
    }

    const data = await TimeTable.create(
        {
            userId,
            title,
            topic,
            startTime,
            endTime,
            plannedDuration,
            isRecurring,
            recurrencePattern,
            recurrenceDays,
            recurrenceEndDate,
            status,
            actualDuration,
            goalDescription,
            reminderEnabled,
            reminderMinutesBefore,
        }
    )

    if (data.isRecurring) {
        const pattern = data.recurrencePattern
        const days = data.recurrenceDays
        const endDate = data.recurrenceEndDate
        const entryId = data._id

        if (!pattern || !days || !endDate) {
            throw new ApiError(400, "Fields are required")
        }

        await recurringTasks(pattern, days, endDate, entryId)
    }
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Time table created"))

})

const getAllTimeTables = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await TimeTable.find(
        {
            userId
        }
    )
    
    return res
        .status(200)
        .json(new ApiResponse(200, data, "All time tables fetched"))
})

const getTimeTable = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const data = await TimeTable.find(
        {
            _id: id
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Ti,e table fetched"))
})

const deleteTimeTable = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const isDataExist = await TimeTable.find({ _id: id })

    if (!isDataExist) {
        throw new ApiError(400, "Time table not found")
    }

    const data = await TimeTable.findOneAndDelete(
        {
            _id: id
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, "Time table is deleted"))
})

const updateTimeTable = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const { title, topic, startTime, endTime, plannedDuration, isRecurring, recurrencePattern, recurrenceDays, recurrenceEndDate, status, actualDuration, goalDescription, reminderEnabled, reminderMinutesBefore, } = req.body

    const objects = { title, topic, startTime, endTime, plannedDuration, isRecurring, recurrencePattern, recurrenceDays, recurrenceEndDate, status, actualDuration, goalDescription, reminderEnabled, reminderMinutesBefore, }

    const filteredObjects = Object.fromEntries(
        Object.entries(objects).filter(([key, value]) => value !== undefined)
    )

    if (Object.keys(filteredObjects).length === 0) {
        throw new ApiError(400, "Atleast one field need to be updated")
    }

    const conflict = await TimeTable.findOne(
        {
            userId,
            startTime: {
                $lt: endTime
            },
            endTime: {
                $gt: startTime
            }
        }
    )

    if (conflict) {
        throw new ApiError(400, "This slot is already booked ")
    }

    const userId = req.user.id

    const isDataExist = await TimeTable.findById(
        {
            _id: id
        }
    )

    if (!isDataExist) {
        throw new ApiError(400, "Time table not exist")
    }

    // Object.assign(isDataExist, filteredObjects)
    // const data = await isDataExist.save()


    const data = await TimeTable.findOneAndUpdate(
        {
            userId,
            _id: id
        },
        {

            $set: filteredObjects
        }
    )

    if (isRecurring && !data.isRecurring) {
        console.log("Recurrance Run:");

        const pattern = data.recurrencePattern
        const days = data.recurrenceDays
        const endDate = data.recurrenceEndDate
        const entryId = data._id

        if (!pattern || !days || !endDate) {
            throw new ApiError(400, "Fields are required")
        }

        await recurringTasks(pattern, days, endDate, entryId)
    }
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Updated"))

})

// 

const uploadFile = asyncHandler(async (req, res) => {
    const file = req.files?.file[0]

    if (!file) {
        throw new ApiError(400, "File is required")
    }

    const mimeType = file?.mimeType
    const filePath = file?.path

    const outputDir = "../uploads/scheduler"

    const dataBuffer = fs.readFileSync(filePath)
    const uint8array = new Uint8Array(dataBuffer)
    const parser = new PDFParse(uint8array)

    await parser.getText()

    const totalPages = parser?.doc?._pdfInfo?.numPages
    console.log("Started", totalPages);

    await pdfToImages(filePath, totalPages, outputDir)
    console.log("End");

    const userId = req.user.id
    const result = await createSchedule(outputDir)

    const data = await RawSchedule.create(
        {
            userId,
            metaData: result
        }
    )
    fs.unlinkSync(filePath)

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Raw Schedule created"))

})

const getAllRawMaterial = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await RawSchedule.find({ userId })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All schedule fetched"))
})

const getRawMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Id is required")
    }
    const userId = req.user.id
    const data = await RawSchedule.find({ userId, _id: id })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Raw schedule fetched"))
})

const deleteRawMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Id is required")
    }
    const userId = req.user.id
    const data = await RawSchedule.findOneAndDelete({ userId, _id: id })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Raw schedule fetched"))
})

const deleteAllRawMaterial = asyncHandler(async (req, res) => {
    const userId = req.user.id

    await RawSchedule.deleteMany({ userId })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All raw data is deleted"))
})

// 

const createToDoList = asyncHandler(async (req, res) => {
    const { title, status, priority, dueDate, isRecurring, recurrencePattern, reminderEnabled, reminderTime } = req.body

    if (!title || !dueDate) {
        throw new ApiError(400, "All fields are required")
    }

    const userId = req.user.id

    const data = await ToDoList.create({
        userId,
        title, 
        status, 
        priority, 
        dueDate, 
        isRecurring, 
        recurrencePattern, 
        reminderEnabled, 
        reminderTime
    })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "To Do List created"))
})

const getAllToDoList = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await ToDoList.find({userId})

    return res
    .status(200)
    .json (new ApiResponse(200, data, "All to do list fetched"))
})
const getToDoList = asyncHandler(async (req, res) => {
    const {id} = req.params

    if(!id){
        throw new ApiError(400, "Id is required")
    }

    const userId = req.user.id

    const data = await ToDoList.findById({_id:id})

    if(!data){
        throw new ApiError(400, "To do list not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, data, "To do list getched"))
})

const deleteToDoList = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const userId = req.user.id

    const isDataExist = await ToDoList.findById({ _id: id })

    if (!isDataExist) {
        throw new ApiError(400, "To do list not found")
    }

    const data = await ToDoList.findOneAndDelete({userId, _id:id})

    return res
        .status(200)
        .json(new ApiResponse(200, data, "To do list getched"))
})

const updateToDoList = asyncHandler(async (req, res) => {
    const {id} = req.params

    if(!id){
        throw new ApiError(400, "Id is required")
    }

    const { title, status, priority, dueDate, isRecurring, recurrencePattern, reminderEnabled, reminderTime } = req.body

    const objects = { title, status, priority, dueDate, isRecurring, recurrencePattern, reminderEnabled, reminderTime }

    const filteredObjects = Object.fromEntries(
    Object.entries(objects).filter(([key, val])=>val!==undefined)
    )

    if(Object.keys(filteredObjects).length ===0){
        throw new ApiError(400, "At least one field need to change")
    }

    const isDataExist = await ToDoList.findById({_id:id})

    if(!isDataExist){
        throw new ApiError(400,"To do list not found")
    }

    const data = await ToDoList.findOneAndUpdate(
        {
            _id:id
        },
        {
            $set:filteredObjects
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "To do list updated"))
})

const deleteAllToDoList = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const data = await ToDoList.deleteMany({ userId })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All to do list fetched"))
})

const filterToDoList = asyncHandler(async(req, res)=>{
    const {input} = req.query

    if(!input){
        throw new ApiError(400, "FIlter query is required")
    }

    const userId = req.user.id

    let filter = {}
    if(input){
        filter.input = input
    }

    const data = await ToDoList.find({userId, filter})

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Filtered apply"))
})

const sortToDoList = asyncHandler(async(req, res)=>{
    const {sortBy} =req.query

    if(!sortBy){
        throw new ApiError(400, "Sort By is required")
    }

    // const ALLOWED_SORTS = {
    //     newest: { createdAt: -1 },
    //     oldest: { createdAt: 1 },
    //     az: { title: 1 },
    //     za: { title: -1 },
    // }
    const userId =req.user.id

    const sortOption = sortBy === "priority" ? { priority: -1 } : { createdAt: -1 }

    const data = await ToDoList.find({ userId }).sort(sortOption)

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Sorted"))
})

const sendICSFile = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const isDataExist = await TimeTable.findById({ _id: id })

    if (!isDataExist) {
        throw new ApiError(400, "Time table is not exist.")
    }

    const folder = "../uploads/icsFiles"

    try {
        const outputPath = await icsFileGeneretor(isDataExist, folder)
        const response = await mailICSFile(outputPath)
        console.log("Response", response);

        fs.rmSync(folder, { recursive: true })

        return res
            .status(200)
            .json(new ApiResponse(200, response, "ICS file is generated"))
    } catch (err) {
        console.error("ICS generation failed:", err.message)
        fs.rmSync(folder, { recursive: true, force: true })

    }


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
    getAllAssignmentSubmission,
    getAssignmentSubmission,
    deleteAssignmentSubmission,
    updateAssignmentSubmission,

    createProjectSubmissionScheduler,
    getAllProjectSubmission,
    getProjectSubmission,
    deleteProjectSubmission,
    updateProjectSubmission,

    createTimeTable,
    getAllTimeTables,
    getTimeTable,
    deleteTimeTable,
    updateTimeTable,


    uploadFile,
    getAllRawMaterial,
    getRawMaterial,
    deleteRawMaterial,
    deleteAllRawMaterial,


    createToDoList,
    getAllToDoList,
    getToDoList,
    deleteToDoList,
    updateToDoList,
    deleteAllToDoList,
    filterToDoList,
    sortToDoList,

    sendICSFile
}