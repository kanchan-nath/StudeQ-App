import mongoose from "mongoose";
const sharedFeatureSchema = new mongoose.Schema(
    {
        iconKey: {
            type: String,
            enum: ["chat", "quiz", "flashcards", "tutor", "scheduler", "streaming", "codegen"],
            required: true,
        },
        label: { type: String, required: true },
        sortOrder: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const SharedFeature = mongoose.model("SharedFeature", sharedFeatureSchema);