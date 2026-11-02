export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'smartphones' | 'laptops' | 'audio' | 'wearables' | 'gaming' | 'monitors' | 'accessories';
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: 'Хит' | 'Новинка' | 'Скидка' | 'Выбор редакции' | string;
  image: string;
  images?: string[];
  description: string;
  specs: Record<string, string>;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'новый' | 'в обработке' | 'отправлен' | 'доставлен' | 'отменен';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryMethod: 'courier' | 'pickup' | 'express';
  paymentMethod: 'card_online' | 'cash_on_delivery' | 'sbp_qr';
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  promoCodeUsed?: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface User {
  username: string;
  role: 'admin' | 'user';
  name: string;
  email?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minOrderAmount?: number;
  description: string;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
