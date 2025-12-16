//src/components/organisms/lessons/PracticeLesson.tsx

import React from 'react';
import { FretboardVisualizer } from './FretboardVisualizer';
import { ScrollingTab } from './ScrollingTab';
import { Button } from '../../atoms/Button';
import { Music } from 'lucide-react';
import { PracticeContent } from '../../../types';

interface PracticeLessonProps {
    content?: PracticeContent;
    onComplete: () => void;
}

export const PracticeLesson: React.FC<PracticeLessonProps> = ({ content, onComplete }) => {

    // Default fallback if no content provided
    const safeContent: PracticeContent = content || {
        mode: 'static',
        instruction: 'تمرین آزاد',
        notes: []
    };

    // اصلاح: استفاده از bpm به جای tempo (طبق تایپ جدید)
    if (safeContent.mode === 'scrolling' && safeContent.sequence) {
        return (
            <ScrollingTab
                sequence={safeContent.sequence}
                tempo={safeContent.bpm || 60} // اگر bpm نبود، پیش‌فرض ۶۰ بگذار
                onComplete={onComplete}
            />
        );
    }

    // STATIC MODE (و سایر حالت‌ها مثل آکورد)
    return (
        <div className="flex flex-col h-full items-center justify-between pb-4">
            <div className="w-full bg-slate-800/50 p-4 rounded-2xl border border-white/5 mb-6 text-center backdrop-blur-md">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <Music size={24} />
                </div>
                <p className="text-lg text-white font-medium leading-relaxed">{safeContent.instruction}</p>
            </div>

            <div className="w-full flex-1 flex items-center justify-center">
                {/* 
                   نکته: در تایپ جدید، ممکن است fingerPlacement برای آکوردها استفاده شود.
                   اینجا هر دو را چک می‌کنیم تا اگر آکورد بود هم نمایش داده شود.
                */}
                <FretboardVisualizer 
                    activeNotes={safeContent.notes || safeContent.fingerPlacement || []} 
                />
            </div>

            <div className="w-full mt-8">
                <Button fullWidth onClick={onComplete}>
                    تمرین انجام شد
                </Button>
            </div>
        </div>
    );
};