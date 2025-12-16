// src/components/organisms/CampaignMap.tsx

import React, { useEffect, useRef, useMemo } from 'react';
import { Lock, Check, Music, Mic2, Star, Play } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DayNode } from '../../types';

interface CampaignMapProps {
    onOpenDay: (dayId: number) => void;
}

export const CampaignMap: React.FC<CampaignMapProps> = ({ onOpenDay }) => {
    const { days, chapters, user } = useAppStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const activeNodeRef = useRef<HTMLDivElement>(null);

    // --- تنظیمات ظاهری ---
    const CONFIG = {
        START_Y: 100,
        LEVEL_HEIGHT: 180,     
        WEEK_GAP: 180,         
        CHAPTER_GAP: 80,       
        AMPLITUDE: 90,         
    };

    const PICK_PATH = "M50 110 C 20 70 5 45 5 25 Q 5 5 50 5 Q 95 5 95 25 C 95 45 80 70 50 110 Z";
    const START_COORDS = { x: 643, y: 151 };
    const END_COORDS = { x: 286, y: 142 };

    // --- پالت رنگ‌ها ---
    const PREMIUM_THEMES = [
        { name: 'Royal Purple', start: '#7e22ce', end: '#3b0764', border: '#a855f7', shadow: 'shadow-purple-500/30', glow: 'bg-purple-600' },
        { name: 'Heavy Bronze', start: '#92400e', end: '#451a03', border: '#d97706', shadow: 'shadow-amber-700/30', glow: 'bg-amber-700' },
        { name: 'Dark Emerald', start: '#0f766e', end: '#022c22', border: '#14b8a6', shadow: 'shadow-teal-500/30', glow: 'bg-teal-600' },
        { name: 'Velvet Crimson', start: '#be123c', end: '#881337', border: '#fb7185', shadow: 'shadow-rose-500/30', glow: 'bg-rose-600' },
        { name: 'Midnight Ocean', start: '#1e3a8a', end: '#172554', border: '#60a5fa', shadow: 'shadow-blue-500/30', glow: 'bg-blue-600' }
    ];

    const getPhaseConfig = (order: number) => {
        const themeIndex = (order - 1) % PREMIUM_THEMES.length;
        return PREMIUM_THEMES[themeIndex];
    };

    // اسکرول خودکار
    useEffect(() => {
        if (activeNodeRef.current) {
            setTimeout(() => {
                activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [days]);

    // --- موتور محاسباتی (اصلاح شده برای لاجیک دقیق قفل/باز) ---
    const { renderItems, totalHeight, pathData } = useMemo(() => {
        if (!days || days.length === 0) return { renderItems: [], totalHeight: 800, pathData: "" };

        const items: any[] = [];
        let currentY = CONFIG.START_Y;
        let globalIndex = 0;

        // 1. گروه‌بندی روزها بر اساس فصل
        const daysByChapter: Record<number, DayNode[]> = {};
        days.forEach(day => {
            if (!daysByChapter[day.chapterId]) daysByChapter[day.chapterId] = [];
            daysByChapter[day.chapterId].push(day);
        });

        const sortedChapterIds = Object.keys(daysByChapter).map(Number).sort((a, b) => a - b);

        sortedChapterIds.forEach(chapterId => {
            const chapterConfig = chapters.find(c => c.id === chapterId);
            const config = getPhaseConfig(chapterConfig?.order || 1);

            // A. بنر فصل
            items.push({
                type: 'chapter_header',
                y: currentY,
                title: chapterConfig?.title || `فصل ${chapterId}`,
                subtitle: chapterConfig?.description || '',
                config,
                id: chapterId
            });
            currentY += CONFIG.CHAPTER_GAP;

            // گروه‌بندی روزها بر اساس هفته
            const daysByWeek: Record<number, DayNode[]> = {};
            daysByChapter[chapterId].forEach(day => {
                if (!daysByWeek[day.weekNumber]) daysByWeek[day.weekNumber] = [];
                daysByWeek[day.weekNumber].push(day);
            });
            
            const sortedWeeks = Object.keys(daysByWeek).map(Number).sort((a, b) => a - b);

            sortedWeeks.forEach(weekNum => {
                // B. بنر هفته
                currentY += 60; 
                items.push({
                    type: 'week_header',
                    y: currentY,
                    label: `هفته ${weekNum}`,
                    config
                });
                currentY += 100;

                // C. پیک‌ها (روزها)
                
                const weekDays = daysByWeek[weekNum].sort((a, b) => a.dayNumber - b.dayNumber);

                weekDays.forEach(dayNode => {
                    const x = Math.sin(globalIndex * 0.6) * CONFIG.AMPLITUDE;
                    
                    // --- محاسبه دقیق وضعیت (Logic Fix) ---
                    
                    // 1. آیا این روز کامل شده؟ (همه درس‌ها پاس شدن؟)
                    const totalLessons = dayNode.lessons.length;
                    const passedLessonsCount = dayNode.lessons.filter(lesson => 
                        user.completedLessons.some(r => r.lessonId === lesson.id)
                    ).length;
                    
                    const isCompleted = totalLessons > 0 && totalLessons === passedLessonsCount;

                    // 2. محاسبه میانگین ستاره‌ها برای نمایش روی پیک
                    let totalStars = 0;
                    if (isCompleted) {
                        dayNode.lessons.forEach(lesson => {
                            const result = user.completedLessons.find(r => r.lessonId === lesson.id);
                            if (result) totalStars += result.stars;
                        });
                    }
                    const stars = isCompleted ? Math.round(totalStars / totalLessons) : 0;

                    // 3. آیا این روز قفل است؟ (وابسته به روز قبلی)
                    let isLocked = true;
                    
                    // پیدا کردن ایندکس روز جاری در لیست اصلی days
                    // (برای چک کردن وضعیت روز قبلی)
                    const currentDayIndex = days.findIndex(d => d.id === dayNode.id);
                    
                    if (currentDayIndex === 0) {
                        // روز اول همیشه باز است
                        isLocked = false;
                    } else {
                        // روزهای بعدی: فقط اگر روز *قبلی* کامل شده باشد باز می‌شوند
                        const prevDay = days[currentDayIndex - 1];
                        if (prevDay) {
                            const prevTotal = prevDay.lessons.length;
                            const prevPassed = prevDay.lessons.filter(l => 
                                user.completedLessons.some(r => r.lessonId === l.id)
                            ).length;
                            
                            // اگر روز قبلی کاملاً تمام شده، این روز باز می‌شود
                            if (prevTotal > 0 && prevTotal === prevPassed) {
                                isLocked = false;
                            }
                        }
                    }

                    // 4. آیا این روز فعال است؟ (باز است ولی هنوز کامل نشده)
                    const isActive = !isLocked && !isCompleted;

                    items.push({
                        type: 'node',
                        data: dayNode,
                        x,
                        y: currentY,
                        config,
                        isActive,
                        isLocked,
                        isCompleted,
                        stars
                    });

                    currentY += CONFIG.LEVEL_HEIGHT;
                    globalIndex++;
                });
                
                currentY += 40; // فاصله انتهای هفته
            });
            currentY += 40; // فاصله انتهای فصل
        });

        // محاسبه کابل
        const nodeItems = items.filter(i => i.type === 'node');
        let d = "";
        if (nodeItems.length > 0) {
            d = `M ${500 + nodeItems[0].x} ${nodeItems[0].y - 50}`;
            for (let i = 0; i < nodeItems.length - 1; i++) {
                const curr = nodeItems[i];
                const next = nodeItems[i + 1];
                const cpY = (curr.y + next.y) / 2;
                d += ` C ${500 + curr.x} ${cpY}, ${500 + next.x} ${cpY}, ${500 + next.x} ${next.y}`;
            }
            const last = nodeItems[nodeItems.length - 1];
            d += ` L ${500 + last.x} ${last.y + 100}`;
        }

        return { renderItems: items, totalHeight: currentY + 200, pathData: d };
    }, [days, chapters, user]);

    return (
        <div className="relative w-full h-full bg-transparent overflow-hidden">
            <style>{`
                @keyframes spotlight { 0%, 100% { transform: rotate(-10deg); opacity: 0.3; } 50% { transform: rotate(10deg); opacity: 0.6; } }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
                .animate-float-slow { animation: float 3s ease-in-out infinite; }
            `}</style>

            {/* --- پس‌زمینه (ثابت) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-20%] left-1/4 w-[200px] h-[800px] bg-gradient-to-b from-white to-transparent blur-3xl opacity-10 origin-top animate-[spotlight_8s_ease-in-out_infinite]"></div>
                <div className="absolute top-[-20%] right-1/4 w-[200px] h-[800px] bg-gradient-to-b from-stage-purple to-transparent blur-3xl opacity-10 origin-top animate-[spotlight_10s_ease-in-out_infinite_reverse]"></div>
                
                <div className="absolute inset-0 w-full h-full opacity-10 text-indigo-500 fill-current">
                     <svg viewBox="0 0 1000 500" className="w-full h-full object-cover">
                        <path d="M841,349c-8-3-20,4-29,20c-3,4-1,10,3,12c6,3,16,1,22-5c5-5,9-14,9-19C846,353,844,350,841,349z M808,367c-13,9-15,32-2,46c4,5,12,3,15-2c5-7,3-18-2-25C816,381,812,375,808,367z M654,124c-12,2-22,9-28,19c-5,9-2,19,5,25c9,8,22,6,31-2c9-7,12-20,7-31C667,129,661,125,654,124z" />
                    </svg>
                </div>

                <div className="absolute inset-0 w-full h-full">
                    <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                                <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <g transform={`translate(${START_COORDS.x}, ${START_COORDS.y})`}>
                            <circle r="4" className="fill-stage-purple" />
                            <text y="-15" x="0" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="bold" className="font-mono tracking-widest">GARAGE</text>
                        </g>
                        <g transform={`translate(${END_COORDS.x}, ${END_COORDS.y})`}>
                            <Star size={24} className="text-stage-gold fill-stage-gold animate-pulse" x="-12" y="-12" />
                            <text y="25" x="0" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold" className="font-mono tracking-widest">STADIUM</text>
                        </g>
                        <path d={`M ${START_COORDS.x} ${START_COORDS.y} Q 464 -50 ${END_COORDS.x} ${END_COORDS.y}`} fill="none" stroke="url(#flightGradient)" strokeWidth="2" strokeDasharray="6,6" className="opacity-50">
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            </div>

            {/* --- محتوا --- */}
            <div ref={containerRef} className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden custom-scrollbar pt-24 pb-32">
                <div className="relative w-full max-w-[400px] mx-auto" style={{ height: totalHeight }}>

                    {/* کابل اتصال */}
                    <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-full pointer-events-none z-0 overflow-visible">
                        <path d={pathData} stroke="rgba(0,0,0,0.3)" strokeWidth="18" fill="none" strokeLinecap="round" className="translate-y-2 blur-sm" />
                        <path d={pathData} stroke="#4c1d95" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.8" />
                        <path d={pathData} stroke="#a78bfa" strokeWidth="2" fill="none" strokeDasharray="6 10" strokeLinecap="round" opacity="0.6" />
                    </svg>

                    {/* آیتم‌ها */}
                    {renderItems.map((item, index) => {
                        
                        // --- A. بنر فصل ---
                        if (item.type === 'chapter_header') {
                            return (
                                <div
                                    key={`header-${index}`}
                                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-lg z-0"
                                    style={{ top: item.y }}
                                >
                                    <div className="relative w-[340px] flex items-center justify-center filter drop-shadow-xl animate-float-slow">
                                        <div 
                                            className="absolute inset-0 rounded-3xl opacity-30 blur-xl"
                                            style={{ background: item.config.start }} 
                                        ></div>
                                        <div className="relative w-full py-5 px-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
                                            <div 
                                                className="absolute inset-0 opacity-20"
                                                style={{ background: `linear-gradient(to bottom, ${item.config.start}, transparent)` }}
                                            ></div>
                                            <div className="absolute top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                                            <div className="relative z-10 flex flex-col items-center">
                                                <span className="text-2xl font-black font-vazir text-white tracking-wider drop-shadow-md">
                                                    {item.title}
                                                </span>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="h-[1px] w-4 bg-white/30"></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                                                        {item.subtitle}
                                                    </span>
                                                    <div className="h-[1px] w-4 bg-white/30"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // --- B. بنر هفته ---
                        if (item.type === 'week_header') {
                            return (
                                <div 
                                    key={`week-${index}`} 
                                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-md z-0"
                                    style={{ top: item.y }}
                                >
                                    <div className={`
                                        relative px-8 py-2 rounded-full border 
                                        bg-slate-900/80 border-slate-500/30
                                        flex flex-col items-center justify-center z-10 shadow-lg backdrop-blur-xl
                                    `}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.config.glow} animate-pulse`}></div>
                                            <span className="text-lg font-bold text-white font-vazir tracking-wide">
                                                {item.label}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${item.config.glow} animate-pulse`}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // --- C. پیک گیتار ---
                        if (item.type === 'node') {
                            const { data, config, isLocked, isActive, isCompleted, stars } = item;
                            
                            let hexStart = isLocked ? '#374151' : (isCompleted ? '#f59e0b' : item.config.start);
                            let hexEnd = isLocked ? '#111827' : (isCompleted ? '#b45309' : item.config.end);
                            let hexSide = isLocked ? '#000000' : (isCompleted ? '#78350f' : '#000000');

                            const Icon = isLocked ? Lock : (isCompleted ? Check : Music); 
                            const iconColor = isLocked ? "text-slate-500" : "text-white";

                            return (
                                <div
                                    key={`day-${data.id}`}
                                    ref={isActive ? activeNodeRef : null}
                                    className="absolute left-1/2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10"
                                    style={{ top: item.y, marginLeft: item.x }}
                                >
                                    <div className="relative flex flex-col items-center group">

                                        <button
                                            onClick={() => !isLocked && onOpenDay(data.id)} 
                                            className={`
                                                relative w-36 h-36 flex items-center justify-center
                                                transition-transform duration-300
                                                ${isLocked ? 'cursor-not-allowed opacity-80 grayscale' : 'cursor-pointer hover:scale-110'}
                                                ${isActive ? 'animate-float-slow scale-110' : ''}
                                            `}
                                        >
                                            {isActive && (
                                                <div className={`absolute inset-0 rounded-full blur-3xl opacity-50 ${item.config.glow} animate-pulse scale-110`}></div>
                                            )}

                                            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] overflow-visible">
                                                <defs>
                                                    <radialGradient id={`grad-${data.id}`} cx="30%" cy="30%" r="90%" fx="30%" fy="30%">
                                                        <stop offset="0%" stopColor={hexStart} stopOpacity="1" />
                                                        <stop offset="100%" stopColor={hexEnd} stopOpacity="1" />
                                                    </radialGradient>

                                                    <linearGradient id={`bevel-${data.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                                                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                                                        <stop offset="100%" stopColor="black" stopOpacity="0.4" />
                                                    </linearGradient>
                                                </defs>

                                                <path d={PICK_PATH} fill={hexSide} transform="translate(0, 6)" className="opacity-90" />
                                                <path d={PICK_PATH} fill={`url(#grad-${data.id})`} />
                                                <path d={PICK_PATH} fill="none" stroke={`url(#bevel-${data.id})`} strokeWidth="2" transform="scale(0.95) translate(2.5, 2.5)" />

                                                {!isLocked && (
                                                    <path d="M 25 15 Q 50 5 75 15" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" filter="blur(1px)" />
                                                )}

                                                {!isLocked && (
                                                     <path d="M 35 90 Q 50 100 65 90" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
                                                )}
                                            </svg>

                                            <div className="absolute inset-0 flex flex-col items-center justify-center pb-2 z-20">
                                                {isActive ? (
                                                    <div className="relative z-10 animate-bounce">
                                                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_6px_4px_rgba(0,0,0,0.5)]">
                                                            <defs>
                                                                <linearGradient id="jewelryGoldGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                                                                    <stop offset="0%" stopColor="#fcd34d" /> 
                                                                    <stop offset="45%" stopColor="#f59e0b" />
                                                                    <stop offset="100%" stopColor="#92400e" />
                                                                </linearGradient>
                                                                <linearGradient id="jewelryGoldSide" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                    <stop offset="0%" stopColor="#78350f" />
                                                                    <stop offset="100%" stopColor="#451a03" />
                                                                </linearGradient>
                                                            </defs>
                                                            <g transform="translate(1, 1)">
                                                                <path d="M12 3 V 13.55 C 11.41 13.21 10.73 13 10 13 C 7.79 13 6 14.79 6 17 C 6 19.21 7.79 21 10 21 C 12.21 21 14 19.21 14 17 V 7 H 18 V 3 H 12 Z" fill="url(#jewelryGoldSide)" stroke="url(#jewelryGoldSide)" strokeWidth="1.5" strokeLinejoin="round" />
                                                            </g>
                                                            <path d="M12 3 V 13.55 C 11.41 13.21 10.73 13 10 13 C 7.79 13 6 14.79 6 17 C 6 19.21 7.79 21 10 21 C 12.21 21 14 19.21 14 17 V 7 H 18 V 3 H 12 Z" fill="url(#jewelryGoldGradient)" stroke="url(#jewelryGoldGradient)" strokeWidth="0.5" />
                                                            <ellipse cx="8" cy="17" rx="2" ry="1" transform="rotate(-20 8 17)" fill="white" fillOpacity="0.4" filter="blur(0.5px)" />
                                                            <path d="M13 4 L 13 12" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <Icon className={`${iconColor} drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`} size={isCompleted ? 42 : 32} strokeWidth={isCompleted ? 4 : 2.5} />
                                                )}

                                                {isCompleted && (
                                                    <div className="absolute bottom-6 flex gap-0.5">
                                                        {[...Array(3)].map((_, i) => (
                                                            <Star key={i} size={12} className={`drop-shadow-sm ${i < stars ? "fill-yellow-300 text-yellow-300" : "fill-black/30 text-transparent"}`} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </button>

                                        {!isLocked && !isCompleted && !isActive && (
                                            <span className="absolute -bottom-8 text-2xl font-black text-white/50 font-vazir">
                                                {data.dayNumber}
                                            </span>
                                        )}
                                        
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};