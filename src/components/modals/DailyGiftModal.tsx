import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import { X, Gift, Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyGiftModalProps {
  onClose: () => void;
}

export const DailyGiftModal: React.FC<DailyGiftModalProps> = ({ onClose }) => {
  const {
    dailyRewards,
    dailyStreak,
    claimDailyGift,
  } = useGameStore();

  const handleClaim = (dayIndex: number) => {
    const res = claimDailyGift(dayIndex);
    if (res) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#FDE68A] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-5 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] text-2xl">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309]">
                <Flame size={15} className="text-[#F43F5E] fill-[#F43F5E]" />
                Daily Streak: Day {dailyStreak} of 7
              </div>
              <h3 className="font-display font-bold text-xl text-[#3B342F]">
                7-Day Matcha Gifts
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-[#7A6C60]">
          Log in every day to claim bonus coins, mystery boxes, rare accessories, and the exclusive Golden Color material!
        </p>

        {/* 7 Day Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {dailyRewards.map((reward, idx) => {
            const isToday = idx + 1 === dailyStreak;
            const canClaim = isToday && !reward.isClaimed;

            return (
              <div
                key={reward.day}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center gap-2 transition-all ${
                  reward.isClaimed
                    ? 'bg-[#F0FDF4] border-[#86EFAC] opacity-85'
                    : canClaim
                    ? 'bg-[#FEF3C7] border-[#F59E0B] shadow-md animate-pulse scale-105'
                    : 'bg-[#F9F5EE] border-[#E8DCCF] opacity-70'
                }`}
              >
                <div className="text-[10px] font-bold text-[#8C7A6B]">DAY {reward.day}</div>
                <div className="text-2xl">
                  {reward.rewardType === 'coins' ? '🪙' : reward.rewardType === 'accessory' ? '⭐' : reward.rewardType === 'mystery_box' ? '🎁' : '👑'}
                </div>
                <div className="text-[11px] font-bold text-[#3B342F] line-clamp-1">
                  {reward.displayName}
                </div>

                {reward.isClaimed ? (
                  <span className="text-[10px] font-bold text-[#16A34A] flex items-center gap-1">
                    <Check size={12} /> Claimed
                  </span>
                ) : canClaim ? (
                  <button
                    onClick={() => handleClaim(idx)}
                    className="w-full py-1 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[10px] font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Claim!
                  </button>
                ) : (
                  <span className="text-[10px] text-[#A89F91]">Locked</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            audioService.playClick();
            onClose();
          }}
          className="w-full py-2.5 bg-[#7BA05B] text-white font-display font-bold rounded-2xl shadow-xs hover:bg-[#65A30D] cursor-pointer"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
