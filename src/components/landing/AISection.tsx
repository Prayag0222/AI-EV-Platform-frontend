const capabilities = [
  {
    title: "Find Similar Repairs",
    description:
      "Instantly surface previous repair cases matching the current issue.",
    color: "violet",
  },
  {
    title: "Retain Technician Knowledge",
    description:
      "Keep workshop expertise inside the business, not inside people's heads.",
    color: "blue",
  },
  {
    title: "Assist Diagnosis",
    description:
      "Help technicians investigate issues using historical repair data.",
    color: "emerald",
  },
  {
    title: "Detect Patterns",
    description:
      "Identify recurring failures across batteries, controllers and vehicles.",
    color: "amber",
  },
];

export default function AISection() {
  return (
    <section
      id="ai-intelligence"
      className="py-20 md:py-28 border-t border-black/[0.06] bg-[#F8F7F4]"
    >
      <div className="px-5 md:px-10 xl:px-20">
        <div className="max-w-4xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
              Repair Intelligence
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1]">
            It Doesn&apos;t Just Store Data.
            <br />
            It Learns From Repairs.
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-3xl">
            Every completed repair helps future technicians make faster and
            smarter decisions.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          {/* AI Demo Card */}
          <div className="rounded-3xl border border-violet-100 bg-white overflow-hidden">
            <div className="p-5 md:p-8 border-b border-black/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-slate-400" />
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Technician Note
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-black/[0.06] p-4">
                <p className="text-sm md:text-base text-slate-700">
                  Battery voltage drops heavily during acceleration.
                </p>
              </div>
            </div>

            <div className="p-5 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                <p className="text-xs uppercase tracking-wider font-medium text-violet-700">
                  VoltOps Analysis
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Similar repair found in workshop history",
                  "Weak cell group detected previously",
                  "Possible BMS balancing issue",
                  "Recommend controller current draw check",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-violet-50/50 border border-violet-100 p-4"
                  >
                    <div className="h-2 w-2 rounded-full bg-violet-500 mt-2 shrink-0" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="grid gap-4">
            {capabilities.map((item, index) => {
              const styles = {
                violet:
                  "border-violet-100 bg-violet-50/50",
                blue:
                  "border-blue-100 bg-blue-50/50",
                emerald:
                  "border-emerald-100 bg-emerald-50/50",
                amber:
                  "border-amber-100 bg-amber-50/50",
              };

              return (
                <div
                  key={item.title}
                  className={`rounded-3xl border p-5 ${styles[item.color as keyof typeof styles]}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-500">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {item.description}
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