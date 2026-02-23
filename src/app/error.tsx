"use client";
import { useEffect } from "react";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { RefreshCcw, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans flex flex-col items-center justify-center text-center px-6">
      <DynamicBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 glass p-16 rounded-[60px] border-red-500/20 max-w-2xl"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-10 border border-red-500/20">
          <ShieldAlert size={40} />
        </div>

        <h1 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase">
          System <span className="text-red-500 italic">Anomaly</span>
        </h1>
        
        <p className="text-gray-500 font-bold text-lg mb-12 leading-relaxed">
          Our encrypted systems encountered an unexpected technical breach. Please attempt to re-establish the connection.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => reset()}
            className="px-12 py-5 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all uppercase tracking-[3px] text-[10px] flex items-center gap-3 active:scale-95 shadow-2xl"
          >
            <RefreshCcw size={14} /> RE-ESTABLISH CONNECTION
          </button>
          <Link href="/" className="px-12 py-5 glass text-white font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-[3px] text-[10px] flex items-center gap-3 active:scale-95">
            <ArrowLeft size={14} /> RETURN TO HUB
          </Link>
        </div>

        {error.digest && (
          <p className="mt-12 text-[10px] font-mono font-bold text-gray-700 uppercase tracking-widest">
            ERROR_DIGEST: {error.digest}
          </p>
        )}
      </motion.div>
    </main>
  );
}
