import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadFile, askQuery, allChatsMessage, updateQuery, allChats, deleteChat } from "../controllers/filesRag.controller.js"

const router = Router()

router.route("/upload").post(verifyJWT, 
    upload.fields([
        {
            name:"file",
        }
    ]),
    uploadFile
)
router.route("/:id/chat/:docId").get(verifyJWT, allChatsMessage)
router.route("/:id/chat/:docId").post(verifyJWT, askQuery)
router.route("/:id/chat/:chatRoomKey/:chatId").patch(verifyJWT, updateQuery)
router.route("/chat/all").get(verifyJWT, allChats)
router.route("/:id").delete(verifyJWT, deleteChat)

export default router