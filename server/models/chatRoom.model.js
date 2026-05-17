import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    userId:{
        type:String,
        required : true
    },
    chatRoomKey:{
        type: String,
        Unique: true,
        required: true
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