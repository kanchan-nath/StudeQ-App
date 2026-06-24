import {Router} from "express"
import { getPaymentPlans, setSubscription, createOrder, verifyOrder } from "../controllers/payment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/billing/plans").get(getPaymentPlans)
router.route("/billing/subscription").get(setSubscription)
router.route("/payments/verify-order").post(verifyJWT, verifyOrder)
router.route("/payments/create-order/:id").post(verifyJWT, createOrder)


export default router