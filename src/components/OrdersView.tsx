import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { OrderStatus } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, setCurrentView, setIsCartOpen } = useStore();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'новый':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" />
            Новый заказ
          </span>
        );
      case 'в обработке':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            В сборке
          </span>
        );
      case 'отправлен':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Truck className="w-3.5 h-3.5" />
            В пути к вам
          </span>
        );
      case 'доставлен':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Доставлен
          </span>
        );
      case 'отменен':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            Отменен
          </span>
        );
    }
  };

  const getStatusProgress = (status: OrderStatus) => {
    switch (status) {
      case 'новый':
        return 25;
      case 'в обработке':
        return 50;
      case 'отправлен':
        return 75;
      case 'доставлен':
        return 100;
      case 'отменен':
        return 0;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Мои заказы</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Отслеживание статуса доставки и история покупок
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

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">У вас пока нет заказов</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Оформите заказ на любимый гаджет с быстрой доставкой по всей стране.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const progress = getStatusProgress(order.status);
            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
              >
                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-cyan-400">{order.id}</span>
                    <span className="text-xs text-slate-400">
                      от {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-base font-black text-white font-mono">
                      {order.totalAmount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                {/* Progress bar timeline */}
                {order.status !== 'отменен' && (
                  <div className="py-2 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span className={progress >= 25 ? 'text-cyan-400 font-bold' : ''}>Оформлен</span>
                      <span className={progress >= 50 ? 'text-cyan-400 font-bold' : ''}>В сборке</span>
                      <span className={progress >= 75 ? 'text-cyan-400 font-bold' : ''}>Передан курьеру</span>
                      <span className={progress === 100 ? 'text-emerald-400 font-bold' : ''}>Получен</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Order items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      Товары в заказе:
                    </span>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-semibold text-slate-200 truncate">
                              {item.product.title}
                            </h5>
                            <span className="text-[11px] text-slate-400">
                              {item.quantity} шт. × {item.product.price.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & recipient info */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      Детали доставки:
                    </span>
                    <div>
                      Получатель: <strong className="text-white">{order.customerName}</strong> ({order.phone})
                    </div>
                    <div>
                      Адрес: <strong className="text-white">{order.city}, {order.address}</strong>
                    </div>
                    <div>
                      Оплата: <span className="capitalize">{order.paymentMethod === 'card_online' ? 'Картой онлайн' : order.paymentMethod === 'sbp_qr' ? 'СБП QR' : 'При получении'}</span>
                    </div>
                    {order.promoCodeUsed && (
                      <div className="text-emerald-400">
                        Применен промокод: <strong className="font-mono">{order.promoCodeUsed}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
