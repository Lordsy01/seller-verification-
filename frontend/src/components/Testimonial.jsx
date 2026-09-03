function Testimonial() {
  return (
    <section className="px-gutter py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-highest relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <span className="material-symbols-outlined text-6xl text-primary/20 mb-6">format_quote</span>
        <h2 className="font-headline-md text-headline-md text-primary mb-8 max-w-3xl mx-auto">
          "I found a verified web developer within a day. Knowing every seller is ID-checked made hiring so much less stressful."
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center font-headline-sm text-headline-sm text-on-secondary-fixed">
            S
          </div>
          <div className="text-left">
            <p className="font-label-md text-label-md text-primary">Sarah Jenkins</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Marketing Director</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;