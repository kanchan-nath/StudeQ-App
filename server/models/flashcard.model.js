import mongoose, { mongo } from "mongoose";

const flashcardsSchema = new mongoose.Schema({
    userId: {
        type:String,
        required: true
    },
    flashcards:[
        {
            front:{
                type:String
            },
            back:{
                type:String
            }
        }
    ],
    flashcardId:{
        type:String
    },
    subject:{
        type:String
    },
    topic:{
        type: String
    }
},{timestamps:true})

export const Flascards = mongoose.model("Flashcards", flashcardsSchema)