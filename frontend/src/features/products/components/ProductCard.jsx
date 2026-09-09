import { useState } from 'react';
import { Link } from 'react-router-dom';
import BuyNowModal from '../../orders/components/BuyNowModal';
import './ProductCard.css';

function ProductCard({ product }) {
  const [showBuy, setShowBuy] = useState(false);

  if (!product) return null;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card__image">
        <span className="badge badge--stock">In Stock</span>
        <img src={product.image} alt={product.title} />
      </Link>
      <div className="product-card__body">
        <p className="product-card__vendor">{product.seller?.name}</p>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-card__title">{product.title}</h3>
        </Link>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price"><small>XAF</small> {Number(product.price).toLocaleString()}</span>
          <button className="btn btn-accent" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => setShowBuy(true)}>
            Buy
          </button>
        </div>
      </div>

      {showBuy && <BuyNowModal product={product} quantity={1} onClose={() => setShowBuy(false)} />}
    </div>
  );
}

export default ProductCard;