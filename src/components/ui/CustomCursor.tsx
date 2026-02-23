"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  
  // High-performance motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for that "luxury" lag
  const springConfig = { damping: 25, stiffness: 250 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('button, a, input, [role="button"]');
      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* The Trailing Ring (Takip Eden Halka) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-brand-blue/40 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 2 : 1,
          borderColor: isHovered ? "rgba(0, 112, 255, 0.8)" : "rgba(0, 112, 255, 0.4)",
          backgroundColor: isHovered ? "rgba(0, 112, 255, 0.05)" : "transparent",
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 300, damping: 20 },
          borderColor: { duration: 0.2 }
        }}
      />

      {/* Subtle Glow Pulse (Hafif Işık Hüzmesi) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-blue rounded-full pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHovered ? 0.8 : 0.4,
        }}
      />
    </>
  );
}
