import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './styles/OrderHistory.css';

function SellerOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'seller') { navigate('/'); return; }

    api.get('/orders/selling')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }} className="orders-page container">
        <h1>Orders Received</h1>

        {loading && <p className="muted-note">Loading orders...</p>}
        {!loading && orders.length === 0 && (
          <p className="muted-note">No orders yet for your products.</p>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <p className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-card__date">
                    {order.buyer?.name} · {new Date(order.createdAt).toLocaleString()}
                  </p>
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
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SellerOrders;