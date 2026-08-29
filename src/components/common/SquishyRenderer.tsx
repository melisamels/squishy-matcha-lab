import React, { useState } from 'react';
import { Rarity } from '../../types/game';
import { COLORS_DATA } from '../../data/colors';
import { audioService } from '../../services/audioService';

interface SquishyRendererProps {
  shapeId: string;
  colorId: string;
  faceId: string;
  accessoryIds?: string[];
  packagingId?: string;
  rarity?: Rarity;
  size?: number;
  className?: string;
  interactive?: boolean;
  onSquish?: () => void;
  showPackaging?: boolean;
}

export const SquishyRenderer: React.FC<SquishyRendererProps> = ({
  shapeId,
  colorId,
  faceId,
  accessoryIds = [],
  packagingId,
  rarity,
  size = 200,
  className = '',
  interactive = true,
  onSquish,
  showPackaging = false,
}) => {
  const [isSquished, setIsSquished] = useState(false);

  const handlePointerDown = () => {
    if (!interactive) return;
    setIsSquished(true);
    audioService.playSquish();
    if (onSquish) onSquish();
    setTimeout(() => {
      setIsSquished(false);
    }, 280);
  };

  const colorItem = COLORS_DATA.find(c => c.id === colorId) || COLORS_DATA[0];
  const primaryColor = colorItem.hex;
  const secondaryColor = colorItem.secondaryHex || primaryColor;

  const gradId = `grad_${shapeId}_${colorId}`;
  const patternId = `pattern_${colorId}`;
  const filterGlowId = `glow_${rarity || 'common'}`;

  // Packaging Frame Overlay
  const renderPackagingBox = () => {
    if (!showPackaging || !packagingId) return null;
    switch (packagingId) {
      case 'cute_box':
        return (
          <g pointerEvents="none">
            <rect x="15" y="15" width="170" height="170" rx="20" fill="none" stroke="#FFD1DC" strokeWidth="6" strokeDasharray="12 6" opacity="0.8" />
            <circle cx="28" cy="28" r="6" fill="#FCA5A5" />
            <circle cx="172" cy="28" r="6" fill="#FCA5A5" />
          </g>
        );
      case 'matcha_box':
        return (
          <g pointerEvents="none">
            <rect x="15" y="15" width="170" height="170" rx="16" fill="none" stroke="#A8C686" strokeWidth="8" />
            <line x1="15" y1="100" x2="185" y2="100" stroke="#7BA05B" strokeWidth="4" strokeDasharray="6 4" />
            <rect x="85" y="10" width="30" height="12" rx="4" fill="#7BA05B" />
          </g>
        );
      case 'golden_collector_box':
        return (
          <g pointerEvents="none">
            <rect x="12" y="12" width="176" height="176" rx="22" fill="none" stroke="url(#goldGradient)" strokeWidth="8" />
            <polygon points="100,6 108,18 92,18" fill="#FFD700" />
            <circle cx="20" cy="20" r="5" fill="#FFD700" />
            <circle cx="180" cy="20" r="5" fill="#FFD700" />
            <circle cx="20" cy="180" r="5" fill="#FFD700" />
            <circle cx="180" cy="180" r="5" fill="#FFD700" />
          </g>
        );
      case 'premium_ribbon_box':
        return (
          <g pointerEvents="none">
            <rect x="16" y="16" width="168" height="168" rx="20" fill="none" stroke="#E9D5FF" strokeWidth="6" />
            <path d="M 85 16 C 85 5, 95 0, 100 0 C 105 0, 115 5, 115 16 Z" fill="#C084FC" />
            <circle cx="100" cy="16" r="6" fill="#9333EA" />
          </g>
        );
      case 'transparent_display_box':
        return (
          <g pointerEvents="none">
            <rect x="14" y="14" width="172" height="172" rx="18" fill="rgba(255,255,255,0.2)" stroke="#93C5FD" strokeWidth="4" />
            <line x1="30" y1="20" x2="60" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </g>
        );
      default:
        return null;
    }
  };

  // Base SVG Shapes
  const renderShapeBody = () => {
    const fillStyle = colorItem.type === 'pattern' ? `url(#${patternId})` : `url(#${gradId})`;

    switch (shapeId) {
      case 'bunny':
        return (
          <g>
            {/* Bunny Ears */}
            <path d="M 68 85 C 55 25, 65 15, 78 20 C 88 25, 86 55, 80 85 Z" fill={fillStyle} />
            <path d="M 132 85 C 145 25, 135 15, 122 20 C 112 25, 114 55, 120 85 Z" fill={fillStyle} />
            {/* Inner Ear Highlights */}
            <path d="M 70 70 C 62 35, 68 25, 76 28 C 82 32, 80 50, 77 70 Z" fill={secondaryColor} opacity="0.6" />
            <path d="M 130 70 C 138 35, 132 25, 124 28 C 118 32, 120 50, 123 70 Z" fill={secondaryColor} opacity="0.6" />
            {/* Round Chubby Body */}
            <ellipse cx="100" cy="120" rx="55" ry="50" fill={fillStyle} />
            {/* Chubby Cheeks */}
            <ellipse cx="60" cy="128" rx="16" ry="14" fill={fillStyle} />
            <ellipse cx="140" cy="128" rx="16" ry="14" fill={fillStyle} />
            {/* Tiny Paws */}
            <ellipse cx="78" cy="158" rx="12" ry="9" fill={secondaryColor} opacity="0.7" />
            <ellipse cx="122" cy="158" rx="12" ry="9" fill={secondaryColor} opacity="0.7" />
          </g>
        );

      case 'cat':
        return (
          <g>
            {/* Cat Pointy Ears */}
            <polygon points="55,100 50,45 85,75" fill={fillStyle} />
            <polygon points="145,100 150,45 115,75" fill={fillStyle} />
            {/* Inner Ears */}
            <polygon points="58,90 55,55 78,75" fill="#FFAAC9" opacity="0.6" />
            <polygon points="142,90 145,55 122,75" fill="#FFAAC9" opacity="0.6" />
            {/* Round Kitty Body */}
            <circle cx="100" cy="120" r="54" fill={fillStyle} />
            {/* Tail */}
            <path d="M 148 135 Q 175 140 170 115 Q 166 100 156 112" fill="none" stroke={primaryColor} strokeWidth="12" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="50" y1="120" x2="30" y2="116" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <line x1="50" y1="126" x2="30" y2="130" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <line x1="150" y1="120" x2="170" y2="116" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <line x1="150" y1="126" x2="170" y2="130" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </g>
        );

      case 'strawberry':
        return (
          <g>
            {/* Berry Body */}
            <path d="M 100 168 C 45 155, 45 95, 75 75 C 95 62, 105 62, 125 75 C 155 95, 155 155, 100 168 Z" fill={fillStyle} />
            {/* Strawberry Leaf Crown */}
            <path d="M 100 65 Q 85 45 70 55 Q 85 68 100 68 Q 115 68 130 55 Q 115 45 100 65 Z" fill="#7BA05B" />
            <path d="M 100 60 Q 100 40 102 36" fill="none" stroke="#7BA05B" strokeWidth="5" strokeLinecap="round" />
            {/* Seed Dimples */}
            <circle cx="75" cy="100" r="2.5" fill="#FFF59D" opacity="0.7" />
            <circle cx="125" cy="100" r="2.5" fill="#FFF59D" opacity="0.7" />
            <circle cx="85" cy="140" r="2.5" fill="#FFF59D" opacity="0.7" />
            <circle cx="115" cy="140" r="2.5" fill="#FFF59D" opacity="0.7" />
          </g>
        );

      case 'croissant':
        return (
          <g>
            {/* Crescent Layers */}
            <path d="M 40 135 C 35 90, 75 55, 100 55 C 125 55, 165 90, 160 135 C 140 150, 130 115, 100 115 C 70 115, 60 150, 40 135 Z" fill={fillStyle} />
            {/* Pastry Ridge Details */}
            <path d="M 68 76 Q 80 120 72 135" fill="none" stroke={secondaryColor} strokeWidth="6" opacity="0.6" strokeLinecap="round" />
            <path d="M 132 76 Q 120 120 128 135" fill="none" stroke={secondaryColor} strokeWidth="6" opacity="0.6" strokeLinecap="round" />
            <ellipse cx="100" cy="100" rx="30" ry="32" fill={fillStyle} />
          </g>
        );

      case 'panda':
        return (
          <g>
            {/* Panda Black Ears */}
            <circle cx="58" cy="72" r="18" fill="#3D3A45" />
            <circle cx="142" cy="72" r="18" fill="#3D3A45" />
            {/* Round Panda Head */}
            <circle cx="100" cy="118" r="54" fill={fillStyle} />
            {/* Panda Eye Patches */}
            <ellipse cx="78" cy="115" rx="14" ry="11" fill="#3D3A45" transform="rotate(-15 78 115)" />
            <ellipse cx="122" cy="115" rx="14" ry="11" fill="#3D3A45" transform="rotate(15 122 115)" />
          </g>
        );

      case 'bear':
        return (
          <g>
            {/* Round Bear Ears */}
            <circle cx="60" cy="75" r="18" fill={fillStyle} />
            <circle cx="140" cy="75" r="18" fill={fillStyle} />
            <circle cx="60" cy="75" r="9" fill={secondaryColor} opacity="0.7" />
            <circle cx="140" cy="75" r="9" fill={secondaryColor} opacity="0.7" />
            {/* Bear Head */}
            <circle cx="100" cy="120" r="54" fill={fillStyle} />
            {/* Snout Muzzle */}
            <ellipse cx="100" cy="130" rx="18" ry="14" fill="#FFFDF8" opacity="0.9" />
            <circle cx="100" cy="124" r="5" fill="#4A3E3D" />
          </g>
        );

      case 'duck':
        return (
          <g>
            {/* Chubby Duck Body */}
            <circle cx="100" cy="120" r="50" fill={fillStyle} />
            {/* Little Wing */}
            <ellipse cx="60" cy="125" rx="16" ry="10" fill={secondaryColor} transform="rotate(-15 60 125)" />
            <ellipse cx="140" cy="125" rx="16" ry="10" fill={secondaryColor} transform="rotate(15 140 125)" />
            {/* Orange Beak */}
            <ellipse cx="100" cy="126" rx="14" ry="9" fill="#FB923C" />
          </g>
        );

      case 'cloud':
        return (
          <g>
            {/* Cloud Puffs */}
            <path d="M 60 135 C 35 135, 35 105, 55 100 C 50 75, 80 65, 95 80 C 110 65, 145 70, 145 95 C 165 98, 165 135, 140 135 Z" fill={fillStyle} />
          </g>
        );

      case 'star':
        return (
          <g>
            {/* Rounded Star */}
            <polygon points="100,45 116,80 155,83 125,110 135,148 100,126 65,148 75,110 45,83 84,80" fill={fillStyle} strokeLinejoin="round" stroke={secondaryColor} strokeWidth="12" />
          </g>
        );

      case 'heart':
        return (
          <g>
            {/* Soft Heart */}
            <path d="M 100 160 C 55 125, 40 85, 68 62 C 88 46, 100 66, 100 72 C 100 66, 112 46, 132 62 C 160 85, 145 125, 100 160 Z" fill={fillStyle} />
          </g>
        );

      case 'donut':
        return (
          <g>
            {/* Outer Pastry */}
            <circle cx="100" cy="115" r="54" fill={fillStyle} />
            {/* Frosting Drizzle */}
            <path d="M 60 110 C 65 90, 80 80, 100 80 C 120 80, 135 90, 140 110 C 135 125, 120 135, 100 135 C 80 135, 65 125, 60 110 Z" fill={secondaryColor} opacity="0.6" />
            {/* Donut Hole */}
            <circle cx="100" cy="115" r="18" fill="#FDF8F2" />
            {/* Sprinkles */}
            <rect x="75" y="92" width="6" height="3" rx="1.5" fill="#F43F5E" transform="rotate(30 75 92)" />
            <rect x="120" y="92" width="6" height="3" rx="1.5" fill="#3B82F6" transform="rotate(-25 120 92)" />
            <rect x="128" y="125" width="6" height="3" rx="1.5" fill="#EAB308" transform="rotate(45 128 125)" />
            <rect x="66" y="125" width="6" height="3" rx="1.5" fill="#10B981" transform="rotate(-40 66 125)" />
          </g>
        );

      case 'cupcake':
        return (
          <g>
            {/* Liner */}
            <polygon points="65,115 135,115 125,160 75,160" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
            {/* Swirl Frosting */}
            <path d="M 60 115 C 50 95, 75 75, 100 70 C 125 75, 150 95, 140 115 Z" fill={fillStyle} />
            <circle cx="100" cy="65" r="10" fill="#F43F5E" />
          </g>
        );

      case 'matcha_cup':
        return (
          <g>
            {/* Teacup Ceramic */}
            <path d="M 55 90 L 145 90 C 145 140, 130 158, 100 158 C 70 158, 55 140, 55 90 Z" fill="#EFE8D8" stroke="#D3C7B2" strokeWidth="4" />
            {/* Frothy Matcha Tea */}
            <ellipse cx="100" cy="90" rx="42" ry="14" fill={fillStyle} />
            {/* Foam Bubble Heart */}
            <ellipse cx="100" cy="90" rx="12" ry="6" fill="#F7FEE7" opacity="0.8" />
          </g>
        );

      case 'toast':
        return (
          <g>
            {/* Bread Crust & Slice */}
            <rect x="55" y="70" width="90" height="85" rx="20" fill={fillStyle} stroke={secondaryColor} strokeWidth="8" />
            {/* Butter Pat */}
            <rect x="90" y="85" width="20" height="15" rx="3" fill="#FEF08A" stroke="#FDE047" strokeWidth="2" />
          </g>
        );

      case 'milk_carton':
        return (
          <g>
            {/* Gable Top Carton */}
            <polygon points="62,80 100,55 138,80 135,160 65,160" fill={fillStyle} stroke={secondaryColor} strokeWidth="6" />
            <line x1="100" y1="55" x2="100" y2="80" stroke={secondaryColor} strokeWidth="4" />
          </g>
        );

      case 'axolotl':
        return (
          <g>
            {/* Side Frills */}
            <path d="M 45 100 Q 25 90 35 115 Q 25 125 45 125" fill="#FDA4AF" />
            <path d="M 155 100 Q 175 90 165 115 Q 175 125 155 125" fill="#FDA4AF" />
            {/* Chubby Axolotl Head */}
            <ellipse cx="100" cy="120" rx="55" ry="45" fill={fillStyle} />
          </g>
        );

      case 'frog':
        return (
          <g>
            {/* Frog Eyes */}
            <circle cx="68" cy="80" r="18" fill={fillStyle} />
            <circle cx="132" cy="80" r="18" fill={fillStyle} />
            <circle cx="68" cy="80" r="8" fill="#FFFFFF" />
            <circle cx="132" cy="80" r="8" fill="#FFFFFF" />
            <circle cx="70" cy="80" r="4" fill="#1E293B" />
            <circle cx="130" cy="80" r="4" fill="#1E293B" />
            {/* Frog Head */}
            <ellipse cx="100" cy="122" rx="56" ry="46" fill={fillStyle} />
          </g>
        );

      case 'dinosaur':
        return (
          <g>
            {/* Dino Back Spikes */}
            <polygon points="50,90 40,82 48,100" fill="#A855F7" />
            <polygon points="46,110 36,105 44,120" fill="#A855F7" />
            <polygon points="44,130 35,128 44,140" fill="#A855F7" />
            {/* Dino Head & Body */}
            <ellipse cx="105" cy="118" rx="52" ry="48" fill={fillStyle} />
          </g>
        );

      case 'whale':
        return (
          <g>
            {/* Narwhal / Whale Body */}
            <ellipse cx="95" cy="122" rx="58" ry="44" fill={fillStyle} />
            {/* Whale Tail Fluke */}
            <path d="M 150 122 Q 175 110 178 95 Q 165 115 155 125 Q 172 135 178 145 Q 170 130 150 122" fill={fillStyle} />
            {/* Water Sprout */}
            <path d="M 90 75 Q 85 55 75 60 Q 88 65 92 75 Q 96 65 105 60 Q 98 55 94 75" fill="#38BDF8" />
          </g>
        );

      case 'moon':
        return (
          <g>
            {/* Crescent Moon */}
            <path d="M 135 60 C 95 60 70 85 70 120 C 70 155 95 180 135 180 C 105 165 95 140 95 120 C 95 100 105 75 135 60 Z" fill={fillStyle} />
          </g>
        );

      case 'unicorn':
        return (
          <g>
            {/* Pastel Spiral Horn */}
            <polygon points="100,28 92,72 108,72" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
            <line x1="94" y1="42" x2="105" y2="48" stroke="#F59E0B" strokeWidth="2" />
            <line x1="93" y1="56" x2="106" y2="62" stroke="#F59E0B" strokeWidth="2" />
            {/* Unicorn Head */}
            <ellipse cx="100" cy="120" rx="52" ry="48" fill={fillStyle} />
            {/* Ears */}
            <polygon points="65,95 60,60 85,82" fill={fillStyle} />
            <polygon points="135,95 140,60 115,82" fill={fillStyle} />
          </g>
        );

      default:
        return <circle cx="100" cy="120" r="50" fill={fillStyle} />;
    }
  };

  // Kawaii Faces
  const renderFace = () => {
    // Face positions adjust slightly if shape is crescent moon or strawberry
    const cx = shapeId === 'moon' ? 102 : 100;
    const cy = shapeId === 'croissant' ? 112 : shapeId === 'matcha_cup' ? 122 : 122;

    const cheekColor = '#FFAAC9';

    switch (faceId) {
      case 'happy':
        return (
          <g pointerEvents="none">
            {/* Curved Happy Eyes */}
            <path d={`M ${cx - 24} ${cy - 4} Q ${cx - 16} ${cy - 14} ${cx - 8} ${cy - 4}`} fill="none" stroke="#3D322C" strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M ${cx + 8} ${cy - 4} Q ${cx + 16} ${cy - 14} ${cx + 24} ${cy - 4}`} fill="none" stroke="#3D322C" strokeWidth="3.5" strokeLinecap="round" />
            {/* Smile Mouth */}
            <path d={`M ${cx - 8} ${cy + 6} Q ${cx} ${cy + 14} ${cx + 8} ${cy + 6}`} fill="none" stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            {/* Blushing Cheeks */}
            <ellipse cx={cx - 24} cy={cy + 4} rx="6" ry="4" fill={cheekColor} opacity="0.6" />
            <ellipse cx={cx + 24} cy={cy + 4} rx="6" ry="4" fill={cheekColor} opacity="0.6" />
          </g>
        );

      case 'shy':
        return (
          <g pointerEvents="none">
            {/* Wide Shiny Curious Eyes */}
            <circle cx={cx - 16} cy={cy - 4} r="5" fill="#3D322C" />
            <circle cx={cx - 14} cy={cy - 6} r="2" fill="white" />
            <circle cx={cx + 16} cy={cy - 4} r="5" fill="#3D322C" />
            <circle cx={cx + 18} cy={cy - 6} r="2" fill="white" />
            {/* Little Shy Dot Mouth */}
            <ellipse cx={cx} cy={cy + 6} rx="3" ry="2" fill="#3D322C" />
            {/* Rosy Cheeks */}
            <ellipse cx={cx - 20} cy={cy + 3} rx="8" ry="5" fill={cheekColor} opacity="0.75" />
            <ellipse cx={cx + 20} cy={cy + 3} rx="8" ry="5" fill={cheekColor} opacity="0.75" />
          </g>
        );

      case 'sleepy':
        return (
          <g pointerEvents="none">
            {/* Sleeping Eyes */}
            <line x1={cx - 22} y1={cy - 2} x2={cx - 10} y2={cy - 2} stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            <line x1={cx + 10} y1={cy - 2} x2={cx + 22} y2={cy - 2} stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            {/* Gentle Small Smile */}
            <path d={`M ${cx - 5} ${cy + 5} Q ${cx} ${cy + 9} ${cx + 5} ${cy + 5}`} fill="none" stroke="#3D322C" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx={cx - 20} cy={cy + 4} rx="5" ry="3" fill={cheekColor} opacity="0.5" />
            <ellipse cx={cx + 20} cy={cy + 4} rx="5" ry="3" fill={cheekColor} opacity="0.5" />
            {/* Floating 'z z' */}
            <text x={cx + 24} y={cy - 12} fontSize="11" fill="#7C3AED" fontWeight="bold" opacity="0.7">z</text>
          </g>
        );

      case 'excited':
        return (
          <g pointerEvents="none">
            {/* Star Sparkle Eyes */}
            <path d={`M ${cx - 16} ${cy - 10} L ${cx - 16} ${cy + 2} M ${cx - 22} ${cy - 4} L ${cx - 10} ${cy - 4}`} stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${cx + 16} ${cy - 10} L ${cx + 16} ${cy + 2} M ${cx + 10} ${cy - 4} L ${cx + 22} ${cy - 4}`} stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            {/* Open Happy Mouth */}
            <path d={`M ${cx - 8} ${cy + 6} Q ${cx} ${cy + 18} ${cx + 8} ${cy + 6} Z`} fill="#F43F5E" stroke="#3D322C" strokeWidth="2" />
            <ellipse cx={cx - 22} cy={cy + 4} rx="6" ry="4" fill={cheekColor} opacity="0.7" />
            <ellipse cx={cx + 22} cy={cy + 4} rx="6" ry="4" fill={cheekColor} opacity="0.7" />
          </g>
        );

      case 'blushing':
        return (
          <g pointerEvents="none">
            {/* Dot Eyes */}
            <circle cx={cx - 16} cy={cy - 4} r="4" fill="#3D322C" />
            <circle cx={cx + 16} cy={cy - 4} r="4" fill="#3D322C" />
            {/* Little Wavy Mouth */}
            <path d={`M ${cx - 6} ${cy + 6} Q ${cx - 2} ${cy + 10} ${cx} ${cy + 6} Q ${cx + 2} ${cy + 10} ${cx + 6} ${cy + 6}`} fill="none" stroke="#3D322C" strokeWidth="2.5" strokeLinecap="round" />
            {/* Deep Blush Cheeks with Stripes */}
            <ellipse cx={cx - 22} cy={cy + 3} rx="9" ry="6" fill="#F43F5E" opacity="0.5" />
            <ellipse cx={cx + 22} cy={cy + 3} rx="9" ry="6" fill="#F43F5E" opacity="0.5" />
          </g>
        );

      case 'cool':
        return (
          <g pointerEvents="none">
            {/* Dark Stylish Sunglasses */}
            <rect x={cx - 26} y={cy - 10} width="22" height="12" rx="4" fill="#1E293B" />
            <rect x={cx + 4} y={cy - 10} width="22" height="12" rx="4" fill="#1E293B" />
            <line x1={cx - 4} y1={cy - 5} x2={cx + 4} y2={cy - 5} stroke="#1E293B" strokeWidth="3" />
            {/* Cool Smirk */}
            <path d={`M ${cx - 4} ${cy + 8} Q ${cx + 6} ${cy + 12} ${cx + 10} ${cy + 6}`} fill="none" stroke="#3D322C" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'yummy':
        return (
          <g pointerEvents="none">
            {/* Wink Eyes */}
            <path d={`M ${cx - 22} ${cy - 4} Q ${cx - 16} ${cy - 12} ${cx - 10} ${cy - 4}`} fill="none" stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            <circle cx={cx + 16} cy={cy - 4} r="4" fill="#3D322C" />
            {/* Mouth with Tongue */}
            <path d={`M ${cx - 8} ${cy + 5} Q ${cx} ${cy + 14} ${cx + 8} ${cy + 5} Z`} fill="#3D322C" />
            <ellipse cx={cx + 2} cy={cy + 10} rx="4" ry="4" fill="#FB7185" />
            <ellipse cx={cx - 20} cy={cy + 4} rx="6" ry="4" fill={cheekColor} opacity="0.6" />
            <ellipse cx={cx + 20} cy={cy + 4} rx="6" ry="4" fill={cheekColor} opacity="0.6" />
          </g>
        );

      case 'love':
        return (
          <g pointerEvents="none">
            {/* Heart Eyes */}
            <path d={`M ${cx - 16} ${cy - 2} C ${cx - 24} ${cy - 12}, ${cx - 16} ${cy - 16}, ${cx - 16} ${cy - 10} C ${cx - 16} ${cy - 16}, ${cx - 8} ${cy - 12}, ${cx - 16} ${cy - 2} Z`} fill="#E11D48" />
            <path d={`M ${cx + 16} ${cy - 2} C ${cx + 8} ${cy - 12}, ${cx + 16} ${cy - 16}, ${cx + 16} ${cy - 10} C ${cx + 16} ${cy - 16}, ${cx + 24} ${cy - 12}, ${cx + 16} ${cy - 2} Z`} fill="#E11D48" />
            {/* Cute Smile */}
            <path d={`M ${cx - 6} ${cy + 8} Q ${cx} ${cy + 14} ${cx + 6} ${cy + 8}`} fill="none" stroke="#3D322C" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx={cx - 22} cy={cy + 5} rx="6" ry="4" fill={cheekColor} opacity="0.6" />
            <ellipse cx={cx + 22} cy={cy + 5} rx="6" ry="4" fill={cheekColor} opacity="0.6" />
          </g>
        );

      case 'tiny':
        return (
          <g pointerEvents="none">
            {/* Tiny Dot Eyes Close Together */}
            <circle cx={cx - 8} cy={cy} r="2.5" fill="#3D322C" />
            <circle cx={cx + 8} cy={cy} r="2.5" fill="#3D322C" />
            <line x1={cx - 3} y1={cy + 6} x2={cx + 3} y2={cy + 6} stroke="#3D322C" strokeWidth="2" strokeLinecap="round" />
            <circle cx={cx - 15} cy={cy + 3} r="3" fill={cheekColor} opacity="0.5" />
            <circle cx={cx + 15} cy={cy + 3} r="3" fill={cheekColor} opacity="0.5" />
          </g>
        );

      case 'uwu':
        return (
          <g pointerEvents="none">
            {/* UwU Closed Eyes */}
            <path d={`M ${cx - 24} ${cy} Q ${cx - 16} ${cy + 8} ${cx - 8} ${cy}`} fill="none" stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${cx + 8} ${cy} Q ${cx + 16} ${cy + 8} ${cx + 24} ${cy}`} fill="none" stroke="#3D322C" strokeWidth="3" strokeLinecap="round" />
            {/* 'w' Mouth */}
            <path d={`M ${cx - 7} ${cy + 6} Q ${cx - 3} ${cy + 11} ${cx} ${cy + 7} Q ${cx + 3} ${cy + 11} ${cx + 7} ${cy + 6}`} fill="none" stroke="#3D322C" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx={cx - 22} cy={cy + 5} rx="6" ry="4" fill={cheekColor} opacity="0.65" />
            <ellipse cx={cx + 22} cy={cy + 5} rx="6" ry="4" fill={cheekColor} opacity="0.65" />
          </g>
        );

      default:
        return null;
    }
  };

  // Kawaii Accessories
  const renderAccessories = () => {
    return accessoryIds.map(accId => {
      switch (accId) {
        case 'pink_bow':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 65 75 L 50 65 L 50 85 Z" fill="#F472B6" />
              <path d="M 65 75 L 80 65 L 80 85 Z" fill="#F472B6" />
              <circle cx="65" cy="75" r="5" fill="#DB2777" />
            </g>
          );
        case 'sakura_flower':
          return (
            <g key={accId} pointerEvents="none">
              <circle cx="65" cy="70" r="5" fill="#F43F5E" />
              <circle cx="65" cy="62" r="6" fill="#FDA4AF" />
              <circle cx="73" cy="68" r="6" fill="#FDA4AF" />
              <circle cx="70" cy="76" r="6" fill="#FDA4AF" />
              <circle cx="60" cy="76" r="6" fill="#FDA4AF" />
              <circle cx="57" cy="68" r="6" fill="#FDA4AF" />
            </g>
          );
        case 'matcha_leaf':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 70 75 C 60 55, 75 45, 85 60 C 95 45, 110 55, 100 75 Z" fill="#65A30D" />
              <line x1="85" y1="60" x2="85" y2="75" stroke="#365314" strokeWidth="2" />
            </g>
          );
        case 'mini_crown':
          return (
            <g key={accId} pointerEvents="none">
              <polygon points="85,75 88,58 94,66 100,54 106,66 112,58 115,75" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="100" cy="54" r="2" fill="#DC2626" />
            </g>
          );
        case 'star_clip':
          return (
            <g key={accId} pointerEvents="none">
              <polygon points="65,65 68,72 75,73 70,78 72,85 65,81 58,85 60,78 55,73 62,72" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
            </g>
          );
        case 'heart_clip':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 68 76 C 60 68, 64 62, 68 66 C 72 62, 76 68, 68 76 Z" fill="#EF4444" />
            </g>
          );
        case 'glasses':
          return (
            <g key={accId} pointerEvents="none">
              <circle cx="82" cy="118" r="12" fill="none" stroke="#475569" strokeWidth="3" />
              <circle cx="118" cy="118" r="12" fill="none" stroke="#475569" strokeWidth="3" />
              <line x1="94" y1="118" x2="106" y2="118" stroke="#475569" strokeWidth="3" />
            </g>
          );
        case 'mini_hat':
          return (
            <g key={accId} pointerEvents="none">
              <ellipse cx="100" cy="72" rx="20" ry="6" fill="#3B82F6" />
              <path d="M 88 72 C 88 56, 112 56, 112 72 Z" fill="#2563EB" />
            </g>
          );
        case 'strawberry_hat':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 100 50 C 85 50, 85 75, 100 75 C 115 75, 115 50, 100 50 Z" fill="#F43F5E" />
              <polygon points="98,46 102,46 100,42" fill="#65A30D" />
            </g>
          );
        case 'bee_hat':
          return (
            <g key={accId} pointerEvents="none">
              <ellipse cx="100" cy="65" rx="16" ry="12" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
              <line x1="94" y1="55" x2="94" y2="75" stroke="#1E293B" strokeWidth="2.5" />
              <line x1="104" y1="55" x2="104" y2="75" stroke="#1E293B" strokeWidth="2.5" />
            </g>
          );
        case 'pearl_necklace':
          return (
            <g key={accId} pointerEvents="none">
              <circle cx="85" cy="155" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <circle cx="95" cy="158" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <circle cx="105" cy="158" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <circle cx="115" cy="155" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            </g>
          );
        case 'angel_wings':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 45 110 C 20 80, 25 60, 48 85 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M 155 110 C 180 80, 175 60, 152 85 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            </g>
          );
        case 'devil_horns':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 68 75 Q 60 50 55 45 Q 68 55 72 75 Z" fill="#DC2626" />
              <path d="M 132 75 Q 140 50 145 45 Q 132 55 128 75 Z" fill="#DC2626" />
            </g>
          );
        case 'rainbow_wings':
          return (
            <g key={accId} pointerEvents="none">
              <path d="M 45 110 C 15 80, 20 55, 48 85 Z" fill="url(#rainbowGrad)" />
              <path d="M 155 110 C 185 80, 180 55, 152 85 Z" fill="url(#rainbowGrad)" />
            </g>
          );
        case 'magic_wand':
          return (
            <g key={accId} pointerEvents="none">
              <line x1="135" y1="125" x2="160" y2="95" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
              <polygon points="160,95 163,89 170,89 165,94 167,100 161,97 155,100 157,94 152,89 159,89" fill="#FACC15" />
            </g>
          );
        case 'galaxy_crown':
          return (
            <g key={accId} pointerEvents="none">
              <polygon points="82,75 86,55 94,65 100,50 106,65 114,55 118,75" fill="url(#galaxyGrad)" stroke="#C084FC" strokeWidth="1.5" />
              <circle cx="100" cy="50" r="3" fill="#38BDF8" />
            </g>
          );
        case 'royal_crown':
          return (
            <g key={accId} pointerEvents="none">
              <polygon points="80,75 84,50 92,62 100,45 108,62 116,50 120,75" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="100" cy="45" r="3" fill="#DC2626" />
              <circle cx="84" cy="50" r="2.5" fill="#3B82F6" />
              <circle cx="116" cy="50" r="2.5" fill="#3B82F6" />
            </g>
          );
        default:
          return null;
      }
    });
  };

  // Rarity Aura
  const renderRarityAura = () => {
    if (!rarity) return null;
    switch (rarity) {
      case 'Rare':
        return <circle cx="100" cy="115" r="70" fill="none" stroke="#60A5FA" strokeWidth="3" opacity="0.3" strokeDasharray="8 6" className="animate-spin" style={{ animationDuration: '12s' }} />;
      case 'Epic':
        return <circle cx="100" cy="115" r="72" fill="none" stroke="#C084FC" strokeWidth="4" opacity="0.4" strokeDasharray="10 8" className="animate-spin" style={{ animationDuration: '10s' }} />;
      case 'Legendary':
        return <circle cx="100" cy="115" r="74" fill="none" stroke="#FBBF24" strokeWidth="5" opacity="0.6" strokeDasharray="12 6" className="animate-spin" style={{ animationDuration: '8s' }} />;
      case 'Secret':
        return <circle cx="100" cy="115" r="76" fill="none" stroke="url(#rainbowGrad)" strokeWidth="6" opacity="0.8" strokeDasharray="6 4" className="animate-spin" style={{ animationDuration: '6s' }} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      onPointerDown={handlePointerDown}
      style={{
        width: size,
        height: size,
        transform: isSquished ? 'scale(1.15, 0.82)' : 'scale(1, 1)',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      title={interactive ? 'Click to Squish! 🐾' : undefined}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="overflow-visible filter drop-shadow-md"
      >
        <defs>
          {/* Main Color Gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>

          {/* Rainbow Gradient */}
          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="75%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          {/* Galaxy Gradient */}
          <linearGradient id="galaxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B0764" />
            <stop offset="50%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Gold Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Pattern for Marble / Swirl */}
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={primaryColor} />
            <path d="M 0 20 Q 10 5, 20 20 T 40 20" fill="none" stroke={secondaryColor} strokeWidth="8" opacity="0.7" />
            <circle cx="10" cy="30" r="6" fill={secondaryColor} opacity="0.5" />
            <circle cx="30" cy="10" r="5" fill={secondaryColor} opacity="0.5" />
          </pattern>
        </defs>

        {/* Aura */}
        {renderRarityAura()}

        {/* Squishy Base Body */}
        {renderShapeBody()}

        {/* Cute Soft Highlights on Top */}
        <ellipse cx="80" cy="85" rx="14" ry="7" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 80 85)" pointerEvents="none" />

        {/* Face */}
        {renderFace()}

        {/* Accessories */}
        {renderAccessories()}

        {/* Packaging */}
        {renderPackagingBox()}
      </svg>
    </div>
  );
};
