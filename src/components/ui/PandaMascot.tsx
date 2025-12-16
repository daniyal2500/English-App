//src/components/ui/PandaMascot.tsx

import React from 'react';

interface PandaMascotProps {
  mood?: 'happy' | 'talking' | 'excited';
}

export const PandaMascot: React.FC<PandaMascotProps> = ({ mood = 'happy' }) => (
  <div className="relative w-24 h-24 mx-auto mb-2 animate-bounce-slow z-10">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
       <circle cx="50" cy="50" r="45" fill="#f3e5f5" /> 
       <circle cx="30" cy="35" r="10" fill="#2e0249" /> 
       <circle cx="70" cy="35" r="10" fill="#2e0249" /> 
       <circle cx="32" cy="34" r="3" fill="white" />
       <circle cx="68" cy="34" r="3" fill="white" />
       <ellipse cx="50" cy="55" rx="6" ry="4" fill="#a91079" />
       <path d="M 40 70 Q 50 80 60 70" stroke="#2e0249" strokeWidth="3" fill="none" />
       {/* Headphones for music vibe */}
       <path d="M 10 50 C 10 20, 90 20, 90 50" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
       <rect x="2" y="40" width="12" height="25" rx="4" fill="#1d4ed8" />
       <rect x="86" y="40" width="12" height="25" rx="4" fill="#1d4ed8" />
    </svg>
  </div>
);