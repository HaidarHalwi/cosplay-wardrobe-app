"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Membersihkan trailing slash jika ada untuk menghindari error URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
      
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Gagal mendaftar. Silakan coba lagi.');
      }

      login(data.token); 
      router.push('/'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#2D2D2D] p-8 rounded-2xl max-w-md mx-auto my-10 border border-gray-700">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-2 text-lg text-gray-200">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[#3C3C3C] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E94A61]" placeholder="Input your name" />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-lg text-gray-200">E-mail</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#3C3C3C] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E94A61]" placeholder="name@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-lg text-gray-200">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#3C3C3C] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E94A61]" placeholder="••••••••" />
        </div>
        {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}
        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full bg-[#E94A61] hover:bg-red-600 text-white font-bold py-3 px-12 rounded-lg transition-colors text-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
        <p className="text-center text-gray-400">
          Already have an account? <Link href="/login" className="text-[#E94A61] hover:underline font-semibold">Login here</Link>
        </p>
      </form>
    </div>
  );
}