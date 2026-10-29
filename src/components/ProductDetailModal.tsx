import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FoodItem, ProductAddon } from '../types';
import { X, Clock, Flame, ShieldAlert, Plus, Minus, Check } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { viewProductModal, setViewProductModal, addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedSpice, setSelectedSpice] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (viewProductModal) {
      setQuantity(1);
      setSelectedSize(viewProductModal.customizations?.sizes?.[0]?.name || '');
      setSelectedSpice(viewProductModal.customizations?.spiceLevels?.[0] || '');
      setSelectedAddons([]);
      setSpecialInstructions('');
      setAddedSuccess(false);
    }
  }, [viewProductModal]);

  if (!viewProductModal) return null;

  const item = viewProductModal;

  // Calculate pricing
  let sizeMultiplier = 1;
  if (selectedSize && item.customizations?.sizes) {
    const s = item.customizations.sizes.find(sz => sz.name === selectedSize);
    if (s) sizeMultiplier = s.priceMultiplier;
  }

  const basePrice = item.discountPrice ?? item.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = Math.round(basePrice * sizeMultiplier) + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      item,
      quantity,
      selectedSize || undefined,
      selectedSpice || undefined,
      selectedAddons,
      specialInstructions || undefined
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setViewProductModal(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
        {/* Modal Header Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setViewProductModal(null)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1.5">
            <div className="w-3 h-3 border border-emerald-600 flex items-center justify-center rounded-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
            </div>
            <span className="text-[11px] font-bold text-emerald-950 uppercase">100% Pure Veg</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {item.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span className="tabular-nums">{item.prepTimeMin} mins</span>
                </span>
                {item.calories && (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span className="tabular-nums">{item.calories} kcal</span>
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 mt-1">{item.name}</h2>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{item.description}</p>
            {item.allergens && item.allergens.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-800">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Allergens: {item.allergens.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Size selection */}
          {item.customizations?.sizes && item.customizations.sizes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-900">Choose Portion Size</label>
              <div className="grid grid-cols-2 gap-2">
                {item.customizations.sizes.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSelectedSize(size.name)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                      selectedSize === size.name
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spice level */}
          {item.customizations?.spiceLevels && item.customizations.spiceLevels.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-900">Spice Preference</label>
              <div className="flex gap-2">
                {item.customizations.spiceLevels.map(spice => (
                  <button
                    key={spice}
                    type="button"
                    onClick={() => setSelectedSpice(spice)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      selectedSpice === spice
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {spice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.customizations?.addons && item.customizations.addons.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-900">Recommended Add-ons</label>
              <div className="space-y-1.5">
                {item.customizations.addons.map(addon => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                        />
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-mono font-semibold tabular-nums text-emerald-900">
                        +₹{addon.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special kitchen instructions */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-900 mb-1">
              Kitchen Note (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Crisp edges, less salt, extra tissues"
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-stone-800"
            />
          </div>
        </div>

        {/* Modal Footer: Quantity & Add Button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
          {/* Stepper */}
          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold font-mono tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={addedSuccess}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all ${
              addedSuccess ? 'bg-emerald-600' : 'bg-emerald-800 hover:bg-emerald-700 shadow-md'
            }`}
          >
            {addedSuccess ? (
              <span className="w-full text-center flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Added to Tray
              </span>
            ) : (
              <>
                <span>Add to Cart</span>
                <span className="font-mono tabular-nums">₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
