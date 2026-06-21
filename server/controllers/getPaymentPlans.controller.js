import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { plansData } from "../constants/plansData.constant.js"
import { Plan } from "../models/payment.model.js"
import sharedFeaturesSeed from "../constants/sharedFeatures.constant.js"
import { SharedFeature } from "../models/sharedFeature.model.js"

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

    const opsSharedFeaturesSeed = sharedFeaturesSeed.map((f)=>({
        updateOne:{
            filter:{
                iconKey: f.iconKey
            },
            update:{
                $set:f
            },
            upsert:true
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

const setSubscription = asyncHandler(async(req, res)=>{
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
const subscribe = asyncHandler(async(req, res)=>{
    // const userId = req.user?._id;
    // if (!userId) {
    //     return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    const { planId, billingCycle } = req.body;

    // if (!planId) {
    //     return res.status(400).json({ success: false, message: "planId is required" });
    // }

    // const plan = PLANS.find((p) => p.planId === planId);
    // if (!plan) {
    //     return res.status(404).json({ success: false, message: "Plan not found" });
    // }

    // Free plan: no checkout needed
    // if (plan.priceMonthly === 0) {
    //     // TODO: update user's subscription doc directly
    //     return res.status(200).json({
    //         success: true,
    //         data: { checkoutUrl: null },
    //     });
    // }

    const amount = billingCycle === "yearly"

    // TODO: replace with real Razorpay order creation, e.g.:
    // const order = await razorpay.orders.create({
    //     amount: amount * 100,
    //     currency: "INR",
    //     notes: { userId: String(userId), planId, billingCycle },
    // });

    const hardcodedOrderId = "order_HARDCODED123";

    return res.status(200).json({
        success: true,
        data: {
            checkoutUrl: null, // Razorpay is checkout.js modal, not a redirect URL — frontend opens Razorpay Checkout with orderId
            orderId: hardcodedOrderId,
            amount: amount * 100,
            currency: "INR",
            planId,
            billingCycle,
        },
    });
})
export { getPaymentPlans, setSubscription, subscribe }