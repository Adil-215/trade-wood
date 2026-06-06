/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Star, Eye, ShoppingCart, SlidersHorizontal, CheckSquare, Sparkles } from "lucide-react";
import { ColorOption, Shoe } from "../types";
import { catalogList } from "../data";

interface ProductCatalogProps {
  onAddToCart: (shoe: Shoe, color: ColorOption, size: number) => void;
  onOpenCart: () => void;
  onQuickView: (shoe: Shoe) => void;
}

export default function ProductCatalog({
  onAddToCart,
  onOpenCart,
  onQuickView
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Maintain separate local size/color choices for each card key to make card interaction unique!
  const [cardConfig, setCardConfig] = useState<Record<string, { size: number; color: ColorOption }>>(() => {
    // Seed default selection details
    const defaults: Record<string, { size: number; color: ColorOption }> = {};
    catalogList.forEach((shoe) => {
      defaults[shoe.id] = {
        size: shoe.sizes[Math.floor(shoe.sizes.length / 2)],
        color: shoe.colors[0]
      };
    });
    return defaults;
  });

  const categories = ["All", "Athletic Running", "Street Performance", "Lifestyle Fashion"];

  const filteredShoes = selectedCategory === "All"
    ? catalogList
    : catalogList.filter((shoe) => shoe.category === selectedCategory);

  const handleUpdateCardColor = (shoeId: string, color: ColorOption) => {
    setCardConfig((prev) => ({
      ...prev,
      [shoeId]: {
        ...prev[shoeId],
        color
      }
    }));
  };

  const handleUpdateCardSize = (shoeId: string, size: number) => {
    setCardConfig((prev) => ({
      ...prev,
      [shoeId]: {
        ...prev[shoeId],
        size
      }
    }));
  };

  const handleAddCardToCart = (shoe: Shoe) => {
    const config = cardConfig[shoe.id] || { size: shoe.sizes[0], color: shoe.colors[0] };
    onAddToCart(shoe, config.color, config.size);
    onOpenCart();
  };

  return (
    <section
      id="catalog-sec"
      className="relative w-full px-6 md:px-12 py-24 bg-[#F7F7F5]" // Consistent base light bg
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold tracking-widest text-[#718200] uppercase block">
              AVAILABLE DESIGNS
            </span>
            <h2 className="font-display text-3xl font-black tracking-tight text-neutral-900 uppercase md:text-5xl">
              THE EXCLUSIVE SERIES
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm font-sans max-w-lg leading-relaxed">
              Explore custom editions optimized for speed responsive kinetics and high-fashion comfort aesthetics. Select colorways and size directly to fit your lifestyle.
            </p>
          </div>

          {/* Symmetrical Controls / Filters */}
          <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4.5 py-2 text-xs font-bold tracking-wider font-display transition-all capitalize border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-black text-white border-black shadow-xs"
                    : "bg-white text-stone-600 border-stone-200/90 hover:border-black hover:text-black"
                }`}
              >
                {cat === "All" ? "View All" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Shoes Catalog Grid Layout */}
        <div id="catalog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShoes.map((shoe) => {
            const currentConfig = cardConfig[shoe.id] || { size: shoe.sizes[0], color: shoe.colors[0] };
            const isHovered = hoveredCardId === shoe.id;

            return (
              <motion.div
                key={shoe.id}
                id={`shoe-card-${shoe.id}`}
                layout
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onMouseEnter={() => setHoveredCardId(shoe.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group relative flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-5 transition-all hover:shadow-xl hover:-translate-y-1.5 duration-300"
              >
                {/* Upper tags & elements */}
                <div className="flex items-start justify-between">
                  {shoe.isNew ? (
                    <span className="rounded-full bg-black px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-white uppercase shadow-xs">
                      NEW BATCH
                    </span>
                  ) : shoe.originalPrice ? (
                    <span className="rounded-full bg-[#EDF5D8] px-3 py-1 text-[9px] font-mono font-extrabold tracking-widest text-[#718200] uppercase border border-[#718200]/20">
                      SPECIAL PRICE
                    </span>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-[#718200] bg-[#EDF5D8]/40 px-2 py-0.5 rounded-md">
                    <Star className="h-3.5 w-3.5 fill-current stroke-1.5" />
                    <span>{shoe.rating}</span>
                  </div>
                </div>

                {/* Animated Interactive Product Shoe Image Frame */}
                <div
                  id={`img-frame-${shoe.id}`}
                  onClick={() => onQuickView(shoe)}
                  className="relative h-48 w-full cursor-pointer flex items-center justify-center my-4 overflow-hidden rounded-3xl bg-[#F7F7F5] border border-stone-100/60"
                >
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    className="w-full h-full object-cover transition-all duration-500 scale-95 group-hover:scale-105 drop-shadow-md rounded-3xl"
                    style={{
                      filter: `hue-rotate(${
                        currentConfig.color.name === "Neon Orange" || currentConfig.color.name === "Kinetic Orange" ? "120deg" :
                        currentConfig.color.name === "Obsidian Black" ? "210deg" :
                        currentConfig.color.name === "Pure White" || currentConfig.color.name === "Stealth Platinum" ? "290deg" : "0deg"
                      })`
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle hover Quickview prompt action */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="flex items-center gap-1.5 bg-black/85 text-white/95 text-[10px] font-mono font-bold tracking-widest px-3 p-1.5 rounded-full uppercase shadow-lg">
                      <Eye className="h-3.5 w-3.5" />
                      QUICK SPEC DETAILS
                    </span>
                  </div>
                </div>

                {/* Name, category, prices details */}
                <div className="mt-2 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    {shoe.category}
                  </span>
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-base font-black tracking-tight text-neutral-900 leading-tight">
                      {shoe.name}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-base font-black text-[#718200]">
                        ${shoe.price}
                      </span>
                      {shoe.originalPrice && (
                        <span className="font-mono text-[11px] text-zinc-400 line-through">
                          ${shoe.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed">
                    {shoe.description}
                  </p>
                </div>

                {/* Symmetrical Inline configurators inside card */}
                <div className="mt-5 pt-4.5 border-t border-stone-200/80 space-y-3.5">
                  {/* Color choose layout */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      CHOOSE TECH COLWAY
                    </span>
                    <div className="flex gap-1.5">
                      {shoe.colors.map((color) => (
                        <button
                          key={color.name}
                          id={`card-color-${shoe.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => handleUpdateCardColor(shoe.id, color)}
                          className={`h-4.5 w-4.5 rounded-full ${color.bgClass} border cursor-pointer ${
                            currentConfig.color.name === color.name
                              ? "ring-2 ring-black ring-offset-1 scale-110"
                              : "border-neutral-300 opacity-80 hover:opacity-100"
                          } transition-all`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size choose layout */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      CHOOSE FIT SIZE
                    </span>
                    <div className="flex gap-1">
                      {shoe.sizes.slice(0, 5).map((size) => (
                        <button
                          key={size}
                          id={`card-size-${shoe.id}-${size}`}
                          onClick={() => handleUpdateCardSize(shoe.id, size)}
                          className={`flex h-5.5 w-5.5 items-center justify-center rounded-sm font-mono text-[9px] font-bold border cursor-pointer transition-all ${
                            currentConfig.size === size
                              ? "bg-black text-white border-black scale-105 shadow-xs"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:border-black hover:text-black"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Bag trigger */}
                  <button
                    id={`add-to-bag-${shoe.id}`}
                    onClick={() => handleAddCardToCart(shoe)}
                    className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-black py-2.5 text-xs font-bold tracking-widest text-[#1a1a1a] uppercase bg-white hover:bg-black hover:text-[#C8E600] cursor-pointer transition-all"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    PRE-ORDER TO BAG
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
