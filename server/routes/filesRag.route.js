import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadFile, askQuery, allChats, updateQuery } from "../controllers/filesRag.controller.js"

const router = Router()

router.route("/upload").post(verifyJWT, 
    upload.fields([
        {
            name:"file",
        }
    ]),
    uploadFile
)
router.route("/:id/chat/:chatRoomKey").get(verifyJWT, allChats)
router.route("/:id/chat/:chatRoomKey").post(verifyJWT, askQuery)
router.route("/:id/chat/:chatRoomKey/:chatId").patch(verifyJWT, updateQuery)


export default router