import { Router } from 'express';
import express from 'express';
import { razorpayWebhookHandler } from '../controllers/webhook.controller.js';

const router = Router()

router.route("/webhooks/razorpay").post(express.raw({ type: 'application/json' }), razorpayWebhookHandler)
export default router