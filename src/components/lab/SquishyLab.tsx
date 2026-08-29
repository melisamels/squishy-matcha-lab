import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SHAPES_DATA } from '../../data/shapes';
import { COLORS_DATA } from '../../data/colors';
import { FACES_DATA } from '../../data/faces';
import { ACCESSORIES_DATA } from '../../data/accessories';
import { SCENTS_DATA } from '../../data/scents';
import { PACKAGING_DATA } from '../../data/packaging';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { MachineAnimation } from './MachineAnimation';
import { CreateResultModal } from './CreateResultModal';
import { ScreenType } from '../common/NavigationBar';
import { audioService } from '../../services/audioService';
import { Sparkles, Lock, ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';
import { Squishy } from '../../types/game';

interface SquishyLabProps {
  onNavigate: (screen: ScreenType) => void;
  onShareSquishy?: (squishy: Squishy) => void;
}

const STEPS = [
  { id: 1, label: 'Shape', emoji: '🐰' },
  { id: 2, label: 'Color', emoji: '🎨' },
  { id: 3, label: 'Face', emoji: '😊' },
  { id: 4, label: 'Accessories', emoji: '🎀' },
  { id: 5, label: 'Scent', emoji: '🌸' },
  { id: 6, label: 'Packaging', emoji: '📦' },
  { id: 7, label: 'Create', emoji: '✨' },
];

export const SquishyLab: React.FC<SquishyLabProps> = ({ onNavigate, onShareSquishy }) => {
  const {
    level,
    coins,
    unlockedShapes,
    unlockedColors,
    unlockedFaces,
    unlockedAccessories,
    unlockedScents,
    unlockedPackaging,
    createSquishy,
    sellSquishy,
  } = useGameStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShape, setSelectedShape] = useState<string>('bunny');
  const [selectedColor, setSelectedColor] = useState<string>('matcha_green');
  const [selectedFace, setSelectedFace] = useState<string>('happy');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedScent, setSelectedScent] = useState<string>('matcha');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('basic_bag');
  const [customSquishyName, setCustomSquishyName] = useState<string>('');
  const [isMagicMachine, setIsMagicMachine] = useState<boolean>(false);

  const [isCrafting, setIsCrafting] = useState<boolean>(false);
  const [createdResult, setCreatedResult] = useState<Squishy | null>(null);
  const [showCoinWarning, setShowCoinWarning] = useState<boolean>(false);

  const cost = isMagicMachine ? 500 : 120;
  const canAfford = coins >= cost;

  // Toggle Accessory (Max 2)
  const handleToggleAccessory = (accId: string) => {
    audioService.playClick();
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter(id => id !== accId));
    } else {
      if (selectedAccessories.length >= 2) {
        // Replace oldest or limit
        setSelectedAccessories([selectedAccessories[1], accId]);
      } else {
        setSelectedAccessories([...selectedAccessories, accId]);
      }
    }
  };

  const handleStartCrafting = () => {
    if (!canAfford) {
      audioService.playPop();
      setShowCoinWarning(true);
      return;
    }
    audioService.playClick();
    setIsCrafting(true);
  };

  const handleMachineFinished = () => {
    setIsCrafting(false);
    const newSquishy = createSquishy({
      shapeId: selectedShape,
      colorId: selectedColor,
      faceId: selectedFace,
      accessoryIds: selectedAccessories,
      scentId: selectedScent,
      packagingId: selectedPackaging,
      customName: customSquishyName,
      isMagicMachine,
    });
    if (newSquishy) {
      setCreatedResult(newSquishy);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto flex flex-col gap-6 select-none pb-24 lg:pb-8">
      {/* Top Breadcrumb Steps */}
      <div className="bg-white p-3 rounded-2xl border border-[#EFE5D8] shadow-xs flex items-center justify-between overflow-x-auto gap-2">
        {STEPS.map(step => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                audioService.playClick();
                setCurrentStep(step.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#7BA05B] text-white shadow-xs scale-105'
                  : isDone
                  ? 'bg-[#EBF5E0] text-[#4D7C0F]'
                  : 'bg-[#F9F5EE] text-[#8C7A6B] hover:bg-[#F2EADB]'
              }`}
            >
              <span>{step.emoji}</span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Lab Working Area: Left Workspace Customizer, Right Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Interactive Preview */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#FFFDF9] to-[#F7EFE6] p-6 rounded-3xl border-2 border-[#E5D7C5] shadow-sm flex flex-col items-center justify-center gap-4 text-center sticky top-20">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#65A30D] bg-[#EAF3DE] px-3 py-0.5 rounded-full">
            <Sparkles size={13} /> Click squishy to test bounce! 🐾
          </div>

          <div className="w-full flex items-center justify-center py-4">
            <SquishyRenderer
              shapeId={selectedShape}
              colorId={selectedColor}
              faceId={selectedFace}
              accessoryIds={selectedAccessories}
              packagingId={selectedPackaging}
              size={190}
              showPackaging={currentStep >= 6}
            />
          </div>

          {/* Quick Summary Pill */}
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-[#E8DCCF] text-xs text-[#5C5046] flex flex-col gap-1">
            <div className="font-display font-bold text-sm text-[#3B342F]">
              {customSquishyName || 'My Custom Squishy'}
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] text-[#8C7A6B]">
              <span>Shape: {SHAPES_DATA.find(s => s.id === selectedShape)?.name}</span>
              <span>•</span>
              <span>Color: {COLORS_DATA.find(c => c.id === selectedColor)?.name}</span>
            </div>
          </div>

          {/* Creation Cost & Button */}
          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between px-2 text-xs font-semibold">
              <span className="text-[#8C7A6B]">Creation Cost:</span>
              <span className={`font-display font-bold text-sm ${canAfford ? 'text-[#B45309]' : 'text-[#DC2626]'}`}>
                🪙 {cost} Coins
              </span>
            </div>

            <button
              onClick={handleStartCrafting}
              className="w-full py-3 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] text-white font-display font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>✨</span> CREATE MY SQUISHY
            </button>
          </div>
        </div>

        {/* Right Customization Controls by Step */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DCCF] shadow-xs flex flex-col gap-5">
          {/* STEP 1: SHAPE */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>🐰</span> Step 1 — Choose Shape
                </h3>
                <span className="text-xs text-[#8C7A6B]">
                  {SHAPES_DATA.length} Available Molds
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {SHAPES_DATA.map(shape => {
                  const isUnlocked = unlockedShapes.includes(shape.id);
                  const isSelected = selectedShape === shape.id;
                  return (
                    <div
                      key={shape.id}
                      onClick={() => {
                        if (isUnlocked) {
                          audioService.playClick();
                          setSelectedShape(shape.id);
                        } else {
                          audioService.playPop();
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 relative ${
                        !isUnlocked
                          ? 'opacity-60 bg-[#F9F5EE] border-[#E8DCCF] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#EAF3DE] border-[#7BA05B] shadow-xs'
                          : 'bg-white border-[#E8DCCF] hover:border-[#A8C686] cursor-pointer'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 bg-gray-600/80 text-white rounded-full p-1">
                          <Lock size={12} />
                        </div>
                      )}
                      <span className="text-3xl">{shape.emoji}</span>
                      <span className="font-display font-bold text-sm text-[#3B342F]">
                        {shape.name}
                      </span>
                      <span className="text-[10px] text-[#8C7A6B] line-clamp-1">
                        {isUnlocked ? `Potential: ${shape.rarityPotential}` : `Lv.${shape.unlockLevel} or Store`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: COLOR */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>🎨</span> Step 2 — Color Palette
                </h3>
                <span className="text-xs text-[#8C7A6B]">
                  Pastel & Specialty Swatches
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {COLORS_DATA.map(color => {
                  const isUnlocked = unlockedColors.includes(color.id);
                  const isSelected = selectedColor === color.id;
                  return (
                    <div
                      key={color.id}
                      onClick={() => {
                        if (isUnlocked) {
                          audioService.playClick();
                          setSelectedColor(color.id);
                        } else {
                          audioService.playPop();
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 relative ${
                        !isUnlocked
                          ? 'opacity-60 bg-[#F9F5EE] border-[#E8DCCF] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#EAF3DE] border-[#7BA05B] shadow-xs'
                          : 'bg-white border-[#E8DCCF] hover:border-[#A8C686] cursor-pointer'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 bg-gray-600/80 text-white rounded-full p-1">
                          <Lock size={12} />
                        </div>
                      )}
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white shadow-xs"
                        style={{
                          background:
                            color.type === 'gradient'
                              ? `linear-gradient(135deg, ${color.secondaryHex}, ${color.hex})`
                              : color.hex,
                        }}
                      />
                      <div>
                        <div className="font-display font-bold text-xs text-[#3B342F]">
                          {color.name}
                        </div>
                        {color.rarityBonus && isUnlocked && (
                          <div className="text-[10px] text-[#7C3AED] font-semibold mt-0.5">
                            +{Math.round(color.rarityBonus.bonusChance * 100)}% {color.rarityBonus.rarity}
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="text-[10px] text-[#8C7A6B] mt-0.5">
                            Unlock in Store
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FACE */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>😊</span> Step 3 — Facial Expression
                </h3>
                <span className="text-xs text-[#8C7A6B]">Instant Realtime Preview</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {FACES_DATA.map(face => {
                  const isUnlocked = unlockedFaces.includes(face.id);
                  const isSelected = selectedFace === face.id;
                  return (
                    <div
                      key={face.id}
                      onClick={() => {
                        if (isUnlocked) {
                          audioService.playClick();
                          setSelectedFace(face.id);
                        } else {
                          audioService.playPop();
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 relative ${
                        !isUnlocked
                          ? 'opacity-60 bg-[#F9F5EE] border-[#E8DCCF] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#EAF3DE] border-[#7BA05B] shadow-xs'
                          : 'bg-white border-[#E8DCCF] hover:border-[#A8C686] cursor-pointer'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 bg-gray-600/80 text-white rounded-full p-1">
                          <Lock size={12} />
                        </div>
                      )}
                      <span className="text-3xl">{face.emoji}</span>
                      <span className="font-display font-bold text-xs text-[#3B342F]">
                        {face.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: ACCESSORIES */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>🎀</span> Step 4 — Accessories (Max 2)
                </h3>
                <span className="text-xs text-[#8C7A6B]">
                  Selected: {selectedAccessories.length} / 2
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {ACCESSORIES_DATA.map(acc => {
                  const isUnlocked = unlockedAccessories.includes(acc.id);
                  const isSelected = selectedAccessories.includes(acc.id);
                  const isConflicting = acc.incompatibleShapes?.includes(selectedShape);

                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        if (isUnlocked && !isConflicting) {
                          handleToggleAccessory(acc.id);
                        } else {
                          audioService.playPop();
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 relative ${
                        !isUnlocked || isConflicting
                          ? 'opacity-60 bg-[#F9F5EE] border-[#E8DCCF] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#FCE7F3] border-[#F472B6] shadow-xs'
                          : 'bg-white border-[#E8DCCF] hover:border-[#F472B6] cursor-pointer'
                      }`}
                    >
                      {(!isUnlocked || isConflicting) && (
                        <div className="absolute top-2 right-2 bg-gray-600/80 text-white rounded-full p-1">
                          <Lock size={12} />
                        </div>
                      )}
                      <span className="text-3xl">{acc.emoji}</span>
                      <span className="font-display font-bold text-xs text-[#3B342F]">
                        {acc.name}
                      </span>
                      <span className="text-[10px] text-[#8C7A6B]">
                        {isConflicting
                          ? 'Cannot wear on this shape'
                          : isUnlocked
                          ? isSelected
                            ? 'Selected ✓'
                            : 'Click to add'
                          : 'Locked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: SCENT */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>🌸</span> Step 5 — Scent Infusion
                </h3>
                <span className="text-xs text-[#8C7A6B]">Secret Recipe Keys</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {SCENTS_DATA.map(scent => {
                  const isUnlocked = unlockedScents.includes(scent.id);
                  const isSelected = selectedScent === scent.id;
                  return (
                    <div
                      key={scent.id}
                      onClick={() => {
                        if (isUnlocked) {
                          audioService.playClick();
                          setSelectedScent(scent.id);
                        } else {
                          audioService.playPop();
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 relative ${
                        !isUnlocked
                          ? 'opacity-60 bg-[#F9F5EE] border-[#E8DCCF] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#EAF3DE] border-[#7BA05B] shadow-xs'
                          : 'bg-white border-[#E8DCCF] hover:border-[#A8C686] cursor-pointer'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 bg-gray-600/80 text-white rounded-full p-1">
                          <Lock size={12} />
                        </div>
                      )}
                      <span className="text-3xl">{scent.emoji}</span>
                      <span className="font-display font-bold text-xs text-[#3B342F]">
                        {scent.name}
                      </span>
                      {scent.isRare && (
                        <span className="text-[9px] font-bold text-[#9333EA] bg-[#FAF5FF] px-2 py-0.5 rounded-full border border-[#DDD6FE]">
                          Rare Scent
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: PACKAGING */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>📦</span> Step 6 — Packaging & Box
                </h3>
                <span className="text-xs text-[#8C7A6B]">Increases Selling Value</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {PACKAGING_DATA.map(pkg => {
                  const isUnlocked = unlockedPackaging.includes(pkg.id);
                  const isSelected = selectedPackaging === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        if (isUnlocked) {
                          audioService.playClick();
                          setSelectedPackaging(pkg.id);
                        } else {
                          audioService.playPop();
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 relative ${
                        !isUnlocked
                          ? 'opacity-60 bg-[#F9F5EE] border-[#E8DCCF] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#EAF3DE] border-[#7BA05B] shadow-xs'
                          : 'bg-white border-[#E8DCCF] hover:border-[#A8C686] cursor-pointer'
                      }`}
                    >
                      <span className="text-3xl shrink-0">{pkg.emoji}</span>
                      <div className="flex flex-col">
                        <div className="font-display font-bold text-sm text-[#3B342F]">
                          {pkg.name}
                        </div>
                        <p className="text-[11px] text-[#7A6C60] leading-snug mt-0.5">
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: CREATE & RENAME */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="font-display font-bold text-lg text-[#3B342F] flex items-center gap-2">
                  <span>✨</span> Step 7 — Finalize & Craft
                </h3>
                <p className="text-xs text-[#8C7A6B] mt-0.5">
                  Give your squishy an adorable custom name or let the lab generate one!
                </p>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4A3E3D]">Custom Squishy Name (Max 24 chars):</label>
                <input
                  type="text"
                  maxLength={24}
                  placeholder="e.g. Matcha Mochi Bunny"
                  value={customSquishyName}
                  onChange={e => setCustomSquishyName(e.target.value)}
                  className="px-4 py-2.5 bg-[#FFFDF9] border-2 border-[#E5D7C5] focus:border-[#7BA05B] rounded-2xl font-display font-semibold text-sm text-[#3B342F] focus:outline-none"
                />
              </div>

              {/* Magic Squishy Machine Mode (Unlocked at level 30+) */}
              {level >= 30 && (
                <div className="p-4 bg-gradient-to-r from-[#FAF5FF] to-[#F3E8FF] rounded-2xl border-2 border-[#C084FC] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wand2 className="text-[#9333EA]" size={22} />
                    <div>
                      <div className="font-display font-bold text-sm text-[#581C87]">
                        Magic Squishy Machine
                      </div>
                      <div className="text-[11px] text-[#7E22CE]">
                        2.5x higher chance for Rare, Epic, & Legendary!
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMagicMachine(!isMagicMachine)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isMagicMachine
                        ? 'bg-[#9333EA] text-white shadow-xs'
                        : 'bg-white border border-[#DDD6FE] text-[#7E22CE]'
                    }`}
                  >
                    {isMagicMachine ? 'Active (500 🪙)' : 'Enable'}
                  </button>
                </div>
              )}

              {/* Summary Checklist */}
              <div className="p-4 bg-[#FDF8F2] rounded-2xl border border-[#EFE5D8] flex flex-col gap-2 text-xs text-[#5C5046]">
                <div className="font-display font-bold text-sm text-[#3B342F]">Lab Checklist:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>🐰 Shape: <b className="text-[#3B342F]">{SHAPES_DATA.find(s => s.id === selectedShape)?.name}</b></div>
                  <div>🎨 Color: <b className="text-[#3B342F]">{COLORS_DATA.find(c => c.id === selectedColor)?.name}</b></div>
                  <div>😊 Face: <b className="text-[#3B342F]">{FACES_DATA.find(f => f.id === selectedFace)?.name}</b></div>
                  <div>🌸 Scent: <b className="text-[#3B342F]">{SCENTS_DATA.find(s => s.id === selectedScent)?.name}</b></div>
                  <div>🎀 Acc: <b className="text-[#3B342F]">{selectedAccessories.length > 0 ? selectedAccessories.join(', ') : 'None'}</b></div>
                  <div>📦 Box: <b className="text-[#3B342F]">{PACKAGING_DATA.find(p => p.id === selectedPackaging)?.name}</b></div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Next / Prev Navigation */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EFE5D8]">
            <button
              onClick={() => {
                audioService.playClick();
                setCurrentStep(prev => Math.max(1, prev - 1));
              }}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-[#A89F91]'
                  : 'bg-[#F9F5EE] hover:bg-[#EFE5D8] text-[#5C5046]'
              }`}
            >
              <ArrowLeft size={14} /> Previous
            </button>

            {currentStep < 7 ? (
              <button
                onClick={() => {
                  audioService.playClick();
                  setCurrentStep(prev => Math.min(7, prev + 1));
                }}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#7BA05B] hover:bg-[#65A30D] text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-all hover:scale-102"
              >
                Next Step <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleStartCrafting}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] text-white rounded-2xl text-sm font-display font-bold shadow-md cursor-pointer transition-all hover:scale-105"
              >
                <span>✨</span> Create Now!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Machine Animation Sequence Overlay */}
      {isCrafting && <MachineAnimation onComplete={handleMachineFinished} />}

      {/* Result Card Modal */}
      {createdResult && (
        <CreateResultModal
          squishy={createdResult}
          onClose={() => setCreatedResult(null)}
          onGoToRoom={() => {
            setCreatedResult(null);
            onNavigate('room');
          }}
          onSellImmediately={(uniqueId) => {
            sellSquishy(uniqueId);
            setCreatedResult(null);
          }}
          onShareCard={() => {
            if (onShareSquishy) onShareSquishy(createdResult);
          }}
        />
      )}

      {/* Coin Warning Dialog */}
      {showCoinWarning && (
        <div className="fixed inset-0 z-50 bg-[#2D2424]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#FBBF24] rounded-3xl p-6 max-w-sm w-full text-center shadow-xl flex flex-col items-center gap-4">
            <span className="text-4xl">🪙</span>
            <div>
              <h4 className="font-display font-bold text-lg text-[#3B342F]">
                Oops! You need more coins
              </h4>
              <p className="text-xs text-[#7A6C60] mt-1">
                You need {cost} coins to craft this squishy. Visit your shop or complete daily missions to earn more!
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setShowCoinWarning(false);
                  onNavigate('shop');
                }}
                className="flex-1 py-2.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-bold text-xs rounded-xl hover:bg-[#FDE68A] cursor-pointer"
              >
                Visit Shop
              </button>
              <button
                onClick={() => {
                  setShowCoinWarning(false);
                  onNavigate('missions');
                }}
                className="flex-1 py-2.5 bg-[#EAF3DE] border border-[#A8C686] text-[#4D7C0F] font-bold text-xs rounded-xl hover:bg-[#D6E8C2] cursor-pointer"
              >
                Missions
              </button>
            </div>
            <button
              onClick={() => setShowCoinWarning(false)}
              className="text-xs text-[#8C7A6B] hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
