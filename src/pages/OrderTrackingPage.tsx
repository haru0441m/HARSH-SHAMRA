import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Star,
  ChevronLeft,
  XCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { orders, trackingOrderId, cancelOrder, rateOrder, setActiveTab } = useApp();

  const [ratingVal, setRatingVal] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  // Find the tracked order or default to the most recent user order
  const order = orders.find(o => o.id === trackingOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">No active order found</h2>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          Explore Canteen Menu
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Received by canteen server' },
    { key: 'accepted', label: 'Accepted by Kitchen', desc: 'Chef confirmed prep queue' },
    { key: 'preparing', label: 'In Preparation', desc: 'Cooking fresh on the counter' },
    { key: 'ready', label: 'Ready for Pickup', desc: 'At warming counter' },
    { key: 'collected', label: 'Collected', desc: 'Token verified & handed over' },
  ];

  const getStepStatus = (stepKey: OrderStatus) => {
    if (order.status === 'cancelled') return 'cancelled';

    const orderIndex = steps.findIndex(s => s.key === order.status);
    const stepIndex = steps.findIndex(s => s.key === stepKey);

    if (orderIndex === -1) return 'pending';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'pending';
  };

  const handleCancel = () => {
    const res = cancelOrder(order.id);
    setCancelMessage(res.message);
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateOrder(order.id, ratingVal, feedbackText);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('my_orders')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Orders</span>
        </button>
        <span className="text-xs text-stone-500 font-mono">ID: {order.id}</span>
      </div>

      {/* Prominent Ready Banner when status is 'ready' */}
      {order.status === 'ready' && (
        <div className="p-4 bg-emerald-800 text-white rounded-2xl shadow-lg border border-emerald-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-bold text-xl">
              🔔
            </div>
            <div>
              <div className="text-base font-extrabold text-white">Your Order is Ready for Collection!</div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Head over to <strong>{order.counterNumber}</strong>. Show token <strong>{order.token}</strong> or the QR code below.
              </p>
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 block">Assigned Counter</span>
            <span className="text-xs font-bold text-white bg-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-700 block mt-1">
              Counter 1 & 2
            </span>
          </div>
        </div>
      )}

      {/* Main Order Card with Token & QR Code */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Token Banner Header */}
        <div className="p-6 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              Collection Token Number
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
              {order.token}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-300 mt-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Slot: <strong>{order.pickupSlot}</strong></span>
              <span>·</span>
              <span>Est. Prep: {order.prepTimeEstMin}m</span>
            </div>
          </div>

          {/* QR Code Presentation */}
          <div className="bg-white p-3 rounded-2xl shadow-md text-stone-900 flex flex-col items-center justify-center text-center self-start sm:self-auto">
            <div className="w-28 h-28 bg-stone-50 border border-stone-200 rounded-lg p-2 flex flex-col items-center justify-center">
              <QrCode className="w-20 h-20 text-stone-900" />
            </div>
            <span className="text-[10px] font-mono font-bold mt-1 text-stone-600 uppercase">
              Scan at Counter
            </span>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="p-6 border-b border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6">
            Live Order Status Timeline
          </h3>

          <div className="relative">
            {/* Step flow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step, idx) => {
                const status = getStepStatus(step.key);

                return (
                  <div key={step.key} className="flex md:flex-col items-start gap-3 md:gap-2">
                    {/* Step Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                        status === 'completed'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : status === 'current'
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : status === 'cancelled'
                          ? 'bg-stone-300 text-stone-500'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>0{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          status === 'current'
                            ? 'text-amber-800'
                            : status === 'completed'
                            ? 'text-emerald-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[11px] text-stone-500 leading-tight mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancellation Notice if cancelled */}
          {order.status === 'cancelled' && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>This order has been cancelled. Any pre-authorized online payment will be refunded to your source UPI/bank account.</span>
            </div>
          )}

          {/* Cancel Order Action (Active only when status === 'placed') */}
          {order.status === 'placed' && (
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                You can cancel within 2 minutes before the kitchen accepts your ticket.
              </span>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}

          {cancelMessage && (
            <div className="mt-2 text-xs text-stone-600 font-medium">
              {cancelMessage}
            </div>
          )}
        </div>

        {/* Order Details & Summary */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/50">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Items Ordered ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.cartItemId} className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs flex justify-between items-start">
                  <div>
                    <span className="font-bold text-stone-800">{item.quantity}x {item.product.name}</span>
                    {item.selectedSize && <span className="text-[11px] text-stone-500 block">Portion: {item.selectedSize}</span>}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <span className="text-[10px] text-emerald-800 block">
                        Add-ons: {item.selectedAddons.map(a => a.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono tabular-nums font-bold text-stone-900">₹{item.itemTotal}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Receipt & Collection Info
            </h4>
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Payment Method</span>
                <span className="font-semibold text-stone-900 uppercase">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payment Status</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between text-stone-600">
                  <span>Transaction Ref</span>
                  <span className="font-mono text-[11px] text-stone-800">{order.razorpayPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums font-bold text-stone-900">₹{order.finalTotal}</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{order.counterNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating & Feedback Section (For Collected Orders) */}
        {order.status === 'collected' && (
          <div className="p-6 border-t border-stone-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Rate Your Campus Meal
            </h4>

            {feedbackSubmitted || order.rating ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Thank you for your rating ({order.rating || ratingVal} Stars)! Your feedback helps the canteen chefs improve.</span>
              </div>
            ) : (
              <form onSubmit={handleRateSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingVal(star)}
                      className="p-1 text-stone-300 hover:text-amber-400 focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= ratingVal ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-medium text-stone-600 ml-2">
                    {ratingVal === 5 ? 'Delicious & Fresh!' : ratingVal >= 4 ? 'Great experience' : 'Average'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Tell us about the food taste, temperature or wait time..."
                    className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
