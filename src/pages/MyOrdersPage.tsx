import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import {
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { userOrders, setTrackingOrderId, setActiveTab, addToCart } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const activeOrders = userOrders.filter(
    o => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready'
  );
  const completedOrders = userOrders.filter(
    o => o.status === 'collected' || o.status === 'cancelled'
  );

  const displayedOrders =
    filterStatus === 'active'
      ? activeOrders
      : filterStatus === 'completed'
      ? completedOrders
      : userOrders;

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity, item.selectedSize, item.selectedSpice, item.selectedAddons);
    });
    setActiveTab('cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">My Orders & Receipts</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track token statuses, show collection codes, or re-order your favorite campus meals.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({userOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'active' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'completed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Completed ({completedOrders.length})
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No orders found in this view</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse today's canteen specials and place your advance order in seconds.
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map(order => {
            const isActive = order.status === 'placed' || order.status === 'accepted' || order.status === 'preparing' || order.status === 'ready';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-emerald-600 hover:shadow-xs transition-all space-y-4"
              >
                {/* Header row: Token, Status, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      {order.token}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-stone-900">
                        {order.pickupSlot}
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-900'
                          : order.status === 'preparing'
                          ? 'bg-amber-100 text-amber-900'
                          : order.status === 'collected'
                          ? 'bg-stone-100 text-stone-700'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-800">
                      {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(' · ')}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Paid via {order.paymentMethod.toUpperCase()} · {order.counterNumber}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-stone-900 tabular-nums">
                      ₹{order.finalTotal}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-normal">Incl. 5% GST</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setTrackingOrderId(order.id);
                      setActiveTab('tracking');
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>{isActive ? 'Track Live Preparation' : 'View Full Token & Receipt'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3 py-1.5 border border-stone-200 hover:border-emerald-600 rounded-lg text-xs font-medium text-stone-700 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                    <span>Re-Order This Tray</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
