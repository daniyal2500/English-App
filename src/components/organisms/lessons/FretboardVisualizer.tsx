//src/components/organisms/lessons/FretboardVisualizer.tsx

import React from 'react';

interface NotePosition {
  string: number; // 1 (High E) to 6 (Low E)
  fret: number;   // 0 (Open) to 12
  finger?: number; // 1 (Index), 2 (Middle), 3 (Ring), 4 (Pinky)
}

interface FretboardVisualizerProps {
  activeNotes: NotePosition[];
  showLabels?: boolean;
}

export const FretboardVisualizer: React.FC<FretboardVisualizerProps> = ({ activeNotes, showLabels = true }) => {
  const FRETS = 5; // Show first 5 frets for basic chords
  const STRINGS = 6;

  // Render Logic
  const getStringY = (stringIndex: number) => 20 + stringIndex * 30;
  const getFretX = (fretIndex: number) => fretIndex * 70; // Width of each fret

  return (
    <div className="w-full overflow-x-auto p-4 flex justify-center">
      <div className="relative bg-[#18181b] rounded-xl border-b-8 border-[#0f172a] shadow-2xl p-2 select-none" style={{ minWidth: '320px', maxWidth: '400px' }}>
        
        {/* Wood Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 rounded-xl pointer-events-none"></div>

        <svg viewBox="-20 0 380 190" className="w-full h-auto">
          <defs>
             <linearGradient id="fretSilver" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="50%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#9ca3af" />
             </linearGradient>
             <linearGradient id="stringGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#78350f" />
             </linearGradient>
             <linearGradient id="stringSilver" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#475569" />
             </linearGradient>
          </defs>

          {/* Nut (The white bar at the start) */}
          <rect x="0" y="10" width="8" height="170" fill="#e5e5e5" rx="2" />

          {/* Frets */}
          {Array.from({ length: FRETS }).map((_, i) => (
             <rect 
                key={`fret-${i}`} 
                x={getFretX(i + 1)} 
                y="10" 
                width="6" 
                height="170" 
                fill="url(#fretSilver)" 
                rx="1"
                className="shadow-sm"
             />
          ))}

          {/* Fret Markers (Inlays) */}
          <circle cx={getFretX(3) - 35} cy={getStringY(2.5)} r="6" fill="#fbbf24" opacity="0.8" />
          <circle cx={getFretX(5) - 35} cy={getStringY(2.5)} r="6" fill="#fbbf24" opacity="0.8" />

          {/* Strings */}
          {Array.from({ length: STRINGS }).map((_, i) => {
             // 0 is High E (Thin), 5 is Low E (Thick)
             const thickness = 1 + i * 0.8;
             const isWound = i > 2; // Bottom 3 strings are wound (Gold/Bronze usually)
             return (
               <line
                 key={`string-${i}`}
                 x1="5"
                 y1={getStringY(i)}
                 x2="380"
                 y2={getStringY(i)}
                 stroke={isWound ? "url(#stringGold)" : "url(#stringSilver)"}
                 strokeWidth={thickness}
                 className="drop-shadow-md"
               />
             );
          })}

          {/* Active Notes */}
          {activeNotes.map((note, idx) => {
             // Convert string number (1-6) to index (0-5)
             // But wait, in guitar tab 1 is High E (bottom physically, top on tab usually, but visually let's keep standard: Top line is High E in tabs, but on visualizer usually Top is Low E for POV).
             // Let's assume standard POV: Top string is Low E (6), Bottom is High E (1).
             const visualStringIndex = 6 - note.string; 
             
             const cx = note.fret === 0 ? -10 : getFretX(note.fret) - 35;
             const cy = getStringY(visualStringIndex);

             return (
               <g key={`note-${idx}`}>
                  {/* Glow */}
                  <circle cx={cx} cy={cy} r="12" fill={note.fret === 0 ? "transparent" : "#a855f7"} className="animate-pulse" filter="blur(4px)" opacity="0.6" />
                  
                  {/* The Dot */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={note.fret === 0 ? 8 : 10} 
                    fill={note.fret === 0 ? "transparent" : "#d8b4fe"} 
                    stroke={note.fret === 0 ? "#22d3ee" : "#fff"}
                    strokeWidth={note.fret === 0 ? 3 : 2}
                  />
                  
                  {/* Finger Number */}
                  {note.finger && note.fret !== 0 && (
                    <text x={cx} y={cy + 4} fontSize="10" fill="#4c1d95" fontWeight="bold" textAnchor="middle">{note.finger}</text>
                  )}
                  
                  {/* Open String Indicator */}
                  {note.fret === 0 && (
                     <text x={cx} y={cy + 4} fontSize="12" fill="#22d3ee" fontWeight="bold" textAnchor="middle">O</text>
                  )}
               </g>
             );
          })}
        </svg>
      </div>
      
      {/* String Labels (Optional) */}
      {showLabels && (
         <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-[22px] text-[10px] text-slate-500 font-mono">
            <span>E</span>
            <span>A</span>
            <span>D</span>
            <span>G</span>
            <span>B</span>
            <span>e</span>
         </div>
      )}
    </div>
  );
};