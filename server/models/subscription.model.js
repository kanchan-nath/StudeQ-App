const subscriptionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        planId: { type: String, ref: "Plan", default: "free" },
        billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
        status: { type: String, enum: ["active", "cancelled", "past_due"], default: "active" },
        razorpaySubscriptionId: { type: String },
        currentPeriodEnd: { type: Date },
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);