import React from 'react';
import { MomoMascot } from './MomoMascot';
import { audioService } from '../../services/audioService';
import { Sparkles, Play, BookOpen, Settings, Flame, Smartphone } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface TitleScreenProps {
  onStartGame: () => void;
  onContinueGame: () => void;
  onOpenCollection: () => void;
  onOpenSettings: () => void;
  onOpenShareGame?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onContinueGame,
  onOpenCollection,
  onOpenSettings,
  onOpenShareGame,
}) => {
  const { inventory, level, coins } = useGameStore();

  const hasSaveProgress = inventory.length > 0 || level > 1 || coins !== 2000;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#FFFDF7] via-[#F3F9ED] to-[#FCE7F3] flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-hidden">
      {/* Floating Decorative Kawaii Elements */}
      <div className="absolute top-10 left-12 text-3xl animate-float opacity-70">🍵</div>
      <div className="absolute top-20 right-16 text-3xl animate-float opacity-70" style={{ animationDelay: '1s' }}>🌸</div>
      <div className="absolute bottom-16 left-16 text-3xl animate-wiggle opacity-70" style={{ animationDelay: '1.5s' }}>🍓</div>
      <div className="absolute bottom-20 right-20 text-3xl animate-wiggle opacity-70" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute top-1/3 left-6 text-2xl animate-float opacity-60">🎀</div>
      <div className="absolute bottom-1/3 right-8 text-2xl animate-float opacity-60">🥐</div>

      {/* Main Title Card */}
      <div className="relative z-10 max-w-lg w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-10 border-4 border-[#A8C686] shadow-xl flex flex-col items-center text-center gap-6">
        {/* Mascot Header */}
        <div className="relative -mt-16">
          <MomoMascot size={130} showBubble={false} />
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#EAF3DE] rounded-full border border-[#A8C686] text-xs font-bold text-[#4D7C0F] mx-auto shadow-2xs">
            <Sparkles size={14} /> Official Web Game
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-[#3B342F] tracking-tight mt-1">
            Squishy Factory
          </h1>
          <div className="font-display font-extrabold text-xl md:text-2xl text-[#65A30D] -mt-1">
            🍵 Matcha Lab 🍵
          </div>
          <div className="text-xs md:text-sm font-bold text-[#A37B5C] uppercase tracking-widest mt-1">
            Create • Collect • Decorate • Sell
          </div>
        </div>

        {/* Opening Message */}
        <p className="text-xs md:text-sm text-[#6B5E52] leading-relaxed max-w-md bg-[#FDF8F2] p-4 rounded-2xl border border-[#EFE5D8]">
          “Welcome to Matcha Lab! Create adorable squishies, complete your collection, decorate your room, and build the cutest squishy shop ever!”
        </p>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Start New Game */}
          <button
            onClick={() => {
              audioService.playClick();
              onStartGame();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] text-white font-display font-bold text-base rounded-2xl shadow-md hover:shadow-lg hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={18} className="fill-white" /> Start Game
          </button>

          {/* Continue Game */}
          <button
            onClick={() => {
              if (hasSaveProgress) {
                audioService.playClick();
                onContinueGame();
              }
            }}
            disabled={!hasSaveProgress}
            className={`w-full py-3 px-4 font-display font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${
              hasSaveProgress
                ? 'bg-[#FEF3C7] border-2 border-[#FDE68A] text-[#92400E] shadow-xs hover:bg-[#FDE68A] hover:scale-102 active:scale-98 cursor-pointer'
                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={!hasSaveProgress ? 'No previous save progress yet' : 'Continue from saved game'}
          >
            <span>▶</span> Continue {hasSaveProgress && `(Lv.${level})`}
          </button>

          {/* Mainkan di HP / Share */}
          {onOpenShareGame && (
            <button
              onClick={() => {
                audioService.playClick();
                onOpenShareGame();
              }}
              className="w-full py-2.5 px-4 bg-[#EFF6FF] border-2 border-[#BFDBFE] text-[#1D4ED8] font-display font-bold text-xs rounded-2xl hover:bg-[#DBEAFE] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Smartphone size={16} /> Mainkan di HP Anak 📱
            </button>
          )}

          {/* Collection Book */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenCollection();
            }}
            className="w-full py-2.5 px-4 bg-white border-2 border-[#E8DCCF] text-[#5C5046] font-display font-bold text-xs rounded-2xl hover:bg-[#F9F5EE] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen size={16} /> Collection Preview
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 bg-white border-2 border-[#E8DCCF] text-[#5C5046] font-display font-bold text-xs rounded-2xl hover:bg-[#F9F5EE] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Settings size={16} /> Settings & Audio
          </button>
        </div>
      </div>
    </div>
  );
};
