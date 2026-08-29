import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MysteryBoxModalProps {
  onClose: () => void;
}

export const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({ onClose }) => {
  const { openMysteryBox } = useGameStore();

  const [isOpening, setIsOpening] = useState(false);
  const [openedReward, setOpenedReward] = useState<{ label: string } | null>(null);

  const handleOpenBox = () => {
    setIsOpening(true);
    audioService.playPop();

    setTimeout(() => {
      const reward = openMysteryBox();
      setOpenedReward(reward);
      setIsOpening(false);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
        });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#FBBF24] rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-5 my-auto">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-3 py-1 rounded-full">
            ✨ Free Lucky Drop
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div>
          <h3 className="font-display font-bold text-xl text-[#3B342F]">
            Mystery Squishy Box
          </h3>
          <p className="text-xs text-[#7A6C60] mt-1">
            Tap the gift box to unlock free coins, rare accessories, or secret materials!
          </p>
        </div>

        {/* Box Animation / Reward */}
        <div className="py-6 flex flex-col items-center justify-center min-h-[160px]">
          {openedReward ? (
            <div className="flex flex-col items-center gap-3 animate-bounce">
              <span className="text-6xl">🎉</span>
              <div className="font-display font-bold text-lg text-[#15803D]">
                {openedReward.label}
              </div>
              <span className="text-xs text-[#6B5E52]">Added to your account!</span>
            </div>
          ) : (
            <div
              onClick={!isOpening ? handleOpenBox : undefined}
              className={`cursor-pointer transition-transform ${
                isOpening ? 'scale-125 rotate-12 animate-pulse' : 'hover:scale-110 active:scale-95'
              }`}
            >
              <div className="w-28 h-28 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-5xl relative">
                🎁
                {isOpening && (
                  <div className="absolute -top-3 -right-3 text-2xl animate-spin">✨</div>
                )}
              </div>
            </div>
          )}
        </div>

        {openedReward ? (
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#7BA05B] hover:bg-[#65A30D] text-white font-display font-bold text-sm rounded-2xl shadow-xs cursor-pointer"
          >
            Yay! Awesome
          </button>
        ) : (
          <button
            onClick={handleOpenBox}
            disabled={isOpening}
            className="w-full py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-display font-bold text-sm rounded-2xl shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            {isOpening ? 'Unboxing Magic...' : 'Tap to Open Box! 🎁'}
          </button>
        )}
      </div>
    </div>
  );
};
