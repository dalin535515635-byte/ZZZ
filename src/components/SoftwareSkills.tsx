import { motion } from "motion/react";

const softwares = [
  { name: "C4D", fullName: "Cinema 4D", icon: "https://i.postimg.cc/5ydLqgH5/c2267585310a8cc41eff4f5e3f7f648a67f54270959c-w-GWRPJ.jpg", color: "from-blue-600/20 to-blue-400/20" },
  { name: "UE5", fullName: "Unreal Engine 5", icon: "https://i.postimg.cc/Xv9VBg0D/686ef87007549b20e006a4765a5ead9b3942603e1786-sj-SZ9L-fw1200.png", color: "from-neutral-800/40 to-neutral-700/40" },
  { name: "MAYA", fullName: "Autodesk Maya", icon: "https://i.postimg.cc/wTRdZkG9/PT.png", color: "from-cyan-600/20 to-cyan-400/20" },
  { name: "AE", fullName: "After Effects", icon: "https://i.postimg.cc/sf8kYhD9/PR.png", color: "from-purple-600/20 to-purple-400/20" },
  { name: "PR", fullName: "Premiere Pro", icon: "https://i.postimg.cc/t4XfNtWj/8e17002c252745c36095bc2f03c62e1d40d806501a434-22d-Kwl.jpg", color: "from-indigo-600/20 to-indigo-400/20" },
];

export default function SoftwareSkills() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-24 bg-background">
      <div className="max-w-[800px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-12 md:mb-24"
        >
          <h2 className="text-brand-orange text-[10px] font-bold tracking-[0.6em] uppercase mb-4">
            - SOFTWARE SKILLS -
          </h2>
          <h3 className="text-3xl md:text-5xl font-display font-medium text-white">
            擅长软件
          </h3>
        </motion.div>

        <div className="grid grid-cols-5 gap-2 md:gap-8 justify-center">
          {softwares.map((sw, index) => (
            <motion.div
              key={sw.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group aspect-square rounded-lg md:rounded-2xl border border-white/5 bg-neutral-900 hover:border-brand-orange/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
            >
              <img src={sw.icon} alt={sw.fullName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
