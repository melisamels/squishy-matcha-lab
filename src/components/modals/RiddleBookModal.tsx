import React, { useState } from 'react';
import { RIDDLES_DATA, RiddleItem } from '../../data/riddlesData';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import { X, Search, Lightbulb, CheckCircle2, Trophy, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RiddleBookModalProps {
  onClose: () => void;
  onGoToLab?: () => void;
}

export const RiddleBookModal: React.FC<RiddleBookModalProps> = ({ onClose, onGoToLab }) => {
  const {
    inventory,
    discoveredCollection,
    solvedRiddles,
    claimRiddleReward,
  } = useGameStore();

  const [activeRiddle, setActiveRiddle] = useState<RiddleItem>(RIDDLES_DATA[0]);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Check if player has created or currently possesses the answer
  const isAnswerDiscovered = (riddle: RiddleItem) => {
    // Check in discovered collection
    const inCollection = Object.keys(discoveredCollection).some(colId => {
      return (
        colId.toLowerCase().includes(riddle.requiredShapeId.toLowerCase()) ||
        colId.toLowerCase().includes(riddle.requiredColorId.toLowerCase())
      );
    });

    // Check in inventory
    const inInventory = inventory.some(s => {
      const matchShape = s.shapeId === riddle.requiredShapeId;
      const matchColor = s.colorId === riddle.requiredColorId;
      const matchAcc = !riddle.requiredAccessoryId || s.accessoryIds.includes(riddle.requiredAccessoryId);
      const matchScent = !riddle.requiredScentId || s.scentId === riddle.requiredScentId;
      return matchShape && matchColor && matchAcc && matchScent;
    });

    return inCollection || inInventory;
  };

  const isSolved = (riddleId: string) => solvedRiddles.includes(riddleId);

  const handleClaim = (riddle: RiddleItem) => {
    const success = claimRiddleReward(riddle.id, riddle.rewardCoins, riddle.rewardGems);
    if (success) {
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/65 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#C084FC] rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-5 my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FAF5FF] border-2 border-[#DDD6FE] rounded-2xl text-2xl">
              🕵️‍♀️
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#7C3AED] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full">
                <Sparkles size={13} /> MOMO'S SECRET COOKBOOK
              </div>
              <h3 className="font-display font-black text-xl text-[#3B342F]">
                Secret Recipe Riddles
              </h3>
              <p className="text-xs text-[#7A6C60]">
                Solved: <b>{solvedRiddles.length}</b> / {RIDDLES_DATA.length} Riddles
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Riddle Numbers Selector Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {RIDDLES_DATA.map(r => {
            const solved = isSolved(r.id);
            const isSelected = activeRiddle.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  audioService.playClick();
                  setActiveRiddle(r);
                  setShowHint(false);
                }}
                className={`min-w-[40px] h-10 rounded-2xl font-display font-black text-xs transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#7C3AED] text-white shadow-md scale-105'
                    : solved
                    ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]'
                    : 'bg-[#F9F5EE] text-[#7A6C60] border border-[#E8DCCF] hover:bg-[#F2EADB]'
                }`}
              >
                {solved ? '✓' : `#${r.number}`}
              </button>
            );
          })}
        </div>

        {/* Active Riddle Card */}
        <div className="bg-gradient-to-b from-[#FAF5FF] to-[#FFFDF9] border-2 border-[#DDD6FE] rounded-3xl p-5 md:p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#7C3AED] bg-white px-3 py-1 rounded-full border border-[#DDD6FE]">
              Riddle #{activeRiddle.number}: {activeRiddle.title}
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-[#92400E]">
              <span>🪙 +{activeRiddle.rewardCoins}</span>
              <span className="text-[#7C3AED]">💎 +{activeRiddle.rewardGems}</span>
            </div>
          </div>

          {/* Riddle Poem */}
          <div className="bg-white/90 p-4 rounded-2xl border border-[#E9D5FF] text-sm text-[#4C1D95] font-medium leading-relaxed italic shadow-2xs">
            "{activeRiddle.riddle}"
          </div>

          {/* Hint Section */}
          <div className="flex flex-col gap-2">
            {showHint ? (
              <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-xs text-[#92400E] flex items-center gap-2">
                <Lightbulb size={16} className="text-[#D97706] shrink-0" />
                <span><b>Momo's Hint:</b> {activeRiddle.hint}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  audioService.playPop();
                  setShowHint(true);
                }}
                className="w-fit text-xs text-[#7C3AED] hover:text-[#5B21B6] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb size={14} /> Need a clue? Reveal Momo's hint
              </button>
            )}
          </div>

          {/* Action / Solve Status */}
          <div className="pt-2 border-t border-[#DDD6FE] flex items-center justify-between">
            {isSolved(activeRiddle.id) ? (
              <span className="text-xs font-black text-[#16A34A] bg-[#DCFCE7] px-4 py-2 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Riddle Solved! Reward Claimed
              </span>
            ) : isAnswerDiscovered(activeRiddle) ? (
              <button
                onClick={() => handleClaim(activeRiddle)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-display font-black text-xs rounded-xl shadow-md animate-bounce cursor-pointer"
              >
                🎉 You Discovered "{activeRiddle.targetSquishyName}"! Claim Prize!
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7A6C60]">
                  Status: <b>Undiscovered Formula</b>
                </span>
                {onGoToLab && (
                  <button
                    onClick={() => {
                      onClose();
                      onGoToLab();
                    }}
                    className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Go to Lab to Craft
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
