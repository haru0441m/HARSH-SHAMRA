import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, ShoppingBag, Clock, Heart, User, ChefHat, Shield } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user, cart } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (user.role === 'staff') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('staff_dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] ${
            activeTab === 'staff_dashboard' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Queue</span>
        </button>
        <button
          onClick={() => setActiveTab('staff_kds')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] ${
            activeTab === 'staff_kds' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">KDS</span>
        </button>
        <button
          onClick={() => setActiveTab('staff_pickup')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] ${
            activeTab === 'staff_pickup' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Verify</span>
        </button>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('admin_dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] ${
            activeTab === 'admin_dashboard' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Metrics</span>
        </button>
        <button
          onClick={() => setActiveTab('admin_menu')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] ${
            activeTab === 'admin_menu' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
        <button
          onClick={() => setActiveTab('admin_orders')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] ${
            activeTab === 'admin_orders' ? 'text-emerald-700 font-semibold' : 'text-stone-500'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Orders</span>
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] ${
          activeTab === 'home' ? 'text-emerald-800 font-semibold' : 'text-stone-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('menu')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] ${
          activeTab === 'menu' ? 'text-emerald-800 font-semibold' : 'text-stone-500'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Menu</span>
      </button>

      <button
        onClick={() => setActiveTab('cart')}
        className={`relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] ${
          activeTab === 'cart' ? 'text-emerald-800 font-semibold' : 'text-stone-500'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-emerald-700 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Cart</span>
      </button>

      <button
        onClick={() => setActiveTab('my_orders')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] ${
          activeTab === 'my_orders' || activeTab === 'tracking' ? 'text-emerald-800 font-semibold' : 'text-stone-500'
        }`}
      >
        <Clock className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Orders</span>
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] ${
          activeTab === 'profile' ? 'text-emerald-800 font-semibold' : 'text-stone-500'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </div>
  );
};
