import mongoose, { mongo } from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    userId:{
        type:String,
        required : true
    },
    messages:[
        {
            role:{
                type: String,
                enum: ["user", "assistant"],
                required: true
            },
            content:{
                type: String,
                required: true
            },
            timestamps: true
        }
    ],
    createdAt:{
        type: Date
    }
},{timestamps:true})

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)