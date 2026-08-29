import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { COLLECTION_ITEMS } from '../../data/collectionItems';
import { CollectionItem } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { audioService } from '../../services/audioService';
import { Sparkles, Trophy, Check, HelpCircle, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  'All',
  'Bunny',
  'Cat',
  'Food',
  'Animal',
  'Matcha',
  'Sweet',
  'Fantasy',
  'Legendary',
  'Secret',
] as const;

export const CollectionBook: React.FC = () => {
  const {
    discoveredCollection,
    claimedMilestones,
    claimMilestoneReward,
  } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectItem, setInspectItem] = useState<CollectionItem | null>(null);

  const totalDiscovered = Object.keys(discoveredCollection).length;
  const totalItems = COLLECTION_ITEMS.length; // 150
  const completionPercent = Math.round((totalDiscovered / totalItems) * 100);

  const filteredItems = COLLECTION_ITEMS.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getCategoryCount = (category: string) => {
    const items = COLLECTION_ITEMS.filter(i => category === 'All' || i.category === category);
    const discovered = items.filter(i => discoveredCollection[i.id]).length;
    return { discovered, total: items.length };
  };

  const milestones = [
    { percent: 10, reward: '500 Coins', label: '10%' },
    { percent: 25, reward: 'Matcha Bow 🎀', label: '25%' },
    { percent: 50, reward: 'Rainbow Color 🌈', label: '50%' },
    { percent: 75, reward: 'Unicorn Mold 🦄', label: '75%' },
    { percent: 100, reward: 'Secret Momo Squishy 👑', label: '100%' },
  ];

  const handleClaimMilestone = (p: number) => {
    audioService.playLevelUp();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
    claimMilestoneReward(p);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Header & Overall Progress Banner */}
      <div className="bg-gradient-to-r from-[#FFFDF9] via-[#F5EEDB] to-[#EAF3DE] p-6 rounded-3xl border-2 border-[#D6C5B2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#D6C5B2] text-xs font-bold text-[#78685C] w-fit mx-auto md:mx-0">
            <Sparkles size={14} className="text-[#F59E0B]" />
            Official Collector Catalog
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B342F]">
            📖 Squishy Collection Book
          </h1>
          <p className="text-xs md:text-sm text-[#7A6C60]">
            Complete your collection of 150 unique kawaii squishies to claim the Master Creator Crown!
          </p>
        </div>

        {/* Big Progress Dial / Counter */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border-2 border-[#D6C5B2] flex flex-col items-center gap-2 min-w-[200px] shadow-xs">
          <div className="text-xs font-semibold text-[#8C7A6B]">Total Collection</div>
          <div className="font-display font-bold text-2xl text-[#3F6212]">
            {totalDiscovered} / {totalItems}
          </div>
          <div className="w-full bg-[#EFE5D8] h-3 rounded-full overflow-hidden border border-[#D5C7B7]">
            <div
              className="h-full bg-gradient-to-r from-[#A8C686] to-[#65A30D] rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#65A30D]">{completionPercent}% Completed</span>
        </div>
      </div>

      {/* Milestone Rewards Row */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DCCF] shadow-xs flex flex-col gap-3">
        <h3 className="font-display font-bold text-sm text-[#4A3E3D] flex items-center gap-2">
          <Award size={16} className="text-[#F59E0B]" /> Collection Milestones
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {milestones.map(m => {
            const isUnlocked = completionPercent >= m.percent;
            const isClaimed = claimedMilestones.includes(m.percent);
            return (
              <div
                key={m.percent}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center gap-1.5 transition-all ${
                  isClaimed
                    ? 'bg-[#F0FDF4] border-[#86EFAC] opacity-80'
                    : isUnlocked
                    ? 'bg-[#FEF3C7] border-[#F59E0B] shadow-sm animate-pulse'
                    : 'bg-[#F9F5EE] border-[#E8DCCF] opacity-60'
                }`}
              >
                <div className="font-display font-bold text-xs text-[#3B342F]">{m.label} Goal</div>
                <div className="text-[11px] text-[#78350F] font-semibold">{m.reward}</div>
                {isClaimed ? (
                  <span className="text-[10px] font-bold text-[#16A34A] flex items-center gap-1">
                    <Check size={12} /> Claimed
                  </span>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleClaimMilestone(m.percent)}
                    className="px-3 py-1 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[10px] font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Claim!
                  </button>
                ) : (
                  <span className="text-[10px] text-[#8C7A6B]">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          const { discovered, total } = getCategoryCount(cat);
          return (
            <button
              key={cat}
              onClick={() => {
                audioService.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#7BA05B] text-white shadow-xs scale-105'
                  : 'bg-white border border-[#E8DCCF] text-[#5C5046] hover:bg-[#F9F5EE]'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {discovered}/{total}
              </span>
            </button>
          );
        })}
      </div>

      {/* 150 Collection Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {filteredItems.map(item => {
          const discoveryInfo = discoveredCollection[item.id];
          const isDiscovered = !!discoveryInfo;

          return (
            <div
              key={item.id}
              onClick={() => {
                audioService.playClick();
                setInspectItem(item);
              }}
              className={`group p-3.5 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-2 relative cursor-pointer ${
                isDiscovered
                  ? 'bg-white border-[#E5D7C5] hover:border-[#7BA05B] hover:shadow-md'
                  : 'bg-[#F9F5EE] border-[#E8DCCF] hover:border-[#CBBBA8]'
              }`}
            >
              {/* Rarity Star Pill */}
              <div className="flex items-center text-amber-400 text-[10px]">
                {Array.from({ length: Math.min(item.stars, 5) }).map((_, i) => (
                  <Star key={i} size={11} className="fill-amber-400" />
                ))}
                {item.stars === 6 && <span>💖</span>}
              </div>

              {/* Squishy Visual or Mystery Silhouette */}
              <div className="w-24 h-24 flex items-center justify-center relative">
                {isDiscovered ? (
                  <SquishyRenderer
                    shapeId={item.requiredTraits.shapeId || 'bunny'}
                    colorId={item.requiredTraits.colorId || 'matcha_green'}
                    faceId={item.requiredTraits.faceId || 'happy'}
                    accessoryIds={item.requiredTraits.accessoryId ? [item.requiredTraits.accessoryId] : []}
                    rarity={item.rarity}
                    size={90}
                    interactive={false}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#E5D7C5]/50 flex flex-col items-center justify-center text-[#8C7A6B] filter grayscale opacity-40">
                    <HelpCircle size={32} />
                  </div>
                )}
              </div>

              {/* Title & Status */}
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="font-display font-bold text-xs text-[#3B342F] line-clamp-1">
                  {isDiscovered ? item.name : '???'}
                </div>
                <div className="text-[10px] text-[#8C7A6B]">
                  {isDiscovered ? (
                    <span className="text-[#65A30D] font-semibold">Discovered ✓</span>
                  ) : (
                    <span>Hint Available</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Item Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-4 border-[#A8C686] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#65A30D] bg-[#EAF3DE] px-3 py-1 rounded-full">
              {inspectItem.category} Collection • {inspectItem.rarity}
            </div>

            {/* Visual */}
            <div className="p-4 bg-gradient-to-b from-[#FDF8F2] to-[#F5EADB] rounded-2xl border border-[#EADAC5] w-full flex items-center justify-center">
              {discoveredCollection[inspectItem.id] ? (
                <SquishyRenderer
                  shapeId={inspectItem.requiredTraits.shapeId || 'bunny'}
                  colorId={inspectItem.requiredTraits.colorId || 'matcha_green'}
                  faceId={inspectItem.requiredTraits.faceId || 'happy'}
                  accessoryIds={inspectItem.requiredTraits.accessoryId ? [inspectItem.requiredTraits.accessoryId] : []}
                  rarity={inspectItem.rarity}
                  size={120}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#E5D7C5]/50 flex flex-col items-center justify-center text-[#8C7A6B] filter grayscale opacity-40">
                  <HelpCircle size={40} />
                </div>
              )}
            </div>

            {/* Information */}
            <div>
              <h3 className="font-display font-bold text-lg text-[#3B342F]">
                {discoveredCollection[inspectItem.id] ? inspectItem.name : 'Unknown Squishy'}
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 italic">
                "{inspectItem.hint}"
              </p>
            </div>

            {discoveredCollection[inspectItem.id] && (
              <div className="w-full bg-white p-3 rounded-xl border border-[#E8DCCF] text-xs text-[#5C5046] flex flex-col gap-1 text-left">
                <div className="flex justify-between">
                  <span>Times Created:</span>
                  <span className="font-bold">{discoveredCollection[inspectItem.id].timesCreated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Value:</span>
                  <span className="font-bold text-[#B45309]">🪙 {discoveredCollection[inspectItem.id].bestValue} Coins</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setInspectItem(null)}
              className="w-full py-2.5 bg-[#7BA05B] text-white font-display font-bold rounded-xl shadow-xs cursor-pointer hover:bg-[#65A30D]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
