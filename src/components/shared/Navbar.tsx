"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Compass, LayoutDashboard, MessageCircle, 
  Bell, User, LogOut, ShieldCheck, Repeat, 
  PlusCircle, Heart, LineChart, ChevronDown, Settings
} from "lucide-react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { AppRouter } from "@/lib/router";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout, switchRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    const fetchNotifs = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (res.ok) setNotifications(data);
      } catch (err) {}
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    if (isLoggedIn) fetchNotifs();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoggedIn]);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTabs = () => {
    const common = [
      { label: "Marketplace", path: AppRouter.EXPLORE, icon: Compass },
      { label: "Success Stories", path: "#", icon: ShieldCheck },
    ];
    
    if (!isLoggedIn) return common;
    
    return [
      { label: "Marketplace", path: AppRouter.EXPLORE, icon: Compass },
      { label: user?.currentRole === 'DEVELOPER' ? "Command Center" : "Portfolio Hub", path: AppRouter.DASHBOARD, icon: LayoutDashboard },
      { label: "Messages", path: AppRouter.CHAT, icon: MessageCircle },
    ];
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 py-6 transition-all duration-500`}>
      <div className={`max-w-7xl mx-auto backdrop-blur-3xl rounded-full px-8 py-3 flex items-center justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all ${isScrolled ? 'bg-black/70 scale-[0.98]' : 'bg-white/[0.03]'}`}>
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <div className="p-1 rounded-lg group-hover:scale-110 transition-transform">
            <img 
              src="/logo.png" 
              alt="DevExit Logo" 
              className="w-[58px] h-[58px] object-contain" 
              style={{ filter: 'drop-shadow(0 2px 2px rgba(51, 51, 51, 0.3))' }}
            />
          </div>
          <span className="text-xl font-black italic tracking-tighter text-white uppercase tracking-[2px] hidden md:block -ml-1">DEVEXIT</span>
        </Link>

        {/* NAVIGATION TABS */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 relative">
          {getTabs().map((tab) => {
            const isActive = pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link key={tab.path} href={tab.path} className="relative py-2 px-5 group">
                <div className={`flex items-center gap-2 transition-all relative z-10 ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                  <Icon size={14} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-brand-blue" : ""} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[2px]">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-brand-blue/10 rounded-full -z-10 border border-brand-blue/20 shadow-[0_0_20px_rgba(0,112,255,0.1)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-4 shrink-0">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.div 
                key="guest"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-4"
              >
                <Link href="/login" className="text-[10px] font-mono font-black text-gray-500 hover:text-white uppercase tracking-[2px] transition-colors">Login</Link>
                <Link href="/register" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[2px] hover:bg-brand-blue hover:text-white hover:scale-105 transition-all shadow-xl active:scale-95 border border-white/10">Sign Up</Link>
              </motion.div>
            ) : (
              <div className="flex items-center gap-4">
                {/* NOTIFICATIONS */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-3 bg-white/5 border border-white/5 rounded-full hover:border-brand-blue/30 transition-all relative group"
                  >
                    <Bell size={18} className={unreadCount > 0 ? "text-brand-blue" : "text-gray-500 group-hover:text-white"} />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 backdrop-blur-3xl bg-black/80 border border-white/10 rounded-[32px] p-2 shadow-2xl z-[110] overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                          <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-[2px]">Notifications</h4>
                          {unreadCount > 0 && (
                            <button onClick={() => markAsRead('all')} className="text-[8px] font-mono font-bold text-brand-blue uppercase tracking-widest hover:text-white">Mark all read</button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div 
                                key={n.id} 
                                onClick={() => markAsRead(n.id)}
                                className={`p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border-b border-white/[0.02] last:border-0 ${!n.isRead ? 'bg-brand-blue/[0.03]' : ''}`}
                              >
                                <div className="flex gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-brand-blue' : 'bg-transparent'}`} />
                                  <div>
                                    <p className={`text-[11px] leading-snug ${!n.isRead ? 'text-white font-bold' : 'text-gray-500'}`}>{n.message}</p>
                                    <span className="text-[8px] font-mono text-gray-600 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-10 text-center text-gray-600 text-[10px] font-mono uppercase tracking-widest">No notifications</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* USER MENU */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/5 hover:border-brand-blue/30 transition-all group relative overflow-hidden"
                  >
                    <div className="relative">
                      <img src={user?.avatar} className="w-8 h-8 rounded-full border border-brand-blue/30 p-0.5 group-hover:border-brand-blue transition-all" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-[10px] font-black text-white leading-none uppercase tracking-wider">{user?.name.split(' ')[0]}</p>
                      <p className="text-[7px] font-mono font-bold text-brand-blue uppercase tracking-widest mt-0.5">{user?.currentRole}</p>
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 backdrop-blur-3xl bg-black/80 border border-white/10 rounded-[24px] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[110]"
                      >
                        <div className="p-4 border-b border-white/5 mb-2">
                          <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px] mb-1">Signed in as</p>
                          <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                        </div>

                        <div className="space-y-1">
                          <Link href={AppRouter.DASHBOARD} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group">
                            <LayoutDashboard size={16} className="group-hover:text-brand-blue" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Dashboard</span>
                          </Link>
                          <button 
                            onClick={() => { switchRole(); setIsMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                          >
                            <Repeat size={16} className="text-brand-blue" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Switch Role</span>
                          </button>
                          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group">
                            <Settings size={16} className="group-hover:text-brand-blue" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Settings</span>
                          </Link>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5">
                          <button 
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all group"
                          >
                            <LogOut size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
