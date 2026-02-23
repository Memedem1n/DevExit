"use client";
import { motion } from "framer-motion";
import { Check, Flame, Star, Zap, ShieldCheck } from "lucide-react";

const PLANS = [
  { 
    name: "Standart Exit", 
    price: "0", 
    desc: "Bireysel geliştiriciler için temel listeleme.",
    features: ["4 Proje Listeleme", "Genel Chat Erişimi", "Arama Sonuçlarında Standart", "14 Gün Yayında Kalma"],
    color: "gray-500",
    isHot: false
  },
  { 
    name: "Elite Hot Exit", 
    price: "49", 
    desc: "Yatırımcıların %90'ı bu alanı kontrol eder.",
    features: ["Öncelikli Sıralama (🔥)", "Anasayfa HOT Section", "Doğrulanmış Geliştirici Rozeti", "Premium Escrow Erişimi", "Yatırımcı Bildirim Sistemi"],
    color: "brand-blue",
    isHot: true
  },
  { 
    name: "Enterprise", 
    price: "199", 
    desc: "Kurumsal çaplı projeler ve exit stratejileri.",
    features: ["Sınırsız Listeleme", "Özel Müzakere Odası", "Kod Denetim Raporu", "Yatırımcı Maçlama Algoritması", "Hukuki Destek & Devir"],
    color: "brand-cyan",
    isHot: false
  }
];

export default function Pricing() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4">
          <Zap size={12} fill="currentColor" /> Monetize Your Code
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
          Exit Yolculuğunu <span className="text-gradient">Hızlandır.</span>
        </h2>
        <p className="text-gray-500 text-lg">Projeni öne çıkar, doğru yatırımcıyla bugün tanış.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`glass p-10 rounded-[40px] border border-white/5 relative flex flex-col h-full ${plan.isHot ? 'hot-glow border-brand-blue/30 shadow-[0_0_40px_rgba(0,112,255,0.1)]' : ''}`}
          >
            {plan.isHot && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-lg shadow-brand-blue/20">
                <Flame size={12} fill="white" /> En Popüler Seçim
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-xl font-bold mb-2 text-white">{plan.name}</h4>
              <p className="text-sm text-gray-500">{plan.desc}</p>
            </div>

            <div className="mb-10 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">${plan.price}</span>
              <span className="text-gray-500 text-xs font-bold uppercase">/ Ay</span>
            </div>

            <div className="space-y-4 mb-12 flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                  <div className={`p-1 rounded-full bg-${plan.color}/10 text-${plan.color}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-2xl font-black transition-all active:scale-95 ${
              plan.isHot 
              ? 'bg-brand-blue text-white hover:shadow-[0_0_30px_rgba(0,112,255,0.4)]' 
              : 'bg-white/5 text-white hover:bg-white/10'
            }`}>
              HEMEN BAŞLA
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
