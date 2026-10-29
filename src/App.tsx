import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { StaffKDSPage } from './pages/StaffKDSPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HelpPoliciesPage } from './pages/HelpPoliciesPage';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'tracking':
        return <OrderTrackingPage />;
      case 'my_orders':
        return <MyOrdersPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'profile':
        return <StudentProfilePage />;
      case 'help':
      case 'policies':
        return <HelpPoliciesPage />;
      case 'staff_dashboard':
      case 'staff_queue':
      case 'staff_pickup':
      case 'staff_availability':
        return <StaffDashboardPage />;
      case 'staff_kds':
        return <StaffKDSPage />;
      case 'admin_dashboard':
      case 'admin_menu':
      case 'admin_orders':
      case 'admin_settings':
      case 'admin_analytics':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 pb-20 md:pb-0">
      {/* KDS has its own fullscreen layout, otherwise show standard header */}
      {activeTab !== 'staff_kds' && <Header />}

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Product Detail & Customization Modal */}
      <ProductDetailModal />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
