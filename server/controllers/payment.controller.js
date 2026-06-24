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
import prisma from "../lib/prisma.js"

if (!process.env.RAZORPAY_KEY_SECRET || !process.env.RAZORPAY_KEY_ID) {
    throw new Error("Missing required env vars: RAZORPAY_KEY_SECRET, RAZORPAY_KEY_ID")
}

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

export const seedPlansData = async () => {
    const opsPlan = plansData.map(p => ({
        updateOne: { filter: { planId: p.planId }, update: { $set: p }, upsert: true }
    }))
    const opsFeatures = sharedFeaturesSeed.map(f => ({
        updateOne: { filter: { iconKey: f.iconKey }, update: { $set: f }, upsert: true }
    }))
    await Plan.bulkWrite(opsPlan)
    await SharedFeature.bulkWrite(opsFeatures)
    logger.info("Plans and shared features seeded")
}

const getPaymentPlans = asyncHandler(async (req, res) => {
    const [plans, sharedFeatures] = await Promise.all([
        Plan.find({}).lean(),
        SharedFeature.find({}).lean()
    ])
    return res
        .status(200)
        .json(new ApiResponse(200, { plans, sharedFeatures }, "Plans fetched"))
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
    if (!billingCycle) {
        throw new ApiError(400, "Billing plan is not set")
    }
    if (!id) {
        throw new ApiError(400, "Invalid Plan Id")
    }

    if (!isValidId(id)) {
        throw new ApiError(400, "Invslid Id")
    }

    const userId = req.user.id

    const existedPlan = await Plan.findById({ _id: id })

    if (!existedPlan) {
        throw new ApiError(400, "Invalid request")
    }

    const amount = billingCycle === 'yearly'
        ? existedPlan.priceYearly * 100
        : existedPlan.priceMonthly * 100

    const currency = "INR"
    const order = await razorpay.orders.create(
        {
            amount,
            currency,
            receipt: `rcpt_${userId}_${Date.now()}`,
        }
    )
    console.log("Order", order);
    await Payment.create({
        userId,
        planId: existedPlan._id,
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

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
                userId: req.user.id,
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
            userId: req.user.id,
            razorpayOrderId: razorpay_order_id
        }
    )

    if (!payment || payment.userId !== String(req.user.id)) {
        return res
            .status(403)
            .json({ error: "Order does not belong to this user" })
    }

     await Payment.findOneAndUpdate(
        {
            userId: req.user.id,
            razorpayOrderId: razorpay_order_id
        },
        {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'VERIFIED',
        }
    )
    const planId = await Payment.findOne({userId:req.user.id, razorpayOrderId: razorpay_order_id}).populate("planId")

    console.log(planId.planId.planId);
    
    await prisma.user.update({
        where: { id: req.user.id },
        data: {
            // razorpayOrderId: razorpay_order_id,
            planId:planId.planId.planId
        }

    })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Confirming with payment provider…"))
})
export { getPaymentPlans, setSubscription, createOrder, verifyOrder }