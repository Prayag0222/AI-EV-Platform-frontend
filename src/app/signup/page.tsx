"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "@/components/auth/AuthLayout";
import { API_BASE } from '@/config/api';



interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();

    if (formData.name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!normalizedEmail.endsWith("@gmail.com")) {
      toast.error("Please use a Gmail address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: normalizedEmail,
            password: formData.password,
            role: "OWNER",
          }),
        }
      );

      

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Signup failed"
        );
      }

      toast.success(
        "Account created successfully."
      );

      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Create your VoltOps owner account and start managing your workshop."
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/login"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>

          <input
            required
            minLength={2}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="name"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            pattern="^[^\s@]+@gmail\.com$"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>

          <div className="relative">
            <input
              required
              minLength={6}
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="••••••••"
              autoComplete="new-password"
              aria-describedby="password-requirement"
              className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p id="password-requirement" className="mt-2 text-xs text-slate-500">
            Use at least 6 characters. Any combination is allowed.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password
          </label>

          <input
            required
            minLength={6}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}
