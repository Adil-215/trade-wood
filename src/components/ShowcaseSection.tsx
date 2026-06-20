/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Zap, Target, Flame, ChevronRight, ShoppingBag, Eye } from "lucide-react";
import { Shoe, ColorOption } from "../types";
import { flagshipShoe, catalogList } from "../data";

interface ShowcaseSectionProps {
  onAddToCart: (shoe: Shoe, color: ColorOption, size: number) => void;
  onOpenCart: () => void;
  onQuickView: (shoe: Shoe) => void;
}

export default function ShowcaseSection({
  onAddToCart,
  onOpenCart,
  onQuickView
}: ShowcaseSectionProps) {
  // Let the user select between flagship items for a premium showpiece gallery
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);
  const [activeMetricTab, setActiveMetricTab] = useState<"performance" | "biomechanics" | "materials">("performance");
  const [userSelectedColor, setUserSelectedColor] = useState<ColorOption>(catalogList[0].colors[0]);

  const featuredShoes = catalogList;
  const currentShoe = featuredShoes[activeShowcaseIdx];

  // We automatically change current shoe color option when showcase changes
  const handleSelectShowcase = (idx: number) => {
    setActiveShowcaseIdx(idx);
    setUserSelectedColor(featuredShoes[idx].colors[0]);
  };

  const currentSize = currentShoe.sizes[Math.floor(currentShoe.sizes.length / 2)];

  const handleBuyNow = () => {
    onAddToCart(currentShoe, userSelectedColor, currentSize);
  };

  // Diagnostic or mechanical stats mock for the exclusive showcase
  const metrics = {
    performance: [
      { name: "Propulsion Velocity Rate", val: "9.8 m/s²", pct: 98, label: "Unlocks maximum flight velocity" },
      { name: "Responsive Energy Transfer", val: "+24%", pct: 92, label: "Reduces muscle fatigue by over 18%" },
      { name: "Outsole Wear Lifespan", val: "800+ mi", pct: 88, label: "Military-grade compound endurance" }
    ],
    biomechanics: [
      { name: "Toe Pronation Buffer", val: "0.04 mm", pct: 95, label: "Stabilizes alignment dynamically" },
      { name: "Impact Shock Dissipation", val: "94.2%", pct: 94, label: "Double-density Aero Foam dampening" },
      { name: "Dynamic Center of Mass Offset", val: "3.2°", pct: 86, label: "Pre-angled athletic forward tilt" }
    ],
    materials: [
      { name: "Flyknit Tensile Resilience", val: "420N", pct: 91, label: "Rip-resistant high tenacity fibers" },
      { name: "Carbon Fiber Base Thickness", val: "1.8mm", pct: 89, label: "Rigid matrix with ultra-low weight" },
      { name: "Recycled Eco Compounds", val: "38%", pct: 76, label: "Sustainable marine plastic blends" }
    ]
  };

  return (
    <section
      id="showcase-sec"
      className="relative w-full px-6 md:px-12 py-24 bg-[#F7F7F5]"
    >
      {/* Decorative vertical divider line segment */}
      <div className="absolute top-0 left-12 w-[1px] h-32 bg-stone-200 hidden md:block" />

      <div className="mx-auto max-w-7xl">
        {/* Header Block with asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-xs font-bold tracking-widest text-[#718200] uppercase block">
              PREMIUM HIGHLIGHTS
            </span>
            <h2 className="font-display text-4xl font-black tracking-tight text-neutral-900 uppercase sm:text-5xl leading-none">
              SHOWCASE CHAMPIONS
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-lg leading-relaxed font-sans">
              An immersive showcase of our absolute finest, state-of-the-art laboratory releases. Rotate through elite designs, inspect live mechanical metrics, and pre-order next-gen shoes today.
            </p>
          </div>

          {/* Quick selection tabs (Symmetrical design) */}
          <div className="lg:col-span-5 flex flex-wrap gap-2 lg:justify-end">
            {featuredShoes.map((shoe, idx) => (
              <button
                key={shoe.id}
                id={`showcase-tab-${shoe.id}`}
                onClick={() => handleSelectShowcase(idx)}
                className={`rounded-xl px-4 py-3 text-left transition-all border outline-hidden flex items-center gap-3 cursor-pointer group/tab ${
                  activeShowcaseIdx === idx
                    ? "bg-white border-black shadow-md scale-102"
                    : "bg-white/40 border-stone-200 hover:border-black/50"
                }`}
              >
                <div className="h-8 w-8 rounded-lg bg-[#F7F7F5] border border-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    className="h-7 w-7 object-contain rounded-md transition-transform duration-300 group-hover/tab:scale-115"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-display text-[10px] font-black tracking-wider text-stone-900 uppercase leading-none">
                    {shoe.name.replace("StepX ", "")}
                  </h4>
                  <span className="font-mono text-[9px] text-[#718200] font-extrabold">
                    ${shoe.price} USD
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Showcase Core Interactive Split Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Left Block (col-span-5): Aesthetic Tech Card & Interactive Customizer */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[#C8E600]">
                  <Sparkles className="h-3 w-3" />
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#718200] uppercase">
                  EXCLUSIVE SPECS
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-neutral-900 uppercase tracking-tight">
                  {currentShoe.name}
                </h3>
                <p className="font-mono text-xs font-bold text-[#718200] uppercase tracking-wider">
                  &ldquo;{currentShoe.tagline}&rdquo;
                </p>
                <p className="text-zinc-500 text-xs md:text-sm font-sans leading-relaxed pt-1">
                  {currentShoe.description}
                </p>
              </div>

              {/* Specific highlights list */}
              <div className="space-y-2.5 pt-4 border-t border-stone-100">
                <span className="block text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase">
                  INTEGRATED LAB CONCEPTS:
                </span>
                {currentShoe.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-semibold text-neutral-800 font-sans">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#C8E600]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Config & Buy now actions */}
            <div className="space-y-5 mt-8 pt-6 border-t border-stone-100">
              {/* Colorway simulation */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Select Design Shade:
                </span>
                <div className="flex gap-1.5">
                  {currentShoe.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setUserSelectedColor(color)}
                      className={`h-5 w-5 rounded-full ${color.bgClass} border cursor-pointer ${
                        userSelectedColor.name === color.name
                          ? "ring-2 ring-black ring-offset-2 scale-110"
                          : "border-neutral-200 opacity-80 hover:opacity-100"
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>

              {/* Primary active button triggers */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="showcase-buy-btn"
                  onClick={handleBuyNow}
                  className="flex-1 group flex items-center justify-center gap-2.5 rounded-full bg-black py-4 px-6 text-xs font-bold tracking-widest text-white uppercase shadow-lg hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 text-[#C8E600]" />
                  Pre-order Showcase Bag
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  id="showcase-view-btn"
                  onClick={() => onQuickView(currentShoe)}
                  className="rounded-full border border-stone-200 bg-stone-50 hover:bg-black hover:text-white hover:border-black px-6 py-4 text-xs font-bold tracking-widest text-neutral-700 uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Full Specs
                </button>
              </div>
            </div>
          </div>

          {/* Center Block (col-span-4): Dynamic Immersive Spotlight Display */}
          <div className="lg:col-span-4 relative flex flex-col justify-center items-center bg-[#EDF5D8] rounded-3xl overflow-hidden border border-[#C8E600]/30 p-8 text-center min-h-[400px] group/showcase-card">
            {/* Ambient decorative grid behind shoe */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none" style={{ backgroundImage: `radial-gradient(#111827 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
            
            {/* Visual spotlight backdrop glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-[#C8E600]/30 blur-3xl" />

            {/* Floating spotlight showcase item */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentShoe.id}-${userSelectedColor.name}`}
                initial={{ opacity: 0, scale: 0.8, rotate: 0, y: 15 }}
                animate={{ opacity: 1, scale: 1.02, rotate: 0, y: -5 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 0, y: -15 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                className="relative z-10 flex items-center justify-center h-full w-full select-none"
              >
                <img
                  src={currentShoe.image}
                  alt={currentShoe.name}
                  className="w-9/12 sm:w-11/12 max-h-56 sm:max-h-none h-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)] rounded-3xl mix-blend-multiply transition-transform duration-500 group-hover/showcase-card:scale-110"
                  style={{
                    filter: `hue-rotate(${
                      userSelectedColor.name === "Neon Orange" || userSelectedColor.name === "Kinetic Orange" ? "120deg" :
                      userSelectedColor.name === "Obsidian Black" ? "210deg" :
                      userSelectedColor.name === "Pure White" || userSelectedColor.name === "Stealth Platinum" ? "290deg" : "0deg"
                    })`
                  }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Decorative lab coordinate badges */}
            <div className="absolute top-4 left-4 z-20 font-mono text-[9px] font-bold text-[#718200] tracking-wider uppercase bg-white/95 backdrop-blur-md py-1 px-2.5 rounded-lg border border-[#C8E600]/30 shadow-md">
              LAB GRID: TW-#{activeShowcaseIdx + 1}
            </div>

            <div className="absolute bottom-4 right-4 z-20 font-mono text-[9px] font-bold text-neutral-800 tracking-wider uppercase bg-white/95 backdrop-blur-md py-1 px-3 rounded-lg border border-[#C8E600]/30 flex items-center gap-1 shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#718200] animate-pulse" />
              <span>SPOTLIGHT STATUS: READY</span>
            </div>
          </div>

          {/* Right Block (col-span-3): Live Diagnostic Telemetry & Performance Matrix */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-stone-900 text-stone-300 rounded-3xl p-6 border border-zinc-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#C8E600] uppercase">
                  LIVE TELEMETRY
                </span>
                <span className="h-2 w-2 rounded-full bg-[#C8E600] ring-4 ring-[#C8E600]/20 animate-pulse" />
              </div>

              {/* Interactive Telemetry Sub-tabs */}
              <div className="grid grid-cols-3 gap-1 bg-neutral-800/80 p-1 rounded-lg text-[9px] font-mono tracking-wider font-bold">
                {(["performance", "biomechanics", "materials"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveMetricTab(tab)}
                    className={`py-1.5 rounded-md uppercase transition-colors text-center cursor-pointer ${
                      activeMetricTab === tab
                        ? "bg-stone-900 text-[#C8E600]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {tab.substring(0, 4)}
                  </button>
                ))}
              </div>

              {/* Diagnostic Progress bars */}
              <div className="space-y-5 pt-2">
                {metrics[activeMetricTab].map((metric, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold">
                      <span className="text-zinc-400 truncate max-w-[140px]">{metric.name}</span>
                      <strong className="text-white">{metric.val}</strong>
                    </div>

                    <div className="relative w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="bg-[#C8E600] h-full rounded-full"
                      />
                    </div>
                    <span className="block text-[9px] text-zinc-500 font-sans leading-normal">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro warning indicator */}
            <div className="mt-8 pt-4.5 border-t border-neutral-800 text-[9px] font-mono text-zinc-500 uppercase leading-relaxed text-center">
              ⚠️ PRE-ORDER SLOTS LIMITED TO MAXIMUM 50 UNITS PER ATHLETE ID COHORT.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
