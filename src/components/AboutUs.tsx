/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Zap, Cpu, Leaf, Milestone, Target, Trophy, ArrowRight, Activity, Smile } from "lucide-react";

interface AboutUsProps {
  onBackToHome: () => void;
  onExploreCatalog: () => void;
}

export default function AboutUs({ onBackToHome, onExploreCatalog }: AboutUsProps) {
  // Hardcoded premium assets or highly aesthetic placeholders
  const teamMembers = [
    {
      name: "Dr. Alistair Vance",
      role: "Director of Biomechanics Lab",
      bio: "Former Olympic sprinter researcher, specialist in carbon-plate energy deflection systems.",
      initials: "AV"
    },
    {
      name: "Sienna Moretti",
      role: "Lead Materials Innovator",
      bio: "Pioneered the bio-foam circular lifecycle matrix used in StepX-01 cushioning.",
      initials: "SM"
    },
    {
      name: "Marcus Thorne",
      role: "Head of Kinetic Aesthetics",
      bio: "Believes aerodynamics and visual speed are inseparable. Form follows lightning.",
      initials: "MT"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Kinetic Genesis",
      description: "StepX Labs founded with a single mission: to optimize energy return using aerospace compound calculations rather than commercial retail standards."
    },
    {
      year: "2025",
      title: "The Aero-Plated Breakthrough",
      description: "Validated the 'Debris-24' carbon propulsion system, achieving standard energy feedback increases of up to 4.2% in controlled athletic stress trials."
    },
    {
      year: "2026",
      title: "Zero Gravity Foam Standard",
      description: "Transitioned 100% of our premium tooling lines to bio-derived foams, creating performance products that protect both the race route and the athlete."
    }
  ];

  return (
    <motion.div
      id="about-us-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#F7F7F5] min-h-screen pt-8 pb-20 px-6 md:px-12 selection:bg-black selection:text-[#C8E600]"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Navigation Breadcrumb Tracker */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          <button
            id="about-back-breadcrumb"
            onClick={onBackToHome}
            className="hover:text-black transition-colors cursor-pointer"
          >
            HOME
          </button>
          <span>/</span>
          <span className="text-black">THE LAB CHRONICLES (ABOUT US)</span>
        </div>

        {/* Brand Anthem Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-[#718200] uppercase shadow-2xs">
              <Activity className="h-3.5 w-3.5 animate-pulse text-[#C8E600]" />
              STEPX LABS RESEARCH PHILOSOPHY
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-neutral-900 leading-none">
              SPEED IS A <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-[#718200]">
                BIOMECHANICAL TRUTH.
              </span>
            </h1>
            <p className="text-stone-600 text-base md:text-lg font-medium leading-relaxed max-w-xl">
              At StepX, we do not design lifestyle sneakers for idle pavements. We construct kinetic propulsion frames. Born in a subterranean testing lab, we fuse custom carbon-composite tension matrices with bio-derived high-elasticity foams. No marketing fluff, no excessive padding—just calculated kinetic efficiency.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                id="about-explore-catalog-btn"
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-800 px-6 py-3.5 text-xs font-bold text-white tracking-widest uppercase shadow-md transition-all hover:scale-[1.02] cursor-pointer font-display"
              >
                EXPLORE RESEARCH GEAR
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="about-return-home-btn"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-stone-200 hover:border-black px-6 py-3.5 text-xs font-bold text-stone-700 hover:text-black tracking-widest uppercase shadow-xs transition-all cursor-pointer font-display"
              >
                RETURN TO PREVIEW
              </button>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1.5 rounded-3xl bg-neutral-900/5 blur-xl pointer-events-none" />
            <div className="relative rounded-2xl border border-stone-200 bg-white p-8 shadow-sm overflow-hidden flex flex-col justify-between min-h-[350px]">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                  MODEL OVERVIEW ID: SX-LAB
                </span>
                <span className="font-mono text-xs font-bold text-[#718200] bg-[#EDF5D8] px-2.5 py-1 rounded-full animate-bounce">
                  STRESS VALIDATED
                </span>
              </div>

              <div className="my-8">
                <p className="font-display text-xs font-black tracking-widest text-neutral-400 uppercase">
                  OUR CONVICTION
                </p>
                <p className="font-display text-2xl font-black text-neutral-900 italic tracking-tight mt-1 leading-snug">
                  "If we cannot biomechanically double the performance return, we scrap the design entirely."
                </p>
              </div>

              <div className="border-t border-stone-100 pt-4 flex justify-between items-center text-xs font-mono font-bold text-neutral-500">
                <span>RECOIL MATRIX v3.0</span>
                <span className="text-black">100% LABORATORY AUTHENTIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Three Pillars Grid */}
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <p className="font-mono text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              THE HARD SCIENCE
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-neutral-900 tracking-tight uppercase mt-1">
              THE THREE CORE SCIENTIFIC CORNERSTONES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-neutral-900 text-[#C8E600] flex items-center justify-center">
                  <Zap className="h-6 w-6 stroke-1.8" />
                </div>
                <h3 className="font-display text-lg font-black text-neutral-900 tracking-tight uppercase">
                  Kinetic Propulsion
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed font-mono">
                  Advanced multi-axial carbon plates flex on heel impact, delivering an active springboard effect to optimize toe-off vertical thrust and step economy.
                </p>
              </div>
              <span className="font-mono text-[9px] font-bold text-[#718200]">STEPX RESEARCH SECTOR A1</span>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-neutral-900 text-[#C8E600] flex items-center justify-center">
                  <Cpu className="h-6 w-6 stroke-1.8" />
                </div>
                <h3 className="font-display text-lg font-black text-neutral-900 tracking-tight uppercase">
                  Biomechanical Dampening
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed font-mono">
                  Custom engineered bio-foams that instantly absorb vertical shock pressure up to 250kg before shifting back into an elastic rebound state.
                </p>
              </div>
              <span className="font-mono text-[9px] font-bold text-[#718200]">STEPX RESEARCH SECTOR B4</span>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-neutral-900 text-[#C8E600] flex items-center justify-center">
                  <Leaf className="h-6 w-6 stroke-1.8" />
                </div>
                <h3 className="font-display text-lg font-black text-neutral-900 tracking-tight uppercase">
                  Eco-Circular Materiality
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed font-mono">
                  We formulate our weaves using strictly post-consumer recycled ocean plastics and organic binding agents, preserving wild running streams.
                </p>
              </div>
              <span className="font-mono text-[9px] font-bold text-[#718200]">STEPX RESEARCH SECTOR C9</span>
            </div>
          </div>
        </div>

        {/* Historical Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            <span className="font-mono text-[9px] font-bold text-neutral-400 bg-neutral-200/60 px-2.5 py-1 rounded">
              OUR HISTORIC PATHWAY
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-neutral-900 tracking-tight uppercase">
              THE MILESTONE LOGS
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto lg:mx-0 font-medium">
              We look back only to calculate trajectories. Trace the timeline of the development that led to the standard-shattering StepX-01.
            </p>
          </div>
          
          <div className="lg:col-span-8 space-y-8 relative before:absolute before:left-4 md:before:left-1/2 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
            {milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-start md:justify-between">
                  {/* Circle Pin */}
                  <div className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 top-4 h-3 w-3 rounded-full bg-[#C8E600] border-2 border-black z-10" />

                  {/* Left block */}
                  <div className={`pl-10 md:pl-0 md:w-[45%] ${isEven ? "md:text-right" : "md:order-2 md:text-left"}`}>
                    <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-3xs space-y-2">
                      <span className="font-mono text-xs font-black text-stone-400 block">
                        {milestone.year}
                      </span>
                      <h4 className="font-display text-sm font-black text-neutral-900 uppercase">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed font-mono">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Invisible spacer for beautiful alignment */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Aesthetic Stats Dashboard Banner */}
        <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Subtle design grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="block text-4xl md:text-5xl font-extrabold font-mono text-[#C8E600] tracking-tight">
                24+
              </span>
              <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                Stress Prototypes
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-4xl md:text-5xl font-extrabold font-mono text-[#C8E600] tracking-tight">
                140K+
              </span>
              <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                Kilometers Traveled
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-4xl md:text-5xl font-extrabold font-mono text-[#C8E600] tracking-tight">
                4.2%
              </span>
              <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                Propulsive Turn Increase
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-4xl md:text-5xl font-extrabold font-mono text-[#C8E600] tracking-tight">
                100%
              </span>
              <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                Recyclable Packaging
              </span>
            </div>
          </div>
        </div>

        {/* The Scientific Team */}
        <div className="space-y-8">
          <div className="text-center">
            <span className="font-mono text-[9px] font-bold text-neutral-400 bg-neutral-200/60 px-2.5 py-1 rounded">
              THE SYSTEM CO-DEVELOPERS
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-neutral-900 tracking-tight uppercase mt-2">
              KINETIC ARCHITECTS
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Meet the minds turning mechanical stress tests into beautiful racing milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white border border-stone-200/80 rounded-2xl p-6 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-stone-100 text-[#718200] flex items-center justify-center font-mono font-bold text-sm border border-stone-200 mx-auto">
                  {member.initials}
                </div>
                <div>
                  <h4 className="font-display text-sm font-black text-neutral-900 uppercase">
                    {member.name}
                  </h4>
                  <p className="font-mono text-[9px] text-[#718200] font-bold mt-0.5">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed max-w-[240px] mx-auto font-medium">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive FAQ / Trust element */}
        <div className="bg-stone-100/60 rounded-3xl border border-stone-200/50 p-8 text-center max-w-2xl mx-auto space-y-4">
          <Trophy className="h-8 w-8 text-[#718200] mx-auto animate-pulse" />
          <h3 className="font-display text-xl font-black text-neutral-900 uppercase tracking-tight">
            RUN SAFELY ON THE HIGHEST CALIBER GEAR
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            Each pair is individually backed by our 30-Day Trailblazer stress guarantee. If you don't feel a calculated elevation in running efficiency, return them with zero friction.
          </p>
          <div className="pt-2">
            <button
              id="about-bottom-catalog-btn"
              onClick={onExploreCatalog}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-80 transition-opacity pb-0.5 cursor-pointer"
            >
              BROWSE FLIGHTS MODULES <ArrowRight className="h-3.5 w-3.5 inline" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
