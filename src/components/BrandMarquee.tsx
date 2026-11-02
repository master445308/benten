import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BrandMarqueeProps {
  onSelectBrand: (brand: string) => void;
  selectedBrand?: string;
}

const BRANDS = [
  { name: 'Apple', logo: '', tag: 'Флагманы iOS' },
  { name: 'Samsung', logo: '✦', tag: 'Galaxy AI' },
  { name: 'Sony', logo: 'S', tag: 'Hi-Res Audio & PS5' },
  { name: 'ASUS', logo: 'ROG', tag: 'Zephyrus & Gaming' },
  { name: 'LG', logo: 'LG', tag: 'OLED 240Hz' },
  { name: 'DJI', logo: 'DJI', tag: 'Дроны 4K HDR' },
  { name: 'Logitech', logo: 'Logi', tag: 'MX Master & Pro' },
  { name: 'Marshall', logo: 'M', tag: 'Винтажный звук' }
];

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({ onSelectBrand, selectedBrand }) => {
  return (
    <div className="my-8 py-4 px-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Официальные бренды с гарантией 2 года
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Нажмите на бренд для быстрой фильтрации
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {BRANDS.map((b, idx) => {
          const isSelected = selectedBrand === b.name;
          return (
            <motion.button
              key={b.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectBrand(b.name)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 group ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/15'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <span className="font-mono text-base font-extrabold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {b.logo}
              </span>
              <span className="text-xs font-bold text-white tracking-wide">{b.name}</span>
              <span className="text-[9px] text-slate-400 truncate max-w-full">
                {b.tag}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
