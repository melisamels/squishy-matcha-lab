import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import { X, Volume2, VolumeX, RotateCcw, Maximize2, Heart, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    bgmEnabled,
    sfxEnabled,
    bgmVolume,
    sfxVolume,
    language,
    updateSettings,
    resetGame,
  } = useGameStore();

  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleExecuteReset = () => {
    resetGame();
    setResetStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#E5D7C5] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 my-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-[#3B342F]">
            ⚙️ Settings & Audio
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-[#E8DCCF]">
          {/* BGM Toggle & Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4A3E3D] flex items-center gap-1.5">
                🎵 Background Music (Matcha Café Lofi)
              </span>
              <button
                onClick={() => updateSettings({ bgmEnabled: !bgmEnabled })}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bgmEnabled
                    ? 'bg-[#EBF5E0] text-[#3F6212] border border-[#A8C686]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {bgmEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            {bgmEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVolume}
                onChange={e => updateSettings({ bgmVolume: parseFloat(e.target.value) })}
                className="w-full accent-[#7BA05B] cursor-pointer"
              />
            )}
          </div>

          <div className="h-px bg-gray-100" />

          {/* SFX Toggle & Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4A3E3D] flex items-center gap-1.5">
                🐾 Sound Effects (Squish & Chimes)
              </span>
              <button
                onClick={() => updateSettings({ sfxEnabled: !sfxEnabled })}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sfxEnabled
                    ? 'bg-[#EBF5E0] text-[#3F6212] border border-[#A8C686]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {sfxEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            {sfxEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={e => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
                className="w-full accent-[#7BA05B] cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Display & Language Options */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={toggleFullscreen}
            className="flex-1 py-2.5 bg-white border border-[#E8DCCF] hover:bg-[#F9F5EE] rounded-2xl text-xs font-bold text-[#5C5046] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 size={15} /> Fullscreen
          </button>

          <button
            onClick={() => updateSettings({ language: language === 'en' ? 'id' : 'en' })}
            className="flex-1 py-2.5 bg-white border border-[#E8DCCF] hover:bg-[#F9F5EE] rounded-2xl text-xs font-bold text-[#5C5046] flex items-center justify-center gap-2 cursor-pointer"
          >
            🌐 {language === 'en' ? 'English (EN)' : 'Indonesia (ID)'}
          </button>
        </div>

        {/* Credits */}
        <div className="p-3 bg-[#FDF8F2] rounded-2xl border border-[#EFE5D8] text-center text-xs text-[#7A6C60]">
          <div className="font-display font-bold text-[#3B342F]">Squishy Factory: Matcha Lab</div>
          <p className="text-[11px] mt-0.5">Designed with love for cute squishy creators worldwide! 🍵✨</p>
        </div>

        {/* Double Confirmation Reset Game */}
        <div className="pt-2 border-t border-[#E8DCCF]">
          {resetStep === 0 && (
            <button
              onClick={() => setResetStep(1)}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={14} /> Reset Game Progress
            </button>
          )}

          {resetStep === 1 && (
            <div className="p-3 bg-red-50 border-2 border-red-300 rounded-2xl flex flex-col gap-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-800">
                <AlertTriangle size={15} /> Are you sure?
              </div>
              <p className="text-[11px] text-red-700 leading-tight">
                This will reset your coins, squishies, and collection progress.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setResetStep(0)}
                  className="flex-1 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  Keep Progress
                </button>
                <button
                  onClick={() => setResetStep(2)}
                  className="flex-1 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          )}

          {resetStep === 2 && (
            <div className="p-3 bg-red-100 border-2 border-red-500 rounded-2xl flex flex-col gap-2 text-center animate-pulse">
              <div className="text-xs font-black text-red-900">
                FINAL CONFIRMATION: Reset everything?
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setResetStep(0)}
                  className="flex-1 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReset}
                  className="flex-1 py-1.5 bg-red-700 text-white rounded-xl text-xs font-black hover:bg-red-800"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#7BA05B] text-white font-display font-bold rounded-2xl shadow-xs hover:bg-[#65A30D] cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
