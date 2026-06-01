"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 1. Structural Blueprint for TypeScript Learning
interface SignUpData {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export default function SignUp() {
  const router = useRouter();
  
  // 2. State definition strictly locked to our blueprint
  const [formData, setFormData] = useState<SignUpData>({ 
    name: '', 
    email: '', 
    password: '',
    role: 'technician' // setting a default role selection
  });
  
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Dynamic input handler that accommodates inputs and dropdowns
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Asynchronous connection to your brother's backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('');
    setError('');
    setLoading(true);

    try {
      // NOTE: Swap '/api/auth/signup' out if your brother used a different path!
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
    

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      console.log('Sign Up Success:', data);

      setNotification('🎉 Sign Up Completed Successfully!');
      
      setTimeout(() => {
        router.push('/login'); // Redirect to login page after success
      }, 2000);

    } catch (err: unknown) {
  // We check if 'err' is an object that contains a 'message' string property
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Something went wrong. Please try again.');
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-900 via-slate-900 to-blue-900 px-4 relative overflow-hidden">
      
      {/* Toast Alert Notifications */}
      {notification && (
        <div className="absolute top-5 right-5 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-medium animate-bounce z-50">
          {notification}
        </div>
      )}

      {error && (
        <div className="absolute top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl font-medium z-50">
          {error}
        </div>
      )}

      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-white tracking-wide">Create Account</h2>
        <p className="text-center text-slate-300 text-sm">Join us for a smarter EV experience</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Full Name</label>
            <input 
              required 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange} 
              className="w-full px-4 py-2.5 mt-1 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200" 
              placeholder="John Doe" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address</label>
            <input 
              required 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange} 
              className="w-full px-4 py-2.5 mt-1 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200" 
              placeholder="you@example.com" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
            <input 
              required 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange} 
              className="w-full px-4 py-2.5 mt-1 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200" 
              placeholder="••••••••" 
            />
          </div>

          {/* New Dynamic Dropdown for User Roles */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Your Role</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 mt-1 bg-slate-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="TECHNICIAN">Technician</option>
              <option value="OWNER">Owner</option>
            */removed user role for now to simplify roles, can be added back if needed/*
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-3 font-bold text-lg text-white bg-linear-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-700 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button> 
        </form>

        <p className="text-sm text-center text-slate-300">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}