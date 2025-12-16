// src/pages/DayLevelPage.tsx

import React, { useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Music, HelpCircle, Lock, Check, Star, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';

// --- کامپوننت گرافیکی پیک (با اصلاح تایپ) ---
const Pick3D = ({ 
  color, 
  depthColor, 
  locked, 
  active, 
  completed 
}: { 
  color: string, 
  depthColor: string, 
  locked: boolean, 
  active: boolean, 
  completed: boolean // این پراپ رو اضافه کردیم تا ارور رفع شه
}) => (
    <svg viewBox="0 0 100 135" style={{ width: '100%', height: '100%', overflow: 'visible' }} className={active ? 'animate-float-slow' : ''}>
        <defs>
            <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="black" stopOpacity="0.1" />
            </linearGradient>
        </defs>
        <path d="M50 125 C20 100 0 70 0 40 C0 20 10 10 50 10 C90 10 100 20 100 40 C100 70 80 100 50 125 Z" fill={depthColor} transform="translate(0, 8)" className="drop-shadow-lg" />
        <path d="M50 125 C20 100 0 70 0 40 C0 20 10 10 50 10 C90 10 100 20 100 40 C100 70 80 100 50 125 Z" fill={color} />
        <path d="M50 125 C20 100 0 70 0 40 C0 20 10 10 50 10 C90 10 100 20 100 40 C100 70 80 100 50 125 Z" fill={`url(#grad-${color})`} style={{ mixBlendMode: 'overlay' }} />
        {!locked && (
            <path d="M20 40 C20 25 30 20 50 20 C70 20 80 25 80 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        )}
    </svg>
);

export const DayLevelPage: React.FC = () => {
    const { dayId } = useParams<{ dayId: string }>();
    const navigate = useNavigate();
    const { days, user } = useAppStore(); // خواندن از days
    const containerRef = useRef<HTMLDivElement>(null);

    // پیدا کردن روز فعلی از استور (با هندل کردن حالت undefined)
    const currentDayId = parseInt(dayId || '0', 10);
    const currentDay = useMemo(() => 
        days.find(d => d.id === currentDayId), 
    [days, currentDayId]);

    // دریافت درس‌ها
    const lessons = useMemo(() => 
        currentDay ? currentDay.lessons : [], 
    [currentDay]);

    // --- تنظیمات گرافیکی ---
    const CONFIG = {
        START_Y: 80,
        GAP: 160,        // فاصله بین درس‌ها
        AMPLITUDE: 60    // انحنای کمتر برای ساب‌رودمپ
    };

    // محاسبه مختصات و مسیر
    const { nodes, pathData, totalHeight } = useMemo(() => {
        const calculatedNodes = lessons.map((lesson, index) => {
            const x = Math.sin(index * 0.8) * CONFIG.AMPLITUDE;
            const y = CONFIG.START_Y + (index * CONFIG.GAP);

            // محاسبه وضعیت درس
            // درس کامل شده؟
            const completionData = user.completedLessons.find(r => r.lessonId === lesson.id);
            const isCompleted = !!completionData;
            
            // درس فعال؟ (درس فعلی کاربر)
            const isActive = lesson.id === user.currentLessonId;
            
            // درس قفل؟ (نه کامله و نه فعال)
            // نکته: اگر درس‌های قبلی پاس نشده باشن و این درس جلوتر از currentLessonId باشه، قفله
            const isLocked = !isCompleted && !isActive && (lesson.id > user.currentLessonId);

            return {
                ...lesson,
                x,
                y,
                isCompleted,
                isActive,
                isLocked,
                stars: completionData ? completionData.stars : 0
            };
        });

        // محاسبه کابل
        let d = "";
        if (calculatedNodes.length > 0) {
            d = `M ${500 + calculatedNodes[0].x} ${calculatedNodes[0].y - 50}`;
            for (let i = 0; i < calculatedNodes.length - 1; i++) {
                const curr = calculatedNodes[i];
                const next = calculatedNodes[i + 1];
                const cpY = (curr.y + next.y) / 2;
                d += ` C ${500 + curr.x} ${cpY}, ${500 + next.x} ${cpY}, ${500 + next.x} ${next.y}`;
            }
            // ادامه خط تا پایین
            const last = calculatedNodes[calculatedNodes.length - 1];
            d += ` L ${500 + last.x} ${last.y + 100}`;
        }

        return { 
            nodes: calculatedNodes, 
            pathData: d, 
            totalHeight: (calculatedNodes.length * CONFIG.GAP) + 300 
        };
    }, [lessons, user]);

    const handleLessonStart = (lessonId: number) => {
        navigate(`/lesson/${lessonId}`);
    };

    // اسکرول خودکار به درس فعال
    useEffect(() => {
        // یک تاخیر کوچک برای رندر شدن
        setTimeout(() => {
            const activeElement = document.getElementById('active-lesson-node');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }, []);

    if (!currentDay) return <div className="text-white text-center pt-20">روز پیدا نشد...</div>;

    return (
        <ScreenWrapper theme="stage" noPad>
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex items-center z-50">
                <button 
                    onClick={() => navigate('/home')}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg active:scale-95"
                >
                    <ArrowRight size={24} className="rotate-180" />
                </button>
                <div className="flex-1 text-center pr-12">
                    <h1 className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        روز {currentDay.dayNumber}
                    </h1>
                    <p className="text-xs text-purple-200 font-bold opacity-80 tracking-widest mt-1">
                        فصل {currentDay.chapterId} • هفته {currentDay.weekNumber}
                    </p>
                </div>
            </div>

            {/* Scroll Area */}
            <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar z-10 relative pt-24 pb-20">
                <div className="relative w-full max-w-[400px] mx-auto" style={{ height: totalHeight }}>

                    {/* Path Layer */}
                    <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-full pointer-events-none z-0 overflow-visible">
                        <path d={pathData} stroke="rgba(0,0,0,0.3)" strokeWidth="18" fill="none" strokeLinecap="round" className="translate-y-2 blur-sm" />
                        <path d={pathData} stroke="#6366f1" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.8" />
                        <path d={pathData} stroke="#a5b4fc" strokeWidth="2" fill="none" strokeDasharray="6 10" strokeLinecap="round" opacity="0.6" />
                    </svg>

                    {/* Lesson Nodes */}
                    <AnimatePresence>
                        {nodes.map((node, i) => {
                            // تعیین آیکون
                            let Icon = Music;
                            if (node.type === 'video') Icon = Play;
                            if (node.type === 'quiz') Icon = HelpCircle;
                            if (node.isLocked) Icon = Lock;
                            if (node.isCompleted) Icon = Check;

                            // رنگ‌ها
                            let faceColor = "#475569"; 
                            let depthColor = "#1e293b";
                            let iconColor = "text-slate-400";

                            if (node.isCompleted) {
                                faceColor = "#10b981"; // سبز برای درس‌های پاس شده
                                depthColor = "#047857";
                                iconColor = "text-white";
                            } else if (node.isActive) {
                                faceColor = "#8b5cf6"; // بنفش برای درس فعال
                                depthColor = "#6d28d9";
                                iconColor = "text-white";
                            } else if (!node.isLocked) {
                                faceColor = "#6366f1"; // آبی برای درس‌های باز ولی نه فعال
                                depthColor = "#4338ca";
                                iconColor = "text-white";
                            }

                            // آیدی گرادینت منحصر به فرد برای هر درس (مهم برای جلوگیری از تداخل رنگ‌ها)
                            // از index استفاده میکنیم تا مطمئن باشیم یکتاست
                            const uniqueKey = `lesson-${currentDay.id}-${i}`; 

                            return (
                                <motion.div
                                    key={node.id}
                                    id={node.isActive ? 'active-lesson-node' : undefined}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="absolute z-10 left-1/2"
                                    style={{ top: node.y, marginLeft: node.x }}
                                >
                                    <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group">

                                        {/* حباب درس بعدی */}
                                        {node.isActive && (
                                            <div className="absolute -top-[4.5rem] flex flex-col items-center animate-bounce z-30 w-max">
                                                <div className="bg-white text-indigo-700 px-4 py-1.5 rounded-xl font-black text-xs border-2 border-indigo-100 shadow-xl">
                                                    درس بعدی
                                                </div>
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-white border-r-[6px] border-r-transparent mt-[-1px]"></div>
                                            </div>
                                        )}

                                        {/* دکمه پیک */}
                                        <button
                                            onClick={() => !node.isLocked && handleLessonStart(node.id)}
                                            className={`
                                                relative w-24 h-28 flex items-center justify-center
                                                transition-transform active:translate-y-2 active:scale-95
                                                ${node.isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:scale-110'}
                                            `}
                                        >
                                            <div className="absolute inset-0 drop-shadow-xl">
                                                {/* استفاده از کلید یکتا برای گرادینت‌ها */}
                                                <Pick3D 
                                                    color={faceColor} 
                                                    depthColor={depthColor} 
                                                    locked={node.isLocked} 
                                                    active={node.isActive} 
                                                    completed={node.isCompleted} 
                                                />
                                            </div>

                                            <div className="relative z-10 pb-3 flex flex-col items-center">
                                                {node.isActive ? (
                                                    <div className="animate-bounce">
                                                        <Icon className="text-white drop-shadow-lg" size={32} strokeWidth={2.5} fill={node.type === 'video' ? "currentColor" : "none"} />
                                                    </div>
                                                ) : (
                                                    <Icon className={`${iconColor} drop-shadow-md`} size={24} strokeWidth={node.isCompleted ? 4 : 2.5} />
                                                )}

                                                {/* ستاره‌ها */}
                                                {node.isCompleted && (
                                                    <div className="absolute top-8 flex gap-0.5 mt-1">
                                                        {[...Array(3)].map((_, i) => (
                                                            <Star key={i} size={8} className={`drop-shadow-sm ${i < node.stars ? "fill-white text-white" : "fill-black/20 text-transparent"}`} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </button>

                                        {/* عنوان درس (زیر پیک) */}
                                        {!node.isLocked && (
                                            <div className="absolute -bottom-8 w-48 text-center pointer-events-none flex flex-col items-center">
                                                <h3 className="text-white font-bold text-sm drop-shadow-md truncate px-2 max-w-full">
                                                    {node.title}
                                                </h3>
                                                {node.xpReward && !node.isCompleted && (
                                                    <span className="text-[9px] text-purple-300 font-mono bg-purple-900/60 px-2 py-0.5 rounded-md mt-1">
                                                        +{node.xpReward} XP
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </ScreenWrapper>
    );
};