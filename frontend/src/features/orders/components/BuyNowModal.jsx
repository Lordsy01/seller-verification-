import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/api';
import { useAuth } from '../../auth/AuthContext';
import './BuyNowModal.css';

function BuyNowModal({ product, quantity = 1, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState('form'); // form | pending | paid | failed
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  const total = product.price * quantity;

  useEffect(() => () => clearInterval(pollRef.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) { navigate('/login'); return; }
    if (!/^237\d{9}$/.test(phone)) {
      setError('Enter a valid number in the format 237XXXXXXXXX');
      return;
    }

    try {
      const res = await api.post('/orders', {
        items: [{ productId: product._id, quantity, title: product.title }],
        phone,
        paymentMethod
      });
      setStage('pending');
      startPolling(res.data.orderId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start payment.');
    }
  };

  const startPolling = (id) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${id}/status`);
        if (res.data.status === 'paid') {
          clearInterval(pollRef.current);
          setStage('paid');
        } else if (res.data.status === 'failed') {
          clearInterval(pollRef.current);
          setStage('failed');
          setError(res.data.message || 'Payment failed.');
        }
      } catch (err) { /* keep polling through transient errors */ }
    }, 3000);
  };

  return (
    <div className="buy-modal-backdrop" onClick={onClose}>
      <div className="buy-modal" onClick={(e) => e.stopPropagation()}>
        <button className="buy-modal__close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        {stage === 'form' && (
          <>
            <h2>Buy Now</h2>
            <div className="buy-modal__product">
              <img src={product.image} alt={product.title} />
              <div>
                <p className="buy-modal__title">{product.title}</p>
                <p className="buy-modal__price">
                  XAF {total.toLocaleString()}{quantity > 1 ? ` (${quantity} items)` : ''}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="payment-options">
                <button type="button" className={`payment-option ${paymentMethod === 'momo' ? 'is-active' : ''}`} onClick={() => setPaymentMethod('momo')}>
                  MTN Mobile Money
                </button>
                <button type="button" className={`payment-option ${paymentMethod === 'om' ? 'is-active' : ''}`} onClick={() => setPaymentMethod('om')}>
                  Orange Money
                </button>
              </div>

              <div className="field" style={{ marginTop: 16 }}>
                <label>Phone Number</label>
                <input type="tel" placeholder="237677777777" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="btn btn-accent btn-block">
                Pay XAF {total.toLocaleString()}
              </button>
            </form>
          </>
        )}

        {stage === 'pending' && (
          <div className="buy-modal__status">
            <div className="buy-modal-spinner" />
            <h2>It Might Take A Momment</h2>
            <p>Be patient abeg {phone}.</p>
          </div>
        )}

        {stage === 'paid' && (
          <div className="buy-modal__status">
            <span className="material-symbols-outlined buy-modal-icon buy-modal-icon--success">check_circle</span>
            <h2>Payment Successful</h2>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        )}

        {stage === 'failed' && (
          <div className="buy-modal__status">
            <span className="material-symbols-outlined buy-modal-icon buy-modal-icon--failed">error</span>
            <h2>Payment Failed</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => setStage('form')}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyNowModal;