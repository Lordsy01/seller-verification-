import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AdminLayout from '../layouts/AdminLayout';
import './styles/AdminDashboard.css';

function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pendingVerifications: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [gigsRes, ordersRes, verRes] = await Promise.all([
          api.get('/gigs/admin/all'),
          api.get('/orders/admin/all'),
          api.get('/verifications?status=pending')
        ]);

        const paidOrders = ordersRes.data.filter((o) => o.status === 'paid');
        const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

        setStats({
          products: gigsRes.data.length,
          orders: ordersRes.data.length,
          revenue,
          pendingVerifications: verRes.data.length
        });
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>A snapshot of DoualaMarket's activity</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-card__label">Total Revenue</p>
          <p className="stat-card__value">XAF {stats.revenue.toLocaleString()}</p>
          <p className="stat-card__meta">From paid orders</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Total Orders</p>
          <p className="stat-card__value">{stats.orders}</p>
          <p className="stat-card__meta">All time</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Active Products</p>
          <p className="stat-card__value">{stats.products}</p>
          <p className="stat-card__meta">Across all vendors</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Pending Verifications</p>
          <p className="stat-card__value">{stats.pendingVerifications}</p>
          <p className="stat-card__meta">Needs review</p>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card__toolbar">
          <strong>Recent Orders</strong>
          <Link to="/admin/products" className="view-all">View Products →</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Buyer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="4" className="empty-cell">Loading...</td></tr>}
            {!loading && recentOrders.length === 0 && <tr><td colSpan="4" className="empty-cell">No orders yet.</td></tr>}
            {recentOrders.map((o) => (
              <tr key={o._id}>
                <td className="cell-title">{o.buyer?.name}</td>
                <td className="cell-sub">XAF {o.total.toLocaleString()}</td>
                <td><span className={`badge badge--${o.status === 'paid' ? 'approved' : o.status === 'failed' ? 'rejected' : 'pending'}`}>{o.status}</span></td>
                <td className="cell-sub">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminOverview;