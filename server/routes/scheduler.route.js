import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
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

    createAssignmentSubmissionScheduler
} from "../controllers/scheduler.controller.js"
const router = Router()

router.route("/scheduler").post(verifyJWT, createScheduler)
router.route("/scheduler").get(verifyJWT, getScheduler)
router.route("/scheduler").patch(verifyJWT, updateScheduler)
router.route("/scheduler/generate-plan").post(verifyJWT, generatePlan)
router.route("/scheduler/generate-plan/save").post(verifyJWT, saveGeneratePlan)

router.route("/scheduler/exam-dates").post(verifyJWT, createExamScheduler)
router.route("/scheduler/exam-dates").get(verifyJWT, getAllExamScheduler)
router.route("/scheduler/exam-dates/:id").delete(verifyJWT, deleteExamScheduler)
router.route("/scheduler/:id").patch(verifyJWT, updateExamScheduler)
router.route("/scheduler/exam-dates/:id").get(verifyJWT, getSchedulerExam)

router.route("/scheduler/assignment-submission").post(verifyJWT, createAssignmentSubmissionScheduler)

export default router