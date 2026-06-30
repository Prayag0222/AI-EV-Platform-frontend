"use client";

import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="border-t border-black/[0.06] bg-slate-950 py-20 md:py-28">
      <div className="px-5 md:px-10 xl:px-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              Get Started
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1]">
            Capture Every Repair.
            <br />
            <span className="text-slate-400">
              Learn From Every Repair.
            </span>
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl">
            Build a workshop that captures knowledge, improves diagnosis and
            helps every technician work smarter over time.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/signup")}
              className="h-12 px-6 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Start Free
            </button>

            <button
              onClick={() => router.push("/login")}
              className="h-12 px-6 rounded-xl border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Desktop Only */}
          <div className="hidden md:flex items-center gap-3 mt-8">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-400">
              Setup in minutes • No complex onboarding
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}