import React, { useState } from 'react';
import { Squishy } from '../../types/game';
import { SquishyRenderer } from '../common/SquishyRenderer';
import { audioService } from '../../services/audioService';
import { X, Share2, Copy, Check, Sparkles, Smartphone } from 'lucide-react';
import { SHAPES_DATA } from '../../data/shapes';
import { COLORS_DATA } from '../../data/colors';
import { PACKAGING_DATA } from '../../data/packaging';

interface ShareCardModalProps {
  squishy?: Squishy;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ squishy, onClose }) => {
  const [copied, setCopied] = useState(false);

  const gameUrl = window.location.origin;

  const shapeName = squishy ? SHAPES_DATA.find(s => s.id === squishy.shapeId)?.name : 'Squishy';
  const colorName = squishy ? COLORS_DATA.find(c => c.id === squishy.colorId)?.name : 'Pastel';
  const packagingName = squishy ? PACKAGING_DATA.find(p => p.id === squishy.packagingId)?.name : 'Box';

  const shareText = squishy
    ? `Lihat Squishy buatanku di Matcha Lab! 🍵✨\n"${squishy.name}" (${squishy.rarity} - 🪙 ${squishy.value} Coins)!\nAyo mainkan game Squishy Factory: Matcha Lab di:`
    : `Ayo mainkan game Squishy Factory: Matcha Lab! 🍵✨ Buat squishy lucu, hias kamar, dan koleksi semuanya! Mainkan gratis di:`;

  const handleShareNative = async () => {
    audioService.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Squishy Factory: Matcha Lab',
          text: shareText,
          url: gameUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    audioService.playPop();
    navigator.clipboard.writeText(`${shareText} ${gameUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate QR Code URL via public SVG QR API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(gameUrl)}&color=4A3E3D&bgcolor=FFFDF9`;

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2424]/65 backdrop-blur-xs flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="bg-[#FFFDF9] border-4 border-[#A8C686] rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-5 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-bold text-[#4D7C0F] bg-[#EAF3DE] px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={13} /> {squishy ? 'Squishy Card' : 'Share Game'}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Collectible Visual Card */}
        {squishy ? (
          <div className="w-full bg-gradient-to-b from-[#FFFDF9] via-[#FDF8F2] to-[#EAF3DE] border-3 border-[#A8C686] rounded-3xl p-4 shadow-md flex flex-col items-center gap-3 relative overflow-hidden">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#7BA05B]">
              ★ MATCHA LAB COLLECTOR CARD ★
            </div>

            <div className="py-2">
              <SquishyRenderer
                shapeId={squishy.shapeId}
                colorId={squishy.colorId}
                faceId={squishy.faceId}
                accessoryIds={squishy.accessoryIds}
                packagingId={squishy.packagingId}
                rarity={squishy.rarity}
                size={120}
                showPackaging={true}
              />
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <h4 className="font-display font-bold text-lg text-[#3B342F]">
                {squishy.name}
              </h4>
              <span className="text-xs font-bold text-[#BE123C] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                {squishy.rarity} • 🪙 {squishy.value} Coins
              </span>
            </div>

            <div className="w-full bg-white/90 rounded-xl p-2 text-[11px] text-[#6B5E52] flex justify-around border border-[#E8DCCF]">
              <span>Shape: <b>{shapeName}</b></span>
              <span>Color: <b>{colorName}</b></span>
            </div>
          </div>
        ) : (
          <div className="w-full bg-gradient-to-b from-[#FFFDF9] to-[#F3F9ED] border-2 border-[#A8C686] rounded-3xl p-4 flex flex-col items-center gap-3">
            <span className="text-5xl">📱</span>
            <h4 className="font-display font-bold text-lg text-[#3B342F]">
              Mainkan di HP Anak Anda!
            </h4>
            <p className="text-xs text-[#7A6C60] leading-relaxed">
              Scan kode QR di bawah ini menggunakan kamera HP anak Anda, atau bagikan link langsung via WhatsApp!
            </p>

            {/* QR Code image */}
            <div className="p-2 bg-white rounded-2xl border-2 border-[#D6E8C2] shadow-xs">
              <img
                src={qrCodeUrl}
                alt="QR Code to Play"
                width={130}
                height={130}
                className="rounded-xl"
                loading="lazy"
              />
            </div>
            <span className="text-[10px] font-bold text-[#65A30D]">
              Scan dengan Kamera HP 📷
            </span>
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleShareNative}
            className="w-full py-3 bg-gradient-to-r from-[#8DAF66] to-[#7BA05B] hover:from-[#7BA05B] hover:to-[#65A30D] text-white font-display font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Share2 size={16} /> Bagikan ke WhatsApp / HP 💬
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 bg-[#FDF8F2] border border-[#E5D7C5] hover:bg-[#F7EFE6] text-xs font-bold text-[#4A3E3D] rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            {copied ? 'Link Berhasil Disalin! ✓' : 'Salin Link Game'}
          </button>
        </div>

        {/* PWA / Add to Home Screen Note */}
        <div className="p-3 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] text-left text-[11px] text-[#1E40AF] flex items-start gap-2">
          <Smartphone size={16} className="shrink-0 mt-0.5" />
          <p className="leading-snug">
            <b>Tips:</b> Buka link di browser HP (Chrome/Safari), lalu pilih menu <b>"Add to Home Screen"</b> (Tambahkan ke Layar Utama) agar game terpasang seperti aplikasi sungguhan!
          </p>
        </div>
      </div>
    </div>
  );
};
