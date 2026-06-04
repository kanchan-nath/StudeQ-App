import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {search} from "../controllers/searchAPI.controller.js"

const router = Router()

router.route("/search").get(verifyJWT, search)

export default router