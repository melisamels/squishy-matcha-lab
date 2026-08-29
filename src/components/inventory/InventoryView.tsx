import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Squishy, Rarity } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { audioService } from '../../services/audioService';
import { Package, Search, Heart, Edit2, ArrowUpDown, Filter } from 'lucide-react';
import { ScreenType } from '../common/NavigationBar';

interface InventoryViewProps {
  onNavigate: (screen: ScreenType) => void;
  onShareSquishy?: (squishy: Squishy) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onNavigate, onShareSquishy }) => {
  const { inventory, toggleFavoriteSquishy, renameSquishy } = useGameStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'value'>('newest');

  const [selectedSquishy, setSelectedSquishy] = useState<Squishy | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const filteredSquishies = inventory
    .filter(s => {
      if (onlyFavorites && !s.isFavorite) return false;
      if (selectedRarityFilter !== 'all' && s.rarity !== selectedRarityFilter) return false;
      if (searchQuery.trim() && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'value') return b.value - a.value;
      return 0;
    });

  const handleInspect = (squishy: Squishy) => {
    audioService.playClick();
    setSelectedSquishy(squishy);
    setTempName(squishy.name);
    setEditingName(false);
  };

  const handleSaveRename = () => {
    if (!selectedSquishy) return;
    renameSquishy(selectedSquishy.uniqueId, tempName);
    setSelectedSquishy({ ...selectedSquishy, name: tempName });
    setEditingName(false);
    audioService.playClick();
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#F0F9FF] via-[#FFFDF9] to-[#E0F2FE] p-6 rounded-3xl border-2 border-[#BAE6FD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#BAE6FD] text-xs font-bold text-[#0284C7] w-fit mx-auto md:mx-0">
            <Package size={14} /> Personal Squishy Collection Bag
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B342F]">
            📦 Inventory ({inventory.length} Squishies)
          </h1>
          <p className="text-xs md:text-sm text-[#7A6C60]">
            Browse your handcrafted creations, favorite your best squishies, and inspect their details.
          </p>
        </div>

        <button
          onClick={() => onNavigate('lab')}
          className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-display font-bold text-xs rounded-2xl shadow-xs cursor-pointer transition-all hover:scale-105"
        >
          + Craft New Squishy
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DCCF] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Field */}
        <div className="flex items-center gap-2 bg-[#F9F5EE] px-3 py-2 rounded-2xl border border-[#E8DCCF] w-full sm:w-64">
          <Search size={16} className="text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Search squishy name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#3B342F] focus:outline-none w-full"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Favorites filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              onlyFavorites
                ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]'
                : 'bg-white border-[#E8DCCF] text-[#5C5046]'
            }`}
          >
            <Heart size={14} className={onlyFavorites ? 'fill-[#BE123C]' : ''} />
            Favorites
          </button>

          {/* Rarity selector */}
          <select
            value={selectedRarityFilter}
            onChange={e => setSelectedRarityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#E8DCCF] text-[#5C5046] cursor-pointer focus:outline-none"
          >
            <option value="all">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
            <option value="Secret">Secret</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#E8DCCF] text-[#5C5046] cursor-pointer focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="value">Highest Value</option>
          </select>
        </div>
      </div>

      {/* Squishies Grid */}
      {filteredSquishies.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E8DCCF] text-center flex flex-col items-center gap-3">
          <span className="text-5xl">🎒</span>
          <h3 className="font-display font-bold text-lg text-[#3B342F]">
            No squishies match your search
          </h3>
          <p className="text-xs text-[#8C7A6B]">
            Try clearing filters or craft a brand new squishy in the Squishy Lab!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSquishies.map(squishy => (
            <div
              key={squishy.uniqueId}
              onClick={() => handleInspect(squishy)}
              className="bg-white p-3.5 rounded-3xl border-2 border-[#E8DCCF] hover:border-[#7BA05B] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 relative cursor-pointer group"
            >
              {/* Favorite button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleFavoriteSquishy(squishy.uniqueId);
                }}
                className="absolute top-2.5 right-2.5 p-1 rounded-full text-gray-400 hover:text-red-500 z-10"
              >
                <Heart
                  size={16}
                  className={squishy.isFavorite ? 'fill-[#BE123C] text-[#BE123C]' : ''}
                />
              </button>

              <div className="w-24 h-24 flex items-center justify-center">
                <SquishyRenderer
                  shapeId={squishy.shapeId}
                  colorId={squishy.colorId}
                  faceId={squishy.faceId}
                  accessoryIds={squishy.accessoryIds}
                  packagingId={squishy.packagingId}
                  rarity={squishy.rarity}
                  size={85}
                  interactive={false}
                />
              </div>

              <div className="w-full flex flex-col items-center">
                <div className="font-display font-bold text-xs text-[#3B342F] truncate max-w-full">
                  {squishy.name}
                </div>
                <div className="text-[10px] text-[#8C7A6B]">{squishy.rarity}</div>
                <div className="text-[11px] font-bold text-[#B45309] mt-1">
                  🪙 {squishy.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Modal */}
      {selectedSquishy && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-4 border-[#BAE6FD] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="p-4 bg-gradient-to-b from-[#FDF8F2] to-[#F5EADB] rounded-2xl border border-[#EADAC5] w-full flex items-center justify-center">
              <SquishyRenderer
                shapeId={selectedSquishy.shapeId}
                colorId={selectedSquishy.colorId}
                faceId={selectedSquishy.faceId}
                accessoryIds={selectedSquishy.accessoryIds}
                packagingId={selectedSquishy.packagingId}
                rarity={selectedSquishy.rarity}
                size={130}
              />
            </div>

            {/* Title / Rename */}
            {editingName ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  maxLength={24}
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="px-3 py-1 bg-white border border-[#0284C7] rounded-xl text-center font-display font-bold text-sm w-full"
                />
                <button
                  onClick={handleSaveRename}
                  className="px-3 py-1 bg-[#0284C7] text-white text-xs font-bold rounded-xl"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-[#3B342F]">
                  {selectedSquishy.name}
                </h3>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}

            <div className="w-full bg-white p-3 rounded-2xl border border-[#E8DCCF] text-xs text-[#5C5046] flex flex-col gap-1 text-left">
              <div className="flex justify-between">
                <span>Rarity:</span>
                <span className="font-bold">{selectedSquishy.rarity}</span>
              </div>
              <div className="flex justify-between">
                <span>Appraised Value:</span>
                <span className="font-bold text-[#B45309]">🪙 {selectedSquishy.value} Coins</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-[#16A34A]">
                  {selectedSquishy.isDisplayed ? 'Displayed in Room' : 'In Backpack'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  onNavigate('room');
                  setSelectedSquishy(null);
                }}
                className="flex-1 py-2 bg-[#FDF8F2] border border-[#E5D7C5] hover:bg-[#F7EFE6] text-xs font-bold text-[#4A3E3D] rounded-xl cursor-pointer"
              >
                Go to Room
              </button>
              <button
                onClick={() => {
                  onNavigate('shop');
                  setSelectedSquishy(null);
                }}
                className="flex-1 py-2 bg-[#FEF3C7] border border-[#FDE68A] hover:bg-[#FDE68A] text-xs font-bold text-[#92400E] rounded-xl cursor-pointer"
              >
                Sell in Shop
              </button>
            </div>

            {onShareSquishy && (
              <button
                onClick={() => {
                  audioService.playClick();
                  onShareSquishy(selectedSquishy);
                  setSelectedSquishy(null);
                }}
                className="w-full py-2 bg-[#EAF3DE] border border-[#A8C686] hover:bg-[#D6E8C2] text-xs font-bold text-[#3F6212] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>💌</span> Share Squishy Card
              </button>
            )}

            <button
              onClick={() => setSelectedSquishy(null)}
              className="w-full py-2 bg-[#F9F5EE] text-xs font-bold text-[#5C5046] rounded-xl hover:bg-[#EFE5D8] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
