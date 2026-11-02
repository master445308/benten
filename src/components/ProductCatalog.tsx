import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES_CONFIG, BRANDS_LIST } from '../data/initialProducts';
import {
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Tv,
  Cpu,
  Grid,
  RotateCcw,
  Search,
  Sparkles
} from 'lucide-react';

interface ProductCatalogProps {
  searchQuery: string;
  onClearSearch: () => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  externalSelectedBrand?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  searchQuery,
  onClearSearch,
  selectedCategory,
  onSelectCategory,
  externalSelectedBrand
}) => {
  const { products } = useStore();

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(450000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  React.useEffect(() => {
    if (externalSelectedBrand) {
      setSelectedBrands([externalSelectedBrand]);
    }
  }, [externalSelectedBrand]);

  // Toggle brand
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(300000);
    setInStockOnly(false);
    setSortBy('popular');
    onClearSearch();
    onSelectCategory('all');
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesSpecs = Object.values(p.specs).some((v) =>
            v.toLowerCase().includes(q)
          );
          if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesSpecs) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Brands
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Price
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }

        // In Stock
        if (inStockOnly && (!p.inStock || p.stockCount <= 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popular':
          default:
            return b.reviewsCount - a.reviewsCount;
        }
      });
  }, [products, searchQuery, selectedCategory, selectedBrands, minPrice, maxPrice, inStockOnly, sortBy]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'smartphones':
        return <Smartphone className="w-4 h-4" />;
      case 'laptops':
        return <Laptop className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      case 'gaming':
        return <Gamepad2 className="w-4 h-4" />;
      case 'wearables':
        return <Watch className="w-4 h-4" />;
      case 'monitors':
        return <Tv className="w-4 h-4" />;
      case 'accessories':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    minPrice > 0 ||
    maxPrice < 300000 ||
    inStockOnly ||
    selectedCategory !== 'all' ||
    Boolean(searchQuery);

  return (
    <div className="space-y-6">
      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_CONFIG.map((cat) => {
          const count =
            cat.id === 'all'
              ? products.length
              : products.filter((p) => p.category === cat.id).length;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-cyan-400'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-5 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              Фильтры каталога
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                title="Сбросить все фильтры"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Сброс</span>
              </button>
            )}
          </div>

          {/* In Stock Only Switch */}
          <div className="flex items-center justify-between">
            <label htmlFor="inStock" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Только в наличии
            </label>
            <input
              id="inStock"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500 focus:ring-offset-slate-900"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Цена, ₽</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                max={maxPrice}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="От"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
              <input
                type="number"
                min={minPrice}
                max="300000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="До"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Brands */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">Бренды</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {BRANDS_LIST.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500"
                      />
                      <span>{brand}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {products.filter((p) => p.brand === brand).length}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Найдено: <strong className="text-white">{filteredProducts.length}</strong> товаров
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Поиск: "{searchQuery}"
                  <button onClick={onClearSearch} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Фильтры</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Сначала дешевле</option>
                  <option value="price-desc">Сначала дороже</option>
                  <option value="rating">По рейтингу</option>
                  <option value="newest">Новинки</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-slate-800 text-slate-200 border border-slate-700">
                  Категория: {CATEGORIES_CONFIG.find((c) => c.id === selectedCategory)?.label}
                  <button onClick={() => onSelectCategory('all')}>
                    <X className="w-3 h-3 text-slate-400 hover:text-white" />
                  </button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {b}
                  <button onClick={() => toggleBrand(b)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-white" />
                  </button>
                </span>
              ))}

              {(minPrice > 0 || maxPrice < 300000) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-slate-800 text-slate-200 border border-slate-700">
                  {minPrice.toLocaleString()} – {maxPrice.toLocaleString()} ₽
                  <button
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(300000);
                    }}
                  >
                    <X className="w-3 h-3 text-slate-400 hover:text-white" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-slate-800 text-slate-200 border border-slate-700">
                  В наличии
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-white" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-cyan-400 hover:underline ml-1"
              >
                Очистить все
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Ничего не найдено</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Попробуйте изменить поисковый запрос или сбросить активные фильтры.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Фильтры каталога</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In stock */}
            <div className="flex items-center justify-between">
              <label htmlFor="mobInStock" className="text-xs font-semibold text-slate-300">
                Только товары в наличии
              </label>
              <input
                id="mobInStock"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Ценовой диапазон (₽)</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="От"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="До"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Бренды</span>
              <div className="grid grid-cols-2 gap-2">
                {BRANDS_LIST.map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left ${
                      selectedBrands.includes(b)
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Сбросить
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
