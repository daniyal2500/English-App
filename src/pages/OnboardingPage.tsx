//src/pages/OnboardingPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { GuitarHero } from '../components/ui/GuitarHero';
import { Button } from '../components/atoms/Button';
import { useAppStore } from '../store/useAppStore';
import { LanguageSwitcher } from '../components/molecules/LanguageSwitcher';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const { t } = useTranslation();

  const handleStart = () => {
    login(false);
    navigate('/home');
  };

  return (
    <ScreenWrapper theme="stage">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center justify-end h-full pb-10 text-center">

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <GuitarHero />

          <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg tracking-tight">
            {t('onboarding.title')}
          </h1>
          <p className="text-lg text-slate-300 font-medium tracking-wide">
            {t('onboarding.subtitle')}
          </p>
        </div>

        <div className="w-full space-y-4 backdrop-blur-sm bg-slate-900/40 p-6 rounded-3xl border border-white/5 shadow-2xl">
          <Button fullWidth onClick={handleStart} className="shadow-purple-500/20">
            {t('onboarding.startButton')}
          </Button>
          <Button fullWidth variant="outline" onClick={() => navigate('/login')} className="border-slate-600 text-slate-300 hover:bg-slate-800">
            {t('login.title')}
          </Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};