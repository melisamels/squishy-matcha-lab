import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SquishTimingGameProps {
  onResult: (result: { multiplier: number; grade: 'perfect' | 'great' | 'nice' }) => void;
}

export const SquishTimingGame: React.FC<SquishTimingGameProps> = ({ onResult }) => {
  const [position, setPosition] = useState(50);
  const [direction, setDirection] = useState(1);
  const [isStopped, setIsStopped] = useState(false);
  const [grade, setGrade] = useState<'perfect' | 'great' | 'nice' | null>(null);

  const speedRef = useRef(1.4);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(10);
  const dirRef = useRef(1);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16;
      lastTime = currentTime;

      if (!isStopped) {
        posRef.current += dirRef.current * speedRef.current * delta;

        if (posRef.current >= 95) {
          posRef.current = 95;
          dirRef.current = -1;
        } else if (posRef.current <= 5) {
          posRef.current = 5;
          dirRef.current = 1;
        }

        setPosition(posRef.current);
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isStopped]);

  const handleStop = () => {
    if (isStopped) return;
    setIsStopped(true);

    const hit = posRef.current;
    let evalGrade: 'perfect' | 'great' | 'nice' = 'nice';
    let multiplier = 1.0;

    // Perfect Zone: 46% - 54%
    if (hit >= 46 && hit <= 54) {
      evalGrade = 'perfect';
      multiplier = 1.25;
      audioService.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EAB308', '#10B981'],
        });
      } catch (e) {}
    }
    // Great Zone: 36% - 45% or 55% - 64%
    else if ((hit >= 36 && hit < 46) || (hit > 54 && hit <= 64)) {
      evalGrade = 'great';
      multiplier = 1.10;
      audioService.playSparkle();
    }
    // Nice Zone
    else {
      evalGrade = 'nice';
      multiplier = 1.0;
      audioService.playPop();
    }

    setGrade(evalGrade);

    // Wait for reveal excitement, then return result
    setTimeout(() => {
      onResult({ multiplier, grade: evalGrade });
    }, 1400);
  };

  // Keyboard Spacebar trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isStopped) {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStopped]);

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#A8C686] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-6 my-auto">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] rounded-full border border-[#FDE68A] text-xs font-black text-[#B45309] mx-auto animate-pulse">
            <Zap size={14} className="fill-[#F59E0B]" /> SQUISH SKILL CHALLENGE!
          </div>
          <h2 className="font-display font-black text-2xl text-[#3B342F]">
            Timing Kneading Meter
          </h2>
          <p className="text-xs text-[#7A6C60]">
            Stop the needle in the <b>Gold Zone</b> for a <b>PERFECT SQUISH</b> (+25% value & Rarity boost)!
          </p>
        </div>

        {/* Gauge Bar */}
        <div className="w-full flex flex-col gap-2 relative">
          {/* Target Indicators */}
          <div className="flex justify-between text-[11px] font-bold text-[#8C7A6B] px-1">
            <span>Nice (1.0x)</span>
            <span className="text-[#65A30D]">Great (1.1x)</span>
            <span className="text-[#D97706]">⭐ PERFECT (1.25x) ⭐</span>
            <span className="text-[#65A30D]">Great (1.1x)</span>
            <span>Nice (1.0x)</span>
          </div>

          {/* Meter Track */}
          <div className="w-full h-10 bg-gradient-to-r from-[#E5E7EB] via-[#BBF7D0] to-[#E5E7EB] rounded-2xl border-3 border-[#A8C686] relative overflow-hidden shadow-inner flex items-center">
            {/* Great Zone Left */}
            <div className="absolute left-[36%] w-[10%] h-full bg-[#86EFAC]/60 border-x border-[#4ADE80]" />

            {/* Perfect Golden Center Zone */}
            <div className="absolute left-[46%] w-[8%] h-full bg-gradient-to-b from-[#FDE047] via-[#F59E0B] to-[#D97706] shadow-md border-x-2 border-white flex items-center justify-center">
              <span className="text-[10px] text-white font-black animate-ping">★</span>
            </div>

            {/* Great Zone Right */}
            <div className="absolute left-[54%] w-[10%] h-full bg-[#86EFAC]/60 border-x border-[#4ADE80]" />

            {/* Moving Needle */}
            <div
              className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-red-600 rounded-full shadow-lg border-2 border-white transition-none z-10"
              style={{ left: `${position}%` }}
            >
              <div className="w-2 h-2 bg-yellow-300 rounded-full mx-auto mt-1" />
            </div>
          </div>
        </div>

        {/* Result Evaluation Message */}
        <div className="min-h-[60px] flex items-center justify-center">
          {grade === 'perfect' && (
            <div className="flex flex-col items-center gap-1 animate-bounce text-[#D97706]">
              <span className="font-display font-black text-2xl tracking-wider">
                🌟 PERFECT SQUISH! 🌟
              </span>
              <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-3 py-0.5 rounded-full">
                +25% Value Boost & Rarity Advantage!
              </span>
            </div>
          )}

          {grade === 'great' && (
            <div className="flex flex-col items-center gap-1 text-[#15803D] animate-pulse">
              <span className="font-display font-black text-xl">
                ✨ GREAT SQUISH! ✨
              </span>
              <span className="text-xs font-bold text-[#15803D]">
                +10% Value Boost
              </span>
            </div>
          )}

          {grade === 'nice' && (
            <div className="flex flex-col items-center gap-1 text-[#6B5E52]">
              <span className="font-display font-bold text-lg">
                👍 NICE SQUISH!
              </span>
              <span className="text-xs text-[#8C7A6B]">
                Standard Quality Crafted
              </span>
            </div>
          )}

          {!grade && (
            <span className="text-xs text-[#8C7A6B] italic animate-pulse">
              Press the button or Spacebar at the center!
            </span>
          )}
        </div>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          disabled={isStopped}
          className={`w-full py-4 rounded-2xl font-display font-black text-base md:text-lg tracking-wide shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isStopped
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#F59E0B] via-[#E11D48] to-[#8B5CF6] hover:scale-103 active:scale-97 text-white shadow-rose-200 animate-pulse'
          }`}
        >
          <Target size={20} />
          {isStopped ? 'Molding In Progress...' : 'SQUISH NOW! 🎯'}
        </button>
      </div>
    </div>
  );
};
