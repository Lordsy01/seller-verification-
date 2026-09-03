import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './styles/Checkout.css';

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState('form'); // 'form' | 'pending' | 'paid' | 'failed'
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const pollRef = useRef(null);

  const deliveryFee = items.length > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0 && stage === 'form') {
      navigate('/cart');
    }
  }, [items, stage]);

  // clean up the polling interval if the component unmounts mid-payment
  useEffect(() => () => clearInterval(pollRef.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^237\d{9}$/.test(phone)) {
      setError('Enter a valid number in the format 237XXXXXXXXX');
      return;
    }

    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, title: i.title })),
        phone,
        paymentMethod
      });

      setOrderId(res.data.orderId);
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
          clearCart();
          setStage('paid');
        } else if (res.data.status === 'failed') {
          clearInterval(pollRef.current);
          setStage('failed');
          setError(res.data.message || 'Payment failed.');
        }
        // if still 'pending', the interval just keeps checking
      } catch (err) {
        // network hiccup — keep polling, don't hard-fail on one missed check
      }
    }, 3000); // check every 3 seconds
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <div className="checkout-page container">
        <h1>Checkout</h1>

        {stage === 'form' && (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2>Payment Method</h2>
              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'momo' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('momo')}
                >
                  MTN Mobile Money
                </button>
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'om' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('om')}
                >
                  Orange Money
                </button>
              </div>

              <div className="field" style={{ marginTop: 20 }}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="237677777777"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="btn btn-accent btn-block">
                Pay XAF {total.toLocaleString()}
              </button>
            </form>

            <div className="order-summary">
              <h2>Order Summary</h2>
              {items.map((i) => (
                <div key={i.productId} className="order-summary__row">
                  <span>{i.title} × {i.quantity}</span>
                  <strong>XAF {(i.price * i.quantity).toLocaleString()}</strong>
                </div>
              ))}
              <div className="order-summary__divider" />
              <div className="order-summary__row">
                <span>Delivery</span>
                <strong>XAF {deliveryFee.toLocaleString()}</strong>
              </div>
              <div className="order-summary__row order-summary__total">
                <span>Total</span>
                <strong>XAF {total.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {stage === 'pending' && (
          <div className="checkout-status">
            <div className="checkout-status__spinner" />
            <h2>Approve the payment on your phone</h2>
            <p>A prompt was sent to {phone}. This page will update automatically once you approve it.</p>
          </div>
        )}

        {stage === 'paid' && (
          <div className="checkout-status">
            <span className="material-symbols-outlined checkout-status__icon checkout-status__icon--success">check_circle</span>
            <h2>Payment Successful</h2>
            <p>Your order has been placed. Thank you for shopping with DoualaMarket!</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        )}

        {stage === 'failed' && (
          <div className="checkout-status">
            <span className="material-symbols-outlined checkout-status__icon checkout-status__icon--failed">error</span>
            <h2>Payment Failed</h2>
            <p>{error || 'The transaction was not completed.'}</p>
            <button className="btn btn-primary" onClick={() => setStage('form')}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;