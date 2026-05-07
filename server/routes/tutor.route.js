import {Router} from "express"
import {
    ask
} from "../controllers/tutor.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/ask").post(verifyJWT, ask)

export default router