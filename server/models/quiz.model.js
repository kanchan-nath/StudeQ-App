import mongoose from "mongoose"

const quizSchema = new mongoose.Schema({
     userId:{
        type: Number,
        required: true
     },
     quiz:{
        title:{
            type:String,
            required: true
        },
        totalQuestion:{
            type:Number,
            required: true
        },
        meta:{
            startedAt:{
                type: Date,
                default:null
            },
            submittedAt:{
                type: String,
                default:null
            },
            score:{
                type: String,
                default: null
            }
        }
     },
     questions:[
        {
            types:{
                type: String,
                required: true
            },
            question:{
                type: String,
                required: true,
            },
            options: {
                type: [String],
                required: true
            },
            answer:{
                type: String,
                required: true
            },
            userResponse:{
                type: String,
                default: null
            },
            isCorrect:{
                type: Boolean,
                default:false
            }
        }
     ]

},{timestamps:true})
export const Quiz = mongoose.model("Quiz", quizSchema)