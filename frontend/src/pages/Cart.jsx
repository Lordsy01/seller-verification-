import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './styles/Cart.css';

function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const deliveryFee = items.length > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }} className="cart-page container">
        <div className="cart-page__header">
          <h1>Your Cart</h1>
          <Link to="/" className="cart-page__continue">← Continue Shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="material-symbols-outlined">shopping_cart</span>
            <p>Your cart is empty.</p>
            <Link to="/" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="cart-item__body">
                    <div className="cart-item__top">
                      <div>
                        <h3>{item.title}</h3>
                        <p className="cart-item__vendor">Vendor: {item.sellerName}</p>
                      </div>
                      <button className="cart-item__remove" onClick={() => removeItem(item.productId)}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                    <div className="cart-item__bottom">
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                      </div>
                      <span className="cart-item__price">
                        <small>XAF</small> {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-summary__row">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <strong>XAF {subtotal.toLocaleString()}</strong>
              </div>
              <div className="order-summary__row">
                <span>Delivery</span>
                <strong>XAF {deliveryFee.toLocaleString()}</strong>
              </div>
              <div className="order-summary__divider" />
              <div className="order-summary__row order-summary__total">
                <span>Total</span>
                <strong>XAF {total.toLocaleString()}</strong>
              </div>
              <p className="order-summary__note">Includes all taxes</p>

              <button className="btn btn-accent btn-block" onClick={() => navigate('/checkout')}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance_wallet</span>
                Checkout with Mobile Money
              </button>
              <p className="order-summary__secure">Secure transactions powered by our payment partner.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Cart;