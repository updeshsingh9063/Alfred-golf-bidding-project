import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { useAuth } from '../../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const from = location.state?.from || '/';
  const message = location.state?.message;

  // Check if URL has ?mode=signup parameter
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('GB');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update mode if URL parameter changes
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {

          // The user is also available via fetchApi, but since login doesn't return user, we wait for auth context
          // Since the auth context does setUser, we can just redirect.
          // Wait, login sets local storage. Let's just go to dashboard and let ProtectedRoute handle it.
          // In real scenarios, login could return role. For simplicity:
          // we can redirect to /dashboard and let ProtectedRoute bounce to /admin if needed.
          // Actually, our backend login returns the user. We should return the user from login.
          // I will redirect to the intended page. If admin, they can navigate to /admin.
          navigate(from);
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
      } else {
        // Signup
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || ' ';

        const success = await register({ firstName, lastName, email, password, phone, country });
        if (success) {
          navigate(from === '/dashboard' ? '/subscribe' : from); // Redirect to fake payment flow or intended page
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen flex-col bg-bg bg-cover bg-center"
      style={{ backgroundImage: "url('/login-bg.jpeg')" }}
    >
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-center">
            <Link to="/" className="font-display text-5xl font-semibold tracking-tight text-accent-deep">
              Alfred
            </Link>
            <p className="mt-3 text-lg text-ink-soft">Play. Give. Win.</p>
          </div>

          {message && (
            <div className="mb-6 rounded-xl bg-gold-soft/40 px-5 py-4 text-center text-sm font-medium text-accent-deep">
              {message}
            </div>
          )}

          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-10 shadow-[var(--shadow-ambient)]">
            <div className="mb-6 flex rounded-full bg-surface-sunken p-1.5">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full py-2.5 text-base font-medium transition-colors ${
                  mode === 'login' ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft'
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full py-2.5 text-base font-medium transition-colors ${
                  mode === 'signup' ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft'
                }`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="mb-2 block text-base font-medium text-ink-soft">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Mitchell"
                      required
                      className="w-full rounded-xl border border-border bg-bg px-5 py-4 text-lg text-ink placeholder:text-ink-soft/40 focus:border-accent-deep focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-base font-medium text-ink-soft">
                      Phone number
                    </label>
                    <div className="flex gap-3">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-1/3 rounded-xl border border-border bg-bg px-4 py-4 text-base text-ink focus:border-accent-deep focus:outline-none"
                      >
                        <option value="GB">+44 (UK)</option>
                        <option value="US">+1 (US)</option>
                        <option value="IN">+91 (IN)</option>
                        <option value="IE">+353 (IE)</option>
                        <option value="AU">+61 (AU)</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="7700 900000"
                        className="w-2/3 rounded-xl border border-border bg-bg px-5 py-4 text-lg text-ink placeholder:text-ink-soft/40 focus:border-accent-deep focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-base font-medium text-ink-soft">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-border bg-bg px-5 py-4 text-lg text-ink placeholder:text-ink-soft/40 focus:border-accent-deep focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-medium text-ink-soft">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-border bg-bg px-5 py-4 pr-12 text-lg text-ink placeholder:text-ink-soft/40 focus:border-accent-deep focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-danger/10 px-5 py-4 text-base text-danger">
                  {error}
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right mt-3">
                  <button type="button" className="text-base text-accent-deep hover:text-accent-deep-hov">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-full bg-accent-deep py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-deep-hov disabled:opacity-50"
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Log in' : 'Create account')}
              </button>
            </form>

            <p className="mt-8 text-center text-base text-ink-soft">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-medium text-accent-deep hover:text-accent-deep-hov"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-medium text-accent-deep hover:text-accent-deep-hov"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
