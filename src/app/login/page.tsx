"use client";
import { useState } from "react";
import Link from "next/link";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { useAuthViewModel } from "@/hooks/useAuthViewModel";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Zap, ShieldCheck, Lock } from "lucide-react";
import { AppleLogo, GoogleLogo } from "@/components/ui/BrandLogos";

export default function LoginPage() {
  const { login, loginWithApple, loginWithGoogle, loading, error } = useAuthViewModel();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans flex flex-col items-center justify-center px-6 py-20">
      <DynamicBackground />

      <Link href="/" className="fixed top-12 left-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono font-bold text-[10px] uppercase tracking-[3px] group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PORTAL
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 md:p-16 rounded-[60px] w-full max-w-lg border-white/5 relative overflow-hidden bg-white/[0.01]"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck size={160} /></div>

        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-brand-blue p-1.5 rounded-lg shadow-[0_0_15px_rgba(0,112,255,0.4)]">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-black italic tracking-tighter text-white uppercase tracking-[2px]">DEVEXIT</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tighter mb-2">Welcome Back.</h2>
          <p className="text-gray-500 font-bold text-sm">Secure access to your asset portfolio.</p>
        </div>

        {/* --- OFFICIAL BUTTONS --- */}
        <div className="space-y-4 mb-10">
          {/* Apple Sign In (HIG Compliant) */}
          <button 
            onClick={loginWithApple}
            disabled={loading}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-900 transition-all uppercase tracking-[2px] text-[10px] flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-70 border border-white/10"
          >
            <AppleLogo /> CONTINUE WITH APPLE
          </button>

          {/* Google Sign In (Google Brand Guidelines Compliant) */}
          <button 
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-[2px] text-[10px] flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-70 border border-gray-200"
          >
            <GoogleLogo /> CONTINUE WITH GOOGLE
          </button>
        </div>

        <div className="relative mb-10 text-center">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
          <span className="relative bg-[#020617] px-4 text-[9px] font-mono font-bold text-gray-600 uppercase tracking-[2px]">OR SECURE EMAIL SIGN IN</span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); login(email, pass); }} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center ml-2 mr-2">
              <label className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-[2px]">Password</label>
              <Link href="#" className="text-[9px] font-bold text-brand-blue hover:text-white transition-colors uppercase tracking-[1px]">Forgot?</Link>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium placeholder:text-gray-700"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-[38px] text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_50px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] mt-8 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-xl"
          >
            {loading ? "AUTHENTICATING..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px]">
            New to DevExit? <Link href="/register" className="text-brand-blue hover:text-white transition-colors ml-1">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
