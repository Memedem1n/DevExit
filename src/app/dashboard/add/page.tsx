"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Check, Globe, Download, 
  DollarSign, ShieldCheck, Zap, RefreshCcw, 
  Star, Image as ImageIcon, ExternalLink, Cpu
} from "lucide-react";
import Link from "next/link";

export default function AddProjectPage() {
  const [step, setStep] = useState(1);
  const [storeUrl, setStoreUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Mock Fetched Data
  const [projectData, setProjectData] = useState<any>(null);

  const simulateDataFetch = () => {
    if (!storeUrl) return;
    setIsFetching(true);
    
    // Simulating API Fetch (iTunes Search API / Play Store Scraper)
    setTimeout(() => {
      setProjectData({
        title: "Lumina AI Photo Editor",
        description: "Advanced AI-powered photo editing tool with neural filters and autonomous retouching.",
        logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Lumina",
        downloads: "245,000+",
        rating: "4.8",
        type: "SaaS", // Normalized category
        developer: "Lumina Tech Inc.",
        screens: [1, 2, 3]
      });
      setIsFetching(false);
      setStep(2);
    }, 2500);
  };

  const publishProject = async () => {
    if (!projectData) return;
    setIsFetching(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: projectData.title,
          description: projectData.description,
          type: projectData.type,
          mmr: isVerified ? 4250 : 0,
          price: 125000, // Simulated price
          techStack: "Swift, Python, TensorFlow",
          storeUrl: storeUrl,
          screenshots: screenshotUrl
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to publish project");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsFetching(false);
    }
  };

  const verifyRevenue = () => {
    setIsVerified(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-5xl mx-auto relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-12 transition-colors font-mono font-bold text-[10px] uppercase tracking-[3px] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO DASHBOARD
        </Link>

        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
              step >= i ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_20px_rgba(0,112,255,0.4)]' : 'bg-background border-white/5 text-gray-600'
            }`}>
              {step > i ? <Check size={20} strokeWidth={3} /> : <span className="font-mono font-black">{i}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-12 md:p-16 rounded-[60px] border-white/5 text-center"
            >
              <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-brand-blue mx-auto mb-8 shadow-2xl border border-brand-blue/20 animate-pulse">
                <RefreshCcw size={40} />
              </div>
              <h2 className="text-4xl font-extrabold text-white tracking-tighter mb-4">Otomatik Bilgi Çekimi</h2>
              <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto font-bold">App Store veya Play Store linkini yapıştırın, projenizi saniyeler içinde analiz edelim.</p>
              
              <div className="max-w-xl mx-auto relative mb-12">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text" 
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://apps.apple.com/app/..."
                  className="w-full bg-white/5 border border-white/5 rounded-full py-6 pl-14 pr-32 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium"
                />
                <button 
                  onClick={simulateDataFetch}
                  disabled={!storeUrl || isFetching}
                  className="absolute right-3 top-2 bottom-2 bg-brand-blue text-white px-8 rounded-full font-black uppercase tracking-widest text-[9px] hover:shadow-[0_0_20px_rgba(0,112,255,0.4)] transition-all disabled:opacity-50"
                >
                  {isFetching ? "ANALİZ EDİLİYOR..." : "VERİ ÇEK"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-30">
                {["METADATA", "LOGOS", "RATINGS", "SCREENS"].map(item => (
                  <div key={item} className="p-4 border border-white/10 rounded-2xl font-mono text-[9px] font-black uppercase tracking-[2px]">{item}</div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && projectData && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <div className="glass p-12 rounded-[50px] border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-brand-blue/5"><Check size={160} /></div>
                  <div className="flex items-center gap-8 mb-12">
                    <img src={projectData.logo} alt="Logo" className="w-24 h-24 rounded-3xl shadow-2xl border border-white/10" />
                    <div>
                      <h3 className="text-4xl font-extrabold text-white tracking-tighter mb-2">{projectData.title}</h3>
                      <p className="text-brand-blue font-mono text-[10px] font-black uppercase tracking-[3px] flex items-center gap-2">
                        <Check size={12} strokeWidth={4} /> AUTO-FETCHED FROM APP STORE
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">Açıklama (Otomatik Çekildi)</label>
                      <textarea 
                        defaultValue={projectData.description}
                        className="w-full bg-white/5 border border-white/5 rounded-[32px] py-6 px-8 text-sm text-gray-400 focus:outline-none focus:border-brand-blue/40 transition-all font-medium h-40"
                      />
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] ml-2">Ekran Görüntüsü URL (Opsiyonel)</label>
                      <input 
                        type="text"
                        value={screenshotUrl}
                        onChange={(e) => setScreenshotUrl(e.target.value)}
                        placeholder="https://imgur.com/your-screenshot.png"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass p-10 rounded-[40px] border-white/5">
                  <h4 className="text-sm font-mono font-black text-gray-500 uppercase tracking-[3px] mb-8">Mağaza İstatistikleri</h4>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { icon: <Download size={18} />, label: "İNDİRMELER", val: projectData.downloads },
                      { icon: <Star size={18} />, label: "PUANLAMA", val: projectData.rating },
                      { icon: <Cpu size={18} />, label: "KATEGORİ", val: projectData.type }
                    ].map((stat, i) => (
                      <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <div className="text-brand-blue mb-2">{stat.icon}</div>
                        <p className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-[2px] mb-1">{stat.label}</p>
                        <p className="text-xl font-mono font-black text-white">{stat.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Revenue Verification Card */}
                <div className={`glass p-10 rounded-[50px] border-2 transition-all ${isVerified ? 'border-green-500/30 bg-green-500/5' : 'border-brand-blue/20 bg-brand-blue/5'}`}>
                   <div className="text-center mb-8">
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${isVerified ? 'bg-green-500 text-white' : 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20'}`}>
                        {isVerified ? <ShieldCheck size={32} /> : <DollarSign size={32} />}
                      </div>
                      <h4 className="text-xl font-extrabold text-white uppercase tracking-tight mb-2">MMR Doğrulama</h4>
                      <p className="text-gray-500 text-xs font-bold leading-relaxed">RevenueCat veya Stripe bağlayarak gelirinizi 100% doğrulayın.</p>
                   </div>
                   
                   {!isVerified ? (
                     <button 
                      onClick={verifyRevenue}
                      className="w-full py-5 bg-white text-black font-black rounded-full hover:bg-brand-blue hover:text-white transition-all uppercase tracking-widest text-[10px] active:scale-95"
                     >
                       REVENUECAT BAĞLA
                     </button>
                   ) : (
                     <div className="space-y-4">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex justify-between items-center">
                           <span className="text-[10px] font-black text-green-500 uppercase tracking-[2px]">VERIFIED MMR</span>
                           <span className="font-mono font-black text-white">$4,250</span>
                        </div>
                        <p className="text-[9px] text-center text-green-500 font-bold uppercase tracking-widest leading-relaxed">
                          ✅ VERİ KAYNAĞINDAN (REVENUECAT) DOĞRULANDI
                        </p>
                     </div>
                   )}
                </div>

                <button 
                  onClick={publishProject}
                  disabled={isFetching}
                  className="w-full py-6 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_50px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[4px] text-[11px] active:scale-95 disabled:opacity-50"
                >
                  {isFetching ? "YAYINLANIYOR..." : "İLANI YAYINLA"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-green-500/10 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <Check size={64} strokeWidth={4} />
              </div>
              <h2 className="text-5xl font-extrabold text-white tracking-tighter mb-6 leading-tight">İlanınız <span className="text-green-500 italic">Doğrulanmış</span> Olarak Yayında!</h2>
              <p className="text-gray-500 text-xl font-bold mb-12 max-w-2xl mx-auto italic">Projeniz Apple Store ve RevenueCat verileriyle mühürlendi. Yatırımcıların ilgisi %400 daha yüksek olacak.</p>
              
              <div className="flex gap-6 justify-center">
                <Link href="/explore" className="px-10 py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_40px_rgba(0,112,255,0.4)] transition-all uppercase tracking-widest text-[11px]">
                  PAZAR YERİNDE GÖR
                </Link>
                <button className="px-10 py-5 glass text-white font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-[11px]">
                  DASHBOARD'A DÖN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}
