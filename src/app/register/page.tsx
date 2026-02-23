"use client";
import { useState } from "react";
import Link from "next/link";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { useAuthViewModel } from "@/hooks/useAuthViewModel";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Gem, Eye, EyeOff, Zap, ShieldCheck, Lock } from "lucide-react";

export default function RegisterPage() {
  const { register, loading, error } = useAuthViewModel();
  const [role, setRole] = useState<'DEVELOPER' | 'INVESTOR' | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    register(email, pass, name, role);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans flex flex-col items-center justify-center px-6 py-20">
      <DynamicBackground />

      <Link href="/" className="fixed top-12 left-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono font-bold text-[10px] uppercase tracking-[3px] group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PORTAL
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 md:p-16 rounded-[60px] w-full max-w-xl border-white/5 relative overflow-hidden bg-white/[0.01]"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-2xl transition-transform group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="DevExit Logo" 
                className="w-[111px] h-[111px] object-contain" 
                style={{ filter: 'drop-shadow(0 2px 2px rgba(51, 51, 51, 0.3))' }}
              />
            </div>
            <span className="text-3xl font-black italic tracking-tighter text-white uppercase tracking-[3px]">DEVEXIT</span>
          </Link>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter mb-4">Join the Network.</h2>
          <p className="text-gray-500 font-bold text-lg">Select your primary role.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 text-red-500 text-xs font-bold text-center flex items-center justify-center gap-2 uppercase tracking-widest">
            <Lock size={14} /> {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <button 
            type="button"
            onClick={() => setRole('DEVELOPER')}
            className={`p-10 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group/btn ${
              role === 'DEVELOPER' ? 'border-brand-blue bg-brand-blue/5' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className={`p-4 rounded-2xl ${role === 'DEVELOPER' ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' : 'bg-white/5 text-gray-500 group-hover/btn:text-white'}`}>
              <Rocket size={32} />
            </div>
            <span className={`text-[11px] font-mono font-black uppercase tracking-[2px] ${role === 'DEVELOPER' ? 'text-white' : 'text-gray-500 group-hover/btn:text-white'}`}>Developer</span>
          </button>

          <button 
            type="button"
            onClick={() => setRole('INVESTOR')}
            className={`p-10 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group/btn ${
              role === 'INVESTOR' ? 'border-brand-blue bg-brand-blue/5' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className={`p-4 rounded-2xl ${role === 'INVESTOR' ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' : 'bg-white/5 text-gray-500 group-hover/btn:text-white'}`}>
              <Gem size={32} />
            </div>
            <span className={`text-[11px] font-mono font-black uppercase tracking-[2px] ${role === 'INVESTOR' ? 'text-white' : 'text-gray-500 group-hover/btn:text-white'}`}>Investor</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">Secure Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium placeholder:text-gray-700"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-[52px] text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={!role || loading}
            className="w-full py-6 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_50px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[4px] text-[11px] mt-8 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-xl"
          >
            {loading ? "CREATING SECURE ACCOUNT..." : "CREATE SECURE ACCOUNT"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[2px]">
            Already have an account? <Link href="/login" className="text-brand-blue hover:text-white transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
