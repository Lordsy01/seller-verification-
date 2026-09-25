import { useState, useEffect } from 'react';
import api from '../../../shared/api';
import AdminLayout from '../layouts/AdminLayout';
import './AdminDashboard.css';

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('open');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMessages(); }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const res = await api.get(`/messages${query}`);
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id) => {
    const reply = replyDrafts[id];
    if (!reply || !reply.trim()) return;
    try {
      await api.patch(`/messages/${id}/reply`, { reply });
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert('Failed to send reply.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Messages</h1>
          <p>Buyer inquiries and support requests</p>
        </div>
      </div>

      <div className="tab-pills" style={{ marginBottom: 16, width: 'fit-content' }}>
        {['open', 'replied', 'all'].map((tab) => (
          <button key={tab} className={`tab-pill ${filter === tab ? 'is-active' : ''}`} onClick={() => setFilter(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="muted-note">Loading...</p>}
      {!loading && messages.length === 0 && <p className="muted-note">No messages here.</p>}

      <div className="orders-list">
        {messages.map((m) => (
          <div key={m._id} className="data-card" style={{ padding: 18, marginBottom: 14 }}>
            <p className="cell-title">{m.buyer?.name} <span className="cell-sub">· {m.buyer?.location}</span></p>
            <p className="cell-sub" style={{ marginBottom: 8 }}>
              {m.product ? `About: ${m.product.title}` : 'General inquiry'} · {new Date(m.createdAt).toLocaleString()}
            </p>
            <p style={{ marginBottom: 12 }}>{m.body}</p>

            {m.status === 'replied' ? (
              <div style={{ padding: 10, background: 'var(--color-bg)', borderRadius: 8 }}>
                <strong style={{ fontSize: '0.85rem' }}>Your reply:</strong>
                <p style={{ marginTop: 4 }}>{m.reply}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--color-border)' }}
                  placeholder="Type a reply..."
                  value={replyDrafts[m._id] || ''}
                  onChange={(e) => setReplyDrafts({ ...replyDrafts, [m._id]: e.target.value })}
                />
                <button className="btn btn-primary btn-sm" onClick={() => handleReply(m._id)}>Send</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminMessages;