import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const FLUID_PATHS = {
  initial: "M0,0 C30,0 40,5 50,10 C60,15 70,20 80,20 L80,60 C70,60 60,65 50,70 C40,75 30,80 0,80 Z", // Normalized to 80x80 for simplicity or use 100x100
  // Simplified liquid shapes
  liquid1: "M0,0 C25,0 35,8 45,12 C55,16 65,22 80,20 L80,60 C65,62 55,68 45,72 C35,76 25,80 0,80 Z",
  liquid2: "M0,0 C35,0 45,3 55,8 C65,13 75,18 80,20 L80,60 C75,58 65,63 55,68 C45,73 35,78 0,80 Z",
};

// Full screen fluid transition path
const FULL_PATH = "M0,0 L100,0 L100,100 L0,100 Z";
const WAVE_PATH = "M0,0 C20,0 30,10 50,20 C70,30 80,40 100,0 L100,100 C80,100 70,90 50,80 C30,70 20,60 0,100 Z";

function GalleryItem({ img, isActive, title }: { img: string, isActive: boolean, title?: string }) {
  const is169 = title && [
    "CFH 科隆线下展",
    "无畏之夜 奖杯设计",
    "BW CF线下学院",
    "游戏视觉设计",
    "创意视觉设计",
    "3D IP设计",
    "场景建模"
  ].includes(title);
  
  const aspectClass = is169 ? "aspect-video" : "aspect-[1920/1281]";
  const fitClass = is169 ? "object-contain" : "object-cover";

  return (
    <div 
      className="min-w-full h-full flex items-center justify-center p-8 md:p-20"
    >
      <motion.div
        animate={{ 
          scale: isActive ? 1 : 0.8,
          opacity: isActive ? 1 : 0.4,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`relative w-full max-w-5xl ${aspectClass} rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/20 bg-black/20`}
      >
        <motion.img 
          src={img} 
          alt="Gallery Work" 
          className={`w-full h-full ${fitClass}`}
          animate={{
            scale: isActive ? 1 : 1.1
          }}
          transition={{ duration: 0.8 }}
        />
        {!isActive && (
          <div className="absolute inset-0 bg-black/40" />
        )}
      </motion.div>
    </div>
  );
}

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    };
  }
};

const lightboxVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : direction < 0 ? -1000 : 0,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -1000 : direction < 0 ? 1000 : 0,
    opacity: 0,
    scale: 0.95,
  })
};

function LoadedImage({ src, alt, className, layoutId, loading = "lazy" }: { src: string, alt: string, className?: string, layoutId?: string, loading?: "lazy" | "eager" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-white/[0.02]">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
        </div>
      )}
      <motion.img 
        layoutId={layoutId}
        src={src} 
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        initial={layoutId ? false : { opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      />
    </div>
  );
}

export default function ImageGalleryModal({ images, onClose, title }: { images: string[], onClose: () => void, title?: string }) {
  const isTiled = title === "穿越火线" || title === "穿越火线 X Bilibili World" || title === "和平精英" || title === "其他";
  const is169 = title && [
    "CFH 科隆线下展",
    "无畏之夜 奖杯设计",
    "BW CF线下学院",
    "游戏视觉设计",
    "创意视觉设计",
    "3D IP设计",
    "场景建模"
  ].includes(title);

  const aspectClass = is169 ? "aspect-video" : "aspect-[1920/1281]";
  const fitClass = is169 ? "object-contain" : "object-cover";

  const [[page, direction], setPage] = useState([0, 0]);
  const [lightboxState, setLightboxState] = useState<{ index: number | null, direction: number }>({ index: null, direction: 0 });
  const isScrolling = useRef(false);

  const currentIndex = ((page % images.length) + images.length) % images.length;
  const activeIndex = isTiled && lightboxState.index !== null ? lightboxState.index : currentIndex;

  const paginate = (newDirection: number) => {
    setPage(([prevPage, _]) => [prevPage + newDirection, newDirection]);
  };

  const next = () => paginate(1);
  const prev = () => paginate(-1);

  const handleClose = () => {
    if (lightboxState.index !== null) {
      setLightboxState({ ...lightboxState, index: null });
    } else {
      onClose();
    }
  };

  const navTiled = (dir: number) => {
    if (lightboxState.index === null) return;
    const nextIdx = (lightboxState.index + dir + images.length) % images.length;
    setLightboxState({ index: nextIdx, direction: dir });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxState.index !== null) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navTiled(1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navTiled(-1);
        if (e.key === 'Escape') setLightboxState({ ...lightboxState, index: null });
      } else {
        if (e.key === 'Escape') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState.index]);

  useEffect(() => {
    if (!isTiled || lightboxState.index === null) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;
      
      if (Math.abs(e.deltaY) > 30) {
        navTiled(e.deltaY > 0 ? 1 : -1);
        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 600); 
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [images.length, isTiled, lightboxState.index]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[102] flex items-center justify-center bg-black/95 overflow-hidden"
    >
      {/* Dynamic Fluid Background */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center blur-[80px] scale-110"
            style={{ backgroundImage: `url(${images[activeIndex]})` }}
          />
        </AnimatePresence>
        
        {/* Animated Fluid Blobs - Reduced count and complexity for performance */}
        <div className="absolute inset-0 overflow-hidden mix-blend-soft-light opacity-30">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                left: `${20 + i * 40}%`,
                top: `${30}%`,
              }}
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.1, 0.95, 1],
              }}
              transition={{
                duration: 20 + i * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
      </div>

      <button 
        onClick={handleClose} 
        className="absolute top-8 right-8 text-white z-[210] hover:scale-110 transition-transform bg-white/10 p-2 rounded-full backdrop-blur-md"
      >
        <X size={32} />
      </button>

      {isTiled ? (
        <div className="relative w-full h-full overflow-y-auto z-[105] no-scrollbar px-6 py-32 md:px-24">
          <div className="max-w-[1400px] mx-auto">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center mb-16"
            >
              <h2 className="text-brand-orange text-[10px] font-bold tracking-[0.6em] uppercase mb-4">
                - {title} GALLERY -
              </h2>
              <h3 className="text-3xl md:text-5xl font-display font-medium text-white">
                内部图片展示
              </h3>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02, borderColor: "rgba(242, 125, 38, 0.4)" }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: (i % 8) * 0.05,
                    scale: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  onClick={() => setLightboxState({ index: i, direction: 0 })}
                  className={`${aspectClass} bg-neutral-900 rounded-xl overflow-hidden border border-white/5 group cursor-pointer transition-colors`}
                >
                  <LoadedImage
                    layoutId={`img-${i}`}
                    src={img} 
                    alt={`Gallery ${i}`} 
                    className={`w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-105`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tiled Lightbox */}
          <AnimatePresence>
            {lightboxState.index !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxState({ ...lightboxState, index: null })}
                className="fixed inset-0 z-[200] bg-neutral-950/85 backdrop-blur-3xl flex items-center justify-center p-4 md:p-20 overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
                  `,
                  backgroundSize: "24px 24px",
                }}
              >
                {/* Navigation in Lightbox */}
                <button 
                  className="absolute left-4 md:left-10 text-white/40 hover:text-white z-[220] transition-all p-2 bg-white/5 rounded-full backdrop-blur-sm"
                  onClick={(e) => { e.stopPropagation(); navTiled(-1); }}
                >
                  <ChevronLeft size={48} />
                </button>
                <button 
                  className="absolute right-4 md:right-10 text-white/40 hover:text-white z-[220] transition-all p-2 bg-white/5 rounded-full backdrop-blur-sm"
                  onClick={(e) => { e.stopPropagation(); navTiled(1); }}
                >
                  <ChevronRight size={48} />
                </button>

                <div className={`relative w-full max-w-6xl ${aspectClass} flex items-center justify-center`}>
                  <AnimatePresence mode="popLayout" custom={lightboxState.direction}>
                    <motion.div
                      key={lightboxState.index}
                      custom={lightboxState.direction}
                      variants={lightboxVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ 
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={(e, { offset, velocity }) => {
                        if (offset.x > 100 || velocity.x > 500) navTiled(-1);
                        else if (offset.x < -100 || velocity.x < -500) navTiled(1);
                      }}
                      className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <LoadedImage
                        layoutId={lightboxState.direction === 0 ? `img-${lightboxState.index}` : undefined}
                        src={images[lightboxState.index]}
                        alt={`Lightbox ${lightboxState.index}`}
                        loading="eager"
                        className={`w-full h-full ${fitClass} rounded-2xl shadow-2xl border border-white/10 pointer-events-none relative z-10`}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Counter */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 font-mono text-xs tracking-widest uppercase">
                  {lightboxState.index + 1} / {images.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="relative w-full h-full overflow-y-auto z-[105] scroll-smooth no-scrollbar pt-28 pb-32 px-4 md:px-12 flex flex-col items-center gap-12 md:gap-16">
          <div className="max-w-[1400px] w-full text-center">
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="flex flex-col items-center"
            >
              <h2 className="text-brand-orange text-[10px] font-bold tracking-[0.6em] uppercase mb-3">
                - {title} SHOWCASE -
              </h2>
              <h3 className="text-2xl md:text-4xl font-display font-medium text-white">
                {title}
              </h3>
              <div className="w-12 h-[1px] bg-white/20 mt-6" />
            </motion.div>
          </div>

          <div className="w-full flex flex-col items-center gap-8 md:gap-12 max-w-[1250px] pb-24">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 bg-black/20 group hover:border-white/10 transition-colors duration-500`}
              >
                <div className="absolute top-6 left-6 z-10 bg-black/60 text-white/50 font-mono text-[10px] px-3 py-1 bg-neutral-950/80 rounded-full border border-white/10 backdrop-blur-md shadow-md">
                  {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
                <LoadedImage
                  src={img} 
                  alt={`${title} Image ${i + 1}`} 
                  loading={i < 2 ? "eager" : "lazy"}
                  className={`w-full h-full ${fitClass} transition-transform duration-700`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
