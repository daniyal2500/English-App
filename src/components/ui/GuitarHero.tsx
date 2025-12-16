//src/components/ui/GuitarHero.tsx

import React from 'react';
import { Music } from 'lucide-react';

export const GuitarHero: React.FC = () => (
  <div className="relative w-64 h-64 mx-auto mb-8 animate-float z-10">
    {/* Glow Effects behind the guitar */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/30 blur-[60px] rounded-full"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[40px] rounded-full animate-pulse"></div>

    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl filter brightness-110">
       <defs>
         <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
           <stop offset="50%" stopColor="#8b5cf6" /> {/* Purple */}
           <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
         </linearGradient>
         <linearGradient id="neckGradient" x1="0%" y1="100%" x2="0%" y2="0%">
           <stop offset="0%" stopColor="#1f2937" />
           <stop offset="100%" stopColor="#4b5563" />
         </linearGradient>
       </defs>
       
       {/* Guitar Body - Abstract Modern Shape */}
       <path d="M 60 140 C 40 120, 40 80, 70 60 C 80 50, 100 50, 110 60 L 130 80 C 150 100, 150 140, 120 160 C 100 180, 80 160, 60 140 Z" fill="url(#bodyGradient)" opacity="0.9" />
       
       {/* Sound Hole / Pickups area */}
       <circle cx="95" cy="110" r="18" fill="#0f172a" stroke="#ffffff30" strokeWidth="2" />
       
       {/* Neck */}
       <rect x="88" y="-20" width="14" height="120" transform="rotate(-45 95 110)" fill="url(#neckGradient)" rx="2" />
       
       {/* Headstock */}
       <path d="M 15 25 L 35 5 L 45 15 L 25 35 Z" fill="#0f172a" stroke="#4b5563" strokeWidth="1" />
       
       {/* Strings */}
       <line x1="20" y1="30" x2="90" y2="105" stroke="#9ca3af" strokeWidth="0.5" opacity="0.6" />
       <line x1="23" y1="27" x2="93" y2="102" stroke="#9ca3af" strokeWidth="0.5" opacity="0.6" />
       <line x1="26" y1="24" x2="96" y2="99" stroke="#9ca3af" strokeWidth="0.5" opacity="0.6" />
       
       {/* Music Notes Floating */}
       <g className="animate-bounce-slow" style={{ animationDelay: '1s' }}>
          <Music x="140" y="40" size={20} className="text-pink-400" strokeWidth={3} />
       </g>
       <g className="animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
          <Music x="30" y="140" size={15} className="text-blue-400" strokeWidth={3} />
       </g>
    </svg>
  </div>
);