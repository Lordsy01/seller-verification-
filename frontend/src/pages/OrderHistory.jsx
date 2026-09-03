import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './styles/OrderHistory.css';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }} className="orders-page container">
        <h1>My Orders</h1>

        {loading && <p className="muted-note">Loading orders...</p>}
        {!loading && orders.length === 0 && (
          <div className="orders-empty">
            <span className="material-symbols-outlined">receipt_long</span>
            <p>You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">Browse Products</Link>
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <p className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-card__date">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`badge badge--${order.status === 'paid' ? 'approved' : order.status === 'failed' ? 'rejected' : 'pending'}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card__items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-card__item">
                    <span>{item.title} × {item.quantity}</span>
                    <span>XAF {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="order-card__footer">
                <span>Total</span>
                <strong>XAF {order.total.toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OrderHistory;