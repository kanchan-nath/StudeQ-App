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
    ]
},{timestamps:true})

export const Flascards = mongoose.model("Flashcards", flashcardsSchema)