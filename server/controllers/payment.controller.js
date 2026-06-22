import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { plansData } from "../constants/plansData.constant.js"
import { Plan } from "../models/plan.model.js"
import sharedFeaturesSeed from "../constants/sharedFeatures.constant.js"
import { SharedFeature } from "../models/sharedFeature.model.js"
import mongoose from "mongoose"
import { razorpay } from "../lib/razorpay.js"
import Payment from "../models/payment.model.js"

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
        ? existedPlan.priceYearly
        : existedPlan.priceMonthly

    const currency = "INR"
    const order = await razorpay.orders.create(
        {
            amount,
            currency,
            receipt: `rcpt_${userId}_${Date.now()}`,
        }
    )

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
export { getPaymentPlans, setSubscription, createOrder }