/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, ShoppingBag, Check, ShieldCheck, RefreshCw } from "lucide-react";
import { ColorOption, Shoe } from "../types";

interface ProductQuickViewModalProps {
  shoe: Shoe | null;
  onClose: () => void;
  onAddToCart: (shoe: Shoe, color: ColorOption, size: number) => void;
  onOpenCart: () => void;
}

export default function ProductQuickViewModal({
  shoe,
  onClose,
  onAddToCart,
  onOpenCart
}: ProductQuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  // Sync state whenever active shoe changes
  useEffect(() => {
    if (shoe) {
      setSelectedColor(shoe.colors[0]);
      setSelectedSize(shoe.sizes[Math.floor(shoe.sizes.length / 2)]);
    }
  }, [shoe]);

  if (!shoe || !selectedColor || selectedSize === null || selectedSize === undefined) return null;

  const handleAddToBag = () => {
    onAddToCart(shoe, selectedColor, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      <div id="quickview-modal-container" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        {/* Backdrop clickable zone */}
        <div id="quickview-backdrop" className="absolute inset-0" onClick={onClose} />

        <motion.div
          id="quickview-modal-box"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#F7F7F5] overflow-hidden shadow-2xl border border-stone-200 z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close trigger button */}
          <button
            id="close-quickview-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-600 border border-stone-200 hover:bg-black hover:text-white shadow-xs"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Left Panel: Big product preview and color simulation */}
          <div className="bg-white p-6 flex flex-col justify-center items-center relative min-h-64 border-b md:border-b-0 md:border-r border-stone-200">
            {/* Tagline */}
            <span className="absolute top-4 left-4 z-20 font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest bg-white/90 backdrop-blur-md border border-stone-200 px-2.5 py-1 rounded shadow-xs">
              {shoe.category}
            </span>

            <motion.div
              key={selectedColor.name}
              initial={{ rotate: shoe.category === "Accessories" ? 0 : 15, scale: 0.9, opacity: 0 }}
              animate={{ rotate: shoe.category === "Accessories" ? -3 : 12, scale: shoe.category === "Accessories" ? 1.2 : 1.05, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="flex items-center justify-center w-full h-full p-4"
            >
              <img
                src={shoe.image}
                alt={shoe.name}
                className="w-full max-h-64 object-contain transition-transform duration-300 rounded-2xl"
                style={{
                  filter: shoe.category === "Accessories"
                    ? (shoe.id === "acc-laces-volt" && selectedColor.name === "Obsidian Black"
                      ? "grayscale(100%) brightness(40%)"
                      : "none")
                    : `hue-rotate(${
                      selectedColor.name === "Volt Blue" ? "200deg" :
                      selectedColor.name === "Deep Maroon" ? "340deg" :
                      selectedColor.name === "Neon Orange" ? "120deg" :
                      selectedColor.name === "Obsidian Black" || selectedColor.name === "Forest Green" ? "210deg" :
                      selectedColor.name === "Pure White" || selectedColor.name === "Stealth Platinum" ? "290deg" : "0deg"
                    })`
                }}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Faint specifications pill */}
            <div className="mt-4 flex items-center gap-1 text-[10px] font-mono font-bold text-[#718200] bg-[#EDF5D8] px-3 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{shoe.rating} Rating ({shoe.reviewsCount} Votes)</span>
            </div>
          </div>

          {/* Right Panel: Config and Description details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              <h3 className="font-display text-xl font-black text-neutral-900 uppercase">
                {shoe.name}
              </h3>
              <p className="font-mono text-xs font-bold text-[#718200] tracking-wider uppercase mt-1">
                {shoe.tagline}
              </p>
              
              <div className="flex items-baseline gap-2 mt-3">
                <span className="font-mono text-xl font-extrabold text-neutral-900">
                  PKR {shoe.price}.00
                </span>
                {shoe.originalPrice && (
                  <span className="font-mono text-xs text-stone-400 line-through">
                    PKR {shoe.originalPrice}.00
                  </span>
                )}
              </div>

              <p className="text-zinc-600 text-xs font-sans mt-3.5 leading-relaxed">
                {shoe.description}
              </p>

              {/* Dynamic specifications list */}
              <div className="mt-4.5 space-y-1.5 border-t border-stone-200/80 pt-4">
                <span className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1.5">
                  CORE SPECIFICATIONS:
                </span>
                {shoe.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-sans font-semibold text-neutral-700">
                    <Check className="h-3.5 w-3.5 text-[#718200]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customizer and Submit CTA */}
            <div className="space-y-4 border-t border-stone-200/80 pt-4.5">
              {/* Color selectors */}
              {shoe.colors.length > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                    COLORWAY: <strong className="text-stone-900">{selectedColor.name}</strong>
                  </span>
                  <div className="flex gap-1.5">
                    {shoe.colors.map((color) => (
                      <button
                        key={color.name}
                        id={`quick-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedColor(color)}
                        className={`h-4.5 w-4.5 rounded-full ${color.bgClass} border cursor-pointer ${
                          selectedColor.name === color.name
                            ? "ring-2 ring-black ring-offset-1 scale-110"
                            : "border-neutral-300 opacity-85 hover:opacity-100"
                        } transition-all`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selectors grid */}
              <div>
                <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-2">
                  FIT SIZE VAL: <strong className="text-stone-900">{selectedSize === 0 ? "One Size (O/S)" : `${selectedSize} US`}</strong>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {shoe.sizes.map((size) => (
                    <button
                      key={size}
                      id={`quick-size-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-7 w-8.5 items-center justify-center rounded-md font-mono text-[10px] font-bold border cursor-pointer transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black scale-105"
                          : "bg-white text-stone-700 border-stone-200 hover:border-black hover:text-black"
                      }`}
                    >
                      {size === 0 ? "O/S" : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Add CTA */}
              <button
                id="quick-add-to-cart"
                onClick={handleAddToBag}
                className="w-full flex items-center justify-center gap-3 rounded-full bg-black py-3.5 px-6 text-xs font-bold tracking-widest text-white uppercase hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#C8E600]" />
                ADD SELECTION TO BAG
              </button>

              {/* Brand confidence tags */}
              <div className="grid grid-cols-2 gap-2 text-[8px] font-mono text-zinc-400 text-center uppercase">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#718200]" />
                  <span>PRE-ORDER DISPATCH ENVELOPE</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RefreshCw className="h-3 w-3 text-[#718200]" />
                  <span>30 DAY LIFETIME RETURN</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
