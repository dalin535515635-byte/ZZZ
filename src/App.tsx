import GameFolderModal from "./components/GameFolderModal";
import CustomCursor from "./components/CustomCursor";
import GlobalDecor from "./components/GlobalDecor";
import ParticleBackground from "./components/ParticleBackground";

function App() {
  return (
    <div 
      className="bg-background min-h-screen text-foreground selection:bg-brand-orange/30 selection:text-white relative overflow-hidden w-screen h-screen"
    >
      {/* Global Cinematic Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}
      />
      <GlobalDecor />
      <ParticleBackground />
      <CustomCursor />

      {/* Arknights Style Premium Top Header */}
      <header className="fixed top-0 left-0 right-0 z-[110] bg-neutral-950/40 backdrop-blur-md border-b border-white/5 select-none h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 md:px-12">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-brand-orange rotate-45 flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(242,125,38,0.5)]">
            <span className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-white hover:text-brand-orange transition-colors font-extrabold text-[12px] sm:text-[14px] md:text-[16px] tracking-[0.3em] font-mono uppercase">
              NIKEYUE
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative w-full h-full overflow-hidden pt-16 sm:pt-20">
        <div className="w-full h-full min-h-screen relative overflow-hidden bg-background">
          <GameFolderModal isEmbedded={true} />
        </div>
      </div>
    </div>
  );
}

export default App;
