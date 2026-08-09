import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, ChevronDown, Check } from "lucide-react";

interface NewbornKvModalProps {
  onClose: () => void;
  onNavigateTo?: (target: "demo" | "kv" | "char") => void;
}

interface KvStage {
  title: string;
  image: string;
  desc: string;
}

interface KvProject {
  id: number;
  name: string;
  subtitle: string;
  desc: string;
  stages: {
    lineart: KvStage;
    whitemodel: KvStage;
    render3d: KvStage;
  };
}

export default function NewbornKvModal({ onClose, onNavigateTo }: NewbornKvModalProps) {
  const [activeProject, setActiveProject] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<"whitemodel" | "render3d">("whitemodel");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

  const islandRenderImages = [
    "https://i.postimg.cc/k4Dpd98G/1.png",
    "https://i.postimg.cc/MGpsyx9H/2.png",
    "https://i.postimg.cc/xCWtDmny/3.png",
    "https://i.postimg.cc/5NWns8Pf/4.png"
  ];

  const islandWhiteImages = [
    "https://i.postimg.cc/NjpDGSQh/11.png",
    "https://i.postimg.cc/7LhV59Lb/22.png",
    "https://i.postimg.cc/q7FGyKhv/33.png",
    "https://i.postimg.cc/KjSrsyDN/44.png"
  ];

  const islandImages = activeStage === "whitemodel" ? islandWhiteImages : islandRenderImages;

  // Four projects, each with lineart, whitemodel, and 3D render images
  const projects: KvProject[] = [
    {
      id: 0,
      name: "项目一：黑暗凝视",
      subtitle: "Newborn Key Character & Epic Worldview Development",
      desc: "聚焦于旅人主角‘小芒’在广袤黄昏氛围环境下的特写刻画，呈现人与自然的共生张力。",
      stages: {
        lineart: {
          title: "黄金双极点：主角与生态伴侣构图网格线稿",
          image: "https://i.postimg.cc/d0PBZGXF/wei-xin-tu-pian-20260525141215.png",
          desc: "早期视线透视规划稿。采用对角线黄金分割线构图，将主角视线精确引向右侧象征未来新生的微茫，并利用大画幅的沙丘背光线形成完美的视觉进深。"
        },
        whitemodel: {
          title: "人物与机械伴侣拟真光影白模体块设计",
          image: "https://i.postimg.cc/Y2nzf5ZK/wei-xin-tu-pian-20260525141220.png",
          desc: "恐怖主题3D渲染，巨大的邪恶玩偶（类似鬼娃恰吉），诡异的笑容，额头有缝合线，空洞的眼睛，巨大的手抓着一面破旧的木质字母积木墙，积木上刻着名字和字母，嵌着破碎的玩偶零件，下方有两个穿着复古探险装备（礼帽、背包、提灯）的渺小探险家仰头观望，其中一个拿着望远镜，低角度仰拍，强烈的大小对比，强迫透视，超高细节高模，从破天花板窗户射入的体积光丁达尔效应，大气薄雾和灰尘粒子，柔和阴影，诡异压抑的氛围，废弃的玩具厂内部，天花板悬挂着残破的玩偶零件，蛛网，堆满废弃玩具的杂乱货架，8K分辨率，虚幻引擎5渲染，Octane渲染，光线追踪，环境光遮蔽"
        },
        render3d: {
          title: "最终色彩落定：落日微尘全真次世代环境渲染",
          image: "https://i.postimg.cc/SKfWX3C3/LOGO.png",
          desc: "游戏宣传海报，次世代 3D 卡通渲染，暗黑恐怖童话风格，巨大的鬼娃玩偶（额头缝合线、诡异咧嘴笑、疯狂大眼、雀斑、破洞熊耳兜帽），巨手抓着嵌有玩偶残肢的彩色积木墙，下方两个微缩复古探险家（礼帽、背包、提灯、望远镜）仰头观望，低角度仰拍，强烈大小对比，废弃玩具厂废墟场景，天花板悬挂残破玩偶零件，蛛网、灰尘、杂乱玩具货架，暖橙色提灯光与冷蓝色月光对比，体积光丁达尔效应，电影级明暗对比，左上角 “CURSE DEADWOOD” logo，左下角 “黑暗凝视 FROM THE DARKNESS” 标题，右上角 Steam/PS5 平台标识，高细节 PBR 材质，压迫感氛围"
        }
      }
    },
    {
      id: 1,
      name: "项目二：光环战役",
      subtitle: "Sandstorm Purifier & Ancient Level Environments",
      desc: "展现风暴交界处的宏大防风屏障与古代巨型取水蓄能装置设计，建立完整的箱庭世界观结构。",
      stages: {
        lineart: {
          title: "古代庇护所与蓄能泵关卡线格构想草图",
          image: "https://i.postimg.cc/GtpxHWfn/mmt-Rf-ONc-Pj-Y-zi-yuan-7.webp",
          desc: "荒野关卡的地貌与功能性规划线框图。在此环节合理分布绿洲培育坑、悬崖滑坡地道和古代导流阀门的物理对立关系，利用高度落差设计探索动线。"
        },
        whitemodel: {
          title: "地表固沙物理屏障与阶梯渠道体块灰模测试",
          image: "https://i.postimg.cc/CMrwDLJb/b1bf667147d20298db2d8c659d108a0.png",
          desc: "《光环》士官长（Master Chief）3D 高模白模渲染，无材质无纹理，纯灰度 clay render，Mark VI 动力装甲硬表面细节，动态战斗冲锋姿势，手持突击步枪，单手撑在破碎的太空飞船残骸上，爆炸飞溅的碎片粒子，干净浅灰色背景，工作室布光，仅靠光影表现结构与体积感，ZBrush 雕刻质感，次世代游戏建模，高细节机械结构，强烈动作张力，无色彩无纹理，8K 超高清，电影级构图"
        },
        render3d: {
          title: "远期能量传输祭坛Lumen超高精度材质渲染",
          image: "https://i.postimg.cc/DwrVC2Qq/shi-guan-zhang-hai-bao.png",
          desc: "《光环》士官长游戏宣传海报，次世代 PBR 渲染，史诗科幻战争风格，士官长身着橄榄绿 Mark VI 动力装甲，动态冲锋战斗姿势，手持突击步枪，撑在破碎太空残骸上，背景是深邃宇宙与带光晕的行星，爆炸飞溅的碎片粒子，强烈逆光与丁达尔体积光，冷色调史诗光影，左下角中文宣传文字 “传奇永不熄灭 守护人类最后的希望！2 月 10 日，全新战役开启，捍卫家园，决战星海！”，高细节机甲纹理，硬表面质感，电影级构图，压迫感与史诗感，8K 超高清游戏 CG 画质"
        }
      }
    },
    {
      id: 2,
      name: "项目三：PUBG赛事",
      subtitle: "Degradation Oasis & First Planting Pod",
      desc: "展示荒芜岩质废墟、碎石堆地表地貌。玩家在此部署首个智能净沙泵，唤醒抗旱绿植林带进行固沙防暴风净化。",
      stages: {
        lineart: {
          title: "退化区水土引流与引力堰管道剖面线谱",
          image: "https://fsu.creght.com/project/nWxSaIqWoOa/mmAiEYmxUnj__关卡1.png?w=3072&fmt=webp",
          desc: "精准推演阶梯水堰的连水管道排布，建立多级流动水阻测算系统，确保水利自流灌溉。"
        },
        whitemodel: {
          title: "4张 504x864 竖构图：绿洲生态种植点灰体白模展示",
          image: "https://i.postimg.cc/NjpDGSQh/11.png",
          desc: "次世代射击游戏角色建模白模，4 张竖版圆角分镜并排展示，无材质无纹理纯灰度 clay render，工作室柔和布光，仅靠光影表现服装褶皱与人体结构，4 个不同造型的特工角色，干净浅灰渐变背景，高模雕刻质感，无色彩无特效，建模展示风格，8K 超高清"
        },
        render3d: {
          title: "4张 504x864 竖构图：各种植点生境 Lumen 实机高级材质渲染",
          image: "https://i.postimg.cc/k4Dpd98G/1.png",
          desc: "次世代战术射击游戏角色宣传海报，4 张竖版圆角矩形分镜并排展示，纯黑背景，暗调赛博战术风格，主色调深黑 + 荧光绿 / 霓虹绿，电影级侧逆光 + 边缘光，冷峻压抑氛围，4 个不同造型的特工角色，高细节游戏 CG 质感，皮肤与服装纹理真实，带故障风 “GAME TIME” 文字与科技 HUD 界面，轻微胶片颗粒，体积光，8K 超高清"
        }
      }
    }
  ];

  const currentProject = projects[activeProject];
  const currentStageData = currentProject.stages[activeStage];

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

      {/* Main Container */}
      <div className="w-full h-full flex flex-col md:flex-row pt-0 pb-0 overflow-hidden relative">
        
        {/* Left Sidebar - Projects Selection & Progress stages (Desktop only) */}
        <div className="hidden md:flex md:w-80 border-r border-white/5 flex-col gap-4 p-6 bg-neutral-950/30 overflow-y-auto no-scrollbar shrink-0">
          
          <div className="space-y-3">
            <div className="text-[9px] sm:text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase pb-1">
              SELECT PROJECT / 选择研发项目
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {projects.map((proj, idx) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveProject(idx);
                    setActiveStage("whitemodel");
                  }}
                  className={`relative flex flex-col items-start gap-1 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 w-full border ${
                    activeProject === idx
                      ? "bg-purple-600/10 border-purple-500 text-white shadow-[0_4px_25px_rgba(168,85,247,0.15)]"
                      : "border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {activeProject === idx && (
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  )}
                  <span className="text-[9px] font-mono text-purple-400 uppercase font-black">
                    PROJECT 0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide font-sans font-bold text-white mt-1">
                    {proj.name.split("：《")[1]?.replace("》", "") || proj.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AIGC Main Category Switcher (Desktop) - Repositioned at bottom of sidebar */}
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
                    item.id === "kv"
                      ? `${item.activeColor} shadow-[0_4px_15px_rgba(168,85,247,0.05)]`
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

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950/20 pt-14 px-5 pb-24 md:p-12">
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
                    item.id === "kv"
                      ? `${item.activeColor} shadow-[0_4px_12px_rgba(168,85,247,0.08)]`
                      : "border-white/5 bg-neutral-900/60 text-white/50"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* On Mobile: Collapsible Project Accordion Selector */}
            <div className="md:hidden sticky top-0 z-50 w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 pr-14 shadow-2xl">
              <button
                onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-purple-400 font-extrabold uppercase tracking-wide select-none">
                    ACTIVE PROJECT / 当前选择项目
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5 hover:text-purple-300 transition-colors">
                    <span>{currentProject.name}</span>
                    <span className="text-[10px] text-purple-400 align-middle">▼</span>
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-purple-400 transition-transform duration-300 ${isProjectsExpanded ? "rotate-180" : ""}`}
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
                          setActiveStage("whitemodel");
                          setIsProjectsExpanded(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                          activeProject === idx
                            ? "bg-purple-600/10 text-white border border-purple-500/30"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-purple-400">PROJECT 0{idx + 1}</span>
                          <span className="text-xs font-bold text-white mt-0.5">{proj.name}</span>
                        </div>
                        {activeProject === idx && <Check size={14} className="text-purple-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Master Fullscreen Image Block */}
            {currentProject.id === 2 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 w-full">
                {islandImages.map((imgUrl, i) => (
                   <div
                     key={i}
                     onClick={() => setLightboxImage(imgUrl)}
                     className="relative aspect-[504/864] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-xl group cursor-zoom-in transition-all duration-300 hover:border-purple-500/40"
                   >
                     <img
                       src={imgUrl}
                       alt={`Island ${i + 1}`}
                       className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                     />
                   </div>
                ))}
              </div>
            ) : (
              <div 
                className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group cursor-zoom-in"
                onClick={() => setLightboxImage(currentStageData.image)}
              >
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={`${activeProject}-${activeStage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    src={currentStageData.image}
                    alt={currentStageData.title}
                    className="w-full h-full object-contain absolute inset-0 group-hover:scale-[1.02] transition-transform duration-700 ease-out opacity-100"
                  />
                </AnimatePresence>
              </div>
            )}

            {/* Bottom-positioned progress switcher bar */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-2.5 md:gap-4">
                <button
                  onClick={() => setActiveStage("whitemodel")}
                  className={`p-3 rounded-xl border transition-all duration-300 text-center ${
                    activeStage === "whitemodel"
                      ? "bg-purple-600/15 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white"
                      : "border-white/5 bg-neutral-950/40 text-white/60 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold block">白模渲染</span>
                </button>

                <button
                  onClick={() => setActiveStage("render3d")}
                  className={`p-3 rounded-xl border transition-all duration-300 text-center ${
                    activeStage === "render3d"
                      ? "bg-purple-600/15 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white"
                      : "border-white/5 bg-neutral-950/40 text-white/60 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold block">材质渲染</span>
                </button>
              </div>
            </div>

            {/* Description Card of current stage details */}
            <div className="p-4 sm:p-5 bg-neutral-900/40 border border-white/5 rounded-2xl space-y-1.5">
              {(currentProject.id === 0 || currentProject.id === 1 || currentProject.id === 2) && (activeStage === "whitemodel" || activeStage === "render3d") ? (
                <div className="text-xs font-bold text-brand-orange">提示词</div>
              ) : (
                <div className="text-xs font-bold text-brand-orange">提示词：{currentStageData.title}</div>
              )}
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed select-text">{currentStageData.desc}</p>
            </div>

          </div>
        </div>

      </div>

      {/* Lightbox Zoom Layer */}
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
