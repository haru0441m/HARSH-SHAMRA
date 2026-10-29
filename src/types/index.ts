export type UserRole = 'student' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  collegeName: string;
  department: string;
  rollNumber: string;
  favorites: string[];
}

export type FoodCategory =
  | 'All'
  | 'South Indian'
  | 'Breakfast'
  | 'Snacks & Chaat'
  | 'Meals & Thalis'
  | 'Quick Meals'
  | 'Sandwiches & Burgers'
  | 'Beverages & Chai'
  | 'Desserts';

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface ProductSizeOption {
  id: string;
  name: string;
  priceMultiplier: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  price: number; // in INR
  discountPrice?: number;
  isVeg: boolean;
  isBestseller?: boolean;
  isSpecial?: boolean;
  prepTimeMin: number;
  isAvailable: boolean;
  stockCount: number;
  image: string;
  allergens?: string[];
  calories?: number;
  customizations?: {
    sizes?: ProductSizeOption[];
    spiceLevels?: ('Mild' | 'Medium' | 'Extra Spicy')[];
    addons?: ProductAddon[];
  };
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: FoodItem;
  quantity: number;
  selectedSize?: string;
  selectedSpice?: string;
  selectedAddons?: ProductAddon[];
  unitPrice: number;
  itemTotal: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'awaiting_payment'
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'collected'
  | 'cancelled';

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'cash_on_pickup';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  token: string; // e.g. "CB-1048"
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  finalTotal: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  pickupSlot: string;
  status: OrderStatus;
  rejectionReason?: string;
  prepTimeEstMin: number;
  createdAt: string; // ISO string
  acceptedAt?: string;
  readyAt?: string;
  collectedAt?: string;
  qrCodeHash: string;
  counterNumber: string;
  rating?: number;
  feedback?: string;
}

export interface PickupSlot {
  id: string;
  label: string; // e.g. "12:30 PM - 12:45 PM"
  timeStart: string;
  timeEnd: string;
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
}

export interface KitchenWorkload {
  activeOrdersCount: number;
  currentWaitMin: number;
  workloadLevel: 'low' | 'moderate' | 'high' | 'overloaded';
  isOrdersPaused: boolean;
  pauseReason?: string;
}

export interface CanteenSettings {
  canteenName: string;
  institutionName: string;
  counterLocation: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  isPeakHourMode: boolean;
  maxOrdersPerSlot: number;
  slotIntervalMin: number;
  bufferMinutes: number;
  cashOnPickupEnabled: boolean;
  announcement: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  validUntil: string;
  isActive: boolean;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'system' | 'promo';
  timestamp: string;
  read: boolean;
  orderId?: string;
  token?: string;
}
