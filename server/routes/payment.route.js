import {Router} from "express"
import { getPaymentPlans, setSubscription, createOrder, verifyOrder } from "../controllers/payment.controller.js"

const router = Router()

router.route("/billing/plans").get(getPaymentPlans)
router.route("/billing/subscription").get(setSubscription)
router.route("/payments/create-order/:id").post(createOrder)
router.route("/payment/verify-order").get(verifyOrder)


export default router