import { Router } from "express"
import { getStats } from "../controllers/stats.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").get(verifyJWT, getStats)

export default router