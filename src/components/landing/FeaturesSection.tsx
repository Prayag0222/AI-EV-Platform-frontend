const features = [
  {
    title: "Repair Intelligence",
    description:
      "Search previous repair cases, technician notes and workshop knowledge instantly.",
    featured: true,
  },
  {
    title: "Repair Tickets",
    description:
      "Track repairs from intake to delivery with complete history.",
    color: "blue",
  },
  {
    title: "Customer Management",
    description:
      "Manage customers, vehicles, warranties and service records.",
    color: "emerald",
  },
  {
    title: "Technician Workspace",
    description:
      "Assign jobs and monitor technician progress.",
    color: "violet",
  },
  {
    title: "Inventory Management",
    description:
      "Track batteries, controllers, spare parts and stock levels.",
    color: "amber",
  },
  {
    title: "Billing & Invoicing",
    description:
      "Generate invoices and maintain payment records.",
    color: "rose",
  },
];

const colorStyles: Record<
  string,
  {
    card: string;
    icon: string;
  }
> = {
  blue: {
    card: "border-blue-100 bg-blue-50/50",
    icon: "bg-blue-100",
  },
  emerald: {
    card: "border-emerald-100 bg-emerald-50/50",
    icon: "bg-emerald-100",
  },
  violet: {
    card: "border-violet-100 bg-violet-50/50",
    icon: "bg-violet-100",
  },
  amber: {
    card: "border-amber-100 bg-amber-50/50",
    icon: "bg-amber-100",
  },
  rose: {
    card: "border-rose-100 bg-rose-50/50",
    icon: "bg-rose-100",
  },
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 md:py-28 border-t border-black/[0.06] bg-white"
    >
      <div className="px-5 md:px-10 xl:px-20">
        <div className="max-w-4xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
              Platform Features
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1]">
            Built For Modern
            <br />
            EV Repair Businesses.
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-3xl">
            One platform for repairs, technicians, customers, inventory,
            billing and repair intelligence.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Featured Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-violet-100 bg-violet-50/50 p-6 md:p-8 h-full">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-violet-200 px-3 py-1.5 mb-5">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                <span className="text-[11px] font-semibold text-violet-700">
                  AI POWERED
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                Your Workshop Learns
                <br />
                From Every Repair.
              </h3>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Every completed repair becomes searchable knowledge that helps
                technicians solve future problems faster.
              </p>

              {/* Desktop Only */}
              <div className="hidden md:block mt-8 rounded-2xl border border-violet-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 mb-3">
                  AI Insight
                </p>

                <p className="text-sm text-slate-700 leading-relaxed">
                  Similar battery voltage issue found in 4 previous repairs.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 md:gap-6">
            {features
              .filter((feature) => !feature.featured)
              .map((feature) => {
                const styles =
                  colorStyles[feature.color ?? "blue"];

                return (
                  <div
                    key={feature.title}
                    className={`rounded-3xl border p-5 md:p-7 ${styles.card}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl ${styles.icon} mb-5`}
                    />

                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}