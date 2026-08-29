import React from 'react';
import { useGameStore, getPlayerTitle } from '../../store/gameStore';
import { Sparkles, Volume2, VolumeX, Settings, Flame, CheckCircle2 } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface HeaderStatsProps {
  onOpenSettings: () => void;
  onOpenDailyGift: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  onOpenSettings,
  onOpenDailyGift,
}) => {
  const {
    level,
    xp,
    xpToNextLevel,
    coins,
    gems,
    dailyStreak,
    saveIndicator,
    bgmEnabled,
    updateSettings,
  } = useGameStore();

  const playerTitle = getPlayerTitle(level);
  const xpPercent = Math.min(100, Math.round((xp / xpToNextLevel) * 100));

  const toggleSound = () => {
    updateSettings({ bgmEnabled: !bgmEnabled });
    audioService.playClick();
  };

  return (
    <header className="w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b-2 border-[#EFE5D8] px-4 py-2.5 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Avatar & Level Info */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onOpenDailyGift} title="Click to view Daily Streak!">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#A8C686] to-[#7BA05B] flex items-center justify-center text-xl shadow-inner border-2 border-white">
              🍵
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#FBBF24] text-[#78350F] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
              Lv.{level}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm text-[#4A3E3D]">{playerTitle}</span>
              {saveIndicator && (
                <span className="flex items-center gap-1 text-[11px] text-[#16A34A] font-semibold animate-pulse">
                  <CheckCircle2 size={12} /> Saved
                </span>
              )}
            </div>
            {/* XP Bar */}
            <div className="flex items-center gap-2">
              <div className="w-24 md:w-36 h-2.5 bg-[#F1E9DF] rounded-full overflow-hidden border border-[#E5D7C5]">
                <div
                  className="h-full bg-gradient-to-r from-[#A8C686] to-[#7BA05B] rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-[#8C7A6B]">
                {xp}/{xpToNextLevel} XP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Currencies & Streak */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-[#FFF6E5] border border-[#FDE68A] px-3 py-1.5 rounded-2xl shadow-xs">
            <span className="text-lg">🪙</span>
            <span className="font-display font-bold text-sm text-[#B45309]">
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1.5 rounded-2xl shadow-xs">
            <span className="text-lg">💎</span>
            <span className="font-display font-bold text-sm text-[#7C3AED]">{gems}</span>
          </div>

          {/* Streak */}
          <button
            onClick={onOpenDailyGift}
            className="flex items-center gap-1 bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-1.5 rounded-2xl shadow-xs hover:bg-[#FFE4E6] transition-colors cursor-pointer"
            title="Daily Login Streak! Click to claim daily gifts!"
          >
            <Flame size={16} className="text-[#F43F5E] fill-[#F43F5E] animate-bounce" />
            <span className="font-display font-bold text-xs text-[#BE123C]">{dailyStreak}d</span>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* BGM Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-2xl border transition-all cursor-pointer ${
              bgmEnabled
                ? 'bg-[#EBF5E0] border-[#A8C686] text-[#4D7C0F]'
                : 'bg-[#F1EFEA] border-[#D1C7BA] text-[#8C8275]'
            }`}
            title={bgmEnabled ? 'Music: ON (Kawaii Lofi)' : 'Music: OFF'}
          >
            {bgmEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-2xl bg-white border border-[#E2D6C5] text-[#5C5046] hover:bg-[#F9F5EE] transition-all cursor-pointer shadow-xs"
            title="Settings & Reset"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
