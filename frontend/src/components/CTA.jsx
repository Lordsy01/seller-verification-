import { Link } from 'react-router-dom';

function CTA() {
  return (
    <section className="px-gutter py-section-gap-mobile md:py-section-gap-desktop bg-surface">
      <div className="max-w-3xl mx-auto text-center space-y-8 bg-surface-container-lowest p-10 md:p-16 rounded-[2rem] border border-outline-variant/30 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <h2 className="font-display-lg-mobile md:font-headline-lg text-display-lg-mobile md:text-headline-lg text-primary">
          Ready to get started?
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
          Join buyers and verified sellers already using VisionaryCore.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="bg-secondary text-on-secondary font-label-md text-label-md py-3 px-8 rounded-lg hover:bg-secondary-container transition-transform hover:scale-[1.02] active:scale-95 shadow-sm">
            Sign Up Free
          </Link>
          <Link to="/signup?role=seller" className="border-[1.5px] border-primary text-primary font-label-md text-label-md py-3 px-8 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95">
            Become a Seller
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;