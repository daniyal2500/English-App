//src/components/organisms/lessons/QuizLesson.tsx

import React, { useState } from 'react';
import { Check, X, HelpCircle, Heart } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { useAppStore } from '../../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

interface QuizLessonProps {
  question: string;
  options: string[];
  correctIndex: number;
  onComplete: () => void;
}

export const QuizLesson: React.FC<QuizLessonProps> = ({ question, options, correctIndex, onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const { decrementHearts, user } = useAppStore();
  const navigate = useNavigate();

  const handleSelect = (index: number) => {
    if (status === 'correct') return;
    setSelected(index);
    setStatus('idle');
  };

  const checkAnswer = () => {
    if (selected === null) return;

    if (selected === correctIndex) {
      setStatus('correct');
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setStatus('wrong');
      const heartsRemaining = decrementHearts();
      if (!heartsRemaining) {
        // If hearts are now 0 (or were 0), logic returns false
        // Trigger generic "Game Over" visual or alert
        // Small delay to let user see 'Wrong' status
        setTimeout(() => {
          alert("قلب‌های شما تمام شد!");
          navigate('/shop');
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 custom-scrollbar">

        {/* Question Card */}
        <div className="relative mb-6 mt-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900 border border-white/10 p-5 rounded-2xl text-center shadow-xl">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/5">
              <HelpCircle className="text-purple-400" size={20} />
            </div>
            <h2 className="text-lg font-bold text-white leading-relaxed">{question}</h2>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt, idx) => {
            let stateClass = "bg-slate-800/50 border-white/10 hover:bg-slate-800"; // Default

            if (selected === idx) {
              if (status === 'idle') {
                stateClass = "bg-purple-500/20 border-purple-500 text-purple-200";
              } else if (status === 'correct') {
                stateClass = "bg-green-500/20 border-green-500 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.4)]";
              } else if (status === 'wrong') {
                stateClass = "bg-red-500/20 border-red-500 text-red-200 animate-shake";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group text-right ${stateClass}`}
              >
                <span className="font-medium text-base text-white">{opt}</span>

                {/* Status Icon */}
                {selected === idx && status === 'correct' && <Check className="text-green-400 shrink-0" />}
                {selected === idx && status === 'wrong' && <X className="text-red-400 shrink-0" />}
                {selected === idx && status === 'idle' && <div className="w-3 h-3 bg-purple-500 rounded-full shrink-0"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-deep-navy to-deep-navy/90 backdrop-blur-sm border-t border-white/5 z-10">
        <Button
          fullWidth
          onClick={checkAnswer}
          disabled={selected === null || status === 'correct'}
          className={status === 'wrong' ? "bg-slate-700 border-slate-900 text-slate-400" : "animate-pulse-glow"}
        >
          {status === 'wrong' ? "دوباره تلاش کن" : status === 'correct' ? "عالیه!" : "بررسی جواب"}
        </Button>
      </div>

      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};