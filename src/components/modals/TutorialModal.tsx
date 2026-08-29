import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { MomoMascot } from '../common/MomoMascot';
import { audioService } from '../../services/audioService';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScreenType } from '../common/NavigationBar';

interface TutorialModalProps {
  onStartTutorialInLab: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onStartTutorialInLab }) => {
  const { finishTutorial } = useGameStore();

  const handleStart = () => {
    audioService.playClick();
    onStartTutorialInLab();
  };

  const handleSkip = () => {
    audioService.playClick();
    finishTutorial();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/65 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#A8C686] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-5 my-auto">
        <MomoMascot size={130} showBubble={false} />

        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF3DE] rounded-full border border-[#A8C686] text-xs font-bold text-[#4D7C0F] mx-auto">
            <Sparkles size={14} /> Guided Workshop Tour
          </div>
          <h2 className="font-display font-bold text-2xl text-[#3B342F]">
            Hi! I'm Momo! 🐰🍵
          </h2>
          <p className="text-xs md:text-sm text-[#6B5E52] leading-relaxed mt-1">
            "Welcome to Matcha Lab! This little factory is yours now. Let's head into the Squishy Lab and create our very first squishy together!"
          </p>
        </div>

        <div className="p-3.5 bg-[#FDF8F2] rounded-2xl border border-[#EFE5D8] w-full text-xs text-[#5C5046] flex flex-col gap-1 text-left">
          <div className="font-bold text-[#3B342F]">First Recipe Objective:</div>
          <div>🐰 Bunny Shape + 🍵 Matcha Green + 🎀 Pink Bow</div>
          <div className="text-[11px] text-[#65A30D] font-semibold mt-1">
            Guaranteed Reward: Momo Matcha Bunny (⭐⭐⭐ Rare!)
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleStart}
            className="w-full py-3 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] text-white font-display font-bold text-sm rounded-2xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🧪</span> Let's Create My First Squishy!
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleSkip}
            className="text-xs text-[#8C7A6B] hover:text-[#3B342F] underline cursor-pointer py-1"
          >
            I already know how to play, skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
