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

export { getPaymentPlans }