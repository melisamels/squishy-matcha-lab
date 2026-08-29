import React from 'react';
import {
  Home,
  FlaskConical,
  BookOpen,
  BedDouble,
  ShoppingBag,
  Store,
  Package,
  Target,
} from 'lucide-react';
import { audioService } from '../../services/audioService';

export type ScreenType =
  | 'dashboard'
  | 'lab'
  | 'collection'
  | 'room'
  | 'shop'
  | 'store'
  | 'inventory'
  | 'missions';

interface NavigationBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  unclaimedMissionsCount?: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  onNavigate,
  unclaimedMissionsCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard' as ScreenType, label: 'Matcha Lab', shortLabel: 'Home', icon: Home, emoji: '🏠' },
    { id: 'lab' as ScreenType, label: 'Squishy Lab', shortLabel: 'Lab', icon: FlaskConical, emoji: '🧪' },
    { id: 'collection' as ScreenType, label: 'Collection', shortLabel: 'Books', icon: BookOpen, emoji: '📖' },
    { id: 'room' as ScreenType, label: 'My Room', shortLabel: 'Room', icon: BedDouble, emoji: '🛏️' },
    { id: 'shop' as ScreenType, label: 'Squishy Shop', shortLabel: 'Shop', icon: ShoppingBag, emoji: '🛍️' },
    { id: 'store' as ScreenType, label: 'Material Store', shortLabel: 'Store', icon: Store, emoji: '🏪' },
    { id: 'inventory' as ScreenType, label: 'Inventory', shortLabel: 'Bag', icon: Package, emoji: '📦' },
    { id: 'missions' as ScreenType, label: 'Missions', shortLabel: 'Quests', icon: Target, emoji: '🎯', badge: unclaimedMissionsCount },
  ];

  const handleNav = (screenId: ScreenType) => {
    audioService.playClick();
    onNavigate(screenId);
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#FFFDF9] border-r-2 border-[#EFE5D8] p-4 gap-2 shrink-0 select-none min-h-[calc(100vh-62px)]">
        <div className="px-3 py-2 mb-2">
          <h2 className="font-display text-lg font-bold text-[#4A3E3D] flex items-center gap-2">
            <span>🍵</span> Matcha Lab
          </h2>
          <p className="text-xs text-[#8C7A6B]">Create • Collect • Decorate</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map(item => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#EAF3DE] text-[#3F6212] font-bold shadow-xs border-2 border-[#A8C686] translate-x-1'
                    : 'text-[#5C5046] hover:bg-[#F8F3EC] border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Small Cozy Quote at bottom */}
        <div className="mt-auto p-3 bg-[#F9F5EE] rounded-2xl border border-[#EBDCCB] text-center text-xs text-[#78685C]">
          <p className="font-medium">✨ Made with love & squishy joy! 🧸</p>
        </div>
      </aside>

      {/* Mobile / Tablet Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#FFFDF9]/95 backdrop-blur-md border-t-2 border-[#EFE5D8] px-2 py-2 flex items-center justify-around z-40 shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                isActive ? 'text-[#3F6212] font-bold scale-110' : 'text-[#7D6E61]'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
