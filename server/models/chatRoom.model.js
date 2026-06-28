import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    userId:{
        type:Number,
        required : true
    },
    docId:{
        type: String,
        required: true,
        unique: true
    },
    messages:[
        {
            role:{
                type: String,
                enum: ["user", "assistant"],
                // required: true
            },
            content:{
                type: String,
                // required: true
            }
        }
    ],
    createdAt:{
        type: Date
    }
},{timestamps:true})

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)