import { z } from 'zod';

export const createOrderSchema = z.object({
    productType: z.enum(['premium_unlock']),
    productRef: z.string().optional(),
});

export const verifyPaymentValidator = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
});

export const refundSchema = z.object({
    paymentId: z.string().min(1), // your internal Payment.id, not razorpay id
    amount: z.number().int().positive().optional(), // paise, omit for full refund
    reason: z.string().min(1),
});