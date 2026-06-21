/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, CheckCircle, Sparkles } from "lucide-react";
import { CartItem } from "../types";
import { createOrderLog } from "../lib/supabase";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onExploreExclusive?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onExploreExclusive
}: CartDrawerProps) {
  const [isCheckoutCompleted, setIsCheckoutCompleted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCod, setIsCod] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    bankAccount: "",
    bankName: "",
    routingNumber: ""
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.shoe.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    try {
      const orderPayload = {
        email: shippingInfo.email,
        customerName: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        zip: shippingInfo.zip,
        country: shippingInfo.country,
        bankName: isCod ? "No" : shippingInfo.bankName,
        routingNumber: isCod ? "No" : shippingInfo.routingNumber,
        bankAccount: isCod ? "No" : shippingInfo.bankAccount,
        isCod,
        subtotal: subtotal,
        total: total,
        quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        items: cartItems.map((item) => ({
          shoeId: item.shoe.id,
          shoeName: item.shoe.name,
          colorName: item.selectedColor.name,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.shoe.price
        }))
      };

      // Persist order details to Supabase database!
      await createOrderLog(orderPayload);
    } catch (err) {
      console.error("Supabase order submission error:", err);
    } finally {
      setIsCheckingOut(false);
      setIsCheckoutCompleted(true);
    }
  };

  const resetDrawer = () => {
    setIsCheckoutCompleted(false);
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <motion.div
            id="cart-drawer-container"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-lg flex-col bg-[#F7F7F5] shadow-2xl"
          >
            {/* Header */}
            <div id="cart-drawer-header" className="flex items-center justify-between border-b border-stone-200 p-6 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 stroke-2" />
                <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900">
                  YOUR BAG
                </h2>
                {cartItems.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-mono font-bold text-white">
                    {cartItems.reduce((total, i) => total + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-neutral-600 transition-colors hover:bg-black hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Body */}
            {isCheckoutCompleted ? (
              <div id="cart-drawer-body" className="flex-1 overflow-y-auto p-6">
                {/* Success Screen */}
                <motion.div
                  id="checkout-success-container"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center text-center px-4"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#C8E600]/20" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#C8E600]/10 border-2 border-[#C8E600] text-[#718200]">
                      <CheckCircle className="h-10 w-10 stroke-2" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-black tracking-tight text-neutral-900 mb-2">
                    ORDER CONFIRMED!
                  </h3>
                  <p className="font-mono text-xs text-neutral-500 bg-[#EDF5D8] px-3 py-1.5 rounded-md mb-6 inline-block font-semibold">
                    STEPX-#{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                  <p className="text-sm text-neutral-600 mb-8 max-w-sm">
                    Thank you for stepping into the future with StepX! We have sent a confirmation email to <span className="font-semibold text-neutral-900">{shippingInfo.email || "your email"}</span>. Your customized sneakers are being prepped.
                  </p>
                  <button
                    id="success-continue-btn"
                    onClick={resetDrawer}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 px-6 text-sm font-bold text-white transition-all hover:bg-neutral-800"
                  >
                    CONTINUE SHOPPING
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              </div>
            ) : cartItems.length === 0 ? (
              <div id="cart-drawer-body" className="flex-1 overflow-y-auto p-6">
                {/* Empty Screen */}
                <div id="empty-cart-container" className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                    <ShoppingBag className="h-10 w-10 stroke-1" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-sm text-neutral-500 mb-8 max-w-xs">
                    Look through our high-performance exclusive collections to claim your first signature pair.
                  </p>
                  <button
                    id="empty-cart-shop-btn"
                    onClick={() => {
                      onClose();
                      if (onExploreExclusive) {
                        onExploreExclusive();
                      }
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-black py-3.5 px-6 text-xs font-bold text-white transition-all hover:bg-neutral-800 cursor-pointer"
                  >
                    EXPLORE DESIGNS
                  </button>
                </div>
              </div>
            ) : (
              /* Active Shopping Bag State: Form covers both Scrollable Body and Fixed Footer */
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div id="cart-drawer-body" className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Products List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 font-mono">SELECTED DESIGNS</span>
                    </div>
                    <div id="cart-items-list" className="space-y-4">
                      {cartItems.map((item) => (
                        <motion.div
                          id={`cart-item-${item.id}`}
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-4 rounded-xl border border-stone-200/60 bg-white p-4 shadow-xs"
                        >
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F7F7F5] border border-stone-100 flex items-center justify-center">
                            <img
                              src={item.shoe.image}
                              alt={item.shoe.name}
                              className="h-20 w-20 object-contain rotate-12 transition-transform hover:scale-110 rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-display text-sm font-black tracking-tight text-neutral-900 leading-tight">
                                  {item.shoe.name}
                                </h4>
                                <span className="font-mono text-sm font-extrabold text-[#718200]">
                                  ${item.shoe.price * item.quantity}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 font-mono mt-1">
                                {item.shoe.category}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-neutral-700">
                                <span className="inline-flex items-center gap-1 rounded bg-[#F7F7F5] px-2 py-0.5 border border-stone-200">
                                  Size: <strong className="text-stone-900">{item.selectedSize === 0 ? "O/S" : item.selectedSize}</strong>
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-[#F7F7F5] px-2 py-0.5 border border-stone-200">
                                  Col:{" "}
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${item.selectedColor.bgClass} inline-block border border-black/10`}
                                  />
                                  <strong className="text-stone-900">{item.selectedColor.name}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-1">
                                <button
                                  id={`decrease-qty-${item.id}`}
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-200/60 disabled:opacity-40"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-mono font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  id={`increase-qty-${item.id}`}
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-200/60"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                id={`remove-item-${item.id}`}
                                type="button"
                                onClick={() => onRemoveFromCart(item.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Checkout Fields Accordion directly under products list so they scroll naturally */}
                  <div className="border-t border-stone-250 pt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-3.5 w-3.5 text-neutral-600" />
                      <span className="text-xs font-display font-extrabold tracking-wider text-neutral-800 uppercase">
                        SECURE PRE-ORDER CHECKOUT
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                    />
                    <input
                      type="text"
                      placeholder="Full Delivery Address"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                    />
                    <input
                      type="text"
                      list="country-options"
                      placeholder="Country"
                      required
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                    />
                    <datalist id="country-options">
                      <option value="United States" />
                      <option value="United Kingdom" />
                      <option value="Canada" />
                      <option value="Australia" />
                      <option value="Germany" />
                      <option value="France" />
                      <option value="Japan" />
                      <option value="Singapore" />
                      <option value="Switzerland" />
                      <option value="Netherlands" />
                      <option value="Spain" />
                      <option value="Italy" />
                      <option value="Pakistan" />
                      <option value="India" />
                      <option value="Brazil" />
                      <option value="Saudi Arabia" />
                      <option value="United Arab Emirates" />
                    </datalist>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="col-span-2 rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        required
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                      />
                    </div>

                    {/* Cash on Delivery option toggle */}
                    <div
                      id="cod-option-toggle"
                      onClick={() => setIsCod(!isCod)}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer select-none transition-all ${
                        isCod
                          ? "border-black bg-neutral-950 text-white shadow-sm"
                          : "border-stone-200 bg-[#F7F7F5] hover:bg-stone-200/40 text-neutral-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="cod-checkbox"
                        checked={isCod}
                        onChange={(e) => setIsCod(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className={`h-4 w-4 rounded border-stone-300 text-black focus:ring-black cursor-pointer ${
                          isCod ? "accent-white bg-white border-white" : "accent-black"
                        }`}
                      />
                      <label htmlFor="cod-checkbox" className="text-xs font-bold cursor-pointer font-display leading-none">
                        Cash on Delivery (COD)
                      </label>
                    </div>

                    {/* Secure Bank Transfer Section (Only visible if COD is not selected) */}
                    <AnimatePresence initial={false}>
                      {!isCod && (
                        <motion.div
                          id="bank-billing-container"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2.5 border-t border-stone-200 pt-4 mt-2">
                            <span className="text-[10px] text-[#718200] font-mono font-bold uppercase tracking-widest">
                              SECURE BANK TRANSFER BILLING
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Bank Name"
                                required={!isCod}
                                value={shippingInfo.bankName}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, bankName: e.target.value })}
                                className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                              />
                              <input
                                type="text"
                                placeholder="Routing Number (9 digits)"
                                required={!isCod}
                                maxLength={9}
                                value={shippingInfo.routingNumber}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, routingNumber: e.target.value })}
                                className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-medium focus:border-black focus:bg-white focus:ring-0"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Bank Account Number"
                              required={!isCod}
                              value={shippingInfo.bankAccount}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, bankAccount: e.target.value })}
                              className="w-full rounded-lg border border-stone-200 bg-[#F7F7F5] px-3 py-2 text-xs font-mono font-medium focus:border-black focus:bg-white focus:ring-0"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div id="cart-drawer-footer" className="border-t border-stone-200 bg-white p-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs font-mono font-semibold text-stone-600 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vat / Local Sales Tax (8%)</span>
                      <span className="text-neutral-900">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Secure Dispatch Speed Shipping</span>
                      <span className="text-neutral-900">
                        {shipping === 0 ? (
                          <span className="text-[#718200] font-bold">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-neutral-900 font-display">
                      <span>ESTIMATED TOTAL DUE</span>
                      <span className="font-mono text-base font-extrabold text-[#718200]">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment CTA Submit Button */}
                  <button
                    id="submit-checkout-btn"
                    type="submit"
                    disabled={isCheckingOut}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 px-6 text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:bg-neutral-600 cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        PROCESSING SECURE GATEWAY...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-[#C8E600] animate-pulse" />
                        SUBMIT PRE-ORDER & DISPATCH
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
