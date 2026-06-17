import {Router} from "express"
import {
    register,
    login,
    logout,
    getUserData,
    verifyMe
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { generalLimiter, authLimiter, aiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router  = Router()

router.route("/register").post(register)
router.route("/login").post( authLimiter, login)
router.route("/logout").post(authLimiter, verifyJWT, logout)
router.route("/userinfo").get(verifyJWT, getUserData)
router.route("/me").get(verifyJWT, verifyMe)


export default router