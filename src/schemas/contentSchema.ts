// src/schemas/contentSchema.ts

import { z } from 'zod';

// 1. تعریف ساختار یک "نت" (برای ملودی و تمرین‌ها)
export const NoteSchema = z.object({
  string: z.number().min(1).max(6), // سیم ۱ تا ۶
  fret: z.number().min(0).max(24),  // فرت ۰ تا ۲۴
  finger: z.number().optional(),    // انگشت ۱ تا ۴ (اختیاری)
  duration: z.number().optional(),  // کشش نت به میلی‌ثانیه
  time: z.number().optional(),      // زمان شروع نت (مخصوص ملودی)
  note_name: z.string().optional(), // نام نت (مثلا C#)
  technique: z.enum(['hammer', 'pull', 'slide', 'bend', 'vibrato', 'tremolo']).optional() // تکنیک‌ها
});

// 2. ساختار محتوای "آکورد / تمرین ثابت" (Practice - Static)
export const StaticPracticeSchema = z.object({
  mode: z.enum(['static', 'chord']),
  instruction: z.string(), // متنی که بالای صفحه میاد
  chordName: z.string().optional(), // مثلا "Em"
  notes: z.array(NoteSchema), // آرایه پوزیشن انگشت‌ها
  strummingPattern: z.array(z.enum(['D', 'U', 'X'])).optional() // الگوی ریتم (پایین/بالا)
});

// 3. ساختار محتوای "ملودی روان" (Practice - Scrolling) -> *مهم برای پیچک*
export const ScrollingPracticeSchema = z.object({
  mode: z.literal('scrolling'),
  instruction: z.string().optional(),
  bpm: z.number().min(30).max(300), // تمپو
  total_duration: z.number().optional(), // طول کل آهنگ
  backingTrackUrl: z.string().optional(), // لینک فایل صوتی پس‌زمینه
  notes: z.array(NoteSchema) // لیست تمام نت‌های آهنگ
});

// 4. ساختار محتوای "کوییز" (Quiz)
export const QuizContentSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4), // دقیقا ۴ گزینه
  correctIndex: z.number().min(0).max(3),
  explanation: z.string().optional() // توضیح بعد از جواب دادن
});

// 5. ساختار محتوای "ویدیو" (Video)
export const VideoContentSchema = z.object({
  videoUrl: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  tip: z.string().optional()
});

// 6. اسکیمای اصلی که همه چیز رو پوشش میده
// این تابع تصمیم می‌گیره کدوم اسکیما رو اعمال کنه
export const validateLessonContent = (type: string, content: any) => {
  try {
    switch (type) {
      case 'video':
        return VideoContentSchema.parse(content);
      
      case 'quiz':
        return QuizContentSchema.parse(content);
      
      case 'practice':
        // تشخیص نوع تمرین بر اساس فیلد mode
        if (content.mode === 'scrolling') {
          return ScrollingPracticeSchema.parse(content);
        } else {
          return StaticPracticeSchema.parse(content);
        }
        
      default:
        // اگر تایپ ناشناخته بود، فعلا خود کانتنت رو برمی‌گردونیم (برای جلوگیری از کرش)
        console.warn(`Unknown lesson type validation: ${type}`);
        return content;
    }
  } catch (error) {
    console.error(`❌ Validation Failed for lesson type: ${type}`, error);
    // در محیط توسعه ارور میدیم تا متوجه بشیم، در پروداکشن میتونیم هندل کنیم
    throw new Error('Invalid Lesson Content Structure');
  }
};