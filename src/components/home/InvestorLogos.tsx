"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const INVESTORS = [
  { name: "SEQUOIA", region: "GLOBAL", url: "https://www.sequoiacap.com" },
  { name: "REVO CAPITAL", region: "TURKEY", url: "https://revo.vc" },
  { name: "A16Z", region: "GLOBAL", url: "https://a16z.com" },
  { name: "212", region: "TURKEY", url: "https://212.vc" },
  { name: "SOFTBANK", region: "GLOBAL", url: "https://group.softbank" },
  { name: "EARLYBIRD", region: "EMEA", url: "https://earlybird.com" },
  { name: "Y COMBINATOR", region: "GLOBAL", url: "https://ycombinator.com" },
  { name: "COLLECTIVE SPARK", region: "TURKEY", url: "https://collectivespark.com" },
  { name: "TIGER GLOBAL", region: "GLOBAL", url: "https://tigerglobal.com" },
  { name: "500 GLOBAL", region: "GLOBAL", url: "https://500.co" },
];

export default function InvestorLogos() {
  return (
    <section className="py-24 border-t border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-mono font-bold uppercase tracking-[2px] mb-4 border border-brand-blue/20">
          GLOBAL INVESTOR NETWORK
        </div>
        <h2 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-[4px]">
          TRUSTED BY THE WORLD'S LEADING VENTURE CAPITAL & STRATEGIC ACQUIRERS
        </h2>
      </div>

      <div className="flex overflow-hidden group hover:pause-animation">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center whitespace-nowrap px-10"
        >
          {[...INVESTORS, ...INVESTORS].map((investor, i) => (
            <Link 
              key={i} 
              href={investor.url} 
              target="_blank"
              className="flex flex-col items-center group/logo relative"
            >
              <div className="flex items-center gap-2 text-2xl md:text-3xl font-black text-white/20 group-hover/logo:text-brand-blue transition-colors tracking-tighter cursor-pointer">
                {investor.name}
                <ExternalLink size={12} className="opacity-0 group-hover/logo:opacity-100 transition-opacity -mt-4" />
              </div>
              <span className="text-[8px] font-mono font-bold text-gray-700 tracking-[3px] mt-1 group-hover/logo:text-brand-blue/50">
                {investor.region}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
