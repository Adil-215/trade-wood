/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Star, Eye, ShoppingCart, Sparkles } from "lucide-react";
import { ColorOption, Shoe } from "../types";
import { accessoriesList } from "../data";

interface AccessoriesSectionProps {
  onAddToCart: (shoe: Shoe, color: ColorOption, size: number) => void;
  onOpenCart: () => void;
  onQuickView: (shoe: Shoe) => void;
}

export default function AccessoriesSection({
  onAddToCart,
  onOpenCart,
  onQuickView
}: AccessoriesSectionProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Maintain separate local color choice for each accessory card
  const [cardConfig, setCardConfig] = useState<Record<string, { color: ColorOption }>>(() => {
    const defaults: Record<string, { color: ColorOption }> = {};
    accessoriesList.forEach((acc) => {
      defaults[acc.id] = {
        color: acc.colors[0]
      };
    });
    return defaults;
  });

  const handleUpdateColor = (accId: string, color: ColorOption) => {
    setCardConfig((prev) => ({
      ...prev,
      [accId]: {
        color
      }
    }));
  };

  const handleAddCardToCart = (acc: Shoe) => {
    const config = cardConfig[acc.id] || { color: acc.colors[0] };
    // Accessories have size: 0 (Universal Size)
    onAddToCart(acc, config.color, 0);
  };

  return (
    <section
      id="accessories-sec"
      className="relative w-full px-6 md:px-12 py-24 bg-white border-t border-stone-200/60"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold tracking-widest text-[#718200] uppercase block">
              COMPLEMENT YOUR PACE
            </span>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-black tracking-tight text-neutral-900 uppercase md:text-5xl">
                ESSENTIAL ACCESSORIES
              </h2>
              <Sparkles className="h-6 w-6 text-[#718200] animate-pulse hidden md:block" />
            </div>
            <p className="text-zinc-500 text-xs md:text-sm font-sans max-w-lg leading-relaxed">
              Maintain speed, sustain finish, and keep your sneakers pristine. Explore elite cords, organic protective polishes, and custom beechwood restoration kits.
            </p>
          </div>
        </div>

        {/* Accessories Grid */}
        <div id="accessories-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessoriesList.map((acc) => {
            const currentConfig = cardConfig[acc.id] || { color: acc.colors[0] };
            const isHovered = hoveredCardId === acc.id;

            return (
              <motion.div
                key={acc.id}
                id={`accessory-card-${acc.id}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredCardId(acc.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group relative flex flex-col justify-between rounded-3xl border border-stone-200 bg-[#F7F7F5] p-5 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                {/* Header elements */}
                <div>
                  <div className="flex items-start justify-between">
                    {acc.isNew ? (
                      <span className="rounded-full bg-[#C8E600] text-black px-3 py-1 text-[8px] font-mono font-black tracking-widest uppercase border border-black/10">
                        LIMITED RUN
                      </span>
                    ) : acc.originalPrice ? (
                      <span className="rounded-full bg-stone-200 px-3 py-1 text-[8px] font-mono font-extrabold tracking-widest text-neutral-700 uppercase">
                        SPECIAL VALUE
                      </span>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-[#718200] bg-white px-2 py-0.5 rounded-md border border-stone-100">
                      <Star className="h-3 w-3 fill-current stroke-1.5" />
                      <span>{acc.rating}</span>
                    </div>
                  </div>

                  {/* Image Frame */}
                  <div
                    id={`acc-img-frame-${acc.id}`}
                    onClick={() => onQuickView(acc)}
                    className="relative h-64 w-full cursor-pointer flex items-center justify-center my-4 overflow-hidden rounded-3xl bg-[#F7F7F5] border border-stone-100/60 shadow-xs"
                  >
                    <img
                      src={acc.image}
                      alt={acc.name}
                      className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-108"
                      style={{
                        filter: acc.id === "acc-laces-volt" && currentConfig.color.name === "Obsidian Black"
                          ? "grayscale(100%) brightness(40%)"
                          : "none"
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Quickview Backdrop slide overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-full text-xs font-bold font-display tracking-widest uppercase">
                        <Eye className="h-3.5 w-3.5" />
                        Quick View
                      </div>
                    </div>
                  </div>

                  {/* Meta description titles section */}
                  <div className="mt-2 text-left">
                    <h3
                      onClick={() => onQuickView(acc)}
                      className="font-display text-lg font-black tracking-tight text-neutral-900 cursor-pointer hover:text-black uppercase leading-tight line-clamp-1"
                    >
                      {acc.name}
                    </h3>
                    <p className="text-[#718200] text-xs font-mono font-extrabold leading-none mt-1 mb-2">
                      {acc.tagline}
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed font-sans line-clamp-2 min-h-[2.5rem]">
                      {acc.description}
                    </p>
                  </div>
                </div>

                {/* Bottom actions configuration */}
                <div className="border-t border-stone-200/80 pt-4 mt-4 space-y-3">
                  {/* Swatch selections */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        Option:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {acc.colors.map((color) => {
                          const isActive = currentConfig.color.name === color.name;
                          return (
                            <button
                              key={color.name}
                              onClick={() => handleUpdateColor(acc.id, color)}
                              className={`h-4.5 w-4.5 rounded-full border transition-all cursor-pointer ${
                                isActive ? "scale-125 border-neutral-900 ring-2 ring-neutral-900/10" : "border-stone-300 hover:scale-110"
                              } ${color.bgClass}`}
                              title={color.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#718200] uppercase bg-[#EDF5D8] px-1.5 py-0.5 rounded">
                      ONE SIZE (O/S)
                    </span>
                  </div>

                  {/* Details Pricing and Cart Submit CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start leading-tight">
                      {acc.originalPrice && (
                        <span className="font-mono text-stone-400 text-[10px] line-through font-extrabold">
                          ${acc.originalPrice}
                        </span>
                      )}
                      <span className="font-mono text-base font-black text-neutral-900">
                        ${acc.price}
                      </span>
                    </div>

                    <button
                      id={`add-acc-to-cart-${acc.id}`}
                      onClick={() => handleAddCardToCart(acc)}
                      className="flex items-center gap-1.5 rounded-full bg-black hover:bg-[#C8E600] text-white hover:text-black hover:shadow-md py-2 px-4 text-xs font-bold font-display tracking-widest transition-all uppercase duration-200"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      ADD ITEM
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
