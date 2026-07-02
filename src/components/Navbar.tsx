/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, User, X, CheckSquare, Sparkles, Settings, Shield, Clipboard, MapPin, Phone, Globe, Edit, Save, Loader2, Mail, LogOut, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Shoe, UserSession } from "../types";
import { getAthleteProfile, updateFullProfile } from "../lib/supabase";
import AddressPickerMap from "./AddressPickerMap";

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  catalogItems: Shoe[];
  onScrollToSection: (elementId: string) => void;
  onSelectShoeProduct: (shoe: Shoe) => void;
  activePage?: "home" | "about" | "faq" | "new-arrivals";
  onChangePage?: (page: "home" | "about" | "faq" | "new-arrivals") => void;
  userSession: UserSession | null;
  onSignOut: () => void;
  onOpenSignIn: () => void;
  onUpdateUserSession?: (session: UserSession) => void;
}

export default function Navbar({
  cartItems,
  onOpenCart,
  catalogItems,
  onScrollToSection,
  onSelectShoeProduct,
  activePage = "home",
  onChangePage,
  userSession,
  onSignOut,
  onOpenSignIn,
  onUpdateUserSession
}: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "settings">("profile");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editBankName, setEditBankName] = useState("");
  const [editBankAccount, setEditBankAccount] = useState("");
  const [editBankRouting, setEditBankRouting] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync fields when userSession changes or profile modal opens
  useEffect(() => {
    let active = true;
    if (!isProfileOpen) return;

    if (userSession) {
      // snapping setup using available session info
      setEditName(userSession.name || "");
      setEditEmail(userSession.email || "");
      
      const rawAddr = userSession.address || "";
      const sessionAddr = rawAddr === "Not Provided" ? "" : rawAddr;
      const sessionBankMatch = sessionAddr.match(/\[Bank:\s*(.*?)\]/);
      const cleanSessionAddr = sessionAddr.replace(/\[Bank:\s*(.*?)\]/, "").trim();
      setEditAddress(cleanSessionAddr);
      
      if (userSession.bankName) {
        setEditBankName(userSession.bankName);
        setEditBankAccount(userSession.bankAccount || "");
        setEditBankRouting(userSession.bankRouting || "");
      } else {
        const legacyVal = sessionBankMatch ? sessionBankMatch[1] : (localStorage.getItem(`stepx_bank_${userSession.email}`) || "");
        if (legacyVal.includes("|")) {
          const parts = legacyVal.split("|");
          setEditBankName(parts[0] || "");
          setEditBankAccount(parts[1] || "");
          setEditBankRouting(parts[2] || "");
        } else {
          setEditBankName(legacyVal);
          setEditBankAccount("");
          setEditBankRouting("");
        }
      }
      
      const rawPhone = userSession.phone || "";
      setEditPhone(rawPhone === "Not Provided" ? "" : rawPhone);
      
      const rawCountry = userSession.country || "";
      setEditCountry(rawCountry === "Not Provided" ? "" : rawCountry);
      
      setIsProfileLoading(true);
      
      // Fetch any newly filled fields from supabase once
      getAthleteProfile(userSession.email).then((fresh) => {
        if (active && fresh && isProfileOpen) {
          setEditName(fresh.name || "");
          setEditEmail(fresh.email || "");
          
          const rawDbAddr = fresh.address || "";
          const dbAddr = rawDbAddr === "Not Provided" ? "" : rawDbAddr;
          const dbBankMatch = dbAddr.match(/\[Bank:\s*(.*?)\]/);
          const cleanDbAddr = dbAddr.replace(/\[Bank:\s*(.*?)\]/, "").trim();
          setEditAddress(cleanDbAddr);
          
          if (fresh.bankName) {
            setEditBankName(fresh.bankName);
            setEditBankAccount(fresh.bankAccount || "");
            setEditBankRouting(fresh.routingNumber || "");
          } else {
            const legacyDbVal = dbBankMatch ? dbBankMatch[1] : (localStorage.getItem(`stepx_bank_${fresh.email}`) || "");
            if (legacyDbVal.includes("|")) {
              const parts = legacyDbVal.split("|");
              setEditBankName(parts[0] || "");
              setEditBankAccount(parts[1] || "");
              setEditBankRouting(parts[2] || "");
            } else {
              setEditBankName(legacyDbVal);
              setEditBankAccount("");
              setEditBankRouting("");
            }
          }
          
          const rawDbPhone = fresh.phone || "";
          const cleanPhone = rawDbPhone === "Not Provided" ? "" : rawDbPhone;
          setEditPhone(cleanPhone);

          const rawDbCountry = fresh.country || "";
          const cleanCountry = rawDbCountry === "Not Provided" ? "" : rawDbCountry;
          setEditCountry(cleanCountry);
          
          if (onUpdateUserSession) {
            onUpdateUserSession({
              ...userSession,
              name: fresh.name,
              email: fresh.email,
              address: cleanDbAddr === "" ? "Not Provided" : cleanDbAddr,
              phone: cleanPhone === "" ? "Not Provided" : cleanPhone,
              country: cleanCountry === "" ? "Not Provided" : cleanCountry,
              bankName: fresh.bankName || "",
              bankAccount: fresh.bankAccount || "",
              bankRouting: fresh.routingNumber || ""
            });
          }
        }
      }).catch((err) => {
        console.warn("Could not retrieve athlete profile", err);
      }).finally(() => {
        if (active) {
          setIsProfileLoading(false);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [isProfileOpen]); // ONLY reload when modal opens

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) return;
    setIsSavingProfile(true);
    setSaveError(null);
    setSaveSuccess(null);

    const bankStr = (editBankName.trim() || editBankAccount.trim() || editBankRouting.trim())
      ? `${editBankName.trim()}|${editBankAccount.trim()}|${editBankRouting.trim()}`
      : "";
    const bankSuffix = bankStr ? ` [Bank: ${bankStr}]` : "";
    const combinedAddress = editAddress.trim() + bankSuffix;

    const result = await updateFullProfile(userSession.email, {
      name: editName,
      email: editEmail,
      address: combinedAddress,
      phone: editPhone,
      country: editCountry,
      bankName: editBankName.trim(),
      bankAccount: editBankAccount.trim(),
      routingNumber: editBankRouting.trim()
    });

    if (result.success) {
      if (bankStr) {
        try {
          localStorage.setItem(`stepx_bank_${editEmail}`, bankStr);
        } catch (err) {
          console.warn(err);
        }
      } else {
        try {
          localStorage.removeItem(`stepx_bank_${editEmail}`);
        } catch (err) {
          console.warn(err);
        }
      }
      setSaveSuccess("Profile updated successfully!");
      if (onUpdateUserSession) {
        onUpdateUserSession({
          ...userSession,
          name: editName,
          email: editEmail,
          address: editAddress,
          phone: editPhone,
          country: editCountry,
          bankName: editBankName.trim(),
          bankAccount: editBankAccount.trim(),
          bankRouting: editBankRouting.trim()
        });
      }
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } else {
      setSaveError(result.error || "Failed to update profile.");
    }
    setIsSavingProfile(false);
  };


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
    <>
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

          {/* User Section */}
          {userSession ? (
            <button
              id="profile-trigger-btn"
              onClick={() => {
                setActiveTab("profile");
                setIsProfileOpen(true);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#C8E600] font-mono font-bold text-base tracking-tight border border-[#C8E600] hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Configure Profile"
              aria-label="Client Dashboard Profile"
            >
              {userSession.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              id="navbar-signin-btn"
              onClick={onOpenSignIn}
              className="flex h-12 w-12 items-center justify-center rounded-full text-stone-900 border border-stone-200 bg-white hover:bg-stone-100 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Sign In"
              aria-label="Sign In"
            >
              <User className="h-6 w-6 stroke-1.5" />
            </button>
          )}
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
    </header>

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
                            {shoe.category} • PKR {shoe.price}
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
            onClick={() => setIsProfileOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs cursor-pointer"
          >
            <motion.div
              id="profile-dialog-box"
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#F7F7F5] p-6 shadow-2xl border border-stone-200 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-display text-xs font-black tracking-widest text-neutral-800 uppercase flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#C8E600]" />
                  StepX Account Details
                </span>
                <button
                  id="close-profile-btn"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-800 hover:bg-black hover:text-[#C8E600] border border-stone-300 transition-colors cursor-pointer active:scale-90"
                  title="Close Options"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {userSession ? (
                <form onSubmit={handleSaveProfile} className="relative py-4 space-y-4 max-h-[460px] overflow-y-auto px-1">
                  {isProfileLoading && (
                    <div className="absolute inset-0 bg-[#F7F7F5]/85 backdrop-blur-xs flex flex-col items-center justify-center z-30 rounded-xl py-12">
                      <Loader2 className="h-7 w-7 text-black animate-spin mb-2" />
                      <span className="text-[10px] font-mono font-black text-neutral-500 tracking-wider uppercase">Loading Athlete Profile...</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                      Shipping Address (or auto-detect below)
                    </label>
                    <div className="relative mb-2">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. 123 Elite Athlete Way"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                      />
                    </div>
                    {/* Interactive Google Map location picker */}
                    <div className="mt-2.5">
                      <AddressPickerMap
                        currentAddress={editAddress}
                        onAddressSelect={(newAddr) => setEditAddress(newAddr)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                      Contact / Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 0199"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Split Bank Details Section */}
                  <div className="space-y-3.5 border-t border-stone-200/60 pt-3">
                    <span className="block text-[10px] font-mono font-black text-[#718200] uppercase tracking-widest flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      Bank Transfer Settings
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      <div>
                        <label className="block text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Chase Bank"
                          value={editBankName}
                          onChange={(e) => setEditBankName(e.target.value)}
                          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1">
                            Account Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 123456789"
                            value={editBankAccount}
                            onChange={(e) => setEditBankAccount(e.target.value)}
                            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1">
                            IFSC / SWIFT / Routing Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. CHASUS33"
                            value={editBankRouting}
                            onChange={(e) => setEditBankRouting(e.target.value)}
                            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                      Country Location
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                      <select
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs font-medium focus:border-black focus:ring-0 outline-hidden text-neutral-900 shadow-xs"
                      >
                        <option value="">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Spain">Spain</option>
                        <option value="Italy">Italy</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="India">India</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold p-2.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckSquare className="h-4 w-4 shrink-0 text-emerald-600" />
                      {saveSuccess}
                    </div>
                  )}

                  {saveError && (
                    <div className="bg-rose-50 text-rose-800 text-[10px] font-bold p-2.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                      <X className="h-4 w-4 shrink-0 text-rose-600" />
                      {saveError}
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full rounded-full bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all font-display tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98 shadow-sm"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Profile Details
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        setIsProfileOpen(false);
                      }}
                      className="w-full rounded-full bg-white border border-stone-200 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-stone-50 transition-all font-display tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out of Account
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center text-xs text-stone-500 font-mono">
                  Please sign in to access your profile settings.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
