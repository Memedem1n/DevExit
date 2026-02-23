"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Tag, DollarSign, TrendingUp, Globe, 
  ShieldCheck, Zap, Download, Star, Cpu, 
  ArrowUpRight, MessageSquare, Send, Calculator,
  ExternalLink, Calendar, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProjectDetailPage() {
  const { slug } = useParams();
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
        const res = await fetch(`/api/projects/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setProject(data);
          setOfferAmount(data.price.toString());
          
          // NDA Kontrolü
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
      if (res.ok) {
        setIsNdaSigned(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningNda(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!user) {
      alert("Please login to make an offer");
      return;
    }
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
      } else {
        alert("Failed to send offer");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-white font-mono uppercase tracking-[4px]">
      404 | Project Not Found
    </div>
  );

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto relative z-10">
        <Link href="/explore" className="flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-12 transition-colors font-mono font-bold text-[10px] uppercase tracking-[3px] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO MARKETPLACE
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Project Title & Identity */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-32 h-32 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-blue/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Tag className="text-brand-blue relative z-10" size={48} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-mono font-black uppercase tracking-[2px] border border-brand-blue/20">
                    {project.type}
                  </span>
                  {project.isVerified && (
                    <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-mono font-black uppercase tracking-[2px] border border-green-500/20 flex items-center gap-2">
                      <ShieldCheck size={12} /> VERIFIED ASSET
                    </span>
                  )}
                  <span className="px-4 py-1.5 bg-white/5 text-gray-500 rounded-full text-[10px] font-mono font-black uppercase tracking-[2px] border border-white/10 flex items-center gap-2">
                    <Calendar size={12} /> LISTED {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4 uppercase leading-[0.9]">
                  {project.title}
                </h1>
                <p className="text-gray-500 font-bold text-lg flex items-center gap-3">
                   Built by <span className="text-white italic underline underline-offset-4 decoration-brand-blue/40">{project.user.name}</span>
                </p>
              </div>
            </div>

            {/* Financial Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: "MONTHLY MMR", val: `$${project.mmr.toLocaleString()}`, icon: <TrendingUp className="text-green-500" />, desc: "Certified Data" },
                 { label: "EXIT PRICE", val: `$${project.price.toLocaleString()}`, icon: <DollarSign className="text-brand-blue" />, desc: "Valuation" },
                 { label: "ASSET VIEWS", val: project.views.toLocaleString(), icon: <Globe className="text-brand-cyan" />, desc: "Engagement" },
               ].map((item, i) => (
                 <div key={i} className="glass p-8 rounded-[40px] border-white/5 hover:border-brand-blue/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                          {item.icon}
                       </div>
                       <span className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest">{item.desc}</span>
                    </div>
                    <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[2px] mb-2">{item.label}</p>
                    <h3 className="text-4xl font-mono font-black text-white tracking-tighter">{item.val}</h3>
                 </div>
               ))}
            </div>

            {/* Screenshots Showcase */}
            {project.screenshots && (
              <div className="space-y-8 relative">
                <h4 className="text-[11px] font-mono font-black text-brand-blue uppercase tracking-[4px] flex items-center gap-3">
                  <ImageIcon size={14} /> ASSET SHOWCASE
                </h4>
                
                <div className={`grid grid-cols-1 gap-6 transition-all duration-700 ${!isNdaSigned ? 'blur-2xl grayscale pointer-events-none opacity-40' : ''}`}>
                  {project.screenshots.split(',').map((url: string, i: number) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl"
                    >
                      <img src={url.trim()} alt={`Screenshot ${i + 1}`} className="w-full object-cover" />
                    </motion.div>
                  ))}
                </div>

                {!isNdaSigned && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-12">
                     <div className="glass p-10 rounded-[40px] border-brand-blue/30 shadow-[0_0_100px_rgba(0,112,255,0.2)] bg-background/40 backdrop-blur-md">
                        <Lock size={40} className="text-brand-blue mx-auto mb-6 animate-bounce" />
                        <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-4">Confidential Data</h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto font-medium">Please sign the digital NDA to unlock internal screenshots and technical data.</p>
                        <button 
                          onClick={handleSignNda}
                          disabled={isSigningNda}
                          className="px-10 py-4 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_30px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] active:scale-95"
                        >
                          {isSigningNda ? "SIGNING..." : "SIGN DIGITAL NDA"}
                        </button>
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* Description & Tech Stack */}
            <div className="glass p-12 rounded-[60px] border-white/5 space-y-12">
               <div>
                 <h4 className="text-[11px] font-mono font-black text-brand-blue uppercase tracking-[4px] mb-8 flex items-center gap-3">
                   <Zap size={14} /> EXECUTIVE SUMMARY
                 </h4>
                 <p className="text-xl text-gray-400 leading-relaxed font-medium">
                   {project.description}
                 </p>
               </div>

               <div>
                 <h4 className="text-[11px] font-mono font-black text-brand-blue uppercase tracking-[4px] mb-8 flex items-center gap-3">
                   <Cpu size={14} /> ARCHITECTURE & STACK
                 </h4>
                 <div className="flex flex-wrap gap-4">
                   {project.techStack.split(',').map((tech: string) => (
                     <div key={tech} className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-blue/30 transition-all flex items-center gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-brand-blue group-hover:animate-ping" />
                        <span className="text-xs font-mono font-black text-white uppercase tracking-widest">{tech.trim()}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Action Center (Right) */}
          <div className="space-y-8">
            <div className="glass p-10 rounded-[50px] border-brand-blue/20 bg-brand-blue/[0.02] sticky top-32">
               <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-brand-blue text-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(0,112,255,0.4)]">
                    <Zap size={32} />
                  </div>
                  <h4 className="text-2xl font-extrabold text-white tracking-tight uppercase mb-2">SECURE EXIT</h4>
                  <p className="text-gray-500 text-xs font-bold px-4">Direct acquisition via DevExit escrow protection.</p>
               </div>

               <div className="space-y-4 mb-10">
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex justify-between items-center">
                     <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px]">LIST PRICE</span>
                     <span className="text-2xl font-mono font-black text-white">${project.price.toLocaleString()}</span>
                  </div>
                  <div className="p-4 rounded-3xl bg-green-500/5 border border-green-500/10 flex justify-between items-center">
                     <span className="text-[10px] font-mono font-black text-green-500 uppercase tracking-[2px]">EST. REVENUE</span>
                     <span className="text-xl font-mono font-black text-white">${(project.mmr * 12).toLocaleString()}/YR</span>
                  </div>
               </div>

               <button 
                onClick={() => setShowOfferModal(true)}
                className="w-full py-6 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_60px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[4px] text-[11px] active:scale-95 shadow-xl"
               >
                 MAKE AN OFFER
               </button>

               <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <p className="text-[10px] font-mono font-black text-gray-600 uppercase tracking-[3px] flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-green-500" /> ESCROW SECURED
                  </p>
               </div>
            </div>

            {/* Seller Contact Preview */}
            <div className="glass p-8 rounded-[40px] border-white/5 flex items-center gap-6">
               <div className="relative">
                 <img src={project.user.avatar} className="w-16 h-16 rounded-2xl border border-brand-blue/30 p-1" />
                 <div className="absolute -top-2 -right-2 bg-green-500 p-1 rounded-full border-2 border-background">
                    <Check size={10} className="text-white" />
                 </div>
               </div>
               <div>
                  <p className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-[2px] mb-1">LISTED BY</p>
                  <p className="text-lg font-extrabold text-white leading-tight">{project.user.name}</p>
                  <Link href="#" className="text-[9px] font-mono font-bold text-brand-blue uppercase tracking-widest hover:text-white transition-colors">VIEW PROFILE</Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfferModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-12 rounded-[60px] border-white/10 w-full max-w-xl relative z-10 bg-background shadow-2xl"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-extrabold text-white tracking-tighter mb-2 uppercase">SUBMIT AN OFFER</h3>
                <p className="text-gray-500 font-bold text-sm">Direct negotiation for <span className="text-brand-blue italic">{project.title}</span></p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">OFFER AMOUNT (USD)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue" size={20} />
                       <input 
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-14 pr-8 text-xl font-mono font-black text-white focus:outline-none focus:border-brand-blue/40 transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">TERMS & MESSAGE</label>
                    <textarea 
                      placeholder="Detail your acquisition terms, due diligence requests, etc..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-[40px] py-6 px-8 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium h-40"
                    />
                 </div>

                 <button 
                  onClick={handleMakeOffer}
                  disabled={isSubmitting}
                  className="w-full py-6 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_50px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[4px] text-[11px] active:scale-95 disabled:opacity-50"
                 >
                   {isSubmitting ? "SENDING PROPOSAL..." : "SEND OFFICIAL OFFER"}
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

function Check({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
