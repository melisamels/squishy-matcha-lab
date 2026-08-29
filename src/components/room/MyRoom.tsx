import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Squishy, RoomSlot } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { audioService } from '../../services/audioService';
import { Sparkles, Palette, Plus, Heart, Trash2, X } from 'lucide-react';

export const MyRoom: React.FC = () => {
  const {
    roomSlots,
    roomDecorations,
    inventory,
    coins,
    placeSquishyInRoom,
    removeSquishyFromRoom,
    toggleFavoriteSquishy,
    equipDecoration,
    buyDecoration,
  } = useGameStore();

  const [activeSlotToAssign, setActiveSlotToAssign] = useState<RoomSlot | null>(null);
  const [inspectSlotSquishy, setInspectSlotSquishy] = useState<{ slot: RoomSlot; squishy: Squishy } | null>(null);
  const [showDecorModal, setShowDecorModal] = useState(false);
  const [selectedDecorCategory, setSelectedDecorCategory] = useState<'wallpaper' | 'floor' | 'rug' | 'bed' | 'desk'>('wallpaper');

  // Equipped Room Decor Colors
  const equippedWallpaper = roomDecorations.find(d => d.category === 'wallpaper' && d.isEquipped) || roomDecorations[0];
  const equippedFloor = roomDecorations.find(d => d.category === 'floor' && d.isEquipped) || roomDecorations[7];
  const equippedRug = roomDecorations.find(d => d.category === 'rug' && d.isEquipped);

  const handleSlotClick = (slot: RoomSlot) => {
    audioService.playClick();
    if (slot.squishyId) {
      const squishy = inventory.find(s => s.uniqueId === slot.squishyId);
      if (squishy) {
        setInspectSlotSquishy({ slot, squishy });
      }
    } else {
      setActiveSlotToAssign(slot);
    }
  };

  const handleAssignSquishy = (squishy: Squishy) => {
    if (!activeSlotToAssign) return;
    placeSquishyInRoom(activeSlotToAssign.id, squishy.uniqueId);
    setActiveSlotToAssign(null);
  };

  const handleRemoveFromSlot = () => {
    if (!inspectSlotSquishy) return;
    removeSquishyFromRoom(inspectSlotSquishy.slot.id);
    setInspectSlotSquishy(null);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Room Header */}
      <div className="bg-gradient-to-r from-[#FCE7F3] via-[#FFFDF9] to-[#EBF5E0] p-6 rounded-3xl border-2 border-[#FBCFE8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#FBCFE8] text-xs font-bold text-[#BE123C] w-fit mx-auto md:mx-0">
            <Sparkles size={14} /> Personal Cozy Suite
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B342F]">
            🛏️ My Squishy Room
          </h1>
          <p className="text-xs md:text-sm text-[#7A6C60]">
            Display your handmade squishy treasures on shelves, desk, and bed. Squish them anytime!
          </p>
        </div>

        <button
          onClick={() => {
            audioService.playClick();
            setShowDecorModal(true);
          }}
          className="px-5 py-2.5 bg-white border-2 border-[#F472B6] text-[#BE123C] font-display font-bold text-xs rounded-2xl hover:bg-[#FFF1F2] shadow-xs cursor-pointer flex items-center gap-2"
        >
          <Palette size={16} /> Customize Decor
        </button>
      </div>

      {/* Interactive Illustrated Room Canvas */}
      <div
        className="relative w-full min-h-[500px] md:min-h-[580px] rounded-3xl border-4 border-[#E5D7C5] shadow-lg p-6 md:p-8 overflow-hidden flex flex-col justify-between"
        style={{
          backgroundColor: equippedWallpaper.previewColor,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 80%)`,
        }}
      >
        {/* Ambient Wall Decor Elements */}
        <div className="absolute top-4 left-6 flex items-center gap-3 opacity-80 pointer-events-none">
          <div className="w-16 h-20 bg-white/70 rounded-xl border-2 border-[#D6C5B2] shadow-xs p-1 flex items-center justify-center text-xs">
            🖼️ Poster
          </div>
          <div className="w-14 h-14 bg-white/70 rounded-full border-2 border-[#D6C5B2] shadow-xs flex items-center justify-center text-lg">
            ⏰
          </div>
        </div>

        {/* Ambient Window */}
        <div className="absolute top-4 right-8 w-24 h-32 bg-[#E0F2FE]/80 rounded-t-full border-4 border-white shadow-md pointer-events-none flex flex-col items-center justify-center text-2xl">
          ☁️
        </div>

        {/* TOP ROW: Shelves & Window Shelf */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 pt-8">
          {roomSlots.slice(0, 4).map(slot => {
            const squishy = inventory.find(s => s.uniqueId === slot.squishyId);
            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className="bg-white/85 backdrop-blur-xs p-3 rounded-2xl border-2 border-[#D6C5B2] hover:border-[#7BA05B] shadow-sm flex flex-col items-center justify-center gap-2 min-h-[140px] cursor-pointer group transition-transform hover:scale-102"
              >
                <span className="text-[11px] font-bold text-[#8C7A6B]">{slot.positionName}</span>
                {squishy ? (
                  <div className="flex flex-col items-center">
                    <SquishyRenderer
                      shapeId={squishy.shapeId}
                      colorId={squishy.colorId}
                      faceId={squishy.faceId}
                      accessoryIds={squishy.accessoryIds}
                      packagingId={squishy.packagingId}
                      rarity={squishy.rarity}
                      size={80}
                    />
                    <span className="text-[10px] font-bold text-[#3B342F] truncate max-w-[100px] mt-1">
                      {squishy.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#8C7A6B] group-hover:text-[#65A30D]">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#D6C5B2] group-hover:border-[#65A30D] flex items-center justify-center">
                      <Plus size={18} />
                    </div>
                    <span className="text-[10px]">Empty Slot</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM FLOOR WITH FURNITURE & SLOTS */}
        <div
          className="relative mt-8 p-6 rounded-2xl border-t-4 border-[#C9B6A1] grid grid-cols-2 md:grid-cols-4 gap-4 z-10"
          style={{ backgroundColor: equippedFloor.previewColor }}
        >
          {equippedRug && (
            <div
              className="absolute inset-x-8 inset-y-4 rounded-3xl opacity-60 pointer-events-none border-2 border-white"
              style={{ backgroundColor: equippedRug.previewColor }}
            />
          )}

          {roomSlots.slice(4, 8).map(slot => {
            const squishy = inventory.find(s => s.uniqueId === slot.squishyId);
            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border-2 border-[#D6C5B2] hover:border-[#7BA05B] shadow-sm flex flex-col items-center justify-center gap-2 min-h-[140px] cursor-pointer group transition-transform hover:scale-102 z-10"
              >
                <span className="text-[11px] font-bold text-[#8C7A6B]">{slot.positionName}</span>
                {squishy ? (
                  <div className="flex flex-col items-center">
                    <SquishyRenderer
                      shapeId={squishy.shapeId}
                      colorId={squishy.colorId}
                      faceId={squishy.faceId}
                      accessoryIds={squishy.accessoryIds}
                      packagingId={squishy.packagingId}
                      rarity={squishy.rarity}
                      size={80}
                    />
                    <span className="text-[10px] font-bold text-[#3B342F] truncate max-w-[100px] mt-1">
                      {squishy.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#8C7A6B] group-hover:text-[#65A30D]">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#D6C5B2] group-hover:border-[#65A30D] flex items-center justify-center">
                      <Plus size={18} />
                    </div>
                    <span className="text-[10px]">Empty Slot</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assign Squishy Modal */}
      {activeSlotToAssign && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#A8C686] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base text-[#3B342F]">
                Place Squishy on {activeSlotToAssign.positionName}
              </div>
              <button onClick={() => setActiveSlotToAssign(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {inventory.length === 0 ? (
                <div className="text-xs text-[#8C7A6B] py-6 text-center">
                  No squishies in your inventory! Go to Squishy Lab to craft one.
                </div>
              ) : (
                inventory.map(s => (
                  <div
                    key={s.uniqueId}
                    onClick={() => handleAssignSquishy(s)}
                    className="p-3 bg-[#FDF8F2] hover:bg-[#EAF3DE] rounded-2xl border border-[#E8DCCF] hover:border-[#7BA05B] flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <SquishyRenderer
                        shapeId={s.shapeId}
                        colorId={s.colorId}
                        faceId={s.faceId}
                        accessoryIds={s.accessoryIds}
                        size={50}
                        interactive={false}
                      />
                      <div>
                        <div className="font-display font-bold text-xs text-[#3B342F]">{s.name}</div>
                        <div className="text-[10px] text-[#8C7A6B]">{s.rarity}</div>
                      </div>
                    </div>

                    <button className="px-3 py-1 bg-[#7BA05B] text-white text-xs font-bold rounded-xl shadow-xs">
                      Place Here
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inspect Displayed Squishy Modal */}
      {inspectSlotSquishy && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#FBCFE8] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="text-xs font-bold text-[#BE123C] bg-[#FFF1F2] px-3 py-1 rounded-full border border-[#FECDD3]">
              Displayed on {inspectSlotSquishy.slot.positionName}
            </div>

            <div className="p-4 bg-[#FDF8F2] rounded-2xl border border-[#F5EADB]">
              <SquishyRenderer
                shapeId={inspectSlotSquishy.squishy.shapeId}
                colorId={inspectSlotSquishy.squishy.colorId}
                faceId={inspectSlotSquishy.squishy.faceId}
                accessoryIds={inspectSlotSquishy.squishy.accessoryIds}
                packagingId={inspectSlotSquishy.squishy.packagingId}
                rarity={inspectSlotSquishy.squishy.rarity}
                size={130}
              />
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-[#3B342F]">
                {inspectSlotSquishy.squishy.name}
              </h3>
              <p className="text-xs text-[#8C7A6B]">
                {inspectSlotSquishy.squishy.rarity} • Worth {inspectSlotSquishy.squishy.value} Coins
              </p>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  toggleFavoriteSquishy(inspectSlotSquishy.squishy.uniqueId);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  inspectSlotSquishy.squishy.isFavorite
                    ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]'
                    : 'bg-[#F9F5EE] border-[#E8DCCF] text-[#5C5046]'
                }`}
              >
                <Heart size={14} className={inspectSlotSquishy.squishy.isFavorite ? 'fill-[#BE123C]' : ''} />
                {inspectSlotSquishy.squishy.isFavorite ? 'Favorited' : 'Favorite'}
              </button>

              <button
                onClick={handleRemoveFromSlot}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 size={14} /> Remove Slot
              </button>
            </div>

            <button
              onClick={() => setInspectSlotSquishy(null)}
              className="w-full py-2 bg-[#F9F5EE] text-xs font-bold text-[#5C5046] rounded-xl hover:bg-[#EFE5D8] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Decor Selector Modal */}
      {showDecorModal && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#D6C5B2] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base text-[#3B342F]">
                Room Customization
              </div>
              <button onClick={() => setShowDecorModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 border-b border-[#E8DCCF] pb-2">
              {(['wallpaper', 'floor', 'rug'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    audioService.playClick();
                    setSelectedDecorCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedDecorCategory === cat
                      ? 'bg-[#7BA05B] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
              {roomDecorations
                .filter(d => d.category === selectedDecorCategory)
                .map(decor => (
                  <div
                    key={decor.id}
                    className="p-3 rounded-2xl border flex items-center justify-between gap-3 bg-[#FDF8F2]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl border border-white shadow-xs"
                        style={{ backgroundColor: decor.previewColor }}
                      />
                      <div>
                        <div className="font-display font-bold text-xs text-[#3B342F]">{decor.name}</div>
                        <div className="text-[10px] text-[#8C7A6B]">{decor.theme} Theme</div>
                      </div>
                    </div>

                    {decor.isEquipped ? (
                      <span className="text-xs font-bold text-[#16A34A] px-2.5 py-1 bg-green-50 rounded-lg">
                        Equipped ✓
                      </span>
                    ) : decor.isUnlocked ? (
                      <button
                        onClick={() => equipDecoration(decor.id)}
                        className="px-3 py-1 bg-[#7BA05B] hover:bg-[#65A30D] text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Equip
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const ok = buyDecoration(decor.id);
                          if (!ok) audioService.playPop();
                        }}
                        disabled={coins < decor.price}
                        className={`px-3 py-1 text-xs font-bold rounded-xl cursor-pointer ${
                          coins >= decor.price
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        🪙 {decor.price}
                      </button>
                    )}
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowDecorModal(false)}
              className="w-full py-2 bg-[#F9F5EE] text-xs font-bold text-[#5C5046] rounded-xl hover:bg-[#EFE5D8] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
