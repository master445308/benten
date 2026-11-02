import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, Plus, Minus, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleFavorite,
    isFavorite,
    setSelectedProduct
  } = useStore();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const isInCart = Boolean(cartItem);
  const quantity = cartItem?.quantity || 0;
  const isFav = isFavorite(product.id);

  // Discount percentage calculation
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
    >
      {/* Top badges & actions */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-md ${
                product.badge === 'Хит'
                  ? 'bg-amber-500/90 text-slate-950 font-black'
                  : product.badge === 'Новинка'
                  ? 'bg-cyan-500/90 text-slate-950 font-black'
                  : product.badge === 'Скидка'
                  ? 'bg-rose-500/90 text-white font-black'
                  : 'bg-purple-500/90 text-white font-black'
              }`}
            >
              {product.badge}
            </motion.span>
          )}
          {discountPercent > 0 && !product.badge?.includes('Скидка') && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/90 text-white shadow">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`pointer-events-auto p-2.5 rounded-2xl backdrop-blur-md border transition-all ${
            isFav
              ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
              : 'bg-slate-950/70 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500 text-pink-500' : ''}`} />
        </motion.button>
      </div>

      {/* Product Image */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative h-60 bg-gradient-to-b from-slate-950 to-slate-900/60 flex items-center justify-center p-5 cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/95 border border-slate-700 text-xs font-semibold text-slate-100 shadow-xl">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Быстрый просмотр
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-cyan-400 font-extrabold uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span
              className={`text-[11px] font-medium flex items-center gap-1.5 ${
                product.inStock && product.stockCount > 0
                  ? product.stockCount < 5
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.inStock && product.stockCount > 0
                    ? product.stockCount < 5
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-400'
                    : 'bg-rose-400'
                }`}
              />
              {product.inStock && product.stockCount > 0
                ? product.stockCount < 5
                  ? `Осталось ${product.stockCount} шт.`
                  : 'В наличии'
                : 'Под заказ'}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 font-bold text-slate-200">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="text-slate-400">{product.reviewsCount} отзывов</span>
          </div>

          {/* Specs preview (2 pills) */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.entries(product.specs)
              .slice(0, 2)
              .map(([key, val]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300 truncate max-w-[170px]"
                  title={`${key}: ${val}`}
                >
                  {val}
                </span>
              ))}
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg sm:text-xl font-black text-white tracking-tight">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
            {product.oldPrice && (
              <div className="text-xs text-slate-400 line-through">
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </div>
            )}
          </div>

          {/* Cart Button / Stepper */}
          <div>
            {isInCart ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center bg-cyan-950/80 border border-cyan-500/40 rounded-xl p-1 shadow-inner"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantity === 1) {
                      removeFromCart(product.id);
                    } else {
                      updateQuantity(product.id, quantity - 1);
                    }
                  }}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 flex items-center justify-center transition-colors"
                  aria-label="Уменьшить"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-bold text-xs text-cyan-200">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantity < product.stockCount) {
                      updateQuantity(product.id, quantity + 1);
                    }
                  }}
                  disabled={quantity >= product.stockCount}
                  className={`w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 flex items-center justify-center transition-colors ${
                    quantity >= product.stockCount ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                  aria-label="Увеличить"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={!product.inStock || product.stockCount <= 0}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                  product.inStock && product.stockCount > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Купить</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
