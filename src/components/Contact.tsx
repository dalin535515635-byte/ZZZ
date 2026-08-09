import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, ExternalLink, Copy, Check, QrCode } from "lucide-react";

export default function Contact() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const contactData = {
    phone: "18834825125",
    wechat: "nikeyue0218",
    email: "869891520@qq.com",
    zcool: "https://www.zcool.com.cn/u/19977858"
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-background relative overflow-hidden">
      {/* Dynamic Background Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8 sm:space-y-10"
        >
          {/* Header */}
          <div className="space-y-2.5 text-center">
            <h2 className="text-brand-orange text-[9px] sm:text-xs font-mono tracking-[0.6em] uppercase">
              - GET IN TOUCH -
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white italic tracking-tighter">
              随时保持联系
            </h3>
            <p className="text-white/40 max-w-lg mx-auto text-xs sm:text-sm tracking-wide">
              无论是核心项目合作、商务洽谈，还是仅仅想探讨关于视觉创意、3D、AIGC的设计艺术，都随时欢迎。
            </p>
          </div>

          {/* Core Hub Grid - Constrained and ultra compact */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 md:gap-8 mt-8 max-w-4xl mx-auto items-stretch">
            
            {/* Left Box: EXTREMELY Gorgeous scan QR Code Visual - Made compact */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center bg-neutral-900/40 border border-white/5 rounded-2xl p-5 sm:p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/5 rounded-full blur-xl group-hover:bg-brand-orange/10 transition-colors duration-500" />
              
              <div className="relative z-10 w-full flex flex-col items-center">
                {/* QR Screen Frame with glowing corner borders */}
                <div className="relative p-3.5 bg-neutral-950/80 rounded-xl border border-white/10 shadow-xl overflow-hidden group-hover:border-brand-orange/30 transition-all duration-500">
                  {/* Decorative corner framing lines */}
                  <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-orange rounded-tl-sm" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-orange rounded-tr-sm" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-orange rounded-bl-sm" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-orange rounded-br-sm" />

                  {/* QR Image Container with a simulated laser scan line */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-neutral-950 flex items-center justify-center p-1.5 rounded-md overflow-hidden">
                    {/* Laser scanning beam line */}
                    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-85 shadow-[0_0_6px_#f27d26] animate-[scan_3s_ease-in-out_infinite] z-20" />
                    
                    {/* User's absolute QR image */}
                    <img
                      src="https://i.postimg.cc/4N1xQ51Y/wei-xin-tu-pian-20260522184527.jpg"
                      alt="WeChat QR Code"
                      className="w-full h-full object-cover rounded transition-transform duration-500 group-hover:scale-[1.02] relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-0.5">
                  <span className="text-white font-bold text-xs tracking-wide block">微信扫码联系</span>
                  <span className="text-[10px] text-white/40 tracking-wider block font-mono">SCAN TO ADD WECHAT</span>
                </div>
              </div>
            </div>

            {/* Right Box: Clean Rows of Contacts - Sleek row scaling */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3">
              
              {/* Zcool Card */}
              <a
                href={contactData.zcool}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-brand-orange/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange shrink-0">
                    <span className="font-mono text-xs font-black font-display tracking-tighter">ZC</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-brand-orange font-mono tracking-widest font-black block uppercase">DESIGN PORTFOLIO</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-brand-orange transition-colors mt-0.5">站酷 ZCOOL 主页</span>
                    <span className="text-[11px] text-white/40 block mt-0.5">zcool.com.cn/u/19977858</span>
                  </div>
                </div>
                <div className="p-1.5 bg-white/5 rounded-md text-white/55 group-hover:text-brand-orange transition-colors">
                  <ExternalLink size={14} />
                </div>
              </a>

              {/* Phone Card */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-white/5 bg-neutral-900/40 hover:border-brand-orange/20 transition-all duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange shrink-0">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="text-[8px] text-brand-orange font-mono tracking-widest font-black block uppercase">PHONE CALL</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">{contactData.phone}</span>
                    <span className="text-[11px] text-white/40 block mt-0.5">移动手机服务接洽</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(contactData.phone, "phone")}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/60 hover:text-brand-orange transition-colors active:scale-95 flex items-center justify-center relative"
                  title="复制手机号"
                >
                  <AnimatePresence mode="wait">
                    {copiedType === "phone" ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} className="text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={14} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* WeChat Card */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-white/5 bg-neutral-900/40 hover:border-brand-orange/20 transition-all duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange shrink-0">
                    <QrCode size={15} />
                  </div>
                  <div>
                    <span className="text-[8px] text-brand-orange font-mono tracking-widest font-black block uppercase">WECHAT CHANNEL</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">{contactData.wechat}</span>
                    <span className="text-[11px] text-white/40 block mt-0.5">微信企业与个人通道</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(contactData.wechat, "wechat")}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/60 hover:text-brand-orange transition-colors active:scale-95 flex items-center justify-center relative"
                  title="复制微信号"
                >
                  <AnimatePresence mode="wait">
                    {copiedType === "wechat" ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} className="text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={14} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Email Card (mailto with copy fallback) */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-white/5 bg-neutral-900/40 hover:border-brand-orange/20 transition-all duration-300">
                <a
                  href={`mailto:${contactData.email}`}
                  className="flex items-center gap-3.5 flex-1 mr-4 cursor-pointer group"
                >
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                    <Mail size={15} />
                  </div>
                  <div>
                    <span className="text-[8px] text-brand-orange font-mono tracking-widest font-black block uppercase">EMAIL SERVICE</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 group-hover:text-brand-orange transition-colors">{contactData.email}</span>
                    <span className="text-[11px] text-white/40 block mt-0.5">点击发送邮件 / 洽谈合作</span>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy(contactData.email, "email")}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/60 hover:text-brand-orange transition-colors active:scale-95 flex items-center justify-center relative"
                  title="复制邮箱地址"
                >
                  <AnimatePresence mode="wait">
                    {copiedType === "email" ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} className="text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={14} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>

      {/* Embedded CSS custom Keyframes for scanning laser line */}
      <style>{`
        @keyframes scan {
          0%, 100% {
            top: 4px;
          }
          50% {
            top: calc(100% - 6px);
          }
        }
      `}</style>
    </section>
  );
}
