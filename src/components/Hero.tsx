import { motion } from "motion/react";
import ParticleTitle from "./ParticleTitle";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen py-24 flex flex-col justify-center px-6 md:px-24 overflow-hidden bg-background">
      {/* Cinematic Background Overlay */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
      
      {/* Tech Style Corner Brackets matching the screenshot */}
      <div className="absolute inset-0 pointer-events-none p-6 md:p-12 opacity-20">
        <div className="absolute top-12 left-12 w-10 h-10 border-l border-t border-white" />
        <div className="absolute top-12 right-12 w-10 h-10 border-r border-t border-white" />
        <div className="absolute bottom-12 left-12 w-10 h-10 border-l border-b border-white" />
        <div className="absolute bottom-12 right-12 w-10 h-10 border-r border-b border-white" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center -translate-y-12 md:-translate-y-20"
        >
          {/* Particle Title Interaction */}
          <div className="w-full">
            <ParticleTitle text="VISUAL DESIGN" />
          </div>

        </motion.div>
      </div>

      <style>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}

