import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, PromoCode } from '../types';
import { CATEGORIES_CONFIG, BRANDS_LIST } from '../data/initialProducts';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  Tag,
  AlertTriangle,
  X,
  Eye,
  DollarSign,
  Boxes,
  FileText,
  Save
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    products,
    orders,
    promoCodes,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    addPromoCode,
    deletePromoCode,
    resetAllData,
    setCurrentView,
    setIsAuthModalOpen
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'promos'>('analytics');

  // Product modal state (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for product
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState<Product['category']>('smartphones');
  const [price, setPrice] = useState(99990);
  const [oldPrice, setOldPrice] = useState<number | undefined>(114990);
  const [stockCount, setStockCount] = useState(10);
  const [badge, setBadge] = useState('Новинка');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [specsText, setSpecsText] = useState('Процессор: Apple A18 Pro\nЭкран: 6.7" OLED 120Hz\nПамять: 256GB');

  // Filters for admin product list
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Order filters and view
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Promo code form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState(15);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Protect admin panel
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Требуется доступ администратора</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Данный раздел защищен. Пожалуйста, авторизуйтесь в системе с правами администратора.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          Войти как администратор
        </button>
      </div>
    );
  }

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setBrand('Apple');
    setCategory('smartphones');
    setPrice(49990);
    setOldPrice(59990);
    setStockCount(15);
    setBadge('Новинка');
    setImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
    setDescription('Новейшее устройство с передовыми характеристиками и гарантией качества.');
    setSpecsText('Процессор: Флагманский 8-ядерный\nПамять: 256 ГБ\nЭкран: 120 Гц AMOLED');
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setBrand(p.brand);
    setCategory(p.category);
    setPrice(p.price);
    setOldPrice(p.oldPrice);
    setStockCount(p.stockCount);
    setBadge(p.badge || '');
    setImage(p.image);
    setDescription(p.description);
    const formattedSpecs = Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    setSpecsText(formattedSpecs);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse specs from lines
    const parsedSpecs: Record<string, string> = {};
    specsText.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const k = parts[0].trim();
        const v = parts.slice(1).join(':').trim();
        if (k && v) parsedSpecs[k] = v;
      }
    });

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        brand,
        category,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : undefined,
        stockCount: Number(stockCount),
        inStock: Number(stockCount) > 0,
        badge: badge || undefined,
        image,
        description,
        specs: parsedSpecs
      });
    } else {
      addProduct({
        title,
        brand,
        category,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : undefined,
        rating: 5.0,
        reviewsCount: 1,
        inStock: Number(stockCount) > 0,
        stockCount: Number(stockCount),
        badge: badge || undefined,
        image,
        description,
        specs: parsedSpecs
      });
    }

    setIsProductModalOpen(false);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    addPromoCode({
      code: newPromoCode.trim().toUpperCase(),
      discountPercent: Number(newPromoPercent),
      description: newPromoDesc.trim() || `Скидка ${newPromoPercent}% на электронику`
    });
    setNewPromoCode('');
    setNewPromoPercent(10);
    setNewPromoDesc('');
  };

  // Analytics Computations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  // Filtered Products
  const filteredAdminProducts = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Admin Identity & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white">Панель управления магазином</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Администратор
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Управление каталогом электроники, складскими запасами, заказами клиентов и промокодами
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            title="Восстановить исходные демо-данные"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Сбросить данные</span>
          </button>
          <button
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <span>В магазин</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Аналитика & Статистика</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Товары и склад ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Заказы клиентов ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'promos'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Промокоды ({promoCodes.length})</span>
        </button>
      </div>

      {/* TAB 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Общая выручка</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {totalRevenue.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                По {totalOrders} оформленным заказам
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Всего заказов</span>
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalOrders} шт.</div>
              <div className="text-[11px] text-cyan-400 font-medium">
                {orders.filter((o) => o.status === 'новый').length} новых заказов
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Средний чек</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {avgOrderValue.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[11px] text-slate-400">Высокая маржинальность</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Позиций в каталоге</span>
                <Boxes className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{products.length} товаров</div>
              <div className="text-[11px] text-amber-400 font-medium">
                {lowStockProducts.length} требуют пополнения
              </div>
            </div>
          </div>

          {/* Low Stock Notification */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-amber-300">Внимание: Заканчиваются остатки на складе!</h4>
                <p className="text-slate-300 mt-1">
                  Следующие товары имеют остаток 5 или менее штук:{' '}
                  {lowStockProducts.map((p) => `${p.title} (${p.stockCount} шт.)`).join(', ')}.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
              >
                Пополнить склад
              </button>
            </div>
          )}

          {/* Sales breakdown preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                Распределение каталога по категориям
              </h3>
              <div className="space-y-2.5">
                {CATEGORIES_CONFIG.filter((c) => c.id !== 'all').map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  const pct = Math.round((count / (products.length || 1)) * 100);
                  return (
                    <div key={cat.id} className="text-xs space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>{cat.label}</span>
                        <span className="font-mono text-slate-400">
                          {count} шт. ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Статусы заказов
              </h3>
              <div className="space-y-3">
                {(['новый', 'в обработке', 'отправлен', 'доставлен', 'отменен'] as OrderStatus[]).map(
                  (st) => {
                    const count = orders.filter((o) => o.status === st).length;
                    return (
                      <div
                        key={st}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                      >
                        <span className="capitalize font-semibold text-slate-200">{st}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-cyan-300">
                          {count}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Поиск товара по названию/бренду..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {CATEGORIES_CONFIG.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить товар в каталог</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Товар</th>
                  <th className="p-3.5">Категория</th>
                  <th className="p-3.5">Цена</th>
                  <th className="p-3.5">Остаток</th>
                  <th className="p-3.5">Бейдж</th>
                  <th className="p-3.5 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAdminProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={prod.image}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase block">
                          {prod.brand}
                        </span>
                        <span className="font-semibold text-white block truncate max-w-xs sm:max-w-md">
                          {prod.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap capitalize text-slate-400">
                      {prod.category}
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-bold text-white font-mono">
                      {prod.price.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateProduct(prod.id, {
                              stockCount: Math.max(0, prod.stockCount - 1),
                              inStock: prod.stockCount - 1 > 0
                            })
                          }
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            prod.stockCount <= 3
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'text-slate-200'
                          }`}
                        >
                          {prod.stockCount}
                        </span>
                        <button
                          onClick={() =>
                            updateProduct(prod.id, {
                              stockCount: prod.stockCount + 5,
                              inStock: true
                            })
                          }
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center justify-center font-bold"
                          title="Пополнить на 5 шт."
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {prod.badge ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="Редактировать товар"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Удалить товар"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Поиск по ID заказа, клиенту или телефону..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['all', 'новый', 'в обработке', 'отправлен', 'доставлен', 'отменен'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    orderStatusFilter === st
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Все статусы' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">ID заказа</th>
                  <th className="p-3.5">Клиент</th>
                  <th className="p-3.5">Товары</th>
                  <th className="p-3.5">Сумма</th>
                  <th className="p-3.5">Статус</th>
                  <th className="p-3.5 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-cyan-400">
                      {ord.id}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.phone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {ord.city}, {ord.address}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium">
                        {ord.items.length} {ord.items.length === 1 ? 'позиция' : 'позиции'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[220px]">
                        {ord.items.map((i) => i.product.title).join(', ')}
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-white">
                      {ord.totalAmount.toLocaleString('ru-RU')} ₽
                      {ord.promoCodeUsed && (
                        <span className="block text-[10px] text-emerald-400 font-sans">
                          Код: {ord.promoCodeUsed}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                          ord.status === 'новый'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                            : ord.status === 'в обработке'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : ord.status === 'отправлен'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : ord.status === 'доставлен'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-500 text-rose-300'
                        }`}
                      >
                        <option value="новый">новый</option>
                        <option value="в обработке">в обработке</option>
                        <option value="отправлен">отправлен</option>
                        <option value="доставлен">доставлен</option>
                        <option value="отменен">отменен</option>
                      </select>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="Просмотр деталей заказа"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOrder(ord.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Удалить заказ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Promo Codes */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Promo Code */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              Создать новый промокод
            </h3>
            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Код промокода</label>
                <input
                  type="text"
                  required
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="НАПР. SUMMER2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Размер скидки (%)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={newPromoPercent}
                  onChange={(e) => setNewPromoPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Описание акции</label>
                <input
                  type="text"
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  placeholder="Скидка для постоянных клиентов"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
              >
                Сохранить промокод
              </button>
            </form>
          </div>

          {/* Active Promo Codes List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-white">Действующие промокоды</h3>
            <div className="space-y-2">
              {promoCodes.map((p) => (
                <div
                  key={p.code}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                        {p.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        -{p.discountPercent}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  </div>

                  <button
                    onClick={() => deletePromoCode(p.code)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Удалить промокод"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Название товара</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Apple iPhone 16 Pro Max 256GB"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Бренд</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Apple, Samsung, Sony..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Категория</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="smartphones">Смартфоны</option>
                    <option value="laptops">Ноутбуки и ПК</option>
                    <option value="audio">Аудио и наушники</option>
                    <option value="wearables">Умные часы</option>
                    <option value="gaming">Гейминг и консоли</option>
                    <option value="monitors">Мониторы и ТВ</option>
                    <option value="accessories">Аксессуары</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Цена продажи (₽)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Старая цена (₽, зачеркнутая)</label>
                  <input
                    type="number"
                    value={oldPrice || ''}
                    onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Количество на складе</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Бейдж (напр. Хит, Новинка, Скидка)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Ссылка на фото (URL)</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Описание</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Характеристики (формат: Ключ: Значение, каждый с новой строки)
                  </label>
                  <textarea
                    rows={4}
                    value={specsText}
                    onChange={(e) => setSpecsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Order Receipt Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">{viewingOrder.id}</span>
                <h3 className="text-base font-bold text-white">Детали заказа</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Клиент:</span>
                  <span className="font-semibold text-white">{viewingOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Телефон:</span>
                  <span className="font-semibold text-white">{viewingOrder.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Способ доставки:</span>
                  <span className="font-semibold text-white capitalize">{viewingOrder.deliveryMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Оплата:</span>
                  <span className="font-semibold text-white capitalize">{viewingOrder.paymentMethod}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Адрес доставки:</span>
                <span className="font-medium text-white">{viewingOrder.city}, {viewingOrder.address}</span>
              </div>

              {viewingOrder.notes && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-slate-400 block text-[10px]">Примечание клиента:</span>
                  {viewingOrder.notes}
                </div>
              )}

              {/* Order items */}
              <div className="pt-2">
                <span className="text-slate-400 block text-[10px] mb-1.5 uppercase font-bold">
                  Состав заказа:
                </span>
                <div className="space-y-1.5">
                  {viewingOrder.items.map((i) => (
                    <div
                      key={i.product.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 text-slate-200"
                    >
                      <span className="truncate max-w-[220px]">
                        {i.product.title} × {i.quantity}
                      </span>
                      <span className="font-mono font-bold">
                        {(i.product.price * i.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Итого к получению:</span>
                <span className="text-cyan-400 font-black text-base">
                  {viewingOrder.totalAmount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            <button
              onClick={() => setViewingOrder(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
