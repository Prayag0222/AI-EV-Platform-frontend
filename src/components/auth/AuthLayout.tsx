"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Zap } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              VoltOps
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] px-3 py-1.5 mb-4">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                VoltOps Access
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>

            <p className="mt-2 text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            {footerLinkText}
          </Link>
        </div>

        {/* Desktop Only */}
        <div className="hidden md:flex justify-center mt-10">
          <p className="text-xs text-slate-400">
            Built for modern EV repair businesses
          </p>
        </div>
      </div>
    </div>
  );
}