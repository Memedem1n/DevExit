"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, ShieldCheck, Send, CheckCircle, 
  MessageSquare, Users, Eye, Paperclip, Search,
  ChevronLeft, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ndaSigned, setNdaSigned] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConversations = async (isSilent = false) => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (res.ok) {
        const groups: any = {};
        data.forEach((msg: any) => {
          const partner = msg.senderId === user?.id ? msg.receiver : msg.sender;
          if (!groups[partner.id]) {
            groups[partner.id] = {
              partner,
              lastMessage: msg.content,
              time: msg.createdAt,
              messages: []
            };
          }
          groups[partner.id].messages.push(msg);
        });
        const list = Object.values(groups);
        setConversations(list);
        
        if (activeChat) {
          const updatedActive = list.find((c: any) => c.partner.id === activeChat.partner.id);
          if (updatedActive && updatedActive.messages.length !== activeChat.messages.length) {
            setActiveChat(updatedActive);
          }
        } else if (list.length > 0 && !isSilent) {
          setActiveChat(list[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
      const interval = setInterval(() => fetchConversations(true), 3000);
      return () => clearInterval(interval);
    }
  }, [user, activeChat?.partner.id, activeChat?.messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  const simulateFileUpload = async (file: File) => {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const sendMessage = async () => {
    if (!input && !selectedFile || !activeChat) return;
    
    let fileUrl = "";
    let fileType = "";

    if (selectedFile) {
      fileUrl = await simulateFileUpload(selectedFile);
      fileType = selectedFile.type.includes("image") ? "IMAGE" : "DOC";
    }

    const optimisticMsg = {
      id: Date.now().toString(),
      content: input || (fileType === 'IMAGE' ? "Sent an image" : "Sent a document"),
      fileUrl,
      fileType,
      senderId: user?.id,
      createdAt: new Date().toISOString()
    };
    
    setActiveChat({
      ...activeChat,
      messages: [optimisticMsg, ...activeChat.messages]
    });
    setInput("");
    setSelectedFile(null);

    try {
      await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          content: optimisticMsg.content,
          receiverId: activeChat.partner.id,
          projectId: activeChat.messages[0]?.projectId,
          fileUrl,
          fileType
        }),
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-sans flex flex-col">
      <DynamicBackground />
      <Navbar />

      <section className="pt-32 pb-12 px-6 max-w-7xl mx-auto flex-1 w-full h-full flex flex-col md:flex-row gap-8">
        
        {/* Chat List (Sidebar) */}
        <div className="w-full md:w-80 glass rounded-[40px] border-white/5 p-6 flex flex-col h-[75vh]">
           <div className="mb-8 px-2">
             <h2 className="text-xl font-extrabold text-white uppercase tracking-tight mb-4">INBOX</h2>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search assets or buyers..." 
                 className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-blue/40 transition-all font-medium"
               />
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
             </div>
           </div>

           <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
             {isLoading ? (
               [1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-3xl animate-pulse" />)
             ) : (
               conversations.map((chat) => (
                 <button 
                   key={chat.partner.id}
                   onClick={() => setActiveChat(chat)}
                   className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all ${activeChat?.partner.id === chat.partner.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'hover:bg-white/5 text-gray-400'}`}
                 >
                   <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0">
                     <img src={chat.partner.avatar} alt="avatar" />
                   </div>
                   <div className="text-left flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-1">
                       <p className="text-xs font-black truncate">{chat.partner.name}</p>
                       <span className="text-[8px] opacity-70 font-mono">{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <p className="text-[10px] truncate opacity-80 font-medium">{chat.lastMessage}</p>
                   </div>
                 </button>
               ))
             )}
           </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 glass rounded-[40px] border-white/5 relative overflow-hidden flex flex-col h-[75vh]">
           {activeChat ? (
             <>
               {/* Header */}
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full border border-brand-blue/30 p-1">
                     <img src={activeChat.partner.avatar} className="w-full h-full rounded-full" />
                   </div>
                   <div>
                     <h3 className="text-lg font-extrabold text-white uppercase tracking-tight">{activeChat.partner.name}</h3>
                     <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">ENCRYPTED CHANNEL</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-full text-[9px] font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 border border-brand-blue/20">
                   <ShieldCheck size={12} /> SECURE ESCROW READY
                 </div>
               </div>

               {/* Messages Container */}
               <div 
                 ref={scrollRef}
                 className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar flex flex-col-reverse"
               >
                 {activeChat.messages.map((msg: any) => (
                   <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[70%] p-5 rounded-[24px] text-sm font-medium leading-relaxed ${
                       msg.senderId === user?.id 
                       ? 'bg-brand-blue text-white rounded-tr-sm shadow-lg shadow-brand-blue/10' 
                       : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                     }`}>
                       {msg.fileUrl && (
                         <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                           {msg.fileType === 'IMAGE' ? (
                             <img src={msg.fileUrl} alt="attachment" className="w-full object-cover max-h-60" />
                           ) : (
                             <div className="p-4 bg-white/5 flex items-center gap-3">
                               <Paperclip size={16} />
                               <span className="text-[10px] uppercase font-mono font-black">Document Attachment</span>
                               <ArrowUpRight size={14} className="ml-auto" />
                             </div>
                           )}
                         </div>
                       )}
                       {msg.content}
                       <div className={`text-[9px] font-mono mt-2 opacity-60 flex justify-end tracking-wider ${msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Input Area */}
               <div className="p-6 bg-white/[0.02] border-t border-white/5">
                 {selectedFile && (
                   <div className="px-6 py-3 mb-4 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Paperclip size={14} className="text-brand-blue" />
                        <span className="text-[10px] font-mono font-black text-white uppercase truncate max-w-[200px]">{selectedFile.name}</span>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Remove</button>
                   </div>
                 )}
                 <div className="flex gap-4 items-center bg-white/5 p-2 pr-2 pl-6 rounded-full border border-white/5 focus-within:border-brand-blue/40 transition-colors shadow-inner">
                   <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept="image/*,.pdf,.doc,.docx"
                   />
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`transition-colors ${selectedFile ? 'text-brand-blue' : 'text-gray-500 hover:text-white'}`}
                   >
                    <Paperclip size={18} />
                   </button>
                   <input 
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                     placeholder="Type your secure message..." 
                     className="flex-1 bg-transparent border-none outline-none text-sm text-white py-3 font-medium placeholder:text-gray-600"
                   />
                   <button 
                     onClick={sendMessage}
                     disabled={!input && !selectedFile}
                     className="p-3 bg-brand-blue text-white rounded-full hover:shadow-[0_0_20px_rgba(0,112,255,0.4)] transition-all active:scale-90 disabled:opacity-50"
                   >
                     <Send size={16} />
                   </button>
                 </div>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center text-gray-700 mb-6 border border-white/5">
                   <MessageSquare size={40} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Select a Conversation</h3>
                <p className="text-gray-600 text-xs font-mono uppercase tracking-[2px]">Your secure data exchange starts here.</p>
             </div>
           )}
        </div>

      </section>

      <Footer />
    </main>
  );
}
