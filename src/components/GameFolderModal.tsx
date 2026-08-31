import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, FolderOpen, Folder, FileImage, FileText, Check, ChevronDown, ChevronRight,
  Compass, RotateCw, Globe, Sparkles, Image as ImageIcon, Video, ChevronLeft, ChevronRight as ChevronRightIcon, User, Layers
} from 'lucide-react';
import { isImageCached, markImageCached, prioritizeProjectImages, extractProjectImages } from '../lib/imageLoaderManager';

interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  cover: string;
  images: string[];
  videoUrl?: string;
  type?: string;
}

interface OfflineItem {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
}

export interface WeaponSkin {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  color: string;
  glow: string;
  keywords: { zh: string; en: string }[];
  whiteModel: string;
  extensions: string[];
}

export const weaponSkinsData: WeaponSkin[] = [
  {
    id: "skin_ak47_death",
    title: "AK47-死神",
    subtitle: "AK47 Death Reaper",
    desc: "CF官方超人气重装机甲、经典英雄级皮肤的高精3D重塑与概念演化，注入暗影死神之能，能流核心处流动着高频电能共振。",
    image: "https://i.postimg.cc/15nh8wPt/03178fc39f221ae5ec4cc7be670ec664.png",
    color: "rgba(16, 185, 129, 0.08)", // Emerald/Mint tech theme base (green)
    glow: "rgba(34, 197, 94, 0.22)", // Luminous forest tactical energy glow (green)
    keywords: [
      { zh: "重装机甲", en: "Heavy Mech" },
      { zh: "能流核心", en: "Energy Core" },
      { zh: "质感细节", en: "Texture Details" },
      { zh: "战术推演", en: "Tactical Spec" }
    ],
    whiteModel: "https://i.postimg.cc/5NYdXL15/Clipboard-2026-06-29-20-19-25.png",
    extensions: [
      "https://i.postimg.cc/TYz8g1YF/Clipboard-2026-06-15-18-06-58.png",
      "https://i.postimg.cc/T3gz9xKf/982f02bd07abb84c4d3ee90628f2562.png",
      "https://i.postimg.cc/13wkHS8g/50089e7d7f6571bef62db163eae5b4b5.png"
    ]
  },
  {
    id: "skin_ak47_gold_earl",
    title: "AK47-耀金伯爵",
    subtitle: "AK47 Golden Earl",
    desc: "将极尽奢华的巴洛克宫廷纹路与尊贵耀金涂装融为一体，枪身镌刻高精浮雕花纹，散发贵族典雅与高频能量共鸣。",
    image: "https://i.postimg.cc/BvkLT2kX/b72eda63727a9fee90a1fa0f6f2c646.jpg",
    color: "rgba(120, 53, 4, 0.15)", // Amber/gold
    glow: "rgba(245, 158, 11, 0.28)", // Vibrant gold core glow
    keywords: [
      { zh: "耀金浮雕", en: "Golden Relief" },
      { zh: "贵族典雅", en: "Noble Elegance" },
      { zh: "高频共振", en: "High Resonance" },
      { zh: "皇家印记", en: "Royal Mark" }
    ],
    whiteModel: "https://i.postimg.cc/dt6hWbgs/Clipboard-2026-06-29-20-50-26.png",
    extensions: [
      "https://i.postimg.cc/K8YRC9y7/5a113283a4c64e81328098a85b91150d.png",
      "https://i.postimg.cc/t4mYbhXz/e5112b8cd4875925ae9e585507626f53.png",
      "https://i.postimg.cc/hPvnBNf9/Clipboard-2026-06-30-12-56-38.png"
    ]
  },
  {
    id: "skin_kris_gold_earl",
    title: "马来剑-耀金伯爵",
    subtitle: "Kris Golden Earl",
    desc: "极致尊贵的黄金涂装，刀刃蜿蜒缠绕尊享贵族花纹，刀锋由超能粒子电束覆盖，挥击时散发迷人而危险的光弧。",
    image: "https://i.postimg.cc/PfpGVYcq/b56fcdd537637e4755fc97a4b1285b0f.png",
    color: "rgba(69, 26, 3, 0.22)", // Gold/chocolate luxury
    glow: "rgba(234, 179, 8, 0.40)", // Shimmering golden luxury glow
    keywords: [
      { zh: "纯金雕琢", en: "Solid Gold Chisled" },
      { zh: "高能粒子", en: "High Energy Particles" },
      { zh: "蛇形刀锋", en: "Wavy Blade" },
      { zh: "至高荣誉", en: "Supreme Honor" }
    ],
    whiteModel: "https://i.postimg.cc/7Z4pLcLN/Clipboard-2026-06-29-20-50-34.png",
    extensions: [
      "https://i.postimg.cc/4xGr3M32/37f59198c57c1a7480cc735711b475e8.png",
      "https://i.postimg.cc/1tbd17T3/Clipboard-2026-06-30-13-02-50.png",
      "https://i.postimg.cc/C5DQhHTD/30f57e59445c79fb8b071c99efeaf757.png"
    ]
  },
  {
    id: "skin_m16_demonic",
    title: "M16-恶魔",
    subtitle: "M16 Demonic Reborn",
    desc: "注入暗黑邪能的机甲武器皮肤。枪身流动着诡异的熔岩微光，象征着来自深渊的恶魔吞噬力量，战术压制感十足。",
    image: "https://i.postimg.cc/02stGSqQ/M16-e-mo4000x2228.png",
    color: "rgba(139, 0, 0, 0.15)", // Dark red / demonic crimson
    glow: "rgba(220, 20, 60, 0.28)", // Intense crimson energy glow
    keywords: [
      { zh: "邪能熔岩", en: "Fel Lava" },
      { zh: "深渊骨刺", en: "Abyssal Spikes" },
      { zh: "高频共振", en: "High Resonance" },
      { zh: "军规涂装", en: "Tactical Paint" }
    ],
    whiteModel: "https://i.postimg.cc/xT366d0m/Clipboard-2026-06-29-20-50-19.png",
    extensions: [
      "https://i.postimg.cc/t4R2wHT5/5623207f8c36182e26af84907d89f345.png",
      "https://i.postimg.cc/dVQ4pK1b/Clipboard-2026-06-30-13-05-21.png",
      "https://i.postimg.cc/MGN5nMYd/d494f271327c683658837abdfd7528e9.png"
    ]
  },
  {
    id: "skin_awm_judgment",
    title: "AWM-裁决",
    subtitle: "AWM Judgment",
    desc: "极致冷硬科幻机甲风重型狙击。黑灰底色镶嵌深红脉冲线条，代表不可违抗的至高战场法则与终极裁决。",
    image: "https://i.postimg.cc/ZqBFzYhp/560b404c862dac5d6d98141572dc605.jpg",
    color: "rgba(31, 41, 55, 0.22)", // Dark gray carbon
    glow: "rgba(239, 68, 68, 0.30)", // Bright fire red
    keywords: [
      { zh: "重型机甲", en: "Heavy Mech" },
      { zh: "碳纤维板", en: "Carbon Fiber" },
      { zh: "动能推演", en: "Kinetic Tech" },
      { zh: "裁决之怒", en: "Judgment Wrath" }
    ],
    whiteModel: "https://i.postimg.cc/cJgMG1ND/Clipboard-2026-06-29-20-34-48.png",
    extensions: [
      "https://i.postimg.cc/3NRxzRPs/7d1a08ec306f55a03e2f69a2235b053.png",
      "https://i.postimg.cc/6q3pF3kB/31eabb8d45e3c23baa4ee876f2ba208.png",
      "https://i.postimg.cc/7h6Zj6FC/501512b6d24c273249537672cb36c97.jpg"
    ]
  },
  {
    id: "skin_lewis_blood_moon",
    title: "路易士-血月",
    subtitle: "Lewis Blood Moon",
    desc: "利落修长的黑红涂装，机匣中央附带由合金军刀变形而成的侧翼结构，激发血月当空般的嗜血与冷酷。",
    image: "https://i.postimg.cc/bJ57NwGh/2bc7fe47cba87ef26304413d9ec46087.png",
    color: "rgba(17, 17, 17, 0.30)", // Jet black
    glow: "rgba(225, 29, 72, 0.32)", // Rose red glow
    keywords: [
      { zh: "利刃侧翼", en: "Bayonet Wings" },
      { zh: "合金流线", en: "Alloy Streamline" },
      { zh: "血月能流", en: "Bloodmoon Flow" },
      { zh: "冷酷压制", en: "Cold Press" }
    ],
    whiteModel: "https://i.postimg.cc/mkF0cWMN/Clipboard-2026-06-29-20-21-18.png",
    extensions: [
      "https://i.postimg.cc/pyb3zcJM/Clipboard-2026-06-29-20-52-21.png",
      "https://i.postimg.cc/Vsr69SWM/1e7d18b853eb6c5a36c25a46a754b6a.png",
      "https://i.postimg.cc/wxCBw6ww/f7dad8118c94a815cc9f541dc03d0219.png"
    ]
  },
  {
    id: "skin_awm_angel",
    title: "AWM-天使",
    subtitle: "AWM Heavenly Angel",
    desc: "雪白色与璀璨淡蓝交织的冷光极地狙击。圣白金属装甲包裹，瞄准镜边缘折射纯净极光，象征无尘的天使羽翼。",
    image: "https://i.postimg.cc/T2qs400m/4cdb08802b05fedb9ab86b565c7b3efa.png",
    color: "rgba(8, 47, 73, 0.22)", // Ocean/frost blue
    glow: "rgba(14, 165, 233, 0.35)", // Sky blue frosty glow
    keywords: [
      { zh: "天使羽翼", en: "Angel Wings" },
      { zh: "霜冰冷凝", en: "Ice Cold Lock" },
      { zh: "高倍镜光", en: "Scope Flare" },
      { zh: "白金拉丝", en: "Brushed Platinum" }
    ],
    whiteModel: "https://i.postimg.cc/dtsfPCNf/Clipboard-2026-06-29-20-33-30.png",
    extensions: [
      "https://i.postimg.cc/cL656SSW/Clipboard-2026-06-15-18-05-44.png",
      "https://i.postimg.cc/qvgZgTTy/Clipboard-2026-06-15-18-00-34.png",
      "https://i.postimg.cc/1zqCcr4Q/85c207ab2a52303e0b2d8bd213d1563f.png"
    ]
  }
];

const games: GameItem[] = [
  { 
    id: "cf", 
    title: "穿越火线 X Bilibili World", 
    subtitle: "Tactical FPS Key Art & Assets",
    desc: "CF官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/52z6Lc7K/9b2c418f3dcc239a1cb2414143cd7ef.jpg", 
    images: [
      "https://i.postimg.cc/52z6Lc7K/9b2c418f3dcc239a1cb2414143cd7ef.jpg",
      "https://i.postimg.cc/q7XqDsd5/bb97f860d6e3b83892b076a00aeb182.jpg",
      "https://i.postimg.cc/kGD55LRN/ab0d6f751bf4d94d9be3065a1adab32.jpg",
      "https://i.postimg.cc/mZ6DnZ0b/030696f4b8dad12d1e07459117cf14b.jpg",
      "https://i.postimg.cc/CLB1pTg0/696c549d213e9043dd6c6a1c900e9fe.jpg",
      "https://i.postimg.cc/MKQWr77y/2614931c3faf7e4fda7c8ebddaa82ff.png",
      "https://i.postimg.cc/L5zmhR6T/wei-xin-tu-pian-20250107154843.jpg",
      "https://i.postimg.cc/WprN5m6m/wei-xin-tu-pian-20250107154822.jpg",
      "https://i.postimg.cc/SxQmQB0y/7dea22ab8dddca01cd4cc2b4dd0c359.jpg",
      "https://i.postimg.cc/NfkgcgzZ/02da18040ea5a037c504211b2a311a3.png",
      "https://i.postimg.cc/zftv1JVY/b72eda63727a9fee90a1fa0f6f2c646.jpg",
      "https://i.postimg.cc/wBfMd677/b56fcdd537637e4755fc97a4b1285b0f.png",
      "https://i.postimg.cc/pdGrt2pV/03178fc39f221ae5ec4cc7be670ec664.png",
      "https://i.postimg.cc/XJrJjTCG/d9062bb0090a8882cbd3cc52155e0cb.png",
      "https://i.postimg.cc/cLc6X7W5/4cdb08802b05fedb9ab86b565c7b3efa.png",
      "https://i.postimg.cc/FKszqfFw/560b404c862dac5d6d98141572dc605.jpg",
      "https://i.postimg.cc/FRwK7DyB/M16-e-mo4000x2228.png",
      "https://i.postimg.cc/1RgnsN0S/2bc7fe47cba87ef26304413d9ec46087.png",
      "https://i.postimg.cc/13Y1m4c2/Clipboard-2025-03-03-13-26-53.png",
      "https://i.postimg.cc/cL5Gx6BN/Clipboard-2025-03-03-13-25-25.png",
      "https://i.postimg.cc/5ymDZt2R/Clipboard-2025-03-03-13-25-34.png",
      "https://i.postimg.cc/cCWV930t/Clipboard-2025-03-03-13-25-29.png",
      "https://i.postimg.cc/3w45d7ty/Clipboard-2025-03-03-13-25-26.png",
      "https://i.postimg.cc/vHQJ550p/Clipboard-2025-03-03-13-26-31.png",
      "https://i.postimg.cc/sf9FBT4w/Clipboard-2025-03-03-13-26-15.png",
      "https://i.postimg.cc/qvqW54VW/wei-biao-ti-2.png",
      "https://i.postimg.cc/6pqFmtJz/Clipboard-2025-03-03-13-26-35.png",
      "https://i.postimg.cc/SxRHvkFz/Clipboard-2025-03-03-13-26-33.png",
      "https://i.postimg.cc/pTzwJCN6/Clipboard-2025-03-03-13-25-28.png"
    ] 
  },
  { 
    id: "cf_museum", 
    title: "穿越火线时光博物馆", 
    subtitle: "16th Anniversary Time Corridor & Memorial Exhibition",
    desc: "纪念穿越火线十六周年大型线下特展物理还原，极致还原传奇战场并融合数智军规全息艺术长廊。",
    cover: "https://i.postimg.cc/y894FwMd/bb97f860d6e3b83892b076a00aeb182.jpg", 
    images: [
      "https://i.postimg.cc/y894FwMd/bb97f860d6e3b83892b076a00aeb182.jpg",
      "https://i.postimg.cc/4dfDRnn0/chuan-yue-huo-xian-ji-zhuang-xiang-bai-mo-xuan-ran.png",
      "https://i.postimg.cc/xCc1S9xy/bb97f860d6e3b83892b076a00aeb182.png",
      "https://i.postimg.cc/bYMB3mHG/0721-chuan-yue-huo-xian-shi-guang-bo-wu-guan-KV-chuang-yi-she-ji-fang-an-03.png",
      "https://i.postimg.cc/k5fj8sXh/86a62a43353f5bcc4340cbc737cd8eb.png",
      "https://i.postimg.cc/cC8TpNM6/e8e4b5b24f5f18dc372b8e814270233.png",
      "https://i.postimg.cc/hP4t1bgF/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-08.png",
      "https://i.postimg.cc/0Qd9prBr/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-09.png",
      "https://i.postimg.cc/mDNTQh5N/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-11.png",
      "https://i.postimg.cc/jqDbxgsn/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-12.png",
      "https://i.postimg.cc/SxhFGmcg/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-13.png",
      "https://i.postimg.cc/sD34P8v9/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-14.png",
      "https://i.postimg.cc/MpT45XvR/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-15.png",
      "https://i.postimg.cc/HW9hCbMp/0709-chuan-yue-huo-xian-shi-guang-bo-wu-guan-chuang-yi-she-ji-fang-an-vi-bu-fen-17.png"
    ] 
  },
  { 
    id: "cf_swallowed_star", 
    title: "穿越火线 X 吞噬星空", 
    subtitle: "Cosmic Sci-Fi Key Art & Assets",
    desc: "CF官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/jjWY5Q9z/696c549d213e9043dd6c6a1c900e9fe.jpg", 
    images: [
      "https://i.postimg.cc/jjWY5Q9z/696c549d213e9043dd6c6a1c900e9fe.jpg",
      "https://i.postimg.cc/L58T9vQH/bai-morender.png",
      "https://i.postimg.cc/4y2rsY5W/46acc31cb16eac8f6e6328548bc8083.jpg",
      "https://i.postimg.cc/3JJvqdzN/1111111111111111111.png",
      "https://i.postimg.cc/c42f8d5q/42681589c77829413e9a0b55254507b.jpg",
      "https://i.postimg.cc/FH0kd3Lf/f493b639fa591eb39727534c24da6a8.jpg",
      "https://i.postimg.cc/HxvFwJMD/e97c3342a4d7c7910634a53a15cea08.png",
      "https://i.postimg.cc/xC8dRzcF/tu-pian3.png",
      "https://i.postimg.cc/Y2J1vpsD/tu-pian2.png",
      "https://i.postimg.cc/g0khCrx7/tu-pian4.png"
    ] 
  },
  { 
    id: "cf_fengshen", 
    title: "穿越火线 X 封神", 
    subtitle: "Cosmic Sci-Fi Key Art & Assets",
    desc: "CF官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/mr8MNp8X/wei-xin-tu-pian-20250107154843.jpg", 
    images: [
      "https://i.postimg.cc/mr8MNp8X/wei-xin-tu-pian-20250107154843.jpg",
      "https://i.postimg.cc/NMZxmPjn/24a056d0a76cd19f3a935f26adcd37e.jpg",
      "https://i.postimg.cc/XYvQM5mG/Snipaste-2026-06-29-19-41-12.png",
      "https://i.postimg.cc/V6ttQszH/Snipaste-2026-06-29-19-32-01.png",
      "https://i.postimg.cc/JhDDZ7Dp/wei-xin-tu-pian-20250107154822.jpg",
      "https://i.postimg.cc/3w44mr0J/02da18040ea5a037c504211b2a311a3.png",
      "https://i.postimg.cc/nLjjBVjP/7dea22ab8dddca01cd4cc2b4dd0c359.jpg"
    ] 
  },
  { 
    id: "cf_shanghai_animation", 
    title: "穿越火线 X 上海美术电影制片厂", 
    subtitle: "Cosmic Sci-Fi Key Art & Assets",
    desc: "CF官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/7hGXGr1d/030696f4b8dad12d1e07459117cf14b.jpg", 
    images: [
      "https://i.postimg.cc/7hGXGr1d/030696f4b8dad12d1e07459117cf14b.jpg",
      "https://i.postimg.cc/wvs03dQC/CFM-hai-bao-bai-mo-xuan-ran.png",
      "https://i.postimg.cc/y6cLHsdS/fdedbaf0f3c0ef8f657b672f2d931b7.png",
      "https://i.postimg.cc/XY7Ld5gZ/Snipaste-2026-06-29-18-41-03.png"
    ] 
  },
  { 
    id: "cf_hangzhou_cfs", 
    title: "穿越火线 X 杭州CFS赛事", 
    subtitle: "Cosmic Sci-Fi Key Art & Assets",
    desc: "CF官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/ZRp3NYB8/ab0d6f751bf4d94d9be3065a1adab32.jpg", 
    images: [
      "https://i.postimg.cc/ZRp3NYB8/ab0d6f751bf4d94d9be3065a1adab32.jpg",
      "https://i.postimg.cc/G3SrDPrw/2a93d2bbbe268f857ce868358d90af9.jpg",
      "https://i.postimg.cc/zXbNFLXH/tu-pian.png",
      "https://i.postimg.cc/c4pS9srB/tu-pian1.png",
      "https://i.postimg.cc/ZqZhmVPB/1022-CFS-hang-zhou-lian-dongkv-gui-hua-08.png",
      "https://i.postimg.cc/hGgqnp84/1022-CFS-hang-zhou-lian-dongkv-gui-hua-07.png"
    ] 
  },
  { 
    id: "cf_weapon_skin", 
    title: "穿越火线 X 武器皮肤设计", 
    subtitle: "Ultimate Legend Weapon Skins",
    desc: "CF超人气武器重装机甲、经典英雄级皮肤的高精3D重塑与概念演化，包含枪身质感细节、能流核心以及战术功能推演。",
    cover: "https://i.postimg.cc/15nh8wPt/03178fc39f221ae5ec4cc7be670ec664.png", 
    images: [
      "https://i.postimg.cc/15nh8wPt/03178fc39f221ae5ec4cc7be670ec664.png",
      "https://i.postimg.cc/5NYdXL15/Clipboard-2026-06-29-20-19-25.png",
      "https://i.postimg.cc/TYz8g1YF/Clipboard-2026-06-15-18-06-58.png",
      "https://i.postimg.cc/T3gz9xKf/982f02bd07abb84c4d3ee90628f2562.png",
      "https://i.postimg.cc/13wkHS8g/50089e7d7f6571bef62db163eae5b4b5.png"
    ] 
  },
  { 
    id: "cf_new_five_years", 
    title: "穿越火线 X 新五年信物", 
    subtitle: "New Five-Year Token",
    desc: "CF官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/SRhvKTLM/Clipboard-2025-03-03-13-26-53.png", 
    images: [
      /* 0: Header Image */
      "https://i.postimg.cc/SRhvKTLM/Clipboard-2025-03-03-13-26-53.png",
      /* 1: Solid Model */
      "https://i.postimg.cc/Vs07y88S/Clipboard-2026-06-30-14-02-49.png",
      /* 2: Creative Design */
      "https://i.postimg.cc/fLPCpHyy/tu-pian.png",
      /* 3: Mood reference */
      "https://i.postimg.cc/Rhqxmbvh/Snipaste-2026-06-30-14-05-16.png",
      
      /* Group 1: 4, 5, 6 */
      "https://i.postimg.cc/B6nn8pqq/tu-pian1.png",
      "https://i.postimg.cc/SRXQdK2B/Clipboard-2025-03-03-13-25-25.png",
      "https://i.postimg.cc/0jLkBq7w/Clipboard-2025-03-03-13-26-15.png",
      
      /* Group 2: 7, 8, 9 */
      "https://i.postimg.cc/sgCfPsVn/tu-pian2.png",
      "https://i.postimg.cc/4xvfBqyN/Clipboard-2025-03-03-13-26-35.png",
      "https://i.postimg.cc/9fWWSbwz/wei-biao-ti-2.png",
      
      /* Group 3: 10, 11, 12 */
      "https://i.postimg.cc/vT6M9Skq/tu-pian4.png",
      "https://i.postimg.cc/z3ZNkF1y/Clipboard-2025-03-03-13-25-28.png",
      "https://i.postimg.cc/rydtQykk/Clipboard-2025-03-03-13-25-29.png",
      
      /* Group 4: 13, 14, 15 */
      "https://i.postimg.cc/7PpJcvHg/tu-pian5.png",
      "https://i.postimg.cc/dtrZcWDF/Clipboard-2025-03-03-13-25-26.png",
      "https://i.postimg.cc/FHxf77yt/Clipboard-2025-03-03-13-25-34.png",
      
      /* Group 5: 16, 17, 18 */
      "https://i.postimg.cc/zftVF62T/tu-pian6.png",
      "https://i.postimg.cc/3NpN7R8p/Clipboard-2025-03-03-13-26-33.png",
      "https://i.postimg.cc/PqR5wZNS/Clipboard-2025-03-03-13-26-31.png",
      
      /* Grid Section (2 rows of 2): 19, 20, 21, 22 */
      "https://i.postimg.cc/jSFkGQ5P/Clipboard-2026-06-30-15-12-25.png",
      "https://i.postimg.cc/wvhfyCkB/Clipboard-2026-06-30-15-12-34.png",
      "https://i.postimg.cc/L5nPKRwn/Clipboard-2026-06-30-14-52-53.png",
      "https://i.postimg.cc/9XnTPRwH/Clipboard-2026-06-30-14-55-28.png"
    ] 
  },
  { 
    id: "pubgm_6th", 
    title: "和平精英6周年", 
    subtitle: "6th Anniversary Space & Visual Carnival",
    desc: "和平精英六周年大型线下特展与多维空间设计，包含六周年数字光影特展、Lumen全息交互长廊及未来战场还原装置。",
    cover: "https://i.postimg.cc/nhShBts6/0411-jing-ji-jiang-KV-wu-sou-suo-kuang.jpg", 
    images: [
      "https://i.postimg.cc/nhShBts6/0411-jing-ji-jiang-KV-wu-sou-suo-kuang.jpg",
      "https://i.postimg.cc/MTNsQXx7/Clipboard-2026-07-03-16-06-10.png",
      "https://i.postimg.cc/155gqBCK/9f16c3204e03c94839117d1e8f2a8b9.jpg",
      "https://i.postimg.cc/RZwzV57p/he-ping-jing-ying6zhou-nianvi-kuang-jia-0401-20.png",
      "https://i.postimg.cc/3r6MXJ9D/he-ping-jing-ying6zhou-nianvi-kuang-jia-0401-19.png"
    ] 
  },
  { 
    id: "pubgm_xiangzhen", 
    title: "和平精英乡镇赛", 
    subtitle: "Township Tournament Visual Identity & Assets",
    desc: "和平精英官方乡镇赛宣发系列视觉，包含特色方言海报、地标创意装置以及乡镇竞技场景方案。",
    cover: "https://i.postimg.cc/26KNH4RF/zui-zhong.jpg", 
    images: [
      "https://i.postimg.cc/26KNH4RF/zui-zhong.jpg",
      "https://i.postimg.cc/jSS0rgq0/Clipboard-2026-07-03-17-14-12.png",
      "https://i.postimg.cc/0NHJCBQ4/tu-pian.png",
      "https://i.postimg.cc/MHpbGQv4/Snipaste-2026-07-03-17-16-41.png"
    ] 
  },
  { 
    id: "pubgm_gaode", 
    title: "和平精英 X 高德", 
    subtitle: "Co-Branding Visual Identity & Assets",
    desc: "和平精英 X 高德联名合作宣发系列视觉，包含特色方言海报、地标创意装置以及乡镇竞技场景方案。",
    cover: "https://i.postimg.cc/3JxMpSsp/3de3b98a2435d3884734a15f773cb64.png", 
    images: [
      "https://i.postimg.cc/3JxMpSsp/3de3b98a2435d3884734a15f773cb64.png",
      "https://i.postimg.cc/J46fQ38F/Clipboard-2026-07-03-17-48-34.png",
      "https://i.postimg.cc/85S9Ctd5/743a3560b4e1266fcee51a3bf999a47.png",
      "https://i.postimg.cc/9X1KWPDM/Snipaste-2026-07-03-17-49-37.png"
    ] 
  },
  { 
    id: "pubgm_shizhuangzhou", 
    title: "和平精英时装周", 
    subtitle: "Cosmic Sci-Fi Key Art & Assets",
    desc: "和平精英官方高清推演宣发系列视觉，包含角色战术装备、场景掩体结构以及精锐武器海报物料。",
    cover: "https://i.postimg.cc/vTQm57yr/wei-xin-tu-pian-20241012163121.jpg", 
    images: [
      "https://i.postimg.cc/vTQm57yr/wei-xin-tu-pian-20241012163121.jpg",
      "https://i.postimg.cc/4NrCYrcT/Clipboard-2026-07-03-19-39-01.png",
      "https://i.postimg.cc/QN08RTsQ/wei-xin-tu-pian-20241012163740.jpg",
      "https://i.postimg.cc/bwbjNDXb/Snipaste-2026-07-03-17-58-44.png",
      "https://i.postimg.cc/VkH4T4ZH/2024he-ping-jing-ying-chao-liu-shi-zhuang-zhou-shi-jue-shou-ce-31.png",
      "https://i.postimg.cc/g0X4PRfc/2024he-ping-jing-ying-chao-liu-shi-zhuang-zhou-shi-jue-shou-ce-32.png",
      "https://i.postimg.cc/6Qkc6qXr/2024he-ping-jing-ying-chao-liu-shi-zhuang-zhou-shi-jue-shou-ce-33.png",
      "https://i.postimg.cc/d1GBhFsW/2024he-ping-jing-ying-chao-liu-shi-zhuang-zhou-shi-jue-shou-ce-36.png",
      "https://i.postimg.cc/76C3pTQn/mkups-Yl-Yx-Kn-wei-biao-ti-1.jpg",
      "https://i.postimg.cc/V63q1L3H/mkup-IQh-Rfk-E-wei-biao-ti-3.jpg",
      "https://i.postimg.cc/HxfwHsqH/mkup-IQg-Gp-Yu-wei-biao-ti-4-hua-ban-1.jpg",
      "https://i.postimg.cc/zvKnfYNR/mkup-UJOYgr-B-wei-biao-ti-5-hua-ban-1.jpg",
      "https://i.postimg.cc/J7k3xZkS/mkup-IQe-Ux-VQ-wei-biao-ti-2.jpg",
      "https://i.postimg.cc/BQmCLM3Z/45MX2-9M.png"
    ] 
  },
  { 
    id: "other", 
    title: "其他", 
    subtitle: "Premium Marketing Materials",
    desc: "多平台游戏重点合作视觉、周年联动海报以及极富艺术张力的创意游戏主视觉插画合辑。",
    cover: "https://i.postimg.cc/PqHXqDdH/heng-ban-feng-mian.png", 
    images: [
      "https://i.postimg.cc/PqHXqDdH/heng-ban-feng-mian.png",
      "https://i.postimg.cc/C1PSJ6Dc/er-zhou-nian-lian-dong-hai-bao-16-9.png",
      "https://i.postimg.cc/2ShjmGR1/fe194f44ab2d86fd0be6fe5e3b6314f.jpg",
      "https://i.postimg.cc/ZK9KsZwv/Bwha-GMbsvscvs-Bl.jpg",
      "https://i.postimg.cc/gkkh73ZL/wei-xin-tu-pian-20260530235402-563-87.jpg"
    ] 
  }
];

const offlineItems: OfflineItem[] = [
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

// Rich structural AIGC dataset
interface AigcItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  images: string[];
  type: "standard" | "whitemodel" | "ue5_render" | "kv_interactive" | "kv_interactive_pubg" | "demo_overview" | "demo_characters" | "demo_islands" | "demo_ue5" | "video_storyboard";
  bottomImage?: string;
  storyboardTags?: string[];
  aiTextPrompt?: string;
  videoUrl?: string;
  storyboards?: {
    title: string;
    image: string;
    prompt: string;
  }[];
  stages?: {
    lineart: { title: string; image: string; desc: string };
    whitemodel: { title: string; image?: string; desc: string; images?: string[] };
    render3d: { title: string; image?: string; desc: string; images?: string[] };
  };
}

interface AigcCategory {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  items: AigcItem[];
}

const aigcCategories: AigcCategory[] = [
  {
    id: "kv",
    title: "游戏视觉设计",
    subtitle: "AIGC Game Visual Design Artworks",
    desc: "AIGC 视觉海报推演，基于人工智能算法生成高概念赛博朋克与写实场景，并进行精细打磨修型。",
    items: [
      {
        id: "kv-sanguo",
        title: "创意视觉设计",
        subtitle: "Conqueror's Blade Three Kingdoms Key Visual Artworks",
        desc: "《战意》三国主题宏大视觉设计系列，包含史诗战场、名将英姿与汉风美学推演，全系列15张 1920x1080 视觉海报竖排铺陈呈现。",
        type: "standard",
        images: [
          "https://i.postimg.cc/66j48LTc/zhan-yi-san-guo-shi-jue.png",
          "https://i.postimg.cc/28fqmDmW/zhan-yi-san-guo-KV-shi-jue-fang-an-03.png",
          "https://i.postimg.cc/wjq7yQ16/zhan-yi-san-guo-KV-shi-jue-fang-an-04.png",
          "https://i.postimg.cc/mrhkVZNR/zhan-yi-san-guo-KV-shi-jue-fang-an-05.png",
          "https://i.postimg.cc/KjhYZPXv/zhan-yi-san-guo-KV-shi-jue-fang-an-06.png",
          "https://i.postimg.cc/hGHDrLtP/zhan-yi-san-guo-KV-shi-jue-fang-an-07.png",
          "https://i.postimg.cc/50LxkXXp/zhan-yi-san-guo-KV-shi-jue-fang-an-08.png",
          "https://i.postimg.cc/HknT1ZJc/zhan-yi-san-guo-KV-shi-jue-fang-an-09.png",
          "https://i.postimg.cc/bJxh94M8/zhan-yi-san-guo-KV-shi-jue-fang-an-10.png",
          "https://i.postimg.cc/Hnkh8K1s/zhan-yi-san-guo-KV-shi-jue-fang-an-11.png",
          "https://i.postimg.cc/W478mnnz/zhan-yi-san-guo-KV-shi-jue-fang-an-13.png",
          "https://i.postimg.cc/D0fwJ2z8/zhan-yi-san-guo-KV-shi-jue-fang-an-14.png",
          "https://i.postimg.cc/zvfqD0tm/zhan-yi-san-guo-KV-shi-jue-fang-an-15.png",
          "https://i.postimg.cc/cHP6jq1z/zhan-yi-san-guo-KV-shi-jue-fang-an-16.png",
          "https://i.postimg.cc/KjL4h949/zhan-yi-san-guo-KV-shi-jue-fang-an-17.png"
        ]
      },
      {
        id: "kv-0",
        title: "黑暗凝视",
        subtitle: "Newborn Key Character & Epic Worldview Development",
        desc: "聚焦于旅人主角‘小芒’在广袤黄昏氛围环境下的特写刻画，呈现人与自然的共生张力。",
        images: [],
        type: "kv_interactive",
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
      }
    ]
  },
  {
    id: "3d",
    title: "3D IP设计",
    subtitle: "3D IP Character Design Suite",
    desc: "精心完成全套3D IP角色设计流程。包含二位概念原画、数字灰色雕刻粘土白模、及虚幻5高精度实时多维逆光渲染表现。",
    items: [
      {
        id: "char-0",
        title: "角色设计",
        subtitle: "Conceptual Illustrative Orthographics",
        desc: "角色高概念二维视觉定稿设计。精研面部特征、防毒面具装配结构以及微型户外装备配件，打通次世代建模前的全套精细色彩概念。原画在16:9画布下完美直观预览。",
        images: [
          "https://i.postimg.cc/JzRmGCSn/xian-gao-yuan-hua-she-ji.png",
          "https://i.postimg.cc/x18xsszG/dong-zuo-she-ji.png"
        ],
        type: "standard"
      },
      {
        id: "char-1",
        title: "角色白模",
        subtitle: "3D High-Poly Grey Clay Model Proportions",
        desc: "次世代大片级3D高保真灰色黏土模型推演。该阶段致力于无反光材质状态下的体感、转面结构及骨骼物理表现开发，重点矫正草帽、防风兜帽、背带系统和肢体轮廓的终极剪影美感。",
        images: [
          "https://i.postimg.cc/rp36TDWD/ZBrush-hui-mo-xiao-guo-tu.png",
          "https://i.postimg.cc/D0VQc6TF/ZBrush-hui-mo-zheng-shi-tu.png",
          "https://i.postimg.cc/T32VQhBB/ZBrush-hui-mo-ce-shi-tu.png",
          "https://i.postimg.cc/Gt1YDpkg/ZBrush-hui-mo-bei-shi-tu.png"
        ],
        bottomImage: "https://i.postimg.cc/PJ4gsPKG/4189c0a2b5edd924c139f219d632d9c.png",
        type: "whitemodel"
      },
      {
        id: "char-4",
        title: "周边物料",
        subtitle: "Custom Lifestyle Merchandise & Packages",
        desc: "3D IP线下场景转化与实体周边物料视觉。深度探寻收藏级手办彩盒、便携背包、金属徽章等极智高品质生活装备的外皮包装和3D打样效果，传递硬派硬核的IP世界观张力。",
        images: [
          "https://i.postimg.cc/J05fVPMc/zhan-shu-shao-nu-zhou-bian-xi-lie-shou-ji-ke-tao-zhuang.png",
          "https://i.postimg.cc/h48WdPTS/zhan-shu-shao-nu-zhou-bian-xi-lie-tong-kuan-er-ji-wai-she.png",
          "https://i.postimg.cc/Dy59xjxN/zhan-shu-shao-nu-zhou-bian-xi-lie-chan-pin-bao-zhuang-he-yu-quan-tao-zhan-shi.png",
          "https://i.postimg.cc/dtnb5HWq/zhan-shu-shao-nu-zhou-bian-xi-lie-T-xu-yu-hui-zhang-tao-zhuang.png"
        ],
        type: "standard"
      }
    ]
  },
  {
    id: "video",
    title: "AI视频",
    subtitle: "AI Generated Cinematic & Video Promos",
    desc: "探索人工智能生成视频的核心创意、智能镜头分镜设计，结合多模态算法推演与高精度提示词工程体系，完美打通AIGC视频从概念到成片的创作路径。",
    items: [
      {
        id: "v-0",
        title: "AI文旅宣传片",
        subtitle: "AI Cultural Tourism Video Promo",
        desc: "融合东方大好河山的自然宏伟与未来国潮科技的数字画卷。项目使用Midjourney、Stable Diffusion生成高精度视觉底稿，并结合Runway、Sora算法完成镜头动态化推演。全片致力于通过超现实笔触，展现“神州秘境”之美。",
        images: ["https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&h=900&q=80"],
        type: "video_storyboard",
        videoUrl: "https://www.bilibili.com/video/BV1peTD6qErW/",
        aiTextPrompt: "图1作为广告故事板指导拍摄,禁止将故事板作为单张图像生成视频, 将图2作为角色参考,拍摄内容:\"”镜头1(大远景/航拍缓降)清晨薄雾中的东阳古镇,传统建筑群,飞檐翘角,镜头从高空缓慢下降。镜头2(远景/推镜)传统木雕工坊外景,木质门窗,镜头推进至半开的木门镜头3(中景/穿越)镜头穿过门框进入工坊,光线从窗外洒入,画面中央浮现标题文字:东阳木雕。镜头4(特写/静止)刻刀刀锋特写,锋利刀刃反射光芒.镜头5(特写/快切)刻刀敲击木材瞬间,木屑爆裂镜头6(特写/快切)匠人眼神特写,专注凝视,眼镜反光。镜头7(特写/快切)粗糙的手掌握紧刻刀,青筋暴起.镜头8(特写/快切)木屑慢镜头飞溅,在光束中旋转.   镜头9(特写/快切)刻刀在木材表面游走,刻出流畅线条.镜头10(中近景/跟拍)跟随手部动作,从粗坯到纹理初现.镜头11(特写/快切)刷子快速扫过,木屑飞扬.镜头12(特写/快切)龙鳞纹理特写,精细雕刻细节显现。镜头13(特写/快切)多把刻刀依次敲击,节奏感强烈。镜头14(大特写/快切)木纹肌理特写,刀痕与纹理交织.镜头15(中景/环绕)180度环绕匠人工作状态,背景虚化,捕捉专注神态。镜头16(特写/缓慢推进)刷子轻柔清理最后的木屑,精美浮雕图案完整呈现。镜头17(中景/推镜)完成的多层叠雕作品(花鸟图),光影流转展现立体层次。镜头18(特写/横移)镜头缓慢扫过作品细节:花瓣、羽毛、云纹.镜头19(中景/静止)匠人双手捧起作品,满意端详,脸上浮现欣慰笑容.镜头20(远景/横移)工坊内陈列的历代作品:屏风、建筑构件、摆件.镜头21(远景/缓慢上升)匠人站在工坊中央,周围环绕作品,镜头上升俯视.镜头22(特写/淡出)东阳木雕标志性纹样特写,画面渐暗,木纹肌理留存“画面质感:电影镜头质感,3D渲染质感,UE5渲染质感",
        storyboards: [
          {
            title: "分镜设计",
            image: "https://i.postimg.cc/mgFFyDyy/dong-yang-mu-diao22jing-tou-cao-tu-gu-shi-ban.png",
            prompt: "生成一张草图故事板(22个分镜头)内容为：”镜头1(大远景/航拍缓降)清晨薄雾中的东阳古镇,传统建筑群,飞檐翘角,镜头从高空缓慢下降。镜头2(远景/推镜)传统木雕工坊外景,木质门窗,镜头推进至半开的木门镜头3(中景/穿越)镜头穿过门框进入工坊,光线从窗外洒入,画面中央浮现标题文字:东阳木雕。镜头4(特写/静止)刻刀刀锋特写,锋利刀刃反射光芒.镜头5(特写/快切)刻刀敲击木材瞬间,木屑爆裂镜头6(特写/快切)匠人眼神特写,专注凝视,眼镜反光。镜头7(特写/快切)粗糙的手掌握紧刻刀,青筋暴起.镜头8(特写/快切)木屑慢镜头飞溅,在光束中旋转.   镜头9(特写/快切)刻刀在木材表面游走,刻出流畅线条.镜头10(中近景/跟拍)跟随手部动作,从粗坯到纹理初现.镜头11(特写/快切)刷子快速扫过,木屑飞扬.镜头12(特写/快切)龙鳞纹理特写,精细雕刻细节显现。镜头13(特写/快切)多把刻刀依次敲击,节奏感强烈。镜头14(大特写/快切)木纹肌理特写,刀痕与纹理交织.镜头15(中景/环绕)180度环绕匠人工作状态,背景虚化,捕捉专注神态。镜头16(特写/缓慢推进)刷子轻柔清理最后的木屑,精美浮雕图案完整呈现。镜头17(中景/推镜)完成的多层叠雕作品(花鸟图),光影流转展现立体层次。镜头18(特写/横移)镜头缓慢扫过作品细节:花瓣、羽毛、云纹.镜头19(中景/静止)匠人双手捧起作品,满意端详,脸上浮现欣慰笑容.镜头20(远景/横移)工坊内陈列的历代作品:屏风、建筑构件、摆件.镜头21(远景/缓慢上升)匠人站在工坊中央,周围环绕作品,镜头上升俯视.镜头22(特写/淡出)东阳木雕标志性纹样特写,画面渐暗,木纹肌理留存.（景别在大特写与近景之间反复切换，禁止连续生成相同的景结合荷兰角倾斜构图，大广角透视旧摄）草图不要上色，但是需要明确标注镜头号，以及人物运动，运镜的轨迹。禁止生成字幕，禁止生成水印，禁止生成LOGO"
          }
        ]
      },
      {
        id: "v-1",
        title: "AI节日短片",
        subtitle: "AI Festival Thematic Short Video",
        desc: "专为传统佳节定制的AI叙事级短片。通过将千灯万盏的团圆暖意与璀璨星空的烟花盛典相勾连，融合多模态图像对齐算法，以电影化的视角刻画出万家灯火与温馨瞬间，传达具有人文厚度的节日温情。",
        images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&h=900&q=80"],
        type: "video_storyboard",
        videoUrl: "https://www.bilibili.com/video/BV1peTD6qEQg/",
        aiTextPrompt: "图1作为广告故事板指导拍摄,禁止将故事板作为单张图像生成视频, 将图2作为角色参考,拍摄内容:包粽子表演全过程，一边表演太极一边包粽子，武术动作非常夸张，迪士尼角色动画表演方式.画面质感:电影镜头质感,3D渲染质感,UE5渲染质感",
        storyboards: [
          {
            title: "分镜设计",
            image: "https://i.postimg.cc/43VLqXs7/tu-pian-jie-dian-2-(1).png",
            prompt: "生成一张草图故事板（9个镜头），我需要每个镜头有对应时间，全过程为15秒，内容为：包粽子表演全过程，一边表演太极一边包粽子，武术动作非常夸张，迪士尼角色动画表演方式（景别在大特写与近景之间反复切换，禁止连续生成相同的景结合荷兰角倾斜构图，大广角透视旧摄）草图不要上色，但是需要明确标注镜头号，以及人物运动，运镜的轨迹。禁止生成字幕，禁止生成水印，禁止生成LOGO"
          }
        ]
      }
    ]
  }
];

// A highly optimized, reactive image loader component featuring instant loading states and custom shimmer placeholders
const ImageWithLoader: React.FC<{
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: () => void;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  disableTransition?: boolean;
}> = ({ src, alt, className = "", imgClassName = "", referrerPolicy, onClick, style, imgStyle, disableTransition }) => {
  const [loading, setLoading] = useState(() => !isImageCached(src));

  // Reset loading state when image source changes or check cache
  useEffect(() => {
    if (isImageCached(src)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      markImageCached(src);
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick} style={style}>
      {loading && (
        <div className="absolute inset-0 bg-neutral-900/95 flex flex-col items-center justify-center gap-2 transition-all duration-300 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-pulse" />
          <div className="w-5 h-5 border-[1.5px] border-white/10 border-t-brand-orange rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy={referrerPolicy}
        onLoad={() => {
          markImageCached(src);
          setLoading(false);
        }}
        className={`${imgClassName} ${
          disableTransition
            ? ""
            : `${loading ? "opacity-0 scale-95" : "opacity-100 scale-100"} transition-all duration-500 ease-out`
        }`}
        style={imgStyle}
      />
    </div>
  );
};

export default function GameFolderModal({ 
  initialSection = "offline",
  onClose, 
  onNavigateToCategory,
  isEmbedded = false
}: { 
  initialSection?: "kv" | "offline" | "aigc";
  onClose?: () => void; 
  onSelectGame?: (game: any) => void; 
  onNavigateToCategory?: (catId: "offline" | "aigc" | "kv") => void;
  isEmbedded?: boolean;
}) {
  const [activeSection, setActiveSection] = useState<"kv" | "offline" | "aigc">(initialSection);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  
  // AIGC specific menu states - default to "kv" (游戏视觉设计) -> "kv-sanguo" (创意视觉设计)
  const [activeAigcCategory, setActiveAigcCategory] = useState<"3d" | "kv" | "video">("kv");
  const [activeAigcSubIdx, setActiveAigcSubIdx] = useState<number>(0);
  
  // AIGC dynamic sub-stage states (for KV)
  const [activeKvStage, setActiveKvStage] = useState<"whitemodel" | "render3d">("whitemodel");
  
  // AIGC character settings
  const [activeCharId, setActiveCharId] = useState<"xiaomang" | "tanzai">("xiaomang");
  const [stackedIndex, setStackedIndex] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);
  
  // Blueprint indices
  const [blueprintCarouselIdx, setBlueprintCarouselIdx] = useState<number>(0);
  const [fengshenPosterIdx, setFengshenPosterIdx] = useState<number>(0);
  const [pubg6thPosterIdx, setPubg6thPosterIdx] = useState<number>(0);
  const [xiangzhenPosterIdx, setXiangzhenPosterIdx] = useState<number>(0);
  const [weaponSkinIdx, setWeaponSkinIdx] = useState<number>(0);
  const [weaponSkinExtIdx, setWeaponSkinExtIdx] = useState<number>(0);

  useEffect(() => {
    setWeaponSkinExtIdx(0);
  }, [weaponSkinIdx]);

  const [lightboxImage] = useState<string | null>(null);
  const setLightboxImage = (_url: string | null) => {};
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  // Tree Collapsible States - Expand based on active section
  const [isKvExpanded, setIsKvExpanded] = useState<boolean>(initialSection === "kv");
  const [isOfflineExpanded, setIsOfflineExpanded] = useState<boolean>(initialSection === "offline");
  const [isAigcExpanded, setIsAigcExpanded] = useState<boolean>(initialSection === "aigc");
  const [expandedAigcFolders, setExpandedAigcFolders] = useState<Record<string, boolean>>({
    "3d": false,
    "kv": initialSection === "aigc",
    "video": false
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize expanded folders so the selected item's folder is always expanded and others collapsed
  useEffect(() => {
    setActiveKvStage("whitemodel");
    setWeaponSkinIdx(0);
    setIsKvExpanded(activeSection === "kv");
    setIsOfflineExpanded(activeSection === "offline");
    setIsAigcExpanded(activeSection === "aigc");
    setExpandedAigcFolders({
      "3d": activeSection === "aigc" && activeAigcCategory === "3d",
      "kv": activeSection === "aigc" && activeAigcCategory === "kv",
      "video": activeSection === "aigc" && activeAigcCategory === "video"
    });
  }, [activeSection, activeIdx, activeAigcCategory, activeAigcSubIdx]);

  // Helper selectors
  const activeAigcCategoryObj = aigcCategories.find(c => c.id === activeAigcCategory) || aigcCategories[0];
  const currentAigcItem = activeAigcCategoryObj.items[activeAigcSubIdx] || activeAigcCategoryObj.items[0];

  const currentItem = activeSection === "kv" 
    ? games[activeIdx] 
    : activeSection === "offline" 
      ? offlineItems[activeIdx] 
      : (currentAigcItem as any);

  // Priority Image Preloader:
  // 1. Load currently viewed project's images first.
  // 2. Once current project images finish loading, if user is still viewing this project, background preload other projects' images.
  // 3. If user switches projects at any time, immediately cancel background preload and prioritize the new project.
  useEffect(() => {
    if (!currentItem) return;

    // Current project images
    const currentProjectImages = extractProjectImages(currentItem);
    if (currentItem.id === "cf_weapon_skin") {
      weaponSkinsData.forEach((w) => {
        if (w.image) currentProjectImages.push(w.image);
        if (w.extensions && Array.isArray(w.extensions)) currentProjectImages.push(...w.extensions);
      });
    }

    // Other projects' images
    const otherProjectsImages: string[] = [];
    games.forEach((g) => {
      if (g.id !== currentItem.id) {
        otherProjectsImages.push(...extractProjectImages(g));
      }
    });
    offlineItems.forEach((off) => {
      if (off.id !== currentItem.id) {
        otherProjectsImages.push(...extractProjectImages(off));
      }
    });
    aigcCategories.forEach((cat) => {
      cat.items.forEach((it) => {
        if (it.id !== currentItem.id) {
          otherProjectsImages.push(...extractProjectImages(it));
        }
      });
    });

    const cleanup = prioritizeProjectImages(currentProjectImages, otherProjectsImages);
    return cleanup;
  }, [activeSection, activeIdx, activeAigcCategory, activeAigcSubIdx, currentItem]);

  // Sync scroll position to top when content changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeSection, activeIdx, activeAigcCategory, activeAigcSubIdx]);

  const handleScrollWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setStackedIndex((prev) => (prev + 1) % 3);
    } else {
      setStackedIndex((prev) => (prev - 1 + 3) % 3);
    }
  };

  const toggleAigcFolder = (folderId: string) => {
    setExpandedAigcFolders(prev => {
      const nextVal = !prev[folderId];
      if (nextVal) {
        return {
          "3d": folderId === "3d",
          "kv": folderId === "kv",
          "demo": folderId === "demo",
          "video": folderId === "video"
        };
      } else {
        return {
          ...prev,
          [folderId]: false
        };
      }
    });
  };

  const characters = {
    xiaomang: {
      name: "小芒",
      role: "郊外野生探险者 (Wild Explorer)",
      personality: "好奇心驱动型行动派，对未知事物充满执念，遇到谜题会极力思索（脑袋冒齿轮特效），但偶尔会因冲动踩坑（比如误把别人埋的破烂当宝藏）。",
      visuals: "带极高实用性的防晒探险装束：宽檐探险草帽，帽顶配明亮探照灯（兼具夜间探测与热能供应）；活力十足的橙色短袖T恤与舒适浅蓝色短裤，极配户外沙地上刨土和攀爬；工装靴耐磨防滑，携帆布背包内置军工铲及地形图。",
      portrait: "https://i.postimg.cc/RVMjThjk/Snipaste-2026-05-21-15-15-51.png",
      drafts: [
        {
          title: "小芒全身设计草稿",
          url: "https://i.postimg.cc/Y9zd4fqf/mmt-Sw-WIKy-Kt-san-shi-tu-cao-gao.webp",
          desc: "角色全身多视角起稿，确定草帽比例与背包结构细节"
        },
        {
          title: "小芒2D模型上色与精细渲染",
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
      role: "原生林地守护精灵 (Native Forest Sprite)",
      personality: "守护森林地心之源的 “暖晶矿”，生命源泉与其息息相关。对外来者充满强烈的天然防备、警惕，但由于天生孤单缺乏伙伴，极易被体贴的善意所触动，对温暖非常依恋。",
      visuals: "圆滚滚浑然天成的黑色胶质身躯，由火山冷却后的黑耀熔岩胶凝结而成，具有独特微小且富有生机的凹凸斑驳质感；头顶带有空气感爆发性微闪晶核，晶核亮度和形态根据呼吸及情绪波澜变幻。极度依恋探照灯热度。",
      portrait: "https://i.postimg.cc/x1LMTjd1/Snipaste-2026-05-21-15-16-36.png",
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

  const islands = [
    { id: "isl-1", num: "01", title: "沙尘退化地", desc: "清理场景陈年荒废遗迹，小心点种下第一批抗旱低耗固沙植被。", image: "https://i.postimg.cc/FRHTLkfJ/mmt-TAy-Wwhnq-dao1.webp" },
    { id: "isl-2", num: "02", title: "灌溉延伸区", desc: "延伸巩固新水渠，建立小型高架自流灌溉点吸引人口进驻。", image: "https://i.postimg.cc/d1V5yZ7n/mmt-TAMRHLl-J-dao2.webp" },
    { id: "isl-3", num: "03", title: "狂风阻截地", desc: "搭建大型防御风屏与防沙障栅栏，全力阻拦强大流沙吞噬绿洲。", image: "https://i.postimg.cc/tT4Bxn1K/mmt-TAZm-Ig-Xj-dao3.webp" },
    { id: "isl-4", num: "04", title: "生态修复区", desc: "跟踪林带指数增长，收集繁育丰硕标本，丰富生态标本图库。", image: "https://i.postimg.cc/XJ1QcNdS/mmt-TBkihi-ML-dao4.webp" }
  ];

  const blueprints = [
    "https://i.postimg.cc/Hx3s6RsN/mm-Afw-MUXy-SM-zi-yuan-17.webp",
    "https://i.postimg.cc/QCyN3776/mm-Afx-AGj-Awn-zi-yuan-19.webp",
    "https://i.postimg.cc/ZY753GQg/mm-Afx-Yaj-JNn-zi-yuan-18.webp",
    "https://i.postimg.cc/CLRL4vyW/mm-Afy-Ll-SXd-T-zi-yuan-20.webp",
    "https://i.postimg.cc/cHJNLHds/mm-Adyba-MFn-O-zi-yuan-15.webp"
  ];

  const getPathBreadcrumb = () => {
    if (activeSection === "kv") {
      return `游戏海报设计 / ${currentItem?.title || ''}`;
    } else if (activeSection === "offline") {
      return `线下物料 / ${currentItem?.title || ''}`;
    } else {
      return `AIGC / ${activeAigcCategoryObj.title} / ${currentItem?.title || ''}`;
    }
  };

  const getCurrentProjectKVColor = () => {
    if (!currentItem) {
      return {
        color: "rgba(10, 10, 10, 0.4)",
        glow: "rgba(241, 90, 36, 0.05)"
      };
    }
    const id = currentItem.id;
    
    // --- 1. Game KV Projects ---
    if (id === "cf") {
      return { 
        color: "rgba(0, 140, 230, 0.06)", // Cyber Bilibili Blue-Cyan
        glow: "rgba(251, 114, 153, 0.18)"  // Neon Pink energy glow
      };
    }
    if (id === "cf_swallowed_star") {
      return { 
        color: "rgba(38, 16, 56, 0.12)", // Cosmic deep starry space purple
        glow: "rgba(147, 51, 234, 0.22)"  // Intense hyper-space purple energy glow
      };
    }
    if (id === "cf_shanghai_animation") {
      return { 
        color: "rgba(185, 28, 28, 0.07)", // Vintage cinnabar red base
        glow: "rgba(245, 158, 11, 0.18)"  // Traditional Chinese gold/amber ink glow
      };
    }
    if (id === "cf_fengshen") {
      return { 
        color: "rgba(217, 119, 6, 0.08)", // Bronze gold/coal base
        glow: "rgba(239, 68, 68, 0.20)"  // Intense golden flame orange-red glow
      };
    }
    if (id === "cf_hangzhou_cfs") {
      return { 
        color: "rgba(14, 116, 144, 0.09)", // Clear lake mountain cyan
        glow: "rgba(255, 255, 255, 0.28)" // Pristine misty blue-white water glow
      };
    }
    if (id === "cf_weapon_skin") {
      const activeSkin = weaponSkinsData[weaponSkinIdx] || weaponSkinsData[0];
      return {
        color: activeSkin.color,
        glow: activeSkin.glow
      };
    }
    if (id === "cf_museum") {
      return { 
        color: "rgba(180, 83, 9, 0.07)", // Museum Bronze Gold gallery tone
        glow: "rgba(245, 158, 11, 0.22)"  // Sunset Amber Memory Corridor glow
      };
    }
    if (id === "cf_new_five_years") {
      return { 
        color: "rgba(16, 185, 129, 0.06)", // Championship slate emerald base
        glow: "rgba(234, 179, 8, 0.18)"   // Sleek heavy gold medal glow
      };
    }
    if (id === "pubgm_6th") {
      return { 
        color: "rgba(234, 179, 8, 0.08)", // Solar gold/yellow base for 6th Anniversary
        glow: "rgba(234, 179, 8, 0.22)"  // Radiant golden/yellow energy glow
      };
    }
    if (id === "pubgm_xiangzhen") {
      return { 
        color: "rgba(217, 119, 6, 0.10)", // Sunset harvest gold/wheat field base
        glow: "rgba(245, 158, 11, 0.22)"  // Radiant sunlit rural amber glow
      };
    }
    if (id === "pubgm_gaode") {
      return { 
        color: "rgba(14, 165, 233, 0.08)", // GPS navigation sky blue base
        glow: "rgba(6, 182, 212, 0.25)"   // Luminous AutoNavi cyber cyan glow
      };
    }
    if (id === "pubgm_shizhuangzhou") {
      return { 
        color: "rgba(124, 58, 237, 0.08)", // Royal purple base
        glow: "rgba(168, 85, 247, 0.25)"  // Neon violet/purple glow
      };
    }
    if (id === "pubgm") {
      return { 
        color: "rgba(34, 197, 94, 0.09)", // Tactical military olive green base
        glow: "rgba(34, 197, 94, 0.16)"   // Luminous forest tactical energy glow
      };
    }
    if (id === "other") {
      return { 
        color: "rgba(14, 165, 233, 0.09)", // Cyberpunk indigo-violet base
        glow: "rgba(14, 165, 233, 0.16)"  // Muted neon sky blue glow
      };
    }
    
    // --- 2. Offline Materials ---
    if (id === "off-1") {
      return { 
        color: "rgba(239, 68, 68, 0.09)", // Aggressive tournament arena crimson
        glow: "rgba(239, 68, 68, 0.22)"   // Hot stadium red light glow
      };
    }
    if (id === "off-2") {
      return { 
        color: "rgba(245, 158, 11, 0.09)", // Academic orange-yellow base
        glow: "rgba(245, 158, 11, 0.20)"  // Warm school/campus orange glow
      };
    }
    if (id === "off-3") {
      return { 
        color: "rgba(225, 29, 72, 0.08)", // Cologne gaming rose-red base
        glow: "rgba(225, 29, 72, 0.18)"  // Electric magenta/pink neon glow
      };
    }
    if (id === "off-4") {
      return { 
        color: "rgba(6, 182, 212, 0.09)", // LOL Summoner Rift cyan blue base
        glow: "rgba(6, 182, 212, 0.20)"   // Cyber hextech cyan-blue glow
      };
    }
    if (id === "off-5") {
      return { 
        color: "rgba(234, 179, 8, 0.08)", // Bangkok hot tropical sun yellow base
        glow: "rgba(234, 179, 8, 0.20)"   // Radiant golden solar energy glow
      };
    }
    if (id === "off-6") {
      return { 
        color: "rgba(249, 115, 22, 0.08)", // MG & PUBG Racing dynamic orange base
        glow: "rgba(249, 115, 22, 0.20)"   // Radiant automotive collaboration glow
      };
    }

    // --- 3. AIGC Character / Model Showcase ---
    if (id === "char-0") {
      return { 
        color: "rgba(20, 184, 166, 0.07)", // Character concept blueprint slate-teal
        glow: "rgba(20, 184, 166, 0.16)"   // Luminous draft turquoise glow
      };
    }
    if (id === "char-1") {
      return { 
        color: "rgba(156, 163, 175, 0.07)", // ZBrush pure gray clay sculpt base
        glow: "rgba(255, 255, 255, 0.18)"  // Studio diffuse limestone white glow
      };
    }
    if (id === "char-2") {
      return { 
        color: "rgba(249, 115, 22, 0.07)", // UE5 high-intensity orange backlight base
        glow: "rgba(249, 115, 22, 0.22)"   // Cinematic sunset rim-light amber glow
      };
    }
    if (id === "char-3") {
      return { 
        color: "rgba(38, 38, 38, 0.08)",   // Hard-surface brand manual slate base
        glow: "rgba(245, 158, 11, 0.15)"  // Minimalist orange interface glow
      };
    }
    if (id === "char-4") {
      return { 
        color: "rgba(99, 102, 241, 0.06)", // Modern merchandise box deep indigo
        glow: "rgba(168, 85, 247, 0.18)"  // Dynamic purple neon lifestyle glow
      };
    }
    if (id === "char-5") {
      return { 
        color: "rgba(14, 165, 233, 0.08)", // Core visual blockbuster cyan-blue base
        glow: "rgba(6, 182, 212, 0.20)"   // Intense sky-blue energy glow
      };
    }

    // --- 4. AIGC Key Visuals ---
    if (id === "kv-sanguo") {
      return { 
        color: "#000000", // Pure black
        glow: "rgba(0, 0, 0, 0)" // No gradient overlay
      };
    }
    if (id === "kv-0") {
      return { 
        color: "rgba(249, 115, 22, 0.08)", // Curse Deadwood void orange-black base
        glow: "rgba(239, 68, 68, 0.18)"   // Haunting warm lantern fire glow
      };
    }
    if (id === "kv-1") {
      return { 
        color: "rgba(13, 148, 136, 0.08)", // Halo Master Chief sage armor green base
        glow: "rgba(14, 116, 144, 0.20)"  // Sci-fi ancient energy core blue glow
      };
    }
    if (id === "kv-2") {
      return { 
        color: "rgba(16, 185, 129, 0.08)", // Spec ops dark green base
        glow: "rgba(34, 197, 94, 0.18)"   // Cyber HUD neon green battlefield glow
      };
    }

    // --- 5. AIGC Sandbox Game Demo ---
    if (id === "demo-0") {
      return { 
        color: "rgba(132, 204, 22, 0.08)", // Sandbox blueprint pixel green base
        glow: "rgba(132, 204, 22, 0.18)"  // Minecraft-style neon forest lime glow
      };
    }
    if (id === "demo-1") {
      return { 
        color: "rgba(234, 179, 8, 0.07)",  // Lego toy plastic yellow-red base
        glow: "rgba(239, 68, 68, 0.18)"   // Energetic playful fire orange glow
      };
    }
    if (id === "demo-2") {
      return { 
        color: "rgba(56, 189, 248, 0.07)", // Floating island altitude sky blue
        glow: "rgba(6, 182, 212, 0.18)"   // Dreamy clouds wind cyan glow
      };
    }
    if (id === "demo-3") {
      return { 
        color: "rgba(34, 197, 94, 0.08)", // Photorealistic forest foliage green
        glow: "rgba(234, 179, 8, 0.18)"   // Sunny rays Lumen golden-yellow glow
      };
    }
    
    // --- Default Dynamic Fallback ---
    return {
      color: "rgba(241, 90, 36, 0.08)",
      glow: "rgba(241, 90, 36, 0.12)"
    };
  };

  const kvTheme = getCurrentProjectKVColor();

  return (
    <motion.div
      initial={isEmbedded ? undefined : { opacity: 0 }}
      animate={isEmbedded ? undefined : { opacity: 1 }}
      exit={isEmbedded ? undefined : { opacity: 0 }}
      className={isEmbedded 
        ? "w-full h-full bg-[#050505] overflow-hidden text-white relative pt-0 pb-20 md:pb-12" 
        : "fixed inset-0 z-[120] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden text-white"
      }
    >
      {/* Modern Floating Close Button */}
      {!isEmbedded && onClose && (
        <button
          onClick={onClose}
          className="fixed top-3 right-4 md:top-8 md:right-8 z-[155] p-2.5 md:p-3 text-white/70 hover:text-brand-orange hover:bg-white/15 bg-neutral-900/90 md:bg-neutral-950/80 border border-white/10 backdrop-blur-md rounded-full active:scale-95 transition-all shadow-2xl cursor-pointer"
          title="关闭"
        >
          <X size={20} className="md:w-[24px] md:h-[24px]" />
        </button>
      )}

      {/* Main Grid Viewport Split */}
      <div className="w-full h-full flex flex-col md:flex-row pt-0 pb-0 overflow-hidden relative">
        
        {/* Mobile & Tablet apple-like collapsible Menu */}
        <div className="md:hidden sticky top-[0px] z-50 w-full bg-neutral-950 border-b border-white/10 p-4 pr-16 shadow-2xl select-none">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex flex-col truncate pr-2">
              <span className="text-[9px] font-mono text-brand-orange font-extrabold uppercase tracking-wide">
                DIRECTORY TREE / 目录层级架构
              </span>
              <span className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5 hover:text-brand-orange transition-colors truncate">
                <span className="truncate">
                  {activeSection === "kv" ? "游戏海报设计" : activeSection === "offline" ? "线下物料" : "AIGC"} / {currentItem?.title || ''}
                </span>
                <span className="text-[10px] text-brand-orange align-middle shrink-0">▼</span>
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-brand-orange transition-transform duration-300 shrink-0 ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3 pt-3 border-t border-white/5 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar"
              >
                {/* 1. 第一层级: 线下物料 */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const nextVal = !isOfflineExpanded;
                      setIsOfflineExpanded(nextVal);
                      if (nextVal) {
                        setIsKvExpanded(false);
                        setIsAigcExpanded(false);
                      }
                      setActiveSection("offline");
                      setActiveIdx(0);
                    }}
                    className="group w-full h-[58px] rounded-xl border border-white/10 hover:border-brand-orange/30 flex items-center text-left bg-neutral-900/90 hover:bg-neutral-900 shadow-lg transition-all active:scale-[0.98] select-none cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-orange/15 border border-brand-orange/30 backdrop-blur-sm shrink-0">
                          <Compass size={16} className="text-brand-orange" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-sans font-extrabold tracking-wider text-white group-hover:text-brand-orange transition-colors">线下物料</span>
                          <span className="text-[9px] font-mono font-bold text-white/50 tracking-widest uppercase mt-0.5">
                            offline / {offlineItems.length}个物料
                          </span>
                        </div>
                      </div>
                      <ChevronDown size={15} className={`text-white/40 group-hover:text-brand-orange transition-colors duration-300 shrink-0 ${isOfflineExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOfflineExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-3.5 border-l border-white/10 space-y-1 mt-1"
                      >
                        {offlineItems.map((item, idx) => {
                          const isActive = activeSection === "offline" && activeIdx === idx;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveSection("offline");
                                setActiveIdx(idx);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                isActive 
                                  ? "bg-brand-orange/15 text-white border border-brand-orange/20 font-extrabold text-[12.5px]" 
                                  : "text-white/60 hover:text-white text-[12.5px]"
                              }`}
                            >
                              <span>{item.title}</span>
                              {isActive && <Check size={14} className="text-brand-orange shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. 第一层级: 游戏海报设计 */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const nextVal = !isKvExpanded;
                      setIsKvExpanded(nextVal);
                      if (nextVal) {
                        setIsOfflineExpanded(false);
                        setIsAigcExpanded(false);
                      }
                    }}
                    className="group w-full h-[58px] rounded-xl border border-white/10 hover:border-brand-orange/30 flex items-center text-left bg-neutral-900/90 hover:bg-neutral-900 shadow-lg transition-all active:scale-[0.98] select-none cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-orange/15 border border-brand-orange/30 backdrop-blur-sm shrink-0">
                          <Layers size={16} className="text-brand-orange" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-sans font-extrabold tracking-wider text-white group-hover:text-brand-orange transition-colors">游戏海报设计</span>
                          <span className="text-[9px] font-mono font-bold text-white/50 tracking-widest uppercase mt-0.5">
                            KEY VISUAL / {games.length}个项目
                          </span>
                        </div>
                      </div>
                      <ChevronDown size={15} className={`text-white/40 group-hover:text-brand-orange transition-colors duration-300 shrink-0 ${isKvExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isKvExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-3.5 border-l border-white/10 space-y-1 mt-1"
                      >
                        {games.map((g, idx) => {
                          const isActive = activeSection === "kv" && activeIdx === idx;
                          return (
                            <button
                              key={g.id}
                              onClick={() => {
                                setActiveSection("kv");
                                setActiveIdx(idx);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                isActive 
                                  ? "bg-brand-orange/15 text-white border border-brand-orange/20 font-extrabold text-[12.5px]" 
                                  : "text-white/60 hover:text-white text-[12.5px]"
                              }`}
                            >
                              <span>{g.title}</span>
                              {isActive && <Check size={14} className="text-brand-orange shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. 第三层级: AIGC */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const nextVal = !isAigcExpanded;
                      setIsAigcExpanded(nextVal);
                      if (nextVal) {
                        setIsKvExpanded(false);
                        setIsOfflineExpanded(false);
                      }
                    }}
                    className="group w-full h-[58px] rounded-xl border border-white/10 hover:border-purple-500/30 flex items-center text-left bg-neutral-900/90 hover:bg-neutral-900 shadow-lg transition-all active:scale-[0.98] select-none cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/15 border border-purple-500/30 backdrop-blur-sm shrink-0">
                          <Sparkles size={16} className="text-purple-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-sans font-extrabold tracking-wider text-white group-hover:text-purple-400 transition-colors">AIGC</span>
                          <span className="text-[9px] font-mono font-bold text-white/50 tracking-widest uppercase mt-0.5">
                            SMART ART / 4大模块
                          </span>
                        </div>
                      </div>
                      <ChevronDown size={15} className={`text-white/40 group-hover:text-purple-400 transition-colors duration-300 shrink-0 ${isAigcExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isAigcExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-3.5 border-l border-white/10 space-y-3 mt-2"
                      >
                        {aigcCategories.map((cat) => {
                          const isFolderExp = expandedAigcFolders[cat.id];
                          return (
                            <div key={cat.id} className="space-y-1.5">
                              {/* 第二层级: AIGC类目 */}
                              <button
                                onClick={() => toggleAigcFolder(cat.id)}
                                className="w-full flex items-center justify-between py-1.5 px-2 bg-white/[0.03] rounded-lg text-left text-[13px] text-white/85 hover:text-white font-bold transition-all"
                              >
                                <span>{cat.title}</span>
                                <ChevronDown size={12} className={`text-white/40 transition-transform ${isFolderExp ? "rotate-0" : "-rotate-90"}`} />
                              </button>

                              {/* 第三层级: AIGC子项目列表 */}
                              <AnimatePresence>
                                {isFolderExp && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden pl-3 border-l border-purple-500/25 space-y-1"
                                  >
                                    {cat.items.map((sub, sIdx) => {
                                      const isActive = activeSection === "aigc" && activeAigcCategory === cat.id && activeAigcSubIdx === sIdx;
                                      return (
                                        <button
                                          key={sub.id}
                                          onClick={() => {
                                            setActiveSection("aigc");
                                            setActiveAigcCategory(cat.id as any);
                                            setActiveAigcSubIdx(sIdx);
                                            setIsMenuOpen(false);
                                          }}
                                          className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-all ${
                                            isActive 
                                              ? "bg-purple-600/20 text-white border border-purple-500/30 font-extrabold text-[12px]" 
                                              : "text-white/50 hover:text-white text-[12px]"
                                          }`}
                                        >
                                          <span>{sub.title}</span>
                                          {isActive && <Check size={12} className="text-purple-400 shrink-0" />}
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Left Side menu - Scrollable File System Explorer (Desktop View) */}
        <div className="hidden md:flex md:w-[320px] border-r border-white/5 flex-col gap-3.5 p-4 bg-neutral-950/40 overflow-y-auto no-scrollbar shrink-0">
          <div className="space-y-4">
            <div className="text-[11px] font-mono text-white/30 tracking-[0.3em] uppercase pb-1 flex items-center justify-between">
              <span>EXPLORER / 目录资源树</span>
              <span className="text-[9px] bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded border border-brand-orange/20 font-black">PRO</span>
            </div>

            {/* Folder-style Nested Directory Tree */}
            <div className="space-y-4 select-none">
              
              {/* Level 1: 线下物料 */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    const nextVal = !isOfflineExpanded;
                    setIsOfflineExpanded(nextVal);
                    if (nextVal) {
                      setIsKvExpanded(false);
                      setIsAigcExpanded(false);
                    }
                    setActiveSection("offline");
                    setActiveIdx(0);
                  }}
                  className="group w-full h-[50px] rounded-lg border border-white/[0.05] hover:border-brand-orange/30 flex items-center text-left bg-neutral-900/80 hover:bg-neutral-900 shadow-sm transition-all select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full px-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-orange/15 border border-brand-orange/30 backdrop-blur-sm shrink-0">
                        <Compass size={14} className="text-brand-orange" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-sans font-extrabold tracking-wide text-white group-hover:text-brand-orange transition-colors">线下物料</span>
                        <span className="text-[8px] font-mono font-bold text-white/40 tracking-wider uppercase mt-0.5">
                          OFFLINE / {offlineItems.length}个物料
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-white/30 group-hover:text-brand-orange transition-colors duration-300 shrink-0 ${isOfflineExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isOfflineExpanded && (
                  <div className="ml-3 pl-3.5 border-l border-white/15 space-y-1.5 pt-1 pb-1">
                    {offlineItems.map((item, idx) => {
                      const isActive = activeSection === "offline" && activeIdx === idx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection("offline");
                            setActiveIdx(idx);
                          }}
                          className={`group relative flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-left text-[12px] md:text-[13px] transition-all w-full border ${
                            isActive
                              ? "bg-brand-orange/10 border-brand-orange/30 text-white font-extrabold shadow-[0_3px_12px_rgba(242,125,38,0.08)]"
                              : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-white/15" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Level 1: 游戏海报设计 */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    const nextVal = !isKvExpanded;
                    setIsKvExpanded(nextVal);
                    if (nextVal) {
                      setIsOfflineExpanded(false);
                      setIsAigcExpanded(false);
                    }
                  }}
                  className="group w-full h-[50px] rounded-lg border border-white/[0.05] hover:border-brand-orange/30 flex items-center text-left bg-neutral-900/80 hover:bg-neutral-900 shadow-sm transition-all select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full px-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-orange/15 border border-brand-orange/30 backdrop-blur-sm shrink-0">
                        <Layers size={14} className="text-brand-orange" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-sans font-extrabold tracking-wide text-white group-hover:text-brand-orange transition-colors">游戏海报设计</span>
                        <span className="text-[8px] font-mono font-bold text-white/40 tracking-wider uppercase mt-0.5">
                          KEY VISUALS / {games.length}个项目
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-white/30 group-hover:text-brand-orange transition-colors duration-300 shrink-0 ${isKvExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isKvExpanded && (
                  <div className="ml-3 pl-3.5 border-l border-white/15 space-y-1.5 pt-1 pb-1">
                    {games.map((g, idx) => {
                      const isActive = activeSection === "kv" && activeIdx === idx;
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            setActiveSection("kv");
                            setActiveIdx(idx);
                          }}
                          className={`group relative flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-left text-[12px] md:text-[13px] transition-all w-full border ${
                            isActive
                              ? "bg-brand-orange/10 border-brand-orange/30 text-white font-extrabold shadow-[0_3px_12px_rgba(242,125,38,0.08)]"
                              : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-white/15" />
                          <span className="truncate">{g.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Level 1: AIGC */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    const nextVal = !isAigcExpanded;
                    setIsAigcExpanded(nextVal);
                    if (nextVal) {
                      setIsKvExpanded(false);
                      setIsOfflineExpanded(false);
                    }
                  }}
                  className="group w-full h-[50px] rounded-lg border border-white/[0.05] hover:border-purple-500/30 flex items-center text-left bg-neutral-900/80 hover:bg-neutral-900 shadow-sm transition-all select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full px-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-purple-500/15 border border-purple-500/30 backdrop-blur-sm shrink-0">
                        <Sparkles size={14} className="text-purple-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-sans font-extrabold tracking-wide text-white group-hover:text-purple-400 transition-colors">AIGC</span>
                        <span className="text-[8px] font-mono font-bold text-white/40 tracking-wider uppercase mt-0.5">
                          SMART ART / 4大模块
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-white/30 group-hover:text-purple-400 transition-colors duration-300 shrink-0 ${isAigcExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isAigcExpanded && (
                  <div className="ml-3 pl-2.5 border-l border-white/15 space-y-2.5 pt-1.5 pb-1">
                    {aigcCategories.map((cat) => {
                      const isFolderExp = expandedAigcFolders[cat.id];
                      return (
                        <div key={cat.id} className="space-y-1">
                          
                          {/* Level 2 Folder Header */}
                          <button
                            onClick={() => toggleAigcFolder(cat.id)}
                            className="w-full flex items-center justify-between py-1 px-1.5 rounded text-left text-[12px] md:text-[13px] text-white/70 hover:text-white font-extrabold hover:bg-white/5 transition-all"
                          >
                            <span className="flex items-center gap-1.5">
                              <span>{cat.title}</span>
                            </span>
                            <ChevronDown size={11} className={`text-white/30 transition-transform ${isFolderExp ? "rotate-0" : "-rotate-90"}`} />
                          </button>

                          {/* Level 3 items */}
                          {isFolderExp && (
                            <div className="ml-2 pl-3 border-l border-purple-500/10 space-y-1.5 pt-0.5">
                              {cat.items.map((sub, sIdx) => {
                                const isActive = activeSection === "aigc" && activeAigcCategory === cat.id && activeAigcSubIdx === sIdx;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setActiveSection("aigc");
                                      setActiveAigcCategory(cat.id as any);
                                      setActiveAigcSubIdx(sIdx);
                                    }}
                                    className={`group relative flex items-center gap-1.5 py-1 px-2 rounded text-left text-[11px] md:text-[12px] transition-all w-full border ${
                                      isActive
                                        ? "bg-purple-600/15 border-purple-500/30 text-white font-extrabold shadow-[0_2px_10px_rgba(168,85,247,0.12)]"
                                        : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                                    }`}
                                  >
                                    <span className="absolute -left-[12px] top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-white/10" />
                                    <span className="truncate">{sub.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Side Content - Visual Asset Inspection Deck */}
        <div 
          ref={scrollContainerRef}
          id="project-scroll-container"
          className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 md:p-12 pb-24 relative"
          style={{
            backgroundColor: kvTheme.color,
            backgroundImage: `radial-gradient(circle at 50% 15%, ${kvTheme.glow} 0%, rgba(10, 10, 10, 0) 75%)`,
            transition: 'background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-image 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activeIdx}-${activeAigcCategory}-${activeAigcSubIdx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="max-w-5xl mx-auto space-y-6 md:space-y-10"
              >
                {/* Header Information Indicator */}
                {currentItem.id !== "cf" && currentItem.id !== "cf_museum" && currentItem.id !== "cf_swallowed_star" && currentItem.id !== "cf_fengshen" && currentItem.id !== "cf_shanghai_animation" && currentItem.id !== "cf_hangzhou_cfs" && currentItem.id !== "cf_weapon_skin" && currentItem.id !== "cf_new_five_years" && currentItem.id !== "pubgm_6th" && currentItem.id !== "pubgm_xiangzhen" && currentItem.id !== "pubgm_gaode" && currentItem.id !== "pubgm_shizhuangzhou" && (
                  <div className="border-b border-white/5 pb-5 md:pb-8">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5 md:mb-4">
                      <span className="text-brand-orange text-[14px] md:text-lg font-bold tracking-normal">
                        {getPathBreadcrumb()}
                      </span>
                      {activeSection === "aigc" && (
                        <span className="text-[9px] md:text-[10px] font-mono font-black px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 ml-2">
                          AIGC
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-2 md:mb-4">
                      {currentItem.title}
                    </h3>
                    <div className={`w-12 md:w-16 h-[2px] mt-2 md:mt-4 ${activeSection === "aigc" ? "bg-purple-500" : "bg-brand-orange"}`} />
                  </div>
                )}

                {/* DYNAMIC CONTENT SWITCHERS BASED ON ITEM TYPES */}

                {/* SPECIAL CASE: Crossfire (穿越火线) Custom Layout */}
                {currentItem.id === "cf" && (
                  <div className="space-y-12 max-w-4xl mx-auto pt-2 pb-12 select-none">
                    
                    {/* First Row: 穿越火线 X Bilibili World 首图 + 项目介绍 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          穿越火线 X Bilibili World
                        </h4>
                      </div>
                      <div 
                        onClick={() => setLightboxImage("https://i.postimg.cc/5y5LBkNt/9b2c418f3dcc239a1cb2414143cd7ef.jpg")}
                        className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                      >
                        <ImageWithLoader
                          src="https://i.postimg.cc/5y5LBkNt/9b2c418f3dcc239a1cb2414143cd7ef.jpg"
                          alt="穿越火线 X Bilibili World"
                          imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          className="w-full h-full"
                          imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                        />
                      </div>

                      {/* 项目介绍 (放在首图下方) */}
                      <div className="mt-4 bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                          DECK_PORTAL_F01
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-orange uppercase">
                            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                            项目介绍：
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed font-sans font-semibold pl-3">
                            背景穿插着举办地的上海地标，画面中的美式校园储物柜冲出学院风格的穿越火线角色们与各种校园元素结合
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                          <span>ID: ARCHIVE_CF_02</span>
                          <span>STATUS: COMPLETED</span>
                        </div>
                      </div>
                    </div>

                    {/* Second Row: 创意方案 */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          创意方案
                        </h4>
                      </div>
                      
                      {/* Top: 16:9 content image */}
                      <div className="space-y-2">
                        <div 
                          onClick={() => setLightboxImage("https://i.postimg.cc/Gh81pw27/5fa18d0cde881f9d0aef23d070ab31b.jpg")}
                          className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src="https://i.postimg.cc/Gh81pw27/5fa18d0cde881f9d0aef23d070ab31b.jpg"
                            alt="创意设计图"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>
                      </div>

                      {/* Bottom Grid: Left (Mood reference), Right (Keywords) */}
                      <div className="flex flex-col space-y-2">
                        {/* Label row above the content boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none">
                          <div className="md:col-span-7">
                            <span className="text-xs font-mono font-bold text-white/70 uppercase flex items-center gap-1.5 pb-1">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              调性参考
                            </span>
                          </div>
                          <div className="md:col-span-5 hidden md:block">
                            <span className="text-xs font-mono font-bold text-white/70 uppercase flex items-center gap-1.5 pb-1">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              设计关键词 (STYLE DESCRIPTORS)
                            </span>
                          </div>
                        </div>

                        {/* Content boxes row sharing items-stretch */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                          {/* Bottom Left: Mood reference image */}
                          <div 
                            onClick={() => setLightboxImage("https://i.postimg.cc/VNyth8rQ/wei-biao-ti-1-hua-ban-1.png")}
                            className="md:col-span-7 group relative w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default flex items-center"
                          >
                            <ImageWithLoader
                              src="https://i.postimg.cc/VNyth8rQ/wei-biao-ti-1-hua-ban-1.png"
                              alt="调性参考图"
                              imgClassName="w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                              className="w-full h-auto"
                              imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                            />
                          </div>

                          {/* Bottom Right: Design keywords panel */}
                          <div className="md:col-span-5 flex flex-col justify-between bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                              TAGS_F01
                            </div>

                            <div className="space-y-4">
                              <span className="text-[11px] text-white/40 font-mono tracking-widest uppercase flex items-center gap-1.5 md:hidden">
                                <span className="w-1.5 h-1.5 bg-brand-orange/40 rounded-full" />
                                设计关键词 (STYLE DESCRIPTORS)
                              </span>
                              
                              <div className="flex flex-wrap gap-2 pt-2">
                                {[
                                  { zh: "学院", en: "Academy" },
                                  { zh: "缤纷", en: "Vibrant" },
                                  { zh: "明亮", en: "Bright" },
                                  { zh: "欢乐", en: "Joyful" }
                                ].map((kw, i) => (
                                  <div 
                                    key={i} 
                                    className="flex flex-col px-3 py-2 bg-neutral-950/50 border border-white/5 rounded-lg hover:border-brand-orange/40 transition-all duration-300 group/item"
                                  >
                                    <span className="text-xs font-semibold text-white group-hover/item:text-brand-orange transition-colors">
                                      {kw.zh}
                                    </span>
                                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                                      {kw.en}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                              <span>GRID: SECTOR_A3</span>
                              <span>TONE: ULTRA_TECH</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* SPECIAL CASE: Crossfire Time Museum (穿越火线时光博物馆) Custom Layout */}
                {currentItem.id === "cf_museum" && (
                  <div className="space-y-12 max-w-4xl mx-auto pt-2 pb-12 select-none">
                    
                    {/* First Row: 穿越火线时光博物馆 首图 + 项目介绍 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          穿越火线时光博物馆
                        </h4>
                      </div>
                      <div 
                        onClick={() => setLightboxImage("https://i.postimg.cc/y894FwMd/bb97f860d6e3b83892b076a00aeb182.jpg")}
                        className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                      >
                        <ImageWithLoader
                          src="https://i.postimg.cc/y894FwMd/bb97f860d6e3b83892b076a00aeb182.jpg"
                          alt="穿越火线时光博物馆"
                          imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          className="w-full h-full"
                          imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                        />
                      </div>

                      {/* 项目介绍 (放在首图下方) */}
                      <div className="mt-4 bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                          MUSEUM_DECK_Y16
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-orange uppercase">
                            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                            项目介绍：
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed font-sans font-semibold pl-3 whitespace-pre-line">
                            展览讲述一群挑战自我、携手穿越周期的CFer的故事
                            这段历程里，从新手到老兵，从青涩到坚定，从路人王到IP世界的重要一环他们穿越源点、穿越经典、穿越信仰、穿越梦想，穿越火线，一同穿越更长的周期
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                          <span>ID: MUSEUM_CORE_01</span>
                          <span>STATUS: LIVE_PREVIEW</span>
                        </div>
                      </div>
                    </div>

                    {/* Second Row: 创意方案 */}

                    {/* Third Row: 创意方案 */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          创意方案
                        </h4>
                      </div>
                      
                      {/* Top: 16:9 content image */}
                      <div className="space-y-2">
                        <div 
                          onClick={() => setLightboxImage("https://i.postimg.cc/xCc1S9xy/bb97f860d6e3b83892b076a00aeb182.png")}
                          className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src="https://i.postimg.cc/xCc1S9xy/bb97f860d6e3b83892b076a00aeb182.png"
                            alt="创意方案图"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>
                      </div>

                      {/* Bottom Grid: Left (Mood reference), Right (Keywords) */}
                      <div className="flex flex-col space-y-2">
                        {/* Label row above the content boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none">
                          <div className="md:col-span-7">
                            <span className="text-xs font-mono font-bold text-white/70 uppercase flex items-center gap-1.5 pb-1">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              调性参考
                            </span>
                          </div>
                          <div className="md:col-span-5 hidden md:block">
                            <span className="text-xs font-mono font-bold text-white/70 uppercase flex items-center gap-1.5 pb-1">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              设计关键词 (STYLE DESCRIPTORS)
                            </span>
                          </div>
                        </div>

                        {/* Content boxes row sharing items-stretch */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                          {/* Bottom Left: Mood reference image */}
                          <div 
                            onClick={() => setLightboxImage("https://i.postimg.cc/bYMB3mHG/0721-chuan-yue-huo-xian-shi-guang-bo-wu-guan-KV-chuang-yi-she-ji-fang-an-03.png")}
                            className="md:col-span-7 group relative w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default flex items-center"
                          >
                            <ImageWithLoader
                              src="https://i.postimg.cc/bYMB3mHG/0721-chuan-yue-huo-xian-shi-guang-bo-wu-guan-KV-chuang-yi-she-ji-fang-an-03.png"
                              alt="调性参考图"
                              imgClassName="w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                              className="w-full h-auto"
                              imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                            />
                          </div>

                          {/* Bottom Right: Design keywords panel */}
                          <div className="md:col-span-5 flex flex-col justify-between bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                              KEYWORDS_DECK
                            </div>

                            <div className="space-y-4">
                              <span className="text-[11px] text-white/40 font-mono tracking-widest uppercase flex items-center gap-1.5 md:hidden">
                                <span className="w-1.5 h-1.5 bg-brand-orange/40 rounded-full" />
                                设计关键词 (STYLE DESCRIPTORS)
                              </span>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                              {[
                                { zh: "明亮", en: "Bright" },
                                { zh: "展览", en: "Exhibition" },
                                { zh: "集装箱", en: "Container" },
                                { zh: "高饱和", en: "High Saturation" }
                              ].map((kw, i) => (
                                <div 
                                  key={i} 
                                  className="flex flex-col px-3 py-2 bg-neutral-950/50 border border-white/5 rounded-lg hover:border-brand-orange/40 transition-all duration-300 group/item"
                                >
                                  <span className="text-xs font-semibold text-white group-hover/item:text-brand-orange transition-colors">
                                    {kw.zh}
                                  </span>
                                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                                    {kw.en}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                            <span>GRID: SECTOR_TIMELINE</span>
                            <span>TONE: CHRONO_MILITARY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>

                  </div>
                )}

                {/* SPECIAL CASE: Peacekeeper Elite 6th Anniversary (和平精英6周年) Custom Layout */}
                {currentItem.id === "pubgm_6th" && (
                  <div className="space-y-12 max-w-4xl mx-auto pt-2 pb-12 select-none">
                    
                    {/* First Row: 和平精英6周年 主图 + 项目介绍 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          和平精英6周年
                        </h4>
                      </div>
                      <div 
                        onClick={() => setLightboxImage(currentItem.images[0])}
                        className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                      >
                        <ImageWithLoader
                          src={currentItem.images[0]}
                          alt="和平精英6周年"
                          imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          className="w-full h-full"
                          imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                        />
                      </div>

                      {/* 项目介绍 (放在首图下方) */}
                      <div className="mt-4 bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                          PUBG_6TH_DECK_Y6
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-orange uppercase">
                            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                            项目介绍：
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed font-sans font-semibold pl-3">
                            和平精英6周年，6在一起，越打越年轻。
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                          <span>ID: PUBG_6TH_CORE</span>
                          <span>STATUS: LIVE_PREVIEW</span>
                        </div>
                      </div>
                    </div>

                    {/* Second Row: 海报延展 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          海报延展
                        </h4>
                        
                        {/* Carousel Navigation Indicators */}
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map((idx) => (
                            <button
                              key={idx}
                              onClick={() => setPubg6thPosterIdx(idx)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                pubg6thPosterIdx === idx ? 'bg-brand-orange w-4' : 'bg-white/20 hover:bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Main Carousel Viewport */}
                      <div className="relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl group">
                        {/* Active Image */}
                        <div className="w-full h-full cursor-default" onClick={() => setLightboxImage(currentItem.images[2 + pubg6thPosterIdx])}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={pubg6thPosterIdx}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="w-full h-full"
                            >
                              <ImageWithLoader
                                src={currentItem.images[2 + pubg6thPosterIdx]}
                                alt={`海报延展 ${pubg6thPosterIdx + 1}`}
                                imgClassName="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                                className="w-full h-full"
                                imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={() => setPubg6thPosterIdx((prev) => (prev - 1 + 3) % 3)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-brand-orange hover:text-black hover:border-brand-orange shadow-lg"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        <button
                          onClick={() => setPubg6thPosterIdx((prev) => (prev + 1) % 3)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-brand-orange hover:text-black hover:border-brand-orange shadow-lg"
                        >
                          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>

                      {/* Thumbnail Track */}
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
                        {[0, 1, 2].map((idx) => {
                          const isSelected = pubg6thPosterIdx === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setPubg6thPosterIdx(idx)}
                              className={`relative aspect-[16/9] bg-neutral-900 border rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                                isSelected 
                                  ? 'border-brand-orange shadow-brand-orange/10 scale-[1.02]' 
                                  : 'border-white/5 hover:border-white/20'
                              }`}
                            >
                              <div className="w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <ImageWithLoader
                                  src={currentItem.images[2 + idx]}
                                  alt={`缩略图 ${idx + 1}`}
                                  imgClassName="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full"
                                />
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 border-2 border-brand-orange rounded-xl pointer-events-none" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* SPECIAL CASE: Crossfire Swallowed Star or Crossfire Shanghai Animation Custom Layout */}
                {(currentItem.id === "cf_swallowed_star" || currentItem.id === "cf_fengshen" || currentItem.id === "cf_shanghai_animation" || currentItem.id === "cf_hangzhou_cfs" || currentItem.id === "cf_new_five_years" || currentItem.id === "pubgm_xiangzhen" || currentItem.id === "pubgm_gaode" || currentItem.id === "pubgm_shizhuangzhou") && (
                  <div className="space-y-12 max-w-4xl mx-auto pt-2 pb-12 select-none">
                     
                     {/* First Row: Dynamic Title + 首图 + 项目介绍/背景 */}
                     <div className="space-y-4">
                       <div className="flex items-center justify-between border-b border-white/10 pb-2">
                         <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                           <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                           {currentItem.title}
                         </h4>
                       </div>
                       <div 
                         onClick={() => setLightboxImage(currentItem.images[0])}
                         className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                       >
                         <ImageWithLoader
                           src={currentItem.images[0]}
                           alt={currentItem.title}
                           imgClassName={`w-full h-full ${currentItem.id === "pubgm_shizhuangzhou" ? "object-cover" : "object-contain"} group-hover:scale-[1.015] transition-transform duration-700 ease-out`}
                           referrerPolicy="no-referrer"
                           className="w-full h-full"
                           imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                         />
                       </div>

                       {/* 项目介绍与项目背景 (放在首图下方) */}
                       <div className="mt-4 bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                         <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                           DECK_PORTAL_F01
                         </div>
                         
                         <div className="space-y-6">
                           {!(
                             currentItem.id === "cf_swallowed_star" ||
                             currentItem.id === "cf_fengshen" ||
                             currentItem.id === "cf_shanghai_animation" ||
                             currentItem.id === "cf_hangzhou_cfs" ||
                             currentItem.id === "cf_new_five_years" ||
                             currentItem.id === "pubgm_xiangzhen" ||
                             currentItem.id === "pubgm_gaode"
                           ) && (
                             <div className="space-y-2">
                               <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-orange uppercase">
                                 <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                                 项目背景：
                               </div>
                               <p className="text-sm text-white/80 leading-relaxed font-sans font-semibold pl-3">
                                 {currentItem.id === "pubgm_shizhuangzhou"
                                   ? "和平精英官方大型潮流盛典，联合顶尖设计师跨界打造的一款数字化高精时装周宣发视觉与概念方案。"
                                   : "穿越火线官方为经典科幻和大型联动赛事打造的高水平定制展陈与概念演绎视觉。"}
                               </p>
                             </div>
                           )}

                           {currentItem.id !== "pubgm_gaode" && (
                             <div className="space-y-2">
                               <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-orange uppercase">
                                 <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                                 项目介绍：
                               </div>
                               <p className="text-sm text-white/80 leading-relaxed font-sans font-semibold pl-3">
                                 {(() => {
                                   if (currentItem.id === "pubgm_xiangzhen") {
                                     return "画面色调参考秋天的安徽和当地建筑特色，以秋天为主题配合当地特色建筑 and 季节来作为展示元素。";
                                   }
                                   if (currentItem.id === "pubgm_shizhuangzhou") {
                                     return "结合高精3D模型、写实渲染及现代时尚与未来科技流光，重塑和平精英时装的多样表现力与潮流美学。";
                                   }
                                   if (currentItem.id === "cf_fengshen") {
                                     return "封神榜卷轴前后错落穿插于画面，画面中心女主角轻轻拨开卷轴出现，卷轴周边有部分朝歌建筑，近景MV中小狐狸看向主角，哪吒混天绫在周边点缀。";
                                   }
                                   if (currentItem.id === "cf_shanghai_animation") {
                                     return "奖杯放置画面中心展示，葫芦娃以及斯沃特等人物汇聚向中间的构图，部分角色是救爷爷的动作姿势，部分角色以整活的动作出现，给人一种正经的气氛里面藏着鬼马的感觉";
                                   }
                                   if (currentItem.id === "cf_hangzhou_cfs") {
                                     return "围绕杭州园林的文化氛围作为整体的联动画面的呈现，以庭院圆形拱门组为画面视角出发点，用中远景建筑元素，表现杭州氛围，以写意的留白及虚实做层次表现，同时画面远景也会穿插落地亚运馆， 杭州地标建筑等元素。";
                                   }
                                   if (currentItem.id === "cf_new_five_years") {
                                     return "画面延续一起“拼”的概念呈现，延展六芒星的形态做放射板块的呈现，板块上则会分布俱乐部logo，并且做立体上下落差感觉，中心则是俱乐部元素汇总的主体六芒星。";
                                   }
                                   return "结合高精3D模型、写实渲染及硬核科幻场景流光，还原经典IP的金属质感和战场硝烟，演绎热血硬核军事美学。";
                                 })()}
                               </p>
                             </div>
                           )}

                           {currentItem.id === "pubgm_gaode" && (
                             <div className="space-y-2">
                               <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-orange uppercase">
                                 <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                                 项目介绍：
                               </div>
                               <p className="text-sm text-white/80 leading-relaxed font-sans font-semibold pl-3">
                                 {currentItem.desc}
                               </p>
                             </div>
                           )}
                         </div>
                         
                         <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                           <span>ID: ARCHIVE_CF_02</span>
                           <span>STATUS: COMPLETED</span>
                         </div>
                       </div>
                     </div>

                    {/* Second Row: 创意方案 */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          创意方案
                        </h4>
                      </div>
                      
                      {/* Top: content image */}
                      <div className="space-y-2">
                        <div 
                          onClick={() => setLightboxImage(currentItem.images[2])}
                          className={`group relative w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default ${
                            currentItem.id === "cf_fengshen" || currentItem.id === "pubgm_xiangzhen" || currentItem.id === "pubgm_gaode" ? "" : "aspect-[16/9]"
                          }`}
                        >
                          <ImageWithLoader
                            src={currentItem.images[2]}
                            alt="创意设计图"
                            imgClassName={`w-full group-hover:scale-[1.015] transition-transform duration-700 ease-out ${
                              currentItem.id === "cf_fengshen" || currentItem.id === "pubgm_xiangzhen" || currentItem.id === "pubgm_gaode" ? "h-auto" : "h-full object-contain"
                            }`}
                            referrerPolicy="no-referrer"
                            className={`w-full ${currentItem.id === "cf_fengshen" || currentItem.id === "pubgm_xiangzhen" || currentItem.id === "pubgm_gaode" ? "h-auto" : "h-full"}`}
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>
                      </div>

                      {/* Bottom Grid: Left (Mood reference), Right (Keywords) */}
                      <div className="flex flex-col space-y-2">
                        {/* Label row above the content boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none">
                          <div className="md:col-span-7">
                            <span className="text-xs font-mono font-bold text-white/70 uppercase flex items-center gap-1.5 pb-1">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              调性参考
                            </span>
                          </div>
                          <div className="md:col-span-5 hidden md:block">
                            <span className="text-xs font-mono font-bold text-white/70 uppercase flex items-center gap-1.5 pb-1">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              设计关键词 (STYLE DESCRIPTORS)
                            </span>
                          </div>
                        </div>

                        {/* Content boxes row sharing items-stretch */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                          {/* Bottom Left: Mood reference image */}
                          <div 
                            onClick={() => setLightboxImage(currentItem.images[3])}
                            className="md:col-span-7 group relative w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default flex items-center"
                          >
                            <ImageWithLoader
                              src={currentItem.images[3]}
                              alt="调性参考图"
                              imgClassName="w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                              className="w-full h-auto"
                              imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                            />
                          </div>

                          {/* Bottom Right: Design keywords panel */}
                          <div className="md:col-span-5 flex flex-col justify-between bg-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-white/10 group-hover:text-brand-orange/20 transition-all">
                              TAGS_F01
                            </div>

                            <div className="space-y-4">
                              <span className="text-[11px] text-white/40 font-mono tracking-widest uppercase flex items-center gap-1.5 md:hidden">
                                <span className="w-1.5 h-1.5 bg-brand-orange/40 rounded-full" />
                                设计关键词 (STYLE DESCRIPTORS)
                              </span>
                              
                              <div className="flex flex-wrap gap-2 pt-2">
                                {(() => {
                                  if (currentItem.id === "cf_swallowed_star") {
                                    return [
                                      { zh: "三维深化", en: "3D Modeling" },
                                      { zh: "重工业机甲", en: "Industrial Mech" },
                                      { zh: "吞噬星空联动", en: "Swallowed Star" },
                                      { zh: "线下硬核装置", en: "Hardcore Install" },
                                      { zh: "赛博霓虹", en: "Cyber Neon" },
                                      { zh: "太空掩体", en: "Space Bunker" },
                                      { zh: "精细深化结构", en: "Refined Geometry" },
                                      { zh: "军规美学", en: "TACTICAL ESTHETICS" }
                                    ];
                                  }
                                  if (currentItem.id === "cf_fengshen") {
                                    return [
                                      { zh: "金黄", en: "Golden" },
                                      { zh: "卷轴", en: "Scroll" },
                                      { zh: "唯美", en: "Aesthetic" },
                                      { zh: "神话", en: "Mythology" }
                                    ];
                                  }
                                  if (currentItem.id === "cf_shanghai_animation") {
                                    return [
                                      { zh: "奖杯", en: "Trophy" },
                                      { zh: "奥斯卡", en: "Oscar" },
                                      { zh: "悬念感", en: "Suspense" },
                                      { zh: "背光", en: "Backlight" },
                                      { zh: "轮廓光", en: "Rim Light" },
                                      { zh: "神秘感", en: "Mystery" },
                                      { zh: "金色", en: "Golden" }
                                    ];
                                  }
                                  if (currentItem.id === "cf_hangzhou_cfs") {
                                    return [
                                      { zh: "园林", en: "Garden" },
                                      { zh: "朴素", en: "Simple" },
                                      { zh: "古风", en: "Ancient Style" },
                                      { zh: "清爽", en: "Fresh" },
                                      { zh: "绿色", en: "Green" }
                                    ];
                                  }
                                  if (currentItem.id === "cf_new_five_years") {
                                    return [
                                      { zh: "金银", en: "Gold & Silver" },
                                      { zh: "低饱和", en: "Low Saturation" },
                                      { zh: "荣誉", en: "Honor" },
                                      { zh: "干净", en: "Clean" }
                                    ];
                                  }
                                  if (currentItem.id === "pubgm_xiangzhen") {
                                    return [
                                      { zh: "徽派建筑", en: "Huizhou Architecture" },
                                      { zh: "秋天", en: "Autumn" },
                                      { zh: "橘黄色", en: "Orange-Yellow" },
                                      { zh: "非遗", en: "Heritage" },
                                      { zh: "稻田", en: "Rice Field" }
                                    ];
                                  }
                                  if (currentItem.id === "pubgm_gaode") {
                                    return [
                                      { zh: "蓝白色", en: "Blue & White" },
                                      { zh: "地图", en: "Map" },
                                      { zh: "简洁", en: "Minimalist" },
                                      { zh: "高级", en: "Premium" }
                                    ];
                                  }
                                  if (currentItem.id === "pubgm_shizhuangzhou") {
                                    return [
                                      { zh: "三维深化", en: "3D Modeling" },
                                      { zh: "重工业机甲", en: "Industrial Mech" },
                                      { zh: "和平精英时装周", en: "Fashion Week" },
                                      { zh: "赛博霓虹", en: "Cyber Neon" },
                                      { zh: "太空掩体", en: "Space Bunker" },
                                      { zh: "精细深化结构", en: "Refined Geometry" },
                                      { zh: "军规美学", en: "TACTICAL ESTHETICS" }
                                    ];
                                  }
                                  return [
                                    { zh: "三维深化", en: "3D Modeling" },
                                    { zh: "重工业机甲", en: "Industrial Mech" },
                                    { zh: "赛博霓虹", en: "Cyber Neon" },
                                    { zh: "太空掩体", en: "Space Bunker" },
                                    { zh: "精细深化结构", en: "Refined Geometry" },
                                    { zh: "军规美学", en: "TACTICAL ESTHETICS" }
                                  ];
                                })().map((kw, i) => (
                                  <div 
                                    key={i} 
                                    className="flex flex-col px-3 py-2 bg-neutral-950/50 border border-white/5 rounded-lg hover:border-brand-orange/40 transition-all duration-300 group/item"
                                  >
                                    <span className="text-xs font-semibold text-white group-hover/item:text-brand-orange transition-colors">
                                      {kw.zh}
                                    </span>
                                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                                      {kw.en}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20">
                              <span>GRID: SECTOR_A3</span>
                              <span>TONE: COSMIC_TECH</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fourth Row: 线下装置 for cf_swallowed_star */}
                    {currentItem.id === "cf_swallowed_star" && (
                      <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                          线下装置
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div 
                          onClick={() => setLightboxImage(currentItem.images[4])}
                          className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[4]}
                            alt="线下装置 1"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>

                        <div 
                          onClick={() => setLightboxImage(currentItem.images[5])}
                          className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[5]}
                            alt="线下装置 2"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>

                        <div 
                          onClick={() => setLightboxImage(currentItem.images[6])}
                          className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[6]}
                            alt="线下装置 3"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>

                        <div 
                          onClick={() => setLightboxImage(currentItem.images[7])}
                          className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[7]}
                            alt="线下装置 4"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>

                        <div 
                          onClick={() => setLightboxImage(currentItem.images[8])}
                          className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[8]}
                            alt="线下装置 5"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>

                        <div 
                          onClick={() => setLightboxImage(currentItem.images[9])}
                          className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[9]}
                            alt="线下装置 6"
                            imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                            imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fourth Row: 新五年信物设计 for cf_new_five_years */}
                  {currentItem.id === "cf_new_five_years" && (
                    <div className="space-y-12">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                            新五年信物设计
                          </h4>
                        </div>

                        {/* 5组图，每组里面一个大图配下方2张下图 */}
                        <div className="space-y-10">
                          {[0, 1, 2, 3, 4].map((groupIndex) => {
                            const baseIdx = 4 + groupIndex * 3;
                            const bigImg = currentItem.images[baseIdx];
                            const smallImg1 = currentItem.images[baseIdx + 1];
                            const smallImg2 = currentItem.images[baseIdx + 2];

                            return (
                              <div key={groupIndex} className="space-y-4 bg-neutral-900/20 border border-white/5 rounded-2xl p-4 md:p-6">
                                {/* Big Image */}
                                {bigImg && (
                                  <div 
                                    onClick={() => setLightboxImage(bigImg)}
                                    className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                                  >
                                    <ImageWithLoader
                                      src={bigImg}
                                      alt={`设计方案 ${groupIndex + 1} 主图`}
                                      imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full"
                                      imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                                    />
                                  </div>
                                )}

                                {/* 2 Small Images Below */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {smallImg1 && (
                                    <div 
                                      onClick={() => setLightboxImage(smallImg1)}
                                      className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-md hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                                    >
                                      <ImageWithLoader
                                        src={smallImg1}
                                        alt={`设计方案 ${groupIndex + 1} 细部 1`}
                                        imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full"
                                        imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                                      />
                                    </div>
                                  )}
                                  {smallImg2 && (
                                    <div 
                                      onClick={() => setLightboxImage(smallImg2)}
                                      className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-md hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                                    >
                                      <ImageWithLoader
                                        src={smallImg2}
                                        alt={`设计方案 ${groupIndex + 1} 细部 2`}
                                        imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full"
                                        imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 之后再增加一组图，内容为2张16：9的图横向摆放，下方为2张16：9的图横向摆放 */}
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                            信物延展物料设计 (POSTER EXTENSIONS)
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                          {[19, 20, 21, 22].map((imgIdx) => {
                            const imgUrl = currentItem.images[imgIdx];
                            if (!imgUrl) return null;
                            return (
                              <div 
                                key={imgIdx}
                                onClick={() => setLightboxImage(imgUrl)}
                                className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default"
                              >
                                <ImageWithLoader
                                  src={imgUrl}
                                  alt={`信物延展图 ${imgIdx - 18}`}
                                  imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full"
                                  imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Sixth Row: 海报延展 for cf_fengshen */}
                  {currentItem.id === "cf_fengshen" && (() => {
                    const posters = currentItem.images.slice(4);
                    const activeIdx = fengshenPosterIdx;
                    const setActiveIdx = setFengshenPosterIdx;
                    const len = posters.length;

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                            海报延展
                          </h4>
                          
                          {/* Carousel Navigation Indicators */}
                          <div className="flex items-center gap-2">
                            {Array.from({ length: len }).map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveIdx(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  activeIdx === idx ? 'bg-brand-orange w-4' : 'bg-white/20 hover:bg-white/40'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Main Carousel Viewport */}
                        <div className="relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl group">
                          {/* Active Image */}
                          <div className="w-full h-full cursor-default" onClick={() => setLightboxImage(posters[activeIdx])}>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full h-full"
                              >
                                <ImageWithLoader
                                  src={posters[activeIdx]}
                                  alt={`海报延展 ${activeIdx + 1}`}
                                  imgClassName="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full"
                                  imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                                />
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Navigation Arrows */}
                          <button
                            onClick={() => setActiveIdx((prev) => (prev - 1 + len) % len)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-brand-orange hover:text-black hover:border-brand-orange shadow-lg"
                          >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>

                          <button
                            onClick={() => setActiveIdx((prev) => (prev + 1) % len)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-brand-orange hover:text-black hover:border-brand-orange shadow-lg"
                          >
                            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                        </div>

                        {/* Thumbnail Track */}
                        <div className="grid gap-3 sm:gap-4 pt-1" style={{ gridTemplateColumns: `repeat(${len}, minmax(0, 1fr))` }}>
                          {posters.map((imgUrl, idx) => {
                            const isSelected = activeIdx === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => setActiveIdx(idx)}
                                className={`relative aspect-[16/9] bg-neutral-900 border rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                                  isSelected 
                                    ? 'border-brand-orange shadow-brand-orange/10 scale-[1.02]' 
                                    : 'border-white/5 hover:border-white/20'
                                }`}
                              >
                                <div className="w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-300">
                                  <ImageWithLoader
                                    src={imgUrl}
                                    alt={`缩略图 ${idx + 1}`}
                                    imgClassName="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full"
                                  />
                                </div>
                                {isSelected && (
                                  <div className="absolute inset-0 border-2 border-brand-orange rounded-xl pointer-events-none" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}



                  {/* Seventh Row: 视觉设计_物料延展 for pubgm_shizhuangzhou */}
                  {currentItem.id === "pubgm_shizhuangzhou" && (
                    <div className="space-y-12">
                      {/* 角色海报延展 */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                            角色海报延展
                          </h4>
                        </div>
                        
                        <div className="flex flex-col gap-6 w-full">
                          {[8, 9, 10, 11, 12].map((imgIdx) => {
                            const imgUrl = currentItem.images[imgIdx];
                            if (!imgUrl) return null;
                            return (
                              <div 
                                key={imgIdx}
                                onClick={() => setLightboxImage(imgUrl)}
                                className="group relative aspect-[16/9] bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default w-full"
                              >
                                <ImageWithLoader
                                  src={imgUrl}
                                  alt={`角色海报 ${imgIdx - 7}`}
                                  imgClassName="w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full"
                                  imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 底部 1280x452 延展底图 */}
                      {currentItem.images[13] && (
                        <div className="pt-4">
                          <div 
                            onClick={() => setLightboxImage(currentItem.images[13])}
                            className="group relative bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-500 cursor-default w-full h-auto"
                          >
                            <ImageWithLoader
                              src={currentItem.images[13]}
                              alt="底部时装周全景延展"
                              imgClassName="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                              className="w-full h-auto"
                              imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  </div>
                )}

                {/* SPECIAL CASE: Crossfire Weapon Skin Design Dedicated Layout */}
                {currentItem.id === "cf_weapon_skin" && (
                  <div className="space-y-8 max-w-5xl mx-auto pt-2 pb-12 select-none animate-fadeIn">
                    {/* Section Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-brand-orange rotate-45" />
                        {currentItem.title}
                      </h4>
                      <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                        共 7 张概念设计图 (2X4 网格展示)
                      </span>
                    </div>

                    {/* 2x4 Grid Layout (2 per row, 4 rows, total 7 skins) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {weaponSkinsData.map((skin, idx) => (
                        <div
                          key={skin.id || idx}
                          className="flex flex-col bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-brand-orange/30 transition-all duration-300 group"
                        >
                          {/* Image Container */}
                          <div
                            onClick={() => setLightboxImage(skin.image)}
                            className="relative aspect-[16/9] w-full bg-neutral-950 border-b border-white/5 overflow-hidden cursor-pointer"
                          >
                            <ImageWithLoader
                              src={skin.image}
                              alt={skin.title}
                              imgClassName="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                              className="w-full h-full"
                              imgStyle={{ imageRendering: '-webkit-optimize-contrast' as any }}
                            />
                          </div>

                          {/* Info Section - Only weapon name */}
                          <div className="px-5 py-4 flex items-center justify-between">
                            <h5 className="text-base font-bold text-white tracking-wide font-sans group-hover:text-brand-orange transition-colors">
                              {skin.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TYPE A: Standard Item Flow (Normal Game KV & Offline & General AIGC) */}
                {(!currentItem.type || currentItem.type === "standard") && currentItem.id !== "cf" && currentItem.id !== "cf_museum" && currentItem.id !== "cf_swallowed_star" && currentItem.id !== "cf_fengshen" && currentItem.id !== "cf_shanghai_animation" && currentItem.id !== "cf_hangzhou_cfs" && currentItem.id !== "cf_weapon_skin" && currentItem.id !== "cf_new_five_years" && currentItem.id !== "pubgm_6th" && currentItem.id !== "pubgm_xiangzhen" && currentItem.id !== "pubgm_gaode" && currentItem.id !== "pubgm_shizhuangzhou" && (
                  <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto">
                    {currentItem.images.map((img, i) => {
                      const isLOLAdaptive = activeSection === "offline" && currentItem.id === "off-4" && i >= 4;
                      const isPUBGFirst = activeSection === "offline" && (currentItem.id === "off-5" || currentItem.id === "off-6") && i === 0;
                      const isAdaptive = isLOLAdaptive || isPUBGFirst;
                      const aspectClass = isAdaptive 
                        ? "aspect-auto h-auto" 
                        : (activeSection === "offline" && currentItem.id === "off-1" ? "aspect-[3/2]" : "aspect-[16/9]");
                      const imgClass = isAdaptive
                        ? "w-full h-auto block group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                        : "w-full h-full object-contain group-hover:scale-[1.015] transition-transform duration-700 ease-out";

                      return (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(img)}
                          className={`group relative ${currentItem.id === "kv-sanguo" ? "bg-black border-neutral-900 shadow-none" : "bg-neutral-900/40 border-white/5 shadow-xl"} rounded-2xl overflow-hidden hover:border-brand-orange/30 transition-all duration-500 cursor-default`}
                        >
                          <div className={`${aspectClass} w-full ${currentItem.id === "kv-sanguo" ? "bg-black" : "bg-neutral-950/85"} flex items-center justify-center overflow-hidden`}>
                            <ImageWithLoader
                              src={img}
                              alt={`${currentItem.title} Asset ${i + 1}`}
                              referrerPolicy="no-referrer"
                              imgClassName={imgClass}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TYPE B: character grey-clay white model proportions */}
                {currentItem.type === "whitemodel" && (
                  <div className="space-y-6 md:space-y-8 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
                      {currentItem.images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(img)}
                          className="relative aspect-[3072/5504] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-950 shadow-lg group cursor-default active:scale-[0.98] transition-all hover:border-purple-500/40"
                        >
                          <ImageWithLoader
                            src={img}
                            alt={`${currentItem.title} Grey model proportion ${i + 1}`}
                            imgClassName="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>

                    {currentItem.bottomImage && (
                      <div
                        onClick={() => setLightboxImage(currentItem.bottomImage!)}
                        className="relative aspect-[2307/1437] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-950/80 shadow-2xl group cursor-default active:scale-[0.99] transition-all hover:border-purple-500/40"
                      >
                        <ImageWithLoader
                          src={currentItem.bottomImage}
                          alt="角色白模大场景渲染"
                          imgClassName="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* TYPE C: character Unreal Engine 5 rendering showcase */}
                {currentItem.type === "ue5_render" && (
                  <div className="space-y-6 md:space-y-8 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
                      {currentItem.images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(img)}
                          className="relative aspect-[3072/5504] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-950 shadow-lg group cursor-default active:scale-[0.98] transition-all hover:border-purple-500/40"
                        >
                          <ImageWithLoader
                            src={img}
                            alt={`${currentItem.title} High cinematic render ${i + 1}`}
                            imgClassName="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>

                    {currentItem.bottomImage && (
                      <div
                        onClick={() => setLightboxImage(currentItem.bottomImage!)}
                        className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-950/80 shadow-2xl group cursor-default active:scale-[0.99] transition-all hover:border-purple-500/40"
                      >
                        <ImageWithLoader
                          src={currentItem.bottomImage}
                          alt="UE5大环境合成主视觉"
                          imgClassName="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* TYPE D: AIGC interactive Key Visual stages (黑暗凝视 or 光环战役) */}
                {currentItem.type === "kv_interactive" && (
                  <div className="space-y-6 md:space-y-8 pt-2">
                    <div 
                      className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group cursor-default"
                      onClick={() => setLightboxImage(currentItem.stages[activeKvStage].image)}
                    >
                      <AnimatePresence mode="popLayout">
                        <motion.img
                          key={`${currentItem.id}-${activeKvStage}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          src={currentItem.stages[activeKvStage].image}
                          alt={currentItem.stages[activeKvStage].title}
                          className="w-full h-full object-contain absolute inset-0 group-hover:scale-[1.015] transition-transform duration-700 ease-out brightness-[0.95]"
                        />
                      </AnimatePresence>
                    </div>

                    {/* Progress controller bar */}
                    <div className="pt-2">
                      <div className="grid grid-cols-2 gap-2 md:gap-4 select-none">
                        <button
                          onClick={() => setActiveKvStage("whitemodel")}
                          className={`p-3 rounded-xl border transition-all duration-300 text-center text-xs font-extrabold ${
                            activeKvStage === "whitemodel"
                              ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white"
                              : "border-white/5 bg-neutral-950/40 text-white/50 hover:text-white"
                          }`}
                        >
                          三维结构
                        </button>
                        <button
                          onClick={() => setActiveKvStage("render3d")}
                          className={`p-3 rounded-xl border transition-all duration-300 text-center text-xs font-extrabold ${
                            activeKvStage === "render3d"
                              ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white"
                              : "border-white/5 bg-neutral-950/40 text-white/50 hover:text-white"
                          }`}
                        >
                          材质色彩
                        </button>
                      </div>
                    </div>

                    {/* Prompt info */}
                    <div className="p-4 bg-neutral-900/60 border border-white/5 rounded-2xl space-y-1.5">
                      <div className="text-xs font-extrabold text-purple-400">
                        【{activeKvStage === "whitemodel" ? "数字灰泥高模" : "次世代Lumen成品高精材质渲染"}】 {currentItem.stages[activeKvStage].title}
                      </div>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed select-text font-medium">{currentItem.stages[activeKvStage].desc}</p>
                    </div>
                  </div>
                )}

                {/* TYPE E: PUBG Key Visual interactive multiquadrants */}
                {currentItem.type === "kv_interactive_pubg" && (
                  <div className="space-y-6 md:space-y-8 pt-2">
                    {/* Multiquadrants vertical 4 frames layout */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                      {(activeKvStage === "whitemodel" ? currentItem.stages.whitemodel.images : currentItem.stages.render3d.images)?.map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(imgUrl)}
                          className="relative aspect-[504/864] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-xl group cursor-default transition-all duration-300 hover:border-purple-500/40"
                        >
                          <ImageWithLoader
                            src={imgUrl}
                            alt={`Quadrant ${i + 1}`}
                            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Dynamic stage switcher */}
                    <div className="pt-2">
                      <div className="grid grid-cols-2 gap-2 md:gap-4 select-none">
                        <button
                          onClick={() => setActiveKvStage("whitemodel")}
                          className={`p-3 rounded-xl border transition-all duration-300 text-center text-xs font-extrabold ${
                            activeKvStage === "whitemodel"
                              ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white"
                              : "border-white/5 bg-neutral-950/40 text-white/50 hover:text-white"
                          }`}
                        >
                          高模雕刻分镜
                        </button>
                        <button
                          onClick={() => setActiveKvStage("render3d")}
                          className={`p-3 rounded-xl border transition-all duration-300 text-center text-xs font-extrabold ${
                            activeKvStage === "render3d"
                              ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white"
                              : "border-white/5 bg-neutral-950/40 text-white/50 hover:text-white"
                          }`}
                        >
                          4镜头色彩成型
                        </button>
                      </div>
                    </div>

                    {/* Stage descriptions */}
                    <div className="p-4 bg-neutral-900/40 border border-white/5 rounded-2xl space-y-1.5">
                      <div className="text-xs font-extrabold text-purple-400">
                        【生境规划】 {currentItem.stages[activeKvStage].title}
                      </div>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed select-text font-medium">
                        {currentItem.stages[activeKvStage].desc}
                      </p>
                    </div>
                  </div>
                )}

                {/* TYPE F: "NEWBORN" DEMO OVERVIEW */}
                {currentItem.type === "demo_overview" && (
                  <div className="max-w-4xl mx-auto space-y-10 pt-2 text-white/90">
                    {/* Widescreen Key Visual */}
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950 group">
                      <ImageWithLoader
                        src="https://i.postimg.cc/BtWM8Y9y/mlv-ERhcvlqc-zi-yuan-5.webp"
                        alt="新生 16:9 主视觉 Key Visual"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100 cursor-default"
                        onClick={() => setLightboxImage("https://i.postimg.cc/BtWM8Y9y/mlv-ERhcvlqc-zi-yuan-5.webp")}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Bento boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-purple-500/10 transition-colors flex flex-col space-y-4">
                        <div className="text-purple-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                          <Globe size={15} />
                          <span>游戏地貌世界观</span>
                        </div>
                        <p className="text-white/70 text-[13px] leading-relaxed select-text">
                          背景设定在面临生态危机的虚拟辽阔大陆。随着超级沙尘天气频发，大片葱茏林带沙化。作为王牌生态重塑学家，玩家需要深入荒芜勘探水源、点栽适旱树林并抗防狂暴卷尘。
                        </p>
                      </div>

                      <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-purple-500/10 transition-colors flex flex-col space-y-4">
                        <div className="text-purple-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                          <Sparkles size={15} />
                          <span>林业防御机制</span>
                        </div>
                        <p className="text-white/70 text-[13px] leading-relaxed select-text">
                          多点灌排沙盒策略：合理统筹调配高含养分珍贵绿叶跟净水泵，在高势悬崖渠道建防风木网、防沙堤障。随着治理成功，可以解锁更多奇观祭坛以及失落科技废墟。
                        </p>
                      </div>

                      <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-purple-500/10 transition-colors flex flex-col space-y-4">
                        <div className="text-purple-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                          <ImageIcon size={15} />
                          <span>融合艺术构型</span>
                        </div>
                        <p className="text-white/70 text-[13px] leading-relaxed select-text">
                          介于生动二次元Q版比例和重武器机匣写实磨损刻画中间。精心对色，在提供温暖希望感色彩大环境的同时，不忘点缀微尘颗粒和科幻全息粒子质感。
                        </p>
                      </div>
                    </div>

                    <div className="border border-white/5 bg-neutral-950/40 p-6 rounded-2xl space-y-3">
                      <h4 className="text-white font-semibold text-base flex items-center gap-2">
                        <Compass className="text-purple-400" size={16} />
                        <span>前瞻交互AR特设</span>
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed">
                        本策划草案同步设计了AR透视玩法机制。用户可以通过真机摄像头捕捉周围空间，将荒沙枯焦植被与身边物理场景融合，用手指长按进行抗旱洒水召唤降雨，实现高科技AR交互。
                      </p>
                    </div>
                  </div>
                )}

                {/* TYPE G: "NEWBORN" CORE CHARACTER ARTISTS */}
                {currentItem.type === "demo_characters" && (
                  <div className="max-w-6xl mx-auto space-y-8 text-white">
                    <div className="flex justify-end pr-1 pb-2">
                      <div className="flex bg-neutral-900 border border-white/10 p-1 rounded-xl gap-2 select-none">
                        <button
                          onClick={() => { setActiveCharId("xiaomang"); setStackedIndex(0); }}
                          className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition-all ${
                            activeCharId === "xiaomang" ? "bg-purple-600 text-white shadow-md font-bold" : "text-white/50 hover:text-white"
                          }`}
                        >
                          小芒 Explorer
                        </button>
                        <button
                          onClick={() => { setActiveCharId("tanzai"); setStackedIndex(0); }}
                          className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition-all ${
                            activeCharId === "tanzai" ? "bg-purple-600 text-white shadow-md font-bold" : "text-white/50 hover:text-white"
                          }`}
                        >
                          炭仔 Forest Sprite
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Character Portrait (Aspect-square closeup) */}
                      <div className="lg:col-span-5">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl group cursor-default">
                          <ImageWithLoader
                            src={characters[activeCharId].portrait}
                            alt={`${characters[activeCharId].name} Closeup`}
                            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            onClick={() => setLightboxImage(characters[activeCharId].portrait)}
                            className="w-full h-full"
                          />
                        </div>
                      </div>

                      {/* Right: Character slider and descriptions */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/40 tracking-wider">
                          <span>// ART DRAFTS WHEEL</span>
                          <span className="text-purple-400 flex items-center gap-1.5 font-bold animate-pulse">
                            <RotateCw size={11} className="animate-spin-slow text-purple-400" />
                            <span>滚动鼠标或按方向键切换手稿</span>
                          </span>
                        </div>

                        {/* Interactive Frame Slider */}
                        <div 
                          onWheel={handleScrollWheel}
                          onMouseEnter={() => setIsAutoplayPaused(true)}
                          onMouseLeave={() => setIsAutoplayPaused(false)}
                          className="relative h-[300px] md:h-[380px] w-full rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer group shadow-xl"
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${activeCharId}-${stackedIndex}`}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.3 }}
                              onClick={() => setLightboxImage(characters[activeCharId].drafts[stackedIndex].url)}
                              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
                            >
                              <ImageWithLoader
                                src={characters[activeCharId].drafts[stackedIndex].url}
                                alt={characters[activeCharId].drafts[stackedIndex].title}
                                imgClassName="w-full h-full object-contain select-none"
                                className="w-full h-full"
                              />
                            </motion.div>
                          </AnimatePresence>

                          <button
                            onClick={(e) => { e.stopPropagation(); setStackedIndex((prev) => (prev - 1 + 3) % 3); }}
                            className="absolute left-3 p-2 rounded-full bg-black/75 hover:bg-purple-600 border border-white/5 text-white transition-colors"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setStackedIndex((prev) => (prev + 1) % 3); }}
                            className="absolute right-3 p-2 rounded-full bg-black/75 hover:bg-purple-600 border border-white/5 text-white transition-colors"
                          >
                            <ChevronRightIcon size={16} />
                          </button>

                          <div className="absolute bottom-4 right-4 flex gap-1.5 z-30">
                            {characters[activeCharId].drafts.map((_, i) => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setStackedIndex(i); }}
                                className={`h-1 rounded-full transition-all duration-300 ${stackedIndex === i ? "w-5 bg-purple-500" : "w-1 bg-white/30"}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Character Details block */}
                        <div className="p-5 rounded-xl bg-neutral-900/60 border border-white/5 space-y-3.5">
                          <div className="flex items-center gap-2">
                            <User size={13} className="text-purple-400" />
                            <h4 className="font-bold text-base">{characters[activeCharId].name} 研发机密档案</h4>
                          </div>
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-semibold">
                            <strong>性格推演：</strong>{characters[activeCharId].personality}
                          </p>
                          <p className="text-white/60 text-xs leading-relaxed">
                            <strong>装束考究：</strong>{characters[activeCharId].visuals}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TYPE H: "NEWBORN" ISLANDS & STRATEGIC BLUEPRINT CHROME */}
                {currentItem.type === "demo_islands" && (
                  <div className="max-w-6xl mx-auto space-y-12">
                    {/* Panorama blueprint visual */}
                    <div className="space-y-3">
                      <div className="text-white/40 text-[9px] font-mono uppercase tracking-wider">// PANEL A: OVERALL STRUCTURAL WORLD ECO-BLUEPRINT</div>
                      <div className="relative w-full aspect-video md:h-[350px] rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl group cursor-default">
                        <ImageWithLoader
                          src="https://i.postimg.cc/Pq46JQqh/mmt-TAaj-ITEp-tu-pian.webp"
                          alt="主生态沙盘中轴规划"
                          imgClassName="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-700"
                          onClick={() => setLightboxImage("https://i.postimg.cc/Pq46JQqh/mmt-TAaj-ITEp-tu-pian.webp")}
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-neutral-950/20" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
                      </div>
                    </div>

                    {/* 4 regional sub-islands grids */}
                    <div className="space-y-4">
                      <div className="text-white/40 text-[9px] font-mono uppercase tracking-wider">// PANEL B: 4 REGIONAL SECTORS SURVEY</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {islands.map((isl) => (
                          <div key={isl.id} className="group bg-neutral-900/60 p-3 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-300">
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-neutral-950 shadow mb-3">
                              <ImageWithLoader
                                src={isl.image}
                                alt={isl.title}
                                imgClassName="w-full h-full object-contain bg-neutral-950 cursor-pointer"
                                onClick={() => setLightboxImage(isl.image)}
                                className="w-full h-full"
                              />
                            </div>
                            <div className="text-[9px] font-mono text-purple-400 font-extrabold pb-0.5">SECTOR {isl.num}</div>
                            <h5 className="font-bold text-xs text-white group-hover:text-purple-400 transition-colors uppercase">{isl.title}</h5>
                            <p className="text-white/50 text-[10px] mt-1.5 leading-relaxed">{isl.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Widescreen slideshow (5 slides) */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                        <span>// PANEL C: BLUEPRINT TECHNICAL GALLERY SLIDER</span>
                        <span>0{blueprintCarouselIdx + 1} / 05</span>
                      </div>

                      <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={blueprintCarouselIdx}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                          >
                            <ImageWithLoader
                              src={blueprints[blueprintCarouselIdx]}
                              alt={`Blueprint slide ${blueprintCarouselIdx + 1}`}
                              imgClassName="w-full h-full object-contain cursor-default"
                              onClick={() => setLightboxImage(blueprints[blueprintCarouselIdx])}
                              className="w-full h-full"
                            />
                          </motion.div>
                        </AnimatePresence>

                        <button
                          onClick={() => setBlueprintCarouselIdx((prev) => (prev - 1 + 5) % 5)}
                          className="absolute left-4 p-2.5 rounded-full bg-black/80 hover:bg-purple-600 border border-white/10 text-white transition-colors"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => setBlueprintCarouselIdx((prev) => (prev + 1) % 5)}
                          className="absolute right-4 p-2.5 rounded-full bg-black/80 hover:bg-purple-600 border border-white/10 text-white transition-colors"
                        >
                          <ChevronRightIcon size={18} />
                        </button>

                        <div className="absolute bottom-6 right-6 flex gap-1.5">
                          {blueprints.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setBlueprintCarouselIdx(i)}
                              className={`h-1 transition-all duration-300 ${blueprintCarouselIdx === i ? "w-6 bg-purple-500" : "w-1 bg-white/30"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TYPE I: "NEWBORN" ENGINE CINEMATICS IFRAME ENVIRONMENT */}
                {currentItem.type === "demo_ue5" && (
                  <div className="max-w-4xl mx-auto space-y-4 pt-2">
                    <div className="text-white/40 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 p-2 bg-purple-950/20 rounded border border-purple-900/40">
                      <Video size={12} className="text-purple-400 animate-pulse" />
                      <span>【16：9 官方推荐研发高帧测试影像：虚幻引擎实机测试视频 (LUMEN SIMULATION ENGINE)】</span>
                    </div>

                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex items-center justify-center">
                      <iframe
                        src="https://player.bilibili.com/player.html?bvid=BV1k6L469EpY&page=1&high_quality=1&as_wide=1"
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        className="w-full h-full absolute inset-0 border-0"
                      />
                    </div>
                  </div>
                )}

                {/* TYPE J: VIDEO STORYBOARD RENDERER */}
                {currentItem.type === "video_storyboard" && (
                  <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pt-2 pb-8">
                    {/* 16:9 Head Cover */}
                    {currentItem.videoUrl ? (
                      <div className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
                        <iframe
                          src={`https://player.bilibili.com/player.html?bvid=${currentItem.videoUrl.split('/video/')[1].split('/')[0]}&high_quality=1&danmaku=0`}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen={true}
                        />
                      </div>
                    ) : (
                      currentItem.images[0] && (
                        <div 
                          onClick={() => setLightboxImage(currentItem.images[0])}
                          className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl hover:border-purple-500/30 transition-all duration-500 cursor-default"
                        >
                          <ImageWithLoader
                            src={currentItem.images[0]}
                            alt={currentItem.title}
                            imgClassName="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                            className="w-full h-full"
                          />
                        </div>
                      )
                    )}

                    {/* AI文字提示 OR Style Reference Tags */}
                    {currentItem.aiTextPrompt ? (
                      <div className="space-y-3 p-5 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md">
                        <h5 className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                          AI文字提示 / AI TEXT PROMPT
                        </h5>
                        <div className="p-4 bg-neutral-950/60 border border-purple-500/15 rounded-xl text-xs sm:text-sm font-mono text-purple-200/95 leading-relaxed selection:bg-purple-500/30 shadow-inner">
                          {currentItem.aiTextPrompt}
                        </div>
                      </div>
                    ) : (
                      currentItem.storyboardTags && currentItem.storyboardTags.length > 0 && (
                        <div className="space-y-3 p-5 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md">
                          <h5 className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                            调性参考标签 / STYLE REFERENCE TAGS
                          </h5>
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {currentItem.storyboardTags.map((tag, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 text-xs font-sans font-medium text-purple-200 bg-purple-500/10 border border-purple-500/20 rounded-full hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-sm shadow-purple-950"
                              >
                                # {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    )}

                    {/* Storyboard design section */}
                    {currentItem.storyboards && currentItem.storyboards.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-purple-500 rotate-45" />
                            分镜设计 / STORYBOARD DESIGN
                          </h4>
                        </div>

                        <div className="space-y-10 w-full">
                          {currentItem.storyboards.map((board, idx) => (
                            <div 
                              key={idx} 
                              className="space-y-4"
                            >
                              {/* Separate Image Container */}
                              <div 
                                onClick={() => setLightboxImage(board.image)}
                                className="group relative aspect-[16/9] w-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-purple-500/30 transition-all duration-500 cursor-default"
                              >
                                <ImageWithLoader
                                  src={board.image}
                                  alt="Storyboard"
                                  imgClassName="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full"
                                />
                              </div>

                              {/* Separate Prompt Container Below */}
                              <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/40 space-y-2">
                                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                                  分镜 AI 提示词 / STORYBOARD PROMPT
                                </span>
                                <p className="text-xs sm:text-sm font-mono text-purple-200/90 leading-relaxed selection:bg-purple-500/30">
                                  {board.prompt}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Heavy-weight Zoom Lightbox Layer */}
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
              title="关闭预览"
            >
              <X size={24} />
            </button>

            {lightboxImage.includes("fd5c18b256d06c08db56c3bc84ff165") || lightboxImage.includes("qie-pian1") || lightboxImage.includes("qie-pian2") ? (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="max-w-4xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl p-2 md:p-4 scrollbar-thin scrollbar-thumb-brand-orange/40 scrollbar-track-neutral-950"
              >
                <motion.img
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  src={lightboxImage}
                  alt="Zoomed Detail Inspection"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block rounded-xl"
                  style={{ 
                    imageRendering: '-webkit-optimize-contrast' as any,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translate3d(0, 0, 0)',
                    WebkitTransform: 'translate3d(0, 0, 0)'
                  }}
                />
              </div>
            ) : (
              <motion.img
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                src={lightboxImage}
                alt="Zoomed Detail Inspection"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
