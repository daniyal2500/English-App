//src/components/organisms/lessons/VideoLesson.tsx

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Pause } from 'lucide-react';
import { Button } from '../../atoms/Button';

interface VideoLessonProps {
   title: string;
   description: string;
   onComplete: () => void;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({ title, description, onComplete }) => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const [isWatched, setIsWatched] = useState(false);

   // Improved Timer Logic: Removed 'progress' from dependency array to prevent stutter/clearing
   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;

      if (isPlaying) {
         interval = setInterval(() => {
            setProgress(prev => {
               if (prev >= 100) {
                  setIsWatched(true);
                  setIsPlaying(false);
                  return 100;
               }
               return prev + 1; // Speed of simulation
            });
         }, 50);
      }

      return () => clearInterval(interval);
   }, [isPlaying]);

   return (
      <div className="flex flex-col h-full w-full max-w-md mx-auto">

         {/* Video Player Container */}
         <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group mb-6">

            {/* Fake Video Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
               {/* Animated Background shapes */}
               <div className={`absolute w-32 h-32 bg-purple-500/20 blur-3xl rounded-full top-1/4 left-1/4 ${isPlaying ? 'animate-pulse' : ''}`}></div>
               <div className={`absolute w-40 h-40 bg-blue-500/20 blur-3xl rounded-full bottom-1/4 right-1/4 ${isPlaying ? 'animate-pulse' : ''}`} style={{ animationDelay: '1s' }}></div>

               <div className="text-center z-10 relative">
                  <h3 className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">NOW PLAYING</h3>
                  <p className="text-white font-bold px-4">{title}</p>
                  {/* Visualizer bars */}
                  {isPlaying && (
                     <div className="flex items-end justify-center gap-1 h-8 mt-4">
                        {[...Array(5)].map((_, i) => (
                           <div key={i} className="w-1 bg-purple-400 animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: '60%' }}></div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Play/Pause Overlay */}
            <div
               className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer z-20"
               onClick={() => setIsPlaying(!isPlaying)}
            >
               {!isPlaying && !isWatched && (
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                     <Play className="fill-white text-white ml-1" size={32} />
                  </div>
               )}
               {isPlaying && (
                  <div className="opacity-0 hover:opacity-100 transition-opacity p-4 bg-black/40 rounded-full">
                     <Pause className="fill-white text-white" size={32} />
                  </div>
               )}
               {isWatched && !isPlaying && (
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                     <CheckCircle2 className="text-white" size={32} />
                  </div>
               )}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800 z-30">
               <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100 relative"
                  style={{ width: `${progress}%` }}
               >
                  {/* Dot at the END of the bar */}
                  <div className="absolute right-0 top-1/2 -translate-x-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 px-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 mb-4">
               <h3 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-purple-500/20 p-1 rounded-md text-xs">نکته مهم</span>
                  آموزش درس
               </h3>
               <p className="text-slate-300 text-sm leading-relaxed">
                  {description}
               </p>
            </div>
         </div>

         {/* Sticky Bottom Action */}
         <div className="mt-auto pt-4">
            <Button
               fullWidth
               onClick={onComplete}
               disabled={!isWatched}
               className={!isWatched ? "opacity-50 grayscale cursor-not-allowed" : "animate-pulse-glow"}
            >
               {isWatched ? "ادامه و دریافت امتیاز" : "ویدیو رو تماشا کنید"}
            </Button>
         </div>
      </div>
   );
};
