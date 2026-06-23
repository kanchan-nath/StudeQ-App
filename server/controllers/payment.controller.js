import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { plansData } from "../constants/plansData.constant.js"
import { Plan } from "../models/plan.model.js"
import sharedFeaturesSeed from "../constants/sharedFeatures.constant.js"
import { SharedFeature } from "../models/sharedFeature.model.js"
import mongoose from "mongoose"
import { razorpay } from "../lib/razorpay.js"
import Payment from "../models/payment.model.js"
import { verifyPaymentValidator } from "../validators/payment.validator.js"
import crypto from "crypto"
import logger from "../logger/index.js"

const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}
const getPaymentPlans = asyncHandler(async (req, res) => {
    const opsPlanData = plansData.map((p) => ({
        updateOne: {
            filter: {
                planId: p.planId
            },
            update: {
                $set: p
            },
            upsert: true
        }
    })
    )

    const opsSharedFeaturesSeed = sharedFeaturesSeed.map((f) => ({
        updateOne: {
            filter: {
                iconKey: f.iconKey
            },
            update: {
                $set: f
            },
            upsert: true
        }
    }))

    await Plan.bulkWrite(opsPlanData)
    await SharedFeature.bulkWrite(opsSharedFeaturesSeed)

    const data = await Plan.find({}).lean();
    const sharedFeaturesSeedData = await SharedFeature.find({}).lean();

    return res
        .status(200)
        .json(new ApiResponse(200, { plans: data, sharedFeatures: sharedFeaturesSeedData }, "Plans fetched"))
})

const setSubscription = asyncHandler(async (req, res) => {
    const userId = req.user?.id; // adjust per your auth middleware
    // if (!userId) {
    //     return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    // TODO: replace with real Mongoose lookup, e.g.:
    // const sub = await Subscription.findOne({ userId });

    const sub = null; // hardcoded: no active sub yet

    return res.status(200).json({
        success: true,
        data: {
            planId: sub?.planId ?? "free",
            billingCycle: sub?.billingCycle ?? "monthly",
        },
    });
})
const createOrder = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { billingCycle } = req.body
    if(!billingCycle){
        throw new ApiError(400, "Billing plan is not set")
    }
    if (!id) {
        throw new ApiError(400, "Invalid Plan Id")
    }

    if (!isValidId(id)) {
        throw new ApiError(400, "Invslid Id")
    }

    const userId = 19

    const existedPlan = await Plan.findById({ _id: id })

    if (!existedPlan) {
        throw new ApiError(400, "Invalid request")
    }

    const amount = billingCycle === 'yearly'
        ? existedPlan.priceYearly *100
        : existedPlan.priceMonthly* 100

    const currency = "INR"
    const order = await razorpay.orders.create(
        {
            amount,
            currency,
            receipt: `rcpt_${userId}_${Date.now()}`,
        }
    )
console.log("Order",order);

    await Payment.create({
        userId,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { orderId: order.id, amount, currency, keyId: process.env.RAZORPAY_KEY_ID }, "Payment order created"))
})

const verifyOrder = asyncHandler(async (req, res) => {
    const { data, error } = verifyPaymentValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, "Invalid payment credentials")
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Payment credentials missing")
    }

    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")

    const isValid =
        expected.length === razorpay_signature.length &&
        crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(razorpay_signature, 'utf8'));

    if (!isValid) {
        await Payment.findOneAndUpdate(
            {
                userId:req.user.id,
                razorpayOrderId: razorpay_order_id
            },
            {
                status: "FAILED",
                failureReason: 'signature mismatch'
            }
        )

        logger.warn('Payment signature mismatch');
        console.error({ orderId: razorpay_order_id, userId: req.user.id });
        

        return res
            .status(400)
            .json({ error: "Payment verification failed" })
    }

    const payment = await Payment.findOne(
        {
            _id: req.user.id,
            razorpayOrderId: razorpay_order_id
        }
    )

    if (!payment || payment.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "Order does not belong to this user" })
    }

    await payment.findByIdAndUpdate(
        {
            _id: req.user.id,
            razorpayOrderId: razorpay_order_id
        },
        {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'VERIFIED',
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Confirming with payment provider…"))
})
export { getPaymentPlans, setSubscription, createOrder, verifyOrder }