"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, SlidersHorizontal, ChevronDown, 
  Tag, DollarSign, TrendingUp, Globe, Filter,
  ArrowUpRight, Clock, ShieldCheck, Heart
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeFilter !== "All") params.append("type", activeFilter);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        params.append("sort", sortOption);

        const res = await fetch(`/api/projects?${params.toString()}`);
        const data = await res.json();
        if (res.ok) setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [activeFilter, sortOption, minPrice, maxPrice]);

  const filteredProjects = projects.filter(p => {
    const searchStr = (p.title + p.type + p.techStack).toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  const toggleWatchlist = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        body: JSON.stringify({ projectId }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // Refresh or update local state
        const data = await res.json();
        // Option: re-fetch or just update visually
        setProjects(projects.map(p => {
          if (p.id === projectId) {
            return { ...p, isWatchlisted: data.status === "ADDED" };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      <DynamicBackground />
      <Navbar />

      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-mono font-bold uppercase tracking-[2px] mb-4 border border-brand-blue/20">
              <Globe size={12} /> Live Asset Exchange
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
              EXPLORE <span className="text-gradient italic">ASSETS</span>
            </h1>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search tech, niche, or revenue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium"
              />
            </div>
            
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none px-8 py-4 glass rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-sm hover:bg-white/10 transition-all outline-none pr-12"
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="priceHigh">HIGHEST PRICE</option>
                <option value="mmrHigh">HIGHEST MMR</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all ${showFilters ? 'bg-brand-blue text-white' : 'glass text-white hover:bg-white/10'}`}
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="glass p-8 rounded-[40px] border-brand-blue/20 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[2px]">Price Range (USD)</p>
                    <div className="flex gap-4">
                       <input 
                        type="number" 
                        placeholder="Min Price" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-blue/40"
                       />
                       <input 
                        type="number" 
                        placeholder="Max Price" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-blue/40"
                       />
                    </div>
                 </div>
                 <div className="flex items-end gap-4">
                    <button 
                      onClick={() => { setMinPrice(""); setMaxPrice(""); setActiveFilter("All"); }}
                      className="flex-1 py-3 border border-white/5 rounded-2xl text-[10px] font-mono font-black text-gray-500 hover:text-white uppercase tracking-[2px]"
                    >
                      Reset All
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-8 mb-12">
          {["All", "SaaS", "Mobile", "Marketplace", "Tools"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[2px] transition-all whitespace-nowrap border ${
                activeFilter === tab 
                ? 'bg-brand-blue text-white border-brand-blue shadow-[0_0_20px_rgba(0,112,255,0.3)]' 
                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             [1,2,3,4,5,6].map(i => (
               <div key={i} className="glass p-8 rounded-[40px] animate-pulse h-[400px] border-white/5 bg-white/5" />
             ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass p-8 rounded-[40px] group hover:border-brand-blue/40 transition-all cursor-pointer relative flex flex-col h-full bg-white/[0.01]"
                >
                  <div className="absolute top-6 right-8 flex items-center gap-3">
                    <button 
                      onClick={(e) => toggleWatchlist(e, project.id)}
                      className={`p-2 rounded-full transition-all ${project.isWatchlisted ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                      <Heart size={16} fill={project.isWatchlisted ? "currentColor" : "none"} />
                    </button>
                    {project.isVerified && (
                      <div className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[8px] font-mono font-black uppercase tracking-[2px] flex items-center gap-1 border border-brand-blue/20">
                        <ShieldCheck size={10} /> VERIFIED
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <div className="p-3 w-fit bg-white/5 rounded-2xl group-hover:bg-brand-blue/10 transition-colors border border-white/5 mb-6">
                      <Tag className="text-brand-blue" size={20} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-2 group-hover:text-brand-blue transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest">{project.type}</span>
                      <span className="text-[9px] font-mono font-bold text-brand-blue uppercase tracking-widest">• Global Exit</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8 flex-1">
                    {project.techStack.split(',').map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-mono uppercase font-bold text-gray-500 border border-white/5">
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Financial Summary */}
                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-gray-600 uppercase font-mono font-bold mb-2 tracking-[1px]">MONTHLY MMR</p>
                      <div className="text-xl font-mono font-black text-white flex items-center">
                        <span className="text-brand-blue text-sm mr-1">$</span>
                        {project.mmr.toLocaleString()}
                        {project.growth && (
                          <span className="text-[9px] text-green-400 ml-2 font-mono">+{project.growth}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-600 uppercase font-mono font-bold mb-2 tracking-[1px]">VALUATION</p>
                      <div className="text-xl font-mono font-black text-white">
                        ${project.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-background bg-gray-800 flex items-center justify-center text-[8px] font-bold overflow-hidden">
                           <img src={project.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.user?.name}`} alt="avatar" />
                        </div>
                        <div className="text-[8px] text-gray-500 ml-4 self-center font-bold font-mono">{project.views} VIEWS</div>
                     </div>
                     <div className="flex items-center gap-2 text-brand-blue font-mono font-bold text-[9px] uppercase tracking-[2px]">
                      ANALYZE <ArrowUpRight size={12} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
