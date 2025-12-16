// src/App.tsx

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getGameContent } from './services/levelService'; 
import { useAppStore } from './store/useAppStore';

// Pages
import { OnboardingPage } from './pages/OnboardingPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { LessonCompletePage } from './pages/LessonCompletePage';
import { ProfilePage } from './pages/ProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ShopPage } from './pages/ShopPage';

// Lazy Load
const DayLevelPage = lazy(() => import('./pages/DayLevelPage').then(module => ({ default: module.DayLevelPage })));

const App: React.FC = () => {
  const setGameContent = useAppStore((state) => state.setGameContent);
  const isLoading = useAppStore((state) => state.isLoading);
  const checkStreak = useAppStore((state) => state.checkStreak);

  useEffect(() => {
    const fetchData = async () => {
      const { data, isFallback } = await getGameContent();
      setGameContent(data, isFallback);
    };
    fetchData();
    checkStreak();
  }, [setGameContent, checkStreak]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <span className="text-slate-400 text-sm animate-pulse">در حال آماده‌سازی استیج...</span>
        </div>
      </div>
    );
  }

  return (
    // 👇 تغییر مهم اینجاست: اضافه کردن future flags
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="antialiased font-vazir text-slate-200">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">Loading...</div>}>
          <Routes>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            {/* مسیر داینامیک برای روز */}
            <Route path="/day/:dayId" element={<DayLevelPage />} />
            {/* مسیر داینامیک برای درس */}
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/lesson-complete" element={<LessonCompletePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;