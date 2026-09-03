import { useState, useEffect } from 'react';
import api from '../api';
import AdminLayout from '../layouts/AdminLayout';
import './styles/AdminDashboard.css';

function AdminProducts() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchGigs(); }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gigs/admin/all');
      setGigs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (gig) => {
    try {
      const res = await api.patch(`/gigs/${gig._id}/admin-toggle`);
      setGigs((prev) => prev.map((g) => g._id === gig._id ? res.data.data : g));
    } catch (err) {
      alert('Failed to update product.');
    }
  };

  const visible = gigs.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.seller?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>All products listed across the marketplace</p>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card__toolbar">
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input placeholder="Search by product or vendor..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr><th>Product</th><th>Vendor</th><th>Price</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="empty-cell">Loading...</td></tr>}
            {!loading && visible.length === 0 && <tr><td colSpan="5" className="empty-cell">No products found.</td></tr>}
            {visible.map((g) => (
              <tr key={g._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={`http://localhost:5000/${g.image.replace(/\\/g,'/')}`} alt={g.title} className="doc-thumb" />
                    <span className="cell-title">{g.title}</span>
                  </div>
                </td>
                <td className="cell-sub">{g.seller?.name}</td>
                <td className="cell-sub">XAF {g.price.toLocaleString()}</td>
                <td><span className={`badge ${g.active ? 'badge--approved' : 'badge--rejected'}`}>{g.active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => toggleActive(g)}>
                    {g.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;