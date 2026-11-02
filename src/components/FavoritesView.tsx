import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { products, favorites, setCurrentView } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500/20" />
            Избранные товары
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'сохраненный товар' : 'сохраненных товаров'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('catalog')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>В каталог товаров</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/20">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Список избранного пуст</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Нажимайте на сердечко на карточке любого товара, чтобы не потерять интересные гаджеты.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Перейти к покупкам
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
