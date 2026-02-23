import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import { AuthWrapper } from "@/context/AuthWrapper";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevExit | Premier Developer Asset Marketplace",
  description: "Buy and sell high-quality software assets with elite escrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} dark`}>
      <body className="font-sans antialiased selection:bg-brand-blue selection:text-white bg-background overflow-x-hidden">
        <AuthWrapper>
          <CustomCursor />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
