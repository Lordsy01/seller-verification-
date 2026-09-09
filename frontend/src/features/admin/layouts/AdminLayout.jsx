import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './AdminLayout.css';

const navItems = [
  { section: 'Main Menu', items: [
    { label: 'Overview', icon: 'space_dashboard', to: '/admin' },
    { label: 'Verifications', icon: 'verified_user', to: '/admin/verifications' },
    { label: 'Products', icon: 'inventory_2', to: '/admin/products' },
    { label: 'Vendors', icon: 'storefront', to: '/admin/vendors' },
  ]},
  { section: 'Others', items: [
    { label: 'Settings', icon: 'settings', to: '/admin/settings' },
    { label: 'Help & Support', icon: 'help', to: '/admin/help' },
  ]},
];

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* mobile top bar — only visible on small screens */}
      <div className="admin-mobile-bar">
        <button className="admin-mobile-bar__toggle" onClick={() => setSidebarOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="admin-mobile-bar__logo">DoualaMarket</span>
      </div>

      {/* backdrop, only rendered/visible when the drawer is open on mobile */}
      {sidebarOpen && <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar__top">
          <div className="admin-sidebar__logo">
            <span className="material-symbols-outlined">eco</span>
            DoualaMarket
          </div>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((group) => (
            <div key={group.section} className="admin-sidebar__group">
              <p className="admin-sidebar__group-label">{group.section}</p>
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`admin-sidebar__link ${pathname === item.to ? 'is-active' : ''}`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">{user?.name?.[0] || 'A'}</div>
          <div>
            <p className="admin-sidebar__name">{user?.name}</p>
            <p className="admin-sidebar__role">Super Admin</p>
          </div>
          <button onClick={logout} className="admin-sidebar__logout" title="Log out">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <button className="admin-back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;