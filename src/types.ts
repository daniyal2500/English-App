// src/types.ts

// --- General App Types ---
export type Screen = 'onboarding' | 'login' | 'home' | 'lesson' | 'lesson-complete' | 'profile' | 'leaderboard';

// --- User & Progress Types ---
export interface LessonResult {
  lessonId: number; // شناسه درس تکمیل شده
  stars: 1 | 2 | 3 | 4 | 5;
  score: number;
  completedAt: string; // ISO Date
}

export interface User {
  id?: string; // Supabase Auth ID
  name: string;
  isGuest: boolean;
  xp: number;
  gems: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  lastPracticeDate: string | null;
  streakFreeze: number;
  
  // آخرین درسی که کاربر مجاز به دیدن آن است (یا آخرین درس تکمیل شده)
  currentLessonId: number; 
  
  // لیست تمام درس‌های تکمیل شده
  completedLessons: LessonResult[]; 
  
  league: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

// --- Music & Content Types ---
export interface NotePosition {
  string: number; // 1 (High E) to 6 (Low E)
  fret: number;   // 0 (Open) to 12
  finger?: number; // 1 (Index) to 4 (Pinky)
}

export interface TabNote extends NotePosition {
  time: number; // زمان اجرا به میلی‌ثانیه
  duration?: number;
  note_name?: string; // اختیاری برای نمایش نام نت
}

// --- Lesson Content JSON Structures ---
export interface QuizContent {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface VideoContent {
  videoUrl: string;
  tip?: string;
  description?: string;
}

export interface PracticeContent {
  mode: 'static' | 'scrolling' | 'tuner' | 'microphone' | 'chord';
  instruction: string;
  // برای حالت Static/Chord
  notes?: NotePosition[]; 
  fingerPlacement?: NotePosition[];
  chordName?: string;
  // برای حالت Scrolling
  sequence?: TabNote[];   
  bpm?: number;
  // برای حالت Tuner
  targetNote?: string;
  targetString?: number;
}

// برای درس‌های ترکیبی (اگر نیاز شد)
export interface MixedContent {
  stages: {
    type: 'video' | 'practice' | 'quiz';
    title?: string;
    content: VideoContent | PracticeContent | QuizContent;
  }[];
}

// --- Main Architecture Types (Database Mapping) ---

// 1. Chapter (فصل)
export interface Chapter {
  id: number;
  title: string;       
  description: string; 
  order: number;       
}

// 2. Lesson (درس - کوچکترین واحد)
export interface Lesson {
  id: number;
  dayId: number; // کلید خارجی به روز
  title: string;
  description: string;
  type: 'video' | 'practice' | 'quiz' | 'mixed';
  
  // محتوای درس که از JSON پارس می‌شود
  content: VideoContent | PracticeContent | QuizContent | MixedContent | any;
  
  xpReward: number;
  orderIndex: number; // ترتیب درس درون روز (۱، ۲، ...)
}

// 3. DayNode (روز - پیک روی نقشه)
// این ساختار در دیتابیس وجود ندارد، بلکه حاصل Join جدول Days و Lessons است
export interface DayNode {
  id: number; // شناسه روز (از جدول days)
  chapterId: number;
  weekNumber: number;
  dayNumber: number; // عددی که روی پیک نمایش داده می‌شود
  
  // آرایه درس‌های موجود در این روز
  lessons: Lesson[]; 
  
  // وضعیت‌های محاسبه شده در فرانت‌اند
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  stars: number; // مجموع یا میانگین ستاره‌های درس‌های این روز
}

// ساختار کلی دیتای بازی برای ذخیره در استور
export interface GameData {
  chapters: Chapter[];
  days: DayNode[];
}