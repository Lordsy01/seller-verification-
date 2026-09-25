import { useState, useEffect } from 'react';
import api from '../../../shared/api';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import '../../orders/pages/OrderHistory.css';

function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/mine')
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }} className="orders-page container">
        <h1>My Messages</h1>
        {loading && <p className="muted-note">Loading...</p>}
        {!loading && messages.length === 0 && <p className="muted-note">No messages yet.</p>}
        <div className="orders-list">
          {messages.map((m) => (
            <div key={m._id} className="order-card">
              <p className="order-card__date">
                {m.product ? `About: ${m.product.title}` : 'General inquiry'} · {new Date(m.createdAt).toLocaleString()}
              </p>
              <p style={{ marginTop: 8 }}>{m.body}</p>
              {m.reply ? (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--color-bg)', borderRadius: 8 }}>
                  <strong style={{ fontSize: '0.85rem' }}>Reply:</strong>
                  <p style={{ marginTop: 4 }}>{m.reply}</p>
                </div>
              ) : (
                <p className="muted-note" style={{ marginTop: 10 }}>Awaiting reply...</p>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyMessages;