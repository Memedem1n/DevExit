"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { 
  BarChart3, Eye, MousePointerClick, MessageSquare, 
  TrendingUp, Users, ArrowUpRight, Lock, Bell
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projectCount: 0,
    totalViews: 0,
    offerCount: 0,
    qualityScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-mono font-bold uppercase tracking-[2px] mb-4 border border-brand-blue/20">
               {user?.currentRole} CONSOLE
             </div>
             <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
               PERFORMANCE <span className="text-gradient italic">HUB</span>
             </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/add" className="px-8 py-4 bg-brand-blue text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,112,255,0.4)] transition-all uppercase tracking-widest text-[11px] flex items-center gap-2">
              NEW LISTING <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "TOTAL VIEWS", val: stats.totalViews.toLocaleString(), icon: <Eye size={18} />, change: "Real-time", color: "text-brand-blue" },
            { label: "INTERESTED BUYERS", val: stats.offerCount, icon: <Users size={18} />, change: "Offers", color: "text-brand-cyan" },
            { label: "ACTIVE LISTINGS", val: stats.projectCount, icon: <MessageSquare size={18} />, change: "In Market", color: "text-green-500" },
            { label: "LISTING QUALITY", val: stats.qualityScore > 0 ? `${stats.qualityScore}/100` : "N/A", icon: <TrendingUp size={18} />, change: "Analysis", color: "text-purple-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group hover:border-brand-blue/30 transition-all"
            >
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-2 w-1/2 bg-white/10 rounded" />
                  <div className="h-8 w-3/4 bg-white/10 rounded" />
                </div>
              ) : (
                <>
                  <div className={`absolute top-0 right-0 p-6 opacity-10 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-[2px] mb-2">{stat.label}</p>
                  <h3 className="text-4xl font-mono font-black text-white mb-2 tracking-tighter">{stat.val}</h3>
                  <p className={`text-[10px] font-bold ${stat.color} flex items-center gap-1`}>
                    <TrendingUp size={10} /> {stat.change}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity / Notifications */}
          <div className="glass p-10 rounded-[40px] border-white/5 lg:col-span-2">
            <h3 className="text-xl font-extrabold text-white mb-8 flex items-center gap-3">
              <Bell size={20} className="text-brand-blue" /> RECENT ACTIVITY
            </h3>
            <div className="space-y-6">
              {[
                { type: "Offer", msg: "TechCapital LLC sent a preliminary offer of $115,000.", time: "2h ago", color: "bg-green-500/10 text-green-500 border-green-500/20" },
                { type: "NDA Signed", msg: "Investor 'Alex M.' signed the NDA for Lumina AI.", time: "5h ago", color: "bg-brand-blue/10 text-brand-blue border-brand-blue/20" },
                { type: "View Spike", msg: "Your project is trending in 'SaaS' category (+400 views).", time: "1d ago", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
                { type: "Message", msg: "New inquiry about technical debt from a verified buyer.", time: "2d ago", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
              ].map((notif, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest border ${notif.color} shrink-0`}>
                    {notif.type}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300 leading-snug">{notif.msg}</p>
                    <span className="text-[10px] text-gray-600 font-mono mt-2 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Valuation Insight */}
          <div className="glass p-10 rounded-[40px] border-brand-blue/20 relative overflow-hidden bg-brand-blue/[0.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[80px] rounded-full" />
            
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-mono font-bold uppercase tracking-[2px] mb-4 border border-brand-blue/20">
                AI INSIGHT
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-2">VALUATION UPDATE</h3>
              <p className="text-gray-500 text-sm font-medium">Based on recent market trends & your verified MMR growth.</p>
            </div>

            <div className="text-center py-8 border-t border-b border-white/5 mb-8">
              <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[2px] mb-2">ESTIMATED EXIT RANGE</p>
              <div className="text-5xl font-mono font-black text-white tracking-tighter">
                $110K <span className="text-gray-600 text-3xl mx-2">-</span> $145K
              </div>
            </div>

            <button className="w-full py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_30px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] active:scale-95">
              UPDATE ASSET DATA
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
