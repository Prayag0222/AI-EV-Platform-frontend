import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AISection from "@/components/landing/AISection";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111111] overflow-x-hidden">

      <HeroSection />

      <div className="max-w-8xl mx-auto px-6 lg:px-8">

        <ProblemSection />

        <FeaturesSection />

        <HowItWorksSection />

        <AISection />

        <CTASection />

        <footer className="py-20 border-t border-black/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

            <div className="max-w-md">
              <h3 className="text-2xl font-bold tracking-tight text-black">
                VoltOps
              </h3>

              <p className="mt-4 text-slate-600 leading-relaxed">
                Repair intelligence software built for modern EV workshops.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 text-sm text-slate-500">
              <a href="#features" className="hover:text-black transition-colors">
                Features
              </a>

              <a href="#how-it-works" className="hover:text-black transition-colors">
                How It Works
              </a>

              <a href="/login" className="hover:text-black transition-colors">
                Login
              </a>

              <a href="/signup" className="hover:text-black transition-colors">
                Sign Up
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/5">
            <p className="text-sm text-slate-500">
              © 2026 VoltOps. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}