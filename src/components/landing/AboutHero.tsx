export default function AboutHero() {
  return (
    <section className="py-20 md:py-28 border-b border-black/[0.06] bg-[#F8F7F4]">
      <div className="px-5 md:px-10 xl:px-20">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
              About VoltOps
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1]">
            Building The Intelligence Layer
            <br />
            For EV Repair Businesses.
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl">
            VoltOps helps workshops capture repair knowledge, organize daily
            operations and build smarter repair workflows through structured
            data and AI-powered intelligence.
          </p>

          {/* Desktop Only */}
          <div className="hidden md:flex items-center gap-6 mt-10">
            <div className="h-16 w-px bg-black/[0.08]" />

            <div>
              <p className="text-sm text-slate-400 mb-1">
                Mission
              </p>
              <p className="text-slate-700 max-w-md">
                Help every EV workshop learn from every repair instead of losing
                knowledge over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}