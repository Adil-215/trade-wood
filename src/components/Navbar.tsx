/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, ShoppingBag, User, X, CheckSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Shoe } from "../types";

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  catalogItems: Shoe[];
  onScrollToSection: (elementId: string) => void;
  onSelectShoeProduct: (shoe: Shoe) => void;
  activePage?: "home" | "about" | "faq" | "new-arrivals";
  onChangePage?: (page: "home" | "about" | "faq" | "new-arrivals") => void;
}

export default function Navbar({
  cartItems,
  onOpenCart,
  catalogItems,
  onScrollToSection,
  onSelectShoeProduct,
  activePage = "home",
  onChangePage
}: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products by query
  const searchResults = searchQuery
    ? catalogItems.filter(
        (shoe) =>
          shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shoe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shoe.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectResult = (shoe: Shoe) => {
    onSelectShoeProduct(shoe);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/50 bg-[#F7F7F5]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Left Section - Brand Logo */}
        <div id="navbar-brand" className="flex items-center">
          <button
            id="brand-logo-btn"
            onClick={() => {
              if (onChangePage) onChangePage("home");
              onScrollToSection("hero-sec");
            }}
            className="font-display text-3xl font-black tracking-tight text-neutral-900 cursor-pointer flex items-center"
          >
            StepX
          </button>
        </div>

        {/* Center Section - Navigation Links */}
        <nav id="navbar-links" className="hidden md:flex items-center gap-12">
          <button
            id="nav-link-exclusive"
            onClick={() => {
              if (onChangePage) onChangePage("home");
              onScrollToSection("catalog-sec");
            }}
            className={`font-display text-sm font-bold tracking-widest uppercase cursor-pointer transition-colors ${
              activePage === "home" ? "text-neutral-600 hover:text-neutral-900" : "text-neutral-400 hover:text-neutral-900"
            }`}
          >
            Exclusive
          </button>
          <button
            id="nav-link-accessories"
            onClick={() => {
              if (onChangePage) onChangePage("home");
              onScrollToSection("accessories-sec");
            }}
            className={`font-display text-sm font-bold tracking-widest uppercase cursor-pointer transition-colors ${
              activePage === "home" ? "text-neutral-600 hover:text-neutral-900" : "text-neutral-400 hover:text-neutral-900"
            }`}
          >
            Accessories
          </button>
          
          {/* New Arrivals with "New" badge */}
          <div className="relative flex flex-col items-center">
            {/* "New" badge above */}
            <span className="absolute -top-[15px] rounded-full bg-black px-1.5 py-0.2 text-[8px] font-mono font-bold tracking-wider text-white uppercase shadow-xs">
              New
            </span>
            <button
              id="nav-link-new-arrivals"
              onClick={() => {
                if (onChangePage) onChangePage("new-arrivals");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`font-display text-sm font-bold tracking-widest uppercase cursor-pointer transition-colors pt-1 ${
                activePage === "new-arrivals" ? "text-[#718200] border-b-2 border-[#718200] pb-0.5" : "text-neutral-600 hover:text-[#718200]"
              }`}
            >
              New Arrivals
            </button>
          </div>

          <button
            id="nav-link-showcase"
            onClick={() => {
              if (onChangePage) onChangePage("home");
              onScrollToSection("showcase-sec");
            }}
            className={`font-display text-sm font-bold tracking-widest uppercase cursor-pointer transition-colors ${
              activePage === "home" ? "text-neutral-600 hover:text-neutral-900" : "text-neutral-400 hover:text-neutral-900"
            }`}
          >
            Showcase
          </button>

          <button
            id="nav-link-about-us"
            onClick={() => {
              if (onChangePage) onChangePage("about");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`font-display text-sm font-bold tracking-widest uppercase cursor-pointer transition-colors transition-all ${
              activePage === "about" ? "text-[#718200] border-b-2 border-current pb-0.5" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            About Us
          </button>

          <button
            id="nav-link-faq"
            onClick={() => {
              if (onChangePage) onChangePage("faq");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`font-display text-sm font-bold tracking-widest uppercase cursor-pointer transition-colors transition-all ${
              activePage === "faq" ? "text-[#718200] border-b-2 border-current pb-0.5" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Right Section - Action Icons */}
        <div id="navbar-actions" className="flex items-center gap-6">
          {/* Search Icon */}
          <button
            id="search-trigger-btn"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full text-stone-900 transition-colors hover:bg-stone-200/50 cursor-pointer"
            aria-label="Search Collection"
          >
            <Search className="h-6 w-6 stroke-1.5" />
          </button>

          {/* Shopping Cart Icon */}
          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="relative flex h-12 w-12 items-center justify-center rounded-full text-stone-900 transition-colors hover:bg-stone-200/50 cursor-pointer"
            aria-label="View Shopping bag"
          >
            <ShoppingBag className="h-6 w-6 stroke-1.5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-black text-[10px] font-mono font-bold text-white leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Icon */}
          <button
            id="profile-trigger-btn"
            onClick={() => setIsProfileOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full text-stone-900 transition-colors hover:bg-stone-200/50 cursor-pointer"
            aria-label="Client Dashboard Profile"
          >
            <User className="h-6 w-6 stroke-1.5" />
          </button>
        </div>
      </div>

      {/* Moving Discount Announcement Ticker Banner */}
      <div className="w-full bg-black text-white/95 py-2 border-t border-[#1a1a1a] select-none overflow-hidden flex items-center">
        <div className="marquee-container font-mono text-[10px] md:text-[11px] font-bold tracking-wider uppercase">
          <div className="marquee-content gap-12">
            <span className="flex items-center gap-12 shrink-0">
              <span>⚡ STEPX SEASON SALE: GET 20% OFF ALL CORE GEAR — USE CODE <strong className="text-[#C8E600] font-black">SX20</strong></span>
              <span className="text-[#C8E600]">★</span>
              <span>SPECIAL LAUNCH EVENT: 20% AUTOMATICALLY APPLIED AT CHECKOUT</span>
              <span className="text-[#C8E600]">★</span>
              <span>FREE EXPEDITED SHIPPING FOR ATHLETE CLUB MEMBERS</span>
              <span className="text-[#C8E600]">★</span>
            </span>
            <span className="flex items-center gap-12 shrink-0">
              <span>⚡ STEPX SEASON SALE: GET 20% OFF ALL CORE GEAR — USE CODE <strong className="text-[#C8E600] font-black">SX20</strong></span>
              <span className="text-[#C8E600]">★</span>
              <span>SPECIAL LAUNCH EVENT: 20% AUTOMATICALLY APPLIED AT CHECKOUT</span>
              <span className="text-[#C8E600]">★</span>
              <span>FREE EXPEDITED SHIPPING FOR ATHLETE CLUB MEMBERS</span>
              <span className="text-[#C8E600]">★</span>
            </span>
          </div>
        </div>
      </div>

      {/* --- EXTRA PREMIUM INTERACTION: SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24 backdrop-blur-xs"
          >
            <motion.div
              id="search-dialog-box"
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-[#F7F7F5] p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <span className="font-display text-sm font-black tracking-widest text-[#718200] uppercase">
                  EXPLORE ARCHIVE
                </span>
                <button
                  id="close-search-btn"
                  onClick={() => setIsSearchOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-black hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Seach by name, category, run type (e.g. 'Volt', 'Stealth')..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-white py-4 pl-12 pr-6 text-sm font-medium focus:border-[#C8E600] focus:ring-1 focus:ring-[#C8E600] outline-hidden shadow-sm"
                />
              </div>

              {/* Instant Search Results */}
              <div id="search-results-list" className="mt-6 max-h-64 overflow-y-auto space-y-3">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    searchResults.map((shoe) => (
                      <button
                        key={shoe.id}
                        onClick={() => handleSelectResult(shoe)}
                        className="flex w-full items-center gap-4 rounded-xl border border-stone-100 bg-white p-3 text-left transition-all hover:border-[#C8E600] hover:shadow-xs"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F7F5] border border-stone-100 shrink-0 overflow-hidden">
                          <img
                            src={shoe.image}
                            alt={shoe.name}
                            className="h-10 w-10 object-contain rotate-12 rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-display text-xs font-extrabold text-neutral-900 uppercase">
                            {shoe.name}
                          </h4>
                          <p className="font-mono text-[10px] text-[#718200] font-semibold mt-0.5">
                            {shoe.category} • ${shoe.price}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center py-6 text-xs text-neutral-500 font-mono">
                      No designs match your criteria. Try "Volt" or "Kinetic".
                    </p>
                  )
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest pl-2">
                      QUICK SUGGESTIONS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Dynafit Volt", "Kinetic Orange", "Performance Running", "Stealth"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="rounded-full bg-white border border-stone-200 px-3.5 py-1.5 text-xs text-stone-700 font-medium hover:border-black"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- USER ACCOUNT DASHBOARD PROMPT --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            id="profile-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          >
            <motion.div
              id="profile-dialog-box"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-2xl bg-[#F7F7F5] p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <span className="font-display text-xs font-black tracking-widest text-neutral-800 uppercase flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#C8E600]" />
                  STEPX ATHLETE CLUB
                </span>
                <button
                  id="close-profile-btn"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-black hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="py-6 flex flex-col items-center text-center">
                <div className="relative h-16 w-16 mb-4 rounded-full bg-black text-[#C8E600] flex items-center justify-center text-lg font-bold font-mono border-2 border-[#C8E600] shadow-sm">
                  SX
                  <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-[#C8E600] border-2 border-white" />
                </div>
                <h3 className="font-display text-base font-black text-neutral-900 leading-tight">
                  Guest Athlete
                </h3>
                <p className="font-mono text-[10px] text-neutral-500 mt-1 uppercase">
                  TIER: ELITE TRAILBLAZER
                </p>

                <div className="w-full mt-6 bg-white border border-stone-200/80 rounded-xl p-4 text-left space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500 font-medium">Daily Fitness Streak</span>
                    <span className="font-mono text-xs font-extrabold text-[#718200] bg-[#EDF5D8] px-2 py-0.5 rounded">
                      14 Days 🔥
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500 font-medium">Member Reward Tier</span>
                    <span className="font-mono text-xs font-extrabold text-neutral-900 bg-[#C8E600] px-2 py-0.5 rounded">
                      Level 3 • 420pts
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-black h-1.5 rounded-full" style={{ width: "58%" }} />
                  </div>
                  <span className="block text-[9px] text-stone-500 font-mono text-center">
                    58% towards next loyalty gift box
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <button
                  id="profile-dashboard-btn"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full rounded-full bg-black py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all font-display tracking-widest uppercase"
                >
                  ENTER CLUB DASHBOARD
                </button>
                <button
                  id="profile-logout-btn"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full rounded-full bg-white border border-stone-200 py-3 text-xs font-bold text-stone-600 hover:text-black transition-all font-display tracking-widest uppercase"
                >
                  SIGN OUT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
