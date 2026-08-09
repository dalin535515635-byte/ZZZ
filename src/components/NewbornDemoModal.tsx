import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Compass, User, Image as ImageIcon, Map, Sparkles, Globe, Eye, 
  Play, Pause, ChevronLeft, ChevronRight, RotateCw, Monitor, Layers, 
  MapPin, Milestone, Leaf, Video, RefreshCw, Check, Menu, ChevronDown 
} from "lucide-react";

interface NewbornDemoModalProps {
  onClose: () => void;
  onNavigateTo?: (target: "demo" | "kv" | "char") => void;
}

export default function NewbornDemoModal({ onClose, onNavigateTo }: NewbornDemoModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "characters" | "islands" | "ue5">("overview");
  const [selectedCharId, setSelectedCharId] = useState<"xiaomang" | "tanzai">("xiaomang");
  const [lightboxImage] = useState<string | null>(null);
  const setLightboxImage = (_url: string | null) => {};
  const [isFloatMenuOpen, setIsFloatMenuOpen] = useState(false);
  const [isTabsExpanded, setIsTabsExpanded] = useState(false);

  // States for interactive carousels & stacked slots
  const [stackedIndex, setStackedIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [blueprintCarouselIdx, setBlueprintCarouselIdx] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoTime, setVideoTime] = useState("01:24");
  const [videoProgress, setVideoProgress] = useState(42);

  // Simulation timer for video progress
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Autoplay effect for character draft stacked carousel (3.5 seconds frequency)
  useEffect(() => {
    let timer: any;
    if (activeTab === "characters" && !isAutoplayPaused) {
      timer = setInterval(() => {
        setStackedIndex((prev) => (prev + 1) % 3);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [activeTab, isAutoplayPaused]);

  // Character Data containingCloseup avatars (4:4 ratio) and 3 sequential stacked illustrations (16:9 ratio)
  const characters = {
    xiaomang: {
      name: "小芒",
      englishName: "Xiaomang",
      height: "130cm",
      role: "郊外野生探险者 (Wild Explorer)",
      personality: "好奇心驱动型行动派，对未知事物充满执念，遇到谜题会极力思索（脑袋冒齿轮特效），但偶尔会因冲动踩坑（比如误把别人埋的破烂当宝藏）。",
      visuals: "带极高实用性的防晒探险装束：宽檐探险草帽，帽顶配明亮探照灯（兼具夜间探测与热能供应）；活力十足的橙色短袖T恤与舒适浅蓝色短裤，极配户外沙地上刨土和攀爬；棕色工装靴耐磨防滑，携帆布背包内置军工铲及详细地形图。",
      // 4:4 closeup portrait placeholder (elegant mockup focus)
      portrait: "https://i.postimg.cc/RVMjThjk/Snipaste-2026-05-21-15-15-51.png",
      // 3 Stacked overlays
      drafts: [
        {
          title: "小芒全身设计草稿",
          url: "https://i.postimg.cc/Y9zd4fqf/mmt-Sw-WIKy-Kt-san-shi-tu-cao-gao.webp",
          desc: "角色全身多视角起稿，确定草帽比例与背包结构细节"
        },
        {
          title: "熊宝2D模型上色与精细渲染",
          url: "https://i.postimg.cc/GtpxHWfn/mmt-Rf-ONc-Pj-Y-zi-yuan-7.webp",
          desc: "数码原画完成稿，明确服装材质高光与草帽编织凹凸感"
        },
        {
          title: "沙地场景试行手绘KV稿",
          url: "https://i.postimg.cc/J4fjLHMv/mm-An-CAKKVFU-2mu-biao.webp",
          desc: "结合荒沙背景的气质氛围稿，展示主角极佳的行动力和坚毅神情"
        }
      ]
    },
    tanzai: {
      name: "炭仔",
      englishName: "Tanzai",
      height: "80cm",
      role: "原生林地守护精灵 (Native Forest Sprite)",
      personality: "守护森林地心之源的 “暖晶矿”，生命源泉与其息息相关。对外来者充满强烈的天然防备、警惕，但由于天生孤单缺乏伙伴，极易被体贴的善意所触动，对温暖非常依恋。",
      visuals: "圆滚滚浑然天成的黑色胶质身躯，由火山冷却后的黑耀熔岩胶凝结而成，具有独特微小且富有生机的凹凸斑驳质感；头顶带有橙红色微闪透红的晶莹晶核，晶核亮度和形态根据呼吸及情绪波澜变幻。极度依恋探照灯热度。",
      // 4:4 closeup portrait placeholder (elegant mockup focus)
      portrait: "https://i.postimg.cc/x1LMTjd1/Snipaste-2026-05-21-15-16-36.png",
      // 3 Stacked overlays
      drafts: [
        {
          title: "精灵炭仔概念初探",
          url: "https://i.postimg.cc/yNB9JqJ9/mmt-SJDp-KZBo-zi-yuan-10.webp",
          desc: "设计灵根，探讨火山岩浆滴落冷凝之后的神秘黑色胶体设定"
        },
        {
          title: "晶体核心能量发散渲染",
          url: "https://i.postimg.cc/6Q5rjJ9s/mmt-Sahl-Bird-zi-yuan-11.webp",
          desc: "细化头顶能量晶核高透反光形态，使眼神富于傲娇感"
        },
        {
          title: "绿森林守护全态示意图",
          url: "https://i.postimg.cc/FRCJn7T2/mm-An-OHHiz-Av-2mu-biao2.webp",
          desc: "展示炭仔汲取光能热度并逐渐解开敌意、接纳主角之后的平和姿态"
        }
      ]
    }
  };

  // Islands and Level Segment Branch Data (4 branch pathways surrounding the main map)
  const islands = [
    {
      id: "island-1",
      num: "01",
      title: "沙尘退化地 - 岛屿01",
      objective: "了解当前环境的荒漠化状况，种植绿植",
      task: "清理场景中的大片陈年垃圾和废旧塑料，勘测优质绿地，寻找并在合适的位置小心地点种下第一批抗旱低耗植物。",
      image: "https://i.postimg.cc/FRHTLkfJ/mmt-TAy-Wwhnq-dao1.webp"
    },
    {
      id: "island-2",
      num: "02",
      title: "灌溉延伸区 - 岛屿02",
      objective: "熟悉周边干涸环境，进行绿色扩建",
      task: "开发及巩固新水源，扩建大规模抗旱植物种植地，建立小型水利收集设施，不断繁育林带，吸引周边少量游离居民入驻并增加人口。",
      image: "https://i.postimg.cc/d1V5yZ7n/mmt-TAMRHLl-J-dao2.webp"
    },
    {
      id: "island-3",
      num: "03",
      title: "狂风阻截地 - 岛屿03",
      objective: "保护新生树木，抵御沙尘暴风沙，修建林带工程",
      task: "沙暴来临，拉起预警警报并搭建大型防沙栅栏及沙障，组织灌溉保护脆弱的新木，通过科学合理的物理防砂层抵御强大风沙的倾吞。",
      image: "https://i.postimg.cc/tT4Bxn1K/mmt-TAZm-Ig-Xj-dao3.webp"
    },
    {
      id: "island-4",
      num: "04",
      title: "生态修复区 - 岛屿04",
      objective: "评估生态自我恢复的丰硕成果，建立绿色标本室",
      task: "跟踪各种生态指标的增长，细致记录植株的生长周期曲线、繁育变迁，完整登记多样化植物图鉴资料并丰富环境图库。",
      image: "https://i.postimg.cc/XJ1QcNdS/mmt-TBkihi-ML-dao4.webp"
    }
  ];

  // Under Level tab: Detailed Level Manuals 5-image interactive slideshow carousel
  const blueprintCarousel = [
    { title: "图1", image: "https://i.postimg.cc/Hx3s6RsN/mm-Afw-MUXy-SM-zi-yuan-17.webp", region: "" },
    { title: "图2", image: "https://i.postimg.cc/QCyN3776/mm-Afx-AGj-Awn-zi-yuan-19.webp", region: "" },
    { title: "图3", image: "https://i.postimg.cc/ZY753GQg/mm-Afx-Yaj-JNn-zi-yuan-18.webp", region: "" },
    { title: "图4", image: "https://i.postimg.cc/CLRL4vyW/mm-Afy-Ll-SXd-T-zi-yuan-20.webp", region: "" },
    { title: "图5", image: "https://i.postimg.cc/cHJNLHds/mm-Adyba-MFn-O-zi-yuan-15.webp", region: "" }
  ];

  // Consolidated scenes and plants lists explicitly requested (5 scenes, 3 plants)
  const ue5Scenes = [
    { title: "迷雾密林废墟实机测试", image: "https://i.postimg.cc/Hx3s6RsN/mm-Afw-MUXy-SM-zi-yuan-17.webp" },
    { title: "古树祭坛能量枢纽渲染", image: "https://i.postimg.cc/QCyN3776/mm-Afx-AGj-Awn-zi-yuan-19.webp" },
    { title: "绿茵岛地森林实机材质表现", image: "https://i.postimg.cc/ZY753GQg/mm-Afx-Yaj-JNn-zi-yuan-18.webp" },
    { title: "探险荒林清晨光影测试", image: "https://i.postimg.cc/CLRL4vyW/mm-Afy-Ll-SXd-T-zi-yuan-20.webp" },
    { title: "黄昏生态灌排系统远望", image: "https://i.postimg.cc/cHJNLHds/mm-Adyba-MFn-O-zi-yuan-15.webp" }
  ];

  // Handle stacked rotation index
  const nextStacked = () => {
    setStackedIndex((prev) => (prev + 1) % 3);
  };

  const handleScrollWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setStackedIndex((prev) => (prev + 1) % 3);
    } else {
      setStackedIndex((prev) => (prev - 1 + 3) % 3);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden"
    >
      {/* Modern Floating Close Button to save vertical height */}
      <button
        onClick={onClose}
        className="fixed top-3.5 right-3.5 z-[150] p-2 text-white/60 hover:text-green-400 hover:bg-white/10 bg-neutral-950/80 border border-white/10 backdrop-blur-md rounded-full active:scale-95 transition-all shadow-lg"
        title="关闭"
      >
        <X size={18} />
      </button>

      {/* Main Layout */}
      <div className="w-full h-full flex flex-col md:flex-row pt-0 pb-0 overflow-hidden relative">
        
        {/* Left Side Sidebar - Tabs Navigation */}
        <div className="hidden md:flex md:w-80 border-r border-white/5 flex-col gap-4 p-6 bg-neutral-950/30 overflow-y-auto no-scrollbar shrink-0">
          
          <div className="space-y-4">
            <div className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase pb-1 border-b border-white/10">
              GAME DEMO / “新生”游戏研发
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: "overview", name: "游戏设定与规划", subtitle: "STAGE 01 / 设定规划" },
                { id: "characters", name: "核心角色美术", subtitle: "STAGE 02 / 关卡角色" },
                { id: "islands", name: "关卡规划与场景", subtitle: "STAGE 03 / 地图场景" },
                { id: "ue5", name: "UE5 实机渲染", subtitle: "STAGE 04 / 实机影像" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex flex-col items-start gap-1 p-4 rounded-xl text-left transition-all duration-300 w-full border ${
                    activeTab === tab.id
                      ? "bg-green-500/10 border-green-500 text-white shadow-[0_4px_30px_rgba(34,197,94,0.15)]"
                      : "border-white/5 text-white/50 hover:text-white hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                  <span className="text-[9px] font-mono text-green-400 uppercase font-black tracking-wider">
                    {tab.subtitle}
                  </span>
                  <span className="text-sm font-semibold font-sans text-white mt-0.5">
                    {tab.name}
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
                    item.id === "demo"
                      ? `${item.activeColor} shadow-[0_4px_15px_rgba(34,197,94,0.05)]`
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

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950/20 pt-14 px-5 pb-24 md:p-12 select-none">
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
                  item.id === "demo"
                    ? `${item.activeColor} shadow-[0_4px_12px_rgba(34,197,94,0.08)]`
                    : "border-white/5 bg-neutral-900/60 text-white/50"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

            {/* Mobile-only interactive custom selector (dropdown) */}
            <div className="md:hidden sticky top-0 z-50 w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 pr-14 shadow-2xl select-none">
              <button
                onClick={() => setIsTabsExpanded(!isTabsExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-green-400 font-extrabold uppercase tracking-wide">
                    DEMO CATEGORY / 当前选择板块
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5 hover:text-green-400 transition-colors">
                    <span>
                      {activeTab === "overview" && "游戏设定与规划"}
                      {activeTab === "characters" && "核心角色美术"}
                      {activeTab === "islands" && "关卡规划与场景"}
                      {activeTab === "ue5" && "UE5 实机渲染"}
                    </span>
                    <span className="text-[10px] text-green-400 align-middle">▼</span>
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-green-400 transition-transform duration-300 ${isTabsExpanded ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isTabsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-white/5 space-y-2"
                  >
                    {[
                      { id: "overview", name: "游戏设定与规划" },
                      { id: "characters", name: "核心角色美术" },
                      { id: "islands", name: "关卡规划与场景" },
                      { id: "ue5", name: "UE5 实机渲染" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setIsTabsExpanded(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                          activeTab === tab.id
                            ? "bg-green-500/10 text-white border border-green-500/30"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white mt-0.5">{tab.name}</span>
                        </div>
                        {activeTab === tab.id && <Check size={14} className="text-green-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          <AnimatePresence mode="wait">
            
            {/* Overview / Worldview Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <div>
                  <h2 className="text-green-400 text-xs font-mono tracking-[0.5em] uppercase mb-3">// PROJECT SYNOPSIS</h2>
                  <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">游戏介绍</h3>
                  <div className="w-16 h-[2px] bg-green-500 mt-6" />
                </div>

                {/* 16:9 Main Visual Key Visual (KV) Area */}
                <div id="root_kv_element" className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)] border border-white/10 bg-neutral-950 group">
                  <img
                    src="https://i.postimg.cc/BtWM8Y9y/mlv-ERhcvlqc-zi-yuan-5.webp"
                    alt="新生 16:9 主视觉 Key Visual"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100 cursor-default"
                    onClick={() => setLightboxImage("https://i.postimg.cc/BtWM8Y9y/mlv-ERhcvlqc-zi-yuan-5.webp")}
                  />
                  {/* No label overlay */}
                </div>



                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Worldview */}
                  <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col space-y-4">
                    <div className="text-green-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                      <Globe size={16} />
                      <span>游戏世界观</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed grow select-text">
                      背景设定在面临生态危机的虚拟辽阔大陆。随着恶性气候退化、人类过度耕作、高强度森林砍伐，土地日渐被沙海吞没。作为最后的林业守护者，玩家需要阻止退化，并最终探索出这股环境异化尘沙风暴底下的远古奥秘。
                    </p>
                  </div>

                  {/* Card 2: Gameplay */}
                  <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col space-y-4">
                    <div className="text-green-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                      <Sparkles size={16} />
                      <span>生态玩法机制</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed grow select-text">
                      多维度策略管理：玩家需要智慧划配有限水源与高价值防沙材料，科学实施低耗点树、区域灌溉、构架巨型物理木网防沙障。通过收获肥沃绿叶、增加生态恢复点，逐步解锁更多迷雾大陆废墟、以及神秘地宫绿洲。
                    </p>
                  </div>

                  {/* Card 3: Visual Style */}
                  <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col space-y-4">
                    <div className="text-green-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                      <ImageIcon size={16} />
                      <span>艺术视觉风格</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed grow select-text">
                      介于<strong>精致Q版卡通与多细节写实</strong>之间。线条明晰流畅，饱和度生机盎然又富有克制感，整体比例极其考究，部分采用极富想象力、艺术夸张感的奇境异植设定。
                    </p>
                  </div>
                </div>

                {/* Additional Concept section */}
                <div className="border border-white/5 bg-neutral-950/40 p-8 rounded-2xl space-y-4">
                  <h4 className="text-white font-semibold text-lg">前瞻交互创意 (Interactive AR Experience)</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    本策划草案同步设计了新颖的<strong>AR互动探索模式</strong>。用户可以通过移动设备的透视AR镜头，将真实空间投影与游戏中的干涸箱庭地编融合。通过手指点按或扫射，不仅可观察沙化植被粒子沙暴侵蚀的演化模拟，也可用手势模拟召唤地表水源进行洒水，感受高科技生态互动之美。
                  </p>
                </div>
              </motion.div>
            )}

            {/* Characters Tab - Features Square Portrait and Slidewheel overlay stacked images */}
            {activeTab === "characters" && (
              <motion.div
                key="characters"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto space-y-12 text-white"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-end gap-6 pb-6 border-b border-white/5">
                  {/* Toggle Selector Buttons */}
                  <div className="flex bg-neutral-900 p-1.5 rounded-xl border border-white/5 gap-2 select-none">
                    <button
                      onClick={() => {
                        setSelectedCharId("xiaomang");
                        setStackedIndex(0);
                      }}
                      className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                        selectedCharId === "xiaomang"
                          ? "bg-green-500 text-black font-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      小芒 (熊宝)
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCharId("tanzai");
                        setStackedIndex(0);
                      }}
                      className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                        selectedCharId === "tanzai"
                          ? "bg-green-500 text-black font-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      炭仔 (原生精灵)
                    </button>
                  </div>
                </div>

                {/* Character Detail Layout featuring 4:4 and Stacked 16:9 Wheel region */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* 4:4 Showcase Square Area for Active Character */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl group cursor-default">
                      <img
                        src={characters[selectedCharId].portrait}
                        alt={`${characters[selectedCharId].name} 4:4 Closeup`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onClick={() => setLightboxImage(characters[selectedCharId].portrait)}
                      />
                    </div>
                  </div>

                  {/* Widescreen 16:9 carousel (Interactive wheel/button change with self-adaptation) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase">
                        【角色设计展示】 GALLERY SLIDER
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                        <RotateCw size={12} className="animate-spin-slow" />
                        <span>滚动鼠标或按两侧按键切换</span>
                      </div>
                    </div>

                    {/* Magnified Image Slider Frame */}
                    <div 
                      onWheel={handleScrollWheel}
                      onMouseEnter={() => setIsAutoplayPaused(true)}
                      onMouseLeave={() => setIsAutoplayPaused(false)}
                      className="relative h-[340px] md:h-[440px] w-full rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    >
                      <div className="absolute inset-0 bg-neutral-950/30 pointer-events-none z-10" />

                      {/* Display current active slide */}
                      <div className="relative w-full h-full max-w-full overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${selectedCharId}-${stackedIndex}`}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={() => setLightboxImage(characters[selectedCharId].drafts[stackedIndex].url)}
                            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
                          >
                            <img
                              src={characters[selectedCharId].drafts[stackedIndex].url}
                              alt={characters[selectedCharId].drafts[stackedIndex].title}
                              className="w-full h-full object-contain select-none"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Left control arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStackedIndex((prev) => (prev - 1 + 3) % 3);
                        }}
                        className="absolute left-4 p-2.5 rounded-full bg-black/70 hover:bg-green-500 border border-white/10 text-white hover:text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-30 active:scale-90"
                        title="上一个手稿"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Right control arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStackedIndex((prev) => (prev + 1) % 3);
                        }}
                        className="absolute right-4 p-2.5 rounded-full bg-black/70 hover:bg-green-500 border border-white/10 text-white hover:text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-30 active:scale-90"
                        title="下一个手稿"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-6 right-6 md:right-8 flex gap-2 z-30 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                        {characters[selectedCharId].drafts.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setStackedIndex(i);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              stackedIndex === i ? "w-6 bg-green-500" : "w-1.5 bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Narrative Description Area */}
                    <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-green-500/10 text-green-400 font-bold font-mono px-2.5 py-0.5 rounded-full border border-green-500/20">
                          {selectedCharId === "xiaomang" ? "CHAR_EXPLORER" : "CHAR_FOREST_GUARDIAN"}
                        </span>
                        <div className="text-white font-semibold text-lg">{characters[selectedCharId].name} 全套档案</div>
                      </div>

                      <p className="text-white/80 text-sm leading-relaxed select-text">
                        <strong>角色介绍：</strong>{characters[selectedCharId].personality}
                      </p>
                      <p className="text-white/60 text-xs leading-relaxed select-text">
                        <strong>视觉亮点：</strong>{characters[selectedCharId].visuals}
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* Islands & Level Blueprint Tab (Features widescreen complete map & 4 detailed regional branch sectors) */}
            {activeTab === "islands" && (
              <motion.div
                key="islands"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                {/* 1. Complete Widescreen Worldmap / Blueprint Showcase */}
                <div className="space-y-3">
                  <div className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase">【主区域中轴：全景生态沙盘规划总图景 (MAIN WORLD BLUEPRINT)】</div>
                  
                  <div className="relative w-full aspect-video md:h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl group cursor-default">
                    <img
                      src="https://i.postimg.cc/Pq46JQqh/mmt-TAaj-ITEp-tu-pian.webp" // 4大陆岛屿立体互联架构图
                      alt="《新生》关卡防御沙化演变总图景"
                      className="w-full h-full object-contain bg-neutral-950 opacity-80 group-hover:opacity-100 transition-all duration-700 brightness-[0.9]"
                      onClick={() => setLightboxImage("https://i.postimg.cc/Pq46JQqh/mmt-TAaj-ITEp-tu-pian.webp")}
                    />
                    <div className="absolute inset-0 bg-neutral-950/40 pointer-events-none" />
                    
                    {/* Retro Grid Mesh overlay style to make it look like a high-tech viewport blueprint */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(242,125,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(242,125,38,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                    {/* Overlay descriptive HUD */}
                    <div className="absolute bottom-6 left-6 md:left-10 text-left pointer-events-none max-w-lg">
                      {/* Badge removed */}
                      {/* Title removed */}
                      <p className="text-white/60 text-xs mt-1 hidden md:block">
                        此顶层设计支持沙盘内四季及气温流动交互，水源由此向各岛延伸。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. 4 Small Regional Branch Grid Layout Underneath Map */}
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {islands.map((island) => (
                      <div
                        key={island.id}
                        className="group bg-neutral-900/40 p-3 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all duration-300"
                      >
                        {/* Simulated mini blueprint visual */}
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-neutral-950">
                          <img
                            src={island.image}
                            alt={island.title}
                            className="w-full h-full object-contain bg-neutral-950/90 opacity-100 cursor-default"
                            onClick={() => setLightboxImage(island.image)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Slider Widescreen slideshow - Bottom Carousel block containing 5 beautiful swappable 16:9 images */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase">
                      【关卡精细图库（16：9 轮播幻灯片切换）】 BLUEPRINTS SLIDER
                    </div>
                    
                    {/* Index markers */}
                    <div className="text-xs font-mono text-white/50">
                      <span className="text-green-400 font-bold">0{blueprintCarouselIdx + 1}</span> / 05
                    </div>
                  </div>

                  <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={blueprintCarouselIdx}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={blueprintCarousel[blueprintCarouselIdx].image}
                          alt={blueprintCarousel[blueprintCarouselIdx].title}
                          className="w-full h-full object-contain cursor-default"
                          onClick={() => setLightboxImage(blueprintCarousel[blueprintCarouselIdx].image)}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Pre & Next Slider togglers */}
                    <button
                      onClick={() => setBlueprintCarouselIdx((prev) => (prev - 1 + 5) % 5)}
                      className="absolute left-4 p-3 rounded-full bg-black/80 hover:bg-green-500 border border-white/10 text-white hover:text-black transition-colors"
                      title="上一个图纸"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={() => setBlueprintCarouselIdx((prev) => (prev + 1) % 5)}
                      className="absolute right-4 p-3 rounded-full bg-black/80 hover:bg-green-500 border border-white/10 text-white hover:text-black transition-colors"
                      title="下一个图纸"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-6 right-6 md:right-10 flex gap-2">
                      {blueprintCarousel.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setBlueprintCarouselIdx(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            blueprintCarouselIdx === i ? "w-8 bg-green-500" : "w-2 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* UE5 Rendering Gallery Tab - Widescreen Movie/Engine test player + 5 scenes/3 plants listings */}
            {activeTab === "ue5" && (
              <motion.div
                key="ue5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                {/* 1. 16:9 Main Area - Real Video Playback Engine Zone */}
                <div className="space-y-3">
                  <div className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase flex items-center gap-2">
                    <Video size={12} className="text-green-400 animate-pulse" />
                    <span>【16：9 引擎大世界生态实机测试视频 (REALTIME RENDER VIEWPORT)】</span>
                  </div>

                  <div className="relative w-full aspect-video rounded-32 overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex items-center justify-center">
                    <iframe
                      src="https://player.bilibili.com/player.html?bvid=BV1k6L469EpY&page=1&high_quality=1&as_wide=1"
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen={true}
                      className="w-full h-full absolute inset-0 border-0"
                    />
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Image Area */}
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
