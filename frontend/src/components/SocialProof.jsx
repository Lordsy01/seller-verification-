function SocialProof() {
  const names = ["AcmeCorp", "GlobalSynergy", "Nexus", "QuantumLeap"];
  return (
    <section className="border-y border-outline-variant/20 bg-surface-container-lowest py-8">
      <div className="max-w-container-max mx-auto px-gutter text-center">
        <p className="font-label-md text-label-md text-on-surface-variant mb-6 uppercase tracking-widest opacity-80">
          Trusted by Innovative Teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
          {names.map((name) => (
            <span key={name} className="font-headline-sm text-headline-sm font-bold text-primary">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialProof;