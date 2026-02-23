"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { 
  BarChart3, Eye, MousePointerClick, MessageSquare, 
  TrendingUp, Users, ArrowUpRight, Lock, Bell,
  Heart, Send, DollarSign
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
    valuation: { min: 0, max: 0 }
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [sentOffers, setSentOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          fetch("/api/user/stats"),
          fetch("/api/user/activity")
        ];

        if (user?.currentRole === 'INVESTOR') {
          promises.push(fetch("/api/watchlist"));
          // Verdiğim teklifler için bir API ekleyeceğiz veya mevcut teklifleri filtreleyeceğiz
        }

        const responses = await Promise.all(promises);
        const statsData = await responses[0].json();
        const activityData = await responses[1].json();
        
        if (responses[0].ok) setStats(statsData);
        if (responses[1].ok) setActivities(activityData);

        if (user?.currentRole === 'INVESTOR' && responses[2]) {
          const watchlistData = await responses[2].json();
          setWatchlist(watchlistData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, user?.currentRole]);

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleUpdateOffer = async (offerId: string, status: string) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // Refresh activities
        const activityRes = await fetch("/api/user/activity");
        const activityData = await activityRes.json();
        setActivities(activityData);
      }
    } catch (err) {
      console.error("Failed to update offer", err);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-mono font-bold uppercase tracking-[2px] mb-4 border border-brand-blue/20">
               {user?.currentRole} {user?.currentRole === 'DEVELOPER' ? 'CONSOLE' : 'PORTFOLIO'}
             </div>
             <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
               {user?.currentRole === 'DEVELOPER' ? 'PERFORMANCE' : 'ACQUISITION'} <span className="text-gradient italic">HUB</span>
             </h1>
          </div>
          <div className="flex gap-4">
            {user?.currentRole === 'DEVELOPER' ? (
              <Link href="/dashboard/add" className="px-8 py-4 bg-brand-blue text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,112,255,0.4)] transition-all uppercase tracking-widest text-[11px] flex items-center gap-2">
                NEW LISTING <ArrowUpRight size={14} />
              </Link>
            ) : (
              <Link href="/explore" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all uppercase tracking-widest text-[11px] flex items-center gap-2">
                EXPLORE ASSETS <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {(user?.currentRole === 'DEVELOPER' ? [
            { label: "TOTAL VIEWS", val: stats.totalViews.toLocaleString(), icon: <Eye size={18} />, change: "Real-time", color: "text-brand-blue" },
            { label: "INTERESTED BUYERS", val: stats.offerCount, icon: <Users size={18} />, change: "Offers", color: "text-brand-cyan" },
            { label: "ACTIVE LISTINGS", val: stats.projectCount, icon: <MessageSquare size={18} />, change: "In Market", color: "text-green-500" },
            { label: "LISTING QUALITY", val: stats.qualityScore > 0 ? `${stats.qualityScore}/100` : "N/A", icon: <TrendingUp size={18} />, change: "Analysis", color: "text-purple-500" },
          ] : [
            { label: "WATCHLIST", val: watchlist.length, icon: <Heart size={18} />, change: "Tracked", color: "text-red-500" },
            { label: "OFFERS SENT", val: "0", icon: <Send size={18} />, change: "Active", color: "text-brand-blue" },
            { label: "INVESTED CAPITAL", val: "$0", icon: <DollarSign size={18} />, change: "Exits", color: "text-green-500" },
            { label: "DEAL FLOW", val: "High", icon: <TrendingUp size={18} />, change: "Market", color: "text-purple-500" },
          ]).map((stat, i) => (
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
          <div className={`glass p-10 rounded-[40px] border-white/5 ${user?.currentRole === 'DEVELOPER' ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            <h3 className="text-xl font-extrabold text-white mb-8 flex items-center gap-3">
              <Bell size={20} className="text-brand-blue" /> RECENT ACTIVITY
            </h3>
            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((notif, i) => (
                  <div key={i} className="flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative group">
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest border ${notif.color} shrink-0`}>
                        {notif.type} {notif.status !== 'PENDING' && notif.status ? `| ${notif.status}` : ''}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-300 leading-snug">{notif.msg}</p>
                        <span className="text-[10px] text-gray-600 font-mono mt-2 block">{getTimeAgo(notif.time)}</span>
                      </div>
                    </div>

                    {/* Action Buttons for Offers */}
                    {notif.type === 'OFFER' && notif.status === 'PENDING' && user?.currentRole === 'DEVELOPER' && (
                      <div className="flex gap-3 mt-2">
                        <button 
                          onClick={() => handleUpdateOffer(notif.id, 'ACCEPTED')}
                          className="flex-1 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Accept Offer
                        </button>
                        <button 
                          onClick={() => handleUpdateOffer(notif.id, 'REJECTED')}
                          className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 font-mono text-[10px] uppercase text-center py-10 tracking-widest">NO RECENT ACTIVITY</p>
              )}
            </div>
          </div>

          {user?.currentRole === 'DEVELOPER' ? (
            /* AI Valuation Insight (Developer Only) */
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
                  {stats.valuation?.min > 0 ? (
                    <>
                      ${Math.round(stats.valuation.min / 1000)}K <span className="text-gray-600 text-3xl mx-2">-</span> ${Math.round(stats.valuation.max / 1000)}K
                    </>
                  ) : (
                    "$0K"
                  )}
                </div>
              </div>

              <button className="w-full py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_30px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] active:scale-95">
                UPDATE ASSET DATA
              </button>
            </div>
          ) : (
            /* Investor Watchlist Showcase */
            <div className="lg:col-span-2 space-y-8">
               <h3 className="text-xl font-extrabold text-white flex items-center gap-3">
                 <Heart size={20} className="text-red-500" /> PORTFOLIO WATCHLIST
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {watchlist.length > 0 ? (
                   watchlist.map((project) => (
                     <Link key={project.id} href={`/project/${project.slug}`}>
                        <div className="glass p-8 rounded-[40px] border-white/5 hover:border-brand-blue/30 transition-all group">
                           <div className="flex justify-between items-start mb-6">
                              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-brand-blue/10 transition-colors">
                                <Zap className="text-brand-blue" size={20} />
                              </div>
                              <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">{project.type}</span>
                           </div>
                           <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-brand-blue transition-colors uppercase truncate">{project.title}</h4>
                           <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                              <div>
                                <p className="text-[8px] font-mono font-black text-gray-600 uppercase mb-1">EXIT PRICE</p>
                                <p className="text-lg font-mono font-black text-white">${project.price.toLocaleString()}</p>
                              </div>
                              <ArrowUpRight size={18} className="text-gray-700 group-hover:text-brand-blue transition-all" />
                           </div>
                        </div>
                     </Link>
                   ))
                 ) : (
                   <div className="col-span-full py-20 text-center glass rounded-[40px] border-white/5">
                      <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[4px]">Your watchlist is empty.</p>
                      <Link href="/explore" className="text-brand-blue font-bold text-[10px] uppercase tracking-[2px] mt-4 block hover:text-white transition-colors">Explore Assets</Link>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
