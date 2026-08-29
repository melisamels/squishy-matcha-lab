import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Squishy,
  CustomerOrder,
  RoomSlot,
  RoomDecoration,
  Mission,
  Achievement,
  DailyGiftDay,
  Rarity,
} from '../types/game';
import { COLLECTION_ITEMS } from '../data/collectionItems';
import { INITIAL_DAILY_MISSIONS, LONGTERM_MISSIONS } from '../data/missionsData';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import { DAILY_REWARDS_DATA } from '../data/dailyRewards';
import { ROOM_DECORATIONS } from '../data/roomDecorations';
import { CUSTOMERS_DATA } from '../data/customers';
import { determineRarityAndSecret, calculateSquishyValueAndXp } from '../services/rarityEngine';
import { generateSquishyName } from '../services/nameGenerator';
import { SHAPES_DATA } from '../data/shapes';
import { COLORS_DATA } from '../data/colors';
import { FACES_DATA } from '../data/faces';
import { ACCESSORIES_DATA } from '../data/accessories';
import { SCENTS_DATA } from '../data/scents';
import { audioService } from '../services/audioService';

interface CreationParams {
  shapeId: string;
  colorId: string;
  faceId: string;
  accessoryIds: string[];
  scentId: string;
  packagingId: string;
  customName?: string;
  isMagicMachine?: boolean;
  qualityMultiplier?: number;
  isPerfectSquish?: boolean;
}

interface GameState {
  // Player Profile
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  dailyStreak: number;
  lastLoginDate: string;
  tutorialCompleted: boolean;
  tutorialStep: number;
  saveIndicator: boolean;

  // Unlocked Materials
  unlockedShapes: string[];
  unlockedColors: string[];
  unlockedFaces: string[];
  unlockedAccessories: string[];
  unlockedScents: string[];
  unlockedPackaging: string[];

  // Inventory & Collection
  inventory: Squishy[];
  discoveredCollection: Record<
    string,
    { firstDiscoveredAt: number; timesCreated: number; bestValue: number }
  >;
  claimedMilestones: number[]; // e.g. [10, 25, 50, 75, 100]

  // Room
  roomSlots: RoomSlot[];
  roomDecorations: RoomDecoration[];

  // Shop & Orders
  activeOrders: CustomerOrder[];

  // Missions & Achievements
  dailyMissions: Mission[];
  longtermMissions: Mission[];
  dailyAllBonusClaimed: boolean;
  achievements: Achievement[];

  // Daily Rewards
  dailyRewards: DailyGiftDay[];
  lastClaimedDailyGiftDate: string | null;

  // Challenge & Skill Systems
  perfectSquishesCount: number;
  comboStreak: number;
  factoryDailyScore: number;
  solvedRiddles: string[];

  // Settings
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  language: 'en' | 'id';

  // Actions
  createSquishy: (params: CreationParams) => Squishy | null;
  sellSquishy: (uniqueId: string) => number;
  fulfillOrder: (orderId: string, squishyUniqueId: string, tipBonus?: number) => boolean;
  resetCombo: () => void;
  claimRiddleReward: (riddleId: string, coins: number, gems: number) => boolean;
  buffSquishyFluffy: (uniqueId: string) => void;
  refreshOrders: () => void;
  placeSquishyInRoom: (slotId: string, squishyUniqueId: string) => void;
  removeSquishyFromRoom: (slotId: string) => void;
  toggleFavoriteSquishy: (uniqueId: string) => void;
  renameSquishy: (uniqueId: string, newName: string) => void;
  buyMaterial: (
    category: 'shapes' | 'colors' | 'faces' | 'accessories' | 'scents' | 'packaging',
    itemId: string,
    price: number,
    isGems?: boolean
  ) => boolean;
  equipDecoration: (decorId: string) => void;
  buyDecoration: (decorId: string) => boolean;
  claimMissionReward: (missionId: string) => void;
  claimDailyAllBonus: () => void;
  claimAchievement: (achId: string) => void;
  claimDailyGift: (dayIndex: number) => { type: string; value: any; name: string } | null;
  openMysteryBox: () => { type: 'coins' | 'gems' | 'accessory' | 'color'; value: any; label: string };
  claimMilestoneReward: (percentage: number) => void;
  completeTutorialStep: (step: number) => void;
  finishTutorial: () => void;
  updateSettings: (settings: Partial<{
    bgmEnabled: boolean;
    sfxEnabled: boolean;
    bgmVolume: number;
    sfxVolume: number;
    language: 'en' | 'id';
  }>) => void;
  checkDailyLogin: () => void;
  triggerSaveIndicator: () => void;
  resetGame: () => void;
}

const INITIAL_ROOM_SLOTS: RoomSlot[] = [
  { id: 'slot_shelf1', name: 'Top Shelf', positionName: 'Shelf 1', squishyId: null },
  { id: 'slot_shelf2', name: 'Middle Shelf', positionName: 'Shelf 2', squishyId: null },
  { id: 'slot_desk', name: 'Study Desk', positionName: 'Desk', squishyId: null },
  { id: 'slot_bed', name: 'Cozy Bedside', positionName: 'Bed', squishyId: null },
  { id: 'slot_window', name: 'Window Sill', positionName: 'Window Shelf', squishyId: null },
  { id: 'slot_cabinet', name: 'Glass Cabinet', positionName: 'Display Cabinet', squishyId: null },
  { id: 'slot_table', name: 'Tea Table', positionName: 'Side Table', squishyId: null },
  { id: 'slot_rug', name: 'Plush Rug', positionName: 'Cozy Rug', squishyId: null },
];

function calculateXpNeeded(level: number): number {
  return 100 + (level - 1) * 75;
}

export function getPlayerTitle(level: number): string {
  if (level >= 50) return 'Legendary Matcha Lab';
  if (level >= 30) return 'Super Squishy Factory';
  if (level >= 20) return 'Dream Factory';
  if (level >= 10) return 'Squishy Studio';
  if (level >= 5) return 'Matcha Workshop';
  return 'Tiny Squishy Lab';
}

function generateInitialOrders(): CustomerOrder[] {
  const customers = [...CUSTOMERS_DATA].sort(() => 0.5 - Math.random()).slice(0, 3);
  const now = Date.now();

  return customers.map((cust, idx) => {
    const randomReqs = [
      { shapeId: 'bunny', colorId: 'matcha_green', scentId: 'matcha' },
      { shapeId: 'cat', colorId: 'strawberry_pink', scentId: 'strawberry' },
      { shapeId: 'strawberry', scentId: 'strawberry' },
      { shapeId: 'croissant', scentId: 'vanilla' },
      { colorId: 'matcha_green' },
      { colorId: 'strawberry_pink' },
    ];
    const picked = randomReqs[Math.floor(Math.random() * randomReqs.length)];

    return {
      id: `order_${now}_${idx}`,
      customerName: cust.name,
      customerAvatar: cust.avatar,
      dialog: cust.greeting,
      requirements: picked,
      rewardCoins: 350 + Math.floor(Math.random() * 250),
      rewardXp: 40 + Math.floor(Math.random() * 30),
      expiresAt: now + (20 + idx * 5) * 60 * 1000, // 20-30 min
    };
  });
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Starting Profile
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      coins: 2000,
      gems: 5,
      dailyStreak: 1,
      lastLoginDate: new Date().toDateString(),
      tutorialCompleted: false,
      tutorialStep: 0,
      saveIndicator: false,

      // Starting Unlocked Materials
      unlockedShapes: ['bunny', 'cat', 'strawberry'],
      unlockedColors: ['matcha_green', 'strawberry_pink', 'milk_white', 'vanilla_cream'],
      unlockedFaces: ['happy', 'shy', 'sleepy'],
      unlockedAccessories: ['pink_bow', 'sakura_flower', 'matcha_leaf'],
      unlockedScents: ['matcha', 'strawberry', 'vanilla'],
      unlockedPackaging: ['basic_bag', 'cute_box'],

      // Inventory & Collection
      inventory: [],
      discoveredCollection: {},
      claimedMilestones: [],

      // Room
      roomSlots: INITIAL_ROOM_SLOTS,
      roomDecorations: ROOM_DECORATIONS,

      // Shop
      activeOrders: generateInitialOrders(),

      // Missions & Achievements
      dailyMissions: INITIAL_DAILY_MISSIONS,
      longtermMissions: LONGTERM_MISSIONS,
      dailyAllBonusClaimed: false,
      achievements: ACHIEVEMENTS_DATA,

      // Daily Rewards
      dailyRewards: DAILY_REWARDS_DATA,
      lastClaimedDailyGiftDate: null,

      // Challenge & Skill Systems
      perfectSquishesCount: 0,
      comboStreak: 0,
      factoryDailyScore: 0,
      solvedRiddles: [],

      // Settings
      bgmEnabled: true,
      sfxEnabled: true,
      bgmVolume: 0.25,
      sfxVolume: 0.4,
      language: 'en',

      triggerSaveIndicator: () => {
        set({ saveIndicator: true });
        setTimeout(() => set({ saveIndicator: false }), 1500);
      },

      createSquishy: (params) => {
        const state = get();
        const cost = params.isMagicMachine ? 500 : 120;

        if (state.coins < cost) {
          return null;
        }

        // Deduct coins
        const newCoins = state.coins - cost;

        // Determine Rarity & Secret Match
        let { rarity, matchedSecretRecipe } = determineRarityAndSecret({
          shapeId: params.shapeId,
          colorId: params.colorId,
          faceId: params.faceId,
          accessoryIds: params.accessoryIds,
          scentId: params.scentId,
          packagingId: params.packagingId,
          isMagicMachine: params.isMagicMachine,
          isPerfectSquish: params.isPerfectSquish,
        });

        // First Tutorial Guaranteed Result
        if (!state.tutorialCompleted && state.tutorialStep === 0) {
          rarity = 'Rare';
          matchedSecretRecipe = {
            id: 'sec_10',
            name: 'Momo Matcha Bunny',
            targetCollectionId: 'col_secret_01',
            rarity: 'Rare',
            shapeId: 'bunny',
            colorId: 'matcha_green',
            faceId: 'happy',
            accessoryIds: ['pink_bow'],
            scentId: 'matcha',
            description: 'The beloved signature tutorial squishy crafted together with Momo!',
            hint: 'Momo guidance recipe',
          };
        }

        // Calculate Value and XP
        const { value, xp: xpEarned, stars } = calculateSquishyValueAndXp(
          params.shapeId,
          rarity,
          params.packagingId,
          params.accessoryIds.length,
          params.qualityMultiplier || 1.0
        );

        // Generate Cute Name
        const shapeObj = SHAPES_DATA.find(s => s.id === params.shapeId);
        const colorObj = COLORS_DATA.find(c => c.id === params.colorId);
        const faceObj = FACES_DATA.find(f => f.id === params.faceId);
        const accessoryObj = ACCESSORIES_DATA.find(a => params.accessoryIds.includes(a.id));
        const scentObj = SCENTS_DATA.find(s => s.id === params.scentId);

        let finalName = params.customName?.trim() || '';
        if (!finalName) {
          if (matchedSecretRecipe) {
            finalName = matchedSecretRecipe.name;
          } else {
            finalName = generateSquishyName({
              shapeName: shapeObj?.name || 'Squishy',
              colorName: colorObj?.name || 'Pastel',
              faceStyle: faceObj?.style || 'happy',
              accessoryName: accessoryObj?.name,
              scentName: scentObj?.name || 'Sweet',
            });
          }
        }

        const uniqueId = `sq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const targetCollectionId = matchedSecretRecipe?.targetCollectionId;

        const newSquishy: Squishy = {
          id: params.shapeId,
          uniqueId,
          name: finalName,
          shapeId: params.shapeId,
          colorId: params.colorId,
          faceId: params.faceId,
          accessoryIds: params.accessoryIds,
          scentId: params.scentId,
          packagingId: params.packagingId,
          rarity,
          stars,
          value,
          xpReward: xpEarned,
          createdAt: Date.now(),
          isFavorite: false,
          isDisplayed: false,
          collectionId: targetCollectionId,
        };

        // Update Collection Catalog
        const newDiscovered = { ...state.discoveredCollection };
        // Check if matching any collection item
        const catalogMatch =
          COLLECTION_ITEMS.find(c => c.id === targetCollectionId) ||
          COLLECTION_ITEMS.find(c => {
            const req = c.requiredTraits;
            if (req.shapeId && req.shapeId !== params.shapeId) return false;
            if (req.colorId && req.colorId !== params.colorId) return false;
            if (req.faceId && req.faceId !== params.faceId) return false;
            if (req.scentId && req.scentId !== params.scentId) return false;
            if (req.accessoryId && !params.accessoryIds.includes(req.accessoryId)) return false;
            return true;
          });

        if (catalogMatch) {
          const prev = newDiscovered[catalogMatch.id];
          newDiscovered[catalogMatch.id] = {
            firstDiscoveredAt: prev?.firstDiscoveredAt || Date.now(),
            timesCreated: (prev?.timesCreated || 0) + 1,
            bestValue: Math.max(prev?.bestValue || 0, value),
          };
        }

        // Add XP & check level up
        let newXp = state.xp + xpEarned;
        let newLevel = state.level;
        let nextLevelXp = state.xpToNextLevel;

        while (newXp >= nextLevelXp) {
          newXp -= nextLevelXp;
          newLevel += 1;
          nextLevelXp = calculateXpNeeded(newLevel);
          audioService.playLevelUp();
        }

        // Update Missions & Achievements progress
        const updatedDailyMissions = state.dailyMissions.map(m => {
          let count = m.currentCount;
          if (m.category === 'create') count += 1;
          if (m.category === 'matcha' && params.colorId === 'matcha_green') count += 1;
          return {
            ...m,
            currentCount: count,
            isCompleted: count >= m.targetCount,
          };
        });

        const updatedLongterm = state.longtermMissions.map(m => {
          let count = m.currentCount;
          if (m.id === 'long_create_25') count += 1;
          if (m.id === 'long_rare_10' && ['Rare', 'Epic', 'Legendary', 'Secret'].includes(rarity)) count += 1;
          if (m.id === 'long_bunny_5' && params.shapeId === 'bunny') count += 1;
          if (m.id === 'long_legendary_1' && ['Legendary', 'Secret'].includes(rarity)) count += 1;
          return {
            ...m,
            currentCount: count,
            isCompleted: count >= m.targetCount,
          };
        });

        const updatedAchievements = state.achievements.map(a => {
          let prog = a.progress;
          if (a.id === 'ach_first_squish') prog += 1;
          if (a.id === 'ach_artist') prog += 1;
          if (a.id === 'ach_matcha_lover' && params.colorId === 'matcha_green') prog += 1;
          if (a.id === 'ach_bunny_fan' && params.shapeId === 'bunny') prog += 1;
          if (a.id === 'ach_rare_hunter' && ['Rare', 'Epic', 'Legendary', 'Secret'].includes(rarity)) prog += 1;
          if (a.id === 'ach_epic_creator' && rarity === 'Epic') prog += 1;
          if (a.id === 'ach_legendary_maker' && rarity === 'Legendary') prog += 1;
          if (a.id === 'ach_secret_finder' && rarity === 'Secret') prog += 1;
          return {
            ...a,
            progress: prog,
            isUnlocked: prog >= a.target,
          };
        });

        const addedScore = params.isPerfectSquish ? 60 : (params.qualityMultiplier && params.qualityMultiplier > 1 ? 35 : 15);

        set({
          coins: newCoins,
          level: newLevel,
          xp: newXp,
          xpToNextLevel: nextLevelXp,
          inventory: [newSquishy, ...state.inventory],
          discoveredCollection: newDiscovered,
          dailyMissions: updatedDailyMissions,
          longtermMissions: updatedLongterm,
          achievements: updatedAchievements,
          perfectSquishesCount: params.isPerfectSquish ? state.perfectSquishesCount + 1 : state.perfectSquishesCount,
          factoryDailyScore: state.factoryDailyScore + addedScore,
        });

        get().triggerSaveIndicator();
        return newSquishy;
      },

      sellSquishy: (uniqueId) => {
        const state = get();
        const squishy = state.inventory.find(s => s.uniqueId === uniqueId);
        if (!squishy) return 0;

        const earned = squishy.value;

        // Remove from room slots if displayed
        const newSlots = state.roomSlots.map(slot =>
          slot.squishyId === uniqueId ? { ...slot, squishyId: null } : slot
        );

        // Update missions for selling
        const updatedDaily = state.dailyMissions.map(m => {
          if (m.category === 'sell') {
            const count = m.currentCount + 1;
            return { ...m, currentCount: count, isCompleted: count >= m.targetCount };
          }
          return m;
        });

        const updatedLongterm = state.longtermMissions.map(m => {
          if (m.id === 'long_earn_10000') {
            const count = m.currentCount + earned;
            return { ...m, currentCount: count, isCompleted: count >= m.targetCount };
          }
          return m;
        });

        set({
          coins: state.coins + earned,
          inventory: state.inventory.filter(s => s.uniqueId !== uniqueId),
          roomSlots: newSlots,
          dailyMissions: updatedDaily,
          longtermMissions: updatedLongterm,
        });

        audioService.playCoin();
        get().triggerSaveIndicator();
        return earned;
      },

      fulfillOrder: (orderId, squishyUniqueId, tipBonus = 0) => {
        const state = get();
        const order = state.activeOrders.find(o => o.id === orderId);
        const squishy = state.inventory.find(s => s.uniqueId === squishyUniqueId);
        if (!order || !squishy) return false;

        // Check requirements
        const req = order.requirements;
        if (req.shapeId && squishy.shapeId !== req.shapeId) return false;
        if (req.colorId && squishy.colorId !== req.colorId) return false;
        if (req.scentId && squishy.scentId !== req.scentId) return false;

        // Combo multiplier
        const currentCombo = state.comboStreak;
        const comboMultiplier = currentCombo >= 3 ? 2.0 : currentCombo >= 2 ? 1.5 : currentCombo >= 1 ? 1.25 : 1.0;

        // Fulfill reward with tip and combo
        const baseEarned = squishy.value + order.rewardCoins + tipBonus;
        const earnedCoins = Math.round(baseEarned * comboMultiplier);
        const earnedXp = Math.round(order.rewardXp * comboMultiplier);

        let newXp = state.xp + earnedXp;
        let newLevel = state.level;
        let nextLevelXp = state.xpToNextLevel;

        while (newXp >= nextLevelXp) {
          newXp -= nextLevelXp;
          newLevel += 1;
          nextLevelXp = calculateXpNeeded(newLevel);
          audioService.playLevelUp();
        }

        // Remove order and squishy
        const remainingOrders = state.activeOrders.filter(o => o.id !== orderId);
        const remainingInventory = state.inventory.filter(s => s.uniqueId !== squishyUniqueId);

        // Update slots
        const newSlots = state.roomSlots.map(slot =>
          slot.squishyId === squishyUniqueId ? { ...slot, squishyId: null } : slot
        );

        // Longterm mission for orders
        const updatedLongterm = state.longtermMissions.map(m => {
          if (m.id === 'long_orders_15') {
            const count = m.currentCount + 1;
            return { ...m, currentCount: count, isCompleted: count >= m.targetCount };
          }
          return m;
        });

        set({
          coins: state.coins + earnedCoins,
          level: newLevel,
          xp: newXp,
          xpToNextLevel: nextLevelXp,
          activeOrders: remainingOrders,
          inventory: remainingInventory,
          roomSlots: newSlots,
          longtermMissions: updatedLongterm,
          comboStreak: currentCombo + 1,
          factoryDailyScore: state.factoryDailyScore + 40,
        });

        audioService.playCoin();
        get().triggerSaveIndicator();
        return true;
      },

      resetCombo: () => {
        set({ comboStreak: 0 });
      },

      claimRiddleReward: (riddleId: string, rewardCoins: number, rewardGems: number) => {
        const state = get();
        if (state.solvedRiddles.includes(riddleId)) return false;

        set({
          coins: state.coins + rewardCoins,
          gems: state.gems + rewardGems,
          solvedRiddles: [...state.solvedRiddles, riddleId],
          factoryDailyScore: state.factoryDailyScore + 75,
        });

        audioService.playLevelUp();
        get().triggerSaveIndicator();
        return true;
      },

      buffSquishyFluffy: (uniqueId: string) => {
        const state = get();
        const updatedInventory = state.inventory.map(s => {
          if (s.uniqueId === uniqueId) {
            const buffedValue = Math.round(s.value * 1.25);
            const buffedName = s.name.endsWith('✨') ? s.name : `${s.name} ✨`;
            return { ...s, value: buffedValue, name: buffedName };
          }
          return s;
        });

        set({
          inventory: updatedInventory,
          coins: state.coins + 50,
          factoryDailyScore: state.factoryDailyScore + 30,
        });

        audioService.playSparkle();
        get().triggerSaveIndicator();
      },

      refreshOrders: () => {
        set({ activeOrders: generateInitialOrders() });
      },

      placeSquishyInRoom: (slotId, squishyUniqueId) => {
        const state = get();
        const squishy = state.inventory.find(s => s.uniqueId === squishyUniqueId);
        if (!squishy) return;

        // Clear any slot that currently has this squishy
        const updatedSlots = state.roomSlots.map(slot => {
          if (slot.id === slotId) {
            return { ...slot, squishyId: squishyUniqueId };
          }
          if (slot.squishyId === squishyUniqueId) {
            return { ...slot, squishyId: null };
          }
          return slot;
        });

        const updatedInventory = state.inventory.map(s =>
          s.uniqueId === squishyUniqueId
            ? { ...s, isDisplayed: true, displayedSlot: slotId }
            : s
        );

        set({ roomSlots: updatedSlots, inventory: updatedInventory });
        audioService.playPop();
        get().triggerSaveIndicator();
      },

      removeSquishyFromRoom: (slotId) => {
        const state = get();
        const slot = state.roomSlots.find(s => s.id === slotId);
        if (!slot || !slot.squishyId) return;

        const squishyId = slot.squishyId;
        const updatedSlots = state.roomSlots.map(s =>
          s.id === slotId ? { ...s, squishyId: null } : s
        );

        const updatedInventory = state.inventory.map(s =>
          s.uniqueId === squishyId
            ? { ...s, isDisplayed: false, displayedSlot: undefined }
            : s
        );

        set({ roomSlots: updatedSlots, inventory: updatedInventory });
        audioService.playPop();
        get().triggerSaveIndicator();
      },

      toggleFavoriteSquishy: (uniqueId) => {
        const state = get();
        set({
          inventory: state.inventory.map(s =>
            s.uniqueId === uniqueId ? { ...s, isFavorite: !s.isFavorite } : s
          ),
        });
        audioService.playClick();
      },

      renameSquishy: (uniqueId, newName) => {
        const state = get();
        const sanitized = (newName.trim() || 'My Squishy').slice(0, 24);
        set({
          inventory: state.inventory.map(s =>
            s.uniqueId === uniqueId ? { ...s, name: sanitized } : s
          ),
        });
      },

      buyMaterial: (category, itemId, price, isGems = false) => {
        const state = get();
        if (isGems) {
          if (state.gems < price) return false;
          set({ gems: state.gems - price });
        } else {
          if (state.coins < price) return false;
          set({ coins: state.coins - price });
        }

        switch (category) {
          case 'shapes':
            if (!state.unlockedShapes.includes(itemId)) {
              set({ unlockedShapes: [...state.unlockedShapes, itemId] });
            }
            break;
          case 'colors':
            if (!state.unlockedColors.includes(itemId)) {
              set({ unlockedColors: [...state.unlockedColors, itemId] });
            }
            break;
          case 'faces':
            if (!state.unlockedFaces.includes(itemId)) {
              set({ unlockedFaces: [...state.unlockedFaces, itemId] });
            }
            break;
          case 'accessories':
            if (!state.unlockedAccessories.includes(itemId)) {
              set({ unlockedAccessories: [...state.unlockedAccessories, itemId] });
            }
            break;
          case 'scents':
            if (!state.unlockedScents.includes(itemId)) {
              set({ unlockedScents: [...state.unlockedScents, itemId] });
            }
            break;
          case 'packaging':
            if (!state.unlockedPackaging.includes(itemId)) {
              set({ unlockedPackaging: [...state.unlockedPackaging, itemId] });
            }
            break;
        }

        audioService.playCoin();
        get().triggerSaveIndicator();
        return true;
      },

      equipDecoration: (decorId) => {
        const state = get();
        const target = state.roomDecorations.find(d => d.id === decorId);
        if (!target || !target.isUnlocked) return;

        // Unequip previous in the same category and equip new
        const updated = state.roomDecorations.map(d => {
          if (d.category === target.category) {
            return { ...d, isEquipped: d.id === decorId };
          }
          return d;
        });

        set({ roomDecorations: updated });
        audioService.playPop();
        get().triggerSaveIndicator();
      },

      buyDecoration: (decorId) => {
        const state = get();
        const target = state.roomDecorations.find(d => d.id === decorId);
        if (!target || target.isUnlocked) return false;
        if (state.coins < target.price) return false;

        const updated = state.roomDecorations.map(d =>
          d.id === decorId ? { ...d, isUnlocked: true } : d
        );

        set({
          coins: state.coins - target.price,
          roomDecorations: updated,
        });

        audioService.playCoin();
        get().triggerSaveIndicator();
        return true;
      },

      claimMissionReward: (missionId) => {
        const state = get();
        const daily = state.dailyMissions.find(m => m.id === missionId);
        const long = state.longtermMissions.find(m => m.id === missionId);
        const mission = daily || long;

        if (!mission || !mission.isCompleted || mission.isClaimed) return;

        const coinsReward = mission.rewardCoins;
        const xpReward = mission.rewardXp;
        const gemsReward = mission.rewardGems || 0;

        let newXp = state.xp + xpReward;
        let newLevel = state.level;
        let nextLevelXp = state.xpToNextLevel;

        while (newXp >= nextLevelXp) {
          newXp -= nextLevelXp;
          newLevel += 1;
          nextLevelXp = calculateXpNeeded(newLevel);
          audioService.playLevelUp();
        }

        const updateDaily = state.dailyMissions.map(m =>
          m.id === missionId ? { ...m, isClaimed: true } : m
        );
        const updateLong = state.longtermMissions.map(m =>
          m.id === missionId ? { ...m, isClaimed: true } : m
        );

        set({
          coins: state.coins + coinsReward,
          gems: state.gems + gemsReward,
          level: newLevel,
          xp: newXp,
          xpToNextLevel: nextLevelXp,
          dailyMissions: updateDaily,
          longtermMissions: updateLong,
        });

        audioService.playSparkle();
        get().triggerSaveIndicator();
      },

      claimDailyAllBonus: () => {
        const state = get();
        const allCompleted = state.dailyMissions.every(m => m.isCompleted);
        if (!allCompleted || state.dailyAllBonusClaimed) return;

        // Reward: Mystery box roll (coins + gems)
        set({
          coins: state.coins + 500,
          gems: state.gems + 3,
          dailyAllBonusClaimed: true,
        });
        audioService.playBoxOpen();
        get().triggerSaveIndicator();
      },

      claimAchievement: (achId) => {
        const state = get();
        const ach = state.achievements.find(a => a.id === achId);
        if (!ach || !ach.isUnlocked || ach.isClaimed) return;

        set({
          coins: state.coins + ach.rewardCoins,
          gems: state.gems + ach.rewardGems,
          achievements: state.achievements.map(a =>
            a.id === achId ? { ...a, isClaimed: true } : a
          ),
        });

        audioService.playSparkle();
        get().triggerSaveIndicator();
      },

      claimDailyGift: (dayIndex) => {
        const state = get();
        const day = state.dailyRewards[dayIndex];
        if (!day || day.isClaimed) return null;

        let result = { type: day.rewardType, value: day.rewardValue, name: day.displayName };

        if (day.rewardType === 'coins') {
          set({ coins: state.coins + Number(day.rewardValue) });
        } else if (day.rewardType === 'accessory') {
          const accId = String(day.rewardValue);
          if (!state.unlockedAccessories.includes(accId)) {
            set({ unlockedAccessories: [...state.unlockedAccessories, accId] });
          }
        } else if (day.rewardType === 'mystery_box') {
          set({ coins: state.coins + 400, gems: state.gems + 2 });
        } else if (day.rewardType === 'exclusive_material') {
          const colId = String(day.rewardValue);
          if (!state.unlockedColors.includes(colId)) {
            set({ unlockedColors: [...state.unlockedColors, colId], gems: state.gems + 5 });
          }
        }

        const updatedRewards = state.dailyRewards.map((d, i) =>
          i === dayIndex ? { ...d, isClaimed: true } : d
        );

        set({
          dailyRewards: updatedRewards,
          lastClaimedDailyGiftDate: new Date().toDateString(),
        });

        audioService.playBoxOpen();
        get().triggerSaveIndicator();
        return result;
      },

      openMysteryBox: () => {
        const state = get();
        // Weighted random drop:
        // 60% Coins (300 - 800), 20% Gems (2 - 5), 20% Unlock random material
        const roll = Math.random();

        if (roll < 0.6) {
          const rewardCoins = 300 + Math.floor(Math.random() * 500);
          set({ coins: state.coins + rewardCoins });
          audioService.playBoxOpen();
          get().triggerSaveIndicator();
          return { type: 'coins', value: rewardCoins, label: `${rewardCoins} Coins 🪙` };
        } else if (roll < 0.85) {
          const rewardGems = 2 + Math.floor(Math.random() * 4);
          set({ gems: state.gems + rewardGems });
          audioService.playSparkle();
          get().triggerSaveIndicator();
          return { type: 'gems', value: rewardGems, label: `${rewardGems} Gems 💎` };
        } else {
          // Unlock an accessory or color
          const lockedAccessories = ACCESSORIES_DATA.filter(
            a => !state.unlockedAccessories.includes(a.id)
          );
          if (lockedAccessories.length > 0) {
            const picked = lockedAccessories[Math.floor(Math.random() * lockedAccessories.length)];
            set({ unlockedAccessories: [...state.unlockedAccessories, picked.id] });
            audioService.playSparkle();
            get().triggerSaveIndicator();
            return { type: 'accessory', value: picked.id, label: `${picked.name} ${picked.emoji}` };
          } else {
            set({ coins: state.coins + 600 });
            audioService.playBoxOpen();
            get().triggerSaveIndicator();
            return { type: 'coins', value: 600, label: '600 Bonus Coins 🪙' };
          }
        }
      },

      claimMilestoneReward: (percentage) => {
        const state = get();
        if (state.claimedMilestones.includes(percentage)) return;

        let bonusCoins = 0;
        let bonusGems = 0;

        if (percentage === 10) {
          bonusCoins = 500;
        } else if (percentage === 25) {
          bonusCoins = 1000;
          if (!state.unlockedAccessories.includes('matcha_leaf')) {
            set({ unlockedAccessories: [...state.unlockedAccessories, 'matcha_leaf'] });
          }
        } else if (percentage === 50) {
          bonusCoins = 2000;
          bonusGems = 5;
          if (!state.unlockedColors.includes('rainbow')) {
            set({ unlockedColors: [...state.unlockedColors, 'rainbow'] });
          }
        } else if (percentage === 75) {
          bonusCoins = 3000;
          bonusGems = 10;
          if (!state.unlockedShapes.includes('unicorn')) {
            set({ unlockedShapes: [...state.unlockedShapes, 'unicorn'] });
          }
        } else if (percentage === 100) {
          bonusCoins = 10000;
          bonusGems = 50;
        }

        set({
          coins: state.coins + bonusCoins,
          gems: state.gems + bonusGems,
          claimedMilestones: [...state.claimedMilestones, percentage],
        });

        audioService.playSparkle();
        get().triggerSaveIndicator();
      },

      completeTutorialStep: (step) => {
        set({ tutorialStep: step });
      },

      finishTutorial: () => {
        set({ tutorialCompleted: true, tutorialStep: 99 });
        audioService.playLevelUp();
        get().triggerSaveIndicator();
      },

      updateSettings: (newSettings) => {
        set(newSettings);
        if (newSettings.bgmEnabled !== undefined) {
          audioService.setBgmEnabled(newSettings.bgmEnabled);
        }
        if (newSettings.sfxEnabled !== undefined) {
          audioService.setSfxEnabled(newSettings.sfxEnabled);
        }
        if (newSettings.bgmVolume !== undefined) {
          audioService.setBgmVolume(newSettings.bgmVolume);
        }
        if (newSettings.sfxVolume !== undefined) {
          audioService.setSfxVolume(newSettings.sfxVolume);
        }
      },

      checkDailyLogin: () => {
        const state = get();
        const today = new Date().toDateString();
        if (state.lastLoginDate !== today) {
          // New day login! Check streak
          const lastDate = new Date(state.lastLoginDate);
          const currentDate = new Date(today);
          const diffDays = Math.round(
            (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
          );

          let newStreak = state.dailyStreak;
          if (diffDays === 1) {
            newStreak = Math.min(newStreak + 1, 7);
          } else if (diffDays > 1) {
            newStreak = 1; // reset streak gently
          }

          set({
            lastLoginDate: today,
            dailyStreak: newStreak,
            dailyMissions: INITIAL_DAILY_MISSIONS,
            dailyAllBonusClaimed: false,
            activeOrders: generateInitialOrders(),
          });
        }
      },

      resetGame: () => {
        localStorage.removeItem('squishy_matcha_lab_save');
        set({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          coins: 2000,
          gems: 5,
          dailyStreak: 1,
          lastLoginDate: new Date().toDateString(),
          tutorialCompleted: false,
          tutorialStep: 0,
          unlockedShapes: ['bunny', 'cat', 'strawberry'],
          unlockedColors: ['matcha_green', 'strawberry_pink', 'milk_white', 'vanilla_cream'],
          unlockedFaces: ['happy', 'shy', 'sleepy'],
          unlockedAccessories: ['pink_bow', 'sakura_flower', 'matcha_leaf'],
          unlockedScents: ['matcha', 'strawberry', 'vanilla'],
          unlockedPackaging: ['basic_bag', 'cute_box'],
          inventory: [],
          discoveredCollection: {},
          claimedMilestones: [],
          roomSlots: INITIAL_ROOM_SLOTS,
          roomDecorations: ROOM_DECORATIONS,
          activeOrders: generateInitialOrders(),
          dailyMissions: INITIAL_DAILY_MISSIONS,
          longtermMissions: LONGTERM_MISSIONS,
          dailyAllBonusClaimed: false,
          achievements: ACHIEVEMENTS_DATA,
          dailyRewards: DAILY_REWARDS_DATA,
          lastClaimedDailyGiftDate: null,
        });
      },
    }),
    {
      name: 'squishy_matcha_lab_save',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
