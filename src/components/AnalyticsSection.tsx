/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Users, Leaf, ArrowUpRight, Zap, Target, BarChart3, Activity } from "lucide-react";

// Robust client-side animatable counter triggered when the block is scrolled into view
function ScrollAnimatedNumber({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [currentVal, setCurrentVal] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Quadratic ease-out formula
      const progress = step / totalSteps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current = Math.floor(easeProgress * end);

      setCurrentVal(current);

      if (step >= totalSteps) {
        setCurrentVal(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, hasAnimated]);

  // If we haven't animated yet but need to rerender for value switch
  useEffect(() => {
    if (hasAnimated) {
      // Retrigger with smooth ease on subsequent value changes
      let start = currentVal;
      const end = value;
      const totalSteps = 25;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const current = Math.floor(start + (end - start) * easeProgress);
        setCurrentVal(current);

        if (step >= totalSteps) {
          setCurrentVal(end);
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <span ref={elementRef} className="font-display tabular-nums tracking-tight">
      {prefix}
      {currentVal.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function AnalyticsSection() {
  const [selectedProductFilter, setSelectedProductFilter] = useState<"all" | "volt" | "stealth" | "kinetic">("all");
  const [timeframe, setTimeframe] = useState<"24h" | "30d" | "all-time">("all-time");

  // Multiplied data matrices matching product variants
  const analyticsData = {
    all: {
      sales: { "24h": 412000, "30d": 3890000, "all-time": 24842910 },
      units: { "24h": 2210, "30d": 21100, "all-time": 142504 },
      runners: { "24h": 12842, "30d": 54210, "all-time": 184802 },
      plastic: { "24h": 1250, "30d": 18240, "all-time": 42910 },
      revenueRate: "+18.3%",
      chartPoints: [35, 45, 40, 55, 50, 70, 68, 85, 92, 98]
    },
    volt: {
      sales: { "24h": 195000, "30d": 1940000, "all-time": 12840100 },
      units: { "24h": 1030, "30d": 10250, "all-time": 68512 },
      runners: { "24h": 7240, "30d": 31200, "all-time": 98410 },
      plastic: { "24h": 410, "30d": 6200, "all-time": 12400 },
      revenueRate: "+22.4%",
      chartPoints: [45, 52, 48, 62, 59, 78, 72, 89, 94, 99]
    },
    stealth: {
      sales: { "24h": 142000, "30d": 1250000, "all-time": 7650800 },
      units: { "24h": 860, "30d": 7570, "all-time": 46368 },
      runners: { "24h": 3612, "30d": 16400, "all-time": 58242 },
      plastic: { "24h": 580, "30d": 8410, "all-time": 21850 },
      revenueRate: "+14.8%",
      chartPoints: [28, 38, 35, 45, 42, 58, 55, 69, 78, 84]
    },
    kinetic: {
      sales: { "24h": 75000, "30d": 700000, "all-time": 4352010 },
      units: { "24h": 320, "30d": 3280, "all-time": 27624 },
      runners: { "24h": 1990, "30d": 6610, "all-time": 28150 },
      plastic: { "24h": 260, "30d": 3630, "all-time": 8660 },
      revenueRate: "+12.1%",
      chartPoints: [15, 25, 22, 34, 31, 48, 44, 58, 64, 72]
    }
  };

  const activeStats = analyticsData[selectedProductFilter];

  return (
    <section id="analytics-sec" className="relative w-full px-6 md:px-12 py-20 lg:py-28 bg-[#181816] text-white overflow-hidden border-t border-neutral-900">
      {/* Background abstract layout accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8E600]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute right-0 top-0 w-80 h-80 bg-neutral-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Title Block */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-[#C8E600] uppercase bg-[#C8E600]/10 py-1 px-3 rounded-full border border-[#C8E600]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8E600] animate-pulse" />
              LIVE TELEMETRY HUB
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight uppercase sm:text-4xl lg:text-5xl leading-none">
              GLOBAL IMPACT <br/><span className="text-stone-400">&amp; DEMAND TRACKING</span>
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Real-time telemetry and supply-chain metrics displaying distributed pairs, combined runner sessions, and recycled ocean cleanup metrics.
            </p>
          </div>

          {/* Interactive controls */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {/* Timeframe selector */}
            <div className="flex bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
              {(["24h", "30d", "all-time"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                    timeframe === t
                      ? "bg-[#C8E600] text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Model filters */}
            <div className="flex bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl overflow-x-auto max-w-full">
              {[
                { id: "all", label: "ALL LAB RELEASES" },
                { id: "volt", label: "VOLT DYNAFIT" },
                { id: "stealth", label: "STEALTH CARBON" },
                { id: "kinetic", label: "KINETIC ORANGE" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductFilter(p.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] whitespace-nowrap font-bold uppercase transition-all tracking-wider cursor-pointer ${
                    selectedProductFilter === p.id
                      ? "bg-[#C8E600] text-black shadow-sm"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Main Sales Stat Card - spans 7 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden group hover:border-[#C8E600]/30 transition-all duration-300"
          >
            {/* Top info and positive indicator */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-neutral-800 text-[#C8E600]">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                    GROSS DISTRIBUTED SALES
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#EDF5D8]/10 border border-[#C8E600]/20 rounded-full py-1 px-2.5 text-[#C8E600]">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider">{activeStats.revenueRate}</span>
              </div>
            </div>

            {/* Huge dynamic counting readout */}
            <div className="my-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display uppercase tracking-tight flex items-baseline gap-1.5">
                <ScrollAnimatedNumber
                  value={activeStats.sales[timeframe]}
                  prefix="PKR "
                  duration={1.2}
                />
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-2">
                Aggregate gross trade volume driven by international performance demands.
              </p>
            </div>

            {/* Custom SVG line-chart depicting positive trend with beautiful animations */}
            <div className="h-28 w-full mt-4 relative overflow-hidden bg-neutral-950/40 rounded-2xl border border-zinc-800/30 p-2 flex items-end">
              <svg className="w-full h-full max-h-[80px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8E600" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#C8E600" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Visual Area path with viewport trigger */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  d={`M 0,100 ${activeStats.chartPoints.map((val, idx) => `L ${(idx / 9) * 100},${100 - val}`).join(" ")} L 100,100 Z`}
                  fill="url(#chartGradient)"
                />
                {/* Neon lime trendline */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  d={activeStats.chartPoints.map((val, idx) => `${idx === 0 ? "M" : "L"} ${(idx / 9) * 100},${100 - val}`).join(" ")}
                  fill="none"
                  stroke="#C8E600"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Chart floating coordinate guidelines */}
              <div className="absolute bottom-2 left-3 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                T-MINUS 10 PERIODS
              </div>
              <div className="absolute top-2 right-3 font-mono text-[8px] text-[#C8E600] uppercase tracking-widest font-extrabold">
                PEAK EFFICIENCY
              </div>
            </div>
          </motion.div>

          {/* Secondary Stats Group Card - spans 5 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-between bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md hover:border-[#C8E600]/30 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-neutral-800 text-[#C8E600]">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                  UNITS DELIVERED
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight flex items-baseline">
                  <ScrollAnimatedNumber
                    value={activeStats.units[timeframe]}
                    suffix=" PAIRS"
                    duration={1.2}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal mt-1.5">
                  High-performance footwear systems delivered worldwide through carbon-neutral routing.
                </p>
              </div>
            </div>

            {/* Symmetrical divider line */}
            <div className="border-t border-zinc-800/60 my-6" />

            {/* Lower quadrant tracker */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
                <span className="text-zinc-500 uppercase">SATISFACTION RATE</span>
                <span className="text-[#C8E600] font-black">99.4% PERFECT</span>
              </div>
              <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "99.4%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="bg-[#C8E600] h-full rounded-full"
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                <span>0.6% RETURNED</span>
                <span>GLOBAL TARGET ACQUIRED</span>
              </div>
            </div>
          </motion.div>

          {/* Active Runners Connected Live Card - spans 6 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-between bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md hover:border-[#C8E600]/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-neutral-800 text-[#C8E600]">
                  <Users className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                  ACTIVE RUNNERS TRACKED
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#C8E600] animate-ping" />
            </div>

            <div className="my-6">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
                <ScrollAnimatedNumber
                  value={activeStats.runners[timeframe]}
                  suffix=" RUNNERS"
                  duration={1.2}
                />
              </div>
              <p className="text-xs text-zinc-400 leading-normal mt-2">
                Verified athletic sessions synchronizing stride count, propulsion angles, and shock-reduction telemetry dynamically.
              </p>
            </div>

            {/* Core telemetry details mapping */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-950/50 p-4 rounded-xl border border-zinc-800/40">
              <div>
                <span className="block font-mono text-[9px] text-zinc-500 uppercase">SYS STABILITY</span>
                <span className="font-display font-black text-sm text-white">99.98%</span>
              </div>
              <div>
                <span className="block font-mono text-[9px] text-zinc-500 uppercase">LATENCY INDEX</span>
                <span className="font-display font-black text-sm text-[#C8E600]">4.2ms</span>
              </div>
            </div>
          </motion.div>

          {/* Eco-Carbon Offset Card - spans 6 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md hover:border-[#C8E600]/30 transition-all duration-300 animate-slide-up"
          >
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-neutral-800 text-[#C8E600]">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                OCEAN-BOUND PLASTICS UPCYCLE INDEX
              </span>
            </div>

            <div className="my-6">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
                <ScrollAnimatedNumber
                  value={activeStats.plastic[timeframe]}
                  suffix=" LBS"
                  duration={1.2}
                />
              </div>
              <p className="text-xs text-zinc-400 leading-normal mt-2">
                Certified pounds of marine plastics, fishnets, and structural trash reclaimed and spun into high-tenacity resilient Flyknit fibers.
              </p>
            </div>

            {/* Progress indicators depicting recycled contents */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                <span>RECYCLED FIBER MIX RATE</span>
                <span className="text-white font-bold">{selectedProductFilter === "all" ? "38%" : selectedProductFilter === "volt" ? "42%" : selectedProductFilter === "stealth" ? "35%" : "28%"} CO-MATRIX</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: selectedProductFilter === "all" ? "38%" : selectedProductFilter === "volt" ? "42%" : selectedProductFilter === "stealth" ? "35%" : "28%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-emerald-500 h-full rounded-full"
                />
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
