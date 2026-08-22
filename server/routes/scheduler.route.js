import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js"
// import {
//     createScheduler,
//     getScheduler,
//     updateScheduler,
//     generatePlan,
//     saveGeneratePlan,

//     createExamScheduler,
//     getAllExamScheduler,
//     deleteExamScheduler,
//     updateExamScheduler,
//     getSchedulerExam,

//     createAssignmentSubmissionScheduler,
//     getAllAssignmentSubmission,
//     getAssignmentSubmission,
//     deleteAssignmentSubmission,
//     updateAssignmentSubmission,

//     createProjectSubmissionScheduler,
//     getAllProjectSubmission,
//     getProjectSubmission,
//     deleteProjectSubmission,
//     updateProjectSubmission,

//     createTimeTable,
//     getAllTimeTables,
//     getTimeTable,
//     deleteTimeTable,
//     updateTimeTable,

//     uploadFile,
//     getAllRawMaterial,
//     getRawMaterial,
//     deleteRawMaterial,
//     deleteAllRawMaterial,


//     createToDoList,
//     getAllToDoList,
//     getToDoList,
//     deleteToDoList,
//     updateToDoList,
//     deleteAllToDoList,
//     filterToDoList,
//     sortToDoList,

//     sendICSFile
    
// } from "../controllers/scheduler.controller.js"
// import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

// router.route("/scheduler").post(verifyJWT, createScheduler)
// router.route("/scheduler").get(verifyJWT, getScheduler)
// router.route("/scheduler").patch(verifyJWT, updateScheduler)
// router.route("/scheduler/generate-plan").post(verifyJWT, generatePlan)
// router.route("/scheduler/generate-plan/save").post(verifyJWT, saveGeneratePlan)
// // 
// router.route("/scheduler/exam-dates").post(verifyJWT, createExamScheduler)
// router.route("/scheduler/exam-dates").get(verifyJWT, getAllExamScheduler)
// router.route("/scheduler/exam-dates/:id").delete(verifyJWT, deleteExamScheduler)
// router.route("/scheduler/exam-dates/:id").patch(verifyJWT, updateExamScheduler)
// router.route("/scheduler/exam-dates/:id").get(verifyJWT, getSchedulerExam)
// // 
// router.route("/scheduler/assignment-submission").post(verifyJWT, createAssignmentSubmissionScheduler)
// router.route("/scheduler/assignment-submission").get(verifyJWT, getAllAssignmentSubmission)
// router.route("/scheduler/assignment-submission/:id").get(verifyJWT, getAssignmentSubmission)
// router.route("/scheduler/assignment-submission/:id").delete(verifyJWT, deleteAssignmentSubmission)
// router.route("/scheduler/assignment-submission/:id").patch(verifyJWT, updateAssignmentSubmission)
// // 
// router.route("/scheduler/project-submission").post(verifyJWT, createProjectSubmissionScheduler)
// router.route("/scheduler/project-submission").get(verifyJWT, getAllProjectSubmission)
// router.route("/scheduler/project-submission/:id").get(verifyJWT, getProjectSubmission)
// router.route("/scheduler/project-submission/:id").delete(verifyJWT, deleteProjectSubmission)
// router.route("/scheduler/project-submission/:id").patch(verifyJWT, updateProjectSubmission)
// // 
// router.route("/scheduler/time-table").post(verifyJWT, createTimeTable)
// router.route("/scheduler/time-table").get(verifyJWT, getAllTimeTables)
// router.route("/scheduler/time-table/:id").get(verifyJWT, getTimeTable)
// router.route("/scheduler/time-table/:id").delete(verifyJWT, deleteTimeTable)
// router.route("/scheduler/time-table/:id").patch(verifyJWT, updateTimeTable)
// router.route("/scheduler/time-table/:id/ics").get(verifyJWT, sendICSFile)

// // 
// router.route("/scheduler/material").post(verifyJWT,
//     upload.fields([
//         {
//             name:"file"
//         }
//     ]),
//     uploadFile
// )
// router.route("/scheduler/material").get(verifyJWT, getAllRawMaterial)
// router.route("/scheduler/material/:id").get(verifyJWT, getRawMaterial)
// router.route("/scheduler/material/:id").delete(verifyJWT, deleteRawMaterial)
// router.route("/scheduler/material/:id/all").delete(verifyJWT, deleteAllRawMaterial)


// router.route("/scheduler/to-do-list").post(verifyJWT, createToDoList)
// router.route("/scheduler/to-do-list").get(verifyJWT, getAllToDoList)
// router.route("/scheduler/to-do-list/filter").get(verifyJWT, filterToDoList)
// router.route("/scheduler/to-do-list/sort").get(verifyJWT, sortToDoList)
// router.route("/scheduler/to-do-list/:id").get(verifyJWT, getToDoList)
// router.route("/scheduler/to-do-list/:id").delete(verifyJWT, deleteToDoList)
// router.route("/scheduler/to-do-list/:id").patch(verifyJWT, updateToDoList)
// router.route("/scheduler/to-do-list").delete(verifyJWT, deleteAllToDoList)

export default router