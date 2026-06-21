import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
    {
        iconKey: {
            type: String,
            enum: ["chat", "quiz", "flashcards", "tutor", "scheduler", "streaming", "codegen"],
            required: true,
        },
        label: { type: String, required: true },
    },
    { _id: false }
);

const planSchema = new mongoose.Schema(
    {
        planId: {
            type: String,
            required: true,
            unique: true,
            enum: ["free", "pro", "premium"],
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        priceMonthly: { type: Number, required: true }, // store in cents/paise
        priceYearly: { type: Number, required: true },
        isPopular: { type: Boolean, default: false },
        ctaLabel: { type: String },
        features: [{ type: String, required: true }],
        active: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);