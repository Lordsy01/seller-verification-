import { useState, useEffect } from 'react';
import api from '../../../shared/api';
import AdminLayout from '../layouts/AdminLayout';
import './AdminDashboard.css'; 

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = roleFilter === 'all' ? '' : `?role=${roleFilter}`;
      const res = await api.get(`/users${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userToDelete) => {
    const confirmed = window.confirm(
      `Delete ${userToDelete.name}'s account permanently? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/users/${userToDelete._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const visible = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Users</h1>
          <p>Manage buyer and vendor accounts</p>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card__toolbar">
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="tab-pills">
            {['all', 'buyer', 'seller', 'admin'].map((tab) => (
              <button
                key={tab}
                className={`tab-pill ${roleFilter === tab ? 'is-active' : ''}`}
                onClick={() => setRoleFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verification</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="6" className="empty-cell">Loading...</td></tr>}
            {!loading && visible.length === 0 && <tr><td colSpan="6" className="empty-cell">No users found.</td></tr>}
            {visible.map((u) => (
              <tr key={u._id}>
                <td className="cell-title">{u.name}</td>
                <td className="cell-sub">{u.email}</td>
                <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                <td>
                  {u.verificationStatus !== 'not_applicable'
                    ? <span className={`badge badge--${u.verificationStatus}`}>{u.verificationStatus}</span>
                    : <span className="cell-sub">—</span>}
                </td>
                <td className="cell-sub">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleDelete(u)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;