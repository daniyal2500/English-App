//src/pages/ProfilePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, Gem } from 'lucide-react';
import { BottomNav } from '../components/organisms/BottomNav';
import { useAppStore } from '../store/useAppStore';

export const ProfilePage: React.FC = () => {
   const navigate = useNavigate();
   const { user } = useAppStore();

   return (
      <div className="pb-24 pt-10 min-h-screen bg-gradient-to-br from-indigo-800 to-slate-900 max-w-md mx-auto text-white">
         <div className="p-6 mb-4 flex flex-col items-center relative">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

            <div className="w-28 h-28 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center p-1 shadow-2xl mb-4 relative z-10">
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-transparent">
                  <span className="text-4xl font-bold text-white">{user.name.charAt(0)}</span>
               </div>
               <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-900"></div>
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <span className="text-slate-500 text-sm mt-1">هنرجوی سطح مقدماتی</span>
         </div>

         <div className="px-4 space-y-4">
            <div className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-2xl">
                     <Flame className="text-orange-500 w-6 h-6 fill-orange-500" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-200">تمرین مستمر</h3>
                     <p className="text-xs text-slate-500 mt-0.5">{user.streak} روز پشت سر هم</p>
                  </div>
               </div>
               <span className="text-2xl font-black text-white/90">{user.streak}</span>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl">
                     <Trophy className="text-yellow-500 w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-200">لیگ هفتگی</h3>
                     <p className="text-xs text-slate-500 mt-0.5">سطح یاقوت</p>
                  </div>
               </div>
               <span className="text-2xl font-black text-white/90">#۵</span>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 backdrop-blur-sm mt-6">
               <h3 className="font-bold mb-4 text-slate-300 text-sm uppercase tracking-wider">جعبه ابزار من</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col gap-2">
                     <span className="text-slate-500 text-xs">مجموع XP</span>
                     <span className="font-bold text-xl text-purple-400">{user.xp}</span>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col gap-2">
                     <span className="text-slate-500 text-xs">الماس‌ها</span>
                     <span className="font-bold text-xl text-blue-400 flex items-center gap-1">
                        {user.gems} <Gem size={14} className="fill-current" />
                     </span>
                  </div>
               </div>
            </div>
         </div>

         <BottomNav currentScreen="profile" onNavigate={(screen) => navigate(`/${screen === 'home' ? 'home' : screen}`)} />
      </div>
   );
};