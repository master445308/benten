import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryVisualCardsProps {
  onSelectCategory: (catId: string) => void;
  selectedCategory: string;
}

const CATEGORY_CARDS = [
  {
    id: 'smartphones',
    title: 'Смартфоны & AI',
    subtitle: 'iPhone 16 Pro, Galaxy S25',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    color: 'from-blue-600/40 via-cyan-900/30 to-slate-950',
    accentBorder: 'group-hover:border-cyan-500/60',
    badge: 'Топ продаж'
  },
  {
    id: 'laptops',
    title: 'Ноутбуки & ПК',
    subtitle: 'MacBook M3, ROG OLED',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    color: 'from-purple-600/40 via-indigo-900/30 to-slate-950',
    accentBorder: 'group-hover:border-purple-500/60',
    badge: 'Pro сектор'
  },
  {
    id: 'audio',
    title: 'Аудио & Hi-Fi',
    subtitle: 'Sony, AirPods Pro, Marshall',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-600/40 via-orange-900/30 to-slate-950',
    accentBorder: 'group-hover:border-amber-500/60',
    badge: 'Hi-Res'
  },
  {
    id: 'gaming',
    title: 'Консоли & Игры',
    subtitle: 'PlayStation 5 Pro 2TB',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-600/40 via-teal-900/30 to-slate-950',
    accentBorder: 'group-hover:border-emerald-500/60',
    badge: 'Ray Tracing'
  },
  {
    id: 'wearables',
    title: 'Умные часы',
    subtitle: 'Apple Watch Ultra 2, Galaxy',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    color: 'from-rose-600/40 via-pink-900/30 to-slate-950',
    accentBorder: 'group-hover:border-pink-500/60',
    badge: 'Титановый корпус'
  },
  {
    id: 'monitors',
    title: 'OLED Мониторы',
    subtitle: 'LG Curved 240Hz, 800R',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    color: 'from-cyan-600/40 via-blue-900/30 to-slate-950',
    accentBorder: 'group-hover:border-cyan-400/60',
    badge: '0.03 мс'
  }
];

export const CategoryVisualCards: React.FC<CategoryVisualCardsProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  const { products } = useStore();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Популярные категории устройств
          </h2>
          <p className="text-xs text-slate-400">
            Оригинальные флагманы от ведущих мировых производителей с официальной гарантией
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORY_CARDS.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const count = products.filter((p) => p.category === cat.id).length;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 bg-slate-900/90 shadow-lg ${cat.accentBorder} ${
                isSelected
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Background image with gradient tint */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center opacity-30 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700 filter brightness-90"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-90`}
                />
              </div>

              {/* Top tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/70 border border-white/10 text-slate-300 backdrop-blur-md">
                  {cat.badge}
                </span>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 space-y-0.5">
                <div className="text-[11px] text-cyan-300 font-mono font-medium">
                  {count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
