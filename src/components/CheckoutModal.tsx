import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  ShieldCheck,
  QrCode,
  PackageCheck,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedPromo,
    createOrder,
    currentUser,
    setCurrentView
  } = useStore();

  const [name, setName] = useState(currentUser?.name || 'Алексей Морозов');
  const [phone, setPhone] = useState('+7 (999) 123-45-67');
  const [email, setEmail] = useState(currentUser?.email || 'morozov@example.com');
  const [city, setCity] = useState('Москва');
  const [address, setAddress] = useState('ул. Арбат, д. 22, кв. 14');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup' | 'express'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'card_online' | 'cash_on_delivery' | 'sbp_qr'>('card_online');
  const [notes, setNotes] = useState('Код домофона #452');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    const shippingFee = deliveryMethod === 'express' ? 690 : cartSubtotal > 5000 ? 0 : 490;
    const finalTotal = cartTotal + (deliveryMethod === 'express' ? 690 : 0);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName: name,
        phone,
        email,
        city,
        address,
        deliveryMethod,
        paymentMethod,
        items: [...cart],
        subtotal: cartSubtotal,
        discountAmount: cartDiscount,
        shippingFee,
        totalAmount: finalTotal,
        promoCodeUsed: appliedPromo?.code,
        notes
      });

      setIsSubmitting(false);
      setConfirmedOrder(newOrder);

      // Trigger festive confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const handleFinish = () => {
    setConfirmedOrder(null);
    setIsCheckoutOpen(false);
    setCurrentView('orders');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {confirmedOrder ? 'Заказ успешно оформлен!' : 'Оформление заказа'}
            </h2>
          </div>
          {!confirmedOrder && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {confirmedOrder ? (
          /* Order Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                Заказ № {confirmedOrder.id}
              </span>
              <h3 className="text-xl font-bold text-white mt-2 mb-1">
                Спасибо за покупку в ElectroNova!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Мы отправили подтверждение на {confirmedOrder.email}. Менеджер свяжется с вами по номеру {confirmedOrder.phone} в течение 10 минут.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span>Товары ({confirmedOrder.items.length}):</span>
                <span className="font-semibold text-white">
                  {confirmedOrder.totalAmount.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              <div className="space-y-1.5">
                {confirmedOrder.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-slate-300">
                    <span className="truncate max-w-[280px]">
                      {item.product.title} × {item.quantity}
                    </span>
                    <span className="font-mono">
                      {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-300">
                <span>Адрес доставки:</span>
                <span className="text-white font-medium text-right">
                  {confirmedOrder.city}, {confirmedOrder.address}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleFinish}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Перейти к моим заказам</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setIsCheckoutOpen(false);
                  setCurrentView('catalog');
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* 1. Contact Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                1. Контактные данные
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Имя и Фамилия</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    placeholder="Иван Петров"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Номер телефона</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Email для чека</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                2. Способ доставки
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label
                  onClick={() => setDeliveryMethod('courier')}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'courier'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">Курьер до двери</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">1-2 дня (Бесплатно от 5 000 ₽)</span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">Экспресс за 2 часа</span>
                  <span className="text-[10px] text-cyan-400 mt-0.5">+690 ₽ к заказу</span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">Самовывоз</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">ElectroNova Hub (Бесплатно)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Город</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Адрес доставки</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Улица, дом, подъезд, квартира"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                3. Способ оплаты
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card_online')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card_online'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    Картой онлайн
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Мир, Visa, Mastercard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sbp_qr')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'sbp_qr'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    СБП (QR-код)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Мгновенная оплата 0%</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    При получении
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Картой или наличными</div>
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Примечание / Комментарий для курьера (необязательно)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Например: Не звонить в звонок, спит ребенок"
                />
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Сумма товаров:</span>
                <span>{cartSubtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Скидка ({appliedPromo?.code}):</span>
                  <span>-{cartDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Доставка:</span>
                <span>{deliveryMethod === 'express' ? '690 ₽' : cartSubtotal > 5000 ? 'Бесплатно' : '490 ₽'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Итого к оплате:</span>
                <span className="text-cyan-400 text-base font-black">
                  {(cartTotal + (deliveryMethod === 'express' ? 690 : 0)).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Создаем ваш заказ...' : 'Подтвердить заказ'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
