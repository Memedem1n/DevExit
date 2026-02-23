"use client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { Check, Flame, Zap, ShieldCheck, Star, Rocket, Gem, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

const POWER_UPS = [
  { 
    name: "FREE CORE", 
    price: "0", 
    icon: <Rocket size={24} className="text-gray-400" />,
    desc: "Herkes için temel marketplace özellikleri.",
    features: ["İstediğiniz Kadar Proje Listeleme", "Yatırımcılarla Sınırsız Mesajlaşma", "Temel Proje Analitiği", "Güvenli Escrow Altyapısı"],
    color: "gray-500",
    button: "ŞİMDİ ÜCRETSİZ BAŞLA",
    popular: false,
    type: "Always Free"
  },
  { 
    name: "LAUNCH BOOST", 
    price: "4.99", 
    icon: <Zap size={24} className="text-brand-blue" />,
    desc: "Tek seferlik ödeme ile ilanı canlandırın.",
    features: ["7 Gün Öne Çıkan Listeleme", "🔥 HOT Listing Rozeti", "Anlık Yatırımcı Bildirimi", "Marketplace'te 2x Görünürlük"],
    color: "brand-blue",
    button: "PROJENİ GÜÇLENDİR",
    popular: true,
    type: "Single Project"
  },
  { 
    name: "ELITE VERIFIED", 
    price: "49.00", 
    icon: <Gem size={24} className="text-brand-cyan" />,
    desc: "Hızlı ve yüksek değerli exit için güven inşası.",
    features: ["Kod & Gelir Doğrulama Rozeti", "30 Gün Ana Sayfa Vitrini", "Elite Yatırımcı Ağına Özel Tanıtım", "Hukuki Devir & Sözleşme Desteği"],
    color: "brand-cyan",
    button: "ELITE ÜYE OL",
    popular: false,
    type: "Premium Service"
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-[3px] mb-8 border border-white/5"
          >
            🛰️ NO SUBSCRIPTIONS. NO HIDDEN FEES.
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9] text-white">
            FREE FOR ALL. <br />
            <span className="text-gradient italic">BOOSTS FOR SUCCESS.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-semibold">
            DevExit'te ilan vermek, alıcılarla görüşmek ve süreci yönetmek her zaman ücretsizdir. 
            Süreci hızlandırmak isteyenler için <span className="text-white">opsiyonel güçlendiriciler</span> sunuyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative z-10">
          {POWER_UPS.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-12 rounded-[50px] relative flex flex-col h-full border border-white/5 ${tier.popular ? 'border-brand-blue/30 shadow-[0_0_50px_rgba(0,112,255,0.15)] scale-105 z-10 bg-white/[0.02]' : ''}`}
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="p-4 bg-white/5 rounded-3xl border border-white/5">
                  {tier.icon}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">{tier.type}</p>
                  <div className="text-4xl font-mono font-black text-white flex items-center justify-end gap-1">
                    <span className="text-sm text-brand-blue font-bold">$</span>
                    {tier.price}
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-extrabold mb-2 text-white uppercase tracking-tight">{tier.name}</h4>
              <p className="text-sm text-gray-500 mb-10 leading-relaxed font-semibold">{tier.desc}</p>

              <div className="space-y-4 mb-16 flex-1">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-[13px] text-gray-400 font-bold group/item">
                    <div className="w-5 h-5 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 border border-brand-blue/20">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button className={`w-full py-6 rounded-[24px] font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 ${
                tier.popular 
                ? 'bg-brand-blue text-white shadow-[0_10px_30px_rgba(0,112,255,0.3)] hover:shadow-[0_10px_40px_rgba(0,112,255,0.5)]' 
                : 'bg-white/5 text-white hover:bg-white/10'
              }`}>
                {tier.button}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Philosophy Message */}
        <div className="glass p-16 rounded-[60px] max-w-5xl mx-auto border-brand-blue/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-blue/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-20 h-20 bg-brand-blue/20 rounded-[32px] flex items-center justify-center text-brand-blue shrink-0 shadow-2xl">
              <Globe size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold mb-4 text-white">Bizim Misyonumuz: <span className="text-brand-blue italic">Exit'i Kolaylaştırmak.</span></h3>
              <p className="text-gray-500 text-lg leading-relaxed font-semibold">
                Sizin başarınız platformun başarısıdır. Bu yüzden çekirdek özellikleri her zaman ücretsiz tutuyoruz. 
                Premium seçenekler sadece süreci hızlandırmak isteyenler için profesyonel araçlardır.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
