import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Squishy, CustomerOrder } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { audioService } from '../../services/audioService';
import { ShoppingBag, Sparkles, Clock, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SquishyShop: React.FC = () => {
  const {
    inventory,
    activeOrders,
    coins,
    sellSquishy,
    fulfillOrder,
    refreshOrders,
  } = useGameStore();

  const [sellConfirmSquishy, setSellConfirmSquishy] = useState<Squishy | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  const handleConfirmSell = () => {
    if (!sellConfirmSquishy) return;
    sellSquishy(sellConfirmSquishy.uniqueId);
    setSellConfirmSquishy(null);
  };

  const handleFulfillOrderWithSquishy = (order: CustomerOrder, squishy: Squishy) => {
    const success = fulfillOrder(order.id, squishy.uniqueId);
    if (success) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      setSelectedOrder(null);
    }
  };

  // Find which squishies in inventory match an order's requirements
  const getMatchingSquishiesForOrder = (order: CustomerOrder) => {
    return inventory.filter(s => {
      const req = order.requirements;
      if (req.shapeId && s.shapeId !== req.shapeId) return false;
      if (req.colorId && s.colorId !== req.colorId) return false;
      if (req.scentId && s.scentId !== req.scentId) return false;
      return true;
    });
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF7ED] via-[#FFFDF9] to-[#FEF3C7] p-6 rounded-3xl border-2 border-[#FED7AA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#FED7AA] text-xs font-bold text-[#EA580C] w-fit mx-auto md:mx-0">
            <ShoppingBag size={14} /> Official Matcha Lab Marketplace
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B342F]">
            🛍️ Squishy Shop & Orders
          </h1>
          <p className="text-xs md:text-sm text-[#7A6C60]">
            Sell handmade squishies and fulfill custom requests for Mimi, Lulu, Coco, Boba & friends!
          </p>
        </div>

        <button
          onClick={() => {
            audioService.playPop();
            refreshOrders();
          }}
          className="px-4 py-2 bg-white border-2 border-[#FED7AA] text-[#C2410C] font-display font-bold text-xs rounded-2xl hover:bg-[#FFF7ED] shadow-xs cursor-pointer"
        >
          🔄 New Customers
        </button>
      </div>

      {/* Customer Orders Section */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-[#4A3E3D] flex items-center gap-2">
          <span>💌</span> Active Customer Orders (Up to 3)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeOrders.map((order, idx) => {
            const matches = getMatchingSquishiesForOrder(order);
            return (
              <div
                key={order.id}
                className="bg-white p-5 rounded-3xl border-2 border-[#FDE68A] shadow-xs flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A]">
                      {order.customerAvatar}
                    </span>
                    <div>
                      <div className="text-[10px] font-bold text-[#B45309]">ORDER #{idx + 1}</div>
                      <div className="font-display font-bold text-base text-[#3B342F]">
                        {order.customerName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#8C7A6B] bg-[#F9F5EE] px-2 py-0.5 rounded-full">
                    <Clock size={12} /> 25m
                  </div>
                </div>

                <p className="text-xs text-[#6B5E52] italic bg-[#FFFBEB] p-2.5 rounded-xl border border-[#FEF3C7]">
                  "{order.dialog}"
                </p>

                {/* Requirement tags */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {order.requirements.shapeId && (
                    <span className="px-2 py-0.5 bg-[#EAF3DE] text-[#3F6212] font-semibold rounded-lg">
                      Shape: {order.requirements.shapeId}
                    </span>
                  )}
                  {order.requirements.colorId && (
                    <span className="px-2 py-0.5 bg-[#FCE7F3] text-[#BE123C] font-semibold rounded-lg">
                      Color: {order.requirements.colorId.replace('_', ' ')}
                    </span>
                  )}
                  {order.requirements.scentId && (
                    <span className="px-2 py-0.5 bg-[#EDE9FE] text-[#6D28D9] font-semibold rounded-lg">
                      Scent: {order.requirements.scentId}
                    </span>
                  )}
                </div>

                {/* Rewards & Fulfill Button */}
                <div className="pt-2 border-t border-[#FDE68A] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-[#B45309]">🪙 +{order.rewardCoins}</span>
                    <span className="text-[#65A30D]">✨ +{order.rewardXp} XP</span>
                  </div>

                  <button
                    onClick={() => {
                      audioService.playClick();
                      setSelectedOrder(order);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                      matches.length > 0
                        ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-xs'
                        : 'bg-[#F3EFE9] text-[#A89F91]'
                    }`}
                  >
                    {matches.length > 0 ? `Deliver (${matches.length})` : 'Check Bag'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory Selling Section */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-[#4A3E3D] flex items-center gap-2">
          <span>📦</span> Sell from Your Bag ({inventory.length})
        </h2>

        {inventory.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#E8DCCF] text-center flex flex-col items-center gap-3">
            <span className="text-4xl">🧸</span>
            <div className="font-display font-bold text-base text-[#3B342F]">
              Your inventory is empty!
            </div>
            <p className="text-xs text-[#8C7A6B] max-w-sm">
              Head to the Squishy Lab to craft adorable squishies, then return here to sell them for coins!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div
                key={item.uniqueId}
                className="bg-white p-4 rounded-3xl border border-[#E8DCCF] hover:border-[#7BA05B] shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="p-2 bg-[#FDF8F2] rounded-2xl border border-[#F5EADB] shrink-0">
                  <SquishyRenderer
                    shapeId={item.shapeId}
                    colorId={item.colorId}
                    faceId={item.faceId}
                    accessoryIds={item.accessoryIds}
                    packagingId={item.packagingId}
                    rarity={item.rarity}
                    size={70}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm text-[#3B342F] truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#8C7A6B]">{item.rarity}</div>
                  <div className="font-display font-bold text-xs text-[#B45309] mt-0.5">
                    🪙 {item.value} Coins
                  </div>
                </div>

                <button
                  onClick={() => {
                    audioService.playClick();
                    setSellConfirmSquishy(item);
                  }}
                  className="px-3.5 py-2 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-display font-bold text-xs rounded-xl hover:bg-[#FDE68A] transition-all shrink-0 cursor-pointer"
                >
                  Sell
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sell Confirmation Modal */}
      {sellConfirmSquishy && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#FED7AA] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4">
            <span className="text-4xl">🪙</span>
            <div>
              <h4 className="font-display font-bold text-lg text-[#3B342F]">
                Confirm Sale
              </h4>
              <p className="text-xs text-[#7A6C60] mt-1.5 leading-relaxed">
                Sell <span className="font-bold text-[#3B342F]">{sellConfirmSquishy.name}</span> for{' '}
                <span className="font-bold text-[#B45309]">🪙 {sellConfirmSquishy.value} Coins</span>?
              </p>
              <p className="text-[11px] text-[#16A34A] mt-1">
                (It will always stay discovered in your Collection Book!)
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setSellConfirmSquishy(null)}
                className="flex-1 py-2.5 bg-[#F9F5EE] border border-[#E8DCCF] text-[#5C5046] font-bold text-xs rounded-xl hover:bg-[#EFE5D8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSell}
                className="flex-1 py-2.5 bg-[#F59E0B] text-white font-display font-bold text-xs rounded-xl hover:bg-[#D97706] shadow-xs cursor-pointer"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deliver Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#FDE68A] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base text-[#3B342F]">
                Fulfill Order for {selectedOrder.customerName} {selectedOrder.customerAvatar}
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#7A6C60] italic bg-[#FEF3C7] p-2.5 rounded-xl border border-[#FDE68A]">
              "{selectedOrder.dialog}"
            </p>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              <div className="text-xs font-bold text-[#4A3E3D]">Matching Squishies in Your Bag:</div>
              {getMatchingSquishiesForOrder(selectedOrder).length === 0 ? (
                <div className="text-xs text-[#8C7A6B] py-4 text-center">
                  No matching squishies found in your bag. Craft one in the Squishy Lab!
                </div>
              ) : (
                getMatchingSquishiesForOrder(selectedOrder).map(match => (
                  <div
                    key={match.uniqueId}
                    className="p-3 bg-[#FDF8F2] rounded-2xl border border-[#E8DCCF] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <SquishyRenderer
                        shapeId={match.shapeId}
                        colorId={match.colorId}
                        faceId={match.faceId}
                        accessoryIds={match.accessoryIds}
                        size={50}
                      />
                      <div>
                        <div className="font-display font-bold text-xs text-[#3B342F]">
                          {match.name}
                        </div>
                        <div className="text-[10px] text-[#B45309]">
                          Worth {match.value} + {selectedOrder.rewardCoins} bonus coins!
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFulfillOrderWithSquishy(selectedOrder, match)}
                      className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-display font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Deliver
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2 bg-[#F9F5EE] border border-[#E8DCCF] text-xs font-bold text-[#5C5046] rounded-xl hover:bg-[#EFE5D8] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
