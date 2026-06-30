"use client";

import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, type Profile } from "@/app/dashboard/owner/services/profileApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);


  

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setError("");
      setMessage("");
      await updateProfile({
        name: profile.name,
        shopName: profile.shopName || "",
        shopAddress: profile.shopAddress || "",
        gstNumber: profile.gstNumber || "",
        shopPhone: profile.shopPhone || "",
      });
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (profile?.name) {
      const parts = profile.name.trim().split(" ").filter(Boolean);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (profile?.shopName) return profile.shopName.substring(0, 2).toUpperCase();
    return "VO";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-volt-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-volt-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-sec-text font-medium">Loading profile…</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-volt-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-volt-terracotta font-semibold text-sm mb-1">Failed to load profile</p>
          <p className="text-sec-text text-sm">{error || "Please refresh and try again."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-volt-background px-4 py-8">
      <div className="mx-auto max-w-2xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-sec-text mb-6">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
          <span className="text-border">/</span>
          <span className="text-volt-primary">Workshop profile</span>
        </div>

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-black text-volt-primary tracking-tight leading-tight">
              Workshop Profile
            </h1>
            <p className="mt-1.5 text-sm text-sec-text leading-relaxed">
              This information appears on your invoices and customer documents.
            </p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-full bg-volt-primary flex items-center justify-center text-white text-xl font-black tracking-tight select-none">
              {getInitials()}
            </div>
            <span className="text-[10.5px] text-sec-text text-center leading-tight">Shop<br />initials</span>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-volt-terracotta/20 bg-critical-soft px-4 py-3 text-sm font-medium text-volt-terracotta">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-volt-secondary/20 bg-emerald-green px-4 py-3 text-sm font-medium text-volt-secondary">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
          </div>
        )}

        {/* ── Section: Owner Details ── */}
        <SectionLabel icon="owner" label="Owner details" />

        <div className="bg-white rounded-2xl border border-[rgba(9,20,38,0.08)] overflow-hidden mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Owner Name */}
            <div className="p-5 sm:border-r border-b sm:border-b-0 border-[rgba(9,20,38,0.06)]">
              <FieldLabel icon="user" label="Owner name" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
                className="mt-2 w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-sm font-medium text-volt-primary placeholder:text-border focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition"
              />
            </div>

            {/* Email */}
            <div className="p-5">
              <FieldLabel icon="mail" label="Email address" />
              <input
                type="email"
                value={profile.email}
                disabled
                className="mt-2 w-full rounded-lg border border-[rgba(9,20,38,0.06)] bg-volt-container px-3 py-2.5 text-sm font-medium text-sec-text cursor-not-allowed"
              />
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-sec-text">
                <svg className="w-3 h-3 text-volt-terracotta" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Managed by the system
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Workshop Info ── */}
        <SectionLabel icon="store" label="Workshop information" />

        <div className="bg-white rounded-2xl border border-[rgba(9,20,38,0.08)] overflow-hidden mb-5">
          {/* Shop Name */}
          <div className="p-5 border-b border-[rgba(9,20,38,0.06)]">
            <FieldLabel icon="building" label="Shop name" />
            <input
              type="text"
              value={profile.shopName || ""}
              onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
              placeholder="e.g. VoltOps EV Care"
              className="mt-2 w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-sm font-medium text-volt-primary placeholder:text-border focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition"
            />
          </div>

          {/* Shop Address */}
          <div className="p-5">
            <FieldLabel icon="pin" label="Workshop address" />
            <textarea
              value={profile.shopAddress || ""}
              onChange={(e) => setProfile({ ...profile, shopAddress: e.target.value })}
              rows={3}
              placeholder="Full address as it should appear on invoices"
              className="mt-2 w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-sm font-medium text-volt-primary placeholder:text-border focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* ── Section: Invoice & Tax ── */}
        <SectionLabel icon="invoice" label="Invoice & tax details" />

        <div className="bg-white rounded-2xl border border-[rgba(9,20,38,0.08)] overflow-hidden mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* GST */}
            <div className="p-5 sm:border-r border-b sm:border-b-0 border-[rgba(9,20,38,0.06)]">
              <FieldLabel icon="receipt" label="GST number" />
              <input
                type="text"
                value={profile.gstNumber || ""}
                onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. 23AABCV1234M1ZX"
                className="mt-2 w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-[13px] font-mono font-semibold tracking-wider text-volt-primary placeholder:text-border placeholder:font-sans placeholder:tracking-normal placeholder:font-normal focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition"
              />
              <p className="mt-1.5 text-[11px] text-sec-text flex items-center gap-1">
                <svg className="w-3 h-3 text-volt-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Printed on every invoice
              </p>
            </div>

            {/* Phone */}
            <div className="p-5">
              <FieldLabel icon="phone" label="Shop phone" />
              <input
                type="tel"
                value={profile.shopPhone || ""}
                onChange={(e) => setProfile({ ...profile, shopPhone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="mt-2 w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-sm font-medium text-volt-primary placeholder:text-border focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition"
              />
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-sec-text flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Changes apply to new invoices only
          </p>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-volt-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1a2d47] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Save profile
              </>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}

/* ── Small reusable sub-components ── */

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    owner: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    store: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    invoice: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m0-3.75h3" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
        <span className="text-volt-secondary">{icons[icon]}</span>
        {label}
      </div>
      <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />
    </div>
  );
}

function FieldLabel({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    user: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    mail: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    building: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    pin: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    receipt: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    phone: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  };

  return (
    <label className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-sec-text">
      <span className="text-volt-secondary">{icons[icon]}</span>
      {label}
    </label>
  );
}