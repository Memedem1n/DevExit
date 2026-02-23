"use client";
import Link from "next/link";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans flex flex-col items-center justify-center text-center px-6">
      <DynamicBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="bg-brand-blue/10 p-6 rounded-[40px] border border-brand-blue/20 w-fit mx-auto mb-10 shadow-2xl">
          <Zap size={64} className="text-brand-blue animate-pulse" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-none">
          404<span className="text-brand-blue">.</span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-[4px] mb-8">
          Lost in the <span className="text-gradient italic">Void</span>
        </h2>

        <p className="text-gray-500 font-bold text-lg max-w-md mx-auto mb-12 leading-relaxed">
          The software asset you're looking for has either exited or moved to a more secure location.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/" className="px-10 py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_40px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] flex items-center gap-3 active:scale-95">
            <ArrowLeft size={14} /> BACK TO PORTAL
          </Link>
          <Link href="/explore" className="px-10 py-5 glass text-white font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-[3px] text-[10px] flex items-center gap-3 active:scale-95">
            <Compass size={14} /> EXPLORE ASSETS
          </Link>
        </div>
      </motion.div>

      {/* Background Text Decor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <span className="text-[30vw] font-black font-mono select-none">EXIT</span>
      </div>
    </main>
  );
}
