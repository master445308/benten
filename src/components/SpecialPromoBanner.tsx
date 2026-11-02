import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Zap, Clock, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const SpecialPromoBanner: React.FC = () => {
  const { applyPromoCode, setIsCartOpen } = useStore();

  const handleApplyPromo = () => {
    applyPromoCode('MONIS05');
    setIsCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-12 relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-purple-950 p-6 sm:p-10 shadow-2xl"
    >
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Горячая акция месяца
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Осталось 48 часов
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Скидка 15% на всю цифровую технику по коду{' '}
            <span className="text-cyan-400 font-mono underline decoration-cyan-500/50">
              MONIS05
            </span>
          </h2>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Примените секретный промокод при оформлении любого заказа и получите скидку 15% на флагманские смартфоны, ультрабуки, наушники и консоли. Доставка курьером до двери бесплатно!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApplyPromo}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all"
            >
              <Tag className="w-4 h-4" />
              <span>Применить промокод MONIS05</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Showcase Images Collage */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative">
            <motion.img
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80"
              alt="Hi-Fi Audio Promo"
              className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-3xl border-2 border-cyan-500/40 shadow-2xl filter brightness-95"
            />
            <div className="absolute -bottom-3 -right-3 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Оригинал 100%</div>
                <div className="text-[10px] text-slate-400">Гарантия 2 года</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
