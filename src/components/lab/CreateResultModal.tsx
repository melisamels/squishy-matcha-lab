import React, { useState, useEffect } from 'react';
import { Squishy } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { SHAPES_DATA } from '../../data/shapes';
import { COLORS_DATA } from '../../data/colors';
import { FACES_DATA } from '../../data/faces';
import { ACCESSORIES_DATA } from '../../data/accessories';
import { SCENTS_DATA } from '../../data/scents';
import { PACKAGING_DATA } from '../../data/packaging';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { Sparkles, Edit2, Check, Star } from 'lucide-react';

interface CreateResultModalProps {
  squishy: Squishy;
  onClose: () => void;
  onGoToRoom: () => void;
  onSellImmediately: (uniqueId: string) => void;
}

export const CreateResultModal: React.FC<CreateResultModalProps> = ({
  squishy,
  onClose,
  onGoToRoom,
  onSellImmediately,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(squishy.name);

  const { renameSquishy } = useGameStore();

  useEffect(() => {
    // Sound & Confetti celebration
    if (['Epic', 'Legendary', 'Secret'].includes(squishy.rarity)) {
      audioService.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A8C686', '#FFAAC9', '#FBBF24', '#C084FC', '#38BDF8'],
        });
      } catch (e) {}
    } else {
      audioService.playSparkle();
    }
  }, [squishy.rarity]);

  const shapeName = SHAPES_DATA.find(s => s.id === squishy.shapeId)?.name || squishy.shapeId;
  const colorName = COLORS_DATA.find(c => c.id === squishy.colorId)?.name || squishy.colorId;
  const faceName = FACES_DATA.find(f => f.id === squishy.faceId)?.name || squishy.faceId;
  const accessoryNames = squishy.accessoryIds
    .map(id => ACCESSORIES_DATA.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ');
  const scentName = SCENTS_DATA.find(s => s.id === squishy.scentId)?.name || squishy.scentId;
  const packagingName = PACKAGING_DATA.find(p => p.id === squishy.packagingId)?.name || squishy.packagingId;

  const handleSaveName = () => {
    renameSquishy(squishy.uniqueId, editedName);
    setIsEditingName(false);
    audioService.playClick();
  };

  const getRarityBadgeStyle = () => {
    switch (squishy.rarity) {
      case 'Common':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Uncommon':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Rare':
        return 'bg-blue-100 text-blue-700 border-blue-300 shadow-blue-200 shadow-sm';
      case 'Epic':
        return 'bg-purple-100 text-purple-700 border-purple-300 shadow-purple-200 shadow-sm animate-pulse';
      case 'Legendary':
        return 'bg-amber-100 text-amber-800 border-amber-400 shadow-amber-200 shadow-md font-extrabold';
      case 'Secret':
        return 'bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-purple-900 border-purple-400 shadow-md animate-glow font-extrabold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/75 backdrop-blur-sm flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="bg-[#FFFDF9] border-4 border-[#A8C686] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-5 my-auto">
        {/* Header Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#65A30D] bg-[#EAF3DE] px-3 py-1 rounded-full">
            <Sparkles size={14} /> NEW SQUISHY CREATED!
          </div>

          {/* Editable Name */}
          <div className="flex items-center justify-center gap-2 mt-1">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={24}
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  className="px-3 py-1 bg-white border-2 border-[#7BA05B] rounded-xl text-center font-display font-bold text-lg text-[#3B342F] focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 bg-[#7BA05B] text-white rounded-xl hover:bg-[#65A30D]"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl md:text-2xl font-bold text-[#3B342F]">
                  {editedName}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[#8C7A6B] hover:text-[#3B342F] p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                  title="Rename Squishy"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Rarity & Star Rating */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: Math.min(squishy.stars, 5) }).map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400" />
              ))}
              {squishy.stars === 6 && <span className="text-pink-500 font-bold ml-1">💖</span>}
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getRarityBadgeStyle()}`}
            >
              {squishy.rarity.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Squishy Visual Display */}
        <div className="relative p-6 bg-gradient-to-b from-[#FDF8F2] to-[#F5EADB] rounded-3xl border-2 border-[#EADAC5] w-full flex items-center justify-center shadow-inner">
          <SquishyRenderer
            shapeId={squishy.shapeId}
            colorId={squishy.colorId}
            faceId={squishy.faceId}
            accessoryIds={squishy.accessoryIds}
            packagingId={squishy.packagingId}
            rarity={squishy.rarity}
            size={160}
            showPackaging={true}
          />
        </div>

        {/* Traits Breakdown Card */}
        <div className="w-full bg-white rounded-2xl p-3.5 border border-[#E8DCCF] text-xs text-[#5C5046] flex flex-col gap-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-[#8C7A6B]">Shape:</span>
            <span className="font-bold text-[#3B342F]">{shapeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C7A6B]">Color:</span>
            <span className="font-bold text-[#3B342F]">{colorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C7A6B]">Face:</span>
            <span className="font-bold text-[#3B342F]">{faceName}</span>
          </div>
          {accessoryNames && (
            <div className="flex justify-between">
              <span className="text-[#8C7A6B]">Accessories:</span>
              <span className="font-bold text-[#3B342F]">{accessoryNames}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#8C7A6B]">Scent:</span>
            <span className="font-bold text-[#3B342F]">{scentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C7A6B]">Packaging:</span>
            <span className="font-bold text-[#3B342F]">{packagingName}</span>
          </div>
        </div>

        {/* Value and XP Rewards */}
        <div className="w-full flex items-center justify-around bg-[#FFF6E5] border border-[#FDE68A] rounded-2xl py-2 px-4 text-[#92400E]">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🪙</span>
            <span className="font-display font-bold text-sm">{squishy.value} Coins</span>
          </div>
          <div className="h-4 w-px bg-[#FDE68A]" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">✨</span>
            <span className="font-display font-bold text-sm">+{squishy.xpReward} XP</span>
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="w-full grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="py-2.5 px-2 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] text-white font-display font-bold rounded-2xl text-xs md:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Keep in Bag
          </button>
          <button
            onClick={() => {
              audioService.playClick();
              onGoToRoom();
            }}
            className="py-2.5 px-2 bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] font-display font-bold rounded-2xl text-xs md:text-sm hover:bg-[#FFE4E6] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Display Room
          </button>
          <button
            onClick={() => {
              audioService.playCoin();
              onSellImmediately(squishy.uniqueId);
            }}
            className="py-2.5 px-2 bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-display font-bold rounded-2xl text-xs md:text-sm hover:bg-[#FDE68A] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Sell Now
          </button>
        </div>
      </div>
    </div>
  );
};
