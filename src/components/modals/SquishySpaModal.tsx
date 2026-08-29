import React, { useState, useEffect, useRef } from 'react';
import { Squishy } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { audioService } from '../../services/audioService';
import { Sparkles, X, Heart, Droplets, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Bubble {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  emoji: string;
}

interface SquishySpaModalProps {
  squishy: Squishy;
  onClose: () => void;
  onPolished: (squishyUniqueId: string) => void;
}

export const SquishySpaModal: React.FC<SquishySpaModalProps> = ({
  squishy,
  onClose,
  onPolished,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const bubbleIdRef = useRef<number>(1);
  const targetScore = 15;

  // Countdown timer
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  // Spawns bubbles periodically
  useEffect(() => {
    if (isFinished) return;

    const spawner = setInterval(() => {
      setBubbles(prev => {
        if (prev.length >= 6) return prev;
        const newBubble: Bubble = {
          id: bubbleIdRef.current++,
          x: Math.floor(15 + Math.random() * 70),
          y: Math.floor(15 + Math.random() * 70),
          size: Math.floor(35 + Math.random() * 20),
          emoji: Math.random() > 0.4 ? '🫧' : '✨',
        };
        return [...prev, newBubble];
      });
    }, 450);

    return () => clearInterval(spawner);
  }, [isFinished]);

  const handlePopBubble = (id: number) => {
    audioService.playPop();
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => {
      const next = prev + 1;
      if (next >= targetScore && !isFinished) {
        handleFinish();
      }
      return next;
    });
  };

  const handleFinish = () => {
    setIsFinished(true);
    audioService.playLevelUp();
    onPolished(squishy.uniqueId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#38BDF8', '#F472B6', '#FBBF24'],
      });
    } catch (e) {}
  };

  const fluffPercent = Math.min(100, Math.round((score / targetScore) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/65 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#38BDF8] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-5 my-auto relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full flex items-center gap-1.5">
            <Droplets size={14} /> Matcha Squishy Spa & Bath
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div>
          <h3 className="font-display font-black text-xl md:text-2xl text-[#3B342F]">
            Fluff & Polish: {squishy.name}
          </h3>
          <p className="text-xs text-[#7A6C60] mt-1">
            Tap the floating bubbles & sparkles to fluff up your squishy (+25% value boost)!
          </p>
        </div>

        {/* Fluff-o-Meter Bar */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-bold px-1">
            <span className="text-[#0284C7] flex items-center gap-1">
              <span>🫧</span> Fluffiness: {fluffPercent}%
            </span>
            <span className="text-[#EA580C]">⏱️ {timeLeft}s Left</span>
          </div>
          <div className="w-full bg-[#E0F2FE] h-3 rounded-full overflow-hidden border border-[#BAE6FD]">
            <div
              className="h-full bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] rounded-full transition-all duration-300"
              style={{ width: `${fluffPercent}%` }}
            />
          </div>
        </div>

        {/* Spa Interactive Tub Area */}
        <div className="relative w-full h-64 bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] rounded-3xl border-3 border-[#7DD3FC] flex items-center justify-center overflow-hidden shadow-inner">
          {/* Centered Squishy */}
          <div className={`transition-transform duration-300 ${fluffPercent >= 100 ? 'scale-110' : ''}`}>
            <SquishyRenderer
              shapeId={squishy.shapeId}
              colorId={squishy.colorId}
              faceId={squishy.faceId}
              accessoryIds={squishy.accessoryIds}
              packagingId={squishy.packagingId}
              rarity={squishy.rarity}
              size={130}
              interactive={true}
            />
          </div>

          {/* Floating Interactive Bubbles */}
          {!isFinished &&
            bubbles.map(bubble => (
              <button
                key={bubble.id}
                onClick={() => handlePopBubble(bubble.id)}
                className="absolute cursor-pointer transition-transform hover:scale-125 active:scale-90 animate-bounce"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  fontSize: `${bubble.size}px`,
                  lineHeight: 1,
                }}
              >
                {bubble.emoji}
              </button>
            ))}

          {/* Finished Overlay */}
          {isFinished && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 animate-fade-in">
              <span className="text-5xl animate-bounce">💖</span>
              <div className="font-display font-black text-xl text-[#0369A1]">
                SUPER FLUFFY! ✨
              </div>
              <p className="text-xs font-bold text-[#0284C7]">
                Value increased to 🪙 {Math.round(squishy.value * 1.25)} Coins!
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        {isFinished ? (
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-display font-bold text-sm rounded-2xl shadow-md cursor-pointer transition-all hover:scale-102"
          >
            Done & Relaxed! 🛁✨
          </button>
        ) : (
          <p className="text-xs text-[#0284C7] italic animate-pulse">
            Quick! Pop the bubbles around {squishy.name}!
          </p>
        )}
      </div>
    </div>
  );
};
