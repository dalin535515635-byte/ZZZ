import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, Check } from "lucide-react";
import { prioritizeProjectImages, extractProjectImages } from "../lib/imageLoaderManager";

interface NewbornCharacterModalProps {
  onClose: () => void;
  onNavigateTo?: (target: "demo" | "kv" | "char") => void;
}

interface CharacterProject {
  id: number;
  name: string;
  subtitle: string;
  desc: string;
  type: "char_design" | "char_whitemodel" | "ue5_render" | "brand_手册" | "merch_物料" | "kv";
  images: string[];
  bottomImage?: string;
  horizontalImageProps?: string;
}

export default function NewbornCharacterModal({ onClose, onNavigateTo }: NewbornCharacterModalProps) {
  const [activeProject, setActiveProject] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position on project change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeProject]);

  // Definitive 6 projects matching requested specifications
  const projects: CharacterProject[] = [
    {
      id: 0,
      name: "角色设计",
      subtitle: "3D IP character design & reference orthographics",
      desc: "角色高概念二维视觉定稿设计。精研面部特征、防毒面具装配结构以及微型户外装备配件，打通次世代建模前的全套精细色彩概念。通过移除下方多余切换分栏 and 多余提示词，确保原画在16:9极真画布下完美直观预览。",
      type: "char_design",
      images: [
        "https://i.postimg.cc/JzRmGCSn/xian-gao-yuan-hua-she-ji.png",
        "https://i.postimg.cc/x18xsszG/dong-zuo-she-ji.png"
      ]
    },
    {
      id: 1,
      name: "角色白模",
      subtitle: "3D High-Poly Grey Clay Render & Modeling proportions",
      desc: "次世代大片级3D高保真灰色黏土模型推演。该阶段致力于无反光材质状态下的体感、转面结构及骨骼物理表现开发，重点矫正草帽、防风兜帽、背带系统和肢体轮廓的终极剪影美感。",
      type: "char_whitemodel",
      images: [
        "https://i.postimg.cc/rp36TDWD/ZBrush-hui-mo-xiao-guo-tu.png",
        "https://i.postimg.cc/D0VQc6TF/ZBrush-hui-mo-zheng-shi-tu.png",
        "https://i.postimg.cc/T32VQhBB/ZBrush-hui-mo-ce-shi-tu.png",
        "https://i.postimg.cc/Gt1YDpkg/ZBrush-hui-mo-bei-shi-tu.png"
      ],
      bottomImage: "https://i.postimg.cc/PJ4gsPKG/4189c0a2b5edd924c139f219d632d9c.png"
    },
    {
      id: 2,
      name: "UE5渲染",
      subtitle: "Unreal Engine 5 Next-gen Real-time Showcase & Cinematic lighting",
      desc: "虚幻引擎5真实时间节点全流合渲染。加入Lumen全局漫反射、动态毛绒布料算力，并精研冷暖对立的高阶影棚级逆光氛围，使皮革磨损、护目镜折射等高级PBR材质渲染臻至无暇。",
      type: "ue5_render",
      images: [
        "https://i.postimg.cc/gjY7DGdG/14c3c595e696b51c0ac4acdabb514fc.png",
        "https://i.postimg.cc/4NxMH4B8/zheng-shi-tu-wu-tou-shi-cai-zhi-xuan-ran-tu-(1).png",
        "https://i.postimg.cc/FsC6yt65/zhan-shu-nu-xing-ce-shi-tu-cai-zhi-xuan-ran-4K-v3.png",
        "https://i.postimg.cc/4xKSwLCs/zhan-shu-nu-xing-bei-shi-tu-cai-zhi-xuan-ran-4K.png"
      ],
      bottomImage: "https://i.postimg.cc/WpXYVLTt/4116f5db4d16401af882993b8c6bd22.png"
    },
    {
      id: 3,
      name: "品牌视觉手册",
      subtitle: "3D IP Brand Visual Identity & Design Guidelines Manual",
      desc: "专为次世代3D IP项目特别设计的极简、高级感品牌视觉延展手册。详细定义了专属标志组合、背景自适应运用规范、多终端展示安全距离，以及充满科技硬表面质感的UI排版格调。",
      type: "brand_手册",
      images: [
        "https://i.postimg.cc/GpfgZ6Dk/VI-shou-ce-01-feng-mian-ye.png",
        "https://i.postimg.cc/R0Ypj2tT/VI-shou-ce-02-se-cai-gui-fan.png",
        "https://i.postimg.cc/rFgJBvXf/VI-shou-ce-03-jiao-se-biao-zhun-zhi-tu.png",
        "https://i.postimg.cc/dV1Bw4Jt/VI-shou-ce-04-zhuang-bei-xi-tong-gui-fan.png",
        "https://i.postimg.cc/5ybBGmsP/VI-shou-ce-05-pin-pai-ying-yong-yan-zhan.png",
        "https://i.postimg.cc/Rhd7zn8q/VI-shou-ce-06-tu-xing-gai-nian-she-ji.png",
        "https://i.postimg.cc/7YB3s001/VI-shou-ce-07-tu-xing-yan-zhan.png",
        "https://i.postimg.cc/Sx3Wq4ZY/VI-shou-ce-08-tu-xing-gai-nian-yan-zhan.png",
        "https://i.postimg.cc/pTtzhZMR/VI-shou-ce-09-zi-ti-gui-fan.png"
      ]
    },
    {
      id: 4,
      name: "周边物料",
      subtitle: "IP Custom Merchandise, Package design & Lifestyle Goods",
      desc: "3D IP线下场景转化与实体周边物料视觉。深度探寻收藏级手办彩盒、便携背包、金属徽章等极智高品质生活装备的外皮包装和3D打样效果，传递硬派硬核的IP世界观张力。",
      type: "merch_物料",
      images: [
        "https://i.postimg.cc/J05fVPMc/zhan-shu-shao-nu-zhou-bian-xi-lie-shou-ji-ke-tao-zhuang.png",
        "https://i.postimg.cc/h48WdPTS/zhan-shu-shao-nu-zhou-bian-xi-lie-tong-kuan-er-ji-wai-she.png",
        "https://i.postimg.cc/Dy59xjxN/zhan-shu-shao-nu-zhou-bian-xi-lie-chan-pin-bao-zhuang-he-yu-quan-tao-zhan-shi.png",
        "https://i.postimg.cc/dtnb5HWq/zhan-shu-shao-nu-zhou-bian-xi-lie-T-xu-yu-hui-zhang-tao-zhuang.png"
      ]
    },
    {
      id: 5,
      name: "主视觉KV",
      subtitle: "IP Master Key Visual & Worldwide High-impact Posters",
      desc: "面向全球宣传发行的巨幕核心海报。每一幅均凝聚着多维次世代场景合成大片 and 高饱含生机色彩表现，用于各平台多渠道、游戏首发大厅背景的全维震撼铺设。",
      type: "kv",
      images: [
        "https://i.postimg.cc/vHn5tTGd/nu-jiao-se-zhan-shu-hai-bao.png",
        "https://i.postimg.cc/dt7Y07Gk/Image.png"
      ]
    }
  ];

  const currentProject = projects[activeProject];

  // Priority Image Preloader: load current project images first, then background preload other projects
  useEffect(() => {
    if (!currentProject) return;
    const currentImages = extractProjectImages(currentProject);
    const otherImages = projects
      .filter((_, idx) => idx !== activeProject)
      .flatMap(extractProjectImages);

    const cleanup = prioritizeProjectImages(currentImages, otherImages);
    return cleanup;
  }, [activeProject, currentProject]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden text-white"
    >
      {/* Absolute Close button to maintain screen real estate */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[160] p-2.5 text-white/50 hover:text-brand-orange hover:bg-white/10 bg-neutral-900/90 border border-white/10 backdrop-blur-md rounded-full active:scale-95 transition-all shadow-xl"
        title="关闭"
      >
        <X size={20} />
      </button>

      {/* Main Structural Applet */}
      <div className="w-full h-full flex flex-col md:flex-row pt-0 pb-0 overflow-hidden relative">
        
        {/* Left Sidebar - Design category list - Desktop only */}
        <div className="hidden md:flex md:w-80 border-r border-white/5 flex-col gap-4 p-6 bg-neutral-950/40 overflow-y-auto no-scrollbar shrink-0">
          
          <div className="space-y-4">
            <div className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase pb-1 border-b border-white/10">
              3D IP DESIGN / 3D IP设计
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {projects.map((proj, idx) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveProject(idx);
                  }}
                  className={`relative flex flex-col items-start gap-1 p-4 rounded-xl text-left transition-all duration-300 w-full border ${
                    activeProject === idx
                      ? "bg-orange-500/10 border-orange-500 text-white shadow-[0_4px_30px_rgba(249,115,22,0.15)]"
                      : "border-white/5 text-white/50 hover:text-white hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  {activeProject === idx && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  )}
                  <span className="text-[9px] font-mono text-orange-400 uppercase font-black tracking-wider">
                    PROJECT 0{idx + 1}
                  </span>
                  <span className="text-sm font-semibold font-sans text-white mt-0.5">
                    {proj.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AIGC Main Category Switcher (Desktop) - Repositioned below "主视觉KV" (Project 06) */}
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <div className="text-[9px] sm:text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase px-1">
              AIGC PROJECTS / AIGC大类切换
            </div>
            <div className="grid grid-cols-1 gap-1.5 px-1">
              {[
                { id: "kv", name: "游戏视觉设计", label: "Game Visuals", activeColor: "border-purple-500 bg-purple-500/10 text-purple-400" },
                { id: "char", name: "3D IP设计", label: "3D IP Design", activeColor: "border-orange-500 bg-orange-500/10 text-orange-400" },
                { id: "demo", name: "“新生”游戏Demo", label: "Indie Game Demo", activeColor: "border-green-500 bg-green-500/10 text-green-400" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigateTo?.(item.id as "char" | "kv" | "demo")}
                  className={`flex flex-col items-start px-3.5 py-2.5 rounded-xl border text-left transition-all duration-300 w-full ${
                    item.id === "char"
                      ? `${item.activeColor} shadow-[0_4px_15px_rgba(255,165,0,0.05)]`
                      : "border-white/5 text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase opacity-60">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold tracking-wide mt-0.5">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Center Workplane content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950/20 pt-14 px-5 pb-24 md:p-12 select-none"
        >
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            
            {/* Mobile-only Main AIGC Category Quick Switcher */}
            <div className="md:hidden grid grid-cols-3 gap-2 pb-2 pr-14">
              {[
                { id: "kv", name: "游戏视觉设计", activeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
                { id: "char", name: "3D IP设计", activeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
                { id: "demo", name: "游戏Demo", activeColor: "bg-green-500/20 text-green-400 border-green-500/30" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigateTo?.(item.id as "char" | "kv" | "demo")}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    item.id === "char"
                      ? `${item.activeColor} shadow-[0_4px_12px_rgba(255,165,0,0.08)]`
                      : "border-white/5 bg-neutral-900/60 text-white/50"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Mobile-only interactive custom selector */}
            <div className="md:hidden sticky top-0 z-50 w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 pr-14 shadow-2xl">
              <button
                onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-orange-400 font-extrabold uppercase tracking-wide">
                    IP PROJECT / 当前选择项目
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5 hover:text-orange-300 transition-colors">
                    <span>{currentProject.name}</span>
                    <span className="text-[10px] text-orange-400 align-middle">▼</span>
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-orange-400 transition-transform duration-300 ${isProjectsExpanded ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProjectsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-white/5 space-y-2"
                  >
                    {projects.map((proj, idx) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          setActiveProject(idx);
                          setIsProjectsExpanded(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                          activeProject === idx
                            ? "bg-orange-500/10 text-white border border-orange-500/30"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-orange-400">PROJECT 0{idx + 1}</span>
                          <span className="text-xs font-bold text-white mt-0.5">{proj.name}</span>
                        </div>
                        {activeProject === idx && <Check size={14} className="text-orange-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Layout Branching depending on type */}
            
            {/* TYPE 1: char_design (角色设计) -> 2 images of aspect-video, no labels, stacked vertically */}
            {currentProject.type === "char_design" && (
              <div className="flex flex-col gap-6 pt-2">
                {currentProject.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightboxImage(img)}
                    className="relative aspect-video rounded-[18px] overflow-hidden border border-white/10 bg-neutral-950/50 shadow-2xl group cursor-zoom-in active:scale-[0.99] transition-transform"
                  >
                    <img
                      src={img}
                      alt={`角色设计_${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TYPE 2: char_whitemodel (角色白模) -> 4 images of 3072X5504, 1 bottom image of 2307X1437, no labels */}
            {currentProject.type === "char_whitemodel" && (
              <div className="space-y-6 md:space-y-8 pt-2">
                
                {/* Responsive 4 Portrait Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
                  {currentProject.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImage(img)}
                      className="relative aspect-[3072/5504] w-full rounded-2xl md:rounded-[20px] overflow-hidden border border-white/5 bg-neutral-950/80 shadow-lg group cursor-zoom-in active:scale-[0.98] transition-all hover:border-orange-500/20"
                    >
                      <img
                        src={img}
                        alt={`角色白模高模_${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>

                {/* Landscape Bottom Image (2307x1437) */}
                {currentProject.bottomImage && (
                  <div
                    onClick={() => setLightboxImage(currentProject.bottomImage!)}
                    className="relative aspect-[2307/1437] w-full rounded-2xl md:rounded-[20px] overflow-hidden border border-white/5 bg-neutral-950/80 shadow-2xl group cursor-zoom-in active:scale-[0.99] transition-all hover:border-orange-500/20"
                  >
                    <img
                      src={currentProject.bottomImage}
                      alt="角色白模大场景渲染"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

              </div>
            )}

            {/* TYPE 3: ue5_render (UE5渲染) -> 4 images of 3072X5504, 1 bottom image of 2560X1440, no labels */}
            {currentProject.type === "ue5_render" && (
              <div className="space-y-6 md:space-y-8 pt-2">
                
                {/* 4 Portrait Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
                  {currentProject.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImage(img)}
                      className="relative aspect-[3072/5504] w-full rounded-2xl md:rounded-[20px] overflow-hidden border border-white/5 bg-neutral-950/80 shadow-lg group cursor-zoom-in active:scale-[0.98] transition-all hover:border-brand-orange/20"
                    >
                      <img
                        src={img}
                        alt={`UE5实机模型渲染_${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>

                {/* bottom landscape 16:9 image (2560x1440) */}
                {currentProject.bottomImage && (
                  <div
                    onClick={() => setLightboxImage(currentProject.bottomImage!)}
                    className="relative aspect-video w-full rounded-2xl md:rounded-[20px] overflow-hidden border border-white/5 bg-neutral-950/80 shadow-2xl group cursor-zoom-in active:scale-[0.99] transition-all hover:border-brand-orange/20"
                  >
                    <img
                      src={currentProject.bottomImage}
                      alt="UE5大环境合成主视觉"
                      className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

              </div>
            )}

            {/* TYPE 4, 5, 6: brand_手册, merch_物料, kv -> 16:9 images, vertical scrolling, no labels */}
            {(currentProject.type === "brand_手册" || currentProject.type === "merch_物料" || currentProject.type === "kv") && (
              <div className="space-y-6 md:space-y-8 pt-2">
                
                {/* Vertical Scroll List of adaptive 16:9 Cards */}
                <div className="flex flex-col gap-6 md:gap-8">
                  {currentProject.images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      onClick={() => setLightboxImage(img)}
                      className="relative aspect-video w-full rounded-2xl md:rounded-[20px] overflow-hidden border border-white/10 bg-neutral-950/80 shadow-2xl group cursor-zoom-in active:scale-[0.99] transition-all hover:border-orange-500/20"
                    >
                      <img
                        src={img}
                        alt={`${currentProject.name}_手册分单_${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* Extreme Fine Lightbox zooming viewport */}
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
            {/* Absolute close inside Lightbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-50"
            >
              <X size={22} />
            </button>

            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-full max-h-[88vh]"
            >
              <img
                src={lightboxImage}
                alt="3D IP Design Zoomed"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-3xl border border-white/10"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
