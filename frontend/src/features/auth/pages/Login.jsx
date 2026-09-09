import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../shared/api';
import { useAuth } from '../AuthContext';
import '../../auth/Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setResendMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        setNeedsVerification(true);
      }
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    try {
      const res = await api.post('/auth/resend-code', { email: formData.email });
      setResendMessage(res.data.message);
    } catch (err) {
      setResendMessage(err.response?.data?.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-card__logo">DoualaMarket</p>
        <h1>Welcome back</h1>
        <p className="auth-card__subtitle">Log in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {needsVerification && (
            <button
              type="button"
              onClick={handleResend}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, marginBottom: 14, fontSize: '0.85rem' }}
            >
              Resend verification code
            </button>
          )}
          {resendMessage && <p className="auth-success">{resendMessage}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;