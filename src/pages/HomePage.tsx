import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERO_CANTEEN_IMAGE } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import {
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    foodItems,
    setActiveTab,
    setSelectedCategory,
    activeOrders,
    userOrders,
    setTrackingOrderId,
    canteenSettings,
    kitchenWorkload,
  } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Filter campus bestsellers & quick break bites
  const bestsellers = foodItems.filter(item => item.isBestseller).slice(0, 4);
  const quickBites = foodItems.filter(item => item.prepTimeMin <= 8).slice(0, 4);

  // Active student order (if any)
  const latestActiveOrder = userOrders.find(
    o => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready'
  );

  const categories = [
    { name: 'South Indian', desc: 'Dosas, Idlis & Vadas', count: 4 },
    { name: 'Breakfast', desc: 'Chole Bhature & Parathas', count: 5 },
    { name: 'Snacks & Chaat', desc: 'Samosas & Vada Pav', count: 6 },
    { name: 'Quick Meals', desc: 'Maggi, Noodles & Rolls', count: 5 },
    { name: 'Meals & Thalis', desc: 'Executive Student Thalis', count: 3 },
    { name: 'Beverages & Chai', desc: 'Cutting Chai & Cold Coffee', count: 5 },
  ];

  const faqs = [
    {
      q: 'How does advance pickup slot booking work?',
      a: 'When adding items to your cart, choose an upcoming 15-minute pickup interval (e.g., 12:45 PM - 1:00 PM). The kitchen prepares your order right before this window so you can walk up to the counter and collect it hot without waiting in the crowd.',
    },
    {
      q: 'How do I collect my order at the canteen counter?',
      a: 'Once your order reaches the "Ready for Pickup" status, present your unique digital token (e.g. CB-1048) or let staff scan your in-app QR code. The staff confirms and hands over your fresh tray in seconds.',
    },
    {
      q: 'What if a lecture runs late and I miss my slot?',
      a: 'Prepared meals are held safely in food warmers at the pickup express counter for up to 20 minutes past your scheduled slot.',
    },
    {
      q: 'Can I cancel an order and get a refund?',
      a: 'You can cancel an order with a single click while its status is "Placed". Once the kitchen staff accepts and starts cooking, cancellation is locked to prevent food wastage.',
    },
    {
      q: 'Is Cash on Pickup accepted?',
      a: 'Yes, if Cash on Pickup is enabled by the canteen administration, you can pay directly in cash at Counter 1 when receiving your food.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Active Order Prompt Banner (If student has a pending meal) */}
      {latestActiveOrder && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-emerald-800">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center font-mono font-bold text-lg text-emerald-200">
                {latestActiveOrder.token}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Active Order Live</span>
                  <span className="text-xs text-emerald-400 font-medium">· Slot: {latestActiveOrder.pickupSlot}</span>
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Status: <span className="capitalize text-amber-300 font-bold">{latestActiveOrder.status}</span> · {latestActiveOrder.counterNumber}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setTrackingOrderId(latestActiveOrder.id);
                setActiveTab('tracking');
              }}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              <span>View Token & Tracking</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Hero Section: 2-Column Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy, CTAs, Benefits */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Smart University Dining Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]" style={{ textWrap: 'balance' }}>
              Your Campus Canteen, Without the Queue.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Order your favorite campus meals in advance, pay digitally, and collect them when they're ready. More time for your campus life, less time waiting.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('menu')}
                className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Order Your Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm rounded-xl transition-all"
              >
                Explore Menu
              </button>
            </div>

            {/* Benefit Indicators (Anti-slop clean text separators) */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-stone-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Easy Online Ordering</span>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Live Order Updates</span>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Convenient Pickup</span>
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Canteen Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 aspect-[16/10] bg-stone-100">
              <img
                src={HERO_CANTEEN_IMAGE}
                alt="Campus canteen fresh food counter"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                    {canteenSettings.canteenName}
                  </div>
                  <div className="text-lg font-bold">
                    Fresh dosas, sizzling samosas, hot chai & quick combos
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-200 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{canteenSettings.counterLocation}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Hours: {canteenSettings.openingTime} - {canteenSettings.closingTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Operational Strip Below Hero */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-stone-200">
          <div className="p-2 text-left">
            <div className="text-xs text-stone-500 font-medium">Canteen Status</div>
            <div className="text-sm font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Open for Dine-In & Takeaway</span>
            </div>
          </div>

          <div className="p-2 text-left">
            <div className="text-xs text-stone-500 font-medium">Kitchen Workload</div>
            <div className="text-sm font-bold text-stone-900 mt-0.5 capitalize">
              {kitchenWorkload.workloadLevel} ({kitchenWorkload.activeOrdersCount} in prep)
            </div>
          </div>

          <div className="p-2 text-left">
            <div className="text-xs text-stone-500 font-medium">Average Preparation Time</div>
            <div className="text-sm font-bold text-stone-900 mt-0.5 font-mono tabular-nums">
              ~{kitchenWorkload.currentWaitMin} mins
            </div>
          </div>

          <div className="p-2 text-left">
            <div className="text-xs text-stone-500 font-medium">Student Discount</div>
            <div className="text-sm font-bold text-emerald-800 mt-0.5">
              15% off with CAMPUS15
            </div>
          </div>
        </div>
      </section>

      {/* Popular Food Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">Explore by Category</h2>
            <p className="text-xs text-stone-500 mt-1">Popular meal sections prepared fresh at campus kitchen stations</p>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setActiveTab('menu');
              }}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-600 hover:shadow-sm text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {cat.name}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">{cat.desc}</div>
              </div>
              <div className="mt-3 text-[10px] font-semibold text-stone-400 group-hover:text-emerald-700">
                Browse Items →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Best-Selling Campus Meals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">Campus Favorites</h2>
            <p className="text-xs text-stone-500 mt-1">Top-rated meals loved by students and faculty daily</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('menu');
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>See full menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Quick 5-10 Min Break Bites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100/70 border border-stone-200 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>10-Minute Class Breaks</span>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">Quick Bites Between Lectures</h2>
              <p className="text-xs text-stone-500 mt-0.5">Grab-and-go favorites ready under 8 minutes</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('Quick Meals');
                setActiveTab('menu');
              }}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-700 hidden sm:flex items-center gap-1"
            >
              <span>Explore quick meals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickBites.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* How CampusBite Works: 4-Step Visual Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">Effortless Flow</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">How CampusBite Works</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            No more standing in 30-minute chaotic lunch queues. Follow four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold font-mono text-base flex items-center justify-center">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900">Browse & Customize</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explore live menu availability, choose your favorite items, select spice levels and portion sizes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold font-mono text-base flex items-center justify-center">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900">Select Pickup Slot</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pick an upcoming 15-minute collection window that fits your lecture or break schedule.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold font-mono text-base flex items-center justify-center">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900">Pay Securely</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pay in seconds with UPI apps (GPay, PhonePe), cards, or opt for Cash on Pickup at the counter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold font-mono text-base flex items-center justify-center">
              04
            </div>
            <h3 className="text-base font-bold text-stone-900">Collect with Token</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receive token CB-XXXX and live status. Walk to the pickup express counter and grab your hot tray.
            </p>
          </div>
        </div>
      </section>

      {/* Student Feedback (Explicitly labeled demo reviews) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider font-bold text-stone-400">Student Voices</span>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-1">Loved by Campus Students</h2>
          <p className="text-xs text-stone-500 mt-1">(Curated sample reviews from verified campus users)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "During our 15-minute break between lab sessions, standing in line was impossible. With CampusBite, I order from my phone while walking out of lab and pick up my samosa and tea immediately."
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Ananya Verma</span>
              <span className="text-stone-400">3rd Year, CSE</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "The pickup slot scheduler is a game changer. The masala dosa is still steaming crisp because they make it specifically for your 12:45 PM slot, not 40 minutes earlier in advance."
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Rahul Sen</span>
              <span className="text-stone-400">2nd Year, Mechanical</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "Being able to see whether cold coffee or thali is sold out before walking across campus to the canteen saves so much time and frustration."
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Sneha Kulkarni</span>
              <span className="text-stone-400">4th Year, Biotech</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
          <p className="text-xs text-stone-500 mt-1">Everything you need to know about ordering and collecting meals</p>
        </div>

        <div className="divide-y divide-stone-200 bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="text-sm font-bold text-stone-900">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <p className="mt-3 text-xs text-stone-600 leading-relaxed pr-6 animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="text-lg font-extrabold text-emerald-900">
                MJPRU <span className="text-amber-600">Cafeteria</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Smart digital university cafeteria platform reducing wait times and providing seamless advance meal pickups for MJPRU students.
              </p>
              <div className="text-xs text-stone-400">
                Operated in partnership with {canteenSettings.institutionName}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-xs text-stone-600">
                <li><button onClick={() => setActiveTab('menu')} className="hover:text-emerald-800">Digital Menu</button></li>
                <li><button onClick={() => setActiveTab('my_orders')} className="hover:text-emerald-800">Track Current Token</button></li>
                <li><button onClick={() => setActiveTab('wishlist')} className="hover:text-emerald-800">Saved Favorites</button></li>
                <li><button onClick={() => setActiveTab('help')} className="hover:text-emerald-800">Canteen Guidelines</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Roles & Consoles</h4>
              <ul className="space-y-2 text-xs text-stone-600">
                <li><button onClick={() => setActiveTab('staff_dashboard')} className="hover:text-emerald-800">Staff Order Queue</button></li>
                <li><button onClick={() => setActiveTab('staff_kds')} className="hover:text-emerald-800">Kitchen Display System</button></li>
                <li><button onClick={() => setActiveTab('admin_dashboard')} className="hover:text-emerald-800">Admin Operational Analytics</button></li>
                <li><button onClick={() => setActiveTab('admin_menu')} className="hover:text-emerald-800">Menu & Pricing Editor</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Canteen Details</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {canteenSettings.canteenName}<br />
                {canteenSettings.counterLocation}<br />
                Service Hours: {canteenSettings.openingTime} - {canteenSettings.closingTime}<br />
                Helpline: +91 11 2345 6789
              </p>
              <div className="mt-3">
                <button
                  onClick={() => setActiveTab('policies')}
                  className="text-xs text-emerald-800 underline hover:text-emerald-700"
                >
                  Refund & Cancellation Policy
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} MJPRU Cafeteria. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Prices in Indian Rupees (INR, ₹)</span>
              <span>·</span>
              <span>IST Timezone (Asia/Kolkata)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
