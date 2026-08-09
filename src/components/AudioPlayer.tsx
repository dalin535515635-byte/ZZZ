import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(8).fill(0));
  
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Document level interaction to "unlock" audio on first interaction
    // This handles the "interaction with background / touch screen" requirement
    if (hasInteracted) return;

    const handleInitialInteraction = () => {
      if (audioRef.current && !isPlaying) {
        setIsPlaying(true);
        setHasInteracted(true);
      }
    };

    document.addEventListener('click', handleInitialInteraction);
    document.addEventListener('touchstart', handleInitialInteraction);

    return () => {
      document.removeEventListener('click', handleInitialInteraction);
      document.removeEventListener('touchstart', handleInitialInteraction);
    };
  }, [hasInteracted, isPlaying]); // Only re-run if needed until first interaction occurs

  // Initialize Audio Context once
  useEffect(() => {
    if (!audioRef.current) return;

    const initAudio = () => {
      if (!audioContextRef.current) {
        try {
          const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
          const ctx = new AudioContextClass();
          const analyser = ctx.createAnalyser();
          
          analyser.fftSize = 64; 
          analyser.smoothingTimeConstant = 0.8;
          
          const source = ctx.createMediaElementSource(audioRef.current!);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          
          audioContextRef.current = ctx;
          analyserRef.current = analyser;
        } catch (e) {
          console.error("AudioContext initialization failed:", e);
        }
      }
    };

    const updateFrequencyData = () => {
      if (analyserRef.current && isPlaying) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const scaledData = Array.from(dataArray.slice(0, 8)).map(v => v / 255);
        setFrequencyData(scaledData);
        animationRef.current = requestAnimationFrame(updateFrequencyData);
      } else {
        animationRef.current = null;
      }
    };

    if (isPlaying) {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play().catch(err => {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      });
      
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(updateFrequencyData);
      }
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setFrequencyData(new Array(8).fill(0));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    if (!hasInteracted) setHasInteracted(true);
  };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed md:top-6 md:right-6 top-4 right-4 z-[100] flex flex-col items-end gap-3 scale-[0.5] origin-top-right">
      <audio 
        ref={audioRef} 
        src={url} 
        loop 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous" 
      />

      <div className="flex items-center gap-4">
        {/* Info Tag - Rhodes Island Style */}
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-mono font-bold text-brand-orange uppercase tracking-widest leading-none">
            R.I.P.S. AUDIO
          </span>
          <motion.span 
            animate={isPlaying ? { 
              opacity: [0.4, 1, 0.4]
            } : { opacity: 0.3 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em] mt-1"
          >
            {isPlaying ? "STREAMING_ACTIVE" : "STANDBY.PULSE"}
          </motion.span>
        </div>

        {/* The Rotating Decor / Play Button */}
        <button
          onClick={togglePlay}
          className="relative group cursor-pointer w-16 h-16 md:w-20 md:h-20"
          title={isPlaying ? "Stop Protocol" : "Initialize Protocol"}
        >
          {/* Static Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div 
                  key="playing-icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-[1.5px] md:gap-[2px] h-4 md:h-5 px-2 md:px-3 w-full justify-center"
                >
                  {frequencyData.map((val, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: `${Math.max(3, val * (window.innerWidth < 768 ? 14 : 20))}px`,
                        opacity: 0.7 + val * 0.3
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-[1.5px] md:w-[2px] bg-brand-orange rounded-full"
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="paused-icon"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 0.4,
                    scale: 1
                  }}
                  exit={{ opacity: 0 }}
                >
                  <Music className="w-4 h-4 md:w-5 md:h-5 text-white/40" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rotating Outer Ring & Elements */}
          <div className={`absolute inset-0 flex items-center justify-center animate-slow-rotate ${!isPlaying ? 'pause-animation' : ''}`}>
            {/* Outer Border with Dot */}
            <div className={`relative w-full h-full border ${isPlaying ? 'border-brand-orange/30' : 'border-white/10'} rounded-full transition-colors duration-500`}>
              {/* Top indicator - Explicit circle */}
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-brand-orange shadow-[0_0_8px_#f27d26]' : 'bg-white/20'} transition-all`} 
              />
            </div>
            
            {/* Dashed orbit - also rotates */}
            <div className={`absolute inset-[15%] border ${isPlaying ? 'border-brand-orange/10' : 'border-white/5'} rounded-full border-dashed transition-colors`} />
          </div>

          {/* Static Pulse Layer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
                animate={{ 
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                  borderColor: isPlaying 
                    ? ["rgba(242, 125, 38, 0.1)", "rgba(242, 125, 38, 0.4)", "rgba(242, 125, 38, 0.1)"]
                    : "rgba(255, 255, 255, 0.05)"
                }}
                transition={{ duration: isPlaying ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
                className={`w-12 h-12 border ${isPlaying ? 'border-brand-orange/20' : 'border-white/5'} rounded-full`} 
              />
          </div>

          {/* Interaction Ring */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute inset-0 bg-transparent group-hover:bg-brand-orange/5 rounded-full transition-colors z-20"
          />
        </button>
      </div>

      {/* Volume Control Trigger - Mini */}
      <motion.button
        onClick={toggleMute}
        className="text-[8px] font-mono text-white/20 hover:text-brand-orange transition-colors flex items-center gap-1.5 pr-2"
      >
        {isMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
        <span>{isMuted ? "MUTE_ON" : "AUDIO_OUTPUT"}</span>
      </motion.button>
    </div>
  );
};

export default AudioPlayer;
