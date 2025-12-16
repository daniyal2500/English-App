//src/components/organisms/BottomNav.tsx

import React from 'react';
import { Route, Trophy, Store, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BottomNavProps {
  currentScreen: 'home' | 'lessons' | 'leaderboard' | 'profile' | 'shop';
  onNavigate: (screen: 'home' | 'lessons' | 'leaderboard' | 'profile' | 'shop') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', icon: Route, label: 'نقشه' },
    { id: 'leaderboard', icon: Trophy, label: 'لیدربرد' },
    { id: 'shop', icon: Store, label: 'فروشگاه' },
    { id: 'profile', icon: UserRound, label: 'پروفایل' },
  ] as const;

  return (
    <>
      {/* SVG Definitions for Gradients (Matching TopBar assets) */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {/* Map Gradient: Cyan/Blue (Fresh & Exploration) */}
          <linearGradient id="navMapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan-400 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
          </linearGradient>

          {/* Leaderboard Gradient: Fire (TopBar Fire) */}
          <linearGradient id="navFireGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />   {/* Red-500 */}
            <stop offset="50%" stopColor="#f97316" />   {/* Orange-500 */}
            <stop offset="100%" stopColor="#facc15" />  {/* Yellow-400 */}
          </linearGradient>

          {/* Shop Gradient: Gem (TopBar Gem) */}
          <linearGradient id="navGemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />   {/* Cyan-400 */}
            <stop offset="50%" stopColor="#3b82f6" />   {/* Blue-500 */}
            <stop offset="100%" stopColor="#6366f1" />  {/* Indigo-500 */}
          </linearGradient>

          {/* Profile Gradient: Heart (TopBar Heart) */}
          <linearGradient id="navHeartGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff7aa2" />   {/* Pinkish */}
            <stop offset="100%" stopColor="#e11d48" />  {/* Rose-600 */}
          </linearGradient>
        </defs>
      </svg>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-50">

        {/* Floating Glass Capsule */}
        <div className="relative w-full h-20 bg-[#0f172a]/30 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Top Gloss Reflection */}
          <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="flex items-center justify-between px-6 h-full relative z-10">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;

              // Gradient Selection
              let gradientUrl = "";
              let glowColor = "";

              switch (item.id) {
                case 'home':
                  gradientUrl = "url(#navMapGradient)";
                  glowColor = "bg-cyan-500";
                  break;
                case 'leaderboard':
                  gradientUrl = "url(#navFireGradient)";
                  glowColor = "bg-orange-500";
                  break;
                case 'shop':
                  gradientUrl = "url(#navGemGradient)";
                  glowColor = "bg-indigo-500";
                  break;
                case 'profile':
                  gradientUrl = "url(#navHeartGradient)";
                  glowColor = "bg-rose-500";
                  break;
              }

              const isStrokeIcon = item.id === 'home' || item.id === 'shop';

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative flex items-center justify-center w-14 h-14"
                >
                  {/* Active Spotlight/Glow Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className={`absolute inset-0 rounded-full opacity-20 blur-xl ${glowColor}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      y: isActive ? -4 : 0
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative z-10"
                  >
                    <item.icon
                      size={28}
                      strokeWidth={isActive && !isStrokeIcon ? 0 : 2}
                      fill={isActive && !isStrokeIcon ? gradientUrl : "none"}
                      stroke={isActive && isStrokeIcon ? gradientUrl : "currentColor"}
                      className={`
                         transition-colors duration-300
                         ${isActive ? 'drop-shadow-sm' : 'text-slate-400 stroke-slate-400'}
                       `}
                    />

                    {/* Inner 3D Highlight for Filled Icons */}
                    {isActive && !isStrokeIcon && (
                      <svg width="28" height="28" viewBox="0 0 24 24" className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="none" />
                        <path d="M7 6q-1 1-1 3" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-60" />
                      </svg>
                    )}
                  </motion.div>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDot"
                      className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${glowColor} shadow-[0_0_8px_currentColor]`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};