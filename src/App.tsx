/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryVisualCards } from './components/CategoryVisualCards';
import { BrandMarquee } from './components/BrandMarquee';
import { ProductCatalog } from './components/ProductCatalog';
import { SpecialPromoBanner } from './components/SpecialPromoBanner';
import { ReviewsSection } from './components/ReviewsSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { OrdersView } from './components/OrdersView';
import { FavoritesView } from './components/FavoritesView';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const StoreContent: React.FC = () => {
  const { currentView, toasts, removeToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBrand = (brandName: string) => {
    setSelectedBrand(selectedBrand === brandName ? undefined : brandName);
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation */}
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'catalog' && (
          <>
            <HeroBanner onSelectCategory={handleSelectCategory} />
            <CategoryVisualCards
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
            <BrandMarquee
              selectedBrand={selectedBrand}
              onSelectBrand={handleSelectBrand}
            />
            <div id="catalog-section">
              <ProductCatalog
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                externalSelectedBrand={selectedBrand}
              />
            </div>
            <SpecialPromoBanner />
            <ReviewsSection />
          </>
        )}

        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'favorites' && <FavoritesView />}
      </main>

      {/* Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
