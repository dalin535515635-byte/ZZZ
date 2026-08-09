import React from 'react';
import { motion } from 'motion/react';

const Crosshair = ({ className }: { className?: string }) => (
  <div className={`relative w-4 h-4 ${className}`}>
    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10 -translate-x-1/2" />
  </div>
);

const GlobalDecor: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Global Mesh Gradient Glows */}
      <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vh] bg-brand-orange/[0.03] blur-[150px] rounded-full" />
      <div className="absolute bottom-[20%] left-[-10%] w-[70vw] h-[70vh] bg-brand-orange/[0.04] blur-[180px] rounded-full" />

      {/* Glares & Ambient Overlay Shaders (no white grid) */}

      {/* Large X Mark Decorations */}
      <div className="absolute top-20 left-12 opacity-[0.05]">
        <Crosshair />
      </div>
      <div className="absolute top-1/3 right-24 opacity-[0.05]">
        <Crosshair />
      </div>
      <div className="absolute bottom-40 left-1/4 opacity-[0.05]">
        <Crosshair />
      </div>
      <div className="absolute top-2/3 right-1/3 opacity-[0.05]">
        <Crosshair />
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-[15%] w-[1px] h-full bg-white/[0.02]" />
      <div className="absolute top-0 right-[15%] w-[1px] h-full bg-white/[0.02]" />
      
      {/* Moving Decorative Elements (Subtle) */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: '100vh' }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute left-[5%] w-[1px] h-20 bg-gradient-to-b from-transparent via-brand-orange/10 to-transparent"
      />
      
      <motion.div 
        initial={{ y: '100vh' }}
        animate={{ y: -100 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-[5%] w-[1px] h-32 bg-gradient-to-t from-transparent via-brand-orange/10 to-transparent"
      />

      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/[0.05]" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/[0.05]" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/[0.05]" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/[0.05]" />

      {/* Floating Info Text */}
      <div className="absolute bottom-[20%] left-4 [writing-mode:vertical-lr] rotate-180 opacity-[0.2] text-[6px] font-mono tracking-[0.5em] uppercase text-white">
        rendering_engine_active // 0x4f2a9
      </div>
      
      <div className="absolute top-[30%] right-4 [writing-mode:vertical-lr] opacity-[0.2] text-[6px] font-mono tracking-[0.5em] uppercase text-white">
        zz_studio_creative_archives // 2026
      </div>

      {/* Edge Accents */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-[0.1] text-white">
        <div className="w-12 h-[1px] bg-white" />
        <div className="text-[8px] font-mono tracking-widest uppercase">system_v2.0</div>
        <div className="w-12 h-[1px] bg-white" />
      </div>
    </div>
  );
};

export default GlobalDecor;
