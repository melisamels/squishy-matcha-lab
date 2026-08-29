import React, { useEffect, useState } from 'react';
import { audioService } from '../../services/audioService';

interface MachineAnimationProps {
  onComplete: () => void;
}

const STAGES = [
  { text: '🥣 Mixing squishy dough...', sound: 'pop' },
  { text: '🎨 Blending pastel color...', sound: 'sparkle' },
  { text: '🌸 Infusing sweet aroma...', sound: 'sparkle' },
  { text: '🐾 Squishifying texture...', sound: 'squish' },
  { text: '🎁 Wrapping in cute packaging...', sound: 'box' },
];

export const MachineAnimation: React.FC<MachineAnimationProps> = ({ onComplete }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    let timer: any;
    if (currentStageIndex < STAGES.length) {
      const soundType = STAGES[currentStageIndex].sound;
      if (soundType === 'squish') audioService.playSquish();
      else if (soundType === 'pop') audioService.playPop();
      else if (soundType === 'sparkle') audioService.playSparkle();
      else if (soundType === 'box') audioService.playBoxOpen();

      timer = setTimeout(() => {
        setCurrentStageIndex(prev => prev + 1);
      }, 700);
    } else {
      timer = setTimeout(() => {
        onComplete();
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [currentStageIndex, onComplete]);

  const currentStage = STAGES[Math.min(currentStageIndex, STAGES.length - 1)];

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/75 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#A8C686] rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-6 animate-bounce" style={{ animationDuration: '2s' }}>
        {/* Cute Animated Machine Illustration */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute inset-0 bg-[#EAF3DE] rounded-full animate-ping opacity-30" />

          {/* Machine Cauldron / Maker */}
          <div className="relative z-10 w-28 h-28 rounded-3xl bg-gradient-to-br from-[#8DAF66] to-[#65A30D] border-4 border-white shadow-lg flex flex-col items-center justify-center text-white">
            <span className="text-4xl animate-spin" style={{ animationDuration: '3s' }}>
              ⚙️
            </span>
            <div className="absolute -top-3 text-2xl animate-float">
              🫧
            </div>
            <div className="absolute -bottom-2 text-xl animate-wiggle">
              ✨
            </div>
          </div>
        </div>

        {/* Dynamic Stage Text */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xl font-bold text-[#3B342F]">
            Squishy Maker 3000
          </h3>
          <p className="font-medium text-sm text-[#65A30D] h-6 animate-pulse">
            {currentStage.text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#EFE5D8] h-3 rounded-full overflow-hidden border border-[#D5C7B7]">
          <div
            className="h-full bg-gradient-to-r from-[#A8C686] to-[#7BA05B] rounded-full transition-all duration-300"
            style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
