"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, DollarSign, TrendingUp, Tag, Globe } from "lucide-center";
import Link from "next/link";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (res.ok) {
          // Sort by MMR and take top 6
          const sorted = data.sort((a: any, b: any) => b.mmr - a.mmr).slice(0, 6);
          setProjects(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch featured projects", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-mono font-bold uppercase tracking-[2px] mb-4 border border-brand-blue/20">
            <Globe size={10} /> LIVE MARKETPLACE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
            PREMIUM <span className="text-brand-blue">ASSET</span> SHOWCASE
          </h2>
        </div>
        <Link href="/explore" className="text-[10px] font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 hover:text-brand-blue transition-colors group">
          VIEW ALL ASSETS <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
           [1,2,3].map(i => (
             <div key={i} className="glass p-10 rounded-[40px] h-[400px] animate-pulse bg-white/5 border-white/5" />
           ))
        ) : (
          projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[40px] group hover:border-brand-blue/40 transition-all cursor-pointer relative flex flex-col h-full bg-white/[0.01]"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-brand-blue/10 transition-colors border border-white/5">
                  <Tag className="text-brand-blue" size={20} />
                </div>
                <div className="text-right">
                  <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest border border-white/5">
                    {project.type}
                  </span>
                  {project.mmr > 2000 && (
                    <div className="mt-2 text-[9px] font-mono text-green-400 font-bold uppercase flex items-center justify-end gap-1">
                      <TrendingUp size={10} /> HIGH REVENUE
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold mb-4 group-hover:text-brand-blue transition-colors tracking-tight text-white uppercase">
                {project.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-8 flex-1">
                {project.techStack.split(',').map((s: string) => (
                  <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-mono uppercase font-bold text-gray-500 border border-white/5">
                    {s.trim()}
                  </span>
                ))}
              </div>

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
                  <p className="text-[9px] text-gray-600 uppercase font-mono font-bold mb-2 tracking-[1px]">EXIT PRICE</p>
                  <div className="text-xl font-mono font-black text-white">
                    ${project.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-brand-blue font-mono font-bold text-[9px] uppercase tracking-[2px]">
                ANALYZE ASSET <ArrowUpRight size={12} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
