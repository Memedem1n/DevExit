"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, LayoutDashboard, MessageCircle, Zap } from "lucide-react";
import { NAVIGATION_TABS } from "@/lib/router";

const iconMap: { [key: string]: any } = {
  Home,
  Compass,
  LayoutDashboard,
  MessageCircle,
  Zap,
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl">
      <div className="glass rounded-[40px] px-8 py-4 flex items-center justify-between border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {NAVIGATION_TABS.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = iconMap[tab.icon];

          return (
            <Link key={tab.path} href={tab.path} className="relative group p-3">
              <div className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-brand-blue scale-110' : 'text-gray-500 hover:text-white'}`}>
                <Icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-mono font-black uppercase tracking-[1px] ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {tab.label}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="navIndicator" 
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-blue rounded-full shadow-[0_0_15px_rgba(0,112,255,1)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
