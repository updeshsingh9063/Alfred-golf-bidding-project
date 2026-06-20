import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, CreditCard } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { useAuth } from '../../lib/auth';
import { fetchApi } from '../../lib/api';

export default function Subscribe() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'plan' | 'checkout'>('plan');

  useEffect(() => {
    // Check if already subscribed
    if (user?.subscription?.status === 'active') {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate fake processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = await fetchApi('/subscriptions/create', {
        method: 'POST',
        body: JSON.stringify({ plan: selectedPlan })
      });

      if (data.success) {
        await refreshUser();
        navigate('/dashboard');
      } else {
        setError(data.message || 'Payment failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-accent-deep">
              Complete Your Subscription
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Join Alfred Golf to start tracking scores, winning prizes, and supporting charities.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-8 shadow-[var(--shadow-ambient)]">
            {step === 'plan' ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                      selectedPlan === 'monthly'
                        ? 'border-accent-deep bg-accent-deep/5'
                        : 'border-border hover:border-ink-soft/30'
                    }`}
                  >
                    {selectedPlan === 'monthly' && (
                      <div className="absolute right-3 top-3 text-accent-deep">
                        <Check size={20} />
                      </div>
                    )}
                    <h3 className="font-semibold text-ink">Monthly Plan</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-accent-deep">£25</span>
                      <span className="text-xs text-ink-soft">/mo</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent-deep" /> Access to all draws
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent-deep" /> Charity contributions
                      </li>
                    </ul>
                  </button>

                  <button
                    onClick={() => setSelectedPlan('yearly')}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                      selectedPlan === 'yearly'
                        ? 'border-accent-deep bg-accent-deep/5'
                        : 'border-border hover:border-ink-soft/30'
                    }`}
                  >
                    <div className="absolute -top-3 right-4 rounded-full bg-accent text-[10px] font-bold tracking-wider text-white px-2 py-0.5">
                      SAVE 16%
                    </div>
                    {selectedPlan === 'yearly' && (
                      <div className="absolute right-3 top-3 text-accent-deep">
                        <Check size={20} />
                      </div>
                    )}
                    <h3 className="font-semibold text-ink">Yearly Plan</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-accent-deep">£250</span>
                      <span className="text-xs text-ink-soft">/yr</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent-deep" /> Access to all draws
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent-deep" /> 2 months free
                      </li>
                    </ul>
                  </button>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full rounded-full bg-accent-deep py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep-hov"
                >
                  Continue to Payment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div>
                  <button 
                    type="button" 
                    onClick={() => setStep('plan')}
                    className="mb-4 text-xs font-medium text-accent-deep hover:underline"
                  >
                    &larr; Back to plans
                  </button>
                  <h2 className="mb-4 font-semibold text-ink flex items-center gap-2">
                    <CreditCard size={20} className="text-ink-soft" />
                    Simulated Checkout
                  </h2>
                  <p className="text-xs text-ink-soft mb-6 bg-surface-sunken p-3 rounded-lg border border-border">
                    This is a demo environment. No real money will be charged. Click "Pay Securely" to activate your subscription instantly.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                      Card Information
                    </label>
                    <input
                      type="text"
                      disabled
                      value="•••• •••• •••• 4242"
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink opacity-60"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                        Expiry
                      </label>
                      <input
                        type="text"
                        disabled
                        value="12 / 25"
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink opacity-60"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                        CVC
                      </label>
                      <input
                        type="text"
                        disabled
                        value="•••"
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-deep py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep-hov disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : `Pay Securely (£${selectedPlan === 'monthly' ? '25' : '250'})`}
                  {!loading && <Shield size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
