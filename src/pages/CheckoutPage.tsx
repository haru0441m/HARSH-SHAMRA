import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RazorpayModal } from '../components/RazorpayModal';
import { PaymentMethod, PaymentStatus } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  ArrowRight,
  AlertCircle,
  User,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    user,
    cart,
    cartSubtotal,
    gstAmount,
    discountAmount,
    cartFinalTotal,
    selectedSlot,
    placeOrder,
    setActiveTab,
    canteenSettings,
  } = useApp();

  const [studentName, setStudentName] = useState(user.name);
  const [studentEmail, setStudentEmail] = useState(user.email);
  const [studentPhone, setStudentPhone] = useState(user.phone);
  const [rollNumber, setRollNumber] = useState(user.rollNumber);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('upi');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    setActiveTab('cart');
    return null;
  }

  const handlePlaceOrderClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentMethod === 'cash_on_pickup') {
      // Cash on pickup orders are recorded as pending payment directly
      setIsSubmitting(true);
      setTimeout(() => {
        const created = placeOrder({
          studentName,
          studentEmail,
          studentPhone,
          pickupSlot: selectedSlot?.label || 'Immediate Pickup',
          paymentMethod: 'cash_on_pickup',
          paymentStatus: 'pending',
        });
        setIsSubmitting(false);
        setActiveTab('tracking');
      }, 700);
    } else {
      // Open Razorpay online payment simulator
      setShowRazorpayModal(true);
    }
  };

  const handlePaymentSuccess = (paymentId: string, method: PaymentMethod) => {
    setShowRazorpayModal(false);
    setIsSubmitting(true);
    setTimeout(() => {
      const created = placeOrder({
        studentName,
        studentEmail,
        studentPhone,
        pickupSlot: selectedSlot?.label || 'Immediate Pickup',
        paymentMethod: method,
        paymentStatus: 'paid',
        razorpayPaymentId: paymentId,
      });
      setIsSubmitting(false);
      setActiveTab('tracking');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Checkout & Confirmation</h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your campus meal checkout. A unique collection token will be generated immediately.
        </p>
      </div>

      <form onSubmit={handlePlaceOrderClick} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Details & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Student Verification Details */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Student Details for Token Handover</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">College Roll / ID</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-mono font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">College Email</label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Mobile (SMS Token Updates)</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={e => setStudentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-mono font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Pickup Window Confirmation */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Pickup Slot & Counter</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('cart')}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                Change Slot
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">{selectedSlot?.label || 'Immediate Slot'}</span>
                <span className="text-[11px] text-stone-500">Pick up at {canteenSettings.counterLocation}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-semibold rounded-md text-[11px]">
                Reserved
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Select Payment Mode</span>
              </div>
              <span className="text-[11px] text-stone-400">Razorpay 256-bit SSL</span>
            </div>

            <div className="space-y-2">
              <label
                onClick={() => setSelectedPaymentMethod('upi')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  selectedPaymentMethod === 'upi'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-800" />
                  <div>
                    <span className="font-bold block">UPI Apps (GPay, PhonePe, Paytm, CRED)</span>
                    <span className="text-[10px] text-stone-500">Instant scan & pay · No convenience fee</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={() => setSelectedPaymentMethod('upi')}
                  className="w-4 h-4 text-emerald-700"
                />
              </label>

              <label
                onClick={() => setSelectedPaymentMethod('card')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-800" />
                  <div>
                    <span className="font-bold block">Credit / Debit Card (Visa, RuPay, MasterCard)</span>
                    <span className="text-[10px] text-stone-500">All Indian bank cards accepted</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => setSelectedPaymentMethod('card')}
                  className="w-4 h-4 text-emerald-700"
                />
              </label>

              <label
                onClick={() => setSelectedPaymentMethod('netbanking')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  selectedPaymentMethod === 'netbanking'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-800" />
                  <div>
                    <span className="font-bold block">NetBanking</span>
                    <span className="text-[10px] text-stone-500">SBI, HDFC, ICICI, PNB & 50+ Banks</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPaymentMethod === 'netbanking'}
                  onChange={() => setSelectedPaymentMethod('netbanking')}
                  className="w-4 h-4 text-emerald-700"
                />
              </label>

              {canteenSettings.cashOnPickupEnabled && (
                <label
                  onClick={() => setSelectedPaymentMethod('cash_on_pickup')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                    selectedPaymentMethod === 'cash_on_pickup'
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-emerald-800" />
                    <div>
                      <span className="font-bold block">Cash on Pickup (COP)</span>
                      <span className="text-[10px] text-stone-500">Pay cash in INR directly at Counter 1 when collecting</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPaymentMethod === 'cash_on_pickup'}
                    onChange={() => setSelectedPaymentMethod('cash_on_pickup')}
                    className="w-4 h-4 text-emerald-700"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Items Ordered ({cart.length})</h3>

            <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-800">{item.quantity}x {item.product.name}</span>
                    {item.selectedSize && (
                      <span className="text-[10px] text-stone-400 block">{item.selectedSize}</span>
                    )}
                  </div>
                  <span className="font-mono tabular-nums text-stone-900 font-semibold">₹{item.itemTotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-mono tabular-nums">₹{gstAmount}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-emerald-950">₹{cartFinalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>{selectedPaymentMethod === 'cash_on_pickup' ? 'Confirm Order (Pay on Pickup)' : `Pay ₹${cartFinalTotal} & Generate Token`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Razorpay Online Payment Gateway Modal */}
      {showRazorpayModal && (
        <RazorpayModal
          amount={cartFinalTotal}
          studentName={studentName}
          studentEmail={studentEmail}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowRazorpayModal(false)}
        />
      )}
    </div>
  );
};
