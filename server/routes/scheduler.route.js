import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
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
    deleteTimeTable
} from "../controllers/scheduler.controller.js"
const router = Router()

router.route("/scheduler").post(verifyJWT, createScheduler)
router.route("/scheduler").get(verifyJWT, getScheduler)
router.route("/scheduler").patch(verifyJWT, updateScheduler)
router.route("/scheduler/generate-plan").post(verifyJWT, generatePlan)
router.route("/scheduler/generate-plan/save").post(verifyJWT, saveGeneratePlan)
// 
router.route("/scheduler/exam-dates").post(verifyJWT, createExamScheduler)
router.route("/scheduler/exam-dates").get(verifyJWT, getAllExamScheduler)
router.route("/scheduler/exam-dates/:id").delete(verifyJWT, deleteExamScheduler)
router.route("/scheduler/:id").patch(verifyJWT, updateExamScheduler)
router.route("/scheduler/exam-dates/:id").get(verifyJWT, getSchedulerExam)
// 
router.route("/scheduler/assignment-submission").post(verifyJWT, createAssignmentSubmissionScheduler)
router.route("/scheduler/assignment-submission").get(verifyJWT, getAllAssignmentSubmission)
router.route("/scheduler/assignment-submission/:id").get(verifyJWT, getAssignmentSubmission)
router.route("/scheduler/assignment-submission/:id").delete(verifyJWT, deleteAssignmentSubmission)
router.route("/scheduler/assignment-submission/:id").patch(verifyJWT, updateAssignmentSubmission)
// 
router.route("/scheduler/project-submission").post(verifyJWT, createProjectSubmissionScheduler)
router.route("/scheduler/project-submission").get(verifyJWT, getAllProjectSubmission)
router.route("/scheduler/project-submission/:id").get(verifyJWT, getProjectSubmission)
router.route("/scheduler/project-submission/:id").delete(verifyJWT, deleteProjectSubmission)
router.route("/scheduler/project-submission/:id").patch(verifyJWT, updateProjectSubmission)
// 
router.route("/scheduler/time-table").post(verifyJWT, createTimeTable)
router.route("/scheduler/time-table").get(verifyJWT, getAllTimeTables)
router.route("/scheduler/time-table/:id").get(verifyJWT, getTimeTable)
router.route("/scheduler/time-table/:id").delete(verifyJWT, deleteTimeTable)

export default router