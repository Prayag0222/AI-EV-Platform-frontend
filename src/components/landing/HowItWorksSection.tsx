const steps = [
  {
    step: "01",
    title: "Customer Arrives",
    description:
      "A customer visits your workshop with a battery, controller, motor or charging issue.",
  },
  {
    step: "02",
    title: "Create Repair Ticket",
    description:
      "Capture customer details, vehicle information and technician assignment.",
  },
  {
    step: "03",
    title: "Repair & Document",
    description:
      "Record diagnostics, findings, photos, replaced parts and repair actions.",
  },
  {
    step: "04",
    title: "Knowledge Captured",
    description:
      "Every repair becomes structured workshop knowledge instead of being forgotten.",
  },
  {
    step: "05",
    title: "Future Repairs Get Smarter",
    description:
      "VoltOps surfaces similar cases and historical patterns to speed up diagnosis.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 border-t border-black/[0.06] bg-[#F8F7F4]"
    >
      <div className="px-5 md:px-10 xl:px-20">
        <div className="max-w-3xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
              How It Works
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1]">
            Every Repair Creates
            <br />
            Future Knowledge.
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl">
            VoltOps turns everyday workshop operations into a growing repair
            intelligence system.
          </p>
        </div>

        <div className="max-w-5xl">
          <div className="space-y-4 md:space-y-5">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="rounded-3xl border border-black/[0.08] bg-white p-5 md:p-7 transition-all hover:border-black/[0.12]"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {item.step}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg md:text-2xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    {index !== steps.length - 1 && (
                      <div className="mt-5 flex items-center gap-2 text-violet-600 text-sm font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                        Next Step
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}