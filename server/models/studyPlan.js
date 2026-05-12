import mongoose  from "mongoose";

const studyPlanSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    subjects:[String],
    hoursPerDay:{
        type:Number,
    },
    goalDate:{
        type:String
    },
    generatedPlan:[{
        type: mongoose.Schema.Types.Mixed
    }]
},{timestamps:true})

export const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema)