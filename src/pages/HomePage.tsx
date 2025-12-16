//src/pages/HomePage.tsx 

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../components/organisms/TopBar';
import { BottomNav } from '../components/organisms/BottomNav';
import { CampaignMap } from '../components/organisms/CampaignMap';
import { useAppStore } from '../store/useAppStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // اصلاح: حذف levels و setActiveLevel که دیگر وجود ندارند
  const { user } = useAppStore(); 
  const { t } = useTranslation();

  const handleOpenDay = (dayId: number) => {
    console.log(`Opening Day: ${dayId}`);
    navigate(`/day/${dayId}`);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto relative bg-[#1e1b4b] overflow-hidden flex flex-col">
      {/* Uplifting Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Brighter, more vibrant gradient base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#6366f1_0%,_#312e81_40%,_#020617_100%)]"></div>

        {/* Vibrant Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[60%] bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute top-[20%] left-[-20%] w-[60%] h-[50%] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-1000"></div>
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>
      
      <TopBar user={user} />

      {/* Campaign Map fills the remaining space */}
      <div className="absolute inset-0 z-10">
        {/* اصلاح: حذف پراپ‌های اضافی. کامپوننت خودش هوشمندانه دیتا را می‌خواند */}
        <CampaignMap onOpenDay={handleOpenDay} />
      </div>

      <BottomNav currentScreen="home" onNavigate={(screen) => navigate(`/${screen === 'home' ? 'home' : screen}`)} />
    </div>
  );
};