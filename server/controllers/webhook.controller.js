import crypto from 'crypto';
import redisClient from "../lib/redisClient.js"
// import { paymentQueue } from '../queues/paymentQueue.js';
import { logger } from '../lib/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, ApiResponse } from '../utils/Async.js';

const razorpayWebhookHandler = asyncHandler(async (req, res) => {
    const signature = req.headers["x-razorpay-signature"]

    const rawBody = req.body

    if (!signature) {
        throw new ApiError(400, "Missing signature header")
    }

    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

    const isValid =
        expected.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));

    if (!isValid) {
        logger.warn('Invalid razorpay webhook signature', { ip: req.ip });
        throw new ApiError(400, "Invalid webhook signature")
    }

    let event;
    try {
        event = JSON.parse(rawBody.toString())
    } catch (error) {
        throw new ApiError(400, "Malformed payload")
    }

    const eventId = req.headers['x-razorpay-event-id'] ??
        `${event.event}:${event.payload?.payment?.entity?.id}:${event.created_at}`;

    const dedupeKey = `webhook:razorpay:${eventId}`;
    
    const firstSeen = await redisClient.set(dedupeKey, '1', 'EX', 60*60*24, "NX")

    if(!firstSeen){
        throw new ApiError(200, "duplicate_ignored")
    }

    
})

export { razorpayWebhookHandler }