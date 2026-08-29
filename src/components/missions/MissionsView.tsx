import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioService } from '../../services/audioService';
import { Target, CheckCircle2, Gift, Trophy, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MissionsView: React.FC = () => {
  const {
    dailyMissions,
    longtermMissions,
    achievements,
    dailyAllBonusClaimed,
    claimMissionReward,
    claimDailyAllBonus,
    claimAchievement,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'daily' | 'longterm' | 'achievements'>('daily');

  const allDailyDone = dailyMissions.every(m => m.isCompleted);

  const handleClaimMission = (id: string) => {
    claimMissionReward(id);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleClaimAchievement = (id: string) => {
    claimAchievement(id);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleClaimDailyAll = () => {
    claimDailyAllBonus();
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FAF5FF] via-[#FFFDF9] to-[#F3E8FF] p-6 rounded-3xl border-2 border-[#DDD6FE] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#DDD6FE] text-xs font-bold text-[#7C3AED] w-fit mx-auto md:mx-0">
            <Target size={14} /> Goals & Milestones
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B342F]">
            🎯 Missions & Achievements
          </h1>
          <p className="text-xs md:text-sm text-[#7A6C60]">
            Complete daily tasks and major achievements to earn generous coin prizes, gems, and mystery boxes!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCCF] pb-2">
        <button
          onClick={() => {
            audioService.playClick();
            setActiveTab('daily');
          }}
          className={`px-4 py-2 rounded-2xl font-display font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-[#7C3AED] text-white shadow-xs'
              : 'bg-white border border-[#E8DCCF] text-[#5C5046] hover:bg-[#F9F5EE]'
          }`}
        >
          📅 Daily Missions (3)
        </button>

        <button
          onClick={() => {
            audioService.playClick();
            setActiveTab('longterm');
          }}
          className={`px-4 py-2 rounded-2xl font-display font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'longterm'
              ? 'bg-[#7C3AED] text-white shadow-xs'
              : 'bg-white border border-[#E8DCCF] text-[#5C5046] hover:bg-[#F9F5EE]'
          }`}
        >
          🏆 Long-Term Quests
        </button>

        <button
          onClick={() => {
            audioService.playClick();
            setActiveTab('achievements');
          }}
          className={`px-4 py-2 rounded-2xl font-display font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'achievements'
              ? 'bg-[#7C3AED] text-white shadow-xs'
              : 'bg-white border border-[#E8DCCF] text-[#5C5046] hover:bg-[#F9F5EE]'
          }`}
        >
          ✨ Achievements
        </button>
      </div>

      {/* DAILY MISSIONS TAB */}
      {activeTab === 'daily' && (
        <div className="flex flex-col gap-4">
          {/* Daily Completion Mystery Box Bonus */}
          <div className="p-5 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-3xl border-2 border-[#F59E0B] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs">🎁</span>
              <div>
                <div className="font-display font-bold text-sm text-[#92400E]">
                  Complete All 3 Daily Missions Bonus!
                </div>
                <div className="text-xs text-[#B45309]">
                  Reward: 500 Coins 🪙 + 3 Gems 💎
                </div>
              </div>
            </div>

            {dailyAllBonusClaimed ? (
              <span className="flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-white px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={14} /> Bonus Claimed
              </span>
            ) : allDailyDone ? (
              <button
                onClick={handleClaimDailyAll}
                className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-display font-bold text-xs rounded-xl shadow-md cursor-pointer animate-bounce"
              >
                Claim Mystery Bonus!
              </button>
            ) : (
              <span className="text-xs text-[#92400E] font-semibold bg-white/70 px-3 py-1 rounded-xl">
                {dailyMissions.filter(m => m.isCompleted).length} / 3 Finished
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {dailyMissions.map(m => {
              const percent = Math.min(100, Math.round((m.currentCount / m.targetCount) * 100));
              return (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded-3xl border-2 border-[#E8DCCF] shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="font-display font-bold text-sm text-[#3B342F]">
                      {m.title}
                    </div>
                    <p className="text-xs text-[#7A6C60] mt-0.5">{m.description}</p>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 bg-[#F1E9DF] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7C3AED] rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#8C7A6B] font-bold">
                        {m.currentCount} / {m.targetCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <div className="font-bold text-[#B45309]">🪙 +{m.rewardCoins}</div>
                      <div className="text-[#65A30D] font-bold">✨ +{m.rewardXp} XP</div>
                    </div>

                    {m.isClaimed ? (
                      <span className="text-xs font-bold text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-xl">
                        Claimed ✓
                      </span>
                    ) : m.isCompleted ? (
                      <button
                        onClick={() => handleClaimMission(m.id)}
                        className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-display font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="text-xs text-[#A89F91] bg-gray-100 px-3 py-1.5 rounded-xl">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LONG-TERM MISSIONS TAB */}
      {activeTab === 'longterm' && (
        <div className="flex flex-col gap-3">
          {longtermMissions.map(m => {
            const percent = Math.min(100, Math.round((m.currentCount / m.targetCount) * 100));
            return (
              <div
                key={m.id}
                className="bg-white p-4 rounded-3xl border-2 border-[#E8DCCF] shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="font-display font-bold text-sm text-[#3B342F]">
                    {m.title}
                  </div>
                  <p className="text-xs text-[#7A6C60] mt-0.5">{m.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-36 bg-[#F1E9DF] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#16A34A] rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#8C7A6B] font-bold">
                      {m.currentCount} / {m.targetCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <div className="font-bold text-[#B45309]">🪙 +{m.rewardCoins}</div>
                    <div className="text-[#7C3AED] font-bold">💎 +{m.rewardGems} Gems</div>
                  </div>

                  {m.isClaimed ? (
                    <span className="text-xs font-bold text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-xl">
                      Claimed ✓
                    </span>
                  ) : m.isCompleted ? (
                    <button
                      onClick={() => handleClaimMission(m.id)}
                      className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-display font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-xs text-[#A89F91] bg-gray-100 px-3 py-1.5 rounded-xl">
                      {percent}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border-2 flex items-center justify-between gap-3 bg-white ${
                ach.isUnlocked ? 'border-[#FDE68A] shadow-xs' : 'border-[#E8DCCF] opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-[#FDF8F2] rounded-2xl border border-[#F2E8DC]">
                  {ach.emoji}
                </span>
                <div>
                  <div className="font-display font-bold text-sm text-[#3B342F]">
                    {ach.title}
                  </div>
                  <div className="text-xs text-[#7A6C60] leading-tight">{ach.description}</div>
                  <div className="text-[10px] text-[#B45309] font-bold mt-1">
                    🪙 {ach.rewardCoins} • 💎 {ach.rewardGems}
                  </div>
                </div>
              </div>

              <div>
                {ach.isClaimed ? (
                  <span className="text-xs font-bold text-[#16A34A] bg-green-50 px-3 py-1.5 rounded-xl">
                    Claimed ✓
                  </span>
                ) : ach.isUnlocked ? (
                  <button
                    onClick={() => handleClaimAchievement(ach.id)}
                    className="px-3.5 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-display font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Claim!
                  </button>
                ) : (
                  <span className="text-xs text-[#A89F91]">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
