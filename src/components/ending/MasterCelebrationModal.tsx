import React, { useEffect } from 'react';
import { MomoMascot } from '../common/MomoMascot';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, Trophy, Award } from 'lucide-react';

interface MasterCelebrationModalProps {
  onClose: () => void;
}

export const MasterCelebrationModal: React.FC<MasterCelebrationModalProps> = ({ onClose }) => {
  useEffect(() => {
    audioService.playLevelUp();
    try {
      const end = Date.now() + 3000;
      const interval: any = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 300);
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FEF3C7] border-4 border-[#F59E0B] rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center gap-6 my-auto animate-bounce" style={{ animationDuration: '2.5s' }}>
        <div className="w-20 h-20 rounded-full bg-[#FEF3C7] border-4 border-[#F59E0B] flex items-center justify-center text-4xl shadow-md">
          👑
        </div>

        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F59E0B] text-white rounded-full text-xs font-black mx-auto shadow-xs">
            <Sparkles size={14} /> 100% COMPLETE ACHIEVEMENT
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-[#78350F]">
            MASTER SQUISHY CREATOR! 👑
          </h1>
          <p className="text-sm text-[#92400E] leading-relaxed">
            "You did it! You have discovered all 150 unique squishies across the realm! You are officially the greatest master creator in Matcha Lab history!"
          </p>
        </div>

        <MomoMascot size={120} showBubble={false} />

        <div className="p-4 bg-white/90 rounded-2xl border-2 border-[#FDE68A] w-full text-xs text-[#78350F] flex flex-col gap-1.5 shadow-sm">
          <div className="font-display font-bold text-sm text-[#B45309]">Grand Master Rewards Awarded:</div>
          <div>💖 Secret Momo Signature Squishy Added to Bag</div>
          <div>🌟 Master Creator Sovereign Crown Accessory</div>
          <div>🏰 Golden Matcha Factory Theme Unlocked</div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-display font-black text-base rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          Keep Creating Forever! ✨
        </button>
      </div>
    </div>
  );
};
