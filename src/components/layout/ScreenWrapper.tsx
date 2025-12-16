//src/components/layout/ScreenWrapper.tsx

import React from 'react';
import { Sparkles } from 'lucide-react';

interface ScreenWrapperProps {
  children?: React.ReactNode;
  noPad?: boolean;
  theme?: 'stage' | 'default' | 'shop';
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, noPad = false, theme = 'stage' }) => {
  const bgClass = theme === 'stage'
    ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0f172a] to-[#020617]'
    : theme === 'shop'
      ? 'bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950'
      : 'bg-[#1a0b2e]';

  return (
    <div className={`min-h-screen w-full max-w-md mx-auto relative overflow-hidden ${bgClass} text-white`}>

      {/* Ambient Stage Lights */}
      {theme === 'stage' && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </>
      )}

      {/* Particles for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Sparkles className="absolute top-20 right-10 text-white w-4 h-4 animate-pulse" />
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
      </div>

      <div className={`${noPad ? '' : 'p-6'} relative z-10 h-full flex flex-col`}>
        {children}
      </div>
    </div>
  );
};