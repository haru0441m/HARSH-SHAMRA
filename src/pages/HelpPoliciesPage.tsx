import React from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ShieldCheck, Clock, RotateCcw, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

export const HelpPoliciesPage: React.FC = () => {
  const { canteenSettings, setActiveTab } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Canteen Guidelines & Policies
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Everything regarding advance pickup slots, cancellation rules, hygiene standards, and student support.
        </p>
      </div>

      <div className="space-y-6">
        {/* Policy Section 1: Ordering & Pickup Rules */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Advance Slot & Collection Policy</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            1. Orders must be collected within 15 minutes of your chosen pickup window. Prepared hot food is held safely in temperature-controlled counter warmers for a maximum of 20 minutes before quality degradation.<br />
            2. Present your valid token number (e.g. <strong>CB-1048</strong>) or the in-app QR code to the server at the assigned counter. Once scanned, the order is marked as collected and cannot be reclaimed.
          </p>
        </div>

        {/* Policy Section 2: Cancellation & Refund Policy */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span>Cancellation and Refund Policy</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            1. <strong>Eligible Cancellations:</strong> Orders may be cancelled with 100% refund while the order status remains "Placed".<br />
            2. <strong>Kitchen Locked:</strong> Once the kitchen staff accepts the order or starts cooking (status: "Accepted" or "Preparing"), cancellation is strictly locked to prevent kitchen food waste.<br />
            3. <strong>Automatic Refunds:</strong> If the kitchen rejects an order due to ingredient stockouts or equipment downtime, refunds for online payments are reversed automatically to the student's original UPI/card account within 24–48 banking hours.
          </p>
        </div>

        {/* Policy Section 3: Food Safety & Hygiene */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>FSSAI Quality & Dietary Hygiene</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our campus canteen is FSSAI compliant. All vegetarian meals are prepared in dedicated cookware. Dosa batter is fermented fresh daily without artificial additives. Allergens (dairy, gluten, nuts, mustard) are clearly labeled on the digital item detail cards.
          </p>
        </div>

        {/* Canteen Helpdesk & Counter Contact */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-3">
          <div className="text-sm font-bold text-stone-900">Canteen Support & Feedback Desk</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{canteenSettings.counterLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>+91 11 2345 6789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>canteen-support@campusbite.ac.in</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveTab('menu')}
            className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            Back to Canteen Menu
          </button>
        </div>
      </div>
    </div>
  );
};
