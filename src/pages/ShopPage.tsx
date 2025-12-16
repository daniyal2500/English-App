//src/pages/ShopPage.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, Flame, Gem, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Button } from '../components/atoms/Button';
import { BottomNav } from '../components/organisms/BottomNav';
import { TopBar } from '../components/organisms/TopBar';

export const ShopPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const buyItem = useAppStore((state) => state.buyItem);
    // refillHearts - not used directly in component body logic shown, but if needed:
    // const refillHearts = useAppStore((state) => state.refillHearts);

    const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleBuyHeart = () => {
        if (buyItem(350, 'heart')) {
            showFeedback('success', 'قلب‌ها پر شدند!');
        } else {
            showFeedback('error', t('shop.notEnoughGems'));
        }
    };

    const handleBuyFreeze = () => {
        if (buyItem(200, 'freeze')) {
            showFeedback('success', 'محافظ استریک خریداری شد!');
        } else {
            showFeedback('error', t('shop.notEnoughGems'));
        }
    };

    return (
        <ScreenWrapper theme="shop">
            <TopBar user={user} />

            {feedback && (
                <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border animate-in fade-in slide-in-from-top-4 ${feedback.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                    : 'bg-red-500/20 border-red-500/50 text-red-200'
                    }`}>
                    <span className="font-bold">{feedback.message}</span>
                </div>
            )}

            <div className="flex-1 w-full max-w-md mx-auto p-6 pt-24 pb-24 overflow-y-auto custom-scrollbar">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <ShoppingBag size={32} className="text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">{t('shop.title')}</h1>
                    <p className="text-slate-400">{t('shop.subtitle') || "الماس‌های خود را اینجا خرج کنید"}</p>
                </div>

                {/* --- Balance --- */}
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 flex items-center justify-between mb-8 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">{t('shop.gems')}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-cyan-400">{user.gems}</span>
                        <Gem size={24} className="text-cyan-400 fill-cyan-400/20" />
                    </div>
                </div>

                <div className="space-y-6">

                    {/* Item 1: Heart Refill */}
                    <div className="bg-slate-900/60 rounded-3xl p-5 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-colors"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 min-w-[3.5rem] bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Heart size={28} className="text-white fill-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white mb-1 truncate">پر کردن قلب‌ها</h3>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                    تمام سلامت خود را بازیابی کنید تا بتوانید به تمرین ادامه دهید.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-slate-500 font-mono bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                {user.hearts < user.maxHearts ? `${user.hearts}/${user.maxHearts}` : 'پر است'}
                            </div>
                            <Button
                                onClick={handleBuyHeart}
                                disabled={user.hearts === user.maxHearts}
                                className={`h-10 px-5 flex-1 max-w-[140px] ${user.hearts === user.maxHearts ? 'opacity-50 grayscale' : 'bg-cyan-500 hover:bg-cyan-400'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Gem size={14} className="text-white/80" />
                                    <span>350</span>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Item 2: Streak Freeze */}
                    <div className="bg-slate-900/60 rounded-3xl p-5 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 min-w-[3.5rem] bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <ShieldCheck size={28} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white mb-1 truncate">{t('shop.streakFreeze')}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                    استریک خود را برای یک روز که تمرین نمی‌کنید حفظ نمایید.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-slate-500 font-mono bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                موجودی: {user.streakFreeze}
                            </div>
                            <Button onClick={handleBuyFreeze} className="h-10 px-5 flex-1 max-w-[140px] bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20">
                                <div className="flex items-center justify-center gap-2">
                                    <Gem size={14} className="text-white/80" />
                                    <span>200</span>
                                </div>
                            </Button>
                        </div>
                    </div>

                </div>

            </div>

            <BottomNav
                currentScreen="shop"
                onNavigate={(screen) => navigate(screen === 'home' ? '/home' : `/${screen}`)}
            />
        </ScreenWrapper>
    );
};
