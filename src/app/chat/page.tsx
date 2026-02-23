"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, ShieldCheck, Send, CheckCircle, 
  MessageSquare, Users, Eye, Paperclip, Search
} from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [ndaSigned, setNdaSigned] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Merhaba, Lumina AI projesiyle ilgileniyorum.", sender: "buyer", time: "10:30 AM" },
    { id: 2, text: "Selam! Tabii, hangi konuda detay istersiniz?", sender: "me", time: "10:35 AM" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { id: messages.length + 1, text: input, sender: "me", time: "Now" }]);
    setInput("");
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans flex flex-col">
      <DynamicBackground />
      <Navbar />

      <section className="pt-32 pb-12 px-6 max-w-7xl mx-auto flex-1 w-full h-full flex flex-col md:flex-row gap-8">
        
        {/* Chat List */}
        <div className="w-full md:w-80 glass rounded-[40px] border-white/5 p-6 flex flex-col h-[70vh]">
           <div className="mb-8 px-2">
             <h2 className="text-xl font-extrabold text-white uppercase tracking-tight mb-4">MESSAGES</h2>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search conversations..." 
                 className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium"
               />
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
             </div>
           </div>

           <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
             {[1, 2, 3].map((chat) => (
               <button 
                 key={chat}
                 onClick={() => setActiveChat(chat)}
                 className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all ${activeChat === chat ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'hover:bg-white/5 text-gray-400'}`}
               >
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                   INV
                 </div>
                 <div className="text-left flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                     <p className="text-xs font-black truncate">TechCapital LLC</p>
                     <span className="text-[9px] opacity-70">2m</span>
                   </div>
                   <p className="text-[10px] truncate opacity-80">Regarding the acquisition offer...</p>
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 glass rounded-[40px] border-white/5 relative overflow-hidden flex flex-col h-[70vh]">
           {/* Header */}
           <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center font-black text-sm text-white shadow-lg shadow-brand-blue/20">
                 TC
               </div>
               <div>
                 <h3 className="text-lg font-extrabold text-white uppercase tracking-tight">TechCapital LLC</h3>
                 <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">ONLINE</span>
                 </div>
               </div>
             </div>
             
             {ndaSigned ? (
               <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[9px] font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 border border-green-500/20">
                 <ShieldCheck size={12} /> NDA SIGNED & ACTIVE
               </div>
             ) : (
               <button onClick={() => setNdaSigned(true)} className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-full text-[9px] font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 border border-brand-blue/20 hover:bg-brand-blue/20 transition-all">
                 <Lock size={12} /> REQUEST NDA
               </button>
             )}
           </div>

           {/* NDA Overlay (If not signed) */}
           <AnimatePresence>
             {!ndaSigned && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 flex items-center justify-center p-8"
               >
                 <div className="glass p-10 rounded-[40px] max-w-md text-center border-brand-blue/30 shadow-[0_0_100px_rgba(0,112,255,0.2)]">
                   <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-brand-blue mx-auto mb-6 border border-brand-blue/20">
                     <Lock size={40} />
                   </div>
                   <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mb-4">Secure Communication</h3>
                   <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed">
                     To protect sensitive data (Revenue, Codebase), both parties must sign a digital Non-Disclosure Agreement (NDA).
                   </p>
                   <button 
                     onClick={() => setNdaSigned(true)}
                     className="w-full py-4 bg-brand-blue text-white font-black rounded-full hover:shadow-[0_0_30px_rgba(0,112,255,0.4)] transition-all uppercase tracking-[3px] text-[10px] active:scale-95"
                   >
                     SIGN NDA & UNLOCK CHAT
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[70%] p-5 rounded-[24px] text-sm font-medium leading-relaxed ${
                   msg.sender === 'me' 
                   ? 'bg-brand-blue text-white rounded-tr-sm shadow-lg shadow-brand-blue/10' 
                   : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                 }`}>
                   {msg.text}
                   <div className={`text-[9px] font-mono mt-2 opacity-60 flex justify-end tracking-wider ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                     {msg.time}
                   </div>
                 </div>
               </div>
             ))}
           </div>

           {/* Input Area */}
           <div className="p-6 bg-white/[0.02] border-t border-white/5">
             <div className="flex gap-4 items-center bg-white/5 p-2 pr-2 pl-6 rounded-full border border-white/5 focus-within:border-brand-blue/40 transition-colors">
               <button className="text-gray-500 hover:text-white transition-colors"><Paperclip size={18} /></button>
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                 placeholder="Type your message securely..." 
                 className="flex-1 bg-transparent border-none outline-none text-sm text-white py-3 font-medium placeholder:text-gray-600"
               />
               <button 
                 onClick={sendMessage}
                 className="p-3 bg-brand-blue text-white rounded-full hover:shadow-[0_0_20px_rgba(0,112,255,0.4)] transition-all active:scale-90"
               >
                 <Send size={16} />
               </button>
             </div>
           </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
