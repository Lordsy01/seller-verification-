import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../shared/api';
import '../../auth/Auth.css';


function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      // move to the reset screen after a short pause so they can read the message
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-card__logo">DoualaMarket</p>
        <h1>Forgot your password?</h1>
        <p className="auth-card__subtitle">Enter your email and we'll send you a reset code.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {message && <p className="auth-success">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        <p className="auth-card__footer">
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;