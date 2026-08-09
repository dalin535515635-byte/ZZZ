import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "splitting" | "folding" | "ready" | "transitioning">("loading");
  
  const leftBarRef = useRef<HTMLDivElement>(null);
  const midBarRef = useRef<HTMLDivElement>(null);
  const rightBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (phase !== "loading") return;

    // Linear progress over 5 seconds
    const duration = 5000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => setPhase("splitting"), 400);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [phase]);

  useEffect(() => {
    if (phase === "splitting") {
      // Split horizontal bar into 3 pieces
      setPhase("folding");
    }
    
    if (phase === "folding") {
      const tl = gsap.timeline({
        onComplete: () => setPhase("ready")
      });

      // 1. Initial Split Gap
      tl.to([leftBarRef.current, midBarRef.current, rightBarRef.current], {
        x: (i) => (i - 1) * 2,
        duration: 0.3,
        ease: "back.out(2)"
      });

      // 2. Fold to Z
      tl.to([leftBarRef.current, midBarRef.current, rightBarRef.current], {
        height: 24,
        borderRadius: 12,
        duration: 0.6,
        ease: "power2.inOut"
      }, "+=0.1");

      tl.to(leftBarRef.current, {
        x: 84,
        y: -27, 
        width: 72,
        duration: 0.8,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }, "<");

      tl.to(midBarRef.current, {
        rotation: -46,
        scaleX: 1.25, // Adjusted length to pierce into horizontal lines
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }, "<");

      tl.to(rightBarRef.current, {
        x: -76,
        y: 27, 
        width: 72,
        duration: 0.8,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }, "<");
    }
  }, [phase]);

  const handleZClick = () => {
    if (phase === "ready") {
      setPhase("transitioning");
      setTimeout(() => {
        onComplete();
      }, 400); // Faster transition as requested
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence>
        {phase === "transitioning" && (
          <motion.div
            className="absolute inset-0 bg-transparent z-[2000] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center">
        
        {/* Central Animation Area */}
        <motion.div
          ref={containerRef}
          className="relative w-[240px] h-[40px] flex items-center justify-center cursor-pointer"
          onClick={handleZClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={phase === "ready" ? {
            filter: isHovered 
              ? "drop-shadow(0 0 50px rgba(255,255,255,0.6))"
              : [
                "drop-shadow(0 0 10px rgba(255,255,255,0.05))",
                "drop-shadow(0 0 30px rgba(255,255,255,0.3))",
                "drop-shadow(0 0 10px rgba(255,255,255,0.05))"
              ],
            scale: isHovered ? 1.15 : [1, 1.05, 1],
            opacity: 1
          } : phase === "transitioning" ? { 
            scale: 120, 
            opacity: 0,
            filter: "blur(20px)" 
          } : {}}
          transition={{ 
            filter: { 
              duration: isHovered ? 0.3 : (phase === "ready" ? 2 : 0.6), 
              repeat: isHovered ? 0 : (phase === "ready" ? Infinity : 0), 
              ease: "easeInOut" 
            },
            scale: { 
              duration: isHovered ? 0.3 : (phase === "ready" ? 2 : 0.8), 
              repeat: isHovered ? 0 : (phase === "ready" ? Infinity : 0),
              ease: phase === "ready" ? "easeInOut" : [0.76, 0, 0.24, 1] 
            },
            rotate: { duration: 0.4 },
            opacity: { duration: 0.5 },
            default: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Progress Container (Original Bar) */}
          {phase === "loading" && (
            <div className="absolute inset-0 border-2 border-white rounded-[4px] overflow-hidden bg-black flex items-center justify-center">
              <motion.div 
                className="absolute inset-x-0 inset-y-0 bg-white origin-left z-0"
                style={{ scaleX: progress / 100 }}
              />
              <div className="relative z-10 font-mono text-sm font-black tracking-[0.4em] text-white mix-blend-difference pr-[-0.4em]">
                {Math.round(progress)}
              </div>
            </div>
          )}

          {/* Morphing Components */}
          {(phase !== "loading") && (
            <>
              {/* Left Bar (Top of Z) */}
              <div 
                ref={leftBarRef}
                className="absolute w-[80px] h-[40px] bg-white rounded-[2px]" 
                style={{ left: 0 }}
              />
              {/* Mid Bar (Diagonal of Z) */}
              <div 
                ref={midBarRef}
                className="absolute w-[80px] h-[40px] bg-white rounded-[2px]" 
                style={{ left: 80 }}
              />
              {/* Right Bar (Bottom of Z) */}
              <div 
                ref={rightBarRef}
                className="absolute w-[80px] h-[40px] bg-white rounded-[2px]" 
                style={{ left: 160 }}
              />
            </>
          )}
        </motion.div>

        {/* Ready Indicator */}
        {phase === "ready" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-20 text-[10px] tracking-[0.6em] text-white/60 uppercase font-black whitespace-nowrap"
          >
            - CLICK TO DEPLOY -
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

