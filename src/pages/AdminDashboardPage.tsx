import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodItem, FoodCategory } from '../types';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Clock,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Settings,
  Bell,
  Search,
  Filter,
  Save,
  AlertCircle,
  Database,
  Copy,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { testSupabaseConnection, SUPABASE_SQL_SCHEMA, SupabaseSyncStatus } from '../services/supabaseService';
import { supabaseUrl } from '../lib/supabase';

export const AdminDashboardPage: React.FC = () => {
  const {
    orders,
    foodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleFoodItemAvailability,
    canteenSettings,
    updateCanteenSettings,
    kitchenWorkload,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'analytics' | 'menu' | 'orders' | 'settings' | 'database'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStatus, setDbStatus] = useState<SupabaseSyncStatus | null>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<FoodCategory>('Snacks & Chaat');
  const [newItemPrice, setNewItemPrice] = useState(50);
  const [newItemPrepTime, setNewItemPrepTime] = useState(10);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);

  // Settings form state
  const [openingTime, setOpeningTime] = useState(canteenSettings.openingTime);
  const [closingTime, setClosingTime] = useState(canteenSettings.closingTime);
  const [maxOrdersPerSlot, setMaxOrdersPerSlot] = useState(canteenSettings.maxOrdersPerSlot);
  const [announcement, setAnnouncement] = useState(canteenSettings.announcement);
  const [cashOnPickup, setCashOnPickup] = useState(canteenSettings.cashOnPickupEnabled);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Analytics Computations
  const totalGrossSales = orders
    .filter(o => o.status !== 'cancelled' && o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.finalTotal, 0);

  const completedOrdersCount = orders.filter(o => o.status === 'collected').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'cancelled').length;
  const avgPrepTime = Math.round(
    orders.reduce((sum, o) => sum + (o.prepTimeEstMin || 10), 0) / Math.max(1, orders.length)
  );

  const handleCreateFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addFoodItem({
      name: newItemName,
      category: newItemCategory,
      description: newItemDesc || 'Freshly prepared campus canteen specialty.',
      price: Number(newItemPrice),
      isVeg: newItemIsVeg,
      prepTimeMin: Number(newItemPrepTime),
      isAvailable: true,
      stockCount: 50,
      image: '/src/assets/images/dish_crispy_samosas_1793266143436.jpg',
    });

    setNewItemName('');
    setNewItemDesc('');
    setShowAddModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCanteenSettings({
      openingTime,
      closingTime,
      maxOrdersPerSlot: Number(maxOrdersPerSlot),
      announcement,
      cashOnPickupEnabled: cashOnPickup,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-extrabold tracking-tight">Canteen Administration & Executive Console</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {canteenSettings.institutionName} · {canteenSettings.canteenName}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTabSub('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTabSub === 'analytics' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Analytics & Sales
          </button>
          <button
            onClick={() => setActiveTabSub('menu')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTabSub === 'menu' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Menu & Prices
          </button>
          <button
            onClick={() => setActiveTabSub('orders')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTabSub === 'orders' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Order Audit
          </button>
          <button
            onClick={() => setActiveTabSub('settings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTabSub === 'settings' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Slots & Policies
          </button>
          <button
            onClick={() => {
              setActiveTabSub('database');
              setTestingDb(true);
              testSupabaseConnection().then(res => {
                setDbStatus(res);
                setTestingDb(false);
              });
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTabSub === 'database' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Database</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ANALYTICS & SALES */}
      {activeTabSub === 'analytics' && (
        <div className="space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold uppercase text-stone-500">Gross Sales Today</span>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-950 mt-1">
                ₹{totalGrossSales.toLocaleString()}
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">Total verified receipts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold uppercase text-stone-500">Orders Processed</span>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-stone-900 mt-1">
                {orders.length}
              </div>
              <span className="text-[11px] text-emerald-700 mt-0.5 block">
                {completedOrdersCount} collected · {cancelledOrdersCount} cancelled
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold uppercase text-stone-500">Avg Preparation Time</span>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-stone-900 mt-1">
                ~{avgPrepTime} mins
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">Counter queue speed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold uppercase text-stone-500">Peak Rush Period</span>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-amber-700 mt-1">
                12:15 - 01:15 PM
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">Lunch break demand spike</span>
            </div>
          </div>

          {/* Payment Method Breakdown & Top Sellers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Payment Channel Breakdown</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-stone-700 mb-1">
                    <span>UPI (GPay / PhonePe / Paytm)</span>
                    <span className="font-mono">75%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full w-3/4 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-stone-700 mb-1">
                    <span>Credit & Debit Cards</span>
                    <span className="font-mono">15%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full w-[15%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-stone-700 mb-1">
                    <span>Cash on Pickup</span>
                    <span className="font-mono">10%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full w-[10%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Highest Volume Campus Dishes</h3>
              <div className="divide-y divide-stone-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-bold text-stone-900">Crispy Masala Dosa</span>
                  <span className="font-mono font-bold text-emerald-800">142 orders</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-bold text-stone-900">Amritsari Chole Bhature</span>
                  <span className="font-mono font-bold text-emerald-800">118 orders</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-bold text-stone-900">Kadak Masala Cutting Chai</span>
                  <span className="font-mono font-bold text-emerald-800">210 cups</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-bold text-stone-900">College Masala Maggi</span>
                  <span className="font-mono font-bold text-emerald-800">95 bowls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MENU & PRICES MANAGEMENT */}
      {activeTabSub === 'menu' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Campus Canteen Menu Products</h2>
              <p className="text-xs text-stone-500">
                Update prices, set discounts, modify estimated prep times, or add new items.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-200 pb-2">
                  <th className="py-2.5">Item Name</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Price (₹)</th>
                  <th className="py-2.5">Prep Time</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {foodItems.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 font-bold text-stone-900">{item.name}</td>
                    <td className="py-3 text-stone-600">{item.category}</td>
                    <td className="py-3 font-mono font-bold tabular-nums text-stone-900">
                      ₹{item.price}
                    </td>
                    <td className="py-3 font-mono tabular-nums text-stone-600">{item.prepTimeMin}m</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => toggleFoodItemAvailability(item.id)}
                        className="text-stone-600 hover:text-stone-900 font-medium"
                      >
                        Toggle Stock
                      </button>
                      <button
                        onClick={() => deleteFoodItem(item.id)}
                        className="text-rose-600 hover:text-rose-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: ORDER AUDIT */}
      {activeTabSub === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Historical Order Audit Logs</h2>
              <p className="text-xs text-stone-500">Every placed order with token ID, student identity, and payment record.</p>
            </div>
            <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
              {orders.length} Total Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-200">
                  <th className="py-2.5">Token</th>
                  <th className="py-2.5">Student</th>
                  <th className="py-2.5">Pickup Slot</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Payment</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/70">
                    <td className="py-3 font-mono font-extrabold text-stone-900">{order.token}</td>
                    <td className="py-3">
                      <span className="font-semibold block">{order.studentName}</span>
                      <span className="text-[10px] text-stone-400">{order.studentEmail}</span>
                    </td>
                    <td className="py-3 text-stone-600">{order.pickupSlot}</td>
                    <td className="py-3 font-mono font-bold tabular-nums text-stone-900">₹{order.finalTotal}</td>
                    <td className="py-3">
                      <span className="font-mono text-[11px] uppercase block">{order.paymentMethod}</span>
                      <span className={`text-[10px] font-bold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: SLOTS & CANTEEN SETTINGS */}
      {activeTabSub === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Canteen Operational Controls</h2>
            <p className="text-xs text-stone-500">
              Configure opening hours, slot capacity limits to prevent queue overcrowding, and emergency notices.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 font-bold mb-1">Opening Time</label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={e => setOpeningTime(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-bold mb-1">Closing Time</label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={e => setClosingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">
                Max Orders Allowed Per 15-Minute Slot (Overbooking Cap)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={maxOrdersPerSlot}
                onChange={e => setMaxOrdersPerSlot(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                Slots will automatically display as FULL once this quota is reached.
              </span>
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">Campus Announcement Banner</label>
              <input
                type="text"
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Notice displayed at top of app for all students..."
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={cashOnPickup}
                  onChange={e => setCashOnPickup(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700"
                />
                <span>Allow Cash on Pickup (COP) at Counter 1</span>
              </label>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              {settingsSaved ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settings updated successfully!</span>
                </span>
              ) : (
                <span className="text-stone-400">Settings take effect immediately for all students</span>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 5: SUPABASE DATABASE MANAGEMENT */}
      {activeTabSub === 'database' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-bold text-stone-900">Supabase Cloud Database Integration</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Connected to project <strong>rfqwtgfjjhdcljfynoek</strong>. Student orders and ratings automatically stream here.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTestingDb(true);
                  testSupabaseConnection().then(res => {
                    setDbStatus(res);
                    setTestingDb(false);
                  });
                }}
                disabled={testingDb}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin' : ''}`} />
                <span>{testingDb ? 'Checking...' : 'Test Connection'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/rfqwtgfjjhdcljfynoek"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Supabase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Connection Status Box */}
          {dbStatus && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                dbStatus.connected && dbStatus.isTableReady
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : dbStatus.connected
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="mt-0.5">
                {dbStatus.connected && dbStatus.isTableReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold">
                  {dbStatus.connected && dbStatus.isTableReady
                    ? 'Database Online & Synchronized'
                    : dbStatus.connected
                    ? 'Connected to Project (Table Setup Required)'
                    : 'Connection Notice'}
                </div>
                <p className="mt-0.5">{dbStatus.message}</p>
              </div>
            </div>
          )}

          {/* Configuration Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">Project ID</span>
              <div className="font-mono text-sm font-bold text-stone-900">rfqwtgfjjhdcljfynoek</div>
              <span className="text-[11px] text-stone-400 block">Supabase Region & Cloud Cluster</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">API Endpoint URL</span>
              <div className="font-mono text-xs font-bold text-stone-800 truncate">{supabaseUrl}</div>
              <span className="text-[11px] text-emerald-700 font-semibold block">Using client-side publishable key</span>
            </div>
          </div>

          {/* SQL Migration Script Box */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Supabase SQL Table Schema
                </h3>
                <p className="text-[11px] text-stone-500">
                  Run this in your <strong>Supabase SQL Editor</strong> to create the <code>orders</code> and <code>order_feedback</code> tables.
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                  setCopiedSchema(true);
                  setTimeout(() => setCopiedSchema(false), 2000);
                }}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedSchema ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <div className="bg-stone-950 text-stone-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-64 border border-stone-800">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-xl">
            <h3 className="text-base font-bold text-stone-900">Add New Dish to Campus Menu</h3>

            <form onSubmit={handleCreateFoodItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-bold mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder="e.g. Paneer Bhurji Pav"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                  >
                    <option>Breakfast</option>
                    <option>South Indian</option>
                    <option>Snacks & Chaat</option>
                    <option>Meals & Thalis</option>
                    <option>Quick Meals</option>
                    <option>Sandwiches & Burgers</option>
                    <option>Beverages & Chai</option>
                    <option>Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Est. Preparation Time (Mins)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={newItemPrepTime}
                  onChange={e => setNewItemPrepTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  placeholder="Short description of ingredients and taste..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-700"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
