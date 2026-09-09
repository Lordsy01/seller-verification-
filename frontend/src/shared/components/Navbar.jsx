import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import './Navbar.css';
import { useCart } from '../../features/orders/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();


  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="logo">DoualaMarket</Link>

        <div className="site-header__search">
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Search products..." />
        </div>

        <nav className="site-header__links">
          <a href="#categories">Categories</a>
          <a href="#gigs">New in Douala</a>
        </nav>

        <div className="site-header__actions">
          {user ? (
            <>
              {user.role === 'seller' && user.verificationStatus === 'approved' && (
                <Link to="/post-gig" className="btn btn-accent" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  + Post Product
                </Link>
              )}
              {user.role === 'seller' && (
                <Link to="/seller/orders" className="icon-btn" title="Orders received">
                  <span className="material-symbols-outlined">receipt_long</span>
                </Link>
              )}
              {user.role === 'buyer' && (
                <Link to="/orders" className="icon-btn" title="My orders">
                  <span className="material-symbols-outlined">receipt_long</span>
                </Link>
              )}
              <span className="user-chip">Hi, <strong>{user.name}</strong></span>
              <button onClick={logout} className="icon-btn" title="Log out">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="icon-btn"><span className="material-symbols-outlined">account_circle</span></Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Sign Up</Link>
              <Link to="/change-password" className="icon-btn" title="Change password">
               <span className="material-symbols-outlined">lock_reset</span>
              </Link>
              <Link to="/cart" className="icon-btn">
                <span className="material-symbols-outlined">shopping_cart</span>
                {itemCount > 0 && <span className="badge-count">{itemCount}</span>}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;