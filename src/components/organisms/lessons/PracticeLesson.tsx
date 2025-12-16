// src/components/organisms/lessons/PracticeLesson.tsx

import React from 'react';
import { FretboardVisualizer } from './FretboardVisualizer';
import { Button } from '../../atoms/Button';
import { Music } from 'lucide-react'; // اصلاح: حذف info اضافه
import { PracticeContent } from '../../../types';

interface PracticeLessonProps {
    content?: PracticeContent;
    onComplete: () => void;
}

export const PracticeLesson: React.FC<PracticeLessonProps> = ({ content, onComplete }) => {

    // فال‌بک برای جلوگیری از کرش اگر محتوا خالی بود
    const safeContent = content || {
        mode: 'static',
        instruction: 'تمرین آزاد',
        notes: []
    } as any; 

    return (
        <div className="flex flex-col h-full items-center justify-between pb-4 px-4">
            
            {/* Header / Instruction */}
            <div className="w-full space-y-4 mt-4">
                <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-3xl border border-white/10 text-center shadow-xl relative overflow-hidden">
                    {/* افکت نوری پس‌زمینه */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                    
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/10 text-purple-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <Music size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">
                        {safeContent.chordName ? `آکورد ${safeContent.chordName}` : 'تمرین انگشت‌گذاری'}
                    </h3>
                    
                    <p className="text-slate-300 font-medium leading-relaxed text-sm">
                        {safeContent.instruction}
                    </p>
                </div>
            </div>

            {/* Fretboard Visualizer (نمایش آکورد یا نت ثابت) */}
            <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative w-full max-w-sm">
                    {/* ویژوالایزر */}
                    <FretboardVisualizer 
                        activeNotes={safeContent.notes || []} 
                    />
                    
                    {/* راهنما برای الگوی ریتم (اگر وجود داشت) */}
                    {safeContent.strummingPattern && (
                        <div className="mt-6 flex justify-center gap-2">
                            {safeContent.strummingPattern.map((p: string, idx: number) => (
                                <div key={idx} className="flex flex-col items-center gap-1">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg border-2 
                                        ${p === 'D' ? 'border-blue-400 text-blue-400' : p === 'U' ? 'border-orange-400 text-orange-400' : 'border-slate-600 text-slate-600'}`}>
                                        {p === 'D' ? '↓' : p === 'U' ? '↑' : 'x'}
                                    </div>
                                    <span className="text-[10px] text-slate-500 uppercase">
                                        {p === 'D' ? 'Down' : p === 'U' ? 'Up' : 'Mute'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="w-full pt-4">
                <Button fullWidth onClick={onComplete} className="h-14 text-lg shadow-lg shadow-purple-500/20">
                    تمرین رو یاد گرفتم
                </Button>
            </div>
        </div>
    );
};