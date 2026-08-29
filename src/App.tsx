import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/common/TitleScreen';
import { HeaderStats } from './components/common/HeaderStats';
import { NavigationBar, ScreenType } from './components/common/NavigationBar';
import { WorkshopDashboard } from './components/dashboard/WorkshopDashboard';
import { SquishyLab } from './components/lab/SquishyLab';
import { CollectionBook } from './components/collection/CollectionBook';
import { MyRoom } from './components/room/MyRoom';
import { SquishyShop } from './components/shop/SquishyShop';
import { MaterialStore } from './components/store/MaterialStore';
import { InventoryView } from './components/inventory/InventoryView';
import { MissionsView } from './components/missions/MissionsView';
import { SettingsModal } from './components/modals/SettingsModal';
import { DailyGiftModal } from './components/modals/DailyGiftModal';
import { MysteryBoxModal } from './components/modals/MysteryBoxModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { MasterCelebrationModal } from './components/ending/MasterCelebrationModal';
import { audioService } from './services/audioService';

export function App() {
  const {
    tutorialCompleted,
    dailyMissions,
    discoveredCollection,
    checkDailyLogin,
    bgmEnabled,
  } = useGameStore();

  const [currentScreen, setCurrentScreen] = useState<ScreenType | 'title'>('title');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDailyGiftOpen, setIsDailyGiftOpen] = useState(false);
  const [isMysteryBoxOpen, setIsMysteryBoxOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Check Daily Login on mount
  useEffect(() => {
    checkDailyLogin();
  }, [checkDailyLogin]);

  // Check 100% completion
  useEffect(() => {
    if (Object.keys(discoveredCollection).length >= 150) {
      setIsCelebrationOpen(true);
    }
  }, [discoveredCollection]);

  // Handle first interaction for AudioContext and BGM
  const ensureAudio = () => {
    if (bgmEnabled) {
      audioService.startBgm();
    }
  };

  const handleStartNewGame = () => {
    ensureAudio();
    setCurrentScreen('dashboard');
    if (!tutorialCompleted) {
      setIsTutorialOpen(true);
    }
  };

  const handleContinueGame = () => {
    ensureAudio();
    setCurrentScreen('dashboard');
  };

  const handleStartTutorialInLab = () => {
    setIsTutorialOpen(false);
    setCurrentScreen('lab');
  };

  const unclaimedMissionsCount = dailyMissions.filter(m => m.isCompleted && !m.isClaimed).length;

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col font-['Quicksand',sans-serif] text-[#4A3E3D]" onClick={ensureAudio}>
      {/* Title Screen or In-Game Layout */}
      {currentScreen === 'title' ? (
        <TitleScreen
          onStartGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onOpenCollection={() => setCurrentScreen('collection')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Top Header Stats */}
          <HeaderStats
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenDailyGift={() => setIsDailyGiftOpen(true)}
          />

          {/* Main Content Area with Navigation */}
          <div className="flex flex-1 relative">
            <NavigationBar
              currentScreen={currentScreen}
              onNavigate={(screen) => setCurrentScreen(screen)}
              unclaimedMissionsCount={unclaimedMissionsCount}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {currentScreen === 'dashboard' && (
                <WorkshopDashboard
                  onNavigate={(screen) => setCurrentScreen(screen)}
                  onOpenDailyGift={() => setIsDailyGiftOpen(true)}
                  onOpenMysteryBox={() => setIsMysteryBoxOpen(true)}
                />
              )}
              {currentScreen === 'lab' && (
                <SquishyLab onNavigate={(screen) => setCurrentScreen(screen)} />
              )}
              {currentScreen === 'collection' && <CollectionBook />}
              {currentScreen === 'room' && <MyRoom />}
              {currentScreen === 'shop' && <SquishyShop />}
              {currentScreen === 'store' && <MaterialStore />}
              {currentScreen === 'inventory' && (
                <InventoryView onNavigate={(screen) => setCurrentScreen(screen)} />
              )}
              {currentScreen === 'missions' && <MissionsView />}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isDailyGiftOpen && <DailyGiftModal onClose={() => setIsDailyGiftOpen(false)} />}
      {isMysteryBoxOpen && <MysteryBoxModal onClose={() => setIsMysteryBoxOpen(false)} />}
      {isTutorialOpen && <TutorialModal onStartTutorialInLab={handleStartTutorialInLab} />}
      {isCelebrationOpen && <MasterCelebrationModal onClose={() => setIsCelebrationOpen(false)} />}
    </div>
  );
}

export default App;
