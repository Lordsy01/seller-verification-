import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/api';
import { useAuth } from '../../auth/AuthContext';
import Navbar from '../../../shared/components/Navbar';
import FileUpload from '../../verification/components/FileUpload';
import '../../auth/Auth.css';

function PostGig() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'seller') { navigate('/'); return; }
    if (user.verificationStatus !== 'approved') { navigate('/become-seller'); }
  }, [user, authLoading]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage('Please add a photo for your product.');
      setStatus('error');
      return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('image', image);

    try {
      setStatus('loading');
      await api.post('/gigs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('success');
      setMessage('Product posted! Redirecting...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to post product.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <div className="auth-page" style={{ minHeight: 'auto', paddingTop: 60, paddingBottom: 60 }}>
        <div className="auth-card">
          <h1>Post a New Product</h1>
          <p className="auth-card__subtitle">List a product for buyers to discover</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Product Title</label>
              <input
                type="text" name="title" value={formData.title} onChange={handleChange}
                required maxLength={100} placeholder="Premium Ndolé Leaves - Bulk Pack"
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                required maxLength={1000} rows={4}
              />
            </div>
            <div className="field">
              <label>Price (XAF)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min={5} />
            </div>
            <div className="field">
              <label>Product Photo</label>
              <FileUpload onFileSelect={setImage} label="product photo" />
            </div>

            {message && <p className={status === 'success' ? 'auth-success' : 'auth-error'}>{message}</p>}

            <button type="submit" disabled={status === 'loading'} className="btn btn-primary btn-block">
              {status === 'loading' ? 'Posting...' : 'Post Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostGig;