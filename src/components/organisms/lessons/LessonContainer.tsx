// src/components/organisms/lessons/LessonContainer.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Lesson } from '../../../types';
import { validateLessonContent } from '../../../schemas/contentSchema';
import { VideoLesson } from './VideoLesson';
import { QuizLesson } from './QuizLesson';
import { PracticeLesson } from './PracticeLesson';
// نکته: در فاز بعدی ScrollingTab رو آپدیت میکنیم، فعلا از همون که هست استفاده میکنیم
// یا اگر ارور داد فعلا کامنتش کن تا فاز ۳
import { ScrollingTab } from './ScrollingTab'; 
import { ChevronRight, AlertTriangle } from 'lucide-react';

interface LessonContainerProps {
  level: Lesson; 
  onComplete: (score?: number, stars?: 1 | 2 | 3 | 4 | 5) => void;
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ level: lesson, onComplete }) => {
  // استیت برای مدیریت مراحل درس‌های ترکیبی
  const [stageIndex, setStageIndex] = useState(0);
  
  // استیت برای دیتای ولیدیت شده
  const [validatedContent, setValidatedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Validation Logic (قلب تپنده امنیت)
  useEffect(() => {
    try {
      // اگر درس ترکیبی (Mixed) باشد
      if (lesson.type === 'mixed') {
        const rawContent = lesson.content as any;
        // چک میکنیم که آرایه stages وجود داشته باشه
        if (!rawContent.stages || !Array.isArray(rawContent.stages)) {
          throw new Error("Invalid Mixed Content: 'stages' array is missing.");
        }
        // تک تک استیج‌ها رو ولیدیت میکنیم
        const validStages = rawContent.stages.map((stage: any, idx: number) => {
           const validData = validateLessonContent(stage.type, stage.content);
           return { ...stage, content: validData };
        });
        setValidatedContent({ stages: validStages });
      } 
      // درس‌های معمولی
      else {
        const validData = validateLessonContent(lesson.type, lesson.content);
        setValidatedContent(validData);
      }
      setError(null);
    } catch (err) {
      console.error("Content Validation Error:", err);
      setError("فرمت محتوای درس نامعتبر است. لطفاً با پشتیبانی تماس بگیرید.");
    }
    // ریست کردن استیج وقتی درس عوض میشه
    setStageIndex(0);
  }, [lesson]);

  // اگر ارور داشتیم (فرمت جیسون غلط بود)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center">
        <AlertTriangle size={48} className="mb-4 opacity-80" />
        <h3 className="font-bold text-lg mb-2">خطا در بارگذاری درس</h3>
        <p className="text-sm opacity-70">{error}</p>
        <p className="text-xs mt-4 font-mono bg-black/20 p-2 rounded">Lesson ID: {lesson.id}</p>
      </div>
    );
  }

  if (!validatedContent) return <div className="text-white text-center mt-20">در حال پردازش...</div>;

  // --- مدیریت نویگیشن بین مراحل (برای Mixed) ---
  
  // استخراج دیتای مرحله فعلی
  let currentType = lesson.type;
  let currentContent = validatedContent;
  let currentTitle = lesson.title;
  let totalStages = 1;

  if (lesson.type === 'mixed') {
    const stages = validatedContent.stages;
    const currentStage = stages[stageIndex];
    currentType = currentStage.type;
    currentContent = currentStage.content;
    currentTitle = currentStage.title || lesson.title; // اگر استیج تایتل نداشت، تایتل کلی رو نشون بده
    totalStages = stages.length;
  }

  // تابعی که وقتی یک مرحله (یا کل درس) تموم میشه صدا زده میشه
  const handleStageComplete = (score: number = 100, stars: 1 | 2 | 3 | 4 | 5 = 5) => {
    if (lesson.type === 'mixed') {
      if (stageIndex < totalStages - 1) {
        // رفتن به مرحله بعد
        setStageIndex(prev => prev + 1);
      } else {
        // کل درس تموم شد
        onComplete(score, stars);
      }
    } else {
      // درس تک مرحله‌ای بود و تموم شد
      onComplete(score, stars);
    }
  };

  // --- رندر کننده هوشمند (The Renderer Switch) ---
  const renderContent = () => {
    switch (currentType) {
      case 'video':
        return (
          <VideoLesson
            title={currentTitle}
            description={currentContent.description || currentContent.tip || "ویدیوی آموزشی"}
            onComplete={() => handleStageComplete()}
          />
        );

      case 'quiz':
        return (
          <QuizLesson
            question={currentContent.question}
            options={currentContent.options}
            correctIndex={currentContent.correctIndex}
            onComplete={() => handleStageComplete()}
          />
        );

      case 'practice':
        // اینجا جادو اتفاق میفته: تشخیص نوع تمرین
        if (currentContent.mode === 'scrolling') {
          return (
            <ScrollingTab
              sequence={currentContent.notes || currentContent.sequence} 
              tempo={currentContent.bpm}
              // ✅ خط زیر رو حتما اضافه کن:
              backingTrackUrl={currentContent.backingTrackUrl} 
              onComplete={() => handleStageComplete()}
            />
          );
        } else {
          // حالت استاتیک (آکورد یا تمرین ساده)
          return (
            <PracticeLesson
              content={currentContent}
              onComplete={() => handleStageComplete()}
            />
          );
        }

      default:
        return <div>نوع محتوا پشتیبانی نمی‌شود: {currentType}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Progress Bar (فقط اگر درس چند مرحله‌ای باشه نشون میدیم) */}
      {totalStages > 1 && (
        <div className="w-full px-6 mb-4 flex items-center gap-2 pt-4">
          {stageIndex > 0 && (
            <button
              onClick={() => setStageIndex(prev => prev - 1)}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>مرحله {stageIndex + 1}</span>
              <span>{Math.round(((stageIndex) / totalStages) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${((stageIndex + 1) / totalStages) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Render Current Stage */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};