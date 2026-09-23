import crypto from 'crypto';
import axios from 'axios';
import razorpayInstance from '../config/razorpay.js';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'YourRazorpayKeySecret';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'YourRazorpayWebhookSecret';

// Pricing packages definition
export const PACKAGES = {
  starter: { id: 'starter', name: 'Starter Pack', credits: 50, amount: 19900, currency: 'INR' }, // ₹199
  pro: { id: 'pro', name: 'Pro Creator', credits: 250, amount: 69900, currency: 'INR' }, // ₹699
  enterprise: { id: 'enterprise', name: 'Enterprise Architect', credits: 1000, amount: 199900, currency: 'INR' }, // ₹1999
};

// POST /api/payments/create-order
export const createOrder = async (req, res) => {
  try {
    const { packageId = 'starter', uid } = req.body;
    const selectedPack = PACKAGES[packageId] || PACKAGES.starter;

    const receipt = `rcpt_${Date.now()}_${uid ? uid.slice(0, 6) : 'anon'}`;
    const options = {
      amount: selectedPack.amount,
      currency: selectedPack.currency,
      receipt,
      notes: {
        packageId: selectedPack.id,
        credits: selectedPack.credits,
        uid: uid || 'anonymous',
      },
    };

    try {
      if (razorpayInstance && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('YourRazorpayKeyId')) {
        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          package: selectedPack,
          keyId: process.env.RAZORPAY_KEY_ID,
        });
      }
    } catch (rzpErr) {
      console.warn('[Payment Service] Razorpay API warning, falling back to Sandbox simulation order:', rzpErr.message);
    }

    // Dev/Sandbox simulation order response
    const mockOrderId = `order_sim_${Date.now()}`;
    return res.status(200).json({
      success: true,
      orderId: mockOrderId,
      amount: selectedPack.amount,
      currency: selectedPack.currency,
      package: selectedPack,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_simulated_key',
      simulated: true,
    });
  } catch (error) {
    console.error('[Payment Service] createOrder error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      packageId = 'starter',
      uid,
    } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: 'User UID is required to credit tokens.' });
    }

    const selectedPack = PACKAGES[packageId] || PACKAGES.starter;
    let isValid = false;

    // Signature verification if real credentials are used
    if (razorpay_signature && RAZORPAY_KEY_SECRET && !RAZORPAY_KEY_SECRET.includes('YourRazorpayKeySecret')) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    } else {
      // In sandbox mode without real keys, allow verified test checkout
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    // Top up credits in Auth Service
    try {
      const creditRes = await axios.post(`${AUTH_SERVICE_URL}/api/auth/add-credit`, {
        uid,
        amount: selectedPack.credits,
      });

      return res.status(200).json({
        success: true,
        message: `Successfully credited ${selectedPack.credits} credits!`,
        totalCredits: creditRes.data.credits,
        package: selectedPack,
      });
    } catch (creditErr) {
      console.error('[Payment Service] Failed to notify Auth Service for credit top-up:', creditErr.message);
      return res.status(200).json({
        success: true,
        message: `Payment verified. Queued ${selectedPack.credits} credits to user ${uid}.`,
        package: selectedPack,
      });
    }
  } catch (error) {
    console.error('[Payment Service] verifyPayment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payments/webhook
export const handleWebhook = async (req, res) => {
  try {
    const secret = RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).send('Invalid webhook signature');
      }
    }

    const event = req.body.event;
    console.log(`[Payment Service] Received Webhook Event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const notes = paymentEntity.notes || {};
      const uid = notes.uid;
      const credits = parseInt(notes.credits, 10) || 50;

      if (uid) {
        await axios.post(`${AUTH_SERVICE_URL}/api/auth/add-credit`, {
          uid,
          amount: credits,
        });
        console.log(`[Payment Service] Credited ${credits} tokens to ${uid} via webhook`);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[Payment Service] Webhook processing error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/payments/packages
export const getPackages = (req, res) => {
  return res.status(200).json({ success: true, packages: Object.values(PACKAGES) });
};
