import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './styles/Auth.css';

function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess(res.data.message);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <div className="auth-page" style={{ minHeight: 'auto', paddingTop: 60 }}>
        <div className="auth-card">
          <h1>Change Password</h1>
          <p className="auth-card__subtitle">Update your account password</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Current Password</label>
              <input
                type="password" name="currentPassword"
                value={formData.currentPassword} onChange={handleChange} required
              />
            </div>
            <div className="field">
              <label>New Password</label>
              <input
                type="password" name="newPassword"
                value={formData.newPassword} onChange={handleChange} required minLength={6}
              />
            </div>
            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange} required minLength={6}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;