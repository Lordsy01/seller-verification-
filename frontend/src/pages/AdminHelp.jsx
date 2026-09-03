import AdminLayout from '../layouts/AdminLayout';
import './styles/AdminDashboard.css';

function AdminHelp() {
  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Help & Support</h1>
          <p>Common questions about managing DoualaMarket</p>
        </div>
      </div>

      <div className="data-card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>How do I verify a seller?</h3>
          <p className="cell-sub">Go to Verifications, review the uploaded ID document, then click Approve or Reject.</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>How do I remove a product?</h3>
          <p className="cell-sub">Go to Products and click Deactivate next to any listing. This hides it from buyers without deleting it.</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>How do I delete a user account?</h3>
          <p className="cell-sub">Go to Vendors, find the account, and click Delete. This permanently removes the account and its listings.</p>
        </div>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Need more help?</h3>
          <p className="cell-sub">Contact the development team directly for technical issues.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHelp;