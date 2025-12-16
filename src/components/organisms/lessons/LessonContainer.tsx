// src/components/organisms/lessons/LessonContainer.tsx

import React, { useState, useEffect } from 'react';
// اصلاح: ایمپورت Lesson و MixedContent به جای Level
import { Lesson, MixedContent } from '../../../types';
import { VideoLesson } from './VideoLesson';
import { QuizLesson } from './QuizLesson';
import { PracticeLesson } from './PracticeLesson';
import { ChevronRight } from 'lucide-react';

interface LessonContainerProps {
  // اصلاح: استفاده از تایپ Lesson
  level: Lesson; 
  onComplete: (score?: number, stars?: 1 | 2 | 3 | 4 | 5) => void;
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ level: lesson, onComplete }) => {
  const [stageIndex, setStageIndex] = useState(0);

  // Reset stage when lesson ID changes
  useEffect(() => {
    setStageIndex(0);
  }, [lesson.id]);

  // --- Helper to render a single stage ---
  const renderStage = (type: string, content: any, titleOverride?: string, handleNext?: () => void) => {
    switch (type) {
      case 'video':
        return (
          <VideoLesson
            title={titleOverride || lesson.title}
            // در ساختار جدید، توضیحات یا در خود کانتنت است یا در مشخصات درس
            description={content?.tip || content?.description || lesson.description}
            onComplete={() => (handleNext ? handleNext() : onComplete(100, 5))}
          />
        );
      case 'quiz':
        return (
          <QuizLesson
            question={content?.question || ''}
            options={content?.options || []}
            correctIndex={content?.correctIndex ?? 0}
            onComplete={() => (handleNext ? handleNext() : onComplete(100, 5))}
          />
        );
      case 'practice':
        return (
          <PracticeLesson
            content={content}
            onComplete={() => (handleNext ? handleNext() : onComplete(undefined, undefined))}
          />
        );
      default:
        return <div className="text-white text-center mt-10">نوع محتوا پشتیبانی نمی‌شود: {type}</div>;
    }
  };

  // --- Handle Mixed Lessons (Multi-stage) ---
  if (lesson.type === 'mixed') {
    // کست کردن محتوا به MixedContent
    const mixedContent = lesson.content as MixedContent;
    const stages = mixedContent?.stages || [];
    const currentStage = stages[stageIndex];
    
    // جلوگیری از تقسیم بر صفر
    const progressPercent = stages.length > 0 ? ((stageIndex) / stages.length) * 100 : 0;

    const handleStageComplete = () => {
      if (stageIndex < stages.length - 1) {
        setStageIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    };

    const handlePreviousStage = () => {
      if (stageIndex > 0) {
        setStageIndex(prev => prev - 1);
      }
    };

    if (!currentStage) return <div className="text-white">Error loading stage</div>;

    return (
      <div className="flex flex-col h-full w-full relative">
        {/* Stage Progress Bar */}
        <div className="w-full px-6 mb-4 flex items-center gap-2">
          {stageIndex > 0 && (
            <button
              onClick={handlePreviousStage}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
              aria-label="Previous Stage"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>مرحله {stageIndex + 1} از {stages.length}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Render Current Stage */}
        <div className="flex-1" key={stageIndex}>
          {renderStage(
            currentStage.type, 
            currentStage.content, 
            currentStage.title, 
            handleStageComplete
          )}
        </div>
      </div>
    );
  }

  // --- Handle Single Lessons (Simple) ---
  // در ساختار جدید، lesson.content مستقیماً محتوای مربوطه (ویدیو/تمرین/...) است
  return (
    <div className="h-full w-full" key={lesson.id}>
      {renderStage(lesson.type, lesson.content)}
    </div>
  );
};