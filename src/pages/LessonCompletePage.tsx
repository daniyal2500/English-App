// src/pages/LessonCompletePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Gem } from 'lucide-react';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { PandaMascot } from '../components/ui/PandaMascot';
import { Button } from '../components/atoms/Button';
import { useAppStore } from '../store/useAppStore';

export const LessonCompletePage: React.FC = () => {
   const navigate = useNavigate();
   // اضافه کردن days به استور برای بررسی وضعیت روز
   const { activeLesson, user, days } = useAppStore();

   const handleContinue = () => {
      // اگر به هر دلیلی درس فعال نبود (محض اطمینان)، برو خانه
      if (!activeLesson) {
         navigate('/home');
         return;
      }

      // 1. پیدا کردن روزِ مربوط به این درس
      const currentDay = days.find(d => d.id === activeLesson.dayId);

      // اگر روز پیدا نشد (نباید اتفاق بیفتد)، برو خانه
      if (!currentDay) {
         navigate('/home');
         return;
      }

      // 2. بررسی اینکه آیا "کل" درس‌های این روز تکمیل شده‌اند؟
      // لاجیک: آیا برای تک‌تک درس‌های این روز، رکوردی در لیست تکمیل‌شده‌های کاربر وجود دارد؟
      const isDayFullyComplete = currentDay.lessons.every(lesson =>
         user.completedLessons.some(completed => completed.lessonId === lesson.id)
      );

      // 3. تصمیم‌گیری برای نویگیشن
      if (isDayFullyComplete) {
         // اگر روز تمام شده، برگرد به نقشه اصلی (تا روز بعدی باز شود)
         console.log("Day completed! Going to Main Map.");
         navigate('/home');
      } else {
         // اگر هنوز درس‌هایی در این روز باقی مانده، برگرد به ساب‌رودمپ
         console.log("More lessons remain. Going back to Day Level.");
         navigate(`/day/${activeLesson.dayId}`);
      }
   };

   return (
      <ScreenWrapper theme="stage">
         <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-8 relative">
               <div className="absolute inset-0 bg-yellow-500/30 blur-[60px] rounded-full"></div>
               <PandaMascot mood="excited" />
            </div>

            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2 drop-shadow-sm">براوو!</h2>
            <p className="text-slate-300 mb-8 text-lg">اجرای امروزت فوق‌العاده بود</p>

            <div className="grid grid-cols-2 gap-4 w-full mb-6">
               <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                  <span className="text-slate-400 text-xs mb-1 uppercase tracking-wider">امتیاز تجربه</span>
                  <span className="text-2xl font-bold text-purple-400 drop-shadow-md">
                     +{activeLesson?.xpReward || 10} XP
                  </span>
               </div>
               <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                  <span className="text-slate-400 text-xs mb-1 uppercase tracking-wider">دقت ریتم</span>
                  <span className="text-2xl font-bold text-green-400 drop-shadow-md">%۹۵</span>
               </div>
            </div>

            {/* Daily Streak Bonus Card */}
            <div className="w-full bg-gradient-to-r from-orange-900/40 to-red-900/40 p-4 rounded-2xl border border-orange-500/30 flex items-center justify-between mb-12 shadow-[0_0_30px_rgba(234,88,12,0.1)]">
               <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl text-white shadow-lg">
                     <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-right">
                     <h3 className="font-bold text-orange-200">رکورد آتشین</h3>
                     <p className="text-xs text-orange-200/60">استریک {user.streak} روزه!</p>
                  </div>
               </div>
               <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                  <span className="text-xl font-bold text-orange-400">+5</span>
                  <Gem className="w-4 h-4 text-blue-400 fill-blue-400" />
               </div>
            </div>

            {/* دکمه با لاجیک جدید */}
            <Button fullWidth onClick={handleContinue}>
               ادامه
            </Button>
         </div>
      </ScreenWrapper>
   );
};