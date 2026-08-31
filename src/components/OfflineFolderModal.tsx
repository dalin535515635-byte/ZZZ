import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gamepad2, Compass, Layers, ChevronDown, Check, Menu } from 'lucide-react';

interface OfflineItem {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
}

const items: OfflineItem[] = [
  {
    id: "off-6",
    title: "MG&PUBGM 品牌联动设计",
    subtitle: "Brand Crossover & Event Design",
    images: [
      "https://i.postimg.cc/gj2rFvGw/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-01.png",
      "https://i.postimg.cc/bvfJNXzN/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-03.png",
      "https://i.postimg.cc/hjpPrfVn/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-04.png",
      "https://i.postimg.cc/Y002yMxs/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-05.png",
      "https://i.postimg.cc/WbDbGpzD/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-06.png",
      "https://i.postimg.cc/JzZrFTj2/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-07.png",
      "https://i.postimg.cc/25YkN4wF/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-08.png",
      "https://i.postimg.cc/FRWNSwQZ/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-09.png",
      "https://i.postimg.cc/XNPnYM8T/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-10.png",
      "https://i.postimg.cc/d11KJnTJ/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-11.png",
      "https://i.postimg.cc/z3mmSr2W/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-12.png",
      "https://i.postimg.cc/3rzWb0Pd/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-13.png",
      "https://i.postimg.cc/TYmh8YxT/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-14.png"
    ]
  },
  {
    id: "off-1",
    title: "2025 CFS电竞嘉年华",
    subtitle: "Event Booth Design",
    images: [
      "https://i.postimg.cc/xTBjXBg4/2F8A3263.jpg",
      "https://i.postimg.cc/G23b0RhR/2F8A3279.jpg",
      "https://i.postimg.cc/CMQS2Wyz/2F8A3282.jpg",
      "https://i.postimg.cc/28Lb9QKX/2F8A3284.jpg",
      "https://i.postimg.cc/x1rkwkrv/2F8A3286.jpg",
      "https://i.postimg.cc/15D650rJ/2F8A3291.jpg",
      "https://i.postimg.cc/g026DCFj/2F8A3295.jpg",
      "https://i.postimg.cc/mDc1x7r3/2F8A3301.jpg",
      "https://i.postimg.cc/SRFsw53y/2F8A3313.jpg",
      "https://i.postimg.cc/PqC5NTnb/2F8A3326.jpg",
      "https://i.postimg.cc/Y0zpTSQ4/2F8A3337.jpg",
      "https://i.postimg.cc/PrKX4PtM/2F8A3354.jpg",
      "https://i.postimg.cc/g0LGms3t/2F8A3358.jpg",
      "https://i.postimg.cc/4yPgBSTf/2F8A3367.jpg",
      "https://i.postimg.cc/rs1sQC8x/wei-xin-tu-pian-20251214223117-45-456.jpg"
    ]
  },
  {
    id: "off-2",
    title: "BW CF线下学院",
    subtitle: "Brochures & Manuals",
    images: [
      "https://i.postimg.cc/g2Z6BVnr/mk-INAHLDRle-0621-bwcf-xue-yuan-xian-xia-she-ji-07-2.webp",
      "https://i.postimg.cc/GtmXk73n/mk-Hxngqb-Ez-A-0621-bwcf-xue-yuan-xian-xia-she-ji-03.webp",
      "https://i.postimg.cc/yY5LZyMK/mk-Hxnidb-CVc-0621-bwcf-xue-yuan-xian-xia-she-ji-05.webp",
      "https://i.postimg.cc/cHhSxb53/mk-Hxne-MAWii-0621-bwcf-xue-yuan-xian-xia-she-ji-06.webp"
    ]
  },
  {
    id: "off-3",
    title: "CFH 科隆线下展",
    subtitle: "Custom Merchandise",
    images: [
      "https://i.postimg.cc/Kjsr2mPr/mk-Hxa-Vt-Qtz-O-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-03.jpg",
      "https://i.postimg.cc/BntZb4xL/mk-Hxa-WJm-Sam-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-04.jpg",
      "https://i.postimg.cc/VNYRnZkN/mk-Hxa-VOPf-FA-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-05.jpg",
      "https://i.postimg.cc/QdMgM94J/mk-Hxa-Qnunnv-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-06.jpg",
      "https://i.postimg.cc/Px1Y7mJj/mk-Hxa-Wq-RWAG-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-07.jpg",
      "https://i.postimg.cc/kMFWFFLp/mk-Hxa-WYkmc-N-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-08.jpg",
      "https://i.postimg.cc/W1KZb9Jz/mk-Hxa-URgsf-T-cfh-ke-long-zhan-mei-ti-jian-she-ji-chuang-yi-fang-an-0718-2-09.jpg"
    ]
  },
  {
    id: "off-4",
    title: "英雄联盟总决赛 高校嘉年华",
    subtitle: "Outdoor Banner & Display",
    images: [
      "https://i.postimg.cc/4d98rsy3/wei-xin-tu-pian-20260823165559-1084-87.png",
      "https://i.postimg.cc/90Hx2KwS/wei-xin-tu-pian-20260823165655-1092-87.png",
      "https://i.postimg.cc/Rh6qK5Yy/1.png",
      "https://i.postimg.cc/02SbNvDq/2.png",
      "https://i.postimg.cc/mgGhzny9/3.png",
      "https://i.postimg.cc/Hx7rR80V/4.png",
      "https://i.postimg.cc/9XdM9hJb/0af95069eeab952221c3903dd6d9a83.jpg",
      "https://i.postimg.cc/pTD2KfYz/0f50ece933fc01bca0019d0b814b3a4.jpg",
      "https://i.postimg.cc/9QkYVKvz/wei-xin-tu-pian-20260824003453-1098-87.jpg",
      "https://i.postimg.cc/pL3z38Fn/wei-xin-tu-pian-20260824003454-1099-87.jpg",
      "https://i.postimg.cc/R0fKmF1z/wei-xin-tu-pian-20260824003455-1100-87.jpg",
      "https://i.postimg.cc/Kz2L82Q4/wei-xin-tu-pian-20260824003457-1102-87.jpg",
      "https://i.postimg.cc/k4vSVphs/wei-xin-tu-pian-20260824003459-1104-87.jpg",
      "https://i.postimg.cc/yx58WhBw/wei-xin-tu-pian-20260824003458-1103-87.jpg"
    ]
  },
  {
    id: "off-5",
    title: "PUBG曼谷游船",
    subtitle: "Event & Cruise Design",
    images: [
      "https://i.postimg.cc/4yChSTHn/wei-xin-tu-pian-2026-08-24-005048-961.png",
      "https://i.postimg.cc/GhCyPd1B/wei-xin-tu-pian-2026-08-24-005118-671.png",
      "https://i.postimg.cc/8zkf34cC/wei-xin-tu-pian-2026-08-24-005124-523.png",
      "https://i.postimg.cc/VNpSJcRX/wei-xin-tu-pian-2026-08-24-005105-971.png",
      "https://i.postimg.cc/XqcX1B0F/wei-xin-tu-pian-2026-08-24-005132-433.png"
    ]
  }
];

export default function OfflineFolderModal({ onClose, onNavigateToCategory }: { onClose: () => void; onNavigateToCategory?: (catId: "kv" | "aigc") => void }) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [lightboxImage] = useState<string | null>(null);
  const setLightboxImage = (_url: string | null) => {};
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeItem = items[activeIdx];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeIdx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden text-white"
    >
      {/* Modern Floating Close Button to save vertical height */}
      <button
        onClick={onClose}
        className="fixed top-3.5 right-3.5 z-[150] p-2 text-white/60 hover:text-brand-orange hover:bg-white/10 bg-neutral-950/80 border border-white/10 backdrop-blur-md rounded-full active:scale-95 transition-all shadow-lg"
        title="关闭"
      >
        <X size={18} />
      </button>

      {/* Main Grid Viewport Split */}
      <div className="w-full h-full flex flex-col md:flex-row pt-0 pb-0 overflow-hidden relative">
        
        {/* Mobile & Tablet Apple-inspired Collapsible Directory Selector */}
        <div className="hidden">
          {/* Sticky Sub-Header Bar */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between px-5 py-2.5 bg-neutral-950 text-left hover:bg-neutral-900/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-brand-orange border border-brand-orange/30 px-1.5 py-0.5 rounded bg-brand-orange/10 font-bold">
                0{activeIdx + 1}
              </span>
              <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                {activeItem.title}
              </span>
              <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">
                ({activeItem.subtitle.split(" ")[0]})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <span className="font-mono text-[9px] tracking-wider opacity-85">项目目录</span>
              <ChevronDown
                size={12}
                className={`text-brand-orange transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </div>
          </button>

          {/* Apple-style Expandable Menu Dropdown List */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden bg-neutral-950/98 border-t border-white/5"
              >
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Projects Section Header */}
                  <div className="text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase pb-1 border-b border-white/5">
                    SELECT EXHIBITION / 线下设计展览
                  </div>

                  <div className="space-y-1">
                    {items.map((it, idx) => (
                      <button
                        key={it.id}
                        onClick={() => {
                          setActiveIdx(idx);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                          activeIdx === idx
                            ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20"
                            : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-white/30">0{idx + 1}</span>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-bold block text-white">{it.title}</span>
                            <span className="text-[9px] text-white/40 block leading-tight">{it.subtitle}</span>
                          </div>
                        </div>
                        {activeIdx === idx && (
                          <Check size={14} className="text-brand-orange" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Switch Category Section */}
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <div className="text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase">
                      SWITCH WORK CATEGORY / 切换其它作品大类
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onNavigateToCategory?.("kv");
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/5 bg-neutral-900/50 hover:bg-brand-orange/5 text-white/80 hover:text-white text-xs font-semibold transition-all"
                      >
                        <Gamepad2 size={11} className="text-brand-orange" />
                        <span>游戏宣发</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onNavigateToCategory?.("aigc");
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/5 bg-neutral-900/50 hover:bg-brand-orange/5 text-white/80 hover:text-white text-xs font-semibold transition-all"
                      >
                        <Compass size={11} className="text-brand-orange" />
                        <span>AIGC项目</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Left Side menu - Offline Categories Selector (Desktop View only) */}
        <div className="hidden md:flex md:w-64 border-r border-white/5 flex-col gap-3.5 p-5 bg-neutral-950/30 overflow-y-auto no-scrollbar shrink-0">
          <div className="space-y-3">
            <div className="text-[9px] sm:text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase pb-1">
              SELECT EXHIBITION / 线下物料分类
            </div>

            {/* Switcher list */}
            <div className="grid grid-cols-1 gap-2.5">
              {items.map((g, idx) => (
                <button
                  key={g.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all duration-300 w-full border ${
                    activeIdx === idx
                      ? "bg-brand-orange/10 border-brand-orange text-white shadow-[0_4px_25px_rgba(242,125,38,0.15)]"
                      : "border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {activeIdx === idx && (
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  )}
                  <span className="text-[8px] font-mono text-brand-orange uppercase font-black">
                    EXHIBITION 0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold tracking-wider font-display text-white mt-0.5">
                    {g.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-white/10 my-3.5" />

            <div className="space-y-2.5">
              <div className="text-[9px] sm:text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase pb-1">
                SWITCH FOCUS / 切换其他大类
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => onNavigateToCategory?.("kv")}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/5 bg-neutral-900/30 hover:bg-brand-orange/5 hover:border-brand-orange/50 text-white/70 hover:text-white transition-all text-xs font-semibold tracking-wide"
                >
                  <Gamepad2 size={13} className="text-brand-orange shrink-0" />
                  <span>游戏海报设计</span>
                </button>
                <button
                  onClick={() => onNavigateToCategory?.("aigc")}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/5 bg-neutral-900/30 hover:bg-brand-orange/5 hover:border-brand-orange/50 text-white/70 hover:text-white transition-all text-xs font-semibold tracking-wide"
                >
                  <Compass size={13} className="text-brand-orange shrink-0" />
                  <span>AIGC项目</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Content - Infinite vertical list of showcase designs with pre-loaded DOM elements for flicker-free load */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950/20 p-4 sm:p-6 md:p-12 pb-24"
        >
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            {/* Mobile-only interactive custom selector (dropdown) */}
            <div className="md:hidden sticky top-0 z-50 w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 pr-14 shadow-2xl select-none mb-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-brand-orange font-extrabold uppercase tracking-wide">
                    EXHIBITION CATEGORY / 当前选择板块
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5 hover:text-brand-orange transition-colors">
                    <span>{activeItem.title}</span>
                    <span className="text-[10px] text-brand-orange align-middle">▼</span>
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-brand-orange transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-white/5 space-y-2"
                  >
                    {items.map((it, idx) => (
                      <button
                        key={it.id}
                        onClick={() => {
                          setActiveIdx(idx);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                          activeIdx === idx
                            ? "bg-brand-orange/10 text-white border border-brand-orange/30"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white mt-0.5">{it.title}</span>
                        </div>
                        {activeIdx === idx && <Check size={14} className="text-brand-orange" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          {items.map((it, idx) => (
            <div
              key={it.id}
              style={{ display: idx === activeIdx ? 'block' : 'none' }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: idx === activeIdx ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-5xl mx-auto space-y-12"
              >
                {/* Heading */}
                <div className="border-b border-white/5 pb-8">
                  <h2 className="text-brand-orange text-[10px] font-mono tracking-[0.5em] uppercase mb-2">
                    // {it.subtitle}
                  </h2>
                  <h3 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight text-white mb-3">
                    {it.title}
                  </h3>
                  <div className="w-16 h-[2px] bg-brand-orange mt-6" />
                </div>

                {/* Vertical Feed: Images styled perfectly */}
                <div className="space-y-8 max-w-4xl mx-auto">
                  {it.images.map((img, i) => {
                    const isLOLAdaptive = it.id === "off-4" && i >= 4;
                    const isPUBGFirst = (it.id === "off-5" || it.id === "off-6") && i === 0;
                    const isAdaptive = isLOLAdaptive || isPUBGFirst;
                    const aspectClass = isAdaptive 
                      ? "aspect-auto h-auto" 
                      : (it.id === "off-1" ? "aspect-[3/2]" : "aspect-[16/9]");
                    const imgClass = isAdaptive
                      ? "w-full h-auto block group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                      : "w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out";

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: idx === activeIdx ? 1 : 0, y: idx === activeIdx ? 0 : 15 }}
                        transition={{ delay: idx === activeIdx ? Math.min(i * 0.04, 0.35) : 0, duration: 0.3 }}
                        className="group relative bg-neutral-900/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        onClick={() => setLightboxImage(img)}
                      >
                        <div className={`${aspectClass} w-full bg-neutral-950/85 flex items-center justify-center overflow-hidden`}>
                          <img
                            src={img}
                            alt={`${it.title} Exhibit ${i + 1}`}
                            loading="eager"
                            referrerPolicy="no-referrer"
                            className={imgClass}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

              </motion.div>
            </div>
          ))}
          </div>
        </div>

        {/* Floating Circular Directory Button for Mobile/Tablet */}
        <div className="hidden">
          {/* Floating Circle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-11 h-11 rounded-full bg-brand-orange text-black flex items-center justify-center shadow-[0_4px_20px_rgba(242,125,38,0.4)] border-2 border-white/20 active:scale-90 transition-transform duration-200"
            title="目录"
          >
            <Menu size={18} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-90 scale-110" : ""}`} />
          </button>

          {/* Floating Navigation Popover Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="absolute bottom-14 right-0 w-64 bg-neutral-950/98 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl space-y-3"
              >
                {/* Internal Project Selecting Buttons */}
                <div className="space-y-1">
                  {items.map((it, idx) => (
                    <button
                      key={it.id}
                      onClick={() => {
                        setActiveIdx(idx);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all ${
                        activeIdx === idx
                          ? "bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-bold"
                          : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span>{it.title}</span>
                      {activeIdx === idx && <Check size={12} className="text-brand-orange" />}
                    </button>
                  ))}
                </div>

                {/* Jump to standard Category Jumps */}
                <div className="border-t border-white/5 pt-2.5 space-y-2">
                  <div className="text-[9px] font-mono text-white/30 uppercase select-none">跳转到其它大类</div>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToCategory?.("kv");
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-white/70 hover:text-white hover:bg-brand-orange/10 transition-all border border-white/5 bg-neutral-900/30 font-semibold"
                    >
                      <Gamepad2 size={12} className="text-brand-orange" />
                      <span>游戏海报设计</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToCategory?.("aigc");
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-white/70 hover:text-white hover:bg-brand-orange/10 transition-all border border-white/5 bg-neutral-900/30 font-semibold"
                    >
                      <Compass size={12} className="text-brand-orange" />
                      <span>AIGC项目</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox Modal for detail zoom */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[200] bg-neutral-950/85 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
              title="关闭"
            >
              <X size={24} />
            </button>

            <motion.img
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              src={lightboxImage}
              alt="Zoomed Detail Inspection"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
