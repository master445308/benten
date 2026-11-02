import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Truck,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoError('');
    const result = applyPromoCode(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThreshold = 5000;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const leftForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Корзина товаров</h2>
              <span className="text-xs text-slate-400">
                {cartCount === 0
                  ? 'Пусто'
                  : `${cartCount} ${cartCount === 1 ? 'позиция' : cartCount < 5 ? 'позиции' : 'позиций'}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1"
                title="Очистить корзину"
              >
                Очистить
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free shipping progress bar */}
        {cart.length > 0 && (
          <div className="bg-slate-950/70 px-5 py-3 border-b border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 text-slate-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                {leftForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-semibold">
                    Бесплатная доставка активна!
                  </span>
                ) : (
                  <span>
                    До бесплатной доставки: <strong className="text-white">{leftForFreeShipping.toLocaleString('ru-RU')} ₽</strong>
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-slate-800/60">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Корзина пуста</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Выберите современные гаджеты в каталоге и добавьте их сюда.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="pt-3.5 first:pt-0 flex gap-3.5 items-start">
                {/* Thumb */}
                <div className="w-18 h-18 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-semibold text-white truncate mb-1">
                    {item.product.title}
                  </h4>

                  <div className="text-xs font-bold text-slate-200 mb-2">
                    {item.product.price.toLocaleString('ru-RU')} ₽
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockCount}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-black text-cyan-400">
                      {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
            {/* Promo code form */}
            <div className="space-y-1.5">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>
                      Промокод <strong className="font-mono text-white">{appliedPromo.code}</strong> (-{appliedPromo.discountPercent}%)
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Удалить
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Промокод (напр. MONIS05)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white uppercase placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    Применить
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-400">{promoError}</p>
              )}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Сумма товаров:</span>
                <span className="font-semibold">{cartSubtotal.toLocaleString('ru-RU')} ₽</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Скидка по промокоду:</span>
                  <span className="font-semibold">-{cartDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-400">Доставка:</span>
                <span className="font-semibold text-slate-200">
                  {cartSubtotal > 5000 ? 'Бесплатно' : '490 ₽'}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Итого:</span>
                <span className="text-cyan-400">{cartTotal.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
