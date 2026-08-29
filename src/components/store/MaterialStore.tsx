import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SHAPES_DATA } from '../../data/shapes';
import { COLORS_DATA } from '../../data/colors';
import { FACES_DATA } from '../../data/faces';
import { ACCESSORIES_DATA } from '../../data/accessories';
import { SCENTS_DATA } from '../../data/scents';
import { PACKAGING_DATA } from '../../data/packaging';
import { audioService } from '../../services/audioService';
import { Store, Check, Lock, Sparkles } from 'lucide-react';

type StoreCategory = 'shapes' | 'colors' | 'faces' | 'accessories' | 'scents' | 'packaging';

export const MaterialStore: React.FC = () => {
  const {
    coins,
    level,
    unlockedShapes,
    unlockedColors,
    unlockedFaces,
    unlockedAccessories,
    unlockedScents,
    unlockedPackaging,
    buyMaterial,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<StoreCategory>('shapes');

  const categories: { id: StoreCategory; label: string; emoji: string }[] = [
    { id: 'shapes', label: 'Shapes', emoji: '🐰' },
    { id: 'colors', label: 'Colors', emoji: '🎨' },
    { id: 'faces', label: 'Faces', emoji: '😊' },
    { id: 'accessories', label: 'Accessories', emoji: '🎀' },
    { id: 'scents', label: 'Scents', emoji: '🌸' },
    { id: 'packaging', label: 'Boxes & Bags', emoji: '📦' },
  ];

  const getCategoryItems = () => {
    switch (activeCategory) {
      case 'shapes':
        return SHAPES_DATA.map(i => ({
          ...i,
          isOwned: unlockedShapes.includes(i.id),
        }));
      case 'colors':
        return COLORS_DATA.map(i => ({
          ...i,
          isOwned: unlockedColors.includes(i.id),
          emoji: '🎨',
        }));
      case 'faces':
        return FACES_DATA.map(i => ({
          ...i,
          isOwned: unlockedFaces.includes(i.id),
        }));
      case 'accessories':
        return ACCESSORIES_DATA.map(i => ({
          ...i,
          isOwned: unlockedAccessories.includes(i.id),
        }));
      case 'scents':
        return SCENTS_DATA.map(i => ({
          ...i,
          isOwned: unlockedScents.includes(i.id),
        }));
      case 'packaging':
        return PACKAGING_DATA.map(i => ({
          ...i,
          isOwned: unlockedPackaging.includes(i.id),
        }));
    }
  };

  const items = getCategoryItems();

  const handleBuy = (itemId: string, price: number, unlockLevel: number) => {
    if (coins < price) {
      audioService.playPop();
      return;
    }
    buyMaterial(activeCategory, itemId, price);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-[#F0FDF4] via-[#FFFDF9] to-[#FEF9C3] p-6 rounded-3xl border-2 border-[#BBF7D0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#BBF7D0] text-xs font-bold text-[#16A34A] w-fit mx-auto md:mx-0">
            <Store size={14} /> Official Matcha Lab Material Depot
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B342F]">
            🏪 Material Store
          </h1>
          <p className="text-xs md:text-sm text-[#7A6C60]">
            Use your hard-earned coins to unlock new squishy molds, rare colors, crowns, and collector boxes!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#FDE68A] shadow-xs">
          <span className="text-xl">🪙</span>
          <span className="font-display font-bold text-base text-[#B45309]">
            {coins.toLocaleString()} Coins
          </span>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                audioService.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#16A34A] text-white shadow-xs scale-105'
                  : 'bg-white border border-[#E8DCCF] text-[#5C5046] hover:bg-[#F9F5EE]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Material Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => {
          const isLevelLocked = level < item.unlockLevel && !item.isOwned;
          const canBuy = coins >= item.price && !isLevelLocked;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between gap-3 bg-white ${
                item.isOwned
                  ? 'border-[#E2E8F0] opacity-80'
                  : isLevelLocked
                  ? 'border-[#E8DCCF] bg-[#FAF7F2]'
                  : 'border-[#BBF7D0] hover:border-[#16A34A] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                {activeCategory === 'colors' ? (
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-white shadow-xs shrink-0"
                    style={{
                      background:
                        item.type === 'gradient'
                          ? `linear-gradient(135deg, ${item.secondaryHex}, ${item.hex})`
                          : item.hex,
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF8F2] border border-[#F2E8DC] flex items-center justify-center text-2xl shrink-0">
                    {item.emoji}
                  </div>
                )}

                <div>
                  <div className="font-display font-bold text-sm text-[#3B342F]">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#8C7A6B]">
                    {item.isOwned
                      ? 'Unlocked & Owned'
                      : isLevelLocked
                      ? `Unlocks at Level ${item.unlockLevel}`
                      : 'Available to buy'}
                  </div>
                </div>
              </div>

              <div>
                {item.isOwned ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                    <Check size={14} /> Owned
                  </span>
                ) : isLevelLocked ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#9CA3AF] bg-gray-100 px-3 py-1.5 rounded-xl">
                    <Lock size={12} /> Lv.{item.unlockLevel}
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item.id, item.price || 200, item.unlockLevel)}
                    disabled={!canBuy}
                    className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      canBuy
                        ? 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>🪙</span> {item.price || 200}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
