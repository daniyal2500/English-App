//src/components/organisms/lessons/ScrollingTab.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Mic2, MicOff, Music2, AlertCircle } from 'lucide-react';
import { TabNote } from '../../../types';
import { Button } from '../../atoms/Button';
import { useAudioTuner } from '../../../hooks/useAudioTuner';
import { getNoteFrequency, noteFromPitch } from '../../../services/audio/pitchDetection';

interface ScrollingTabProps {
  sequence: TabNote[];
  tempo?: number;
  onComplete: () => void;
}

export const ScrollingTab: React.FC<ScrollingTabProps> = ({ sequence, tempo = 60, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);

  // Tuner Hook
  const { start: startMic, stop: stopMic, isListening, latestDataRef, note: uiNote, error: micError } = useAudioTuner();

  // Game Configuration
  const VISIBLE_WINDOW_MS = 3000;
  // Increased HIT_WINDOW_MS from 400 to 600 to make it easier for beginners
  const HIT_WINDOW_MS = 600;
  const TARGET_POSITION_PERCENT = 15;

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hitNotesRef = useRef<Set<number>>(new Set()); // Track which note indices are already hit

  const startLevel = async () => {
    await startMic();
    // Only start game loop if mic started successfully (no immediate error)
    // We check isListening state in a timeout or rely on the error state to block UI
  };

  // Effect to handle game start when mic listens successfully
  useEffect(() => {
    if (isListening && !isPlaying) {
      setIsPlaying(true);
      setScore(0);
      setCurrentTime(0);
      hitNotesRef.current.clear();
      startTimeRef.current = Date.now();
      loop();
    }
  }, [isListening]);

  const stopLevel = () => {
    setIsPlaying(false);
    stopMic();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  // The Main Game Loop
  const loop = () => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    setCurrentTime(elapsed);

    // 1. Audio Collision Detection
    const detectedNote = latestDataRef.current.note;

    if (detectedNote) {
      checkHits(elapsed, detectedNote);
    }

    // 2. End Condition
    const lastNoteTime = sequence[sequence.length - 1].time;
    if (elapsed > lastNoteTime + 2000) {
      stopLevel();
      onComplete();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(loop);
  };

  // Helper: Map sequence data to Note Name (e.g., String 6 Fret 0 -> "E")
  const getExpectedNoteName = (note: TabNote): string | null => {
    // Convert 1-6 string index to 0-5 (Low E to High E reversed in helper)
    // Types.ts: 1 is High E, 6 is Low E.
    // PitchDetection: 0 is Low E, 5 is High E.
    const stringIndex = 6 - note.string;
    const freq = getNoteFrequency(stringIndex, note.fret);
    return noteFromPitch(freq);
  };

  const checkHits = (time: number, playedNote: string) => {
    sequence.forEach((targetNote, idx) => {
      // Optimization: Skip if already hit
      if (hitNotesRef.current.has(idx)) return;

      // Check time window
      const timeDiff = Math.abs(targetNote.time - time);

      if (timeDiff < HIT_WINDOW_MS) {
        // Check Note Match
        const targetNoteName = getExpectedNoteName(targetNote);

        // Allow Enharmonic equivalents if needed, but for now exact string match
        // Simple validation: "E" matches "E"
        if (playedNote === targetNoteName) {
          // SUCCESS HIT!
          hitNotesRef.current.add(idx);
          setScore(s => s + 50);

          // Visual Feedback (Vibrate)
          if (navigator.vibrate) navigator.vibrate(50);
        }
      }
    });
  };

  useEffect(() => {
    return () => stopLevel();
  }, []);

  // Helper for rendering visuals
  const getStringColor = (stringIdx: number) => {
    const colors = [
      'bg-red-500 shadow-red-500/50',    // E (High)
      'bg-pink-500 shadow-pink-500/50',   // B
      'bg-purple-500 shadow-purple-500/50', // G
      'bg-blue-500 shadow-blue-500/50',   // D
      'bg-cyan-500 shadow-cyan-500/50',   // A
      'bg-yellow-500 shadow-yellow-500/50', // E (Low)
    ];
    return colors[6 - stringIdx] || 'bg-white';
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto">

      {/* Top HUD */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="bg-slate-900/80 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
          <span className="text-slate-400 text-xs uppercase">امتیاز</span>
          <span className="text-xl font-black text-neon-blue">{score}</span>
        </div>

        {/* Mic Status & Live Note Debugger */}
        <div className={`
           flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300
           ${isListening ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-slate-800 border-slate-700 text-slate-500'}
        `}>
          {isListening ? <Mic2 size={14} className="animate-pulse" /> : <MicOff size={14} />}
          <span className="text-xs font-mono font-bold w-6 text-center">
            {uiNote || "--"}
          </span>
        </div>
      </div>

      {/* Mic Error Alert */}
      {micError && (
        <div className="mx-4 mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-sm">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <p>{micError}</p>
        </div>
      )}

      {/* THE TAB TRACK */}
      <div className="relative w-full h-64 bg-slate-900 border-y-4 border-slate-800 overflow-hidden mb-6 select-none shadow-2xl rounded-xl">

        {/* String Lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] bg-slate-700"
            style={{ top: `${16.66 * i + 8.33}%` }}
          ></div>
        ))}

        {/* Target Zone */}
        <div
          className="absolute top-0 bottom-0 w-16 bg-white/5 z-10 border-r border-l border-white/10"
          style={{ left: `${TARGET_POSITION_PERCENT - 2}%` }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/40 shadow-[0_0_15px_white]"></div>
        </div>

        {/* Moving Notes */}
        {sequence.map((note, idx) => {
          const timeDiff = note.time - currentTime;
          const percentOffset = (timeDiff / VISIBLE_WINDOW_MS) * 85;
          const position = TARGET_POSITION_PERCENT + percentOffset;

          // Note State
          const isHit = hitNotesRef.current.has(idx);
          const isPassed = timeDiff < -HIT_WINDOW_MS && !isHit;

          if (position < -5 || position > 110) return null;
          if (isHit) return null; // Hide if collected

          const topPos = (note.string - 1) * 16.66 + 8.33;

          return (
            <div
              key={idx}
              className={`
                        absolute w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center border-2 border-white/20
                        ${getStringColor(note.string)}
                        ${isPassed ? 'opacity-30 grayscale' : 'shadow-[0_0_15px_currentColor]'}
                    `}
              style={{ left: `${position}%`, top: `${topPos}%` }}
            >
              <span className="text-xs font-black text-black">{note.fret}</span>
            </div>
          );
        })}

        {/* Success Effects Overlay */}
        {hitNotesRef.current.size > 0 && isPlaying && (
          <div className="absolute top-2 right-2 pointer-events-none">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></div>
          </div>
        )}
      </div>

      {/* Start Action */}
      <div className="mt-auto pb-4 px-4">
        {!isPlaying ? (
          <Button fullWidth onClick={startLevel} className="h-16 text-xl">
            {micError ? "تلاش مجدد" : currentTime > 0 ? <><RotateCcw className="ml-2" /> شروع دوباره</> : <><Play className="ml-2" /> شروع</>}
          </Button>
        ) : (
          <div className="w-full h-20 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 animate-pulse">
            <Music2 className="mr-2" />
            <span>به نوت‌ها گوش می‌دهم...</span>
          </div>
        )}
      </div>
    </div>
  );
};
