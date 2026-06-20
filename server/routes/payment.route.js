import {Router} from "express"
import { getPaymentPlans } from "../controllers/getPaymentPlans.controller.js"

const router = Router()

router.route("/billing/plans").get(getPaymentPlans)
export default router