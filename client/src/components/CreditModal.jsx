import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, Zap, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { setCreditModalOpen, updateCredits } from '../store/authSlice.js';
import api from '../services/api.js';

export const CreditModal = () => {
  const dispatch = useDispatch();
  const { user, isCreditModalOpen } = useSelector((state) => state.auth);
  const [selectedPack, setSelectedPack] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isCreditModalOpen) return null;

  const tiers = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50,
      price: '₹199',
      unit: '₹3.98 / credit',
      badge: 'Starter',
      features: ['50 Agent Executions', 'All 6 Specialized Agents', 'Real-time Web Search', 'Standard Support'],
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      credits: 250,
      price: '₹699',
      unit: '₹2.79 / credit',
      badge: 'Most Popular',
      popular: true,
      features: ['250 Agent Executions', 'Live Code Sandbox Studio', 'PowerPoint & PDF Export', 'Priority LangGraph Queue'],
    },
    {
      id: 'enterprise',
      name: 'Architect Suite',
      credits: 1000,
      price: '₹1,999',
      unit: '₹1.99 / credit',
      badge: 'Best Value',
      features: ['1000 Agent Executions', 'Unlimited Qdrant Vector RAG', 'Dedicated Redis Sessions', 'Direct API Access'],
    },
  ];

  const handleCheckout = async (isSimulation = false) => {
    try {
      setLoading(true);
      setStatusMessage('Creating Razorpay order...');

      // 1. Create Order via Payment Microservice
      const orderRes = await api.post('/payments/create-order', {
        packageId: selectedPack,
        uid: user?.uid,
      });

      const { orderId, amount, currency, keyId, simulated } = orderRes.data;

      // If simulated or requested simulation in test mode
      if (simulated || isSimulation || !window.Razorpay) {
        setStatusMessage('Completing instant verified test credit recharge...');
        const verifyRes = await api.post('/payments/verify', {
          razorpay_order_id: orderId,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: 'test_verified_signature',
          packageId: selectedPack,
          uid: user?.uid,
        });

        dispatch(updateCredits(verifyRes.data.totalCredits || (user?.credits || 0) + (selectedPack === 'starter' ? 50 : selectedPack === 'pro' ? 250 : 1000)));
        setStatusMessage('Recharge Successful! Credits added.');
        setTimeout(() => {
          dispatch(setCreditModalOpen(false));
          setStatusMessage(null);
        }, 1200);
        return;
      }

      // 2. Open Official Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Cortex AI Platform',
        description: `Recharge: ${selectedPack.toUpperCase()} Package`,
        order_id: orderId,
        prefill: {
          name: user?.name || 'Developer',
          email: user?.email || 'developer@cortex.ai',
        },
        theme: {
          color: '#38bdf8',
        },
        handler: async (response) => {
          try {
            setStatusMessage('Verifying payment signature with payment service...');
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageId: selectedPack,
              uid: user?.uid,
            });

            dispatch(updateCredits(verifyRes.data.totalCredits));
            setStatusMessage('Payment verified! Credits added.');
            setTimeout(() => {
              dispatch(setCreditModalOpen(false));
              setStatusMessage(null);
            }, 1000);
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment verification failed.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Could not initiate Razorpay checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full bg-dark-900 border border-dark-700 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8">
        <button
          onClick={() => dispatch(setCreditModalOpen(false))}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 mb-3 cortex-glow">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Top Up Your AI Credits
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Each agent execution across Web Search, Code Sandbox, PPT, PDF, and Images costs 1 credit.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {tiers.map((tier) => {
            const isSelected = selectedPack === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedPack(tier.id)}
                className={`relative rounded-2xl p-5 cursor-pointer transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-dark-850 border-sky-400 shadow-xl shadow-sky-500/10'
                    : 'bg-dark-950/60 border-dark-800 hover:border-dark-700'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-normal">/ pack</span>
                  </div>
                  <p className="text-xs font-semibold text-sky-400 mb-4">{tier.credits} Credits</p>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <div
                    className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 shadow-md'
                        : 'bg-dark-800 text-slate-300'
                    }`}
                  >
                    {isSelected ? 'Selected Package' : 'Select'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-sky-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dark-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secured with Razorpay 256-bit encryption</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Instant Dev Simulation */}
            <button
              onClick={() => handleCheckout(true)}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-semibold text-xs transition border border-dark-700"
            >
              ⚡ Instant Test Top-Up
            </button>

            {/* Official Razorpay Checkout */}
            <button
              onClick={() => handleCheckout(false)}
              disabled={loading}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg transition"
            >
              {loading ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditModal;
