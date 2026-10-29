import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { user, foodItems, setActiveTab } = useApp();

  const favoriteProducts = foodItems.filter(item => user.favorites.includes(item.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Saved Favorites</h1>
        <p className="text-xs text-stone-500 mt-1">
          Quickly re-order your favorite campus snacks, cutting chai, and thali combos.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No saved favorites yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Tap the heart icon on any food item in the menu to add it to your quick favorites tray.
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
