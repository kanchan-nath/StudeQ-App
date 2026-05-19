import mongoose from "mongoose"

const quizSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true 
    },
    quizId:{
        type:String,
        required:true,
    },
    userAnswer:{
        type:String,
        default: null
    },
    quiz:[
        {
            question:{
                type:String
            },
            options:[
                {
                    optionId:{
                        type:String
                    },
                    text:{
                        type :String
                    }
                }
            ],
            answer:{
                type:String,
            }
        }
    ],
    createdAt: Date
},{timestamps:true })

export const Quiz = mongoose.model("Quiz", quizSchema)