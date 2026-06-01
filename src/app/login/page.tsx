'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Zap,Mail,LockKeyhole,ArrowRight,Fence} from 'lucide-react';
import { useRouter} from 'next/navigation';

// 1. Strict TypeScript interface for incoming login credentials
interface LoginFields {
  email: string;
  password: string;
}

export default function LoginPage() {

  const router = useRouter();

  // 2. React state guarded strictly by our TypeScript blueprint data layer
  const [credentials, setCredentials] = useState<LoginFields>({
    email: '',
    password: '',
  });

  // 3. Dynamic input handler with element typing to safely track text changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Form submission handler ready for backend API routing integration
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Intercepts normal HTML browser page reloads

    // Direct console isolation log to verify your data flow works flawlessly

    try {
      const response = await fetch('http://localhost:3000/api/auth/login',
        {
          method:"POST",
        headers:{ 'Content-Type':"application/json"},
        credentials:"include", // Important for cookie handling in cross-origin requests
        body: JSON.stringify({
          email:credentials.email,
          password:credentials.password
        })
        });

        const data = await response.json()

        if(!response.ok){
          throw new Error(data.message || 'Login failed.');

        }

        console.log('🚀 Login API Response:', data);

 

        alert(`Welcome back ${data.user.name }! Your login was successful.`);
        if(data.user.role === 'OWNER'){
          router.push('/dashboard/owner');
        }
        else if (data.user.role === 'TECHNICIAN'){
          router.push('/dashboard/technician');
        }
        else{
        console.warn('⚠️ Access Denied: Role not authorized for panel navigation.');
          alert('Access Denied. Account does not possess dashboard credentials.');
          router.push('/login');
        }

    } catch (error) {
      console.error('❌ Frontend Login Error:', error);

      // One-liner: Force TypeScript to treat 'error' as an Error object
      alert((error as Error).message || 'An unknown error occurred.');
      
    }

  };

  return (
    <div className="min-h-screen bg-[#121416] text-[#e2e2e5] flex h-screen w-screen lg:px-20 font-body antialiased overflow-hidden">
      
      {/* LEFT PANEL: Engineering Visual Showcase (Hidden on Mobile viewports) */}
      <section className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-[#0c0e10]">
        <div className="absolute inset-0 z-0">
          {/* Using Next.js Optimized Image pulling directly from the public/ folder */}
          <Image 
            src="/car-chassis.png" 
            alt="Detailed view of a high-performance EV chassis"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"

            className="object-cover grayscale opacity-40 mix-blend-luminosity"
          />
          {/* Absolute gradient vignette overlay covering the image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,14,16,0.6)_100%)]"></div>
        </div>
        
        {/* Dynamic Telemetry Typography Content */}
        <div className="relative z-10 w-full px-16">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a1d1b4]/20 bg-[#a1d1b4]/5">
            <Fence className="text-[#A1D1B4] text-sm" />
              <span className="material-symbols-outlined text-[#a1d1b4] text-sm font-jet">Advanced AI Integration</span>
            </div>
            <h1 className="font-sora text-5xl font-bold text-[#e2e2e5] leading-tight">
              AURA Intelligence <br/>
              <span className="text-[#a1d1b4]">Precision Redefined.</span>
            </h1>
            <p className="font-hanken text-lg text-[#c0c9c1]/90 max-w-md">
              Experience the next generation of fleet telemetry and real-time vehicle diagnostics powered by Aura AI.
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Interactive Account Authentication Panel */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative z-20 bg-[#121416]">
        <div className="w-full max-w-md space-y-8">
          
          {/* Identity Platform Header branding */}
          <header className="text-center lg:text-left space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#254f3a] flex items-center justify-center">
                <Zap className="text-[#93C0A5] fill-[#93C0A5] "  />
              </div>
              <span className="font-sora text-4xl font-bold text-[#e2e2e5] tracking-tight">AURA EV</span>
            </div>
            <h2 className="text-3xl font-semibold text-[#e2e2e5] mt-5 font-sora">Access Your Intelligence</h2>
            <p className="font-hanken text-[#c0c9c1]">System authentication required to proceed.</p>
          </header>

          {/* Form Content Pane wrapper */}
          <div className="bg-[#1e2022] border border-[#333537] p-8 rounded-xl shadow-xl">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Email Address Entry Block */}
              <div className="space-y-1.5">
                <label className="font-jet text-xs text-[#c0c9c1] uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b938c] size-4" />
                  <input 
                    className="w-full bg-[#1a1c1e] border border-[#333537] rounded-lg py-3 pl-11 pr-4 text-[#e2e2e5] placeholder:text-[#8b938c]/50 transition-all duration-300 focus:outline-none focus:border-[#a1d1b4] focus:ring-1 focus:ring-[#a1d1b4] font-body text-sm" 
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@organization.com" 
                    value={credentials.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password Entry Block */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-jet text-xs text-[#c0c9c1] uppercase tracking-wider" htmlFor="password">Password</label>
                  <a className="font-tech text-[10px] text-[#a1d1b4] hover:text-[#bceecf] transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b938c] size-4" />
                  <input 
                    className="w-full bg-[#1a1c1e] border border-[#333537] rounded-lg py-3 pl-11 pr-4 text-[#e2e2e5] placeholder:text-[#8b938c]/50 transition-all duration-300 focus:outline-none focus:border-[#a1d1b4] focus:ring-1 focus:ring-[#a1d1b4] font-body text-sm" 
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••" 
                    value={credentials.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Remember Device Checkbox Row */}
              <div className="flex items-center gap-2">
                <input 
                  id="remember" 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-[#333537] bg-[#1a1c1e] text-[#a1d1b4] focus:ring-[#a1d1b4] focus:ring-offset-[#121416]"
                />
                <label htmlFor="remember" className="font-jet text-[10px] text-[#c0c9c1] uppercase">Remember device for 30 days</label>
              </div>

              {/* Submit CTA Activation Button */}
              <button 
                className="w-full bg-[#2d5a43] text-[#9fcfb2] hover:brightness-110 active:scale-[0.98] transition-all duration-200 font-semibold font-hanken py-3.5 rounded-lg flex items-center justify-center gap-4 text-md" 
                type="submit"
              >
                Sign In
              <ArrowRight className="text-[#9fcfb2]  " />
              </button>
            </form>
          </div>

          {/* Bottom Footnotes & Navigation routing */}
          <footer className="text-center space-y-4">
            <p className="font-body text-sm text-[#c0c9c1]">
              Don&apos;t have an account?{' '}
              <a className="text-[#a1d1b4] font-semibold hover:underline" href="/signup">Create an Account</a>
            </p>
            <div className="flex  font-hanken items-center justify-center gap-4">
              <a className="text-[#8b938c] hover:text-[#a1d1b4] transition-colors text-xs" href="#">Privacy Policy</a>
              <span className="text-[#8b938c] text-xs">|</span>
              <a className="text-[#8b938c] hover:text-[#a1d1b4] transition-colors text-xs" href="#">Terms of Service</a>
            </div>
          </footer>

        </div>
      </section>
    </div>
  );
}