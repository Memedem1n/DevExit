"use client";
import Link from "next/link";
import { Twitter, Linkedin, Github, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-32 pb-12 px-6 border-t border-white/5 bg-background relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand-teal p-1.5 rounded-lg">
              <Zap className="text-black w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tighter italic">DEVEXIT</span>
          </Link>
          <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
            Geliştiricilerin emeğini değere, yatırımcıların kapitalini geleceğe dönüştüren 
            modern dijital varlık pazaryeri. Türkiye'den globale açılan güvenli çıkış kapınız.
          </p>
          <div className="flex gap-4">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a key={i} href="#" className="p-2 glass rounded-full hover:text-brand-teal transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase text-xs tracking-widest">Platform</h4>
          <nav className="flex flex-col gap-2 text-gray-500 text-sm font-medium">
            <Link href="/explore" className="hover:text-brand-blue transition-colors">Marketplace</Link>
            <Link href="/pricing" className="hover:text-brand-blue transition-colors">Elite Boosts</Link>
            <Link href="/login" className="hover:text-brand-blue transition-colors">Yatırımcı Girişi</Link>
            <Link href="/register" className="hover:text-brand-blue transition-colors">Geliştirici Kaydı</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase text-xs tracking-widest">Kurumsal</h4>
          <nav className="flex flex-col gap-2 text-gray-500 text-sm font-medium">
            <Link href="#" className="hover:text-brand-teal transition-colors">Hakkımızda</Link>
            <Link href="#" className="hover:text-brand-teal transition-colors">Güvenlik & Escrow</Link>
            <Link href="#" className="hover:text-brand-teal transition-colors">Kullanım Şartları</Link>
            <Link href="#" className="hover:text-brand-teal transition-colors">İletişim</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-gray-600 text-[10px] uppercase font-bold tracking-widest">
        <p>© 2026 DevExit Global Inc. Built with Passion in Istanbul.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white transition-colors text-[10px]">Gizlilik Politikası</Link>
          <Link href="#" className="hover:text-white transition-colors text-[10px]">Çerez Ayarları</Link>
        </div>
      </div>
    </footer>
  );
}
