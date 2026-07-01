"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import AuthLayout from "@/components/auth/AuthLayout";
import { createShop, login } from "@/services/auth";
import { ShieldAlert } from "lucide-react";

interface LoginFields {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
    const [showShopModal, setShowShopModal] = useState<boolean>(false);
    const [shopName, setShopName] = useState("");
const [shopAddress, setShopAddress] = useState("");
const [shopPhone, setShopPhone] = useState("");
const [gstNumber, setGstNumber] = useState("");


  const [credentials, setCredentials] =
    useState<LoginFields>({
      email: "",
      password: "",
    });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(
        credentials.email,
        credentials.password
      );

      
      
     if(data.setShowShopModal === true){
      setShowShopModal(true)
      return;
     }
      

      toast.success(
        `Welcome back ${data.user.name}`
      );

      if (data.user.role === "OWNER") {
        router.push("/dashboard/owner");
        return;
      }

      if (data.user.role === "TECHNICIAN") {
        router.push("/dashboard/technician");
        return;
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };


     const shopHandler = async (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()

      try {

        const data = await createShop(shopName,
    shopPhone,
    gstNumber,
    shopAddress)

        if(data?.shop) {
  toast.success("Shop created!")
  router.push("/dashboard/owner")  // ← missing!
}
        
        
      } catch (error) {
        toast.error(
          error instanceof Error
          ?error.message 
          :"Shop failed"
        )
      } finally {
        setTimeout(()=>{
          setShowShopModal(false)
        },200)
      }
     }


  return (
    <div>
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your workshop dashboard."
      footerText="Don't have an account?"
      footerLinkText="Create Account"
      footerLinkHref="/signup"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <input
            required
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
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
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="••••••••"
              className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>
      </form>
    </AuthLayout>

            <div>
              {showShopModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
  <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
      <ShieldAlert
        className="h-8 w-8 text-blue-600"
        strokeWidth={2.2}
      />  
    </div>

    <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
      Complete Your Shop Profile
    </h2>

    <p className="mt-2 text-center text-sm text-slate-500">
      Your dashboard is almost ready. Add your shop information to continue.
    </p>

    <form 
    onSubmit={shopHandler}
    className="mt-8 space-y-5">
      {/* Shop Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Shop Name <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={shopName}
          onChange={(e)=>setShopName(e.target.value)}
          placeholder="VoltOps EV Service Center"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Shop Address */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Shop Address <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={3}
            value={shopAddress}
          onChange={(e)=>setShopAddress(e.target.value)}
          placeholder="Enter complete shop address..."
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* GST */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          GST Number
          <span className="ml-1 text-slate-400">(Optional)</span>
        </label>

        <input
          type="text"
            value={gstNumber}
          onChange={(e)=>setGstNumber(e.target.value)}
          placeholder="27ABCDE1234F1Z5"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Shop Phone Number
          <span className="ml-1 text-slate-400">(Optional)</span>
        </label>

        <input
          type="tel"
            value={shopPhone}
          onChange={(e)=>setShopPhone(e.target.value)}
          placeholder="+91 9876543210"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Save & Continue
      </button>
    </form>
  </div>
</div>
              )}
            </div>

    </div>
  );
}
