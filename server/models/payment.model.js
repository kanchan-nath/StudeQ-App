import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            index: true,
            type:String
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        razorpayPaymentId: {
            type: String,
            unique: true,
            sparse: true,
        },

        razorpaySignature: {
            type: String,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        status: {
            type: String,
            enum: [
                "CREATED",
                "ATTEMPTED",
                "VERIFIED",
                "CAPTURED",
                "FAILED",
                "REFUNDED",
            ],
            default: "CREATED",
        },

        productType: {
            type: String,
            required: true,
        },

        productRef: {
            type: String,
        },

        webhookEventId: {
            type: String,
            unique: true,
            sparse: true,
        },

        failureReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;