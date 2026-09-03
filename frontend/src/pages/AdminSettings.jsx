import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import '../pages/styles/Auth.css';
import './styles/AdminDashboard.css';

function AdminSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

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
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin account</p>
        </div>
      </div>

      <div className="data-card" style={{ maxWidth: 480, padding: 24 }}>
        <p className="cell-title" style={{ marginBottom: 4 }}>{user?.name}</p>
        <p className="cell-sub" style={{ marginBottom: 20 }}>{user?.email}</p>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Change Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required minLength={6} />
          </div>
          <div className="field">
            <label>Confirm New Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
          </div>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;