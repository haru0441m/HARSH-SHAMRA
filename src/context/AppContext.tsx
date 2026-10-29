import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PickupSlot,
  KitchenWorkload,
  CanteenSettings,
  Coupon,
  InAppNotification,
  ProductAddon,
} from '../types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_ORDERS,
  INITIAL_PICKUP_SLOTS,
  INITIAL_CANTEEN_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { syncOrderToSupabase, syncOrderStatusToSupabase } from '../services/supabaseService';

export type NavigationTab =
  | 'home'
  | 'menu'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'my_orders'
  | 'wishlist'
  | 'profile'
  | 'help'
  | 'policies'
  | 'staff_dashboard'
  | 'staff_queue'
  | 'staff_kds'
  | 'staff_pickup'
  | 'staff_availability'
  | 'admin_dashboard'
  | 'admin_menu'
  | 'admin_orders'
  | 'admin_settings'
  | 'admin_analytics';

interface AppContextType {
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  toggleFoodItemAvailability: (id: string) => void;
  deleteFoodItem: (id: string) => void;
  cart: CartItem[];
  addToCart: (
    product: FoodItem,
    quantity?: number,
    size?: string,
    spice?: string,
    addons?: ProductAddon[],
    specialInstructions?: string
  ) => void;
  updateCartItemQty: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  gstAmount: number;
  discountAmount: number;
  cartFinalTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  availableCoupons: Coupon[];
  pickupSlots: PickupSlot[];
  selectedSlot: PickupSlot | null;
  setSelectedSlot: (slot: PickupSlot | null) => void;
  orders: Order[];
  activeOrders: Order[];
  userOrders: Order[];
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  placeOrder: (details: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    pickupSlot: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    razorpayPaymentId?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, rejectionReason?: string) => void;
  verifyAndCollectOrder: (tokenOrHash: string) => { success: boolean; message: string; order?: Order };
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  rateOrder: (orderId: string, rating: number, feedback: string) => void;
  canteenSettings: CanteenSettings;
  updateCanteenSettings: (settings: Partial<CanteenSettings>) => void;
  toggleKitchenPause: (reason?: string) => void;
  kitchenWorkload: KitchenWorkload;
  notifications: InAppNotification[];
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  viewProductModal: FoodItem | null;
  setViewProductModal: (item: FoodItem | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cb_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>('ord-1048');
  const [viewProductModal, setViewProductModal] = useState<FoodItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('cb_food_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('cb_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>(() => {
    const saved = localStorage.getItem('cb_slots');
    return saved ? JSON.parse(saved) : INITIAL_PICKUP_SLOTS;
  });

  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(() => {
    return INITIAL_PICKUP_SLOTS.find(s => s.isAvailable) || null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cb_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [canteenSettings, setCanteenSettings] = useState<CanteenSettings>(() => {
    const saved = localStorage.getItem('cb_canteen_settings');
    return saved ? JSON.parse(saved) : INITIAL_CANTEEN_SETTINGS;
  });

  const [isOrdersPaused, setIsOrdersPaused] = useState<boolean>(false);
  const [pauseReason, setPauseReason] = useState<string>('');

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('cb_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cb_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cb_food_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('cb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cb_coupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('cb_slots', JSON.stringify(pickupSlots));
  }, [pickupSlots]);

  useEffect(() => {
    localStorage.setItem('cb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cb_canteen_settings', JSON.stringify(canteenSettings));
  }, [canteenSettings]);

  useEffect(() => {
    localStorage.setItem('cb_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Set active tab with scroll to top
  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User role switcher
  const setUserRole = (role: UserRole) => {
    setUser(prev => ({
      ...prev,
      role,
      name:
        role === 'admin'
          ? 'Prof. S. R. Sharma (Canteen In-charge)'
          : role === 'staff'
          ? 'Ramesh Bhai (Counter 1 Head Chef)'
          : 'Harsh Vardhan',
    }));
    // route to appropriate screen
    if (role === 'staff') {
      setActiveTab('staff_dashboard');
    } else if (role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('home');
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...profile }));
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setUser(prev => {
      const exists = prev.favorites.includes(productId);
      const newFavs = exists
        ? prev.favorites.filter(id => id !== productId)
        : [...prev.favorites, productId];
      return { ...prev, favorites: newFavs };
    });
  };

  const isFavorite = (productId: string) => {
    return user.favorites.includes(productId);
  };

  // Menu Management
  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...item,
      id: `prod-${Date.now().toString().slice(-5)}`,
    };
    setFoodItems(prev => [newItem, ...prev]);
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const toggleFoodItemAvailability = (id: string) => {
    setFoodItems(prev =>
      prev.map(p => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(p => p.id !== id));
  };

  // Cart operations
  const addToCart = (
    product: FoodItem,
    quantity: number = 1,
    size?: string,
    spice?: string,
    addons: ProductAddon[] = [],
    specialInstructions?: string
  ) => {
    if (!product.isAvailable) return;

    let sizeMultiplier = 1;
    if (size && product.customizations?.sizes) {
      const foundSize = product.customizations.sizes.find(s => s.name === size);
      if (foundSize) sizeMultiplier = foundSize.priceMultiplier;
    }

    const basePrice = product.discountPrice ?? product.price;
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = Math.round(basePrice * sizeMultiplier) + addonsTotal;
    const itemTotal = unitPrice * quantity;

    const cartItemId = `${product.id}-${size || 'default'}-${spice || 'none'}-${addons.map(a => a.id).sort().join('_')}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                itemTotal: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            product,
            quantity,
            selectedSize: size,
            selectedSpice: spice,
            selectedAddons: addons,
            unitPrice,
            itemTotal,
            specialInstructions,
          },
        ];
      }
    });
  };

  const updateCartItemQty = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const gstAmount = Math.round(cartSubtotal * 0.05); // 5% GST for college food canteen

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    const rawDiscount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    discountAmount = Math.min(Math.round(rawDiscount), appliedCoupon.maxDiscount);
  }

  const cartFinalTotal = Math.max(0, cartSubtotal + gstAmount - discountAmount);

  // Coupons
  const applyCoupon = (code: string) => {
    const found = INITIAL_COUPONS.find(
      c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order value for ${found.code} is ₹${found.minOrder}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Kitchen Workload calculation
  const activeOrders = orders.filter(
    o => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing'
  );

  const activeOrdersCount = activeOrders.length;
  const currentWaitMin = Math.max(
    8,
    activeOrders.reduce((sum, o) => sum + (o.prepTimeEstMin || 10), 0) /
      Math.max(1, canteenSettings.maxOrdersPerSlot / 4)
  );

  let workloadLevel: KitchenWorkload['workloadLevel'] = 'low';
  if (isOrdersPaused) {
    workloadLevel = 'overloaded';
  } else if (activeOrdersCount >= 15) {
    workloadLevel = 'high';
  } else if (activeOrdersCount >= 7) {
    workloadLevel = 'moderate';
  }

  const kitchenWorkload: KitchenWorkload = {
    activeOrdersCount,
    currentWaitMin: Math.round(currentWaitMin),
    workloadLevel,
    isOrdersPaused,
    pauseReason,
  };

  // Orders creation and workflows
  const placeOrder = (details: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    pickupSlot: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    razorpayPaymentId?: string;
  }) => {
    // Generate next token CB-XXXX
    const tokenNum = 1050 + orders.length;
    const token = `CB-${tokenNum}`;
    const orderId = `ord-${tokenNum}`;
    const qrHash = `cb_token_${token}_${Date.now()}`;

    // Max prep time across cart items
    const prepTimeEstMin = Math.max(...cart.map(i => i.product.prepTimeMin), 10);

    const newOrder: Order = {
      id: orderId,
      token,
      studentId: user.id,
      studentName: details.studentName || user.name,
      studentEmail: details.studentEmail || user.email,
      studentPhone: details.studentPhone || user.phone,
      items: [...cart],
      subtotal: cartSubtotal,
      gstAmount,
      discount: discountAmount,
      finalTotal: cartFinalTotal,
      couponCode: appliedCoupon?.code,
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentStatus,
      razorpayPaymentId: details.razorpayPaymentId,
      pickupSlot: details.pickupSlot,
      status: 'placed',
      prepTimeEstMin,
      createdAt: new Date().toISOString(),
      qrCodeHash: qrHash,
      counterNumber: 'Counter 1 & 2 (Main Serving Station)',
    };

    setOrders(prev => [newOrder, ...prev]);

    // Increment slot booked count
    setPickupSlots(prev =>
      prev.map(slot =>
        slot.label === details.pickupSlot
          ? {
              ...slot,
              bookedCount: slot.bookedCount + 1,
              isAvailable: slot.bookedCount + 1 < slot.capacity,
            }
          : slot
      )
    );

    // Create notification
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: `Order ${token} Placed!`,
      message: `Your campus meal token is ${token}. Estimated prep time: ${prepTimeEstMin} mins.`,
      type: 'order',
      timestamp: new Date().toISOString(),
      read: false,
      orderId: newOrder.id,
      token,
    };
    setNotifications(prev => [notif, ...prev]);

    // Sync to user's Supabase database
    syncOrderToSupabase(newOrder);

    clearCart();
    setTrackingOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    rejectionReason?: string
  ) => {
    const now = new Date().toISOString();
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const updated: Order = { ...order, status };
          if (rejectionReason) updated.rejectionReason = rejectionReason;
          if (status === 'accepted') updated.acceptedAt = now;
          if (status === 'ready') updated.readyAt = now;
          if (status === 'collected') updated.collectedAt = now;
          return updated;
        }
        return order;
      })
    );

    // Sync status change to Supabase
    syncOrderStatusToSupabase(orderId, status);

    // Trigger notification on ready
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      let notifTitle = `Order ${targetOrder.token} Updated`;
      let notifMsg = `Your order status changed to: ${status}`;

      if (status === 'ready') {
        notifTitle = `🔔 Order ${targetOrder.token} is Ready for Pickup!`;
        notifMsg = `Please proceed to ${targetOrder.counterNumber} with your token ${targetOrder.token}.`;
      } else if (status === 'preparing') {
        notifTitle = `👨‍🍳 Order ${targetOrder.token} is being prepared`;
        notifMsg = `The kitchen is preparing your fresh meal now.`;
      } else if (status === 'accepted') {
        notifTitle = `✅ Order ${targetOrder.token} Accepted`;
        notifMsg = `Canteen staff confirmed your order.`;
      } else if (status === 'collected') {
        notifTitle = `🎉 Order ${targetOrder.token} Collected`;
        notifMsg = `Hope you enjoyed your meal! Rate your experience.`;
      }

      const notif: InAppNotification = {
        id: `notif-${Date.now()}`,
        title: notifTitle,
        message: notifMsg,
        type: 'order',
        timestamp: now,
        read: false,
        orderId,
        token: targetOrder.token,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const verifyAndCollectOrder = (tokenOrHash: string) => {
    const trimmed = tokenOrHash.trim().toUpperCase();
    const found = orders.find(
      o =>
        o.token.toUpperCase() === trimmed ||
        o.qrCodeHash.toUpperCase() === trimmed ||
        o.id.toUpperCase() === trimmed
    );

    if (!found) {
      return {
        success: false,
        message: `No active order found with token or verification code "${tokenOrHash}".`,
      };
    }

    if (found.status === 'collected') {
      return {
        success: false,
        message: `Order ${found.token} was ALREADY collected at ${
          found.collectedAt ? new Date(found.collectedAt).toLocaleTimeString() : 'earlier'
        }! Duplicate pickup prevented.`,
        order: found,
      };
    }

    if (found.status === 'cancelled') {
      return {
        success: false,
        message: `Cannot collect: Order ${found.token} is marked as cancelled.`,
        order: found,
      };
    }

    // Mark as collected
    updateOrderStatus(found.id, 'collected');
    return {
      success: true,
      message: `Verified successfully! Order ${found.token} for ${found.studentName} marked as Collected.`,
      order: found,
    };
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    if (order.status !== 'placed') {
      return {
        success: false,
        message: 'Order cannot be cancelled after the kitchen has accepted or started preparation.',
      };
    }

    updateOrderStatus(orderId, 'cancelled');
    return { success: true, message: `Order ${order.token} has been cancelled.` };
  };

  const rateOrder = (orderId: string, rating: number, feedback: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, rating, feedback } : o))
    );
    // Sync rating to Supabase
    syncOrderStatusToSupabase(orderId, 'collected', { rating, feedback });
  };

  const updateCanteenSettings = (settings: Partial<CanteenSettings>) => {
    setCanteenSettings(prev => ({ ...prev, ...settings }));
  };

  const toggleKitchenPause = (reason?: string) => {
    setIsOrdersPaused(prev => !prev);
    if (reason) setPauseReason(reason);
  };

  // Notifications
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const userOrders = orders.filter(o => o.studentId === user.id || o.studentEmail === user.email);

  return (
    <AppContext.Provider
      value={{
        user,
        setUserRole,
        updateUserProfile,
        activeTab,
        setActiveTab,
        foodItems,
        addFoodItem,
        updateFoodItem,
        toggleFoodItemAvailability,
        deleteFoodItem,
        cart,
        addToCart,
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
        availableCoupons: INITIAL_COUPONS,
        pickupSlots,
        selectedSlot,
        setSelectedSlot,
        orders,
        activeOrders,
        userOrders,
        trackingOrderId,
        setTrackingOrderId,
        placeOrder,
        updateOrderStatus,
        verifyAndCollectOrder,
        cancelOrder,
        rateOrder,
        canteenSettings,
        updateCanteenSettings,
        toggleKitchenPause,
        kitchenWorkload,
        notifications,
        unreadNotifCount,
        markNotificationRead,
        markAllNotificationsRead,
        toggleFavorite,
        isFavorite,
        viewProductModal,
        setViewProductModal,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
