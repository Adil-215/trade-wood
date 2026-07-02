/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ShoppingBag, Stars, RotateCcw } from "lucide-react";
import { flagshipShoe } from "../data";
import { ColorOption, Shoe } from "../types";

interface HeroSectionProps {
  onAddToCart: (shoe: Shoe, color: ColorOption, size: number) => void;
  onOpenCart: () => void;
}

export default function HeroSection({ onAddToCart, onOpenCart }: HeroSectionProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(flagshipShoe.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number>(9.5);
  const [isHovered, setIsHovered] = useState(false);

  const handlePreOrder = () => {
    // Add custom selection to cart
    onAddToCart(flagshipShoe, selectedColor, selectedSize);
  };

  return (
    <section
      id="hero-sec"
      className="relative min-h-[calc(100vh-6rem)] w-full overflow-hidden px-6 md:px-12 py-6 md:py-10"
      style={{ backgroundColor: "#F7F7F5" }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Column Content */}
        <div id="hero-left-content" className="flex flex-col justify-center space-y-8 order-2 lg:order-1">
          {/* Subtle tag */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-[#718200] uppercase">
              HIGH-PERFORMANCE VELOCITY RUNNER
            </span>
          </div>

          {/* Heading */}
          <div className="relative">
            <h1 className="font-display text-5xl font-black tracking-tight text-neutral-900 sm:text-6xl md:text-7xl leading-[1.05]">
              Best In Style{" "}
              <span className="block text-neutral-950 font-black">
                Collection
              </span>{" "}
              For You
            </h1>
          </div>

          {/* Subtitle instructions */}
          <div id="hero-experience" className="text-zinc-500 max-w-md font-sans text-xs md:text-sm leading-relaxed space-y-1">
            <p>We craft the, we wont say the best,</p>
            <p>But through 70 years of experience in the industry</p>
          </div>

          {/* Color & Size Customizer (adds high interactivity to hero section) */}
          <div id="hero-customizer" className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-stone-200 max-w-md space-y-4">
            {flagshipShoe.colors.length > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase">
                  Colorway: <span className="text-stone-900 font-bold">{selectedColor.name}</span>
                </span>
                <div className="flex gap-2">
                  {flagshipShoe.colors.map((color) => (
                    <button
                      key={color.name}
                      id={`hero-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedColor(color)}
                      className={`h-5 w-5 rounded-full ${color.bgClass} border cursor-pointer ${
                        selectedColor.name === color.name
                          ? "ring-2 ring-black ring-offset-2 scale-110"
                          : "border-neutral-300 opacity-80 hover:opacity-100"
                      } transition-all`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
              <span className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase">
                Select Size: <span className="text-stone-900 font-bold">{selectedSize} US</span>
              </span>
              <div className="flex gap-1.5 overflow-x-auto max-w-[240px] scrollbar-none py-1">
                {[8, 9, 9.5, 10, 11].map((size) => (
                  <button
                    key={size}
                    id={`hero-size-${size}`}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-[11px] font-bold border transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black scale-105"
                        : "bg-white text-stone-700 border-stone-200 hover:border-neutral-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs and indicators */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            <button
              id="hero-preorder-btn"
              onClick={handlePreOrder}
              className="group relative flex items-center justify-center gap-3.5 rounded-full bg-black py-4.5 px-9 text-xs font-bold tracking-widest text-white uppercase shadow-lg hover:bg-neutral-800 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              Pre-order Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Custom interactive "Specs Showcase" trigger */}
            <div id="hero-foot-tech" className="flex items-center gap-3 border-l-3 border-[#C8E600] pl-4 py-1">
              <div className="font-mono text-[10px] tracking-wider text-stone-400 font-semibold uppercase">
                Toe Comfort
                <span className="block text-xs font-display font-black tracking-tight text-neutral-900 uppercase">
                  Fast Running
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Dynamic Angled Shoe Visual */}
        <div id="hero-right-visual" className="relative flex items-center justify-center order-1 lg:order-2 w-full min-h-[320px] sm:min-h-[420px] -mt-8 sm:-mt-12 lg:-mt-16 lg:-top-8">
          <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
            {/* Main Large Dashed Circle Frame */}
            <svg className="absolute inset-0 h-full w-full animate-[spin_200s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#6b7280"
                strokeWidth="0.25"
                strokeDasharray="2, 3"
              />
              {/* Point Nodes */}
              <circle cx="50" cy="5" r="1.5" fill="#111827" stroke="white" strokeWidth="0.5" />
              <circle cx="95" cy="50" r="1.5" fill="#111827" stroke="white" strokeWidth="0.5" />
              <circle cx="50" cy="95" r="1.5" fill="#111827" stroke="white" strokeWidth="0.5" />
              <circle cx="5" cy="50" r="1.5" fill="#111827" stroke="white" strokeWidth="0.5" />
              
              <circle cx="82" cy="18" r="1" fill="#6b7280" />
              <circle cx="82" cy="82" r="1" fill="#6b7280" />
              <circle cx="18" cy="82" r="1" fill="#6b7280" />
              <circle cx="18" cy="18" r="1" fill="#6b7280" />
            </svg>

            {/* Soft decorative ambient color blob behind the shoe for high-end look without a structural container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] -z-10 rounded-full bg-[#EDF5D8]/60 blur-[80px] opacity-70 pointer-events-none" />

            {/* Faint electric sparks graphic as background decoration */}
            <div className="absolute right-4 bottom-12 opacity-30 select-none">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2L4 20H18L10 38L30 16H16L24 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Floating Shoe Image - Natural css/motion hovering animation */}
            <motion.div
              id="hero-floating-shoe-wrapper"
              animate={{
                y: [0, -15, 0],
                rotate: [23, 21, 23]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative z-10 w-full flex items-center justify-center cursor-pointer bg-transparent"
              style={{ backgroundColor: "transparent" }}
            >
              <img
                src={flagshipShoe.image}
                alt={flagshipShoe.name}
                className="w-[90%] sm:w-[94%] max-h-[220px] sm:max-h-[280px] lg:max-h-[340px] w-auto h-auto object-contain transition-transform duration-500 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] bg-transparent mix-blend-multiply rounded-[2rem] md:rounded-[2.5rem]"
                style={{
                  backgroundColor: "transparent",
                  transform: isHovered ? "scaleX(-1.04) scaleY(1.04)" : "scaleX(-1)",
                  filter: `hue-rotate(${
                    selectedColor.name === "Volt Blue" ? "200deg" :
                    selectedColor.name === "Deep Maroon" ? "340deg" :
                    selectedColor.name === "Neon Orange" ? "120deg" :
                    selectedColor.name === "Obsidian Black" || selectedColor.name === "Forest Green" ? "210deg" :
                    selectedColor.name === "Pure White" ? "290deg" : "0deg"
                  })`
                }}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Daily Workout 58% callout */}
            <motion.div
              id="hero-metric-callout"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-2 -right-4 sm:bottom-6 sm:right-0 z-20 flex flex-col items-start rounded-xl border border-stone-200/50 bg-white/90 backdrop-blur-md p-4 shadow-lg w-38"
            >
              <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                Daily Workout
              </span>
              <span className="font-display text-2xl font-black text-neutral-900 flex items-baseline">
                58%
                <span className="text-[10px] font-mono text-stone-500 font-normal ml-1">completed</span>
              </span>
              
              {/* Mini pin track graph */}
              <div className="mt-3 flex w-full items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-stone-100 overflow-hidden">
                  <div className="bg-[#C8E600] h-full" style={{ width: "58%" }} />
                </div>
                <div className="h-2 w-2 rounded-full bg-[#C8E600] border-2 border-white ring-2 ring-[#C8E600]/30 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
