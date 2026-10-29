import React from 'react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';
import { Clock, Plus, Check, Heart } from 'lucide-react';

interface ProductCardProps {
  item: FoodItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { addToCart, setViewProductModal, isFavorite, toggleFavorite, cart } = useApp();

  const isFav = isFavorite(item.id);
  const cartItem = cart.find(c => c.productId === item.id);
  const hasCustomizations =
    (item.customizations?.sizes && item.customizations.sizes.length > 0) ||
    (item.customizations?.addons && item.customizations.addons.length > 0) ||
    (item.customizations?.spiceLevels && item.customizations.spiceLevels.length > 0);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCustomizations) {
      setViewProductModal(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <div
      onClick={() => setViewProductModal(item)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Food Image with Veg Marker and Favorite Toggle */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Elegant CSS/SVG Fallback Container if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Veg / Non-Veg Icon */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-sm">
          <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center rounded-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          </div>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-stone-600 hover:text-rose-500 shadow-sm transition-colors"
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Sold out overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-stone-900/90 text-stone-100 text-xs font-semibold px-3 py-1 rounded">
              Sold Out for Today
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span className="tabular-nums">{item.prepTimeMin}m prep</span>
            </span>
            {item.isBestseller && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-semibold">Campus Hit</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-stone-900 mt-1.5 line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-emerald-950 font-mono tabular-nums">
              ₹{item.discountPrice ?? item.price}
            </span>
            {item.discountPrice && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ₹{item.price}
              </span>
            )}
          </div>

          {item.isAvailable ? (
            <button
              onClick={handleAction}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                cartItem
                  ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  : 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-sm'
              }`}
            >
              {cartItem ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added ({cartItem.quantity})</span>
                </>
              ) : hasCustomizations ? (
                <>
                  <span>Customize</span>
                  <Plus className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-stone-400 font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};
