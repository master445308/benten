import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Zap, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const SLIDES = [
  {
    id: 1,
    tag: 'Флагманские премьеры',
    title: 'Технологии нового поколения 2026',
    description: 'iPhone 16 Pro Max, Galaxy S25 Ultra и MacBook Pro M3 в наличии с официальной гарантией 2 года и подарками к каждому заказу.',
    badge: 'Специальная цена',
    ctaText: 'Смотреть новинки',
    category: 'smartphones',
    bgGradient: 'from-blue-900/60 via-slate-900/90 to-cyan-950/60',
    accentColor: 'text-cyan-400',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    tag: 'Эксклюзивный промокод',
    title: 'Скидка 15% по промокоду MONIS05',
    description: 'Введите промокод MONIS05 в корзине и получите мгновенную скидку на любую аудиотехнику, ноутбуки и игровые аксессуары.',
    badge: 'Промокод MONIS05',
    ctaText: 'Применить скидку',
    category: 'audio',
    bgGradient: 'from-purple-900/60 via-slate-900/90 to-blue-950/60',
    accentColor: 'text-purple-400',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    tag: 'Гейминг следующего уровня',
    title: 'PlayStation 5 Pro & OLED Мониторы 240Hz',
    description: 'Максимальный FPS, трассировка лучей с искусственным интеллектом и сверхбыстрые накопители для побед в любых играх.',
    badge: 'Для геймеров',
    ctaText: 'Выбрать консоль',
    category: 'gaming',
    bgGradient: 'from-emerald-900/50 via-slate-900/90 to-slate-950',
    accentColor: 'text-emerald-400',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=700&q=80'
  }
];

interface HeroBannerProps {
  onSelectCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { applyPromoCode, setIsCartOpen } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeSlide];

  const handleCta = () => {
    if (slide.id === 2) {
      applyPromoCode('MONIS05');
      setIsCartOpen(true);
    } else {
      onSelectCategory(slide.category);
    }
  };

  return (
    <div className="relative mb-8">
      {/* Main Slide Card */}
      <div className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${slide.bgGradient} p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-700`}>
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px]">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/10 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    {slide.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <Tag className="w-3 h-3" />
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCta}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  applyPromoCode('MONIS05');
                }}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Промокод: <strong className="text-cyan-400 font-mono">MONIS05</strong> (-15%)</span>
              </motion.button>
            </div>
          </div>

          {/* Image & Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45 }}
                  src={slide.image}
                  alt={slide.title}
                  className="relative w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-3xl border border-slate-700/60 shadow-2xl"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slider dots */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            0{activeSlide + 1} / 0{SLIDES.length}
          </div>
        </div>
      </div>

      {/* Value props ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Экспресс-доставка</div>
            <div className="text-[11px] text-slate-400">В день заказа по городу</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Гарантия 2 года</div>
            <div className="text-[11px] text-slate-400">Официальный сервис</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Обмен и возврат 14 дней</div>
            <div className="text-[11px] text-slate-400">Без лишних вопросов</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">100% Оригинал</div>
            <div className="text-[11px] text-slate-400">Только сертифицированный товар</div>
          </div>
        </div>
      </div>
    </div>
  );
};
