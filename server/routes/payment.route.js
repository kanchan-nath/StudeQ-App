import {Router} from "express"
import { getPaymentPlans, setSubscription , subscribe} from "../controllers/getPaymentPlans.controller.js"

const router = Router()

router.route("/billing/plans").get(getPaymentPlans)
router.route("/billing/subscription").get(setSubscription)
router.route("/billing/subscribe").get(subscribe)

export default router