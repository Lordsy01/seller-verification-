import Navbar from '../shared/components/Navbar';
import Hero from '../shared/components/Hero';
import ProductsGrid from '../features/products/components/ProductsGrid';
import Footer from '../shared/components/Footer';

function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <ProductsGrid />
      </main>
      <Footer />
    </div>
  );
}

export default Home;