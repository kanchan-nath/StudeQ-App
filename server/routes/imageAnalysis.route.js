import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {analyze} from "../controllers/imageAnalyze.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/analyze").post(verifyJWT,
    upload.fields([
        {
            name:"image",
        },
        {
            name: "pdf"
        }
    ]) ,
    analyze)
export default router