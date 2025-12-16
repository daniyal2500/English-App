// src/store/useAppStore.ts

import { create } from 'zustand';
import { User, Chapter, GameData, DayNode, Lesson } from '../types';

interface AppState {
  user: User;
  
  // دیتای اصلی بازی
  chapters: Chapter[];
  days: DayNode[]; // جایگزین levels شد
  
  // درس فعلی که کاربر در حال انجام آن است
  activeLesson: Lesson | null; 
  
  isLoading: boolean;
  isOffline: boolean;

  // Actions
  setUser: (user: User) => void;
  updateUser: (fn: (prev: User) => Partial<User>) => void;
  
  // ذخیره دیتای دریافتی از Supabase
  setGameContent: (data: GameData, isFallback: boolean) => void;
  
  setActiveLesson: (lesson: Lesson | null) => void;
  login: (isGuest: boolean) => void;

  // Gamification Actions
  completeLesson: (score: number, stars: 1 | 2 | 3 | 4 | 5) => void;
  decrementHearts: () => boolean;
  buyItem: (cost: number, itemType: 'heart' | 'freeze') => boolean;
  checkStreak: () => void;
  refillHearts: () => void;
}

const DEFAULT_USER: User = {
  name: '',
  isGuest: true,
  xp: 0,
  gems: 100,
  streak: 0,
  hearts: 5,
  maxHearts: 5,
  lastPracticeDate: null,
  streakFreeze: 0,
  currentLessonId: 1, // شناسه آخرین درس باز شده
  completedLessons: [], // لیست درس‌های تکمیل شده
  league: 'bronze'
};

export const useAppStore = create<AppState>((set, get) => ({
  user: DEFAULT_USER,
  chapters: [],
  days: [],
  activeLesson: null,
  isLoading: true,
  isOffline: false,

  setUser: (user) => set({ user }),

  updateUser: (fn) => set((state) => ({ user: { ...state.user, ...fn(state.user) } })),

  // ذخیره دیتای بازی (فصل‌ها و روزها)
  setGameContent: ({ chapters, days }, isFallback) => set({ 
    chapters, 
    days, 
    isOffline: isFallback, 
    isLoading: false 
  }),

  setActiveLesson: (lesson) => set({ activeLesson: lesson }),

  login: (isGuest) => set((state) => ({
    user: { ...state.user, isGuest, name: isGuest ? 'Guest' : 'Diana' }
  })),

  // لاجیک تکمیل درس و محاسبه پاداش
  completeLesson: (score, stars) => set((state) => {
    const { activeLesson, user } = state;
    if (!activeLesson) return {};

    // بررسی اینکه آیا قبلاً این درس را پاس کرده است؟
    const existingResult = user.completedLessons.find(r => r.lessonId === activeLesson.id);
    const isNewCompletion = !existingResult;
    
    // محاسبه درس بعدی (فعلا فرض بر ترتیب افزایشی ID است)
    // در سیستم پیشرفته‌تر باید order_index بعدی را پیدا کنیم
    const nextLessonId = activeLesson.id + 1;

    // محاسبه پاداش
    const xpEarned = activeLesson.xpReward * stars;
    const gemsEarned = (stars * 5) + (isNewCompletion ? 10 : 0);

    // آپدیت لیست درس‌های تکمیل شده
    let newCompletedLessons = [...user.completedLessons];
    if (existingResult) {
      // اگر قبلا پاس کرده، فقط اگر رکورد بهتری زد آپدیت کن
      if (score > existingResult.score) {
        newCompletedLessons = newCompletedLessons.map(r =>
          r.lessonId === activeLesson.id
            ? { ...r, stars, score, completedAt: new Date().toISOString() }
            : r
        );
      }
    } else {
      // رکورد جدید
      newCompletedLessons.push({
        lessonId: activeLesson.id,
        stars,
        score,
        completedAt: new Date().toISOString()
      });
    }

    // لاجیک استریک (Streak)
    const today = new Date().toISOString().split('T')[0];
    const lastPractice = user.lastPracticeDate ? user.lastPracticeDate.split('T')[0] : null;
    let newStreak = user.streak;
    let newLastPracticeDate = user.lastPracticeDate;

    if (today !== lastPractice) {
      newStreak += 1;
      newLastPracticeDate = new Date().toISOString();
    }

    return {
      user: {
        ...user,
        xp: user.xp + xpEarned,
        gems: user.gems + gemsEarned,
        streak: newStreak,
        lastPracticeDate: newLastPracticeDate,
        completedLessons: newCompletedLessons,
        // درس بعدی را باز کن (اگر جلوتر رفته باشیم)
        currentLessonId: Math.max(user.currentLessonId, nextLessonId)
      }
    };
  }),

  decrementHearts: () => {
    const { user } = get();
    if (user.hearts > 0) {
      const newHearts = user.hearts - 1;
      set({ user: { ...user, hearts: newHearts } });
      return newHearts > 0;
    }
    return false;
  },

  buyItem: (cost, itemType) => {
    const { user } = get();
    if (user.gems >= cost) {
      const updates: Partial<User> = { gems: user.gems - cost };
      if (itemType === 'heart') {
        updates.hearts = user.maxHearts;
      } else if (itemType === 'freeze') {
        updates.streakFreeze = user.streakFreeze + 1;
      }
      set({ user: { ...user, ...updates } });
      return true;
    }
    return false;
  },

  refillHearts: () => {
    const { user } = get();
    set({ user: { ...user, hearts: user.maxHearts } });
  },

  checkStreak: () => {
    const { user } = get();
    if (!user.lastPracticeDate) return;

    const today = new Date();
    const last = new Date(user.lastPracticeDate);
    // صفر کردن ساعت برای مقایسه دقیق روزها
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // اگر بیشتر از یک روز فاصله افتاده (یعنی دیروز تمرین نکرده)
      if (diffDays === 2 && user.streakFreeze > 0) {
        // استفاده از محافظ استریک
        set({
          user: {
            ...user,
            streakFreeze: user.streakFreeze - 1,
            // تاریخ آخرین تمرین را به "دیروز" تغییر می‌دهیم تا استریک حفظ شود
            lastPracticeDate: new Date(today.setDate(today.getDate() - 1)).toISOString()
          }
        });
      } else {
        // استریک سوخت
        set({ user: { ...user, streak: 0 } });
      }
    }
  }
}));