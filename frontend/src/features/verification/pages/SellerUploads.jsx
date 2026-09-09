import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/api';
import { useAuth } from '../../auth/AuthContext';
import Navbar from '../../../shared/components/Navbar';
import FileUpload from '../../verification/components/FileUpload';
import '../../auth/Auth.css';

function SellerUpload() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [existingRequest, setExistingRequest] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'seller') { navigate('/'); return; }
    checkExistingRequest();
  }, [user, authLoading]);

  const checkExistingRequest = async () => {
    try {
      const res = await api.get('/verifications/me');
      setExistingRequest(res.data);
    } catch (err) {
      // no request yet — fine
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a document image.');
      setStatus('error');
      return;
    }
    const data = new FormData();
    data.append('document', file);
    try {
      setStatus('loading');
      const res = await api.post('/verifications/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setMessage(res.data.message);
      setExistingRequest(res.data.data);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  if (checking) return <p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <div className="auth-page" style={{ minHeight: 'auto', paddingTop: 60 }}>
        <div className="auth-card">
          <h1>Vendor Verification</h1>

          {existingRequest ? (
            <>
              <p className="auth-card__subtitle">You've already submitted a verification request.</p>
              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                <p>Status: <span className={`badge badge--${existingRequest.status}`}>{existingRequest.status}</span></p>
                {existingRequest.adminNote && (
                  <p style={{ fontSize: '0.85rem', marginTop: 8, color: 'var(--color-text-muted)' }}>
                    Note: {existingRequest.adminNote}
                  </p>
                )}
              </div>
              {existingRequest.status === 'approved' && (
                <p className="auth-success" style={{ marginTop: 16 }}>
                  You're verified! You can now post products.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="auth-card__subtitle">
                Upload a government ID or business license to get verified as a vendor.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <FileUpload onFileSelect={setFile} label="ID or business license" />
                </div>
                {message && (
                  <p className={status === 'success' ? 'auth-success' : 'auth-error'}>{message}</p>
                )}
                <button type="submit" disabled={status === 'loading'} className="btn btn-primary btn-block">
                  {status === 'loading' ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerUpload;