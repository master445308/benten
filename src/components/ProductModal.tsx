import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    cart,
    toggleFavorite,
    isFavorite,
    setIsCartOpen
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image];

  const currentImg = images[activeImageIndex] || selectedProduct.image;
  const isFav = isFavorite(selectedProduct.id);
  const cartItem = cart.find((item) => item.product.id === selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = () => {
    if (!cartItem) {
      addToCart(selectedProduct, quantity);
    }
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={() => setSelectedProduct(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {selectedProduct.brand}
            </span>
            {selectedProduct.badge && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedProduct.badge}
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Gallery Section */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={currentImg}
                  alt={selectedProduct.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl bg-slate-950 border overflow-hidden p-1 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta Section */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {selectedProduct.title}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="ml-1 font-bold">{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedProduct.reviewsCount} отзывов покупателей</span>
                  <span>•</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      selectedProduct.inStock ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {selectedProduct.stockCount > 0
                      ? `В наличии: ${selectedProduct.stockCount} шт.`
                      : 'Нет в наличии'}
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {selectedProduct.price.toLocaleString('ru-RU')} ₽
                    </div>
                    {selectedProduct.oldPrice && (
                      <div className="text-sm text-slate-400 line-through">
                        {selectedProduct.oldPrice.toLocaleString('ru-RU')} ₽
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">
                      Гарантия лучшей цены
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Описание
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Быстрая доставка</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Гарантия 24 месяца</span>
                  </div>
                </div>
              </div>

              {/* Purchase Controls */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-200 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount, q + 1))}
                      disabled={quantity >= selectedProduct.stockCount}
                      className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-200 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedProduct.inStock || selectedProduct.stockCount <= 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm transition-all"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>В корзину</span>
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedProduct.inStock || selectedProduct.stockCount <= 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Купить сразу</span>
                  </button>

                  {/* Favorite toggle */}
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={`p-3 rounded-xl border transition-colors ${
                      isFav
                        ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-pink-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full Technical Specifications */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-cyan-400" />
              Технические характеристики
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(selectedProduct.specs).map(([specKey, specVal]) => (
                <div
                  key={specKey}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                >
                  <span className="text-slate-400 font-medium">{specKey}</span>
                  <span className="text-slate-100 font-semibold text-right max-w-[60%]">
                    {specVal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
