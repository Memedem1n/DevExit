"use client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import InvestorLogos from "@/components/home/InvestorLogos";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { 
  ArrowRight, Code2, TrendingUp, ShieldCheck, 
  Calculator, Zap, Star, Globe, Heart, DollarSign,
  Satellite, Microscope, Fingerprint, Rocket, Gem
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-48 pb-32 px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-mono font-bold uppercase tracking-[4px] mb-8 hover:border-brand-blue/50 transition-colors cursor-pointer text-gray-400 group">
            <img 
              src="/logo.png" 
              className="w-[35px] h-[35px] object-contain" 
              alt="Logo" 
              style={{ filter: 'drop-shadow(0 2px 2px rgba(51, 51, 51, 0.3))' }}
            />
            V2.0 LIVE: AUTO VALUATION ENGINE
            <Satellite size={10} className="text-brand-blue ml-2 group-hover:rotate-45 transition-transform" />
          </div>

          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter mb-10 leading-[0.85] text-white">
            BUILD. GROW. <br />
            <motion.span 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                filter: [
                  "drop-shadow(0 0 10px rgba(0,112,255,0.3))",
                  "drop-shadow(0 0 20px rgba(255,215,0,0.4))",
                  "drop-shadow(0 0 10px rgba(0,112,255,0.3))"
                ]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ 
                backgroundSize: '200% auto',
                backgroundImage: 'linear-gradient(to right, #0070FF, #00D1FF, #FFD700, #FFA500, #0070FF)'
              }}
              className="bg-clip-text text-transparent italic drop-shadow-2xl"
            >
              EXIT.
            </motion.span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-14 leading-relaxed font-semibold tracking-tight">
            The world's most transparent marketplace for independent software. 
            <span className="text-white"> List your project for free</span>, connect with global buyers, and secure your exit.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-12 py-6 bg-brand-blue text-white font-bold rounded-full hover:shadow-[0_0_50px_rgba(0,112,255,0.4)] transition-all flex items-center gap-3 group uppercase tracking-widest text-[11px] active:scale-95 shadow-lg shadow-brand-blue/20">
              LIST YOUR PROJECT FREE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/pricing" className="px-12 py-6 glass rounded-full font-bold hover:bg-white/10 transition-all text-white uppercase tracking-widest text-[11px] active:scale-95 border border-white/10 flex items-center gap-2">
              <Gem size={16} /> VIEW BOOSTS
            </Link>
          </div>
        </motion.div>

        {/* --- STATS (USING MONO FOR NUMBERS) --- */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-32 border-t border-b border-white/5 py-12">
          {[
            { label: "TOTAL EXITS", val: "$4.2M+", icon: <DollarSign size={14} className="text-brand-blue" /> },
            { label: "VERIFIED BUYERS", val: "1,200", icon: <Globe size={14} className="text-brand-cyan" /> },
            { label: "AVG EXIT TIME", val: "14D", icon: <Zap size={14} className="text-yellow-500" /> },
            { label: "SUCCESS RATE", val: "94%", icon: <Star size={14} className="text-brand-blue" /> },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-2">
                {stat.icon}
                <h3 className="text-4xl font-mono font-black text-white tracking-tighter group-hover:scale-110 transition-transform">{stat.val}</h3>
              </div>
              <p className="text-[10px] text-gray-600 font-mono font-black tracking-[2px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- INVESTOR NETWORK (NEW) --- */}
      <InvestorLogos />

      <FeaturedProjects />

      {/* --- HOW IT WORKS (TECH FONT LABELS) --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white leading-tight">HOW IT <span className="text-brand-blue italic underline decoration-brand-blue/20">WORKS</span>?</h2>
          <p className="text-gray-500 text-xl font-bold">Secure transition in three seamless steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "LIST", desc: "Detail your project, financial data, and tech stack in 5 mins.", icon: <Rocket /> },
            { step: "02", title: "VERIFY", desc: "Our analysts confirm code quality and revenue authenticity.", icon: <Microscope /> },
            { step: "03", title: "EXIT", desc: "Complete transfer via our secure escrow and legal framework.", icon: <Zap /> },
          ].map((item, i) => (
            <div key={i} className="relative group p-10 glass rounded-[40px] border-white/5 hover:border-brand-blue/30 transition-all hover:bg-white/[0.03]">
              <div className="text-8xl font-mono font-black text-white/[0.03] absolute -top-8 -left-4 group-hover:text-brand-blue/5 transition-colors pointer-events-none">{item.step}</div>
              <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(0,112,255,0.1)]">
                {item.icon}
              </div>
              <h4 className="text-2xl font-extrabold mb-4 relative z-10 text-white tracking-tight uppercase tracking-[1px]">{item.title}</h4>
              <p className="text-gray-500 leading-relaxed relative z-10 text-sm font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- ELITE FEATURES --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Fingerprint size={32} />, title: "ESCROW SECURITY", desc: "Atomic swap between code and funds, held by our licensed escrow." },
            { icon: <Calculator size={32} />, title: "AI VALUATION", desc: "Real-time data engine providing precise exit valuation models." },
            { icon: <ShieldCheck size={32} />, title: "LEGAL ASSISTANCE", desc: "Full-service IP transfer and contract negotiation support." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass p-12 rounded-[50px] border-t border-white/5 hover:border-brand-blue/40 transition-all group"
            >
              <div className="w-16 h-16 rounded-3xl bg-brand-blue/5 flex items-center justify-center mb-8 text-brand-blue group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,112,255,0.1)] border border-brand-blue/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-extrabold mb-4 text-white tracking-[2px] uppercase">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-semibold italic">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="glass max-w-5xl mx-auto p-20 rounded-[80px] relative overflow-hidden border-brand-blue/20 bg-white/[0.01]">
          <div className="absolute inset-0 bg-brand-blue/5 blur-[120px]" />
          <div className="relative z-10">
            <div className="flex justify-center mb-10">
              <div className="p-6 bg-brand-blue/10 rounded-full animate-bounce shadow-[0_0_40px_rgba(0,112,255,0.3)] border border-brand-blue/20">
                <Heart className="text-brand-blue fill-current" size={40} />
              </div>
            </div>
            <h2 className="text-6xl font-extrabold mb-10 tracking-tighter text-white">THE NEXT EXIT <br /> <span className="text-brand-blue">COULD BE YOURS.</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="px-14 py-7 bg-brand-blue text-white font-bold rounded-full hover:shadow-[0_0_60px_rgba(0,112,255,0.6)] hover:scale-105 transition-all uppercase tracking-[4px] text-[11px] active:scale-95 shadow-xl">
                START YOUR JOURNEY FREE
              </button>
              <Link href="/pricing" className="text-gray-400 font-mono font-bold uppercase tracking-[3px] text-[10px] hover:text-white transition-colors">COMPARE PLANS</Link>
            </div>
            <p className="mt-12 text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[4px]">NO CREDIT CARD REQUIRED • SECURE ESCROW</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
