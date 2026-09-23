import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_YourRazorpayKeyId';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'YourRazorpayKeySecret';

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });
  console.log(`[Payment Service] Razorpay initialized with Key ID: ${key_id}`);
} catch (err) {
  console.warn(`[Payment Service] Razorpay initialization warning: ${err.message}. Sandbox simulation available.`);
}

export default razorpayInstance;
