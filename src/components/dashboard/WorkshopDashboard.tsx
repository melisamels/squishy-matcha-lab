import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { MomoMascot } from '../common/MomoMascot';
import { ScreenType } from '../common/NavigationBar';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { SquishyRenderer } from '../common/SquishyRenderer';

interface WorkshopDashboardProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenDailyGift: () => void;
  onOpenMysteryBox: () => void;
}

export const WorkshopDashboard: React.FC<WorkshopDashboardProps> = ({
  onNavigate,
  onOpenDailyGift,
  onOpenMysteryBox,
}) => {
  const {
    inventory,
    discoveredCollection,
    activeOrders,
    dailyMissions,
    coins,
  } = useGameStore();

  const totalDiscovered = Object.keys(discoveredCollection).length;
  const collectionPercent = Math.round((totalDiscovered / 150) * 100);

  const pendingMissions = dailyMissions.filter(m => m.isCompleted && !m.isClaimed).length;

  const handleCardClick = (screen: ScreenType) => {
    audioService.playClick();
    onNavigate(screen);
  };

  const latestSquishy = inventory[0];

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 select-none pb-20 lg:pb-8">
      {/* Welcome Banner with Momo */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#EBF5E0] via-[#FFFDF9] to-[#FCE7F3] p-6 md:p-8 rounded-3xl border-2 border-[#D6E8C2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Floating Ambient Sparkles */}
        <div className="absolute top-3 left-6 text-xl animate-float opacity-70">✨</div>
        <div className="absolute bottom-4 right-10 text-xl animate-float opacity-70" style={{ animationDelay: '1.5s' }}>🌸</div>
        <div className="absolute top-6 right-1/3 text-lg animate-wiggle opacity-60">🍵</div>

        <div className="flex flex-col gap-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-[#A8C686] text-xs font-bold text-[#4D7C0F] w-fit mx-auto md:mx-0">
            <Sparkles size={14} /> Official Matcha Workshop
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-[#3B342F] tracking-tight">
            Welcome to <span className="text-[#65A30D]">Matcha Lab</span>! 🍵
          </h1>
          <p className="text-sm md:text-base text-[#6B5E52] max-w-lg leading-relaxed">
            Create adorable squishies, complete your collection, decorate your cozy room, and fulfill customer shop orders!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
            <button
              onClick={() => handleCardClick('lab')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] text-white font-display font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🧪</span> Start Creating
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenMysteryBox}
              className="px-4 py-2.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-display font-bold rounded-2xl shadow-xs hover:bg-[#FDE68A] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🎁</span> Open Mystery Box
            </button>
          </div>
        </div>

        {/* Interactive Momo Mascot */}
        <div className="z-10 shrink-0">
          <MomoMascot size={130} />
        </div>
      </section>

      {/* Quick Status Pill Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => handleCardClick('inventory')}
          className="bg-white p-3.5 rounded-2xl border border-[#E8DCCF] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#7BA05B] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xl">
            📦
          </div>
          <div>
            <div className="text-xs text-[#8C7A6B] font-medium">Squishies Owned</div>
            <div className="font-display font-bold text-lg text-[#3B342F]">{inventory.length}</div>
          </div>
        </div>

        <div
          onClick={() => handleCardClick('collection')}
          className="bg-white p-3.5 rounded-2xl border border-[#E8DCCF] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#7BA05B] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center text-xl">
            📖
          </div>
          <div>
            <div className="text-xs text-[#8C7A6B] font-medium">Collection Book</div>
            <div className="font-display font-bold text-lg text-[#3B342F]">
              {totalDiscovered} / 150 ({collectionPercent}%)
            </div>
          </div>
        </div>

        <div
          onClick={() => handleCardClick('shop')}
          className="bg-white p-3.5 rounded-2xl border border-[#E8DCCF] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#7BA05B] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center text-xl">
            🛍️
          </div>
          <div>
            <div className="text-xs text-[#8C7A6B] font-medium">Customer Orders</div>
            <div className="font-display font-bold text-lg text-[#3B342F]">
              {activeOrders.length} Waiting
            </div>
          </div>
        </div>

        <div
          onClick={() => handleCardClick('missions')}
          className="bg-white p-3.5 rounded-2xl border border-[#E8DCCF] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#7BA05B] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center text-xl">
            🎯
          </div>
          <div>
            <div className="text-xs text-[#8C7A6B] font-medium">Daily Missions</div>
            <div className="font-display font-bold text-lg text-[#3B342F]">
              {pendingMissions > 0 ? `${pendingMissions} Claimable!` : 'In Progress'}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workshop Stations Grid */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-bold text-[#4A3E3D] flex items-center gap-2">
          <span>🏠</span> Workshop Stations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Station 1: Squishy Lab */}
          <div
            onClick={() => handleCardClick('lab')}
            className="group relative bg-white p-5 rounded-3xl border-2 border-[#D6E8C2] hover:border-[#8DAF66] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#EBF5E0] rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="z-10">
              <span className="text-4xl">🧪</span>
              <h3 className="font-display text-lg font-bold text-[#3B342F] mt-2 group-hover:text-[#65A30D] transition-colors">
                Squishy Lab
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 leading-relaxed">
                Choose shape, pastel color, sweet scent, cute faces, accessories and packaging!
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#65A30D]">Craft a new Squishy</span>
              <span className="text-sm font-bold text-[#65A30D] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Station 2: Collection Book */}
          <div
            onClick={() => handleCardClick('collection')}
            className="group relative bg-white p-5 rounded-3xl border-2 border-[#DDD6FE] hover:border-[#A78BFA] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5F3FF] rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="z-10">
              <span className="text-4xl">📖</span>
              <h3 className="font-display text-lg font-bold text-[#3B342F] mt-2 group-hover:text-[#7C3AED] transition-colors">
                Collection Book
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 leading-relaxed">
                Unlock all 150 unique squishies across 9 categories and claim milestone rewards!
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#7C3AED]">{totalDiscovered}/150 Discovered</span>
              <span className="text-sm font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Station 3: My Room */}
          <div
            onClick={() => handleCardClick('room')}
            className="group relative bg-white p-5 rounded-3xl border-2 border-[#FECDD3] hover:border-[#FB7185] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFF1F2] rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="z-10">
              <span className="text-4xl">🛏️</span>
              <h3 className="font-display text-lg font-bold text-[#3B342F] mt-2 group-hover:text-[#E11D48] transition-colors">
                My Room
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 leading-relaxed">
                Display your favorite squishies on shelves, desk, and bed. Customize wallpapers and rugs!
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#E11D48]">Decorate & Squish</span>
              <span className="text-sm font-bold text-[#E11D48] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Station 4: Squishy Shop & Orders */}
          <div
            onClick={() => handleCardClick('shop')}
            className="group relative bg-white p-5 rounded-3xl border-2 border-[#FED7AA] hover:border-[#FB923C] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFF7ED] rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="z-10">
              <span className="text-4xl">🛍️</span>
              <h3 className="font-display text-lg font-bold text-[#3B342F] mt-2 group-hover:text-[#EA580C] transition-colors">
                Squishy Shop
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 leading-relaxed">
                Sell your creations for coins and satisfy visiting customers (Mimi, Lulu, Boba) for bonus XP!
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#EA580C]">{activeOrders.length} Customer Orders</span>
              <span className="text-sm font-bold text-[#EA580C] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Station 5: Material Store */}
          <div
            onClick={() => handleCardClick('store')}
            className="group relative bg-white p-5 rounded-3xl border-2 border-[#BBF7D0] hover:border-[#4ADE80] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F0FDF4] rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="z-10">
              <span className="text-4xl">🏪</span>
              <h3 className="font-display text-lg font-bold text-[#3B342F] mt-2 group-hover:text-[#16A34A] transition-colors">
                Material Store
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 leading-relaxed">
                Unlock new shapes (Panda, Whale, Unicorn), special colors (Galaxy, Rainbow), and royal accessories!
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#16A34A]">Browse Materials</span>
              <span className="text-sm font-bold text-[#16A34A] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Station 6: Inventory Bag */}
          <div
            onClick={() => handleCardClick('inventory')}
            className="group relative bg-white p-5 rounded-3xl border-2 border-[#BAE6FD] hover:border-[#38BDF8] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F0F9FF] rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="z-10">
              <span className="text-4xl">📦</span>
              <h3 className="font-display text-lg font-bold text-[#3B342F] mt-2 group-hover:text-[#0284C7] transition-colors">
                Inventory
              </h3>
              <p className="text-xs text-[#7A6C60] mt-1 leading-relaxed">
                Inspect, rename, squish, and manage all the handmade squishies currently in your collection bag.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#0284C7]">{inventory.length} In Bag</span>
              <span className="text-sm font-bold text-[#0284C7] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Showcase Squishy (if any) */}
      {latestSquishy && (
        <section className="bg-white p-5 rounded-3xl border border-[#E8DCCF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#FDF8F2] rounded-2xl border border-[#F2E8DC]">
              <SquishyRenderer
                shapeId={latestSquishy.shapeId}
                colorId={latestSquishy.colorId}
                faceId={latestSquishy.faceId}
                accessoryIds={latestSquishy.accessoryIds}
                packagingId={latestSquishy.packagingId}
                rarity={latestSquishy.rarity}
                size={80}
              />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5E0] text-[#3F6212] mb-1">
                Latest Creation
              </div>
              <h4 className="font-display font-bold text-base text-[#3B342F]">
                {latestSquishy.name}
              </h4>
              <p className="text-xs text-[#8C7A6B]">
                {latestSquishy.rarity} • Worth {latestSquishy.value} Coins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCardClick('room')}
              className="px-4 py-2 bg-[#FDF8F2] border border-[#E5D7C5] hover:bg-[#F7EFE6] text-xs font-bold text-[#4A3E3D] rounded-xl transition-all cursor-pointer"
            >
              Display in Room
            </button>
            <button
              onClick={() => handleCardClick('shop')}
              className="px-4 py-2 bg-[#FEF3C7] border border-[#FDE68A] hover:bg-[#FDE68A] text-xs font-bold text-[#92400E] rounded-xl transition-all cursor-pointer"
            >
              Sell in Shop
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
