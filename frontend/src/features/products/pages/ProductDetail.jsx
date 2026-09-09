import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../shared/api';
import BuyNowModal from '../../orders/components/BuyNowModal';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import '../ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBuy, setShowBuy] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/gigs/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p>;
  if (notFound || !product) {
    return (
      <div>
        <Navbar />
        <p style={{ textAlign: 'center', marginTop: 80 }}>Product not found.</p>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 12 }}>← Back home</Link>
      </div>
    );
  }

  const imageUrl = `http://localhost:5000/${product.image.replace(/\\/g, '/')}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }} className="product-detail container">
        <div className="product-detail__breadcrumb">
          <Link to="/">Home</Link> <span>/</span> {product.title}
        </div>

        <div className="product-detail__layout">
          <div className="product-detail__gallery">
            <span className="badge badge--stock">In Stock</span>
            <img src={imageUrl} alt={product.title} />
          </div>

          <div className="product-detail__info">
            <h1>{product.title}</h1>
            <p className="product-detail__price"><small>XAF</small> {Number(product.price).toLocaleString()}</p>
            <p className="product-detail__desc">{product.description}</p>

            <div className="product-detail__qty">
              <span>Quantity</span>
              <div className="qty-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <button className="btn btn-accent btn-block" onClick={() => setShowBuy(true)}>
              Buy Now
            </button>

            <div className="product-detail__vendor">
              <div className="product-detail__vendor-avatar">{product.seller?.name?.[0] || 'V'}</div>
              <div>
                <p className="product-detail__vendor-name">{product.seller?.name}</p>
                {product.seller?.verificationStatus === 'approved' && (
                  <p className="product-detail__vendor-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                    Verified Vendor
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showBuy && (
        <BuyNowModal
          product={{ ...product, image: imageUrl }}
          quantity={quantity}
          onClose={() => setShowBuy(false)}
        />
      )}
    </div>
  );
}

export default ProductDetail;