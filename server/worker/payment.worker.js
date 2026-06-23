import { Worker } from 'bullmq';
import mongoose from 'mongoose';

import { redisClient } from '../lib/redisClient.js';
import { grantXP } from '../services/xpService.js';
import logger from '../logger/index.js'

import Payment from '../models/payment.model.js';
import UserEntitlement from '../models/userEntitlement.model.js';

export const paymentWorker = new Worker(
    'payment-events',
    async (job) => {
        const { event, payload, eventId } = job.data;

        switch (event) {
            case 'payment.captured':
                await handleCaptured(payload, eventId);
                break;

            case 'payment.failed':
                await handleFailed(payload);
                break;

            default:
                logger.info('Unhandled razorpay event type', { event, eventId });
        }
    },
    {
        connection: redisClient,
        concurrency: 5,
    }
);

async function handleCaptured(payload, eventId) {
    const paymentEntity = payload.payment.entity;

    const payment = await Payment.findOne({
        razorpayOrderId: paymentEntity.order_id,
    });

    if (!payment) {
        logger.error('Webhook captured event for unknown order', {
            orderId: paymentEntity.order_id,
            eventId,
        });

        return;
    }

    // Idempotency check
    if (payment.status === 'CAPTURED') {
        logger.info('Duplicate capture event ignored', {
            paymentId: payment._id,
            eventId,
        });

        return;
    }

    // Amount validation
    if (paymentEntity.amount !== payment.amount) {
        await Payment.updateOne(
            { _id: payment._id },
            {
                $set: {
                    status: 'FAILED',
                    failureReason: 'amount_mismatch',
                },
            }
        );

        logger.error('Amount mismatch on capture — possible tampering', {
            paymentId: payment._id,
            expected: payment.amount,
            got: paymentEntity.amount,
        });

        return;
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await Payment.updateOne(
                { _id: payment._id },
                {
                    $set: {
                        status: 'CAPTURED',
                        razorpayPaymentId: paymentEntity.id,
                        webhookEventId: eventId,
                    },
                },
                { session }
            );

            await UserEntitlement.findOneAndUpdate(
                {
                    userId: payment.userId,
                    productType: payment.productType,
                },
                {
                    $set: {
                        active: true,
                    },
                    $setOnInsert: {
                        userId: payment.userId,
                        productType: payment.productType,
                    },
                },
                {
                    upsert: true,
                    session,
                }
            );
        });
    } finally {
        await session.endSession();
    }

    // Side effects AFTER successful DB commit
    try {
        await grantXP(payment.userId, 'PREMIUM_UNLOCK_XP');
    } catch (err) {
        logger.error('XP grant failed post-payment', {
            userId: payment.userId,
            error: err.message,
        });
    }

    await redisClient.del(`entitlement:${payment.userId}`);

    logger.info('Payment captured + entitlement unlocked', {
        paymentId: payment._id,
        userId: payment.userId,
    });
}

async function handleFailed(payload) {
    const paymentEntity = payload.payment.entity;

    await Payment.updateOne(
        {
            razorpayOrderId: paymentEntity.order_id,
        },
        {
            $set: {
                status: 'FAILED',
                failureReason:
                    paymentEntity.error_description ?? 'unknown',
            },
        }
    );

    logger.warn('Payment failed', {
        orderId: paymentEntity.order_id,
        reason: paymentEntity.error_description,
    });
}

paymentWorker.on('failed', (job, err) => {
    logger.error('Payment job failed all retries', {
        jobId: job?.id,
        error: err.message,
    });
});