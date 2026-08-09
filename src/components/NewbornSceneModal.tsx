import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Map, Layers, Palette, Box, Grid, Play, Pause, Video, 
  MapPin, Eye, Leaf, Sun, Wind, ChevronRight 
} from "lucide-react";

interface NewbornSceneModalProps {
  onClose: () => void;
}

export default function NewbornSceneModal({ onClose }: NewbornSceneModalProps) {
  const [activeTab, setActiveTab] = useState<"lineart" | "painting" | "render3d" | "props" | "video">("painting");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Simulated Video States
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(38);

  useEffect(() => {
    let interval: any;
    if (isVideoPlaying && activeTab === "video") {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, activeTab]);

  // Line Draft (线稿展示)
  const lineDrafts = [
    {
      title: "白盒关卡阻隔阻沙栅栏排布线稿 (Whitebox Layout)",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAiEYmxUnj__关卡1.png?w=3072&fmt=webp",
      desc: "关卡建筑布局白盒线稿。探讨如何在风暴来临时，利用山脊走向、古道残垣与高矮防护林带错落，引导或者减弱气流粒子速度，形成物理避风港。"
    },
    {
      title: "阶梯堰水利收集管道地形深度剖面图 (Hydrology Line Art)",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAiIkToRXR__关卡2.png?w=3072&fmt=webp",
      desc: "阶梯渠堰水流循环回路测绘线描。重点确保大世界拼插部件中关卡坡度与进出水标高绝对统一，利于流体网格计算。"
    }
  ];

  // Concept Paintings (原画展示)
  const conceptPaintings = [
    {
      title: "沙尘退化地一号岛原画概念 (Degradation Zone)",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmtTAyWwhnq__岛1.png?w=3072&fmt=webp",
      desc: "退化地表面沙粒飞扬的压抑主基调。荒芜的大石、垃圾掩埋堆、及极少数残存的枯萎荆棘，旨在唤起玩家种植绿新生的原初渴望。"
    },
    {
      title: "古建筑枢纽能量圣殿核心环境原画 (Gateway Temple)",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAiWqMwREM__关卡4.png?w=3072&fmt=webp",
      desc: "巨型方尖柱石在沙漠绿洲下的光亮渲染，表达古树祭司枢纽能量解禁时的生机回涌。"
    }
  ];

  // 3D Scene Renders (3D展示)
  const sceneRenders = [
    {
      title: "迷雾密林废墟实机 Lumen 柔风光照渲染",
      image: "https://i.postimg.cc/Hx3s6RsN/mm-Afw-MUXy-SM-zi-yuan-17.webp",
      desc: "在虚幻5中运行实测。多点柔雾体积光从树叶空隙打下，Lumen动态反射让积水表面反射出摇曳树梢与斑驳城垛，空间真实代入感极强。"
    },
    {
      title: "古树祭坛能量核心 Nanite 模块网格细检",
      image: "https://i.postimg.cc/QCyN3776/mm-Afx-AGj-Awn-zi-yuan-19.webp",
      desc: "数亿虚拟三角网格的高精度材质。在没有法线贴图欺骗的情况下，柱石浮雕起伏与树皮裂络均呈现实网格阴影，视觉极富冲击力。"
    }
  ];

  // Vegetation & Props Assets (道具资产展示)  (鉄芒箕, 梭梭草, 巨叶沙仙人掌)
  const propAssets = [
    {
      name: "铁芒箕高密度灌丛 (Dicranopteris linearis)",
      type: "林地植被固沙中坚",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAfKWlwvsw__资源_23.png?w=3072&fmt=webp",
      desc: "极耐干燥贫瘠的固沙蕨类植物，根系交叉广阔，能在贫瘠硬沙黏土表面迅速聚敛水土，是首个解锁的点种资产。"
    },
    {
      name: "超强抗旱多年生梭梭草 (Haloxylon ammodendron)",
      type: "沙丘防风开路先锋",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAfKlrSoaV__资源_22.png?w=3072&fmt=webp",
      desc: "茎部具有储水蜡层，能在暴晒下完成自我保护，枝条遇风不易折断。物理网格阻风效果优异。"
    },
    {
      name: "巨叶沙仙人掌 (Megaphylla Cactus)",
      type: "大世界高储水生机地标",
      image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAfQfKIbrZ__资源_24.png?w=3072&fmt=webp",
      desc: "大型生态多肉，根系探测水阀能力。生长至高大期可孕育水汽，使周围小区域林带在狂沙阶段直接免疫水分蒸腾伤害。"
    }
  ];

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

      {/* Main Structural Framework body */}
      <div className="w-full h-full flex flex-col md:flex-row pt-0 pb-0 overflow-hidden relative">
        
        {/* Left Sidebar Switcher tabs */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col gap-2 p-4 md:p-6 bg-neutral-950/30 overflow-x-auto md:overflow-x-visible md:overflow-y-auto no-scrollbar shrink-0">
          <div className="hidden md:block text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase pb-2 px-3">
            ENVIRONMENT STAGES
          </div>

          <button
            onClick={() => setActiveTab("lineart")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 w-full shrink-0 ${
              activeTab === "lineart"
                ? "bg-emerald-600 text-white font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={18} />
            <span>线稿展示</span>
          </button>

          <button
            onClick={() => setActiveTab("painting")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 w-full shrink-0 ${
              activeTab === "painting"
                ? "bg-emerald-600 text-white font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Palette size={18} />
            <span>原画展示</span>
          </button>

          <button
            onClick={() => setActiveTab("render3d")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 w-full shrink-0 ${
              activeTab === "render3d"
                ? "bg-emerald-600 text-white font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Box size={18} />
            <span>3D展示</span>
          </button>

          <button
            onClick={() => setActiveTab("props")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 w-full shrink-0 ${
              activeTab === "props"
                ? "bg-emerald-600 text-white font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid size={18} />
            <span>道具资产展示</span>
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 w-full shrink-0 ${
              activeTab === "video"
                ? "bg-emerald-600 text-white font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Video size={18} />
            <span>实机演示视频</span>
          </button>
        </div>

        {/* Right Scroll Content Body pane */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950/20 p-6 md:p-12 pb-24">
          <AnimatePresence mode="wait">
            
            {/* L1. Lineart Section */}
            {activeTab === "lineart" && (
              <motion.div
                key="lineart"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                <div>
                  <h2 className="text-emerald-400 text-xs font-mono tracking-[0.5em] uppercase mb-3">// ENV STAGE 01: LEVEL PLANNING WIREBOX</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">关卡地貌白模白盒与阻沙流轴线稿</h3>
                  <div className="w-16 h-[2px] bg-emerald-500 mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {lineDrafts.map((draft, idx) => (
                    <div
                      key={idx}
                      className="group bg-neutral-900/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col hover:border-emerald-500/20 transition-all duration-500"
                    >
                      <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-black/60">
                        <img
                          src={draft.image}
                          alt={draft.title}
                          className="w-full h-full object-cover opacity-50 group-hover:opacity-85 transition-opacity duration-500 cursor-zoom-in"
                          onClick={() => setLightboxImage(draft.image)}
                        />
                        <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/35 text-emerald-300 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                          WHITE_0{idx + 1}
                        </div>
                      </div>

                      <div className="p-6 md:p-8 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-white text-base md:text-lg font-semibold tracking-wide font-sans">{draft.title}</h4>
                        </div>
                        <div className="border-t border-white/5 pt-4 text-white/50 text-xs leading-relaxed select-text">
                          {draft.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* L2. Concept Painting Section */}
            {activeTab === "painting" && (
              <motion.div
                key="painting"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                <div>
                  <h2 className="text-emerald-400 text-xs font-mono tracking-[0.5em] uppercase mb-3">// ENV STAGE 02: PANORAMIC ATMOSPHERIC LANDSCAPES</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">大世界分气候带原画环境美术</h3>
                  <div className="w-16 h-[2px] bg-emerald-500 mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {conceptPaintings.map((paint, i) => (
                    <div
                      key={i}
                      className="group bg-neutral-900/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col hover:border-emerald-500/20 transition-all duration-500"
                    >
                      <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-black/60">
                        <img
                          src={paint.image}
                          alt={paint.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-95 transition-opacity duration-500 cursor-zoom-in"
                          onClick={() => setLightboxImage(paint.image)}
                        />
                        <div className="absolute top-4 left-4 bg-emerald-500 text-black font-semi font-mono text-[9px] px-2.5 py-0.5 rounded">
                          LANDSCAPE CONCEPT 0{i + 1}
                        </div>
                      </div>

                      <div className="p-6 md:p-8 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-white text-base md:text-lg font-semibold tracking-wide font-sans">{paint.title}</h4>
                        </div>
                        <div className="border-t border-white/5 pt-4 text-white/50 text-xs leading-relaxed select-text">
                          {paint.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* L3. 3D Renders Section */}
            {activeTab === "render3d" && (
              <motion.div
                key="render3d"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                <div>
                  <h2 className="text-emerald-400 text-xs font-mono tracking-[0.5em] uppercase mb-3">// ENV STAGE 03: LUMEN & NANITE LANDING ZONES</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">虚幻5引擎真实材质、粒子与光影展现</h3>
                  <div className="w-16 h-[2px] bg-emerald-500 mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sceneRenders.map((render, i) => (
                    <div
                      key={i}
                      className="group bg-neutral-900/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col hover:border-emerald-500/20 transition-all duration-500"
                    >
                      <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-neutral-950">
                        <img
                          src={render.image}
                          alt={render.title}
                          className="w-full h-full object-contain bg-neutral-950 opacity-60 group-hover:opacity-100 transition-opacity duration-500 cursor-zoom-in"
                          onClick={() => setLightboxImage(render.image)}
                        />
                        <div className="absolute top-4 left-4 bg-emerald-500 text-black font-semibold font-mono text-[9px] px-2.5 py-0.5 rounded">
                          UE5.4 SCREENSHOT
                        </div>
                      </div>

                      <div className="p-6 md:p-8 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-emerald-400 text-[10px] font-mono tracking-wider font-semibold">ENVIRONMENT MODEL</span>
                          <h4 className="text-white text-base md:text-lg font-semibold tracking-wide font-sans">{render.title}</h4>
                        </div>
                        <div className="border-t border-white/5 pt-4 text-white/50 text-xs leading-relaxed select-text">
                          {render.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* L4. Prop Assets Section (Foliage Plants Props Grid) */}
            {activeTab === "props" && (
              <motion.div
                key="props"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                <div>
                  <h2 className="text-emerald-400 text-xs font-mono tracking-[0.5em] uppercase mb-3">// ENV SECTION A: ECO-FOLIAGE PROP ASSETS</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">大世界各生境植物套件（PBR材质细化）</h3>
                  <div className="w-16 h-[2px] bg-emerald-500 mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propAssets.map((prop, idx) => (
                    <div
                      key={idx}
                      className="group bg-neutral-900/50 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Perfect 4:4 aspect ratio block requested for assets */}
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-black/60">
                          <img
                            src={prop.image}
                            alt={prop.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-neutral-950/80 border border-white/10 rounded font-mono text-[9px] text-white/50">
                            4：4 FOLIA ASSET
                          </div>
                        </div>

                        <div>
                          <div className="text-emerald-400 text-[10px] font-mono tracking-wider uppercase mb-0.5">{prop.type}</div>
                          <h4 className="text-white text-base font-semibold tracking-wide">{prop.name}</h4>
                        </div>
                      </div>

                      <p className="border-t border-white/5 pt-4 text-white/60 text-xs leading-relaxed mt-4 select-text">
                        {prop.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* L5. Real-time Video Viewport Demo Tab (实机演示视频) */}
            {activeTab === "video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                <div>
                  <h2 className="text-emerald-400 text-xs font-mono tracking-[0.5em] uppercase mb-3">// ENV SECTION B: LANDSCAPE FLIGHT VIEWPORT VIDEO</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">大世界无缝加载地形漫游及风沙流动实境</h3>
                  <div className="w-16 h-[2px] bg-emerald-500 mt-6" />
                </div>

                {/* Real 16:9 interactive video viewer */}
                <div className="relative w-full aspect-video rounded-32 overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex items-center justify-center">
                  <iframe
                    src="https://player.bilibili.com/player.html?bvid=BV1k6L469EpY&page=1&high_quality=1&as_wide=1"
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    className="w-full h-full absolute inset-0 border-0"
                  />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox zoomed layer */}
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
            >
              <X size={24} />
            </button>

            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightboxImage}
              alt="Lightbox Zoomed"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
