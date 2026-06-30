export default function ProblemSection() {
  const problems = [
    {
      title: "Repair Knowledge Lives Everywhere",
      description:
        "Customer updates in WhatsApp. Photos in galleries. Diagnoses stay in technician memory instead of becoming workshop knowledge.",
      badge: "Knowledge Gap",
      accent: "violet",
    },
    {
      title: "Every Technician Starts From Zero",
      description:
        "Past repairs are difficult to find, forcing teams to repeat diagnosis work again and again.",
      badge: "Lost Time",
      accent: "blue",
    },
    {
      title: "The Business Never Learns",
      description:
        "Solved repairs disappear instead of helping future technicians solve problems faster.",
      badge: "Growth Barrier",
      accent: "amber",
    },
  ];

  const impacts = [
    "Repeated Repairs",
    "Longer Diagnosis",
    "Customer Frustration",
    "Knowledge Loss",
    "Inconsistent Service",
    "Slower Growth",
  ];

  return (
    <section
      id="problem"
      className="py-20 md:py-28 border-t border-black/[0.06] bg-[#F8F7F4]"
    >
      <div className="px-5 md:px-10 xl:px-20">
        <div className="max-w-4xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
              The Problem
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1]">
            Most Workshops
            <br />
            Don&apos;t Lose Repairs.
            <br />
            They Lose Knowledge.
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-3xl">
            Valuable repair experience gets buried in chats, notebooks and
            technician memory instead of helping future repairs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {problems.map((item, index) => {
            const styles = {
              violet: {
                card: "border-violet-100 bg-violet-50/50",
                badge:
                  "bg-violet-100 text-violet-700 border-violet-200",
              },
              blue: {
                card: "border-blue-100 bg-blue-50/50",
                badge:
                  "bg-blue-100 text-blue-700 border-blue-200",
              },
              amber: {
                card: "border-amber-100 bg-amber-50/50",
                badge:
                  "bg-amber-100 text-amber-700 border-amber-200",
              },
            }[item.accent as "violet" | "blue" | "amber"];

            return (
              <div
                key={item.title}
                className={`rounded-3xl border p-5 md:p-8 ${styles.card}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-slate-500">
                    0{index + 1}
                  </span>

                  <span
                    className={`hidden md:block text-xs px-3 py-1 rounded-full border ${styles.badge}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg md:text-2xl font-semibold text-slate-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Desktop Only */}
        <div className="hidden md:block mt-16 rounded-3xl border border-black/[0.08] bg-white p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-5">
            Business Impact
          </p>

          <div className="flex flex-wrap gap-3">
            {impacts.map((item, index) => (
              <div
                key={item}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  index % 3 === 0
                    ? "bg-violet-50 text-violet-700 border-violet-100"
                    : index % 3 === 1
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}