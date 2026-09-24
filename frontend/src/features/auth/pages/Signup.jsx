import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../../shared/api';
import { useAuth } from '../AuthContext';
import '../../auth/Auth.css';

const DOUALA_NEIGHBORHOODS = [
  'Akwa', 'Bonanjo', 'Bonapriso', 'Bali', 'Deido',
  'New Bell', 'Bepanda', 'Ndokoti', 'Makepe', 'Logbaba',
  'PK8', 'PK10', 'PK12', 'PK14', 'Bonaberi',
  'Kotto', 'Ndogbong', 'Village', 'Cite des Palmiers', 'Yassa'
];

function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', location: '',
    role: searchParams.get('role') === 'seller' ? 'seller' : 'buyer'
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { email: formData.email, otp });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'seller' ? '/become-seller' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-card__logo">DoualaMarket</p>
          <h1>Verify your email</h1>
          <p className="auth-card__subtitle">
            We sent a 6-digit code to <strong>{formData.email}</strong>
          </p>

          <form onSubmit={handleVerifySubmit}>
            <div className="field">
              <label>Verification Code</label>
              <input
                type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                maxLength={6} required autoFocus
                style={{ letterSpacing: '4px', fontSize: '1.2rem', textAlign: 'center' }}
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-card__logo">DoualaMarket</p>
        <h1>Create your account</h1>
        <p className="auth-card__subtitle">Join as a buyer or vendor</p>

        <div className="role-toggle">
          {['buyer', 'seller'].map((r) => (
            <button
              key={r} type="button"
              onClick={() => setFormData({ ...formData, role: r })}
              className={`role-toggle__btn ${formData.role === r ? 'is-active' : ''}`}
            >
              {r === 'seller' ? 'Vendor' : 'Buyer'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSignupSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label>Neighborhood (optional)</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.95rem' }}
            >
              <option value="">Select your neighborhood (optional)</option>
              {DOUALA_NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;