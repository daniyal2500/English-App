// src/components/organisms/lessons/ScrollingTab.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, Volume2, VolumeX, Settings2, Plus, Minus } from 'lucide-react'; // آیکون‌های جدید
import { Button } from '../../atoms/Button';

// --- تنظیمات بازی ---
const GAME_CONFIG = {
  PIXELS_PER_MS: 0.15, // سرعت حرکت
  LOOK_AHEAD_MS: 4000, // دیدن نت‌های آینده (کمی بیشتر کردم)
  STRING_SPACING: 40,  
};

// --- پالت رنگی ---
const STRING_COLORS = [
  'bg-red-500 shadow-[0_0_15px_#ef4444]',    
  'bg-yellow-400 shadow-[0_0_15px_#facc15]', 
  'bg-blue-500 shadow-[0_0_15px_#3b82f6]',   
  'bg-orange-500 shadow-[0_0_15px_#f97316]', 
  'bg-green-500 shadow-[0_0_15px_#22c55e]',  
  'bg-purple-600 shadow-[0_0_15px_#9333ea]'  
];

interface ScrollingTabProps {
  sequence: any[];
  tempo?: number;
  backingTrackUrl?: string;
  initialOffset?: number; // آفست اولیه از دیتابیس
  onComplete: (score: number, stars: number) => void;
}

export const ScrollingTab: React.FC<ScrollingTabProps> = ({ 
  sequence, 
  backingTrackUrl,
  initialOffset = 0, // مقدار پیش‌فرض
  onComplete 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [now, setNow] = useState(0); 
  const [duration, setDuration] = useState(0); 
  
  // استیت برای کالیبراسیون (دیباگ)
  const [globalOffset, setGlobalOffset] = useState(initialOffset);
  const [showDebug, setShowDebug] = useState(true); // فعلاً true باشه تا ببینی

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number | null>(null); 
  const pausedTimeRef = useRef<number>(0); 
  const requestRef = useRef<number>();

  // --- 1. Setup ---
  useEffect(() => {
    if (backingTrackUrl) {
      const audio = new Audio(backingTrackUrl);
      audioRef.current = audio;
      audio.volume = 1.0;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration * 1000);
      });
      audio.addEventListener('ended', finishGame);
    } else {
      const lastNote = sequence[sequence.length - 1];
      if (lastNote) setDuration(lastNote.time + 3000);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [backingTrackUrl]);

  // --- 2. Game Loop ---
  const gameLoop = () => {
    if (!isPlaying) return;

    let currentTime = 0;

    if (audioRef.current && !audioRef.current.paused) {
      currentTime = audioRef.current.currentTime * 1000;
    } else if (startTimeRef.current !== null) {
      currentTime = Date.now() - startTimeRef.current;
    }

    setNow(currentTime);

    if (duration > 0 && currentTime > duration + 1000) {
      finishGame();
      return;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [isPlaying]);

  // --- 3. Controls ---
  const handleStart = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error(e));
    } else {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    } else {
      if (startTimeRef.current) pausedTimeRef.current = Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
  };

  const finishGame = () => {
    setIsPlaying(false);
    onComplete(100, 5); 
  };

  // --- 4. Render Logic (با اعمال آفست) ---
  const visibleNotes = useMemo(() => {
    return sequence.filter(n => {
      // فرمول: زمان واقعی نت = زمان جیسون + آفست دستی
      const noteRealTime = n.time + globalOffset;
      
      return (
        noteRealTime > now - 1500 && 
        noteRealTime < now + GAME_CONFIG.LOOK_AHEAD_MS 
      );
    });
  }, [now, sequence, globalOffset]);

  return (
    <div className="flex flex-col h-full bg-[#111827] relative overflow-hidden select-none">
      
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase">زمان</span>
          <span className="text-xl font-mono text-white">{Math.floor(now / 1000)}s</span>
        </div>
        
        {/* Debug Toggle */}
        <div className="pointer-events-auto">
            <button onClick={() => setShowDebug(!showDebug)} className="text-white/50 hover:text-white">
                <Settings2 size={20} />
            </button>
        </div>
      </div>

      {/* TRACK */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="relative w-full h-[280px] bg-[#1f2937] border-y-4 border-slate-700 shadow-2xl overflow-hidden">
          
          {/* Strings */}
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className="absolute w-full h-[1px] bg-slate-600/50" style={{ top: i * 40 + 40 }} />
          ))}

          {/* Target Line */}
          <div className="absolute top-0 bottom-0 left-[20%] w-[4px] bg-yellow-400 z-10 shadow-[0_0_20px_#facc15] opacity-80"></div>

          {/* Notes */}
          <AnimatePresence>
            {visibleNotes.map((note, idx) => {
              const screenWidth = window.innerWidth > 450 ? 450 : window.innerWidth;
              const targetX = screenWidth * 0.2; 
              
              // 🔴 نکته کلیدی: اعمال آفست در محاسبه پوزیشن
              const noteRealTime = note.time + globalOffset;
              const distance = (noteRealTime - now) * GAME_CONFIG.PIXELS_PER_MS;
              const finalX = targetX + distance;
              
              const colorClass = STRING_COLORS[note.string - 1] || 'bg-white';

              return (
                <div
                  key={`${note.time}-${note.string}`}
                  className={`absolute flex items-center justify-center w-9 h-9 rounded-full border-2 border-white z-20 ${colorClass}`}
                  style={{
                    left: finalX,
                    top: (note.string - 1) * GAME_CONFIG.STRING_SPACING + 24,
                    opacity: distance < -50 ? 0.5 : 1
                  }}
                >
                  <span className="text-xs font-black text-white drop-shadow-md">{note.fret}</span>
                  {note.duration && note.duration > 200 && (
                    <div 
                      className={`absolute left-4 top-1/2 -translate-y-1/2 h-3 rounded-r-full opacity-60 -z-10 ${colorClass.split(' ')[0]}`}
                      style={{ width: note.duration * GAME_CONFIG.PIXELS_PER_MS }}
                    />
                  )}
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* --- DEBUG CONTROLS (برای تنظیم سینک) --- */}
      {showDebug && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center z-50">
              <div className="bg-black/80 text-white p-3 rounded-xl border border-yellow-500/50 flex items-center gap-4 shadow-2xl">
                  <span className="text-xs text-yellow-400 font-bold uppercase">تنظیم تاخیر (ms):</span>
                  <button onClick={() => setGlobalOffset(p => p - 100)} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"><Minus size={16}/></button>
                  <span className="font-mono text-xl w-16 text-center font-bold" dir="ltr">{globalOffset}</span>
                  <button onClick={() => setGlobalOffset(p => p + 100)} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"><Plus size={16}/></button>
              </div>
          </div>
      )}

      {/* Main Controls */}
      <div className="p-6 bg-slate-900/90 backdrop-blur-md border-t border-white/5">
        {!isPlaying ? (
          <Button fullWidth onClick={handleStart} className="h-14 text-lg animate-pulse-glow">
            {now > 0 ? <><RefreshCw className="ml-2" /> ادامه </> : <><Play className="ml-2" /> شروع نوازندگی</>}
          </Button>
        ) : (
          <Button variant="secondary" fullWidth onClick={handlePause} className="h-14">
            توقف
          </Button>
        )}
      </div>
    </div>
  );
};