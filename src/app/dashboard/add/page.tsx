"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Check, Globe, Download, 
  DollarSign, ShieldCheck, Zap, RefreshCcw, 
  Star, Image as ImageIcon, ExternalLink, Cpu,
  Trash2, Plus, Info, Layout, Briefcase, Lock, Eye, EyeOff,
  ChevronRight, Calculator, PieChart, Users, Calendar, X,
  ChevronDown, FileText, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AddProjectPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [storeUrl, setStoreUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [revealLogo, setRevealLogo] = useState(false);
  const [revealScreens, setRevealScreens] = useState(false);
  const [revealDetails, setRevealDetails] = useState(false);

  // Form Data State
  const [projectData, setProjectData] = useState<any>(null);
  const [displayPrice, setDisplayPrice] = useState("15,000.00");
  const [selectedTech, setSelectedTech] = useState<string[]>(["Next.js", "Tailwind"]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [rcApiKey, setRcApiKey] = useState("");
  const [verifiedMMR, setVerifiedMMR] = useState(0);
  const [pricingStrategy, setPricingStrategy] = useState<"FIXED" | "OFFERS">("FIXED");
  const [assetsIncluded, setAssetsIncluded] = useState<string[]>(["Source Code", "App Store Account"]);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const TECH_OPTIONS = ["Next.js", "React", "Node.js", "Python", "Swift", "Kotlin", "Go", "Prisma", "PostgreSQL", "SQLite", "Firebase", "AWS", "TensorFlow", "OpenAI", "Stripe", "RevenueCat"];
  const ASSET_OPTIONS = ["Source Code", "Domain", "Logo & Brand", "Subscriber List", "App Store Account", "Play Store Account", "Documentation", "Social Media Accounts"];

  const handlePriceChange = (val: string) => {
    const cleanValue = val.replace(/[^0-9.]/g, "");
    if (!cleanValue) { setDisplayPrice(""); return; }
    const parts = cleanValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setDisplayPrice(parts.join("."));
  };

  const toggleList = (list: string[], setList: any, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const fetchAppData = async () => {
    if (!storeUrl) {
      setProjectData({
        title: "", description: "", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Manual",
        type: "SaaS", developer: user?.name, mau: 0, monthlyExpenses: 0, appAge: "New", rating: "0", reviewCount: 0
      });
      setStep(2); setRevealLogo(true); setRevealDetails(true);
      return;
    }
    
    setIsFetching(true);
    try {
      const appIdMatch = storeUrl.match(/id(\d+)/);
      const appId = appIdMatch ? appIdMatch[1] : null;

      if (appId) {
        // Use a proxy-friendly lookup or direct iTunes (CORS might need a server-side route in prod)
        const res = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const app = data.results[0];
          const sizeMB = (app.fileSizeBytes / (1024 * 1024)).toFixed(1) + " MB";
          
          setProjectData({
            title: app.trackName,
            description: app.description,
            logo: app.artworkUrl512 || app.artworkUrl100,
            rating: app.averageUserRating?.toString() || "0",
            reviewCount: app.userRatingCount || 0,
            type: "Mobile",
            developer: app.artistName,
            appSize: sizeMB,
            ageRating: app.contentAdvisoryRating,
            languages: app.languageCodesISO2A?.slice(0, 3).join(", "),
            lastUpdate: app.currentVersionReleaseDate,
            revenueModel: "SUBSCRIPTION",
            mau: 0, monthlyExpenses: 0, appAge: "1 Year"
          });
          
          // CRITICAL FIX: Robust screenshot handling
          const sss = app.screenshotUrls || [];
          setScreenshots(sss);
          setScreenshotUrl(sss.join(", "));
          
          setStep(2);
          setTimeout(() => setRevealLogo(true), 400);
          setTimeout(() => setRevealScreens(true), 1000);
          setTimeout(() => setRevealDetails(true), 2000);
          return;
        }
      }
      setStep(2); setRevealLogo(true); setRevealDetails(true);
    } catch (err) {
      setStep(2); setRevealLogo(true); setRevealDetails(true);
    } finally {
      setIsFetching(false);
    }
  };

  const verifyRevenue = async (platform: "revenuecat" | "adapty") => {
    if (!rcApiKey) return alert("Please enter your API Key");
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/verify/${platform}`, {
        method: "POST",
        body: JSON.stringify({ apiKey: rcApiKey }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        setIsVerified(true);
        setVerifiedMMR(data.verifiedMMR);
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const publishProject = async () => {
    setIsFetching(true);
    try {
      const numericPrice = parseFloat(displayPrice.replace(/,/g, ""));
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          ...projectData,
          price: numericPrice,
          techStack: selectedTech.join(", "),
          screenshots: screenshots.join(","),
          assetsIncluded: assetsIncluded.join(", "),
          pricingStrategy,
          visibility,
          mmr: isVerified ? verifiedMMR : projectData.mmr || 0,
          storeUrl
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) setStep(3);
      else alert("Publish failed. Check required fields.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans selection:bg-brand-blue selection:text-white">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-6xl mx-auto relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-12 transition-all font-mono font-bold text-[10px] uppercase tracking-[3px] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HUB
        </Link>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
              className="glass p-20 rounded-[60px] border-white/5 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Globe size={300} /></div>
              
              <div className="w-24 h-24 bg-brand-blue/10 rounded-[35px] flex items-center justify-center text-brand-blue mx-auto mb-10 shadow-2xl border border-brand-blue/20">
                <RefreshCcw size={48} className={isFetching ? "animate-spin" : ""} />
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase">Launch Your <span className="text-gradient italic">Exit.</span></h2>
              <p className="text-gray-500 text-xl mb-12 font-bold max-w-md mx-auto leading-relaxed">Pazar yerinde yerinizi almak için mağaza linkini yapıştırın veya manuel devam edin.</p>
              
              <div className="relative mb-10 group">
                <Globe className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-blue transition-colors" size={24} />
                <input 
                  type="text" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://apps.apple.com/app/..."
                  className="w-full bg-white/5 border border-white/5 rounded-full py-8 pl-20 pr-48 text-base text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium placeholder:text-gray-700 shadow-inner"
                />
                <button 
                  onClick={fetchAppData} disabled={isFetching}
                  className="absolute right-4 top-3 bottom-3 bg-brand-blue text-white px-12 rounded-full font-black uppercase tracking-widest text-[11px] hover:shadow-[0_0_40px_rgba(0,112,255,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isFetching ? "ANALYZING..." : "FETCH ASSETS"}
                </button>
              </div>

              <button onClick={() => fetchAppData()} className="text-[11px] font-mono font-black text-gray-600 hover:text-white uppercase tracking-[4px] transition-colors flex items-center gap-3 mx-auto group">
                SKIP AUTO-SYNC <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && projectData && (
            <div className="space-y-16">
              
              {/* --- 1. REVEAL LOGO --- */}
              <AnimatePresence>
                {revealLogo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-8"
                  >
                    <div className="relative group">
                      <div className="w-48 h-48 rounded-[50px] overflow-hidden border-4 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-white/5 p-1 transition-transform group-hover:scale-[1.02] duration-500">
                        <img src={projectData.logo} className="w-full h-full object-cover rounded-[42px]" />
                      </div>
                      <button onClick={() => setProjectData({...projectData, logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random()}`})} className="absolute -bottom-2 -right-2 bg-brand-blue p-4 rounded-3xl border-4 border-background text-white shadow-xl hover:scale-110 active:scale-90 transition-all">
                        <RefreshCcw size={20} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">{projectData.title || "Untiled Asset"}</h3>
                      <div className="flex items-center justify-center gap-3">
                         <span className="px-4 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[9px] font-mono font-black uppercase tracking-[3px] border border-brand-blue/20">Secure Sync</span>
                         <span className="px-4 py-1 bg-white/5 text-gray-500 rounded-full text-[9px] font-mono font-black uppercase tracking-[3px] border border-white/5">{projectData.developer}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- 2. REVEAL SCREENSHOTS --- */}
              <AnimatePresence>
                {revealScreens && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between px-6">
                       <h4 className="text-[11px] font-mono font-black text-gray-500 uppercase tracking-[4px] flex items-center gap-3"><ImageIcon size={14} className="text-brand-blue"/> Verification Screenshots</h4>
                       <button onClick={() => setScreenshots([...screenshots, ""])} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-brand-blue transition-all flex items-center gap-2"><Plus size={14}/> Add Image</button>
                    </div>
                    <div className="flex gap-8 overflow-x-auto no-scrollbar pb-6 px-6">
                      {screenshots.length > 0 ? screenshots.map((url, i) => (
                        <motion.div 
                          key={i} initial={{ opacity: 0, scale: 0.9, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          className="relative shrink-0 w-56 h-96 rounded-[45px] overflow-hidden border border-white/10 group bg-white/5 shadow-2xl"
                        >
                          <img src={url || "https://placehold.co/400x800/020617/white?text=Screenshot"} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button 
                              onClick={() => setScreenshots(screenshots.filter((_, idx) => idx !== i))}
                              className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"
                             >
                              <Trash2 size={20} />
                             </button>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] text-gray-600 font-mono text-[10px] uppercase tracking-widest">No store images found</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- 3. REVEAL DETAILS FORM --- */}
              <AnimatePresence>
                {revealDetails && (
                  <motion.div 
                    initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 30, stiffness: 100 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start px-4"
                  >
                    {/* Left: General Info */}
                    <div className="lg:col-span-2 space-y-10">
                       <div className="glass p-12 rounded-[60px] border-white/5 space-y-10 shadow-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-4">Asset Title</label>
                                <input 
                                  type="text" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                                  className="w-full bg-white/5 border border-white/5 rounded-[25px] py-5 px-8 text-xl font-extrabold text-white outline-none focus:border-brand-blue/40 transition-all shadow-inner"
                                />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-4">Category</label>
                                <div className="relative">
                                  <select 
                                    value={projectData.type} onChange={(e) => setProjectData({...projectData, type: e.target.value})}
                                    className="w-full bg-white/5 border border-white/5 rounded-[25px] py-5 px-8 text-sm font-bold text-white outline-none focus:border-brand-blue/40 appearance-none shadow-inner"
                                  >
                                    <option value="SaaS">SaaS</option>
                                    <option value="Mobile">Mobile App</option>
                                    <option value="E-Commerce">E-Commerce</option>
                                    <option value="AI/ML">AI/ML</option>
                                  </select>
                                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-4">Detailed Description</label>
                            <textarea 
                              value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                              className="w-full bg-white/5 border border-white/5 rounded-[40px] py-8 px-10 text-sm text-gray-400 focus:outline-none focus:border-brand-blue/40 h-56 leading-relaxed shadow-inner"
                            />
                          </div>

                          <div className="space-y-6">
                            <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-4">Engineering Stack</label>
                            <div className="flex flex-wrap gap-3">
                              {TECH_OPTIONS.map(tech => (
                                <button key={tech} onClick={() => toggleList(selectedTech, setSelectedTech, tech)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border shadow-lg ${selectedTech.includes(tech) ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>
                                  {tech}
                                </button>
                              ))}
                            </div>
                          </div>
                       </div>

                       {/* Assets for Sale */}
                       <div className="glass p-12 rounded-[60px] border-white/5 shadow-2xl">
                          <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] mb-10 flex items-center gap-3"><Layout size={16} className="text-brand-blue"/> Assets Included in Acquisition</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                             {ASSET_OPTIONS.map(opt => (
                               <button key={opt} onClick={() => toggleList(assetsIncluded, setAssetsIncluded, opt)} className={`p-6 rounded-[30px] border transition-all text-left flex items-center gap-4 ${assetsIncluded.includes(opt) ? 'border-brand-blue bg-brand-blue/5 text-white shadow-xl shadow-brand-blue/10' : 'border-white/5 bg-white/5 text-gray-600'}`}>
                                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${assetsIncluded.includes(opt) ? 'bg-brand-blue border-brand-blue' : 'border-white/20'}`}>
                                     {assetsIncluded.includes(opt) && <Check size={12} strokeWidth={4} />}
                                  </div>
                                  <span className="text-[11px] font-black uppercase tracking-wider leading-none">{opt}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Right: Metrics & Pricing */}
                    <div className="space-y-10">
                       {/* Performance Stats */}
                       <div className="glass p-10 rounded-[50px] border-white/5 space-y-8 shadow-2xl">
                          <h4 className="text-[11px] font-mono font-black text-gray-500 uppercase tracking-[4px] border-b border-white/5 pb-4">Monthly Performance</h4>
                          <div className="space-y-6">
                             {[
                               { label: "MAU (Active Users)", icon: <Users size={16}/>, key: "mau" },
                               { label: "Monthly Expenses ($)", icon: <PieChart size={16}/>, key: "monthlyExpenses" },
                               { label: "App Age (e.g. 2y)", icon: <Calendar size={16}/>, key: "appAge" },
                             ].map(item => (
                               <div key={item.key} className="space-y-3">
                                  <p className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-3 ml-2">{item.icon} {item.label}</p>
                                  <input 
                                    type={item.key === 'appAge' ? 'text' : 'number'}
                                    onChange={(e) => setProjectData({...projectData, [item.key]: e.target.value})}
                                    className="w-full bg-white/5 border border-white/5 rounded-[20px] py-4 px-6 text-sm font-bold text-white outline-none focus:border-brand-blue/40 shadow-inner"
                                  />
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Verification */}
                       <div className={`glass p-10 rounded-[50px] border-2 transition-all shadow-2xl ${isVerified ? 'border-green-500/30 bg-green-500/5' : 'border-brand-blue/20 bg-brand-blue/[0.02]'}`}>
                          <div className="text-center mb-8">
                             <div className={`w-16 h-16 rounded-[25px] mx-auto mb-6 flex items-center justify-center transition-all ${isVerified ? 'bg-green-500' : 'bg-brand-blue'} text-white shadow-2xl`}>
                                {isVerified ? <CheckCircle2 size={32} /> : <Zap size={32} />}
                             </div>
                             <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">MMR Validation</h4>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">RevenueCat / Adapty Connect</p>
                          </div>
                          <input 
                            type="password" value={rcApiKey} onChange={(e) => setRcApiKey(e.target.value)}
                            placeholder="V3 Secret API Key" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none mb-6 text-center placeholder:text-gray-700" 
                          />
                          <div className="flex gap-3">
                             <button onClick={() => verifyRevenue("revenuecat")} disabled={isVerifying} className="flex-1 py-4 bg-white text-black font-black rounded-2xl text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-xl">RevenueCat</button>
                             <button onClick={() => verifyRevenue("adapty")} disabled={isVerifying} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[9px] uppercase tracking-widest active:scale-95 transition-all">Adapty</button>
                          </div>
                       </div>

                       {/* Strategy & Price */}
                       <div className="glass p-10 rounded-[55px] border-brand-blue/20 bg-brand-blue/[0.02] shadow-[0_0_100px_rgba(0,112,255,0.1)]">
                          <div className="space-y-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[3px] ml-4">Pricing Strategy</label>
                                <div className="flex bg-white/5 rounded-[25px] p-1.5 border border-white/10">
                                   <button onClick={() => setPricingStrategy("FIXED")} className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase transition-all ${pricingStrategy === 'FIXED' ? 'bg-brand-blue text-white shadow-xl' : 'text-gray-600 hover:text-white'}`}>Fixed</button>
                                   <button onClick={() => setPricingStrategy("OFFERS")} className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase transition-all ${pricingStrategy === 'OFFERS' ? 'bg-brand-blue text-white shadow-xl' : 'text-gray-600 hover:text-white'}`}>Offers</button>
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[3px] ml-4">Final Acquisition Price (USD)</label>
                                <div className="relative">
                                   <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue" size={24} />
                                   <input 
                                    type="text" value={displayPrice} onChange={(e) => handlePriceChange(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[25px] py-6 pl-14 pr-6 text-3xl font-mono font-black text-white focus:outline-none focus:border-brand-blue/40 shadow-inner"
                                   />
                                </div>
                             </div>

                             <button 
                              onClick={publishProject} disabled={isFetching}
                              className="w-full py-7 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_60px_rgba(0,112,255,0.5)] hover:scale-[1.02] transition-all uppercase tracking-[4px] text-[12px] active:scale-95 shadow-2xl"
                             >
                               {isFetching ? "TRANSMITTING..." : "PUBLISH OFFICIAL ASSET 🚀"}
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-green-500/10 border-2 border-green-500 text-green-500 rounded-[45px] flex items-center justify-center mx-auto mb-10 shadow-[0_0_80px_rgba(34,197,94,0.3)]">
                <CheckCircle2 size={64} strokeWidth={3} />
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter mb-6 uppercase">Asset <span className="text-green-500 italic">Secured.</span></h2>
              <p className="text-gray-500 text-xl font-bold mb-12 max-w-2xl mx-auto leading-relaxed">Your listing has been verified and integrated into the global marketplace. Lead generation is now active.</p>
              
              <div className="flex gap-6 justify-center">
                <Link href="/explore" className="px-12 py-6 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_50px_rgba(0,112,255,0.4)] transition-all uppercase tracking-widest text-[11px] active:scale-95">
                  MARKETPLACE VIEW
                </Link>
                <Link href="/dashboard" className="px-12 py-6 glass text-white font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-[11px] active:scale-95 border border-white/10">
                  RETURN TO HUB
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}
