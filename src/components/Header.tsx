import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Bell,
  User,
  Shield,
  ChefHat,
  ChevronDown,
  Clock,
  Heart,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    user,
    setUserRole,
    activeTab,
    setActiveTab,
    cart,
    notifications,
    unreadNotifCount,
    markAllNotificationsRead,
    markNotificationRead,
    setTrackingOrderId,
    canteenSettings,
    kitchenWorkload,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setRoleMenuOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'staff':
        return { label: 'Canteen Staff', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
      default:
        return { label: 'Student', color: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  const currentRoleInfo = getRoleBadge(user.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Canteen Announcement / Kitchen Status Banner if high workload or paused */}
      {canteenSettings.announcement && (
        <div className="bg-emerald-900 text-emerald-50 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <span>📢 {canteenSettings.announcement}</span>
        </div>
      )}

      {kitchenWorkload.isOrdersPaused && (
        <div className="bg-amber-600 text-white px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <span>⚠️ Kitchen is currently running at maximum capacity. New orders are temporarily queued.</span>
        </div>
      )}

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with food icon */}
          <button
            onClick={() => setActiveTab(user.role === 'staff' ? 'staff_dashboard' : user.role === 'admin' ? 'admin_dashboard' : 'home')}
            className="flex items-center gap-2.5 text-emerald-950 font-bold text-xl tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-900">MJPRU <span className="text-amber-600">CAFETERIA</span></span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-stone-500 leading-none">Smart Campus Dining</span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line, 1-2 words, unboxed text) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            {user.role === 'student' ? (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'home' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'menu' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Explore Menu
                </button>
                <button
                  onClick={() => setActiveTab('my_orders')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'my_orders' || activeTab === 'tracking' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'wishlist' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'help' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  How It Works
                </button>
              </>
            ) : user.role === 'staff' ? (
              <>
                <button
                  onClick={() => setActiveTab('staff_dashboard')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'staff_dashboard' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Live Order Queue
                </button>
                <button
                  onClick={() => setActiveTab('staff_kds')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'staff_kds' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Kitchen Display (KDS)
                </button>
                <button
                  onClick={() => setActiveTab('staff_pickup')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'staff_pickup' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Token Verification
                </button>
                <button
                  onClick={() => setActiveTab('staff_availability')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'staff_availability' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Item 86 / Availability
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('admin_dashboard')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_dashboard' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Analytics & Overview
                </button>
                <button
                  onClick={() => setActiveTab('admin_menu')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_menu' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Menu Management
                </button>
                <button
                  onClick={() => setActiveTab('admin_orders')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_orders' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Orders & Refunds
                </button>
                <button
                  onClick={() => setActiveTab('admin_settings')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_settings' ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  Canteen Slots & Hours
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Interactive Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setNotifMenuOpen(false);
                  setProfileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${currentRoleInfo.color}`}
                title="Switch Demo Role"
              >
                {user.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : user.role === 'staff' ? (
                  <ChefHat className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span className="whitespace-nowrap">{currentRoleInfo.label}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Switch App Role
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-stone-50 transition-colors ${
                      user.role === 'student' ? 'font-semibold text-emerald-800 bg-emerald-50/50' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium">Student View</div>
                        <div className="text-[10px] text-stone-400">Order food, pay, track token</div>
                      </div>
                    </div>
                    {user.role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('staff')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-stone-50 transition-colors ${
                      user.role === 'staff' ? 'font-semibold text-emerald-800 bg-emerald-50/50' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium">Canteen Staff</div>
                        <div className="text-[10px] text-stone-400">Manage queue, KDS, verify tokens</div>
                      </div>
                    </div>
                    {user.role === 'staff' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-stone-50 transition-colors ${
                      user.role === 'admin' ? 'font-semibold text-amber-800 bg-amber-50/50' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-medium">Canteen Admin</div>
                        <div className="text-[10px] text-stone-400">Prices, slots, analytics & menu</div>
                      </div>
                    </div>
                    {user.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifMenuOpen(!notifMenuOpen);
                  setRoleMenuOpen(false);
                  setProfileMenuOpen(false);
                }}
                className="relative p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-stone-100">
                    <span className="text-xs font-semibold text-stone-900">Notifications</span>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-500">No new notifications</div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.orderId) {
                              setTrackingOrderId(notif.orderId);
                              setActiveTab('tracking');
                              setNotifMenuOpen(false);
                            }
                          }}
                          className={`p-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="font-semibold text-stone-900 flex items-center justify-between">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-stone-400 font-normal">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-stone-600 mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                          {notif.token && (
                            <span className="inline-block mt-1 font-mono text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                              {notif.token}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Student Cart CTA */}
            {user.role === 'student' && (
              <button
                onClick={() => setActiveTab('cart')}
                className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">My Cart</span>
                <span className="bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono text-[11px] tabular-nums">
                  {cartItemCount}
                </span>
              </button>
            )}

            {/* Quick Profile / Settings Link */}
            <button
              onClick={() => setActiveTab('profile')}
              className="p-1.5 rounded-full border border-stone-200 hover:border-emerald-500 transition-colors"
              title="Student Profile"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
