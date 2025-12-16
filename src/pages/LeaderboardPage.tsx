//src/pages/LeaderboardPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/organisms/BottomNav';
import { useAppStore } from '../store/useAppStore';

export const LeaderboardPage: React.FC = () => {
   const navigate = useNavigate();
   const { user } = useAppStore();

   return (
      <div className="pb-24 pt-10 min-h-screen bg-gradient-to-br from-violet-800 via-indigo-900 to-slate-900 max-w-md mx-auto text-white">
         <div className="px-6 mb-8 text-center">
            <h2 className="text-2xl font-black mb-1 text-white">تالار مشاهیر</h2>
            <p className="text-purple-400 text-sm font-medium bg-purple-900/30 inline-block px-3 py-1 rounded-full border border-purple-500/20">لیگ برنز - هفته ۵</p>
         </div>

         <div className="flex flex-col px-4 space-y-2">
            {[
               { name: "امیر گیتاریست", xp: 1450, color: "from-blue-500 to-blue-600" },
               { name: "سارا موزیک", xp: 1320, color: "from-pink-500 to-rose-500" },
               { name: "رضا راکر", xp: 1200, color: "from-green-500 to-emerald-600" },
               { name: user.name || "شما", xp: user.xp, color: "from-purple-500 to-violet-600", isMe: true },
               { name: "مریم", xp: 800, color: "from-yellow-500 to-amber-600" },
            ]
               .sort((a, b) => b.xp - a.xp)
               .map((item, idx) => (
                  <div key={idx} className={`flex items-center px-4 py-3 rounded-2xl border ${item.isMe ? 'bg-white/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-800/40 border-white/5'}`}>
                     <span className={`font-bold w-6 text-center text-lg ${idx < 3 ? 'text-yellow-400' : 'text-slate-600'}`}>{idx + 1}</span>
                     <div className={`w-10 h-10 rounded-full mr-4 ml-3 flex items-center justify-center text-white font-bold shadow-lg bg-gradient-to-br ${item.color}`}>
                        {item.name.charAt(0)}
                     </div>
                     <div className="flex-1">
                        <span className={`font-bold block text-sm ${item.isMe ? 'text-white' : 'text-slate-300'}`}>{item.name}</span>
                     </div>
                     <span className="text-slate-400 text-xs font-mono bg-black/20 px-2 py-1 rounded-md">{item.xp} XP</span>
                  </div>
               ))}
         </div>

         <BottomNav currentScreen="leaderboard" onNavigate={(screen) => navigate(`/${screen === 'home' ? 'home' : screen}`)} />
      </div>
   );
};