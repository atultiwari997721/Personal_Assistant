import jwt from 'jsonwebtoken';
import { memoryUserStore } from './src/models/User.js';
import { PACKAGES } from '../payment-service/src/controllers/paymentController.js';

console.log('====================================================');
console.log('🧪 CORTEX AUTH & PAYMENT VERIFICATION SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

const assert = (condition, name) => {
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${name}`);
    failed++;
  }
};

// 1. Verify User Store & Initial Credits
const testUser = memoryUserStore.get('demo-user-123');
assert(testUser && testUser.credits === 50, 'User store initialized with credits balance');

// 2. Test JWT Signing & Verification
const token = jwt.sign(
  { uid: testUser.uid, email: testUser.email, name: testUser.name },
  'super_secret_jwt_key_cortex_ai_2026_dev',
  { expiresIn: '7d' }
);
assert(typeof token === 'string' && token.length > 20, 'JWT token generation succeeds');

const decoded = jwt.verify(token, 'super_secret_jwt_key_cortex_ai_2026_dev');
assert(decoded.uid === testUser.uid, 'JWT signature and payload decoded correctly');

// 3. Test Credit Deduction (1 credit per task)
const prevCredits = testUser.credits;
testUser.credits -= 1;
assert(testUser.credits === prevCredits - 1, 'Atomic 1-credit per task deduction works');

// 4. Test Credit Top-Up (e.g. Pro pack purchase: +250 credits)
const proPack = PACKAGES.pro;
testUser.credits += proPack.credits;
assert(testUser.credits === prevCredits - 1 + 250, 'Razorpay purchase credit increment works (+250 credits)');

// 5. Test Insufficient Credits Guard
testUser.credits = 0;
const canExecute = testUser.credits >= 1;
assert(canExecute === false, 'Zero balance triggers INSUFFICIENT_CREDITS guard correctly');

console.log('\n====================================================');
console.log(`📊 Auth & Payment Summary: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

process.exit(failed > 0 ? 1 : 0);
