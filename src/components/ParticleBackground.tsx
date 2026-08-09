import React, { useState, useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  // 初始化粒子引擎，生命周期内只执行一次
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // console.log("Particles loaded:", container);
  };

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      className="fixed inset-0 z-0 pointer-events-none"
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 60,
        interactivity: {
          detectsOn: "window", // 关键：让鼠标在窗口任何位置都能触发交互
          events: {
            onHover: {
              enable: true,
              mode: "grab", // 鼠标悬停时吸附连线
            },
            resize: { enable: true },
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          color: {
            // 明日方舟风格的配色：橙、蓝、白
            value: ["#f27d26", "#00d2ff", "#ffffff"],
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce", // 碰到边缘反弹
            },
            random: true,
            speed: 0.8, // 较缓慢的移动速度，营造氛围感
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 45, // 稍稍减少粒子数量（原80）
          },
          opacity: {
            value: 0.25, // 略微调淡透明度，避免遮挡视觉
          },
          shape: {
            type: ["circle", "square"], // 混合圆形和方形粒子，符合技术感
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
