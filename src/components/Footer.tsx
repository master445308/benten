import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsAuthModalOpen, currentUser } = useStore();

  return (
    <footer className="mt-20 bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Electro<span className="text-cyan-400">Nova</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Премиальный интернет-магазин оригинальной электроники и гаджетов. Быстрая доставка по Москве за 2 часа и по всей России за 1-3 дня. Гарантия 24 месяца на весь ассортимент.
            </p>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">8 (800) 555-35-35</span>
                <span className="text-[11px] text-slate-500">(Бесплатно по РФ, 24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>support@electronova.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Москва, Пресненская наб., д. 12, Башня Федерация</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Смартфоны и гаджеты
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Ноутбуки и ультрабуки
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Наушники и Hi-Fi аудио
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Игровые консоли и VR
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  OLED мониторы и ТВ
                </button>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Покупателям</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('orders')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Отслеживание заказа
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('favorites')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Список желаний
                </button>
              </li>
              <li className="hover:text-slate-300">Доставка и самовывоз</li>
              <li className="hover:text-slate-300">Способы оплаты и рассрочка</li>
              <li className="hover:text-slate-300">Гарантия и сервисные центры</li>
            </ul>
          </div>

          {/* Admin access & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Управление</h4>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <Lock className="w-3.5 h-3.5" />
                Административная панель
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Закрытый раздел управления товарами, складскими остатками, заказами и акциями.
              </p>
              <button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    setCurrentView('admin');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full mt-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{currentUser?.role === 'admin' ? 'Открыть админку' : 'Вход для администратора'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Защищенные платежи 256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 ElectroNova Inc. Все права защищены. Интернет-магазин электроники и цифровой техники.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Политика конфиденциальности</span>
            <span>•</span>
            <span>Пользовательское соглашение</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
