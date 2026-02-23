"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, DollarSign, TrendingUp, ShieldCheck, 
  ExternalLink, Github, MessageSquare, BarChart3,
  Calendar, Users, Cpu, Lock, Gem, Zap, Search, AlertCircle,
  Code2, Cloud, FileText, Globe, MousePointer2, Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleAction = (type: 'chat' | 'offer') => {
    if (!isLoggedIn) {
      login('DEVELOPER'); // Demo auto-login
      return;
    }
    if (type === 'offer' && !user?.isVerified) {
      alert("⚠️ VERIFIED INVESTOR ONLY: Please complete your identity verification to place an offer.");
      return;
    }
    if (type === 'chat') router.push("/chat");
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto">
        <Link href="/explore" className="flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-12 transition-colors font-mono font-bold text-[10px] uppercase tracking-[3px] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO MARKETPLACE
        </Link>

        {/* HERO SECTION OF DETAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
          <div className="lg:col-span-2 space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-lg text-[10px] font-mono font-bold uppercase tracking-[2px] border border-brand-blue/20 flex items-center gap-2">
                  <Star size={10} fill="currentColor" /> ELITE SaaS ASSET
                </span>
                <span className="text-gray-600 text-[10px] font-mono font-bold uppercase tracking-[2px]">LISTING: #DX-9042</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.85]">
                Lumina AI: <br />
                <span className="text-gradient italic">THE FUTURE OF CONTENT.</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><Globe size={14} /> Global Market</div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><Users size={14} /> 12K+ MAU</div>
                <div className="flex items-center gap-2 bg-brand-blue/5 px-4 py-2 rounded-xl text-brand-blue border border-brand-blue/10"><Check size={14} /> KYC Verified</div>
              </div>
            </motion.div>
          </div>

          {/* VALUATION CARD (HIG COMPLIANT) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] -z-10 group-hover:bg-brand-blue/20 transition-all" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-[60px] border-brand-blue/20 sticky top-32 bg-white/[0.01] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
               <div className="mb-12">
                  <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[4px] mb-4">ACQUISITION PRICE</p>
                  <div className="text-7xl font-mono font-black text-white flex items-center tracking-tighter">
                    <span className="text-brand-blue text-2xl mr-2 font-bold">$</span>245,000
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-green-400 font-mono text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp size={12} /> Valuation Multiplier: 32x MMR
                  </div>
               </div>

               <div className="space-y-4 mb-12">
                  <button onClick={() => handleAction('offer')} className={`w-full py-6 font-black rounded-full transition-all uppercase tracking-[4px] text-[11px] active:scale-95 shadow-2xl flex items-center justify-center gap-3 ${user?.isVerified ? 'bg-brand-blue text-white' : 'bg-white text-black hover:bg-brand-blue hover:text-white'}`}>
                    {user?.isVerified ? <Gem size={16} /> : <Lock size={16} />}
                    {user?.isVerified ? "SEND BINDING OFFER" : "VERIFY TO PLACE OFFER"}
                  </button>
                  <button onClick={() => handleAction('chat')} className="w-full py-6 glass text-gray-400 font-bold rounded-full hover:bg-white/10 transition-all uppercase tracking-[4px] text-[11px] flex items-center justify-center gap-2 border border-white/5">
                    <MessageSquare size={16} /> CONTACT FOUNDER
                  </button>
               </div>

               <div className="pt-8 border-t border-white/5 space-y-4">
                  {[
                    { label: "ESCROW TYPE", val: "L3 SMART CONTRACT", icon: <ShieldCheck size={14} /> },
                    { label: "IP TRANSFER", val: "FULL ASSIGNMENT", icon: <FileText size={14} /> },
                    { label: "SUPPORT", val: "6 MONTHS", icon: <Briefcase size={14} /> }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                      <span className="text-white">{item.val}</span>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </div>

        {/* HYPER-REALISTIC DATA ROOM TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           <div className="lg:col-span-1 space-y-2">
             {["Overview", "Financials", "Codebase Health", "Infrastructure", "Market Analysis"].map((tab) => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab.toLowerCase())} 
                 className={`w-full text-left p-6 rounded-3xl transition-all border ${
                   activeTab === tab.toLowerCase() ? 'bg-brand-blue/10 border-brand-blue/30 text-white' : 'border-transparent text-gray-500 hover:bg-white/5'
                 } font-mono font-bold text-[10px] uppercase tracking-[2px] flex items-center justify-between group`}
               >
                 {tab}
                 <ArrowRight size={14} className={activeTab === tab.toLowerCase() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
               </button>
             ))}
           </div>

           <div className="lg:col-span-3">
             <div className="glass p-12 rounded-[60px] border-white/5 min-h-[500px]">
               {activeTab === "overview" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <h3 className="text-3xl font-extrabold text-white">THE STORY OF LUMINA</h3>
                   <p className="text-gray-400 text-lg leading-relaxed font-semibold">
                     Launched in Q4 2024, Lumina AI became an instant hit for content creators. 
                     By leveraging proprietary LLM adapters, it reduces video production costs by 95%.
                   </p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { icon: <MousePointer2 />, label: "CTR Rate", val: "%12.4" },
                        { icon: <TrendingUp />, label: "Churn", val: "%2.1" },
                        { icon: <Users />, label: "Retention", val: "%45" },
                        { icon: <Zap />, label: "Uptime", val: "%99.9" }
                      ].map((m, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                          <div className="text-brand-blue mb-2">{m.icon}</div>
                          <p className="text-[9px] font-mono font-black text-gray-600 uppercase mb-1">{m.label}</p>
                          <p className="text-xl font-mono font-black text-white">{m.val}</p>
                        </div>
                      ))}
                   </div>
                 </motion.div>
               )}

               {activeTab === "codebase health" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                   <div className="flex items-center gap-6 p-8 bg-brand-blue/5 border border-brand-blue/20 rounded-[40px]">
                      <div className="w-24 h-24 rounded-full border-4 border-brand-blue flex items-center justify-center text-3xl font-black text-white">
                        94
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold text-white uppercase tracking-tight">Code Integrity Score</h4>
                        <p className="text-gray-500 font-bold">Audited by DevExit AI Code-Review Engine</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-[10px] font-mono font-black text-gray-600 uppercase tracking-widest">Tech Debt</p>
                        <div className="w-full h-2 bg-white/5 rounded-full"><div className="w-[15%] h-full bg-green-500 rounded-full" /></div>
                        <p className="text-[10px] font-mono font-black text-gray-600 uppercase tracking-widest">Test Coverage</p>
                        <div className="w-full h-2 bg-white/5 rounded-full"><div className="w-[88%] h-full bg-brand-blue rounded-full" /></div>
                      </div>
                      <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                        <Code2 className="text-brand-blue mb-4" />
                        <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
                          "Clean architecture, fully typed TypeScript codebase with DDD principles. 
                          Zero critical vulnerabilities found in last 3 months."
                        </p>
                      </div>
                   </div>
                 </motion.div>
               )}
             </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const ArrowRight = ({ size, className }: any) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
