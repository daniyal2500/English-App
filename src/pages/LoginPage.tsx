//src/pages/LoginPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Guitar as GuitarIcon, Mic2 } from 'lucide-react';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Button } from '../components/atoms/Button';
import { useAppStore } from '../store/useAppStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);

  const handleLogin = (isGuest: boolean) => {
    login(isGuest);
    navigate('/home');
  };

  return (
    <ScreenWrapper theme="stage">
      <div className="flex flex-col h-full">
        <button onClick={() => navigate('/')} className="self-start mb-8 text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(124,58,237,0.3)] transform rotate-3">
            <GuitarIcon className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-white">ورود به بک‌استیج</h2>
          <p className="text-slate-400 mb-8 text-sm">شماره موبایلت رو وارد کن تا پروفایلت رو پیدا کنیم</p>

          <div className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Mic2 className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="tel"
                placeholder="شماره موبایل (مثلاً ۰۹۱۲)"
                className="w-full bg-slate-800/50 backdrop-blur-md p-4 pr-12 rounded-2xl border border-slate-700 text-right focus:border-purple-500 focus:bg-slate-800 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-white placeholder-slate-500 font-mono"
                dir="rtl"
              />
            </div>

            <Button fullWidth onClick={() => handleLogin(false)}>ادامه</Button>
          </div>

          <button
            onClick={() => handleLogin(true)}
            className="mt-8 text-slate-500 font-medium text-sm hover:text-purple-300 transition-colors border-b border-transparent hover:border-purple-300 pb-0.5"
          >
            ورود به عنوان مهمان
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};