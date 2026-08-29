// TypeScript definitions for Squishy Factory: Matcha Lab

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Secret';

export interface ShapeItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockLevel: number;
  basePrice: number;
  rarityPotential: Rarity;
  isUnlocked: boolean;
}

export interface ColorItem {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  type: 'solid' | 'gradient' | 'pattern';
  rarityBonus?: {
    rarity: Rarity;
    bonusChance: number; // e.g. 0.10 for +10%
  };
  unlockLevel: number;
  price: number;
  isUnlocked: boolean;
}

export interface FaceItem {
  id: string;
  name: string;
  emoji: string;
  style: 'happy' | 'shy' | 'sleepy' | 'excited' | 'blushing' | 'cool' | 'yummy' | 'love' | 'tiny' | 'uwu';
  unlockLevel: number;
  price: number;
  isUnlocked: boolean;
}

export interface AccessoryItem {
  id: string;
  name: string;
  emoji: string;
  category: 'head' | 'face' | 'back' | 'neck';
  unlockLevel: number;
  price: number;
  isUnlocked: boolean;
  incompatibleShapes?: string[]; // e.g. bunny ears on bunny
}

export interface ScentItem {
  id: string;
  name: string;
  emoji: string;
  isRare?: boolean;
  unlockLevel: number;
  price: number;
  isUnlocked: boolean;
}

export interface PackagingItem {
  id: string;
  name: string;
  emoji: string;
  multiplier: number; // e.g. 1.0, 1.15, 1.5
  description: string;
  unlockLevel: number;
  price: number;
  isUnlocked: boolean;
}

export interface Squishy {
  id: string;
  uniqueId: string;
  name: string;
  shapeId: string;
  colorId: string;
  faceId: string;
  accessoryIds: string[];
  scentId: string;
  packagingId: string;
  rarity: Rarity;
  stars: number; // 1 to 5, or 6 for secret
  value: number; // coins value
  xpReward: number;
  createdAt: number;
  isFavorite: boolean;
  isDisplayed: boolean;
  displayedSlot?: string; // e.g. 'shelf1', 'desk', etc.
  collectionId?: string;
  customName?: string;
}

export interface SecretRecipe {
  id: string;
  name: string;
  targetCollectionId: string;
  rarity: Rarity;
  shapeId: string;
  colorId: string;
  faceId?: string;
  accessoryIds?: string[];
  scentId?: string;
  description: string;
  hint: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  category: 'Bunny' | 'Cat' | 'Food' | 'Animal' | 'Matcha' | 'Sweet' | 'Fantasy' | 'Legendary' | 'Secret';
  rarity: Rarity;
  stars: number;
  hint: string;
  requiredTraits: {
    shapeId?: string;
    colorId?: string;
    faceId?: string;
    accessoryId?: string;
    scentId?: string;
  };
  discovered: boolean;
  firstDiscoveredAt?: number;
  timesCreated: number;
  bestValue: number;
  rewardCoins: number;
}

export interface RoomDecoration {
  id: string;
  name: string;
  category: 'wallpaper' | 'floor' | 'rug' | 'bed' | 'desk' | 'lamp' | 'shelf' | 'wallItem';
  theme: 'Matcha' | 'Strawberry' | 'Cloud' | 'Sakura' | 'Ocean' | 'Galaxy' | 'Princess';
  price: number;
  unlockLevel: number;
  isUnlocked: boolean;
  isEquipped: boolean;
  previewColor: string;
}

export interface RoomSlot {
  id: string;
  name: string;
  squishyId: string | null;
  positionName: 'Shelf 1' | 'Shelf 2' | 'Desk' | 'Bed' | 'Window Shelf' | 'Display Cabinet' | 'Side Table' | 'Cozy Rug';
}

export interface Customer {
  id: string;
  name: string;
  avatar: string; // cute SVG/emoji avatar
  greeting: string;
  preferredThemes: string[];
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerAvatar: string;
  dialog: string;
  requirements: {
    shapeId?: string;
    colorId?: string;
    scentId?: string;
    minRarity?: Rarity;
  };
  rewardCoins: number;
  rewardXp: number;
  expiresAt: number; // timestamp
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'longterm';
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardCoins: number;
  rewardXp: number;
  rewardGems?: number;
  category: 'create' | 'sell' | 'collect' | 'matcha' | 'spend';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  progress: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  rewardCoins: number;
  rewardGems: number;
}

export interface DailyGiftDay {
  day: number;
  rewardType: 'coins' | 'accessory' | 'mystery_box' | 'gems' | 'exclusive_material';
  rewardValue: number | string;
  displayName: string;
  isClaimed: boolean;
}
