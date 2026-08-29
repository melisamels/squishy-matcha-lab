import { DailyGiftDay } from '../types/game';

export const DAILY_REWARDS_DATA: DailyGiftDay[] = [
  {
    day: 1,
    rewardType: 'coins',
    rewardValue: 100,
    displayName: '100 Coins',
    isClaimed: false,
  },
  {
    day: 2,
    rewardType: 'coins',
    rewardValue: 150,
    displayName: '150 Coins',
    isClaimed: false,
  },
  {
    day: 3,
    rewardType: 'accessory',
    rewardValue: 'star_clip',
    displayName: 'Star Clip Accessory ⭐',
    isClaimed: false,
  },
  {
    day: 4,
    rewardType: 'coins',
    rewardValue: 250,
    displayName: '250 Coins',
    isClaimed: false,
  },
  {
    day: 5,
    rewardType: 'mystery_box',
    rewardValue: 'mystery_box_reward',
    displayName: 'Surprise Mystery Box 🎁',
    isClaimed: false,
  },
  {
    day: 6,
    rewardType: 'coins',
    rewardValue: 500,
    displayName: '500 Coins',
    isClaimed: false,
  },
  {
    day: 7,
    rewardType: 'exclusive_material',
    rewardValue: 'golden',
    displayName: 'Golden Material + 5 💎',
    isClaimed: false,
  },
];
