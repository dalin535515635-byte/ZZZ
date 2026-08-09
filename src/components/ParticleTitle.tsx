import React, { useEffect, useRef } from 'react';

interface ParticleProps {
  text: string;
}

const ParticleTitle: React.FC<ParticleProps> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const mouse = {
      x: 0,
      y: 0,
      radius: 15
    };

    let scrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollImpact = 0;

    class Particle {
      x: number;
      y: number;
      originalX: number;
      originalY: number;
      size: number;
      density: number;
      color: string;
      // Add properties for organic movement
      randomOffset: number;
      driftSpeed: number;
      parallaxFactor: number;
      scatterX: number;
      scatterY: number;

      constructor(x: number, y: number, fontSizeActual: number) {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.originalX = x;
        this.originalY = y;
        this.size = window.innerWidth < 768 
          ? Math.max(0.8, fontSizeActual * 0.009) 
          : Math.max(1.2, fontSizeActual * 0.0075);
        this.density = (Math.random() * 15) + 1;
        this.randomOffset = Math.random() * 1000;
        this.driftSpeed = window.innerWidth < 768 ? 0.0006 : 0.001 + Math.random() * 0.002;
        this.parallaxFactor = window.innerWidth < 768 ? (Math.random() - 0.5) * 0.02 : (Math.random() - 0.5) * 0.1;
        this.scatterX = (Math.random() - 0.5) * 40;
        this.scatterY = (Math.random() - 0.5) * 40;

        // Gritty white to light gray with highly randomized opacity
        const grey = Math.floor(Math.random() * 55) + 200;
        this.color = `rgba(${grey}, ${grey}, ${grey}, ${window.innerWidth < 768 ? Math.random() * 0.4 + 0.5 : Math.random() * 0.9 + 0.1})`;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Organic drift: Add a slow, smooth oscillation around the target position
          const time = Date.now() * this.driftSpeed + this.randomOffset;
          const driftX = Math.sin(time) * (window.innerWidth < 768 ? 0.8 : 2);
          const driftY = Math.cos(time * 0.8) * (window.innerWidth < 768 ? 0.8 : 2);
          
          // Parallax effect based on scroll
          const parallaxShift = scrollY * this.parallaxFactor;
          
          // Scroll scatter effect
          const sX = this.scatterX * scrollImpact;
          const sY = this.scatterY * scrollImpact;

          const targetX = this.originalX + driftX + sX;
          const targetY = this.originalY + driftY + parallaxShift + sY;

          if (this.x !== targetX) {
            const dx = this.x - targetX;
            this.x -= dx / (window.innerWidth < 768 ? 12 : 30); // Faster pull back on mobile
          }
          if (this.y !== targetY) {
            const dy = this.y - targetY;
            this.y -= dy / (window.innerWidth < 768 ? 12 : 30);
          }

          // Add slight random jitter on mobile for extra "aliveness"
          if (window.innerWidth < 768) {
            this.x += (Math.random() - 0.5) * 0.2;
            this.y += (Math.random() - 0.5) * 0.2;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;

      if (w <= 0 || h <= 0) return;

      const textCanvas = document.createElement('canvas');
      const textCtx = textCanvas.getContext('2d', { willReadFrequently: true });
      if (!textCtx) return;

      textCanvas.width = w;
      textCanvas.height = h;

      // Base target font level (doubled as requested)
      let fontSize = window.innerWidth < 768 ? Math.min(w / 4.25, 160) : Math.min(w / 3.0, 280);
      textCtx.fillStyle = 'white';
      textCtx.font = `900 italic ${fontSize}px Orbitron`;
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';

      // Constrain by horizontal width
      const maxAllowedWidth = w * 0.94;
      while (textCtx.measureText(text).width > maxAllowedWidth && fontSize > 20) {
        fontSize -= 4;
        textCtx.font = `900 italic ${fontSize}px Orbitron`;
      }

      // Constrain by vertical height
      const maxAllowedHeight = h * 0.85;
      if (fontSize > maxAllowedHeight) {
        fontSize = maxAllowedHeight;
        textCtx.font = `900 italic ${fontSize}px Orbitron`;
      }
      
      textCtx.fillText(text, w / 2, h / 2);

      const data = textCtx.getImageData(0, 0, w, h).data;
      
      // Keep gap proportionate to final font size to retain premium sharpness
      const gap = window.innerWidth < 768 
        ? Math.max(2, Math.floor(fontSize / 32)) 
        : Math.max(3, Math.floor(fontSize / 36)); 

      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const index = (y * w + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            // Add slight randomness to positions for nature-like grit
            const posX = x + (Math.random() - 0.5) * (window.innerWidth < 768 ? 1 : 2);
            const posY = y + (Math.random() - 0.5) * (window.innerWidth < 768 ? 1 : 2);
            particles.push(new Particle(posX, posY, fontSize));
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Decay scroll impact
      scrollImpact *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      
      // Wait for font to be ready for accurate sampling
      if (document.fonts) {
        document.fonts.ready.then(() => {
          init();
        });
      } else {
        setTimeout(init, 100);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScrollY);
      
      // Update global scroll position
      scrollY = currentScroll;
      
      // Add to impact if scrolling (especially on mobile)
      if (window.innerWidth < 768) {
        scrollImpact = Math.min(1.5, scrollImpact + (delta * 0.015));
      } else {
        scrollImpact = Math.min(1.0, scrollImpact + (delta * 0.005));
      }
      
      lastScrollY = currentScroll;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [text]);

  return (
    <div className="relative w-full h-[50vh] md:h-[65vh] flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-none"
      />
      {/* Fallback for accessibility/SEO */}
      <h1 className="sr-only">{text}</h1>
    </div>
  );
};

export default ParticleTitle;
