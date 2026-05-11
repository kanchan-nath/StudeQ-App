import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import { pdfAnalyze } from "../controllers/pdfAnalyze.controller.js"

const router = Router()

router.route("/analyze").post(verifyJWT, 
    upload.fields([
        {
            name:"pdf"
        }
    ]), pdfAnalyze
)
export default router