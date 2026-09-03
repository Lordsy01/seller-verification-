import './styles/Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">DoualaMarket</p>
          <p className="site-footer__copy">© 2026 DoualaMarket Marketplace. All rights reserved.</p>
        </div>
        <nav className="site-footer__links">
          <a href="#">Vendor Dashboard</a>
          <a href="#">Buyer Protection</a>
          <a href="#">Shipping Info</a>
          <a href="#">Help Center</a>
          <a href="#">Terms of Service</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;