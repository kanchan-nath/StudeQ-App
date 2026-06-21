import Razorpay from "razorpay"

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing from env');
}

export const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const PLAN_PRICES = Object.freeze({
    pro: {
        monthly: 900,   // $9.00
        yearly: 8600,   // $86.00
    },
    premium: {
        monthly: 1900,  // $19.00
        yearly: 18200,  // $182.00
    },
});