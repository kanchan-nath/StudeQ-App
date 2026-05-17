import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadFile } from "../controllers/filesRag.controller.js"

const router = Router()

router.route("/upload").post(verifyJWT, 
    upload.fields([
        {
            name:"file",
        }
    ]),
    uploadFile
)

export default router