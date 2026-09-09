import { Link } from 'react-router-dom';
import './Hero.css';
import heroImage from '../../images/images.jpeg';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div>
          <h1>The Digital Marketplace of <span>Cameroon</span></h1>
          <p>
            Discover premium local goods, wholesale deals, and authentic Cameroonian
            craftsmanship from verified vendors — shelf-ready and delivered fast.
          </p>
          <div className="hero__actions">
            <a href="#gigs" className="btn btn-primary">Shop Now</a>
            <Link to="/signup?role=seller" className="btn btn-outline">Become a Vendor</Link>
          </div>
        </div>
        <div className="hero__image">
          <img src={heroImage} alt="Douala marketplace" />
        </div>
      </div>
    </section>
  );
}

export default Hero;