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
                "created",
                "attempted",
                "VERIFIED",
                "CAPTURED",
                "FAILED",
                "REFUNDED",
                "paid"
            ],
            default: "CREATED",
        },

        receipt: {
            type: String,
            required: true,
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