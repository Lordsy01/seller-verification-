import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../api';
import './styles/ProductsGrid.css';

function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gigs')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="gigs" className="products-section">
      <div className="container">
        <div className="products-section__header">
          <h2>New in Douala</h2>
          <a href="#gigs" className="view-all">View All</a>
        </div>

        {loading && <p className="muted-note">Loading products...</p>}
        {!loading && products.length === 0 && (
          <p className="muted-note">No products posted yet. Be the first vendor!</p>
        )}

        <div className="products-grid">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={{ ...p, image: `http://localhost:5000/${p.image.replace(/\\/g, '/')}` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsGrid;