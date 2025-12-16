//src/components/organisms/TopBar.tsx

import React from 'react';
import { Heart, Flame, Gem, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types';

interface TopBarProps {
  user: User;
}

export const TopBar: React.FC<TopBarProps> = ({ user }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* SVG Definitions for Realistic Gradients */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {/* Realistic Fire Gradient */}
          <linearGradient id="fireGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />   {/* Red-500 */}
            <stop offset="50%" stopColor="#f97316" />   {/* Orange-500 */}
            <stop offset="100%" stopColor="#facc15" />  {/* Yellow-400 */}
          </linearGradient>

          {/* Realistic Crystal Gem Gradient */}
          <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />   {/* Cyan-400 */}
            <stop offset="50%" stopColor="#3b82f6" />   {/* Blue-500 */}
            <stop offset="100%" stopColor="#6366f1" />  {/* Indigo-500 */}
          </linearGradient>

          {/* 3D Heart Gradient */}
          <linearGradient id="heartGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff7aa2" />   {/* Pinkish Highlight */}
            <stop offset="40%" stopColor="#ef4444" />   {/* Red Base */}
            <stop offset="100%" stopColor="#991b1b" />  {/* Dark Red Shadow */}
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Glass Capsule - 2025 Trend */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] h-16 z-50 max-w-sm">
        <div className="w-full h-full bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-between px-2 relative overflow-hidden">

          {/* Glossy reflection effect on top */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* --- LIVES (Left) --- */}
          <div className="flex items-center gap-2 pl-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full animate-pulse-glow"></div>
              <Heart
                className="w-7 h-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
                fill="url(#heartGradient)"
                stroke="none"
              />
              {/* Shine on heart */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]"></div>
            </div>
            <span className="font-black text-lg text-white drop-shadow-md font-sans">{user.hearts}</span>
          </div>

          {/* --- STREAK (Center - Prominent) --- */}
          <div className="flex flex-col items-center justify-center -mt-1">
            <div className="relative">
              {/* Fire Glow Behind */}
              <div className="absolute -inset-2 bg-orange-500/20 blur-xl rounded-full"></div>

              <Flame
                className="w-8 h-8 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-bounce-slow"
                fill="url(#fireGradient)"
                stroke="none"
              />
            </div>
            <span className="text-[10px] font-bold text-orange-200 uppercase tracking-widest -mt-1 drop-shadow-sm">
              {user.streak} روز
            </span>
          </div>

          {/* --- GEMS (Right) --- */}
          <div className="flex items-center gap-2 pr-2">
            <span className="font-black text-lg text-cyan-100 drop-shadow-md font-sans">{user.gems}</span>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full"></div>
              <Gem
                className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(34,211,238,0.4)]"
                fill="url(#gemGradient)"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.3}
              />
              {/* Plus button for IAP hint */}
              <div className="absolute -bottom-1 -right-1 bg-white/10 rounded-full p-0.5 border border-white/20">
                <Plus size={8} className="text-white" strokeWidth={4} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};