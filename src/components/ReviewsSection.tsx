import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle, ShieldCheck, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    author: 'Максим Романов',
    city: 'Москва',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    item: 'Apple iPhone 16 Pro Max 256GB',
    rating: 5,
    date: '2 дня назад',
    verified: true,
    text: 'Заказывал с экспресс-доставкой за 2 часа — курьер приехал ровно через 1 час 20 минут! Телефон запечатан, проверил по серийному номеру на сайте Apple — абсолютно чистый оригинал. Применил промокод MONIS05, экономия получилась больше 20 000 рублей!'
  },
  {
    id: 2,
    author: 'Анастасия Ковалева',
    city: 'Санкт-Петербург',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    item: 'Sony WH-1000XM5 Black',
    rating: 5,
    date: '4 дня назад',
    verified: true,
    text: 'Шумоподавление в наушниках просто космос! В самолете и метро наступает абсолютная тишина. Упаковка пришла в идеальном состоянии в защитной коробке с воздушной пленкой. Ребятам из ElectroNova отдельное спасибо за оперативность!'
  },
  {
    id: 3,
    author: 'Артем Мельников',
    city: 'Казань',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    item: 'PlayStation 5 Pro 2TB',
    rating: 5,
    date: '1 неделю назад',
    verified: true,
    text: 'Долго охотился за версией Pro на 2 ТБ памяти. Здесь была лучшая цена в наличии. Графика с PSSR масштабированием в 60-120 FPS на 4K OLED выглядит просто нереально четко. Магазин супер, однозначно рекомендую!'
  }
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="my-16">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/20 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Репутация магазина
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Отзывы реальных покупателей
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Более 2 840 довольных клиентов уже обновили свои гаджеты в ElectroNova в 2026 году
            </p>
          </div>

          {/* Rating Summary Score */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
              4.9
            </div>
            <div>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                На основе 2 840+ отзывов
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 flex flex-col justify-between space-y-4 shadow-lg transition-all"
            >
              <div className="space-y-3">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {review.author}
                      </h4>
                      <div className="text-[11px] text-slate-400">{review.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Verified Purchase Tag */}
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
                  <CheckCircle className="w-3 h-3" />
                  <span>Куплено: <strong>{review.item}</strong></span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  "{review.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>{review.date}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <ThumbsUp className="w-3 h-3 text-cyan-400" />
                  Полезный отзыв
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
