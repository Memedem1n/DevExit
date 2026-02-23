"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { 
  User, ShieldCheck, Globe, Zap, ArrowUpRight, 
  TrendingUp, DollarSign, Calendar, MessageSquare,
  Settings, CheckCircle, Award
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
          setEditName(data.name || "");
          setEditAvatar(data.avatar || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName, avatar: editAvatar }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const generateNewAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>;

  if (!profile) return <div className="min-h-screen bg-background flex items-center justify-center text-white font-mono uppercase tracking-[4px]">404 | PROFILE NOT FOUND</div>;

  const isMe = currentUser?.id === profile.id;

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Profile Header */}
        <div className="glass p-12 rounded-[60px] border-white/5 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><User size={200} /></div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[50px] border-4 border-brand-blue/30 p-1.5 shadow-2xl transition-transform group-hover:scale-105 duration-500 overflow-hidden bg-background">
                <img src={isEditing ? editAvatar : profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} className="w-full h-full rounded-[40px] object-cover" />
                {isEditing && (
                  <button 
                    onClick={generateNewAvatar}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-mono font-black uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Zap size={24} className="text-brand-blue" /> Change Avatar
                  </button>
                )}
              </div>
              {!isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-brand-blue p-3 rounded-2xl border-4 border-background shadow-xl">
                   <ShieldCheck size={20} className="text-white" />
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-mono font-black uppercase tracking-[2px] border border-brand-blue/20">
                  {profile.currentRole}
                </span>
                {profile.badges?.map((badge: any) => (
                  <span key={badge.id} className={`px-4 py-1.5 bg-white/5 ${badge.color} rounded-full text-[10px] font-mono font-black uppercase tracking-[2px] border border-white/5 flex items-center gap-2 shadow-xl`}>
                    {badge.id === 'elite' && <Award size={12} />}
                    {badge.id === 'verified_buyer' && <ShieldCheck size={12} />}
                    {badge.id === 'pro_builder' && <Zap size={12} />}
                    {badge.id === 'pioneer' && <Star size={12} />}
                    {badge.label}
                  </span>
                ))}
              </div>
              
              {isEditing ? (
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter mb-4 uppercase bg-white/5 border border-brand-blue/30 rounded-3xl px-6 w-full outline-none focus:border-brand-blue transition-all"
                />
              ) : (
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4 uppercase leading-[0.9]">
                  {profile.name}
                </h1>
              )}
              
              <p className="text-gray-500 font-bold text-lg max-w-2xl">
                Independent Software Builder and Strategic Investor. Focused on high-yield SaaS assets and sustainable AI tools.
              </p>
            </div>

            <div className="flex flex-col gap-4 min-w-[200px]">
               {isMe ? (
                 isEditing ? (
                   <>
                    <button 
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="px-8 py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_40px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isUpdating ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="text-[10px] font-mono font-black text-gray-600 hover:text-white uppercase tracking-[3px]">Cancel</button>
                   </>
                 ) : (
                   <button 
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-5 glass text-white font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-[3px] text-[10px] flex items-center justify-center gap-3"
                   >
                     <Settings size={14} /> EDIT PROFILE
                   </button>
                 )
               ) : (
                 <button className="px-8 py-5 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_40px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] flex items-center justify-center gap-3">
                   <MessageSquare size={14} /> CONTACT DIRECTLY
                 </button>
               )}
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { label: "PUBLISHED ASSETS", val: profile.projects?.length || 0, icon: <Zap size={14} /> },
               { label: "VERIFIED EXITS", val: "0", icon: <CheckCircle size={14} /> },
               { label: "AVG. MMR", val: "$1,200", icon: <TrendingUp size={14} /> },
               { label: "JOINED", val: new Date(profile.createdAt).getFullYear(), icon: <Calendar size={14} /> },
             ].map((stat, i) => (
               <div key={i} className="text-center md:text-left group">
                 <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-brand-blue">
                   {stat.icon}
                   <p className="text-[10px] font-mono font-black uppercase tracking-[2px] text-gray-600">{stat.label}</p>
                 </div>
                 <h3 className="text-3xl font-mono font-black text-white group-hover:text-brand-blue transition-colors">{stat.val}</h3>
               </div>
             ))}
          </div>
        </div>

        {/* User's Projects */}
        <div className="space-y-12">
           <div className="flex items-end justify-between px-4">
              <div>
                <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase mb-2">ACTIVE <span className="text-brand-blue italic">LISTINGS</span></h2>
                <p className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-[3px]">Official Assets Verified by DevExit</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {profile.projects?.map((project: any, i: number) => (
               <Link key={project.id} href={`/project/${project.slug}`}>
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass p-8 rounded-[40px] group hover:border-brand-blue/30 transition-all border-white/5"
                 >
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-brand-blue/10 transition-colors">
                        <Zap className="text-brand-blue" size={20} />
                      </div>
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">{project.type}</span>
                   </div>
                   <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-4 group-hover:text-brand-blue transition-colors">
                     {project.title}
                   </h3>
                   <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[8px] font-mono font-black text-gray-600 uppercase tracking-widest mb-1">VALUATION</p>
                        <p className="text-lg font-mono font-black text-white">${project.price.toLocaleString()}</p>
                      </div>
                      <ArrowUpRight size={20} className="text-gray-700 group-hover:text-brand-blue group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                   </div>
                 </motion.div>
               </Link>
             ))}
           </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
