import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import GameFolderModal from "./GameFolderModal";
import ImageGalleryModal from "./ImageGalleryModal";
import { prioritizeProjectImages, extractProjectImages } from "../lib/imageLoaderManager";

interface ProjectCategory {
  id: string;
  title: string;
  images: string[];
  cover: string;
}

const offlineSubCategories = [
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

const aigcSubCategories = [
  {
    id: "aigc-2",
    title: "游戏视觉设计",
    subtitle: "AIGC Game Visuals",
    bgClass: "bg-gradient-to-br from-[#1d0e2e] via-[#12071f] to-[#080210]",
    borderClass: "border-purple-500/20 hover:border-purple-400/60 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.15),inset_0_0_30px_rgba(168,85,247,0.1)]",
    tagBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    colorBlock: (
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [90, 180, 90],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[180px] h-[180px] rounded-full bg-purple-500/10 blur-[40px] z-0 -bottom-10 -right-10"
        />
        <motion.div 
          whileHover={{ rotate: -15, scale: 1.1, translateY: -5 }}
          className="w-24 h-24 bg-gradient-to-br from-[#c084fc] to-[#db2777] rounded-2xl opacity-35 filter blur-[2px] shadow-[0_0_30px_rgba(168,85,247,0.2)] transform -rotate-12 transition-all duration-700" 
        />
        <div className="absolute top-6 left-6 font-mono text-[3.5rem] text-purple-500/15 font-black tracking-tighter leading-none select-none">01</div>
      </div>
    ),
    images: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/aigckv${i}/1920/1080`)
  },
  {
    id: "aigc-3",
    title: "3D IP设计",
    subtitle: "3D IP Design",
    bgClass: "bg-gradient-to-br from-[#2a140a] via-[#170a04] to-[#0c0401]",
    borderClass: "border-orange-500/20 hover:border-orange-400/60 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.15),inset_0_0_30px_rgba(249,115,22,0.1)]",
    tagBg: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    colorBlock: (
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 270, 180],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[180px] h-[180px] rounded-full bg-orange-500/10 blur-[40px] z-0 top-[10%] left-[10%]"
        />
        <motion.div 
          whileHover={{ rotate: 30, scale: 1.15, translateY: 5 }}
          className="w-20 h-20 bg-gradient-to-tr from-[#f97316] to-[#facc15] rounded-[2rem] opacity-35 filter blur-[2px] shadow-[0_0_30px_rgba(249,115,22,0.2)] transform rotate-12 transition-all duration-700" 
        />
        <div className="absolute top-6 left-6 font-mono text-[3.5rem] text-orange-500/15 font-black tracking-tighter leading-none select-none">02</div>
      </div>
    ),
    images: Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/character${i}/1920/1080`)
  }
];

const categories: ProjectCategory[] = [
  {
    id: "offline",
    title: "线下物料",
    images: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/event${i}/1600/900`),
    cover: "https://i.postimg.cc/gj2rFvGw/MG-PUBGM-pin-pai-lian-dong-she-ji-fang-xiang0625-01.png"
  },
  {
    id: "kv",
    title: "游戏海报设计",
    images: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/game${i}/1600/900`),
    cover: "https://i.postimg.cc/52z6Lc7K/9b2c418f3dcc239a1cb2414143cd7ef.jpg"
  },
  {
    id: "aigc",
    title: "AIGC",
    images: [
      "https://picsum.photos/seed/newborn0/1600/900",
      "https://picsum.photos/seed/aigckv0/1600/900",
      "https://picsum.photos/seed/character0/1600/900",
      "https://picsum.photos/seed/landscape0/1600/900"
    ],
    cover: "https://i.postimg.cc/dt7Y07Gk/Image.png"
  }
];

export default function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showNewbornDemoModal, setShowNewbornDemoModal] = useState(false);
  const [showNewbornKvModal, setShowNewbornKvModal] = useState(false);
  const [showNewbornCharModal, setShowNewbornCharModal] = useState(false);
  const [showNewbornSceneModal, setShowNewbornSceneModal] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (
      selectedCategory || 
      selectedGame || 
      showNewbornDemoModal || 
      showNewbornKvModal || 
      showNewbornCharModal || 
      showNewbornSceneModal
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedCategory, selectedGame, showNewbornDemoModal, showNewbornKvModal, showNewbornCharModal, showNewbornSceneModal]);

  const handleNavigateAigc = (target: "demo" | "kv" | "char") => {
    setShowNewbornDemoModal(target === "demo");
    setShowNewbornKvModal(target === "kv");
    setShowNewbornCharModal(target === "char");
  };

  // Intelligent Image Cache Preloader: Load currently viewed modal/category images first, then background preload remaining assets
  useEffect(() => {
    let currentImages: string[] = [];
    if (selectedCategory) {
      currentImages = extractProjectImages(selectedCategory);
    } else if (selectedGame) {
      currentImages = extractProjectImages(selectedGame);
    } else {
      // If no modal selected, prioritize showcase covers
      currentImages = offlineSubCategories.map((o) => o.images[0]);
    }

    const allOtherUrls = [
      "https://i.postimg.cc/JzRmGCSn/xian-gao-yuan-hua-she-ji.png",
      "https://i.postimg.cc/x18xsszG/dong-zuo-she-ji.png",
      "https://i.postimg.cc/rp36TDWD/ZBrush-hui-mo-xiao-guo-tu.png",
      "https://i.postimg.cc/D0VQc6TF/ZBrush-hui-mo-zheng-shi-tu.png",
      "https://i.postimg.cc/T32VQhBB/ZBrush-hui-mo-ce-shi-tu.png",
      "https://i.postimg.cc/Gt1YDpkg/ZBrush-hui-mo-bei-shi-tu.png",
      "https://i.postimg.cc/PJ4gsPKG/4189c0a2b5edd924c139f219d632d9c.png",
      "https://i.postimg.cc/gjY7DGdG/14c3c595e696b51c0ac4acdabb514fc.png",
      "https://i.postimg.cc/4NxMH4B8/zheng-shi-tu-wu-tou-shi-cai-zhi-xuan-ran-tu-(1).png",
      "https://i.postimg.cc/FsC6yt65/zhan-shu-nu-xing-ce-shi-tu-cai-zhi-xuan-ran-4K-v3.png",
      "https://i.postimg.cc/4xKSwLCs/zhan-shu-nu-xing-bei-shi-tu-cai-zhi-xuan-ran-4K.png",
      "https://i.postimg.cc/WpXYVLTt/4116f5db4d16401af882993b8c6bd22.png",
      "https://i.postimg.cc/GpfgZ6Dk/VI-shou-ce-01-feng-mian-ye.png",
      "https://i.postimg.cc/R0Ypj2tT/VI-shou-ce-02-se-cai-gui-fan.png",
      "https://i.postimg.cc/rFgJBvXf/VI-shou-ce-03-jiao-se-biao-zhun-zhi-tu.png",
      "https://i.postimg.cc/dV1Bw4Jt/VI-shou-ce-04-zhuang-bei-xi-tong-gui-fan.png",
      "https://i.postimg.cc/5ybBGmsP/VI-shou-ce-05-pin-pai-ying-yong-yan-zhan.png",
      "https://i.postimg.cc/Rhd7zn8q/VI-shou-ce-06-tu-xing-gai-nian-she-ji.png",
      "https://i.postimg.cc/7YB3s001/VI-shou-ce-07-tu-xing-yan-zhan.png",
      "https://i.postimg.cc/Sx3Wq4ZY/VI-shou-ce-08-tu-xing-gai-nian-yan-zhan.png",
      "https://i.postimg.cc/pTtzhZMR/VI-shou-ce-09-zi-ti-gui-fan.png",
      "https://i.postimg.cc/Zq9zB8F1/zhan-shu-shao-nu-zhou-bian-xi-lie-mang-he-yu-ma-ke-bei-tao-zhuang.png",
      "https://i.postimg.cc/J05fVPMc/zhan-shu-shao-nu-zhou-bian-xi-lie-shou-ji-ke-tao-zhuang.png",
      "https://i.postimg.cc/h48WdPTS/zhan-shu-shao-nu-zhou-bian-xi-lie-tong-kuan-er-ji-wai-she.png",
      "https://i.postimg.cc/Dy59xjxN/zhan-shu-shao-nu-zhou-bian-xi-lie-chan-pin-bao-zhuang-he-yu-quan-tao-zhan-shi.png",
      "https://i.postimg.cc/dtnb5HWq/zhan-shu-shao-nu-zhou-bian-xi-lie-T-xu-yu-hui-zhang-tao-zhuang.png",
      "https://i.postimg.cc/rsjPYsN4/zhan-shu-shao-nu-zhou-bian-xi-lie-kua-bao-yu-gua-sheng-tao-zhuang.png",
      "https://i.postimg.cc/vHn5tTGd/nu-jiao-se-zhan-shu-hai-bao.png",
      "https://i.postimg.cc/dt7Y07Gk/Image.png",
      "https://i.postimg.cc/k4Dpd98G/1.png",
      "https://i.postimg.cc/MGpsyx9H/2.png",
      "https://i.postimg.cc/xCWtDmny/3.png",
      "https://i.postimg.cc/5NWns8Pf/4.png",
      "https://i.postimg.cc/NjpDGSQh/11.png",
      "https://i.postimg.cc/xCWtDmny/22.png",
      "https://i.postimg.cc/q7FGyKhv/33.png",
      "https://i.postimg.cc/KjSrsyDN/44.png",
      "https://i.postimg.cc/GtpxHWfn/mmt-Rf-ONc-Pj-Y-zi-yuan-7.webp",
      "https://i.postimg.cc/CMrwDLJb/b1bf667147d20298db2d8c659d108a0.png",
      "https://i.postimg.cc/DwrVC2Qq/shi-guan-zhang-hai-bao.png",
      "https://i.postimg.cc/7ZhCH3tW/wei-xin-tu-pian-20260525141215.png",
      "https://i.postimg.cc/Y2nzf5ZK/wei-xin-tu-pian-20260525141220.png",
      "https://i.postimg.cc/SKfWX3C3/LOGO.png"
    ];

    const cleanup = prioritizeProjectImages(currentImages, allOtherUrls);
    return cleanup;
  }, [selectedCategory, selectedGame]);

  return (
    <section className="py-32 px-6 md:px-24 bg-background w-full">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <h2 className="text-brand-orange text-[10px] font-bold tracking-[0.6em] uppercase mb-4">
            - PROJECT SHOWCASE -
          </h2>
          <h3 className="text-3xl md:text-5xl font-display font-medium text-white">
            项目案例展示
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              onClick={() => setSelectedCategory(cat)}
              className="group relative md:aspect-[4/5] aspect-[16/9] bg-neutral-950 overflow-hidden cursor-pointer rounded-2xl border border-white/10 hover:border-brand-orange/40 transition-all duration-700 shadow-xl hover:-translate-y-2 select-none"
            >
              {/* Dynamic Adaptive Cover Background Layer */}
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <img
                  src={cat.cover}
                  alt={cat.title}
                  className="w-full h-full object-cover opacity-50 brightness-[0.25] group-hover:brightness-[0.35] group-hover:opacity-70 scale-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Visual Glares & Ambient Overlay Shaders */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-800/10 z-10" />
                <div className="absolute inset-0 bg-brand-orange/5 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
              </div>

              {/* Title & Exploration text */}
              <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-extrabold tracking-wider text-white mb-2 md:mb-4 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  {cat.title}
                </h3>
                <div className="w-12 h-[2px] bg-brand-orange mb-4 md:mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                <span className="text-white/70 text-[9px] font-mono tracking-[0.4em] uppercase bg-neutral-950/60 backdrop-blur-sm border border-white/10 group-hover:border-brand-orange/30 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                  EXPLORE CASE / 点击进入
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modern Scrolling Modal */}
      <AnimatePresence>
        {selectedCategory && selectedCategory.id === "kv" && !selectedGame && (
          <GameFolderModal 
            key="game-folder-modal-kv" 
            initialSection="kv"
            onClose={() => setSelectedCategory(null)} 
            onSelectGame={setSelectedGame} 
            onNavigateToCategory={(catId) => {
              const target = categories.find(c => c.id === catId);
              if (target) setSelectedCategory(target);
            }}
          />
        )}
        {selectedCategory && selectedCategory.id === "kv" && selectedGame && (
          <ImageGalleryModal key={`gallery-${selectedGame.id}`} images={selectedGame.images} title={selectedGame.title} onClose={() => setSelectedGame(null)} />
        )}
        {selectedCategory && selectedCategory.id === "offline" && (
          <GameFolderModal 
            key="game-folder-modal-offline" 
            initialSection="offline"
            onClose={() => setSelectedCategory(null)} 
            onNavigateToCategory={(catId) => {
              const target = categories.find(c => c.id === catId);
              if (target) setSelectedCategory(target);
            }}
          />
        )}

        {selectedCategory && selectedCategory.id === "aigc" && (
          <GameFolderModal 
            key="game-folder-modal-aigc" 
            initialSection="aigc"
            onClose={() => setSelectedCategory(null)} 
            onNavigateToCategory={(catId) => {
              const target = categories.find(c => c.id === catId);
              if (target) setSelectedCategory(target);
            }}
          />
        )}

        {selectedCategory && selectedCategory.id !== "kv" && selectedCategory.id !== "offline" && selectedCategory.id !== "aigc" && (
          <motion.div
            key={`other-category-modal-${selectedCategory.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 90 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute top-6 right-6 md:top-12 md:right-12 z-[110] p-4 text-white hover:text-brand-orange transition-colors"
            >
              <X size={44} strokeWidth={1.5} />
            </motion.button>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full h-full overflow-y-auto no-scrollbar pt-20"
            >
              <div className="max-w-6xl mx-auto space-y-12 md:space-y-24 pb-24">
                <h4 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white italic text-center opacity-20">
                  {selectedCategory.title}
                </h4>
                {selectedCategory.images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                  >
                    <img 
                      src={img} 
                      alt={`${selectedCategory.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-6 text-white/40 font-mono text-xs uppercase tracking-widest">
                      PROJECT CASE 0{i + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Background Title Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-[30vw] font-black text-white/5 pointer-events-none whitespace-nowrap">
              {selectedCategory.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
