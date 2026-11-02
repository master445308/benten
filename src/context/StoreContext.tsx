import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, User, PromoCode, ToastMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PROMO_CODES } from '../data/initialProducts';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  currentUser: User | null;
  favorites: string[];
  toasts: ToastMessage[];
  currentView: 'catalog' | 'admin' | 'orders' | 'favorites';
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  isCheckoutOpen: boolean;

  // View navigation
  setCurrentView: (view: 'catalog' | 'admin' | 'orders' | 'favorites') => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;

  // Favorites
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Product management (Admin)
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetAllData: () => void;

  // Orders
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Promo code management (Admin)
  addPromoCode: (promo: PromoCode) => void;
  deletePromoCode: (code: string) => void;

  // Auth
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Toast
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_products_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Promo Codes
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_promos');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PROMO_CODES;
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Auth User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('electronova_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_favs');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // UI state
  const [currentView, setCurrentView] = useState<'catalog' | 'admin' | 'orders' | 'favorites'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('electronova_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('electronova_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('electronova_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('electronova_promos', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('electronova_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('electronova_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('electronova_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = appliedPromo ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100) : 0;
  const shippingFee = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 490;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast({
      type: 'success',
      title: 'Добавлено в корзину',
      message: `${product.title} (${quantity} шт.)`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast({
      type: 'info',
      title: 'Удалено из корзины'
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: 'Промокод не найден или устарел' };
    }
    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Минимальная сумма заказа для этого промокода: ${found.minOrderAmount} ₽`
      };
    }
    setAppliedPromo(found);
    addToast({
      type: 'success',
      title: 'Промокод применен!',
      message: `Скидка ${found.discountPercent}% успешно учтена`
    });
    return { success: true, message: `Скидка ${found.discountPercent}% применена` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast({
      type: 'info',
      title: 'Промокод удален'
    });
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      if (isFav) {
        addToast({ type: 'info', title: 'Удалено из избранного' });
        return prev.filter((id) => id !== productId);
      } else {
        addToast({ type: 'success', title: 'Добавлено в избранное' });
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast({
      type: 'success',
      title: 'Товар добавлен',
      message: `${newProduct.title} добавлен в каталог`
    });
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    // Also update in cart if present
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, ...updatedFields } }
          : item
      )
    );
    addToast({
      type: 'success',
      title: 'Товар обновлен',
      message: 'Изменения успешно сохранены'
    });
  };

  const deleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    addToast({
      type: 'warning',
      title: 'Товар удален',
      message: item ? item.title : ''
    });
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setPromoCodes(INITIAL_PROMO_CODES);
    localStorage.removeItem('electronova_products_v3');
    localStorage.removeItem('electronova_orders');
    localStorage.removeItem('electronova_promos');
    addToast({
      type: 'info',
      title: 'Данные сброшены',
      message: 'Каталог и заказы восстановлены к исходным значениям'
    });
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'новый',
      createdAt: new Date().toISOString()
    };
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock counts
    setProducts((prev) =>
      prev.map((product) => {
        const orderedItem = orderData.items.find((item) => item.product.id === product.id);
        if (orderedItem) {
          const newStock = Math.max(0, product.stockCount - orderedItem.quantity);
          return {
            ...product,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return product;
      })
    );
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    addToast({
      type: 'success',
      title: 'Статус заказа обновлен',
      message: `Заказ ${orderId} переведен в статус "${status}"`
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    addToast({
      type: 'warning',
      title: 'Заказ удален',
      message: `Заказ #${orderId} был удален`
    });
  };

  // Promo code admin
  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [...prev, promo]);
    addToast({
      type: 'success',
      title: 'Промокод создан',
      message: `${promo.code} (-${promo.discountPercent}%)`
    });
  };

  const deletePromoCode = (code: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
    if (appliedPromo?.code === code) {
      setAppliedPromo(null);
    }
    addToast({
      type: 'info',
      title: 'Промокод удален'
    });
  };

  // Auth: specified login: monis05, password: admin123
  const login = (username: string, pass: string) => {
    const cleanUser = username.trim();
    const cleanPass = pass.trim();

    if (cleanUser === 'monis05' && cleanPass === 'admin123') {
      const adminUser: User = {
        username: 'monis05',
        role: 'admin',
        name: 'Администратор monis05',
        email: 'admin@electronova.ru'
      };
      setCurrentUser(adminUser);
      addToast({
        type: 'success',
        title: 'Успешный вход в систему',
        message: 'Добро пожаловать в панель администратора, monis05!'
      });
      return { success: true, message: 'Вход администратора выполнен' };
    }

    // Allow user login as client
    if (cleanUser.length >= 3 && cleanPass.length >= 4) {
      const clientUser: User = {
        username: cleanUser,
        role: 'user',
        name: cleanUser,
        email: `${cleanUser}@example.com`
      };
      setCurrentUser(clientUser);
      addToast({
        type: 'success',
        title: 'Вы вошли как покупатель',
        message: `Здравствуйте, ${cleanUser}!`
      });
      return { success: true, message: 'Вход выполнен' };
    }

    return {
      success: false,
      message: 'Неверные данные! Для панели администратора используйте: monis05 / admin123'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    if (currentView === 'admin') {
      setCurrentView('catalog');
    }
    addToast({
      type: 'info',
      title: 'Вы вышли из системы'
    });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        promoCodes,
        appliedPromo,
        currentUser,
        favorites,
        toasts,
        currentView,
        selectedProduct,
        isCartOpen,
        isAuthModalOpen,
        isCheckoutOpen,
        setCurrentView,
        setSelectedProduct,
        setIsCartOpen,
        setIsAuthModalOpen,
        setIsCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        toggleFavorite,
        isFavorite,
        addProduct,
        updateProduct,
        deleteProduct,
        resetAllData,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addPromoCode,
        deletePromoCode,
        login,
        logout,
        addToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
