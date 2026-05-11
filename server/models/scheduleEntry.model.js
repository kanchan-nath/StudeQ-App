import mongoose from "mongoose"

const scheduleEntrySchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    subject:{
        type:String,
        required: true

    },
    topic:{
        type:String,
        required: true

    },
    schedulerDate:{
        type: Date,
        required: true

    },
    duration:{
        type: Number,
        required: true

    },
    completed:{
        type:Boolean,
        default:false

    },
    createdAt: {
        type:Date
    }
}, {timestamps:true})

export const scheduleEntry = mongoose.model("scheduleEntry", scheduleEntrySchema)