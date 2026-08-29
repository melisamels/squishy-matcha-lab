import { Rarity, Squishy } from '../types/game';
import { SECRET_RECIPES } from '../data/secretRecipes';
import { SHAPES_DATA } from '../data/shapes';
import { COLORS_DATA } from '../data/colors';
import { PACKAGING_DATA } from '../data/packaging';

interface RarityInput {
  shapeId: string;
  colorId: string;
  faceId: string;
  accessoryIds: string[];
  scentId: string;
  packagingId: string;
  isMagicMachine?: boolean;
  isPerfectSquish?: boolean;
}

export function determineRarityAndSecret(input: RarityInput): {
  rarity: Rarity;
  matchedSecretRecipe: (typeof SECRET_RECIPES)[0] | null;
} {
  const { shapeId, colorId, faceId, accessoryIds, scentId } = input;

  // 1. Check for exact matching secret recipe
  for (const recipe of SECRET_RECIPES) {
    const shapeMatch = recipe.shapeId === shapeId;
    const colorMatch = recipe.colorId === colorId;
    const faceMatch = !recipe.faceId || recipe.faceId === faceId;
    const scentMatch = !recipe.scentId || recipe.scentId === scentId;
    const accessoryMatch = !recipe.accessoryIds || recipe.accessoryIds.every(acc => accessoryIds.includes(acc));

    if (shapeMatch && colorMatch && faceMatch && scentMatch && accessoryMatch) {
      return {
        rarity: recipe.rarity,
        matchedSecretRecipe: recipe,
      };
    }
  }

  // 2. Calculate probabilities with color bonuses
  let pSecret = 0.005;      // 0.5%
  let pLegendary = 0.025;   // 2.5%
  let pEpic = 0.08;         // 8%
  let pRare = 0.16;         // 16%
  let pUncommon = 0.28;     // 28%
  // Remainder is Common (~45%)

  // Check color rarity bonuses
  const colorItem = COLORS_DATA.find(c => c.id === colorId);
  if (colorItem?.rarityBonus) {
    if (colorItem.rarityBonus.rarity === 'Legendary') {
      pLegendary += colorItem.rarityBonus.bonusChance;
      pEpic += 0.05;
    } else if (colorItem.rarityBonus.rarity === 'Epic') {
      pEpic += colorItem.rarityBonus.bonusChance;
      pRare += 0.05;
    } else if (colorItem.rarityBonus.rarity === 'Rare') {
      pRare += colorItem.rarityBonus.bonusChance;
    }
  }

  // Magic Squishy Machine bonus
  if (input.isMagicMachine) {
    pSecret *= 3;
    pLegendary *= 2.5;
    pEpic *= 2;
    pRare *= 1.5;
  }

  // Skill Challenge: Perfect Squish bonus
  if (input.isPerfectSquish) {
    pSecret *= 2.0;
    pLegendary *= 2.0;
    pEpic *= 1.7;
    pRare *= 1.4;
  }

  const roll = Math.random();
  let cumulative = 0;

  cumulative += pSecret;
  if (roll < cumulative) return { rarity: 'Secret', matchedSecretRecipe: null };

  cumulative += pLegendary;
  if (roll < cumulative) return { rarity: 'Legendary', matchedSecretRecipe: null };

  cumulative += pEpic;
  if (roll < cumulative) return { rarity: 'Epic', matchedSecretRecipe: null };

  cumulative += pRare;
  if (roll < cumulative) return { rarity: 'Rare', matchedSecretRecipe: null };

  cumulative += pUncommon;
  if (roll < cumulative) return { rarity: 'Uncommon', matchedSecretRecipe: null };

  return { rarity: 'Common', matchedSecretRecipe: null };
}

export function calculateSquishyValueAndXp(
  shapeId: string,
  rarity: Rarity,
  packagingId: string,
  accessoriesCount: number,
  qualityMultiplier: number = 1.0
): { value: number; xp: number; stars: number } {
  const shape = SHAPES_DATA.find(s => s.id === shapeId);
  const packaging = PACKAGING_DATA.find(p => p.id === packagingId);

  const baseShapePrice = shape ? shape.basePrice : 100;
  const packagingMult = packaging ? packaging.multiplier : 1.0;

  // Base rarity price bracket
  let baseRarityPrice = 120;
  let xp = 15;
  let stars = 1;

  switch (rarity) {
    case 'Common':
      baseRarityPrice = 120 + Math.floor(Math.random() * 50); // 120 - 170
      xp = 15;
      stars = 1;
      break;
    case 'Uncommon':
      baseRarityPrice = 200 + Math.floor(Math.random() * 100); // 200 - 300
      xp = 25;
      stars = 2;
      break;
    case 'Rare':
      baseRarityPrice = 380 + Math.floor(Math.random() * 180); // 380 - 560
      xp = 40;
      stars = 3;
      break;
    case 'Epic':
      baseRarityPrice = 700 + Math.floor(Math.random() * 350); // 700 - 1050
      xp = 75;
      stars = 4;
      break;
    case 'Legendary':
      baseRarityPrice = 1600 + Math.floor(Math.random() * 800); // 1600 - 2400
      xp = 150;
      stars = 5;
      break;
    case 'Secret':
      baseRarityPrice = 3200 + Math.floor(Math.random() * 1200); // 3200 - 4400
      xp = 300;
      stars = 6;
      break;
  }

  // Accessories boost value
  const accessoryBonus = accessoriesCount * 40;

  const rawValue = (baseRarityPrice + (baseShapePrice * 0.3) + accessoryBonus) * packagingMult * qualityMultiplier;
  const finalValue = Math.round(rawValue / 10) * 10; // round to nearest 10
  const finalXp = Math.round(xp * qualityMultiplier);

  return { value: finalValue, xp: finalXp, stars };
}
