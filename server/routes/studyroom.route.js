import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    createRoom,
    getAllRoom
} from "../controllers/studyroom.controller.js"
const router = Router()

router.route("/rooms").post(verifyJWT, createRoom)
router.route("/rooms").get(verifyJWT, getAllRoom)


export default router