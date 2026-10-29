import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, X, Clock, ArrowUpDown } from 'lucide-react';
import { FoodCategory } from '../types';

export const MenuPage: React.FC = () => {
  const { foodItems, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useApp();

  const [vegOnly, setVegOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'prep_time'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: FoodCategory[] = [
    'All',
    'South Indian',
    'Breakfast',
    'Snacks & Chaat',
    'Meals & Thalis',
    'Quick Meals',
    'Sandwiches & Burgers',
    'Beverages & Chai',
    'Desserts',
  ];

  const filteredItems = useMemo(() => {
    return foodItems
      .filter(item => {
        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        // Veg only
        if (vegOnly && !item.isVeg) return false;
        // Price limit
        const activePrice = item.discountPrice ?? item.price;
        if (activePrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'prep_time') return a.prepTimeMin - b.prepTimeMin;
        // Default: popularity / bestseller
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [foodItems, selectedCategory, searchQuery, vegOnly, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setVegOnly(false);
    setMaxPrice(150);
    setSortBy('popular');
  };

  const isFiltered = selectedCategory !== 'All' || searchQuery !== '' || vegOnly || maxPrice < 150 || sortBy !== 'popular';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Canteen Menu</h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse 25+ fresh campus specialties, customize add-ons, and book advance pickup slots.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dosas, maggi, chai, thali..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-800 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary Controls Bar (Sort, Veg Toggle, Price, Clear) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Veg Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={e => setVegOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Pure Veg Only</span>
            </span>
          </label>

          {/* Price Range Slider */}
          <div className="flex items-center gap-2 text-stone-600">
            <span>Max Price:</span>
            <span className="font-mono font-bold text-stone-900 tabular-nums">₹{maxPrice}</span>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-emerald-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-stone-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="prep_time">Fastest Preparation</option>
            </select>
          </div>

          {/* Clear Filters */}
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-stone-500 hover:text-rose-600 font-medium underline transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Food Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No food items matched your criteria</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your price filter, search term, or select "All" categories to see full campus choices.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
