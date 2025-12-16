// src/constants.ts

import { DayNode, Chapter } from './types';

export const CAMPAIGN_DAYS = 100;

// 1. داده‌های تستی فصل‌ها
export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "شروع سفر 🎸",
    description: "اولین قدم‌ها برای آشنایی با گیتار",
    order: 1
  },
  {
    id: 2,
    title: "جادوی آکوردها ✨",
    description: "یادگیری آکوردهای پایه",
    order: 2
  }
];

// 2. داده‌های تستی روزها (شامل درس‌ها)
export const MOCK_DAYS: DayNode[] = [
  {
    id: 1,
    chapterId: 1,
    weekNumber: 1,
    dayNumber: 1,
    isLocked: false,
    isActive: true,
    isCompleted: false,
    stars: 0,
    lessons: [
      {
        id: 1,
        dayId: 1,
        orderIndex: 1,
        title: "اولین ملودی",
        description: "دست گرفتن ساز و شروع",
        type: 'video',
        xpReward: 10,
        content: {
          videoUrl: "intro-video-1",
          tip: "پیک را بین انگشت شست و اشاره نگه دارید."
        }
      },
      {
        id: 2,
        dayId: 1,
        orderIndex: 2,
        title: "سیم ششم",
        description: "تمرین دست باز",
        type: 'practice',
        xpReward: 15,
        content: {
          mode: 'static',
          instruction: "سیم ششم (ضخیم‌ترین سیم) را ۳ بار بنواز.",
          notes: [{ string: 6, fret: 0 }]
        }
      }
    ]
  },
  {
    id: 2,
    chapterId: 1,
    weekNumber: 1,
    dayNumber: 2,
    isLocked: true,
    isActive: false,
    isCompleted: false,
    stars: 0,
    lessons: [
      {
        id: 3,
        dayId: 2,
        orderIndex: 1,
        title: "گام دو ماژور",
        description: "تمرین گام C Major",
        type: 'practice',
        xpReward: 50,
        content: {
          mode: 'scrolling',
          instruction: "با سرعت آهسته، نت‌ها را بنوازید.",
          tempo: 40,
          sequence: [
            { string: 5, fret: 3, time: 1000 },
            { string: 4, fret: 0, time: 2000 },
            { string: 4, fret: 2, time: 3000 },
          ]
        }
      },
      {
        id: 4,
        dayId: 2,
        orderIndex: 2,
        title: "چالش تئوری",
        description: "آزمون دانش",
        type: 'quiz',
        xpReward: 20,
        content: {
          question: "کدام سیم صدای بم‌تری دارد؟",
          options: ["سیم ۱", "سیم ۳", "سیم ۶", "سیم ۴"],
          correctIndex: 2
        }
      }
    ]
  },
  {
    id: 3,
    chapterId: 2,
    weekNumber: 1,
    dayNumber: 1, // اولین روز از فصل ۲
    isLocked: true,
    isActive: false,
    isCompleted: false,
    stars: 0,
    lessons: [
      {
        id: 5,
        dayId: 3,
        orderIndex: 1,
        title: "آکورد Em",
        description: "انگشت‌گذاری صحیح",
        type: 'practice',
        xpReward: 15,
        content: {
          mode: 'static',
          instruction: "انگشت‌ها را مطابق تصویر روی فرت دوم قرار دهید.",
          notes: [
              { string: 5, fret: 2, finger: 2 },
              { string: 4, fret: 2, finger: 3 },
          ]
        }
      },
      {
        id: 6,
        dayId: 3,
        orderIndex: 2,
        title: "ریتم ۶/۸",
        description: "ریتم شاد ایرانی",
        type: 'video',
        xpReward: 20,
        content: {
          videoUrl: "rhythm-6-8",
          tip: "حرکت دست راست باید نرم باشد."
        }
      }
    ]
  }
];