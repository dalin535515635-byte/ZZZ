import { motion } from "motion/react";

const experiences = [
  {
    period: "2024.6 - 至今",
    company: "广东省广告集团股份有限公司",
    role: "美术指导",
    desc: "核心负责《和平精英》《穿越火线》等头部游戏项目的线上海报KV的3D建模与渲染，以及大型线下赛事装置的深化设计与落地制作，确保创意概念被精准、高质量地转化为视觉成品。"
  },
  {
    period: "2023.4 - 2024.4",
    company: "阿里巴巴",
    role: "3D创意设计",
    desc: "主导天猫APP元宇宙场景的模型搭建与贴图制作；负责淘宝APP数字人服饰的模型制作与引擎渲染。同时，统筹管理供应商团队，确保创意项目的进度、品质与标准化交付。"
  },
  {
    period: "2022.1 - 2023.2",
    company: "阿里云",
    role: "3D创意设计",
    desc: "负责阿里云平台（创意平台、数字孪生平台等）的3D视觉内容建设。独立完成从产品、场景的建模、UV与材质制作，到灯光渲染、动画合成的全流程工作，为核心网页、产品主图、详情页及元宇宙虚拟服饰等输出高质量静帧与动态内容。"
  },
  {
    period: "2020.8 - 2021.12",
    company: "浙江泛雅教育科技有限公司",
    role: "视频编辑执行",
    desc: "独立负责视频课程的全流程制作，包括剪辑、包装、音频处理及后期合成。熟练运用各类剪辑与特效软件，高效产出符合公司标准与教学需求的视频内容。协同教学、设计团队，将课程脚本转化为直观生动的视觉作品，提升课程质量与完课率。"
  }
];

export default function Experience() {
  return (
    <section className="py-32 px-6 md:px-24 bg-background">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-24"
         >
          <h2 className="text-brand-orange text-[10px] font-bold tracking-[0.6em] uppercase mb-4">
            - WORK EXPERIENCE -
          </h2>
          <h3 className="text-3xl md:text-5xl font-display font-medium text-white">
            个人工作简历
          </h3>
        </motion.div>

        <div className="flex flex-col">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1] 
              }}
              className="group grid grid-cols-1 md:grid-cols-12 items-baseline gap-4 md:gap-8 py-12 border-b border-white/5 hover:bg-white/[0.01] transition-all duration-500 px-4 -mx-4"
            >
              <div className="md:col-span-3 text-white/80 font-display text-base md:text-lg font-bold tracking-wide pt-1 whitespace-nowrap">
                {exp.period}
              </div>
              <div className="md:col-span-3 flex flex-col gap-1">
                <span className="text-lg md:text-xl font-display font-semibold text-white group-hover:text-brand-orange transition-colors duration-300">
                  {exp.company}
                </span>
                <span className="text-sm font-sans text-white/70 font-medium">
                  {exp.role}
                </span>
              </div>
              <div className="md:col-span-6">
                <p className="text-sm md:text-base font-sans text-white/50 leading-relaxed max-w-2xl">
                  {exp.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
