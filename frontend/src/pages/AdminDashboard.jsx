import { useState, useEffect } from 'react';
import api from '../api';
import AdminLayout from '../layouts/AdminLayout';
import './styles/AdminDashboard.css';

function StatusBadge({ status }) {
  return <span className={`badge badge--${status}`}>{status}</span>;
}

function AdminDashboard() {
  const [verifications, setVerifications] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => { fetchVerifications(); }, [filter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const res = await api.get(`/verifications${query}`);
      setVerifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    const adminNote = decision === 'rejected' ? prompt('Reason for rejection (optional):') || '' : '';
    try {
      await api.patch(`/verifications/${id}`, { status: decision, adminNote });
      setVerifications((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const counts = {
    pending: verifications.filter((v) => v.status === 'pending').length,
  };

  const visible = verifications.filter((v) =>
    v.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.seller?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Seller Verifications</h1>
          <p>Review and approve ID documents submitted by sellers</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-card__label">Total Requests</p>
          <p className="stat-card__value">{verifications.length}</p>
          <p className="stat-card__meta">All time</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Pending Review</p>
          <p className="stat-card__value">{counts.pending}</p>
          <p className="stat-card__meta">Needs action</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Approved</p>
          <p className="stat-card__value">{verifications.filter(v => v.status === 'approved').length}</p>
          <p className="stat-card__meta">Verified sellers</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Rejected</p>
          <p className="stat-card__value">{verifications.filter(v => v.status === 'rejected').length}</p>
          <p className="stat-card__meta">Declined</p>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card__toolbar">
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              placeholder="Search by seller name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="tab-pills">
            {['pending', 'approved', 'rejected', 'all'].map((tab) => (
              <button
                key={tab}
                className={`tab-pill ${filter === tab ? 'is-active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Seller</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="empty-cell">Loading...</td></tr>}
            {!loading && visible.length === 0 && <tr><td colSpan="5" className="empty-cell">No requests found.</td></tr>}
            {visible.map((v) => (
              <tr key={v._id}>
                <td>
                  <img
                    src={`http://localhost:5000/${v.documentPath}`}
                    alt="document"
                    className="doc-thumb"
                    onClick={() => setPreviewImage(`http://localhost:5000/${v.documentPath}`)}
                  />
                </td>
                <td>
                  <p className="cell-title">{v.seller?.name}</p>
                  <p className="cell-sub">{v.seller?.email}</p>
                </td>
                <td className="cell-sub">{new Date(v.createdAt).toLocaleDateString()}</td>
                <td><StatusBadge status={v.status} /></td>
                <td>
                  {v.status === 'pending' ? (
                    <div className="row-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleDecision(v._id, 'approved')}>Approve</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleDecision(v._id, 'rejected')}>Reject</button>
                    </div>
                  ) : (
                    <span className="cell-sub">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="preview" />
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;