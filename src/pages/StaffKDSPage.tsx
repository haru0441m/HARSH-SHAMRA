import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, ArrowRight, CheckCircle2, ChevronLeft, Flame } from 'lucide-react';

export const StaffKDSPage: React.FC = () => {
  const { orders, updateOrderStatus, setActiveTab } = useApp();

  const newOrders = orders.filter(o => o.status === 'placed');
  const inKitchen = orders.filter(o => o.status === 'accepted' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-stone-950 text-white p-4 sm:p-6 space-y-6">
      {/* KDS Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('staff_dashboard')}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-mono text-emerald-400">
              CAMPUSBITE KDS · KITCHEN DISPLAY SYSTEM
            </h1>
            <p className="text-xs text-stone-400">
              Live Station Feed · Station 1 & 2 Dosa / Thali / Snacks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg text-stone-300">
            AUTO-SYNC: <span className="text-emerald-400 font-bold">LIVE</span>
          </div>
          <div className="bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg text-stone-300">
            TOTAL ACTIVE: <span className="text-amber-400 font-bold">{newOrders.length + inKitchen.length}</span>
          </div>
        </div>
      </div>

      {/* 3 High-Contrast Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1: NEW TICKETS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-amber-950/80 border border-amber-800/80 p-3 rounded-xl text-amber-200">
            <span className="font-mono font-bold text-sm tracking-wide">01. NEW TICKETS</span>
            <span className="bg-amber-800/80 px-2 py-0.5 rounded font-mono font-black">{newOrders.length}</span>
          </div>

          <div className="space-y-3">
            {newOrders.map(order => (
              <div
                key={order.id}
                className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="font-mono text-2xl font-black text-amber-400">{order.token}</span>
                  <span className="text-xs text-stone-400 font-mono">{order.pickupSlot}</span>
                </div>

                <div className="space-y-1.5">
                  {order.items.map(i => (
                    <div key={i.cartItemId} className="text-sm font-bold text-stone-100 flex justify-between">
                      <span>{i.quantity}x {i.product.name}</span>
                      {i.selectedSize && <span className="text-xs text-stone-400">{i.selectedSize}</span>}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Start Preparing →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: IN PREPARATION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-800/80 p-3 rounded-xl text-emerald-200">
            <span className="font-mono font-bold text-sm tracking-wide">02. COOKING IN STATION</span>
            <span className="bg-emerald-800/80 px-2 py-0.5 rounded font-mono font-black">{inKitchen.length}</span>
          </div>

          <div className="space-y-3">
            {inKitchen.map(order => (
              <div
                key={order.id}
                className="bg-stone-900 border-2 border-emerald-600 rounded-2xl p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="font-mono text-2xl font-black text-emerald-400">{order.token}</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-300 font-mono">
                    <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>COOKING</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {order.items.map(i => (
                    <div key={i.cartItemId} className="text-sm font-bold text-stone-100 flex justify-between">
                      <span>{i.quantity}x {i.product.name}</span>
                      {i.selectedAddons && i.selectedAddons.length > 0 && (
                        <span className="text-[11px] text-emerald-400">
                          +{i.selectedAddons.map(a => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Mark Order Ready (Plate Up) →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: READY FOR PICKUP */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-stone-900 border border-stone-800 p-3 rounded-xl text-stone-300">
            <span className="font-mono font-bold text-sm tracking-wide">03. READY ON COUNTER</span>
            <span className="bg-stone-800 px-2 py-0.5 rounded font-mono font-black">{readyOrders.length}</span>
          </div>

          <div className="space-y-3">
            {readyOrders.map(order => (
              <div
                key={order.id}
                className="bg-stone-900 border border-stone-700 rounded-2xl p-4 space-y-3 opacity-90"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="font-mono text-xl font-bold text-white">{order.token}</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">READY</span>
                </div>

                <div className="text-xs text-stone-400">
                  Customer: <strong>{order.studentName}</strong> ({order.studentPhone})
                </div>

                <button
                  onClick={() => updateOrderStatus(order.id, 'collected')}
                  className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Verify Handover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
