// src/services/levelService.ts

import { supabase } from '../lib/supabaseClient';
import { GameData, Chapter, DayNode, Lesson } from '../types';
import { MOCK_CHAPTERS, MOCK_DAYS } from '../constants';
// نکته: اگر دیتای فال‌بک (MOCK_DATA) دارید، می‌توانید اینجا ایمپورت کنید
// import { MOCK_CHAPTERS, MOCK_DAYS } from '../constants';

export const getGameContent = async (): Promise<{ data: GameData, isFallback: boolean }> => {
  try {
    // 1. دریافت فصل‌ها (Chapters)
    // مرتب‌سازی بر اساس فیلد order
    const { data: chaptersData, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .order('order', { ascending: true });

    if (chaptersError) throw chaptersError;

    // 2. دریافت روزها (Days) به همراه درس‌هایشان (Lessons)
    // ما از ریلیشن دیتابیس استفاده می‌کنیم تا درس‌ها را داخل روزها دریافت کنیم
    const { data: daysData, error: daysError } = await supabase
      .from('days')
      .select(`
        *,
        lessons (
          id,
          day_id,
          title,
          description,
          type,
          content,
          xp_reward,
          order_index
        )
      `)
      .order('chapter_id', { ascending: true }) // اول ترتیب فصل
      .order('week_number', { ascending: true }) // بعد ترتیب هفته
      .order('day_number', { ascending: true }); // بعد شماره روز

    if (daysError) throw daysError;

    // 3. مپ کردن (Mapping) داده‌های دیتابیس به تایپ‌های TypeScript
    
    // الف) تبدیل فصل‌ها
    const chapters: Chapter[] = (chaptersData || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      order: c.order,
    }));

    // ب) تبدیل روزها و درس‌های تو در تو
    const days: DayNode[] = (daysData || []).map((d: any) => ({
      id: d.id,
      chapterId: d.chapter_id, // snake_case به camelCase
      weekNumber: d.week_number,
      dayNumber: d.day_number,
      
      // مپ کردن آرایه درس‌های داخل هر روز
      lessons: (d.lessons || [])
        .map((l: any): Lesson => ({
          id: l.id,
          dayId: l.day_id,
          title: l.title,
          description: l.description,
          type: l.type,
          content: l.content, // محتوای JSON درس
          xpReward: l.xp_reward,
          orderIndex: l.order_index
        }))
        // مرتب‌سازی درس‌ها بر اساس order_index تا ترتیبشان در صفحه روز درست باشد
        .sort((a: Lesson, b: Lesson) => a.orderIndex - b.orderIndex),

      // مقادیر پیش‌فرض وضعیت (این‌ها بعداً در Store بر اساس پیشرفت کاربر آپدیت می‌شوند)
      isLocked: true,
      isCompleted: false,
      isActive: false,
      stars: 0
    }));

    return { 
      data: { chapters, days }, 
      isFallback: false 
    };

  } catch (error) {
      console.error('Error fetching game content:', error);
      // استفاده از داده‌های ماک جدید
      return { 
          data: { chapters: MOCK_CHAPTERS, days: MOCK_DAYS }, 
          isFallback: true 
      };
  }
};