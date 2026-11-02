import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Zap,
  ShoppingCart,
  Heart,
  ShieldCheck,
  User as UserIcon,
  Search,
  Package,
  SlidersHorizontal,
  LogOut,
  X
} from 'lucide-react';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange, searchQuery }) => {
  const {
    cartCount,
    cartTotal,
    favorites,
    currentUser,
    currentView,
    setCurrentView,
    setIsCartOpen,
    setIsAuthModalOpen,
    logout
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-800/50 py-1 px-4 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Скидка 15% по промокоду <strong className="text-cyan-400 font-semibold">MONIS05</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span>Бесплатная доставка от 5 000 ₽</span>
            <span>•</span>
            <span>Официальная гарантия 2 года</span>
            <span>•</span>
            <span className="text-slate-300">Поддержка: 8 (800) 555-35-35</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <div
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Electro<span className="text-cyan-400">Nova</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase block -mt-1 font-medium">
                Электроника 2026
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Поиск смартфонов, ноутбуков, аудио, консолей..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/70 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View navigation links */}
            <button
              onClick={() => setCurrentView('catalog')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentView === 'catalog'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Каталог
            </button>

            {/* Orders view */}
            <button
              onClick={() => setCurrentView('orders')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentView === 'orders'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Заказы</span>
            </button>

            {/* Favorites view */}
            <button
              onClick={() => setCurrentView('favorites')}
              className={`relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all ${
                currentView === 'favorites' ? 'bg-slate-800 text-pink-400' : ''
              }`}
              title="Избранные товары"
            >
              <Heart
                className={`w-5 h-5 ${favorites.length > 0 ? 'text-pink-500 fill-pink-500/20' : ''}`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[10px] font-black px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-slate-950">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartTotal > 0 ? `${cartTotal.toLocaleString('ru-RU')} ₽` : 'Корзина'}
              </span>
            </button>

            {/* Admin or User profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => setCurrentView(currentView === 'admin' ? 'catalog' : 'admin')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      currentView === 'admin'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900 border-amber-500/40 text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Админка ({currentUser.username})</span>
                    <span className="sm:hidden">Админ</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200">
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{currentUser.username}</span>
                  </div>
                )}

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 hover:text-white transition-all"
              >
                <UserIcon className="w-4 h-4 text-cyan-400" />
                <span>Войти</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск товаров в ElectroNova..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
