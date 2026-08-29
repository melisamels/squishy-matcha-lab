import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';

interface MomoMascotProps {
  customMessage?: string;
  className?: string;
  size?: number;
  showBubble?: boolean;
}

export const MomoMascot: React.FC<MomoMascotProps> = ({
  customMessage,
  className = '',
  size = 120,
  showBubble = true,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const { level, coins, dailyMissions, discoveredCollection } = useGameStore();

  const discoveredCount = Object.keys(discoveredCollection).length;

  const dynamicTips = [
    `Welcome to Matcha Lab! Let's make something super cute today! ✨`,
    `Psst! Try combining Matcha Green + Sakura Flower for a sweet surprise! 🌸🍵`,
    `You have ${coins} coins. Check the Material Store for new molds and colors! 🛍️`,
    `You've discovered ${discoveredCount} / 150 squishies! Keep collecting! 📖`,
    `Tip: Premium packaging increases your squishy's selling value by up to 50%! 🎁`,
    `Complete your 3 Daily Missions to claim a bonus Mystery Box! 🎯`,
    `Did you know? Golden Honey Panda is a Legendary recipe! 🍯👑`,
    `Tap on any squishy in your lab or room to give it a squish! 🐾`,
  ];

  const currentMessage = customMessage || dynamicTips[activeTipIndex % dynamicTips.length];

  const handleClickMomo = () => {
    setIsBouncing(true);
    audioService.playPop();
    setActiveTipIndex(prev => prev + 1);
    setTimeout(() => setIsBouncing(false), 400);
  };

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Speech Bubble */}
      {showBubble && (
        <div
          onClick={handleClickMomo}
          className="relative bg-white/95 backdrop-blur-sm border-2 border-[#A8C686] text-[#4A3E3D] text-xs md:text-sm font-medium px-3.5 py-2 rounded-2xl shadow-md max-w-[220px] md:max-w-[260px] cursor-pointer hover:border-[#7BA05B] transition-all"
        >
          <p className="leading-snug">{currentMessage}</p>
          {/* Bubble Pointer Tail */}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#A8C686]" />
        </div>
      )}

      {/* SVG Momo Mascot */}
      <div
        onClick={handleClickMomo}
        style={{
          width: size,
          height: size,
          transform: isBouncing ? 'scale(1.15) translateY(-8px)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="cursor-pointer select-none filter drop-shadow-md hover:scale-105 transition-transform"
        title="Hi, I'm Momo! Click me for tips! 🐰🍵"
      >
        <svg viewBox="0 0 140 140" width="100%" height="100%">
          {/* Bunny Ears */}
          <g>
            {/* Left Ear */}
            <ellipse cx="50" cy="38" rx="10" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" transform="rotate(-15 50 38)" />
            <ellipse cx="50" cy="38" rx="5" ry="16" fill="#FFAAC9" opacity="0.6" transform="rotate(-15 50 38)" />

            {/* Right Ear (Wiggling slightly) */}
            <ellipse cx="90" cy="38" rx="10" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" transform="rotate(15 90 38)" />
            <ellipse cx="90" cy="38" rx="5" ry="16" fill="#FFAAC9" opacity="0.6" transform="rotate(15 90 38)" />
          </g>

          {/* Momo Chubby White Head */}
          <circle cx="70" cy="72" r="32" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* Cheeks */}
          <ellipse cx="52" cy="78" rx="6" ry="4" fill="#FFAAC9" opacity="0.75" />
          <ellipse cx="88" cy="78" rx="6" ry="4" fill="#FFAAC9" opacity="0.75" />

          {/* Happy Curved Eyes */}
          <path d="M 56 68 Q 62 62 66 68" fill="none" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 74 68 Q 78 62 84 68" fill="none" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />

          {/* Nose & Cute Mouth */}
          <ellipse cx="70" cy="72" rx="2.5" ry="1.8" fill="#F43F5E" />
          <path d="M 67 74 Q 70 77 73 74" fill="none" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />

          {/* Matcha Apron Body */}
          <path d="M 46 100 Q 70 94 94 100 L 98 132 Q 70 138 42 132 Z" fill="#8DAF66" stroke="#7BA05B" strokeWidth="2" />
          {/* Apron Bib */}
          <rect x="56" y="88" width="28" height="18" rx="3" fill="#8DAF66" />
          {/* Apron Pocket */}
          <rect x="62" y="108" width="16" height="14" rx="4" fill="#A8C686" />
          {/* Matcha Whisk / Leaf in Pocket */}
          <path d="M 70 104 L 70 112" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Chubby White Hands */}
          <circle cx="44" cy="102" r="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="96" cy="102" r="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Sparkle badge near ear */}
          <polygon points="98,24 100,30 106,32 100,34 98,40 96,34 90,32 96,30" fill="#FDE047" />
        </svg>
      </div>
    </div>
  );
};
