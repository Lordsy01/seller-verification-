import { useState } from 'react';
import api from '../../../shared/api';

function MessageModal({ productId, productTitle, onClose }) {
  const [messageText, setMessageText] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    setError('');
    setSending(true);
    try {
      await api.post('/messages', { productId, body: messageText });
      setSent(true);
      setMessageText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="auth-card" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: 4 }}>Message Us</h2>
        {productTitle && (
          <p className="auth-card__subtitle" style={{ marginBottom: 16 }}>About: {productTitle}</p>
        )}

        {sent ? (
          <>
            <p className="auth-success">Message sent! We'll get back to you soon.</p>
            <button className="btn btn-primary btn-block" onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <textarea
              rows={4}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 12, fontFamily: 'inherit' }}
              placeholder={productTitle ? `Ask about "${productTitle}"...` : 'How can we help you?'}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            {error && <p className="auth-error">{error}</p>}
            <button className="btn btn-primary btn-block" onClick={handleSend} disabled={sending}>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MessageModal;