import mongoose from "mongoose"

const tutorchatSchema = new mongoose.Schema({

    sessionId:{
        type:String,
        required:true,
    },
    userId:{
        type:Number,
        required:true
    },
    
    messages:[

        {
            role:{
                type:String,
                // required:true,
                enum:["user", "tutor"]
            },
            content:{
                type:String,
                // required:true
            },
            
        }
    ],
    createdAt:{
        type:Date
    }
},{timestamps:true})

export const Tutorchat = mongoose.model("Tutorchat", tutorchatSchema)