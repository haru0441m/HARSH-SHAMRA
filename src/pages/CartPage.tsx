import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  Tag,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    cartSubtotal,
    gstAmount,
    discountAmount,
    cartFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons,
    pickupSlots,
    selectedSlot,
    setSelectedSlot,
    setActiveTab,
    kitchenWorkload,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  const maxItemPrepTime = cart.length > 0
    ? Math.max(...cart.map(i => i.product.prepTimeMin))
    : 10;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, success: res.success });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Your campus food tray is empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore delicious student favorites, crisp dosas, hot chai, and lunch combos ready for scheduled counter pickup.
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Browse Canteen Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Your Tray & Pickup Slot</h1>
          <p className="text-xs text-stone-500 mt-1">
            Review your order, pick a convenient pickup window, and verify savings before checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Tray</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items & Pickup Slot Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
            {cart.map(item => (
              <div key={item.cartItemId} className="p-4 sm:p-5 flex gap-4 items-start">
                {/* Food Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 truncate">{item.product.name}</h3>
                      <div className="text-[11px] text-stone-500 mt-0.5 space-x-1">
                        {item.selectedSize && <span>Portion: {item.selectedSize}</span>}
                        {item.selectedSpice && (
                          <>
                            <span>·</span>
                            <span>Spice: {item.selectedSpice}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCartItem(item.cartItemId)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Addons List */}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="mt-1 text-[11px] text-emerald-800">
                      Add-ons: {item.selectedAddons.map(a => `${a.name} (+₹${a.price})`).join(', ')}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <div className="mt-1 text-[11px] text-stone-500 italic">
                      Note: "{item.specialInstructions}"
                    </div>
                  )}

                  {/* Quantity Stepper & Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => updateCartItemQty(item.cartItemId, -1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200/60 rounded-l transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-mono font-bold text-xs tabular-nums text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQty(item.cartItemId, 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200/60 rounded-r transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right font-mono tabular-nums font-bold text-sm text-stone-900">
                      ₹{item.itemTotal}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advance Pickup Slot Selector */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-stone-900">Schedule Pickup Window</h3>
              </div>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. Kitchen Prep: {maxItemPrepTime}m</span>
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              To prevent counter congestion, select an available 15-minute slot. Your food will be freshly prepared right before your arrival.
            </p>

            {kitchenWorkload.isOrdersPaused && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Kitchen workload is high right now. Later pickup slots recommended.</span>
              </div>
            )}

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pickupSlots.map(slot => {
                const isSelected = selectedSlot?.id === slot.id;
                const isFull = !slot.isAvailable || slot.bookedCount >= slot.capacity;

                return (
                  <div
                    key={slot.id}
                    onClick={() => {
                      if (!isFull) setSelectedSlot(slot);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isFull
                        ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{slot.label}</span>
                      {isFull ? (
                        <span className="text-[10px] text-rose-700 font-bold uppercase">Full</span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {slot.capacity - slot.bookedCount} slots left
                        </span>
                      )}
                    </div>
                    {/* Progress capacity bar */}
                    <div className="mt-2 w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-600'}`}
                        style={{ width: `${Math.min(100, (slot.bookedCount / slot.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Selected Window: <strong>{selectedSlot.label}</strong> at Counter 1 & 2.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Coupon & Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <Tag className="w-4 h-4 text-emerald-700" />
              <span>Have a Student Coupon?</span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter CAMPUS15"
                className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Apply
              </button>
            </form>

            {couponMessage && (
              <p className={`text-xs ${couponMessage.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                {couponMessage.text}
              </p>
            )}

            {/* Quick Available Coupons */}
            <div className="pt-2 border-t border-stone-100">
              <div className="text-[11px] font-semibold text-stone-500 mb-2">Available for your order:</div>
              <div className="space-y-1.5">
                {availableCoupons.map(c => (
                  <div
                    key={c.code}
                    onClick={() => {
                      setCouponInput(c.code);
                      const res = applyCoupon(c.code);
                      setCouponMessage({ text: res.message, success: res.success });
                    }}
                    className="p-2 rounded-lg bg-stone-50 hover:bg-emerald-50/50 border border-dashed border-stone-300 hover:border-emerald-500 cursor-pointer text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-emerald-900">{c.code}</span>
                      <span className="text-[11px] text-stone-500 block">{c.description}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold underline">Tap to apply</span>
                  </div>
                ))}
              </div>
            </div>

            {appliedCoupon && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
                <span className="font-medium">Applied: <strong>{appliedCoupon.code}</strong> (-₹{discountAmount})</span>
                <button onClick={removeCoupon} className="text-xs text-rose-600 hover:underline">
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Payment Summary</h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Tray Subtotal</span>
                <span className="font-mono tabular-nums text-stone-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Canteen GST (5%)</span>
                <span className="font-mono tabular-nums text-stone-900">₹{gstAmount}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Student Coupon Discount</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                <span>Final Payable</span>
                <span className="font-mono tabular-nums text-emerald-950">₹{cartFinalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              disabled={!selectedSlot}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                selectedSlot
                  ? 'bg-emerald-800 hover:bg-emerald-700'
                  : 'bg-stone-300 cursor-not-allowed'
              }`}
            >
              <span>{selectedSlot ? 'Proceed to Checkout' : 'Please Select Pickup Slot'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
