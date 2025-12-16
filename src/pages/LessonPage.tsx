// src/pages/LessonPage.tsx

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Heart } from 'lucide-react';
import { LessonContainer } from '../components/organisms/lessons/LessonContainer';
import { useAppStore } from '../store/useAppStore';

export const LessonPage: React.FC = () => {
  const navigate = useNavigate();
  // 1. تغییر نام پارامتر URL به lessonId (مطابق App.tsx)
  const { lessonId } = useParams<{ lessonId: string }>();
  
  // 2. استفاده از متغیرها و توابع جدید استور
  const { activeLesson, completeLesson, days, setActiveLesson } = useAppStore();

  // لاجیک پیدا کردن درس از داخل روزها (چون ساختار تو در تو شده)
  useEffect(() => {
    // اگر درس فعال نداریم ولی ID در URL هست، پیدایش کن
    if (!activeLesson && lessonId && days.length > 0) {
      const targetId = parseInt(lessonId);
      
      let foundLesson = null;
      
      // جستجو در تمام روزها
      for (const day of days) {
        const match = day.lessons.find(l => l.id === targetId);
        if (match) {
          foundLesson = match;
          break; // پیدا شد، حلقه را متوقف کن
        }
      }

      if (foundLesson) {
        setActiveLesson(foundLesson);
      }
    }
  }, [activeLesson, lessonId, days, setActiveLesson]);

  const handleComplete = (score: number = 100, stars: 1 | 2 | 3 | 4 | 5 = 5) => {
    // 3. استفاده از متد جدید تکمیل درس
    completeLesson(score, stars);
    navigate('/lesson-complete');
  };

  if (!activeLesson) return null;

  return (
    <div className="flex flex-col h-screen bg-[#1e1b4b] text-white max-w-md mx-auto">
      {/* Lesson Header */}
      <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-[#0f172a] z-20 shadow-md">
        <button onClick={() => navigate('/home')}>
          <X className="w-6 h-6 text-slate-400 hover:text-white transition-colors" />
        </button>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-2/3 rounded-full shadow-[0_0_10px_#f806cc] animate-pulse"></div>
        </div>
        <Heart className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-lg" />
      </div>

      {/* Dynamic Lesson Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-gradient-to-b from-[#1e1b4b] to-[#0f172a]">
        <LessonContainer
          // اینجا از as any استفاده می‌کنیم چون تایپ LessonContainer هنوز آپدیت نشده
          // اما ساختار activeLesson دقیقاً همان چیزی است که نیاز دارد
          level={activeLesson as any}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};