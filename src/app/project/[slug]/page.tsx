"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Tag, DollarSign, TrendingUp, Globe, 
  ShieldCheck, Zap, Download, Star, Cpu, 
  ArrowUpRight, MessageSquare, Send, Calculator,
  ExternalLink, Calendar, Image as ImageIcon, Lock,
  BarChart3, Layers, User as UserIcon, Activity,
  Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isNdaSigned, setIsNdaSigned] = useState(false);
  const [isSigningNda, setIsSigningNda] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`, { cache: 'no-store' });
        const data = await res.json();
        if (res.ok) {
          setProject(data);
          setOfferAmount(data.price.toString());
          if (user) {
            const ndaRes = await fetch(`/api/nda?projectId=${data.id}`);
            const ndaData = await ndaRes.json();
            setIsNdaSigned(ndaData.isSigned);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project detail", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug, user]);

  const handleSignNda = async () => {
    if (!user) return alert("Please login first");
    setIsSigningNda(true);
    try {
      const res = await fetch("/api/nda", {
        method: "POST",
        body: JSON.stringify({ projectId: project.id }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) setIsNdaSigned(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningNda(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!user) return alert("Please login to make an offer");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        body: JSON.stringify({
          projectId: project.id,
          amount: parseFloat(offerAmount),
          message: offerMessage
        }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        alert("Offer sent successfully!");
        setShowOfferModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="min-h-screen bg-background flex items-center justify-center text-white font-mono uppercase tracking-[4px]">404 | ASSET NOT FOUND</div>;

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 relative z-10 max-w-6xl mx-auto">
        {/* --- APP STORE HEADER --- */}
        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-16">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 bg-white/5 p-1">
             <img src={project.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`} className="w-full h-full object-cover rounded-[28px] md:rounded-[36px]" />
          </div>
          
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">{project.title}</h1>
            <p className="text-xl font-bold text-brand-blue tracking-tight uppercase opacity-80">{project.user.name}</p>
            <div className="flex flex-wrap gap-3 pt-4">
               <button 
                onClick={() => setShowOfferModal(true)}
                className="px-10 py-3 bg-brand-blue text-white font-black rounded-full hover:scale-105 transition-all uppercase tracking-widest text-[11px] shadow-lg shadow-brand-blue/20"
               >
                 SUBMIT OFFER
               </button>
               <div className="px-10 py-3 glass rounded-full font-black text-white text-[11px] uppercase tracking-widest border border-white/10 flex items-center gap-2">
                 <ShieldCheck size={14} className="text-green-500" /> SECURE EXIT
               </div>
            </div>
          </div>
        </div>

        {/* --- SUMMARY BAR --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border-t border-b border-white/5 py-8 mb-16">
           {[
             { label: "RATING", val: `${project.rating || "0"} (${project.reviewCount || 0})`, icon: <Star size={14} className="text-yellow-500 fill-current" /> },
             { label: "MONTHLY MMR", val: `$${project.mmr?.toLocaleString() || "0"}`, icon: <TrendingUp size={14} /> },
             { label: "ASKING PRICE", val: `$${Math.round((project.price || 0) / 1000)}K`, icon: <DollarSign size={14} /> },
             { label: "ASSET CLASS", val: project.type, icon: <Layers size={14} /> },
             { label: "VIEWS", val: project.views || 0, icon: <Activity size={14} /> },
           ].map((item, i) => (
             <div key={i} className="text-center px-4 border-r border-white/5 last:border-0">
                <p className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[2px] mb-2 flex items-center justify-center gap-2">
                  {item.icon} {item.label}
                </p>
                <h3 className="text-xl font-mono font-black text-white tracking-tight">{item.val}</h3>
             </div>
           ))}
        </div>

        {/* --- SCREENSHOTS GALLERY --- */}
        <div className="mb-20">
           <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] mb-8 opacity-40">Preview</h4>
           <div className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-6 px-6">
              {project.screenshots ? (
                project.screenshots.split(',').map((url: string, i: number) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className={`relative shrink-0 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl ${!isNdaSigned ? 'blur-3xl grayscale' : ''}`}
                  >
                    <img src={url.trim()} className="h-[400px] md:h-[550px] w-auto object-contain" />
                    {!isNdaSigned && i === 0 && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md px-10 text-center">
                         <Lock size={32} className="text-brand-blue mb-4" />
                         <p className="text-[10px] font-mono font-black text-white uppercase tracking-widest mb-6">Confidential Assets</p>
                         <button onClick={handleSignNda} className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Sign NDA to Reveal</button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="w-full h-64 glass rounded-[40px] flex items-center justify-center border border-dashed border-white/5">
                   <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest">No preview images available</p>
                </div>
              )}
           </div>
        </div>

        {/* --- DESCRIPTION & INFO TABLE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
           <div className="lg:col-span-2 space-y-12">
              <div>
                <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] mb-8 opacity-40">Description</h4>
                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] mb-8 opacity-40">Engineering Stack</h4>
                <div className="flex flex-wrap gap-3">
                  {project.techStack?.split(',').map((tech: string, i: number) => (
                    <span key={i} className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 text-xs font-black text-white uppercase tracking-widest">
                      {tech.trim()}
                    </span>
                  )) || <p className="text-gray-600">Standard Stack</p>}
                </div>
              </div>
           </div>

           <div className="space-y-12">
              <div>
                <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] mb-8 opacity-40">Information</h4>
                <div className="divide-y divide-white/5">
                   {[
                     { label: "Seller", val: project.user.name },
                     { label: "Revenue Model", val: project.revenueModel || "N/A" },
                     { label: "Churn Rate", val: project.churnRate ? `${project.churnRate}%` : "N/A" },
                     { label: "LTV", val: project.ltv ? `$${project.ltv}` : "N/A" },
                     { label: "Size", val: project.appSize || "N/A" },
                     { label: "Age Rating", val: project.ageRating || "N/A" },
                     { label: "Languages", val: project.languages || "English" },
                     { label: "Last Update", val: project.lastUpdate ? new Date(project.lastUpdate).toLocaleDateString() : "N/A" },
                   ].map((info, i) => (
                     <div key={i} className="py-4 flex justify-between gap-4">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{info.label}</span>
                        <span className="text-[10px] font-black text-white uppercase text-right max-w-[150px] truncate">{info.val}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-8 glass rounded-[40px] border-brand-blue/20 bg-brand-blue/[0.02]">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-brand-blue/10 rounded-2xl">
                       <MessageSquare size={20} className="text-brand-blue" />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Direct Line</h4>
                 </div>
                 <p className="text-[10px] text-gray-500 font-bold leading-relaxed mb-6">Need more details about this acquisition? Connect with the developer instantly.</p>
                 <button 
                  onClick={() => window.location.href = '/chat'}
                  className="w-full py-4 border border-brand-blue text-brand-blue rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all"
                 >
                   INITIATE CHAT
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOfferModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass p-12 rounded-[60px] border-white/10 w-full max-w-2xl relative z-10 bg-[#020617] shadow-3xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Send size={200} /></div>
              
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-brand-blue mx-auto mb-8 border border-brand-blue/20">
                  <Send size={40} />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">SUBMIT OFFICIAL OFFER</h3>
                <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto leading-relaxed">You are initiating an acquisition proposal for <span className="text-brand-blue">{project.title}</span>.</p>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[3px] ml-4 text-center block">OFFER AMOUNT (USD)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-blue" size={24} />
                       <input 
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-[35px] py-8 pl-16 pr-8 text-4xl font-mono font-black text-white focus:outline-none focus:border-brand-blue/40 transition-all text-center"
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[3px] ml-4">MESSAGE & TERMS</label>
                    <textarea 
                      placeholder="e.g., Cash offer, looking for a 30-day transition period, asset-only transfer..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[40px] py-8 px-10 text-lg text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium h-48 placeholder:text-gray-700"
                    />
                 </div>

                 <button 
                  onClick={handleMakeOffer}
                  disabled={isSubmitting}
                  className="w-full py-7 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_60px_rgba(0,112,255,0.5)] transition-all uppercase tracking-[4px] text-[12px] active:scale-95 disabled:opacity-50"
                 >
                   {isSubmitting ? "TRANSMITTING PROPOSAL..." : "SEND OFFICIAL OFFER"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
