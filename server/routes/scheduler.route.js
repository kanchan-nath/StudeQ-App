import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    createScheduler,
    getScheduler,
    updateScheduler,
    generatePlan,
    saveGeneratePlan
} from "../controllers/scheduler.controller.js"
const router = Router()

router.route("/scheduler").post(verifyJWT, createScheduler)
router.route("/scheduler").get(verifyJWT, getScheduler)
router.route("/scheduler").patch(verifyJWT, updateScheduler)
router.route("/scheduler/generate-plan").post(verifyJWT, generatePlan)
router.route("/scheduler/generate-plan/save").post(verifyJWT, saveGeneratePlan)





export default router