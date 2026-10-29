import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Search,
  PauseCircle,
  PlayCircle,
  QrCode,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const StaffDashboardPage: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    verifyAndCollectOrder,
    toggleKitchenPause,
    kitchenWorkload,
    foodItems,
    toggleFoodItemAvailability,
    setActiveTab,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'queue' | 'verify' | 'availability'>('queue');
  const [tokenInput, setTokenInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string; order?: Order } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Ingredients Out of Stock');

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const newOrdersCount = orders.filter(o => o.status === 'placed').length;
  const preparingCount = orders.filter(o => o.status === 'accepted' || o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const res = verifyAndCollectOrder(tokenInput);
    setVerifyResult(res);
  };

  const handleConfirmReject = () => {
    if (!rejectModalOrder) return;
    updateOrderStatus(rejectModalOrder.id, 'cancelled', rejectReason);
    setRejectModalOrder(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Staff Bar & Kitchen Overload Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-950 text-white p-6 rounded-3xl shadow-sm border border-emerald-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold tracking-tight">Canteen Counter Staff Console</h1>
          </div>
          <p className="text-xs text-emerald-200">
            Counter 1 & 2 Kitchen Flow · Active workload: <strong>{kitchenWorkload.workloadLevel.toUpperCase()}</strong> ({kitchenWorkload.activeOrdersCount} pending)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Pause Kitchen Switch */}
          <button
            onClick={() => toggleKitchenPause('Peak rush counter buffer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              kitchenWorkload.isOrdersPaused
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700'
            }`}
          >
            {kitchenWorkload.isOrdersPaused ? (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Resume Incoming Orders</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-amber-400" />
                <span>Pause New Orders (Overload)</span>
              </>
            )}
          </button>

          {/* Quick link to Kitchen Display Screen (KDS) */}
          <button
            onClick={() => setActiveTab('staff_kds')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Open KDS Cook Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Staff View Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTabSub('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabSub === 'queue'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Active Orders Queue ({orders.filter(o => o.status !== 'collected' && o.status !== 'cancelled').length})
        </button>

        <button
          onClick={() => setActiveTabSub('verify')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabSub === 'verify'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Verify Pickup Token
        </button>

        <button
          onClick={() => setActiveTabSub('availability')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabSub === 'availability'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Menu Item 86 (Stock Availability)
        </button>
      </div>

      {/* SUB-VIEW 1: QUEUE MANAGEMENT */}
      {activeTabSub === 'queue' && (
        <div className="space-y-6">
          {/* Status Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setStatusFilter(statusFilter === 'placed' ? 'all' : 'placed')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                statusFilter === 'placed' ? 'border-amber-600 bg-amber-50/50' : 'bg-white border-stone-200'
              }`}
            >
              <div className="text-xs text-stone-500 font-semibold uppercase">New Orders</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 mt-1">{newOrdersCount}</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Awaiting Kitchen Acceptance</div>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'preparing' ? 'all' : 'preparing')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                statusFilter === 'preparing' ? 'border-emerald-600 bg-emerald-50/50' : 'bg-white border-stone-200'
              }`}
            >
              <div className="text-xs text-stone-500 font-semibold uppercase">In Cooking</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1">{preparingCount}</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Cooking on Counter Stations</div>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'ready' ? 'all' : 'ready')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                statusFilter === 'ready' ? 'border-emerald-700 bg-emerald-50/70' : 'bg-white border-stone-200'
              }`}
            >
              <div className="text-xs text-stone-500 font-semibold uppercase">Ready at Counter</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-950 mt-1">{readyCount}</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Waiting for Student Handover</div>
            </button>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 text-left">
              <div className="text-xs text-stone-500 font-semibold uppercase">Current Buffer Time</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">~{kitchenWorkload.currentWaitMin}m</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Automated queue estimation</div>
            </div>
          </div>

          {/* Orders Cards List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                No orders match this status filter.
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-4 ${
                    order.status === 'ready'
                      ? 'border-emerald-500 ring-2 ring-emerald-100'
                      : order.status === 'placed'
                      ? 'border-amber-400 ring-2 ring-amber-100'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-extrabold text-stone-950 bg-stone-100 px-3 py-1 rounded-xl">
                        {order.token}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <span>{order.studentName}</span>
                          <span className="text-stone-400 font-normal">({order.studentPhone})</span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>Slot: <strong>{order.pickupSlot}</strong></span>
                          <span>·</span>
                          <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                        Est. {order.prepTimeEstMin} mins
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          order.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-900'
                            : order.status === 'preparing'
                            ? 'bg-amber-100 text-amber-900'
                            : order.status === 'placed'
                            ? 'bg-amber-200 text-amber-950'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Food items & add-ons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Ticket Items
                      </span>
                      {order.items.map(item => (
                        <div key={item.cartItemId} className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                          <div>
                            <span className="font-bold text-stone-900">{item.quantity}x {item.product.name}</span>
                            {item.selectedSize && <span className="text-stone-500 block text-[11px]">{item.selectedSize}</span>}
                            {item.selectedSpice && <span className="text-amber-800 block text-[10px] font-medium">Spice: {item.selectedSpice}</span>}
                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                              <span className="text-emerald-800 block text-[10px]">
                                Addons: {item.selectedAddons.map(a => a.name).join(', ')}
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold tabular-nums text-stone-800">₹{item.itemTotal}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div>
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                          Pickup Details
                        </span>
                        <div className="text-xs text-stone-700">
                          Assigned Counter: <strong>{order.counterNumber}</strong><br />
                          Placed at: {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                        {order.items.some(i => i.specialInstructions) && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] font-medium">
                            Chef Note: {order.items.map(i => i.specialInstructions).filter(Boolean).join('; ')}
                          </div>
                        )}
                      </div>

                      {/* Staff Action Controls */}
                      <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-2">
                        {order.status === 'placed' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => setRejectModalOrder(order)}
                              className="px-3 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold rounded-lg text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Start Cooking
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Mark Ready for Pickup
                          </button>
                        )}

                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'collected')}
                            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Handover & Mark Collected
                          </button>
                        )}

                        {order.status === 'collected' && (
                          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Handed over to student</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: TOKEN & QR VERIFICATION */}
      {activeTabSub === 'verify' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900">Token & Pickup Verification</h2>
            <p className="text-xs text-stone-500">
              Enter or scan student token number (e.g. <strong>CB-1048</strong>) to prevent duplicate pickups.
            </p>
          </div>

          <form onSubmit={handleVerifySubmit} className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value.toUpperCase())}
              placeholder="Enter Token (CB-1048)"
              className="flex-1 px-4 py-3 border border-stone-200 rounded-xl font-mono text-sm uppercase tracking-wider focus:ring-1 focus:ring-emerald-700 font-bold"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Verify & Collect
            </button>
          </form>

          {verifyResult && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                verifyResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {verifyResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                <span>{verifyResult.success ? 'Verification Successful' : 'Verification Alert'}</span>
              </div>
              <p>{verifyResult.message}</p>
              {verifyResult.order && (
                <div className="mt-3 pt-3 border-t border-emerald-200/60 font-medium">
                  Student: <strong>{verifyResult.order.studentName}</strong> ({verifyResult.order.studentEmail})<br />
                  Items: {verifyResult.order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: ITEM 86 / AVAILABILITY */}
      {activeTabSub === 'availability' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Live Item Stock Toggles (86-List)</h2>
            <p className="text-xs text-stone-500">
              When kitchen runs out of batter or ingredients, toggle items off to prevent students from ordering.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {foodItems.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-stone-900">{item.name}</span>
                  <span className="text-[11px] text-stone-500 block">{item.category} · ₹{item.price}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-semibold ${item.isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {item.isAvailable ? 'In Stock / Serving' : 'Sold Out / 86'}
                  </span>
                  <button
                    onClick={() => toggleFoodItemAvailability(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      item.isAvailable
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {item.isAvailable ? 'Mark Sold Out' : 'Restore Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal with Reason */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 border border-stone-200 shadow-xl">
            <h3 className="text-base font-bold text-stone-900">Reject Order {rejectModalOrder.token}</h3>
            <p className="text-xs text-stone-500">
              Select a reason to notify {rejectModalOrder.studentName}. Pre-paid amount will be returned.
            </p>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-700"
            >
              <option>Ingredients Out of Stock</option>
              <option>Kitchen Overload Peak Hour</option>
              <option>Canteen Closing for Day</option>
              <option>Power / Equipment Issue</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOrder(null)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
