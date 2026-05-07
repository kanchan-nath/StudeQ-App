import {Router} from "express"
import {
    ask,
    getChatHistory
} from "../controllers/tutor.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/ask").post(verifyJWT, ask)
router.route("/history").get(verifyJWT, getChatHistory)

export default router