import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductsGrid from '../components/ProductsGrid';
import Footer from '../components/Footer';

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