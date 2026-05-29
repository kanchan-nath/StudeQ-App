import mongoose, { mongo } from "mongoose"

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

const scheduleExamDatesSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    subjectName:{
        type: String,
        required: true
    },
    examDate:{
        type: Date,
        required: true
    },
    examTime:{
        type: String,
        required: true
    },
    duration:{
        type:Number,
    },
    venue:{
        type:String,
    },
    onlineLink:{
        type: String
    },
    subjectCode:{
        type:String
    },
    notes:{
        type:String
    },
    reminderEnabled:{
        type: Boolean,
        default:false
    },
    reminderDaysBefore:{
        type:Number,
    },
    status:{
        type: String,
        enum:["upcoming", "completed", "cancelled"],
        default:"upcoming"
    },
    createdAt:{
        type: Date,
    }
},{timestamps:true})

export const scheduleExamDates = mongoose.model("scheduleExamDates", scheduleExamDatesSchema)

const assignmentSubmissionSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true
    },
    dueDate:{
        type: Date,
        required: true
    },
    submittedAt:{
        type: String,
    },
    submissionStatus:{
        type: String,
        enum: ["pending", "submitted", "late", "graded"],
        default: "pending"
    },
    feedback:{
        type: String
    },
    allowLateSubmission:{
        type:Boolean,
        default:false
    },
    linkedAssignmentId:{
        type:String
    },
    createdAt:{
        type:Date
    }
},{timestamps:true})

export const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema)

const projectSubmissionSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true
    },
    projectTitle:{
        type:String,
        required:true
    },
    phase:{
        type: String,
        enum: ["proposal", "mideval","final"],
        default:"proposal"
    },
    submissionDate:{
        type: Date,
        required: true
    },
    projectLink:{
        type:String,

    },
    createdAt:{
        type:Date
    }
}, {timestamps:true})

export const ProjectSubmission = mongoose.model("ProjectSubmission", projectSubmissionSchema)