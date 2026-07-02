/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Star, ShoppingBag, Shield, Truck, RotateCcw, 
  Sparkles, Check, Info, ZoomIn, Footprints, MessageSquare, Heart 
} from "lucide-react";
import { Shoe, ColorOption } from "../types";
import { airluxeShoe } from "../data";

interface NewArrivalsProps {
  onAddToCart: (shoe: Shoe, color: ColorOption, size: number) => void;
  onOpenCart: () => void;
  onBackToHome: () => void;
}

export default function NewArrivals({ onAddToCart, onOpenCart, onBackToHome }: NewArrivalsProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(airluxeShoe.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(9.5);
  const [fitPreference, setFitPreference] = useState<"performance" | "standard" | "relaxed">("standard");
  const [activeTab, setActiveTab] = useState<"details" | "technology" | "reviews">("details");
  const [zoomedImage, setZoomedImage] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Suggested size advisor calculation
  const getSuggestedSize = () => {
    const base = 9.5;
    if (fitPreference === "performance") return base;
    if (fitPreference === "relaxed") return base + 0.5;
    return base;
  };

  const currentSuggested = getSuggestedSize();

  const handleAddToCartClick = () => {
    if (!selectedSize) return;
    onAddToCart(airluxeShoe, selectedColor, selectedSize);
    setCartSuccess(true);
    setTimeout(() => {
      setCartSuccess(false);
    }, 2000);
  };

  const reviews = [
    {
      id: 1,
      author: "Marcus Vance",
      avatar: "MV",
      rating: 5,
      role: "Marathon Competitor",
      date: "2 Days Ago",
      text: "The combination of the carbon plate with the heel Air bag is absolute sorcery! It provides a soft drop that immediately rolls forwards into an explosive spring. Shaved 22 seconds off my 5K test loop on day one."
    },
    {
      id: 2,
      author: "Elena Rostova",
      avatar: "ER",
      rating: 5,
      role: "Triathlete & Coach",
      date: "1 Week Ago",
      text: "The leather detailing is phenomenal—looks like high fashion but performs on the absolute elite level. True to size for race compression, but go half a size up for everyday runs."
    }
  ];

  return (
    <motion.div
      id="new-arrivals-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#F7F7F5] min-h-screen pt-8 pb-20 px-6 md:px-12 selection:bg-black selection:text-[#C8E600]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          <div className="flex items-center gap-2">
            <button
              id="new-back-breadcrumb"
              onClick={onBackToHome}
              className="hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3 w-3" /> HOME
            </button>
            <span>/</span>
            <span className="text-black">EXCLUSIVE NEW RELEASE</span>
          </div>
          
          <span className="flex items-center gap-1 text-[#718200] bg-[#EDF5D8] px-2.5 py-0.5 rounded-full text-[10px]">
            <Sparkles className="h-3 w-3 animate-pulse" /> LIMITED DROPS
          </span>
        </div>

        {/* Prime Split-Screen Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Breathtaking Product Portal */}
          <div className="lg:col-span-7 space-y-6">
            <div 
              id="new-arrival-hero-card"
              className="relative overflow-hidden rounded-[48px] bg-white border border-stone-200/85 p-8 md:p-12 shadow-sm flex flex-col items-center justify-center min-h-[420px] md:min-h-[520px] group transition-all"
            >
              {/* Product Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-[#718200] uppercase bg-[#EDF5D8] border border-[#dce9be] px-2 py-0.5 rounded">
                  ★ NEW ARRIVAL
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-black uppercase bg-[#C8E600] px-2 py-0.5 rounded">
                  AIRLUXE KINETIC
                </span>
              </div>

              {/* Like / Wishlist Heart Icon */}
              <button
                id="wishlist-toggle"
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-6 right-6 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-stone-50 border border-stone-200 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <Heart className={`h-4.5 w-4.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </button>

              {/* Main Shoe Spotlight Imagery with dynamic zoom */}
              <motion.div
                animate={{ scale: zoomedImage ? 1.15 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg cursor-zoom-in relative select-none"
                onClick={() => setZoomedImage(!zoomedImage)}
              >
                <img
                  src={airluxeShoe.image}
                  alt={airluxeShoe.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain transform transition-transform duration-500 hover:scale-105 filter drop-shadow-2xl rounded-3xl"
                />
              </motion.div>

              {/* Dynamic instruction notice */}
              <div className="absolute bottom-6 font-mono text-[9px] tracking-wider text-stone-400 flex items-center gap-1.5 uppercase">
                <ZoomIn className="h-3 w-3" /> Click image to trigger precise focus zoom
              </div>
            </div>

            {/* Quick Symmetrical Color Thumbnails & Details */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[10px] font-extrabold text-stone-800 uppercase">HEEL AIR UNIT</span>
                <span className="text-stone-500 font-sans text-xs mt-1">Multi-chamber pressure cushion</span>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[10px] font-extrabold text-stone-800 uppercase">PROPULSION PLATE</span>
                <span className="text-stone-500 font-sans text-xs mt-1">Tensioned custom carbon plate</span>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[10px] font-extrabold text-[#718200] uppercase">LAUNCH METRICS</span>
                <span className="text-stone-500 font-sans text-xs mt-1">Speed gains measured up to 4.2%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Customizer Panel */}
          <div className="lg:col-span-5 space-y-8 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs">
            {/* Header info */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-[#718200] uppercase">
                {airluxeShoe.category}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 uppercase">
                {airluxeShoe.name}
              </h2>
              <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                {airluxeShoe.tagline}
              </p>

              {/* Standard Rating Stars */}
              <div className="flex items-center gap-1 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-[#C8E600] text-[#C8E600]" />
                ))}
                <span className="ml-2 pt-0.5 text-xs font-mono font-bold text-neutral-800">
                  5.0 PERFECT RATIO • {airluxeShoe.reviewsCount} LAB RUNS
                </span>
              </div>

              {/* Pricing Blocks */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-display text-4xl font-extrabold text-neutral-900">
                  PKR {airluxeShoe.price}
                </span>
                {airluxeShoe.originalPrice && (
                  <span className="font-display text-lg text-neutral-400 line-through">
                    PKR {airluxeShoe.originalPrice}
                  </span>
                )}
                <span className="ml-1 text-[10px] font-mono text-[#718200] bg-[#EDF5D8] px-2 py-0.5 rounded uppercase font-bold">
                  Pre-ordered 15% discount
                </span>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Customizer Option 1: Design Color Overlay */}
            {airluxeShoe.colors.length > 1 && (
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold text-neutral-600 uppercase tracking-wider">
                  Select Edition Overlay: <span className="text-black font-extrabold">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {airluxeShoe.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`h-9 w-9 rounded-full relative cursor-pointer border flex items-center justify-center ${
                          isSelected ? "border-black scale-108 ring-2 ring-stone-100" : "border-stone-200"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && <Check className="h-4 w-4 text-neutral-800 mix-blend-difference" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizing Section with Smart Advisor */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-neutral-600">
                <span>Select Performance Size:</span>
                <span className="text-[#718200]">US Athlete standard</span>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-4 gap-2">
                {airluxeShoe.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const isSuggested = currentSuggested === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative py-3.5 rounded-xl border text-center font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                        isSelected
                          ? "bg-black border-black text-white"
                          : "bg-white border-stone-200 hover:border-black text-neutral-800"
                      }`}
                    >
                      {size}
                      {/* Highlight the smart suggested size in selection */}
                      {isSuggested && !isSelected && (
                        <div className="absolute -top-[5px] -right-[5px] h-2 w-2 rounded-full bg-[#718200] animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Smart Sizing Fit Advisor UI */}
              <div className="bg-[#EDF5D8]/45 border border-[#dce9be]/80 rounded-2xl p-4.5 space-y-3">
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold tracking-wider text-[#718200] uppercase">
                  <Footprints className="h-4 w-4" /> Custom Fit Sizing Assistant
                </span>
                <p className="text-stone-600 text-xs font-medium leading-relaxed">
                  StepX's dual-weave structure adjusts based on how you lock the laces. Set your custom lifestyle fit preference:
                </p>
                <div className="flex gap-2 font-mono text-[9px] font-bold uppercase">
                  <button
                    onClick={() => {
                      setFitPreference("performance");
                      setSelectedSize(9.5);
                    }}
                    className={`flex-1 rounded-lg py-1.5 border transition-all text-center cursor-pointer ${
                      fitPreference === "performance"
                        ? "bg-stone-900 border-stone-900 text-white"
                        : "bg-white border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    Performance (9.5)
                  </button>
                  <button
                    onClick={() => {
                      setFitPreference("standard");
                      setSelectedSize(9.5);
                    }}
                    className={`flex-1 rounded-lg py-1.5 border transition-all text-center cursor-pointer ${
                      fitPreference === "standard"
                        ? "bg-stone-900 border-stone-900 text-white"
                        : "bg-white border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    Standard (9.5)
                  </button>
                  <button
                    onClick={() => {
                      setFitPreference("relaxed");
                      setSelectedSize(10);
                    }}
                    className={`flex-1 rounded-lg py-1.5 border transition-all text-center cursor-pointer ${
                      fitPreference === "relaxed"
                        ? "bg-stone-900 border-stone-900 text-white"
                        : "bg-white border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    Relaxed (10.0)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick checkout & Action trigger buttons */}
            <div className="space-y-3 pt-3">
              <button
                id="new-add-to-cart-btn"
                onClick={handleAddToCartClick}
                disabled={!selectedSize}
                className="w-full bg-[#C8E600] text-black hover:bg-neutral-950 hover:text-white transition-all rounded-full py-4.5 px-6 font-display text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {cartSuccess ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-black" />
                    DISPATCH ADDED SUCCESSFULLY!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4.5 w-4.5" />
                    SECURE EXCLUSIVE RELEASE DRIP • PKR {airluxeShoe.price}
                  </>
                )}
              </button>

              <button
                id="new-open-cart-quick"
                onClick={onOpenCart}
                className="w-full bg-white text-neutral-800 border border-stone-250 hover:border-neutral-800 transition-all rounded-full py-3 px-6 font-mono text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                VIEW ATHLETE BAG
              </button>
            </div>

            {/* Shipping notes segment */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest pl-1">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#718200]" /> Eco-Labs Free Shipping
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-[#718200]" /> 30-Day Speed Refund
              </div>
            </div>
          </div>
        </div>

        {/* Tab-driven Design Story, Technical Breakdowns, and Reviews */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs">
          
          {/* Tab buttons */}
          <div className="border-b border-stone-100 pb-4 flex gap-6 font-mono text-xs font-semibold uppercase tracking-wider" id="new-tab-headers">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-1 cursor-pointer transition-all ${
                activeTab === "details" ? "text-[#718200] border-b-2 border-[#718200] font-bold" : "text-neutral-400 hover:text-neutral-800 center"
              }`}
            >
              The Design Story
            </button>
            <button
              onClick={() => setActiveTab("technology")}
              className={`pb-1 cursor-pointer transition-all ${
                activeTab === "technology" ? "text-[#718200] border-b-2 border-[#718200] font-bold" : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              Cushioning Biomechanics
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-1 cursor-pointer transition-all ${
                activeTab === "reviews" ? "text-[#718200] border-b-2 border-[#718200] font-bold" : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              Competitive Feedback
            </button>
          </div>

          {/* Tab content wrappers */}
          <div className="pt-6">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-stone-600 font-medium text-xs md:text-sm leading-relaxed max-w-4xl"
                >
                  <p>
                    The <strong>StepX AirLuxe Platinum</strong> was conceived under a simple design ambition: merge the sheer physical speed of our dynamic carbon propulsion plate with the luxury, glove-like cushioning required for ultra-endurance road races. 
                  </p>
                  <p>
                    Featuring premium liquid-chrome silver lateral support panels and a hand-selected, highly organic, supple full-grain white leather outer layer, it establishes a luxurious aesthetic presence that fits perfectly on casual weekends while delivering elite, competitive biomechanics. 
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="border-l-2 border-[#718200] pl-3 italic text-xs text-neutral-500">
                      "I wanted to build a sneaker that captures sunlight on track while floating you above continuous pavement friction." — Lead footwear bio-researcher
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "technology" && (
                <motion.div
                  key="technology-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
                    <div className="space-y-3">
                      <h4 className="font-display text-sm font-extrabold text-neutral-800 uppercase">Pressurized Multi-Chamber Air</h4>
                      <p>
                        Encapsulated underneath the carbon plate lies our signature pressure-activated gaseous cushion. Each chamber is hermetically sealed to custom specs, with heavier density cushioning on the outer heel to resist pronation and softer density on the inner core to absorb direct landing vibrations. 
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-display text-sm font-extrabold text-neutral-800 uppercase">Elastic Carbon Deflection Ratio</h4>
                      <p>
                        Our curved, full-length carbon plates are custom engineered. Upon foot impact, the plate compresses slightly into the air bag. As your strides transition towards the toes, the plate stores the deflection force and rebounds instantly, reducing muscle exhaustion over marathon distances.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-stone-105 last:border-none pb-4 last:pb-0 font-sans text-xs md:text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-stone-900 text-[#C8E600] flex items-center justify-center font-mono font-bold text-xs">
                            {rev.avatar}
                          </div>
                          <div>
                            <h5 className="font-black text-neutral-900">{rev.author}</h5>
                            <span className="font-mono text-[9px] text-[#718200] font-bold uppercase">{rev.role}</span>
                          </div>
                        </div>

                        <span className="font-mono text-[10px] text-stone-400 font-semibold">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2 pl-11">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-[#C8E600] text-[#C8E600]" />
                        ))}
                      </div>
                      <p className="text-stone-600 font-medium pl-11 max-w-3xl leading-relaxed">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Navigation Options to Back Out */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
          <div className="space-y-2 text-center sm:text-left max-w-md relative z-10">
            <h3 className="font-display text-lg font-black tracking-tight uppercase">
              NOT QUITE CONVINCED OF THE COMFORT?
            </h3>
            <p className="text-stone-400 text-xs font-mono">
              Explore our full premium catalog including the StepX Dynafit Volt and carbon stealth variants for distinct athletic workouts.
            </p>
          </div>

          <div className="flex gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              id="back-to-catalog-arrival"
              onClick={() => {
                onBackToHome();
                // Find catalog-sec and scroll to it smoothly
                setTimeout(() => {
                  const el = document.getElementById("catalog-sec");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 120);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-stone-800 bg-stone-950 text-white font-mono text-xs font-bold tracking-wider uppercase px-6 py-3.5 hover:bg-stone-900 cursor-pointer text-center"
            >
              BROWSE GENERAL GEAR
            </button>
            <button
              id="faq-sizing-arrival"
              onClick={onBackToHome}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-display text-xs font-extrabold tracking-widest uppercase px-6 py-3.5 hover:bg-[#C8E600] transition-colors cursor-pointer text-center"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
